import assert from "node:assert/strict";
import { afterEach, beforeEach, test } from "node:test";

import {
  evaluateScore,
  highScoreStorageKey,
  loadHighScores,
  rankHighScores,
  saveHighScore,
  buildBlitzQuestions,
  buildMatchCards,
  buildListenQuestionSet,
  buildPinyinQuestions,
  normalizeVocabulary,
  shuffle,
} from "../../src/surfaces/group-3-8104/features/_legacy-games/shared/gameData.js";
import {
  resetChineseAudioForTests,
  speakChinese,
  speakWithDeviceVoice,
  stopChineseVoice,
  unlockChineseAudio,
} from "../../src/surfaces/group-3-8104/services/audio/group3Audio.js";

/* ==========================================================================
   STRESS SUITE 1: AUDIO SYNTH & FALLBACK ROBUSTNESS
   ========================================================================== */

class FakeUtterance {
  constructor(text) {
    this.text = text;
    this.lang = "";
    this.voice = null;
    this.rate = 1;
    this.pitch = 1;
    this.onend = null;
    this.onerror = null;
  }
}

function setupBrowserMocks({ speech = true, voices = [] } = {}) {
  const synthesis = speech
    ? {
        cancelCalls: 0,
        getVoices: () => voices,
        speakCalls: [],
        cancel() {
          this.cancelCalls += 1;
        },
        speak(utterance) {
          this.speakCalls.push(utterance);
        },
      }
    : undefined;

  globalThis.window = {
    clearTimeout,
    setTimeout,
    speechSynthesis: synthesis,
  };
  globalThis.SpeechSynthesisUtterance = speech ? FakeUtterance : undefined;

  return synthesis;
}

beforeEach(() => {
  setupBrowserMocks();
  resetChineseAudioForTests();
  unlockChineseAudio();
  stopChineseVoice();
});

afterEach(() => {
  stopChineseVoice();
  delete globalThis.SpeechSynthesisUtterance;
  delete globalThis.window;
});

test("[Audio Fallback] Rapid consecutive speakChinese calls maintain single active playback", async () => {
  const voices = [{ lang: "zh-CN", name: "Chinese Voice" }];
  const synthesis = setupBrowserMocks({ voices });

  const playbacks = [];
  for (let i = 0; i < 50; i += 1) {
    playbacks.push(speakChinese(`Text ${i}`, { audioSrc: "", profileId: "wang" }));
  }

  // First 49 must be cancelled
  for (let i = 0; i < 49; i += 1) {
    const res = await playbacks[i].completion;
    assert.equal(res.status, "cancelled");
  }

  // The 50th utterance should be active
  assert.equal(synthesis.speakCalls.length, 50);
  const lastUtterance = synthesis.speakCalls[49];
  lastUtterance.onend();

  const finalRes = await playbacks[49].completion;
  assert.equal(finalRes.status, "ended");
});

test("[Audio Fallback] Complete API destruction (no SpeechSynthesis) returns unavailable", async () => {
  setupBrowserMocks({ speech: false });

  const playback = speakWithDeviceVoice("测试", "wang");
  const result = await playback.completion;
  assert.equal(result.status, "unavailable");
});

test("[Audio Fallback] Device speech that never ends resolves as timeout", async () => {
  const voices = [{ lang: "zh-CN", name: "Chinese Voice" }];
  setupBrowserMocks({ voices });

  const playback = speakWithDeviceVoice("一杯茶", "wang", { maxDurationMs: 5 });
  const result = await playback.completion;
  assert.equal(result.status, "timeout");
});

/* ==========================================================================
   STRESS SUITE 2: SCORE EVALUATION & BOUNDARY TESTING
   ========================================================================== */

test("[Score Bounds] Extreme and invalid inputs to evaluateScore stay finite and bounded", () => {
  const pathologicalInputs = [
    { correct: -100, total: 10, level: "hsk1" },
    { correct: 9999, total: 10, level: "hsk2" },
    { correct: NaN, total: NaN, level: "hsk3" },
    { correct: Infinity, total: -Infinity, level: "invalid" },
    { correct: undefined, total: null, level: null },
    { correct: "10", total: "20", level: "hsk1" },
    { correct: 0.9999, total: 1.0001, level: "hsk3" },
  ];

  for (const input of pathologicalInputs) {
    const res = evaluateScore(input.correct, input.total, input.level);
    assert.ok(Number.isFinite(res.accuracy), `Accuracy must be finite for ${JSON.stringify(input)}`);
    assert.ok(res.accuracy >= 0 && res.accuracy <= 100, `Accuracy must be 0-100 for ${JSON.stringify(input)}`);
    assert.ok(Number.isFinite(res.correct), `Correct must be finite for ${JSON.stringify(input)}`);
    assert.ok(res.correct >= 0, `Correct must be >= 0 for ${JSON.stringify(input)}`);
    assert.ok(Number.isFinite(res.total), `Total must be finite for ${JSON.stringify(input)}`);
    assert.ok(res.total >= res.correct, `Total must be >= correct for ${JSON.stringify(input)}`);
    assert.ok(res.thaiGrade && typeof res.thaiGrade.grade === "string", "Must return valid Thai grade");
    assert.ok(res.hskBand && typeof res.hskBand.zh === "string", "Must return valid HSK band");
    assert.ok(res.stars >= 0 && res.stars <= 3, "Stars must be between 0 and 3");
    assert.ok(res.hskRef && Number.isFinite(res.hskRef.simulatedScore), "hskRef score must be finite");
  }
});

