import assert from "node:assert/strict";
import test from "node:test";

const modulePath = "../../src/surfaces/group-3-8104/content/practice/freeSpeakingAdapter.js";

test("image practice derives two scene-backed prompts for every HSK level", async () => {
  const { buildFreeSpeakingDefinitions } = await import(modulePath);

  for (const level of ["hsk1", "hsk2", "hsk3"]) {
    const prompts = await buildFreeSpeakingDefinitions(level, "image-description");
    assert.equal(prompts.length, 2);
    for (const prompt of prompts) {
      assert.equal(prompt.type, "image-description");
      assert.match(prompt.image, /\/assets\/group3\/lessons\//);
      assert.match(prompt.imageSrcSet, /720w.+1400w/);
      assert.equal(prompt.sourceRef.level, undefined);
      assert.match(prompt.sourceRef.lessonId, new RegExp(`^${level}-`));
      assert.ok(prompt.sourceRef.sceneId);
      assert.ok(prompt.hints.length >= 3 && prompt.hints.length <= 5);
      assert.ok(prompt.expectedConcepts.length > 0);
    }
  }
});

test("question practice derives two dialogue questions with pinyin and answer concepts per level", async () => {
  const { buildFreeSpeakingDefinitions } = await import(modulePath);

  for (const level of ["hsk1", "hsk2", "hsk3"]) {
    const prompts = await buildFreeSpeakingDefinitions(level, "question-response");
    assert.equal(prompts.length, 2);
    for (const prompt of prompts) {
      assert.equal(prompt.type, "question-response");
      assert.match(prompt.question.hanzi, /[？?]/);
      assert.ok(prompt.question.pinyin);
      assert.doesNotMatch(prompt.question.pinyin, /\p{Script=Han}/u);
      assert.doesNotMatch(prompt.question.translations.th, /\p{Script=Han}/u);
      assert.ok(prompt.question.translations.en);
      assert.ok(prompt.expectedConcepts.length > 0);
      assert.match(prompt.sourceRef.lessonId, new RegExp(`^${level}-`));
    }
  }
});

test("free speaking adapter rejects unsupported levels and exercise types", async () => {
  const { buildFreeSpeakingDefinitions } = await import(modulePath);
  await assert.rejects(() => buildFreeSpeakingDefinitions("hsk9", "image-description"), { code: "EXERCISE_SOURCE_NOT_FOUND" });
  await assert.rejects(() => buildFreeSpeakingDefinitions("hsk1", "repeat-sentence"), { code: "EXERCISE_SOURCE_NOT_FOUND" });
});
