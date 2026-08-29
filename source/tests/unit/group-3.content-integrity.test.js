import assert from "node:assert/strict";
import test from "node:test";

import { GROUP3_LESSONS } from "../../src/surfaces/group-3-8104/content/registry.js";

async function loadLessons() {
  return Promise.all(GROUP3_LESSONS.map((meta) => typeof meta.load === "function" ? meta.load() : meta));
}

test("all seven lessons expose one explicit ownership chain", async () => {
  const lessons = await loadLessons();
  assert.equal(lessons.length, 7);

  const lessonIds = new Set();
  const sceneIds = new Set();
  const dialogueIds = new Set();
  const vocabularyIds = new Set();
  const qteIds = new Set();
  const builderIds = new Set();
  let dialogueCount = 0;

  for (const lesson of lessons) {
    assert.ok(!lessonIds.has(lesson.id), `duplicate lesson ${lesson.id}`);
    lessonIds.add(lesson.id);
    assert.ok(lesson.title.zh && lesson.title.pinyin && lesson.title.thAid);
    assert.equal(lesson.scenes.length, 2, `${lesson.id} scene count`);

    for (const word of lesson.vocabulary) {
      assert.equal(word.lessonId, lesson.id, `${lesson.id} vocabulary owner`);
      assert.ok(word.id && !vocabularyIds.has(word.id), `duplicate vocabulary ${word.id}`);
      vocabularyIds.add(word.id);
      assert.ok(word.hanzi && word.pinyin && (word.thAid || word.th), `${word.id} required languages`);
    }

    for (const scene of lesson.scenes) {
      assert.equal(scene.lessonId, lesson.id, `${scene.id} lesson owner`);
      assert.ok(!sceneIds.has(scene.id), `duplicate scene ${scene.id}`);
      sceneIds.add(scene.id);
      assert.doesNotMatch(scene.context, /\p{Script=Thai}/u, `${scene.id} Chinese context`);
      for (const character of scene.characters) {
        assert.equal(character.image, scene.image, `${scene.id}/${character.profile} avatar image owner`);
        assert.equal(character.imageSrcSet, scene.imageSrcSet, `${scene.id}/${character.profile} avatar srcset owner`);
        assert.ok(lesson.characters[character.profile], `${scene.id}/${character.profile} character profile`);
      }

      scene.lines.forEach((line) => {
        dialogueCount += 1;
        assert.equal(line.lessonId, lesson.id, `${scene.id} dialogue lesson owner`);
        assert.equal(line.sceneId, scene.id, `${scene.id} dialogue scene owner`);
        assert.ok(line.id && !dialogueIds.has(line.id), `duplicate dialogue ${line.id}`);
        dialogueIds.add(line.id);
        assert.ok(line.hanzi && line.pinyin && line.th, `${line.id} required languages`);
      });

      assert.equal(scene.qte.lessonId, lesson.id);
      assert.equal(scene.qte.sceneId, scene.id);
      assert.ok(scene.qte.id && !qteIds.has(scene.qte.id));
      qteIds.add(scene.qte.id);
      assert.ok(scene.qte.prompt.zh && scene.qte.prompt.pinyin && scene.qte.prompt.th);
      assert.doesNotMatch(scene.qte.prompt.th, /\p{Script=Han}/u, `${scene.id} Thai QTE prompt`);
      assert.equal(scene.qte.options.filter((option) => option.value === scene.qte.correct).length, 1);
      assert.ok(scene.qte.options.every((option) => option.zh && option.pinyin && option.th));

      assert.equal(scene.builder.lessonId, lesson.id);
      assert.equal(scene.builder.sceneId, scene.id);
      assert.ok(scene.builder.id && !builderIds.has(scene.builder.id));
      builderIds.add(scene.builder.id);
      assert.equal(scene.builder.pinyin.length, scene.builder.answer.length, `${scene.id} builder pinyin`);
      assert.deepEqual([...scene.builder.tiles].sort(), [...scene.builder.answer].sort(), `${scene.id} builder tokens`);
    }
  }

  assert.equal(dialogueCount, 54);
  assert.equal(qteIds.size, 14);
  assert.equal(builderIds.size, 14);
});

test("recomposed scenes resolve their explicit existing media assets", async () => {
  const lessons = await loadLessons();
  const scenes = new Map(lessons.flatMap((lesson) => lesson.scenes.map((scene) => [scene.id, scene])));
  const expected = {
    "hsk1-l3-s1": "/hsk1/lesson-03/scenes/scene-02-1400w.webp",
    "hsk1-l3-s2": "/hsk1/lesson-03/scenes/scene-04-1400w.webp",
    "hsk2-l1-s2": "/hsk2/lesson-01/scenes/scene-03-1400w.webp",
    "hsk2-l2-s2": "/hsk2/lesson-02/scenes/scene-03-1400w.webp",
    "hsk3-l1-s2": "/hsk3/lesson-01/scenes/scene-03-1400w.webp",
    "hsk3-l2-s1": "/hsk3/lesson-02/scenes/scene-03-1400w.webp",
    "hsk3-l2-s2": "/hsk3/lesson-18/scenes/scene-02-1400w.webp",
  };

  for (const [sceneId, suffix] of Object.entries(expected)) {
    assert.ok(scenes.get(sceneId)?.image.includes(suffix), `${sceneId} should use ${suffix}`);
  }
});

test("runtime vocabulary excludes known cross-lesson leftovers", async () => {
  const lessons = await loadLessons();
  const forbidden = {
    "hsk1-l1": ["医院", "出租车", "爸爸"],
    "hsk1-l3": ["大学", "医生", "弟弟"],
    "hsk2-l1": ["奶茶", "电影院", "大学"],
    "hsk3-l1": ["洗衣机", "爬", "山"],
    "hsk3-l2": ["图书馆", "动物园", "大熊猫"],
  };

  for (const lesson of lessons) {
    const words = new Set(lesson.vocabulary.map((word) => word.hanzi));
    for (const hanzi of forbidden[lesson.id] || []) {
      assert.ok(!words.has(hanzi), `${lesson.id} contains stale vocabulary ${hanzi}`);
    }
    assert.ok(lesson.vocabulary.length >= 20, `${lesson.id} needs a useful owned vocabulary pool`);
  }
});

test("HSK3 lesson 1 title describes its restaurant and train scenes", async () => {
  const lesson = (await loadLessons()).find((entry) => entry.id === "hsk3-l1");
  assert.equal(lesson.title.zh, "饭馆美食与高铁之旅");
  assert.equal(lesson.title.thAid, "อาหารในร้านและทริปรถไฟความเร็วสูง");
});