/* ==========================================================================
   STRESS SUITE 3: LOCAL STORAGE RANKING & EDGE CASES
   ========================================================================== */

function memoryStorage(initialData = {}) {
  const map = new Map(Object.entries(initialData));
  return {
    getItem: (k) => map.has(k) ? map.get(k) : null,
    setItem: (k, v) => map.set(k, String(v)),
    removeItem: (k) => map.delete(k),
  };
}

async function withLocalStorage(mockStorage, fn) {
  const original = globalThis.localStorage;
  Object.defineProperty(globalThis, "localStorage", { configurable: true, value: mockStorage });
  try {
    return await fn();
  } finally {
    if (original) Object.defineProperty(globalThis, "localStorage", { configurable: true, value: original });
    else delete globalThis.localStorage;
  }
}

test("[Storage Edge Cases] Sanitization of malicious, corrupt, and overflow storage rows", async () => {
  const scope = { level: "hsk1", lessonId: "lesson-1", game: "blitz" };

  await withLocalStorage(memoryStorage(), () => {
    // 1. Corrupt JSON in storage
    globalThis.localStorage.setItem(highScoreStorageKey(scope), "{invalid-json-data");
    assert.deepEqual(loadHighScores(scope), []);

    // 2. Storage with 50 entries, invalid values, NaN scores, negative stars
    const dirtyScores = Array.from({ length: 50 }, (_, i) => ({
      runId: `run-${i}`,
      name: `<script>alert(${i})</script>`,
      score: i % 2 === 0 ? i * 10 : "not-a-number",
      stars: i > 40 ? 999 : -5,
      accuracy: i > 30 ? 500 : -20,
      date: i === 10 ? "invalid-date" : new Date(1700000000000 + i * 1000).toISOString(),
    }));

    globalThis.localStorage.setItem(highScoreStorageKey(scope), JSON.stringify(dirtyScores));
    const loaded = loadHighScores(scope);

    // Must be capped at top 5
    assert.equal(loaded.length, 5);

    // Each entry must be sanitized
    for (const item of loaded) {
      assert.ok(item.score >= 0 && Number.isFinite(item.score));
      assert.ok(item.stars >= 0 && item.stars <= 3);
      assert.ok(item.accuracy >= 0 && item.accuracy <= 100);
      assert.ok(!Number.isNaN(Date.parse(item.date)));
    }
  });
});

test("[Storage Edge Cases] Deterministic multi-attribute tie-breaking", () => {
  // Tie-break hierarchy: score DESC -> stars DESC -> accuracy DESC -> date ASC -> runId ASC
  const raw = [
    { runId: "b", score: 100, stars: 2, accuracy: 80, date: "2026-08-10T12:00:00.000Z" },
    { runId: "a", score: 100, stars: 2, accuracy: 80, date: "2026-08-10T12:00:00.000Z" }, // runId 'a' win over 'b'
    { runId: "c", score: 100, stars: 2, accuracy: 80, date: "2026-08-10T11:00:00.000Z" }, // earlier date win over 'a' & 'b'
    { runId: "d", score: 100, stars: 2, accuracy: 90, date: "2026-08-10T13:00:00.000Z" }, // higher accuracy win over 'c'
    { runId: "e", score: 100, stars: 3, accuracy: 50, date: "2026-08-10T13:00:00.000Z" }, // higher stars win over 'd'
    { runId: "f", score: 150, stars: 1, accuracy: 10, date: "2026-08-10T13:00:00.000Z" }, // higher score win over all
  ];

  const ranked = rankHighScores(raw);
  assert.deepEqual(
    ranked.map((x) => x.runId),
    ["f", "e", "d", "c", "a"]
  );
});

test("[Storage Edge Cases] Blocked or throw-on-access localStorage does not crash game save", async () => {
  const scope = { level: "hsk1", lessonId: "lesson-1", game: "blitz" };
  const throwingStorage = {
    getItem: () => { throw new Error("QuotaExceededError"); },
    setItem: () => { throw new Error("QuotaExceededError"); },
  };

  await withLocalStorage(throwingStorage, () => {
    assert.doesNotThrow(() => {
      const result = saveHighScore(scope, { runId: "run-safe", score: 100, stars: 3, accuracy: 100, date: new Date().toISOString() });
      assert.equal(result.length, 1);
    });
  });
});

/* ==========================================================================
   STRESS SUITE 4: DATA BUILDERS & RNG DETERMINISM STRESS
   ========================================================================== */

test("[Data Builders] High iteration build stress with duplicate/sparse vocabulary", () => {
  const sparseVocab = {
    w1: { hanzi: "你好", pinyin: "nǐ hǎo", th: "สวัสดี" },
    w2: { hanzi: "谢谢", pinyin: "xiè xie", th: "ขอบคุณ" },
    w3: { hanzi: "再见", pinyin: "zài jiàn", th: "ลาก่อน" },
    w4: { hanzi: "苹果", pinyin: "píng guǒ", th: "แอปเปิ้ล" },
  };

  for (let i = 0; i < 50; i += 1) {
    const blitz = buildBlitzQuestions(sparseVocab, 15);
    assert.equal(blitz.length, 15);
    const sprint = buildListenQuestionSet(sparseVocab, 12);
    assert.equal(sprint.length, 12);
    const dash = buildPinyinQuestions(sparseVocab, 15);
    assert.equal(dash.length, 15);
    const cards = buildMatchCards(sparseVocab, 6);
    assert.equal(cards.length, 8); // Only 4 pairs available (4*2=8)
  }
});
