import { buildCharacterEvidence, calculateCharacterErrorRate } from "./characterDistance.js";
import { normalizeChineseTranscript } from "./normalizeTranscript.js";
import { calculateOrderedCoverage } from "./orderedCoverage.js";
import { scoreRepeatMetrics } from "./repeatScore.js";
import { PRACTICE_ERROR_CODES, practiceError } from "../errors.js";

const finiteNonNegative = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? Math.max(0, number) : 0;
};

const rounded = (value, digits = 4) => Number(value.toFixed(digits));

export function deriveRepeatTimingMetrics({
  endedAt,
  responseWindowMs,
  silenceMs,
  speechMs,
  startedAt,
  transcriptLength,
} = {}) {
  const safeSpeechMs = finiteNonNegative(speechMs);
  const safeSilenceMs = finiteNonNegative(silenceMs);
  const safeWindowMs = finiteNonNegative(responseWindowMs);
  const hasTimestamps = Number.isFinite(Number(startedAt)) && Number.isFinite(Number(endedAt));
  const durationMs = hasTimestamps
    ? Math.max(0, Number(endedAt) - Number(startedAt))
    : safeSpeechMs + safeSilenceMs;
  const observedAudioMs = safeSpeechMs + safeSilenceMs;
  const silenceRatio = observedAudioMs > 0 ? safeSilenceMs / observedAudioMs : 0;
  const responseUtilization = safeWindowMs > 0 ? Math.min(1, durationMs / safeWindowMs) : 0;
  const timedOut = safeWindowMs > 0 && durationMs > safeWindowMs;
  const windowCompliance = safeWindowMs > 0
    ? Math.max(0, 1 - (Math.max(0, durationMs - safeWindowMs) / safeWindowMs))
    : 0;
  const speakingRateCpm = safeSpeechMs > 0
    ? (finiteNonNegative(transcriptLength) * 60000) / safeSpeechMs
    : 0;
  const timingScore = safeSpeechMs > 0
    ? ((windowCompliance * 0.5) + ((1 - silenceRatio) * 0.5)) * 100
    : 0;
  return {
    durationMs,
    responseUtilization: rounded(responseUtilization),
    silenceRatio: rounded(silenceRatio),
    speakingRateCpm: rounded(speakingRateCpm),
    timedOut,
    timingScore: rounded(timingScore),
    windowCompliance: rounded(windowCompliance),
  };
}

export function evaluateRepeatSentence({ target, transcript, timing = {} } = {}) {
  const normalizedTarget = normalizeChineseTranscript(target);
  const normalizedTranscript = normalizeChineseTranscript(transcript);
  if (!normalizedTarget) {
    return {
      error: practiceError(PRACTICE_ERROR_CODES.INVALID_TARGET),
      ok: false,
      score: 0,
      status: "retry",
    };
  }

  const characterError = calculateCharacterErrorRate(normalizedTarget, normalizedTranscript);
  const orderedCoverage = calculateOrderedCoverage(normalizedTarget, normalizedTranscript);
  const evidence = buildCharacterEvidence(normalizedTarget, normalizedTranscript);
  const transcriptLength = Array.from(normalizedTranscript).length;
  const transcriptAccuracy = transcriptLength > 0 ? evidence.matched.length / transcriptLength : 0;
  const timingMetrics = deriveRepeatTimingMetrics({ ...timing, transcriptLength });

  if (!normalizedTranscript) {
    return {
      characterError,
      error: practiceError(PRACTICE_ERROR_CODES.NO_SPEECH),
      evidence,
      metrics: {
        completion: 0,
        ...timingMetrics,
        transcriptAccuracy: 0,
      },
      normalizedTarget,
      normalizedTranscript,
      ok: true,
      policyVersion: "repeat-score-v1",
      score: 0,
      status: "retry",
    };
  }

  const scoreResult = scoreRepeatMetrics({
    completion: orderedCoverage.coverage,
    timedOut: timingMetrics.timedOut,
    timingScore: timingMetrics.timingScore,
    transcriptAccuracy,
  });
  return {
    characterError,
    error: null,
    evidence,
    metrics: {
      completion: orderedCoverage.coverage,
      ...timingMetrics,
      transcriptAccuracy,
    },
    normalizedTarget,
    normalizedTranscript,
    ok: true,
    orderedCoverage,
    ...scoreResult,
  };
}
