import assert from "node:assert/strict";
import test from "node:test";

import {
  getSpeechCoachingAdvice,
  speakCoachingFeedback,
} from "../../src/surfaces/group-3-8104/features/practice/evaluation/speechFeedback.js";

test("getSpeechCoachingAdvice generates correct tier recommendations (<30%, 30-59%, 60-79%, 80-100%)", () => {
  // Tier 1: < 30% or empty transcript
  const tier1 = getSpeechCoachingAdvice({ score: 20, transcript: "我", language: "th" });
  assert.equal(tier1.tier, "volume");
  assert.equal(tier1.type, "warning");
  assert.match(tier1.text, /เพิ่มเสียง/);
  assert.match(tier1.spokenText, /เพิ่มเสียง/);

  // Tier 1 with empty speech
  const tier1Empty = getSpeechCoachingAdvice({ score: 90, transcript: "", language: "th" });
  assert.equal(tier1Empty.tier, "volume");

  // Tier 2: 30% - 59%
  const tier2 = getSpeechCoachingAdvice({ score: 45, transcript: "我要去", language: "th" });
  assert.equal(tier2.tier, "accent");
  assert.equal(tier2.type, "info");
  assert.match(tier2.text, /ปรับสำเนียง/);
  assert.match(tier2.spokenText, /ปรับสำเนียง/);

  // Tier 3: 60% - 79%
  const tier3 = getSpeechCoachingAdvice({ score: 72, transcript: "我要去学校", language: "th" });
  assert.equal(tier3.tier, "close");
  assert.equal(tier3.type, "close");
  assert.match(tier3.text, /ใกล้เคียงมาก/);
  assert.match(tier3.spokenText, /ออกเสียงได้ดีมาก/);

  // Tier 4: 80% - 100%
  const tier4 = getSpeechCoachingAdvice({ score: 95, transcript: "我要去学校学习", language: "th" });
  assert.equal(tier4.tier, "excellent");
  assert.equal(tier4.type, "success");
  assert.match(tier4.text, /ยอดเยี่ยมมาก/);
  assert.match(tier4.spokenText, /ยอดเยี่ยมมาก/);
});

test("getSpeechCoachingAdvice supports English and Chinese feedback output", () => {
  const enAdvice = getSpeechCoachingAdvice({ score: 25, transcript: "你好", language: "en" });
  assert.equal(enAdvice.tier, "volume");
  assert.match(enAdvice.text, /speak louder/i);

  const zhAdvice = getSpeechCoachingAdvice({ score: 85, transcript: "你好", language: "zh" });
  assert.equal(zhAdvice.tier, "excellent");
  assert.match(zhAdvice.text, /标准/);
});

test("speakCoachingFeedback handles missing synthesis environment safely", () => {
  const result = speakCoachingFeedback("ทดสอบ", "th");
  assert.equal(result, null);
});
