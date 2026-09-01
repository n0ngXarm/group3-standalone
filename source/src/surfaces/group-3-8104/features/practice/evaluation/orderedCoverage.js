function characters(value) {
  return Array.from(String(value ?? ""));
}

export function calculateOrderedCoverage(referenceValue, transcriptValue) {
  const reference = characters(referenceValue);
  const transcript = characters(transcriptValue);
  const matrix = Array.from(
    { length: reference.length + 1 },
    () => Array(transcript.length + 1).fill(0),
  );

  for (let row = 1; row <= reference.length; row += 1) {
    for (let column = 1; column <= transcript.length; column += 1) {
      matrix[row][column] = reference[row - 1] === transcript[column - 1]
        ? matrix[row - 1][column - 1] + 1
        : Math.max(matrix[row - 1][column], matrix[row][column - 1]);
    }
  }

  const reversedMatches = [];
  let row = reference.length;
  let column = transcript.length;
  while (row > 0 && column > 0) {
    if (reference[row - 1] === transcript[column - 1]) {
      reversedMatches.push({
        character: reference[row - 1],
        referenceIndex: row - 1,
        transcriptIndex: column - 1,
      });
      row -= 1;
      column -= 1;
    } else if (matrix[row - 1][column] >= matrix[row][column - 1]) {
      row -= 1;
    } else {
      column -= 1;
    }
  }

  const lcsLength = matrix[reference.length][transcript.length];
  const coverage = reference.length === 0
    ? transcript.length === 0 ? 1 : 0
    : lcsLength / reference.length;
  return { coverage, lcsLength, matches: reversedMatches.reverse() };
}
