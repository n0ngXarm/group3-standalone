import assert from "node:assert/strict";
import { test } from "node:test";

const load = async (path) => import(path).catch(() => ({}));

test("practice hub entries are level scoped, localized, and reference existing lessons", async () => {
  const registry = await load("../../src/surfaces/group-3-8104/content/practice/registry.js");
  assert.equal(typeof registry.getPracticeHubEntries, "function");

  const expectedLabels = {
    th: ["ฟังแล้วพูดตาม", "บรรยายภาพ", "ตอบคำถาม"],
    zh: ["听后复述", "看图说话", "回答问题"],
    en: ["Repeat a sentence", "Describe an image", "Answer a question"],
  };
  const expectedTypes = ["repeat-sentence", "image-description", "question-response"];

  for (const level of ["hsk1", "hsk2", "hsk3"]) {
    for (const language of ["th", "zh", "en"]) {
      const entries = registry.getPracticeHubEntries(level, language);
      assert.deepEqual(entries.map((entry) => entry.type), expectedTypes);
      assert.deepEqual(entries.map((entry) => entry.title), expectedLabels[language]);
      assert.deepEqual(entries.map((entry) => entry.route), expectedTypes.map((type) => `/home/${level}/practice/${type}/`));
      assert.ok(entries.every((entry) => entry.progress.state === "not-started"));
      assert.ok(entries.every((entry) => !Object.hasOwn(entry.progress, "percent")));
      assert.ok(entries.every((entry) => entry.sourceRefs.length > 0));
      assert.ok(entries.every((entry) => entry.sourceRefs.every((ref) => ref.lessonId.startsWith(`${level}-`))));
    }
  }
  assert.deepEqual(registry.getPracticeHubEntries("hsk9", "th"), []);
});
