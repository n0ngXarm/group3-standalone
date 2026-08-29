import assert from "node:assert/strict";
import test from "node:test";

import { createLearningSummary, getScoreLabel } from "../../src/surfaces/group-3-8104/features/practice/summary/summaryModel.js";

test("an empty Practice Summary reports that no results exist", () => {
  const summary = createLearningSummary({
    repeatResult: [],
    imageResult: [],
    questionResult: [],
  });

  assert.equal(summary.capabilityMode, "unscored");
  assert.equal(summary.overall.hasResults, false);
  assert.equal(getScoreLabel(summary.overall.score, "th", summary.overall.hasResults), "ยังไม่มีผลการฝึก");
  assert.equal(getScoreLabel(summary.overall.score, "zh", summary.overall.hasResults), "暂无练习结果");
  assert.equal(getScoreLabel(summary.overall.score, "en", summary.overall.hasResults), "No practice results");
});

test("a completed self-review remains completed even when it has no score", () => {
  const summary = createLearningSummary({ imageResult: [{ status: "self-review" }] });

  assert.equal(summary.overall.hasResults, true);
  assert.equal(getScoreLabel(summary.overall.score, "th", summary.overall.hasResults), "ฝึกครบแล้ว");
});
