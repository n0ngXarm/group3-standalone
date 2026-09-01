import { PRACTICE_ERROR_CODES } from "../../features/practice/errors.js";
import { dialogueVoicePath } from "../../services/audio/voices.js";
import { GROUP3_LESSONS } from "../registry.js";

export const DEFAULT_REPEAT_RESPONSE_WINDOW_MS = 10000;
export const DEFAULT_REPEAT_SESSION_SIZE = 10;

function sourceError(sourceRef) {
  const error = new Error(PRACTICE_ERROR_CODES.EXERCISE_SOURCE_NOT_FOUND);
  error.code = PRACTICE_ERROR_CODES.EXERCISE_SOURCE_NOT_FOUND;
  error.sourceRef = { ...sourceRef };
  return error;
}

async function loadLesson(lessonMeta) {
  return typeof lessonMeta?.load === "function" ? lessonMeta.load() : lessonMeta;
}

function exerciseFromLine({ lesson, line, lineIndex, scene, sceneIndex }) {
  const sourceRef = {
    lessonId: lesson.id,
    lineId: line.id,
    lineIndex,
    sceneId: scene.id,
  };
  return {
    exerciseId: `repeat-sentence:${lesson.id}:${scene.id}:${lineIndex}`,
    hanzi: line.hanzi,
    level: lesson.level,
    pinyin: line.pinyin || line.reading || "",
    referenceAudio: dialogueVoicePath(lesson, sceneIndex, lineIndex),
    sourceRef,
    timing: { responseWindowMs: DEFAULT_REPEAT_RESPONSE_WINDOW_MS },
    translations: {
      en: line.en || "",
      th: line.th || "",
    },
    type: "repeat-sentence",
  };
}

export async function resolveRepeatExercise(sourceRef = {}) {
  const lessonMeta = GROUP3_LESSONS.find((lesson) => lesson.id === sourceRef.lessonId);
  if (!lessonMeta) throw sourceError(sourceRef);
  const lesson = await loadLesson(lessonMeta);
  const sceneIndex = lesson?.scenes?.findIndex((scene) => scene.id === sourceRef.sceneId) ?? -1;
  const lineIndex = Number(sourceRef.lineIndex);
  const scene = sceneIndex >= 0 ? lesson.scenes[sceneIndex] : null;
  const line = Number.isInteger(lineIndex) && lineIndex >= 0 ? scene?.lines?.[lineIndex] : null;
  if (!scene || !line?.hanzi || (sourceRef.lineId && sourceRef.lineId !== line.id)) throw sourceError(sourceRef);
  return exerciseFromLine({ lesson, line, lineIndex, scene, sceneIndex });
}

export async function buildRepeatSessionDefinitions(level, { limit = DEFAULT_REPEAT_SESSION_SIZE } = {}) {
  const normalizedLevel = String(level ?? "").toLowerCase();
  const lessonMetas = GROUP3_LESSONS.filter((lesson) => lesson.level === normalizedLevel);
  const safeLimit = Number(limit);
  if (!lessonMetas.length || !Number.isInteger(safeLimit) || safeLimit < 1) {
    throw sourceError({ level: normalizedLevel });
  }

  const exercises = [];
  for (const lessonMeta of lessonMetas) {
    const lesson = await loadLesson(lessonMeta);
    for (let sceneIndex = 0; sceneIndex < (lesson.scenes?.length ?? 0); sceneIndex += 1) {
      const scene = lesson.scenes[sceneIndex];
      for (let lineIndex = 0; lineIndex < (scene.lines?.length ?? 0); lineIndex += 1) {
        const line = scene.lines[lineIndex];
        if (line?.hanzi) exercises.push(exerciseFromLine({ lesson, line, lineIndex, scene, sceneIndex }));
        if (exercises.length === safeLimit) return exercises;
      }
    }
  }
  throw sourceError({ level: normalizedLevel, requiredCount: safeLimit });
}
