import assert from "node:assert/strict";
import test from "node:test";

const modulePath = "../../src/surfaces/group-3-8104/features/practice/evaluation/freeSpeaking.js";

test("baseline evaluation reports observable Chinese content and keyword coverage", async () => {
  const { evaluateFreeSpeakingResponse } = await import(modulePath);
  const result = evaluateFreeSpeakingResponse({
    durationMs: 18_000,
    expectedConcepts: [
      { id: "family", terms: ["家人", "爸爸", "妈妈"] },
      { id: "photo", terms: ["照片"] },
    ],
    transcript: "照片里有我的爸爸妈妈和家人",
  });

  assert.equal(result.status, "complete");
  assert.equal(result.metrics.speechDetected, true);
  assert.equal(result.metrics.chineseCharacterCount, 13);
  assert.equal(result.metrics.keywordCoverage, 1);
  assert.deepEqual(result.mentionedConceptIds, ["family", "photo"]);
  assert.deepEqual(result.recommendedTerms, []);
  assert.ok(result.baselineScore >= 80 && result.baselineScore <= 100);
});

test("partial response exposes missing recommendations without semantic claims", async () => {
  const { evaluateFreeSpeakingResponse } = await import(modulePath);
  const result = evaluateFreeSpeakingResponse({
    durationMs: 4_000,
    expectedConcepts: [
      { id: "food", terms: ["吃饭", "饭"] },
      { id: "friend", terms: ["朋友"] },
    ],
    transcript: "我和朋友",
  });

  assert.equal(result.status, "partial");
  assert.equal(result.metrics.keywordCoverage, 0.5);
  assert.deepEqual(result.mentionedConceptIds, ["friend"]);
  assert.deepEqual(result.recommendedTerms, ["吃饭"]);
  assert.equal("grammar" in result.metrics, false);
  assert.equal("pronunciation" in result.metrics, false);
  assert.equal("semanticAccuracy" in result.metrics, false);
});

test("empty recognition is incomplete and never receives an invented score", async () => {
  const { evaluateFreeSpeakingResponse } = await import(modulePath);
  const result = evaluateFreeSpeakingResponse({
    durationMs: 12_000,
    expectedConcepts: [{ id: "school", terms: ["学校"] }],
    transcript: "",
  });

  assert.equal(result.status, "incomplete");
  assert.equal(result.metrics.speechDetected, false);
  assert.equal(result.baselineScore, 0);
  assert.deepEqual(result.recommendedTerms, ["学校"]);
});
