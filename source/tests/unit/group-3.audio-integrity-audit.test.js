import assert from "node:assert/strict";
import { test } from "node:test";

import {
  classifyAudioMapping,
  parseVoiceGenerationSource,
} from "../../scripts/audio-integrity-audit.mjs";

test("audio audit classifies missing, duplicate, and wrong payloads independently of URL success", () => {
  const base = {
    actualProfile: "wang",
    actualText: "你好！",
    duplicateExpectedTexts: ["你好！"],
    exists: true,
    expectedProfile: "wang",
    expectedText: "你好！",
  };

  assert.equal(classifyAudioMapping(base), "MATCH");
  assert.equal(classifyAudioMapping({ ...base, exists: false }), "MISSING");
  assert.equal(
    classifyAudioMapping({ ...base, duplicateExpectedTexts: ["你好！", "再见！"] }),
    "DUPLICATE_AUDIO",
  );
  assert.equal(classifyAudioMapping({ ...base, actualText: "再见！" }), "WRONG_LINE");
  assert.equal(classifyAudioMapping({ ...base, actualProfile: "liu" }), "WRONG_LINE");
  assert.equal(classifyAudioMapping({ ...base, actualProfile: "", actualText: "" }), "FALLBACK_TTS");
});

test("audio audit reads payload text and profile from the voice generation source", () => {
  const records = parseVoiceGenerationSource(`
LINES = [
    ('first-01', 'wang', '你好！'),
    ('second-01', 'liu', '再见！'),
]
  `);

  assert.deepEqual(records, [
    { file: "first-01.mp3", profile: "wang", text: "你好！" },
    { file: "second-01.mp3", profile: "liu", text: "再见！" },
  ]);
});
