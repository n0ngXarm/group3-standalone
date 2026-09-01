import { normalizeChineseTranscript } from "./normalizeTranscript.js";

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, Number.isFinite(Number(value)) ? Number(value) : 0));
const round = (value, digits = 4) => Number(value.toFixed(digits));

function chineseCharacters(text) {
  return String(text || "").match(/\p{Script=Han}/gu) || [];
}

function validConcepts(expectedConcepts) {
  return (Array.isArray(expectedConcepts) ? expectedConcepts : []).map((concept, index) => ({
    id: String(concept?.id || `concept-${index + 1}`),
    terms: (Array.isArray(concept?.terms) ? concept.terms : [])
      .map(normalizeChineseTranscript)
      .filter(Boolean),
  })).filter((concept) => concept.terms.length > 0);
}

export function evaluateFreeSpeakingResponse({ durationMs = 0, expectedConcepts = [], transcript = "" } = {}) {
  const normalizedTranscript = normalizeChineseTranscript(transcript);
  const characters = chineseCharacters(normalizedTranscript);
  const uniqueCharacterCount = new Set(characters).size;
  const concepts = validConcepts(expectedConcepts);
  const mentioned = concepts.filter((concept) => concept.terms.some((term) => normalizedTranscript.includes(term)));
  const missing = concepts.filter((concept) => !mentioned.includes(concept));
  const speechDetected = characters.length > 0;
  const keywordCoverage = concepts.length ? mentioned.length / concepts.length : 0;
  const durationSeconds = Math.max(0, Number(durationMs) || 0) / 1000;

  const baselineScore = speechDetected ? round(
    (20)
    + (clamp(characters.length / 12) * 25)
    + (keywordCoverage * 30)
    + (clamp(uniqueCharacterCount / 10) * 15)
    + (clamp(durationSeconds / 45) * 10),
    1,
  ) : 0;
  const status = !speechDetected
    ? "incomplete"
    : characters.length >= 6 && baselineScore >= 60 ? "complete" : "partial";

  return {
    baselineScore,
    mentionedConceptIds: mentioned.map((concept) => concept.id),
    metrics: {
      chineseCharacterCount: characters.length,
      distinctChineseCharacterCount: uniqueCharacterCount,
      keywordCoverage: round(keywordCoverage),
      responseDurationSeconds: round(durationSeconds, 1),
      speechDetected,
    },
    normalizedTranscript,
    recommendedTerms: missing.map((concept) => concept.terms[0]),
    status,
  };
}
