import assert from "node:assert/strict";
import { test } from "node:test";

const adapterModule = "../../src/surfaces/group-3-8104/content/practice/repeatAdapter.js";

test("repeat adapter resolves lesson scene lines without duplicating or mutating source content", async () => {
  const { resolveRepeatExercise } = await import(adapterModule);
  const sourceRef = { lessonId: "hsk1-l1", lineIndex: 0, sceneId: "hsk1-l1-s1" };
  const first = await resolveRepeatExercise(sourceRef);
  assert.deepEqual(first, {
    exerciseId: "repeat-sentence:hsk1-l1:hsk1-l1-s1:0",
    hanzi: "AI小语，你好！",
    level: "hsk1",
    pinyin: "AI xiǎoyǔ, nǐ hǎo",
    referenceAudio: "/assets/group3/lessons/hsk1/lesson-01/audio/scene-01/line-01.mp3?v=voice-cast-20260811-v1",
    sourceRef,
    timing: { responseWindowMs: 10000 },
    translations: { en: "Hello, AI Xiaoyu!", th: "สวัสดีจ้า AI เสี่ยวหวี่!" },
    type: "repeat-sentence",
  });

  first.sourceRef.lineIndex = 99;
  const second = await resolveRepeatExercise(sourceRef);
  assert.equal(second.sourceRef.lineIndex, 0);
  assert.equal(second.hanzi, "AI小语，你好！");
});

test("repeat adapter loads lazy lesson sources for HSK2 and HSK3", async () => {
  const { resolveRepeatExercise } = await import(adapterModule);
  const hsk2 = await resolveRepeatExercise({ lessonId: "hsk2-l1", lineIndex: 0, sceneId: "hsk2-l1-s1" });
  const hsk3 = await resolveRepeatExercise({ lessonId: "hsk3-l1", lineIndex: 0, sceneId: "hsk3-l1-s1" });
  assert.equal(hsk2.level, "hsk2");
  assert.match(hsk2.referenceAudio, /lessons\/hsk2\/lesson-01\/audio\/scene-01\/line-01\.mp3/);
  assert.equal(hsk3.level, "hsk3");
  assert.match(hsk3.referenceAudio, /lessons\/hsk3\/lesson-01\/audio\/scene-01\/line-01\.mp3/);
});

test("session source builder derives exactly ten references per supported HSK level", async () => {
  const { buildRepeatSessionDefinitions } = await import(adapterModule);
  for (const level of ["hsk1", "hsk2", "hsk3"]) {
    const exercises = await buildRepeatSessionDefinitions(level);
    assert.equal(exercises.length, 10);
    assert.equal(new Set(exercises.map((exercise) => exercise.exerciseId)).size, 10);
    assert.ok(exercises.every((exercise) => exercise.level === level));
    assert.ok(exercises.every((exercise) => exercise.sourceRef.lessonId.startsWith(level)));
    assert.ok(exercises.every((exercise) => exercise.timing.responseWindowMs === 10000));
  }
});

test("adapter reports stable source errors and rejects unsupported levels", async () => {
  const { buildRepeatSessionDefinitions, resolveRepeatExercise } = await import(adapterModule);
  await assert.rejects(
    resolveRepeatExercise({ lessonId: "hsk1-l1", lineIndex: 99, sceneId: "hsk1-l1-s1" }),
    (error) => error.code === "EXERCISE_SOURCE_NOT_FOUND",
  );
  await assert.rejects(
    resolveRepeatExercise({ lessonId: "missing", lineIndex: 0, sceneId: "missing" }),
    (error) => error.code === "EXERCISE_SOURCE_NOT_FOUND",
  );
  await assert.rejects(
    buildRepeatSessionDefinitions("hsk4"),
    (error) => error.code === "EXERCISE_SOURCE_NOT_FOUND",
  );
});
