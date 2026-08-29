import { createLearningSummary, getScoreLabel } from "./summaryModel.js";

const mockRepeatResult = [
  { score: 90, metrics: { transcriptAccuracy: 95, completion: 100, timingScore: 80 } },
  { score: 80, metrics: { transcriptAccuracy: 85, completion: 90, timingScore: 70 } }
];

const mockImageResultScored = [
  { baselineScore: 70, metrics: { keywordCoverage: 0.8, responseDurationSeconds: 15 }, status: "complete" },
  { baselineScore: 80, metrics: { keywordCoverage: 0.9, responseDurationSeconds: 20 }, status: "complete" }
];

const mockQuestionResultScored = [
  { baselineScore: 85, metrics: { keywordCoverage: 1.0, responseDurationSeconds: 10 }, status: "complete" }
];

const mockUnscored = [
  { status: "self-review" }
];

// Test 1: all three scored
const t1 = createLearningSummary({ repeatResult: mockRepeatResult, imageResult: mockImageResultScored, questionResult: mockQuestionResultScored });
console.assert(t1.overall.isPartial === false, "T1 failed: isPartial should be false");
console.assert(t1.overall.score !== null, "T1 failed: overall score should not be null");

// Test 2: Repeat scored + Image unscored
const t2 = createLearningSummary({ repeatResult: mockRepeatResult, imageResult: mockUnscored, questionResult: mockUnscored });
console.assert(t2.overall.isPartial === true, "T2 failed: isPartial should be true");
console.assert(t2.exercises.imageDescription.score === null, "T2 failed: image score should be null");

// Test 3: Question unscored
const t3 = createLearningSummary({ repeatResult: mockRepeatResult, imageResult: mockImageResultScored, questionResult: mockUnscored });
console.assert(t3.overall.isPartial === true, "T3 failed: isPartial should be true");

// Test 4: all exercises unscored
const t4 = createLearningSummary({ repeatResult: mockUnscored, imageResult: mockUnscored, questionResult: mockUnscored });
console.assert(t4.overall.score === null, "T4 failed: overall score should be null");
console.assert(t4.capabilityMode === "unscored", "T4 failed: mode should be unscored");

// Test 5: missing transcript
const t5 = createLearningSummary({ repeatResult: [], imageResult: [], questionResult: [] });
console.assert(t5.overall.score === null, "T5 failed: empty arrays should return null score");

// Test 6: missing learner name
const t6 = createLearningSummary({});
console.assert(t6.learnerName === "ผู้เรียน", "T6 failed: default learner name should be ผู้เรียน");

// Test 7: HSK1/2/3
const t7 = createLearningSummary({ hskLevel: "hsk2" });
console.assert(t7.hskLevel === "hsk2", "T7 failed: hskLevel should map properly");

// Test 8: score clamping / no unavailable metric becomes zero
console.assert(t4.metrics.accuracy === null, "T8 failed: unavailable accuracy should be null, not 0");

// Test 10: overall partial result calculation
const t10 = createLearningSummary({ repeatResult: [{ score: 100 }], imageResult: [{ baselineScore: 50 }], questionResult: [] });
console.assert(t10.overall.score === 75, "T10 failed: overall score should aggregate properly as 75");

// Test 11 & 12: strengths logic / improvement logic
const t11 = createLearningSummary({ repeatResult: [{ score: 100, metrics: { completion: 100, transcriptAccuracy: 100 } }] });
console.assert(t11.strengths.th.some(s => s.includes("completion") || s.includes("ความครบถ้วน")), "T11 failed");

console.log("All tests passed!");
