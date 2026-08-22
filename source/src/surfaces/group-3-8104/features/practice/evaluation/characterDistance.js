function characters(value) {
  return Array.from(String(value ?? ""));
}

function buildDistanceMatrix(reference, transcript) {
  const rows = reference.length + 1;
  const columns = transcript.length + 1;
  const matrix = Array.from({ length: rows }, () => Array(columns).fill(0));
  for (let row = 0; row < rows; row += 1) matrix[row][0] = row;
  for (let column = 0; column < columns; column += 1) matrix[0][column] = column;

  for (let row = 1; row < rows; row += 1) {
    for (let column = 1; column < columns; column += 1) {
      const substitutionCost = reference[row - 1] === transcript[column - 1] ? 0 : 1;
      matrix[row][column] = Math.min(
        matrix[row - 1][column - 1] + substitutionCost,
        matrix[row - 1][column] + 1,
        matrix[row][column - 1] + 1,
      );
    }
  }
  return matrix;
}

function alignCharacters(reference, transcript, matrix) {
  const reversed = [];
  let row = reference.length;
  let column = transcript.length;

  while (row > 0 || column > 0) {
    if (
      row > 0
      && column > 0
      && reference[row - 1] === transcript[column - 1]
      && matrix[row][column] === matrix[row - 1][column - 1]
    ) {
      reversed.push({
        operation: "match",
        referenceCharacter: reference[row - 1],
        referenceIndex: row - 1,
        transcriptCharacter: transcript[column - 1],
        transcriptIndex: column - 1,
      });
      row -= 1;
      column -= 1;
      continue;
    }

    // Prefer a trailing insertion/deletion over turning a nearby replacement
    // into a less useful substitution. The edit distance is unchanged, while
    // the evidence remains stable and easier for feedback consumers to render.
    if (column > 0 && matrix[row][column] === matrix[row][column - 1] + 1) {
      reversed.push({
        operation: "insert",
        referenceCharacter: null,
        referenceIndex: row,
        transcriptCharacter: transcript[column - 1],
        transcriptIndex: column - 1,
      });
      column -= 1;
      continue;
    }

    if (row > 0 && matrix[row][column] === matrix[row - 1][column] + 1) {
      reversed.push({
        operation: "delete",
        referenceCharacter: reference[row - 1],
        referenceIndex: row - 1,
        transcriptCharacter: null,
        transcriptIndex: column,
      });
      row -= 1;
      continue;
    }

    if (row > 0 && column > 0 && matrix[row][column] === matrix[row - 1][column - 1] + 1) {
      reversed.push({
        operation: "substitute",
        referenceCharacter: reference[row - 1],
        referenceIndex: row - 1,
        transcriptCharacter: transcript[column - 1],
        transcriptIndex: column - 1,
      });
      row -= 1;
      column -= 1;
      continue;
    }

    throw new Error("Unable to reconstruct character alignment");
  }

  return reversed.reverse();
}

export function calculateCharacterErrorRate(referenceValue, transcriptValue) {
  const reference = characters(referenceValue);
  const transcript = characters(transcriptValue);
  const matrix = buildDistanceMatrix(reference, transcript);
  const alignment = alignCharacters(reference, transcript, matrix);
  const distance = matrix[reference.length][transcript.length];
  const counts = alignment.reduce((result, item) => {
    if (item.operation === "substitute") result.substitutions += 1;
    if (item.operation === "delete") result.deletions += 1;
    if (item.operation === "insert") result.insertions += 1;
    return result;
  }, { substitutions: 0, deletions: 0, insertions: 0 });
  const cer = reference.length === 0
    ? transcript.length === 0 ? 0 : 1
    : distance / reference.length;

  return {
    alignment,
    cer,
    deletions: counts.deletions,
    distance,
    insertions: counts.insertions,
    referenceLength: reference.length,
    substitutions: counts.substitutions,
  };
}

export function buildCharacterEvidence(reference, transcript) {
  const { alignment } = calculateCharacterErrorRate(reference, transcript);
  return alignment.reduce((evidence, item) => {
    if (item.operation === "match") {
      evidence.matched.push({
        character: item.referenceCharacter,
        referenceIndex: item.referenceIndex,
        transcriptIndex: item.transcriptIndex,
      });
    } else if (item.operation === "delete") {
      evidence.missing.push({ character: item.referenceCharacter, referenceIndex: item.referenceIndex });
    } else if (item.operation === "insert") {
      evidence.extra.push({ character: item.transcriptCharacter, transcriptIndex: item.transcriptIndex });
    } else {
      evidence.substituted.push({
        actual: item.transcriptCharacter,
        expected: item.referenceCharacter,
        referenceIndex: item.referenceIndex,
        transcriptIndex: item.transcriptIndex,
      });
    }
    return evidence;
  }, { matched: [], missing: [], extra: [], substituted: [] });
}
