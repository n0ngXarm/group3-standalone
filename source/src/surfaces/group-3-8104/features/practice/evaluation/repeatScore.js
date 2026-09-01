const clampUnit = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? Math.min(1, Math.max(0, number)) : 0;
};

const clampScore = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? Math.min(100, Math.max(0, number)) : 0;
};

export const REPEAT_SCORE_POLICY_V1 = Object.freeze({
  correct: Object.freeze({ minimumAccuracy: 0.9, minimumCompletion: 0.9, minimumScore: 85 }),
  close: Object.freeze({ minimumAccuracy: 0.6, minimumCompletion: 0.6, minimumScore: 60 }),
  severeFailure: Object.freeze({ minimumAccuracy: 0.5, minimumCompletion: 0.5, scoreCap: 49 }),
  version: "repeat-score-v1",
  weights: Object.freeze({ completion: 0.4, timing: 0.2, transcriptAccuracy: 0.4 }),
});

export function classifyRepeatResult({ completion, score, timedOut, transcriptAccuracy }) {
  const policy = REPEAT_SCORE_POLICY_V1;
  if (
    !timedOut
    && score >= policy.correct.minimumScore
    && transcriptAccuracy >= policy.correct.minimumAccuracy
    && completion >= policy.correct.minimumCompletion
  ) return "correct";
  if (
    score >= policy.close.minimumScore
    && transcriptAccuracy >= policy.close.minimumAccuracy
    && completion >= policy.close.minimumCompletion
  ) return "close";
  return "retry";
}

export function scoreRepeatMetrics({ completion, timedOut = false, timingScore, transcriptAccuracy }) {
  const policy = REPEAT_SCORE_POLICY_V1;
  const safeAccuracy = clampUnit(transcriptAccuracy);
  const safeCompletion = clampUnit(completion);
  const safeTiming = clampScore(timingScore);
  const transcriptAccuracyScore = safeAccuracy * 100;
  const completionScore = safeCompletion * 100;
  let score = Math.round(
    (transcriptAccuracyScore * policy.weights.transcriptAccuracy)
    + (completionScore * policy.weights.completion)
    + (safeTiming * policy.weights.timing),
  );
  if (
    safeAccuracy < policy.severeFailure.minimumAccuracy
    || safeCompletion < policy.severeFailure.minimumCompletion
  ) score = Math.min(score, policy.severeFailure.scoreCap);
  score = clampScore(score);
  return {
    completionScore,
    policyVersion: policy.version,
    score,
    status: classifyRepeatResult({
      completion: safeCompletion,
      score,
      timedOut: Boolean(timedOut),
      transcriptAccuracy: safeAccuracy,
    }),
    timingScore: safeTiming,
    transcriptAccuracyScore,
  };
}
