import assert from "node:assert/strict";
import test from "node:test";

const modulePath = "../../src/surfaces/group-3-8104/features/practice/free-speaking/freeSpeakingPresentation.js";

test("Image Description uses one ordered phase path while Question Response keeps its ready start", async () => {
  const {
    canStartFreeSpeakingRecording,
    initialFreeSpeakingPhase,
    prepareFreeSpeakingPhase,
  } = await import(modulePath);

  assert.equal(initialFreeSpeakingPhase("image-description"), "observe");
  assert.equal(prepareFreeSpeakingPhase("image-description", "observe"), "prepare");
  assert.equal(canStartFreeSpeakingRecording("image-description", "observe"), false);
  assert.equal(canStartFreeSpeakingRecording("image-description", "prepare"), true);

  assert.equal(initialFreeSpeakingPhase("question-response"), "ready");
  assert.equal(prepareFreeSpeakingPhase("question-response", "ready"), "ready");
  assert.equal(canStartFreeSpeakingRecording("question-response", "ready"), true);
});

test("Image Description retry stays on its item and next advances once before completion", async () => {
  const {
    initialFreeSpeakingPhase,
    nextFreeSpeakingPrompt,
  } = await import(modulePath);

  assert.equal(initialFreeSpeakingPhase("image-description"), "observe");
  assert.deepEqual(nextFreeSpeakingPrompt({ exerciseType: "image-description", index: 0, total: 2 }), {
    index: 1,
    phase: "observe",
  });
  assert.deepEqual(nextFreeSpeakingPrompt({ exerciseType: "image-description", index: 1, total: 2 }), {
    index: 1,
    phase: "completed",
  });

  assert.deepEqual(nextFreeSpeakingPrompt({ exerciseType: "question-response", index: 0, total: 2 }), {
    index: 1,
    phase: "ready",
  });
});

test("Image feedback exposes only honest compact metrics and keeps analysis details optional", async () => {
  const { buildImageDescriptionFeedback } = await import(modulePath);
  const feedback = buildImageDescriptionFeedback({
    baselineScore: 78,
    mentionedConceptIds: ["person", "place"],
    metrics: {
      chineseCharacterCount: 14,
      keywordCoverage: 0.67,
      responseDurationSeconds: 21.4,
      speechDetected: true,
    },
    recommendedTerms: ["旁边", "前面"],
    status: "complete",
  });

  assert.equal(feedback.score, 78);
  assert.equal(feedback.scored, true);
  assert.deepEqual(feedback.metrics, [
    { key: "keywordCoverage", value: 0.67 },
    { key: "speechContentAmount", value: 14 },
    { key: "responseDuration", value: 21.4 },
  ]);
  assert.deepEqual(feedback.positive, { key: "conceptCoverage", count: 2 });
  assert.deepEqual(feedback.improvement, { key: "recommendedTerms", terms: ["旁边", "前面"] });
  assert.equal(Object.hasOwn(feedback, "pronunciation"), false);
  assert.equal(Object.hasOwn(feedback, "transcript"), false);
});

test("ASR fallback stays unscored and duplicate submission is rejected outside review", async () => {
  const {
    buildImageDescriptionFeedback,
    canSubmitFreeSpeaking,
  } = await import(modulePath);

  assert.equal(canSubmitFreeSpeaking("review"), true);
  assert.equal(canSubmitFreeSpeaking("result"), false);
  assert.equal(canSubmitFreeSpeaking("recording"), false);
  assert.deepEqual(buildImageDescriptionFeedback({ status: "self-review" }), {
    improvement: { key: "selfReview" },
    metrics: [],
    positive: { key: "recordingComplete", count: 0 },
    score: null,
    scored: false,
  });
});
