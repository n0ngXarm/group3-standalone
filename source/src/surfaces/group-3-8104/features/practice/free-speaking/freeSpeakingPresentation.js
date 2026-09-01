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
      positive: null,
      score: null,
      scored: false,
    };
  }

  const mentionedCount = Array.isArray(result.mentionedConceptIds) ? result.mentionedConceptIds.length : 0;
  const charCount = Number(result.metrics?.chineseCharacterCount) || 0;
  const speechDetected = Boolean(result.metrics?.speechDetected) && charCount > 0;
  const recommendedTerms = Array.isArray(result.recommendedTerms) ? result.recommendedTerms : [];

  let positive = null;
  if (mentionedCount > 0) {
    positive = { key: "conceptCoverage", count: mentionedCount };
  } else if (speechDetected) {
    positive = { key: "recordingComplete", count: charCount };
  } else {
    positive = null;
  }

  let improvement = null;
  if (!speechDetected) {
    improvement = { key: "noSpeechTip" };
  } else if (recommendedTerms.length) {
    improvement = { key: "recommendedTerms", terms: recommendedTerms.slice(0, 3) };
  } else {
    improvement = { key: "expandDescription" };
  }

  return {
    improvement,
    metrics: [
      { key: "keywordCoverage", value: Number(result.metrics?.keywordCoverage) || 0 },
      { key: "speechContentAmount", value: charCount },
      { key: "responseDuration", value: Number(result.metrics?.responseDurationSeconds) || 0 },
    ],
    positive,
    score: Number.isFinite(Number(result.baselineScore)) ? Number(result.baselineScore) : 0,
    scored: true,
    speechDetected,
    source: result,
  };
}
