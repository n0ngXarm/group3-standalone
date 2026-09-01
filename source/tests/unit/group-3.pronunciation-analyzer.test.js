import assert from "node:assert/strict";
import test from "node:test";

import {
  analyzePronunciationDetail,
  extractToneNumber,
  splitPinyinSyllables,
} from "../../src/surfaces/group-3-8104/features/practice/evaluation/pronunciationAnalyzer.js";

test("extractToneNumber identifies Mandarin 1st to 4th tones and neutral tones", () => {
  assert.equal(extractToneNumber("mā"), 1);
  assert.equal(extractToneNumber("má"), 2);
  assert.equal(extractToneNumber("mǎ"), 3);
  assert.equal(extractToneNumber("mà"), 4);
  assert.equal(extractToneNumber("ma"), 0);
  assert.equal(extractToneNumber("nǐ"), 3);
  assert.equal(extractToneNumber("hǎo"), 3);
});

test("splitPinyinSyllables splits sentence pinyin cleanly without punctuation", () => {
  assert.deepEqual(splitPinyinSyllables("Nǐ hǎo, Wáng lǎoshī!"), ["Nǐ", "hǎo", "Wáng", "lǎoshī"]);
  assert.deepEqual(splitPinyinSyllables("píngguǒ duōshao qián?"), ["píngguǒ", "duōshao", "qián"]);
});

test("analyzePronunciationDetail generates character breakdown, accuracy, and tone tips", () => {
  const result = analyzePronunciationDetail({
    audioDurationMs: 2500,
    language: "th",
    speechMs: 2000,
    targetHanzi: "你好王老师",
    targetPinyin: "nǐ hǎo Wáng lǎoshī",
    userTranscript: "你好老师",
  });

  assert.equal(result.totalCount, 5);
  assert.equal(result.matchedCount, 4);
  assert.equal(result.accuracy, 80);
  assert.equal(result.characterBreakdown.length, 5);

  // Check character breakdown statuses
  assert.equal(result.characterBreakdown[0].character, "你");
  assert.equal(result.characterBreakdown[0].status, "matched");

  assert.equal(result.characterBreakdown[1].character, "好");
  assert.equal(result.characterBreakdown[1].status, "matched");

  // Check CPM
  assert.ok(result.cpm > 0);
  assert.ok(result.paceLabel.length > 0);
});

test("analyzePronunciationDetail handles full accuracy match", () => {
  const result = analyzePronunciationDetail({
    audioDurationMs: 1500,
    language: "th",
    speechMs: 1200,
    targetHanzi: "苹果",
    targetPinyin: "píng guǒ",
    userTranscript: "苹果",
  });

  assert.equal(result.accuracy, 100);
  assert.equal(result.problemWords.length, 0);
  assert.equal(result.specificTips.length, 0);
});
