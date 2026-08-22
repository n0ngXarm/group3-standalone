import assert from "node:assert/strict";
import { test } from "node:test";

const load = async (path) => import(path).catch(() => ({}));

test("normalization removes whitespace and punctuation without rewriting Chinese characters", async () => {
  const { normalizeChineseTranscript } = await load("../../src/surfaces/group-3-8104/features/practice/evaluation/normalizeTranscript.js");
  assert.equal(typeof normalizeChineseTranscript, "function");
  for (const input of [
    "我要去学校。",
    " 我要 去 学校 ",
    "\"我要去学校\"",
    "我要去学校！?，；：…",
    "我要\n去\r\n学校",
  ]) {
    assert.equal(normalizeChineseTranscript(input), "我要去学校");
  }
  assert.equal(normalizeChineseTranscript("學校"), "學校");
  assert.equal(normalizeChineseTranscript("学校"), "学校");
  assert.equal(normalizeChineseTranscript("e\u0301，你好"), "é你好");
  assert.equal(normalizeChineseTranscript(null), "");
});

test("character edit distance reports substitutions, deletions, insertions, and safe CER", async () => {
  const { calculateCharacterErrorRate } = await load("../../src/surfaces/group-3-8104/features/practice/evaluation/characterDistance.js");
  assert.equal(typeof calculateCharacterErrorRate, "function");

  assert.deepEqual(calculateCharacterErrorRate("你好", "你好"), {
    alignment: [
      { operation: "match", referenceCharacter: "你", referenceIndex: 0, transcriptCharacter: "你", transcriptIndex: 0 },
      { operation: "match", referenceCharacter: "好", referenceIndex: 1, transcriptCharacter: "好", transcriptIndex: 1 },
    ],
    cer: 0,
    deletions: 0,
    distance: 0,
    insertions: 0,
    referenceLength: 2,
    substitutions: 0,
  });

  const deletion = calculateCharacterErrorRate("我要去学校", "我要学校");
  assert.equal(deletion.distance, 1);
  assert.equal(deletion.deletions, 1);
  assert.equal(deletion.cer, 0.2);
  assert.equal(calculateCharacterErrorRate("你好", "你们好").insertions, 1);
  assert.equal(calculateCharacterErrorRate("学校", "学笑").substitutions, 1);
  assert.equal(calculateCharacterErrorRate("我要去", "今天好").distance, 3);
  assert.deepEqual(calculateCharacterErrorRate("", ""), {
    alignment: [], cer: 0, deletions: 0, distance: 0, insertions: 0, referenceLength: 0, substitutions: 0,
  });
  assert.equal(calculateCharacterErrorRate("", "你好").cer, 1);
  assert.equal(calculateCharacterErrorRate("你好", "").cer, 1);
});

test("ordered coverage uses LCS and exposes stable matched indices", async () => {
  const { calculateOrderedCoverage } = await load("../../src/surfaces/group-3-8104/features/practice/evaluation/orderedCoverage.js");
  assert.equal(typeof calculateOrderedCoverage, "function");
  assert.deepEqual(calculateOrderedCoverage("我要去", "我要去"), {
    coverage: 1,
    lcsLength: 3,
    matches: [
      { character: "我", referenceIndex: 0, transcriptIndex: 0 },
      { character: "要", referenceIndex: 1, transcriptIndex: 1 },
      { character: "去", referenceIndex: 2, transcriptIndex: 2 },
    ],
  });
  assert.equal(calculateOrderedCoverage("我要去", "我去要").lcsLength, 2);
  assert.equal(calculateOrderedCoverage("我要去", "我去要").coverage, 2 / 3);
  assert.equal(calculateOrderedCoverage("我要去", "今天好").coverage, 0);
  assert.equal(calculateOrderedCoverage("", "").coverage, 1);
  assert.equal(calculateOrderedCoverage("", "你好").coverage, 0);
});

test("difference evidence separates matched, missing, extra, and substituted characters", async () => {
  const { buildCharacterEvidence } = await load("../../src/surfaces/group-3-8104/features/practice/evaluation/characterDistance.js");
  assert.equal(typeof buildCharacterEvidence, "function");
  const evidence = buildCharacterEvidence("我要去学校", "我要学校");
  assert.deepEqual(evidence.matched.map((item) => item.character), ["我", "要", "学", "校"]);
  assert.deepEqual(evidence.missing, [{ character: "去", referenceIndex: 2 }]);
  assert.deepEqual(evidence.extra, []);
  assert.deepEqual(evidence.substituted, []);

  const changed = buildCharacterEvidence("学校", "学笑啊");
  assert.deepEqual(changed.substituted, [{ actual: "笑", expected: "校", referenceIndex: 1, transcriptIndex: 1 }]);
  assert.deepEqual(changed.extra, [{ character: "啊", transcriptIndex: 2 }]);
});

