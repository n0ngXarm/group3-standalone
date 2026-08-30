const IMAGE_DESCRIPTION = "image-description";

export function initialFreeSpeakingPhase(exerciseType) {
  return exerciseType === IMAGE_DESCRIPTION ? "observe" : "ready";
}

export function prepareFreeSpeakingPhase(exerciseType, phase) {
  return exerciseType === IMAGE_DESCRIPTION && phase === "observe" ? "prepare" : phase;
}

export function canStartFreeSpeakingRecording(exerciseType, phase) {
  return phase === (exerciseType === IMAGE_DESCRIPTION ? "prepare" : "ready");
}

export function canSubmitFreeSpeaking(phase) {
  return phase === "review";
}

export function nextFreeSpeakingPrompt({ exerciseType, index, total }) {
  const safeIndex = Math.max(0, Number(index) || 0);
  const safeTotal = Math.max(1, Number(total) || 1);
  return safeIndex >= safeTotal - 1
    ? { index: safeIndex, phase: "completed" }
    : { index: safeIndex + 1, phase: initialFreeSpeakingPhase(exerciseType) };
}

export function buildImageDescriptionFeedback(result) {
  if (!result || result.status === "self-review") {
    return {
      improvement: { key: "selfReview" },
      metrics: [],
      positive: { key: "recordingComplete", count: 0 },
      score: null,
      scored: false,
    };
  }

  const mentionedCount = Array.isArray(result.mentionedConceptIds) ? result.mentionedConceptIds.length : 0;
  const recommendedTerms = Array.isArray(result.recommendedTerms) ? result.recommendedTerms : [];
  return {
    improvement: recommendedTerms.length
      ? { key: "recommendedTerms", terms: recommendedTerms.slice(0, 3) }
      : { key: "expandDescription" },
    metrics: [
      { key: "keywordCoverage", value: Number(result.metrics?.keywordCoverage) || 0 },
      { key: "speechContentAmount", value: Number(result.metrics?.chineseCharacterCount) || 0 },
      { key: "responseDuration", value: Number(result.metrics?.responseDurationSeconds) || 0 },
    ],
    positive: mentionedCount
      ? { key: "conceptCoverage", count: mentionedCount }
      : { key: "recordingComplete", count: 0 },
    score: Number.isFinite(Number(result.baselineScore)) ? Number(result.baselineScore) : 0,
    scored: true,
    source: result,
  };
}
