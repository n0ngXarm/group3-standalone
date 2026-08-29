import assert from "node:assert/strict";
import test from "node:test";
import { GROUP3_LESSONS, findLesson } from "../../src/surfaces/group-3-8104/content/registry.js";
import { routeFromLocation } from "../../src/surfaces/group-3-8104/routing/routes.js";
import { buildRepeatSessionDefinitions, resolveRepeatExercise } from "../../src/surfaces/group-3-8104/content/practice/repeatAdapter.js";
import { buildFreeSpeakingDefinitions } from "../../src/surfaces/group-3-8104/content/practice/freeSpeakingAdapter.js";

test("1. every registered lesson resolves by ID", async () => {
  assert.equal(GROUP3_LESSONS.length, 7);
  for (const meta of GROUP3_LESSONS) {
    const lesson = typeof meta.load === "function" ? await meta.load() : meta;
    assert.ok(lesson.id, "Lesson must have an id");
    assert.ok(lesson.level, "Lesson must have a level");
    assert.ok(lesson.slug, "Lesson must have a slug");
    const found = findLesson(lesson.level, lesson.slug);
    assert.ok(found, `findLesson must resolve ${lesson.level}/${lesson.slug}`);
    assert.equal(found.id, lesson.id);
  }
});

test("2. every scene belongs to its parent lesson", async () => {
  for (const meta of GROUP3_LESSONS) {
    const lesson = typeof meta.load === "function" ? await meta.load() : meta;
    assert.ok(lesson.scenes?.length >= 2, `${lesson.id} must have at least 2 scenes`);
    lesson.scenes.forEach((scene, index) => {
      assert.equal(scene.lessonId, lesson.id, `Scene ${scene.id} lessonId must match ${lesson.id}`);
      assert.ok(scene.id.startsWith(lesson.id), `Scene id ${scene.id} must start with ${lesson.id}`);
      assert.equal(scene.slug, `scene-${index + 1}`);
    });
  }
});

test("3. vocabulary owner matches selected lesson", async () => {
  for (const meta of GROUP3_LESSONS) {
    const lesson = typeof meta.load === "function" ? await meta.load() : meta;
    assert.ok(lesson.vocabulary?.length > 0, `${lesson.id} must have vocabulary`);
    lesson.vocabulary.forEach((word, wordIndex) => {
      assert.equal(word.lessonId, lesson.id, `Vocab ${word.hanzi} lessonId must match ${lesson.id}`);
      assert.ok(word.id.startsWith(lesson.id), `Vocab id ${word.id} must start with ${lesson.id}`);
    });
  }
});

test("4. dialogue owner matches selected scene", async () => {
  for (const meta of GROUP3_LESSONS) {
    const lesson = typeof meta.load === "function" ? await meta.load() : meta;
    for (const scene of lesson.scenes) {
      assert.ok(scene.lines?.length > 0, `Scene ${scene.id} must have dialogue lines`);
      scene.lines.forEach((line) => {
        assert.equal(line.lessonId, lesson.id, `Line ${line.id} lessonId must match ${lesson.id}`);
        assert.equal(line.sceneId, scene.id, `Line ${line.id} sceneId must match ${scene.id}`);
        assert.ok(line.id.startsWith(scene.id), `Line id ${line.id} must start with ${scene.id}`);
      });
    }
  }
});

test("5. QTE owner matches selected scene", async () => {
  for (const meta of GROUP3_LESSONS) {
    const lesson = typeof meta.load === "function" ? await meta.load() : meta;
    for (const scene of lesson.scenes) {
      assert.ok(scene.qte, `Scene ${scene.id} must have a QTE challenge`);
      assert.equal(scene.qte.lessonId, lesson.id, `QTE ${scene.qte.id} lessonId must match ${lesson.id}`);
      assert.equal(scene.qte.sceneId, scene.id, `QTE ${scene.qte.id} sceneId must match ${scene.id}`);
      assert.ok(scene.qte.correct, `QTE ${scene.qte.id} must have a correct answer`);
      const hasCorrectOpt = scene.qte.options?.some((opt) => opt.value === scene.qte.correct);
      assert.ok(hasCorrectOpt, `QTE ${scene.qte.id} correct answer must exist in options`);
    }
  }
});

test("6. builder owner matches selected scene", async () => {
  for (const meta of GROUP3_LESSONS) {
    const lesson = typeof meta.load === "function" ? await meta.load() : meta;
    for (const scene of lesson.scenes) {
      assert.ok(scene.builder, `Scene ${scene.id} must have a builder`);
      assert.equal(scene.builder.lessonId, lesson.id, `Builder ${scene.builder.id} lessonId must match ${lesson.id}`);
      assert.equal(scene.builder.sceneId, scene.id, `Builder ${scene.builder.id} sceneId must match ${scene.id}`);
      const answerStr = Array.isArray(scene.builder.answer) ? scene.builder.answer.join("") : scene.builder.target;
      const tilesStr = Array.isArray(scene.builder.tiles) ? scene.builder.tiles.join("") : scene.builder.tokens?.join("");
      assert.equal(
        [...answerStr].sort().join(""),
        [...tilesStr].sort().join(""),
        `Builder ${scene.builder.id} tiles must assemble answer`,
      );
    }
  }
});

test("7. Repeat sourceRef resolves", async () => {
  for (const level of ["hsk1", "hsk2", "hsk3"]) {
    const session = await buildRepeatSessionDefinitions(level, { limit: 10 });
    assert.equal(session.length, 10);
    for (const item of session) {
      assert.ok(item.sourceRef, "Item must have sourceRef");
      const resolved = await resolveRepeatExercise(item.sourceRef);
      assert.equal(resolved.hanzi, item.hanzi);
      assert.equal(resolved.pinyin, item.pinyin);
      assert.equal(resolved.translations.th, item.translations.th);
    }
  }
});

test("8. Repeat sourceRef never crosses level", async () => {
  for (const level of ["hsk1", "hsk2", "hsk3"]) {
    const session = await buildRepeatSessionDefinitions(level, { limit: 10 });
    for (const item of session) {
      assert.equal(item.level, level);
      assert.ok(item.sourceRef.lessonId.startsWith(level), `SourceRef ${item.sourceRef.lessonId} must belong to ${level}`);
    }
  }
});

test("9. invalid lesson ID never silently becomes lesson-01", () => {
  const result = routeFromLocation(new URL("https://example.com/group3/home/hsk1/lessons/lesson-99/contents/"));
  assert.equal(result.name, "catalog");
  assert.equal(result.redirect, true);
  assert.equal(result.lessonSlug, undefined);
});

test("10. invalid scene ID never silently becomes scene-01", () => {
  const result = routeFromLocation(new URL("https://example.com/group3/home/hsk1/lessons/lesson-01/scenes/scene-99/"));
  assert.equal(result.name, "contents");
  assert.equal(result.redirect, true);
  assert.equal(result.scene, undefined);
});

test("11. HSK3-L1 还 definition matches adverb usage", async () => {
  const meta = GROUP3_LESSONS.find((l) => l.id === "hsk3-l1");
  const lesson = await meta.load();
  const haiWord = lesson.vocabulary.find((w) => w.hanzi === "还");
  assert.ok(haiWord, "还 word must exist in hsk3-l1");
  assert.equal(haiWord.pinyin, "hái");
  assert.equal(haiWord.type, "adv.");
  assert.match(haiWord.th, /ยัง/);
});
