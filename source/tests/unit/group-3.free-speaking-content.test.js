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
      assert.match(prompt.image, /\/assets\/group3\/lessons\//, `${level} question needs its canonical scene image`);
      assert.match(prompt.imageSrcSet, /720w.+1400w/, `${level} question needs responsive scene sources`);
      assert.ok(prompt.imageAlt?.th?.trim(), `${level} question scene image needs Thai alt text`);
      assert.match(prompt.question.hanzi, /[？?]/);
      assert.ok(prompt.question.pinyin);
      assert.doesNotMatch(prompt.question.pinyin, /\p{Script=Han}/u);
      assert.ok(prompt.question.translations.th.trim(), `${level} question should include Thai learning support`);
      assert.doesNotMatch(prompt.question.translations.th, /\p{Script=Han}/u);
      assert.ok(prompt.question.translations.en);
      assert.equal(prompt.expectedConcepts.length, 1, `${level} main question should grade only its accepted intent`);
      assert.ok(Array.isArray(prompt.sampleAnswers), `${level} needs sample answers`);
      assert.ok(prompt.sampleAnswers.length > 0);
      assert.ok(Array.isArray(prompt.followUps), `${level} needs follow-ups`);
      assert.equal(prompt.followUps.length, 1);
      assert.ok(prompt.followUps[0].expectedConcepts.length > 0);
      assert.ok(prompt.followUps[0].sampleAnswers.length > 0);
      for (const utterance of [prompt.question, ...prompt.sampleAnswers, prompt.followUps[0].question, ...prompt.followUps[0].sampleAnswers]) {
        assert.ok(utterance.hanzi.trim(), `${level} learner utterance needs Hanzi`);
        assert.ok(utterance.pinyin.trim(), `${level} learner utterance needs Pinyin`);
        assert.ok(utterance.translations.th.trim(), `${level} learner utterance needs Thai`);
      }
      assert.ok(Array.isArray(prompt.vocabulary), `${level} needs conversation vocabulary`);
      assert.ok(prompt.vocabulary.length >= 3 && prompt.vocabulary.length <= 5);
      for (const word of prompt.vocabulary) {
        assert.ok(word.hanzi.trim(), `${level} vocabulary needs Hanzi`);
        assert.ok(word.pinyin.trim(), `${level} vocabulary needs Pinyin`);
        assert.ok(word.translations.th.trim(), `${level} vocabulary needs Thai`);
      }
      assert.match(prompt.sourceRef.lessonId, new RegExp(`^${level}-`));
    }
  }
});

test("image practice uses the contextual hai reading for 还 in the high-speed train scene", async () => {
  const { buildFreeSpeakingDefinitions } = await import(modulePath);
  const prompts = await buildFreeSpeakingDefinitions("hsk3", "image-description");
  const trainPrompt = prompts.find((prompt) => prompt.sourceRef.sceneId === "hsk3-l1-s2");
  const haiHint = trainPrompt.hints.find((hint) => hint.hanzi === "还");

  assert.equal(haiHint?.pinyin, "hái");
});

test("free speaking adapter rejects unsupported levels and exercise types", async () => {
  const { buildFreeSpeakingDefinitions } = await import(modulePath);
  await assert.rejects(() => buildFreeSpeakingDefinitions("hsk9", "image-description"), { code: "EXERCISE_SOURCE_NOT_FOUND" });
  await assert.rejects(() => buildFreeSpeakingDefinitions("hsk1", "repeat-sentence"), { code: "EXERCISE_SOURCE_NOT_FOUND" });
});