test("timing metrics remain pure signals and handle zero durations safely", async () => {
  const { deriveRepeatTimingMetrics } = await load("../../src/surfaces/group-3-8104/features/practice/evaluation/deterministic.js");
  assert.equal(typeof deriveRepeatTimingMetrics, "function");
  assert.deepEqual(deriveRepeatTimingMetrics({
    endedAt: 3000,
    responseWindowMs: 10000,
    silenceMs: 0,
    speechMs: 3000,
    startedAt: 0,
    transcriptLength: 6,
  }), {
    durationMs: 3000,
    responseUtilization: 0.3,
    silenceRatio: 0,
    speakingRateCpm: 120,
    timedOut: false,
    timingScore: 100,
    windowCompliance: 1,
  });
  const empty = deriveRepeatTimingMetrics({ responseWindowMs: 0, silenceMs: 0, speechMs: 0, transcriptLength: 0 });
  assert.equal(empty.silenceRatio, 0);
  assert.equal(empty.speakingRateCpm, 0);
  assert.equal(empty.timingScore, 0);
});

test("repeat evaluation keeps accuracy, completion, timing, and semantic status distinct", async () => {
  const evaluation = await load("../../src/surfaces/group-3-8104/features/practice/evaluation/deterministic.js");
  assert.equal(typeof evaluation.evaluateRepeatSentence, "function");
  const timing = { endedAt: 3000, responseWindowMs: 10000, silenceMs: 0, speechMs: 3000, startedAt: 0 };

  const perfect = evaluation.evaluateRepeatSentence({ target: "我要去学校。", transcript: "我要 去 学校", timing });
  assert.equal(perfect.score, 100);
  assert.equal(perfect.status, "correct");
  assert.equal(perfect.metrics.transcriptAccuracy, 1);
  assert.equal(perfect.metrics.completion, 1);

  const missing = evaluation.evaluateRepeatSentence({ target: "我要去学校", transcript: "我要学校", timing });
  assert.equal(missing.score, 92);
  assert.equal(missing.status, "close");
  assert.equal(missing.metrics.transcriptAccuracy, 1);
  assert.equal(missing.metrics.completion, 0.8);

  const extra = evaluation.evaluateRepeatSentence({ target: "我要去学校", transcript: "我真要去学校", timing });
  assert.equal(extra.score, 93);
  assert.equal(extra.status, "close");
  assert.equal(extra.evidence.extra.length, 1);

  const partial = evaluation.evaluateRepeatSentence({ target: "我要去学校", transcript: "我要", timing });
  assert.equal(partial.score, 49);
  assert.equal(partial.status, "retry");
  assert.equal(partial.metrics.completion, 0.4);

  const wrong = evaluation.evaluateRepeatSentence({ target: "我要去学校", transcript: "今天天气好", timing });
  assert.equal(wrong.status, "retry");
  assert.ok(wrong.score < 50);

  const silence = evaluation.evaluateRepeatSentence({ target: "我要去学校", transcript: "", timing: { ...timing, speechMs: 0 } });
  assert.equal(silence.score, 0);
  assert.equal(silence.status, "retry");
  assert.equal(silence.error.code, "NO_SPEECH");

  const timeout = evaluation.evaluateRepeatSentence({
    target: "我要去学校",
    transcript: "我要去学校",
    timing: { endedAt: 12000, responseWindowMs: 10000, silenceMs: 7000, speechMs: 5000, startedAt: 0 },
  });
  assert.equal(timeout.metrics.timedOut, true);
  assert.equal(timeout.status, "close");

  const invalid = evaluation.evaluateRepeatSentence({ target: "。", transcript: "你好", timing });
  assert.equal(invalid.ok, false);
  assert.equal(invalid.error.code, "INVALID_TARGET");
});

test("v1 thresholds clamp scores and gate severe completion failures", async () => {
  const scoring = await load("../../src/surfaces/group-3-8104/features/practice/evaluation/repeatScore.js");
  assert.equal(typeof scoring.scoreRepeatMetrics, "function");
  assert.deepEqual(scoring.scoreRepeatMetrics({ completion: 1, timedOut: false, timingScore: 100, transcriptAccuracy: 1 }), {
    completionScore: 100,
    policyVersion: "repeat-score-v1",
    score: 100,
    status: "correct",
    timingScore: 100,
    transcriptAccuracyScore: 100,
  });
  assert.equal(scoring.scoreRepeatMetrics({ completion: 0.49, timedOut: false, timingScore: 100, transcriptAccuracy: 1 }).score, 49);
  assert.equal(scoring.scoreRepeatMetrics({ completion: 0.9, timedOut: false, timingScore: 100, transcriptAccuracy: 0.89 }).status, "close");
  assert.equal(scoring.scoreRepeatMetrics({ completion: 0.6, timedOut: false, timingScore: 0, transcriptAccuracy: 0.6 }).status, "retry");
  assert.equal(scoring.scoreRepeatMetrics({ completion: 5, timedOut: false, timingScore: 999, transcriptAccuracy: 5 }).score, 100);
});
