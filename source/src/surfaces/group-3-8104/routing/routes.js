import { findLesson } from "../content/registry.js";

export const GROUP3_LEVELS = Object.freeze(["hsk1", "hsk2", "hsk3"]);
export const GROUP3_GAME_SLUGS = Object.freeze([
  "vocab-blitz",
  "card-frenzy",
  "sound-sprint",
  "pinyin-dash",
]);
export const GROUP3_PRACTICE_TYPES = Object.freeze([
  "repeat-sentence",
  "image-description",
  "question-response",
]);

export const PROTECTED_ROUTE_NAMES = Object.freeze(new Set([
  "levels",
  "catalog",
  "contents",
  "vocabulary",
  "reader",
  "practice",
  "practice-exercise",
  "practice-summary",
]));

const LEVELS = new Set(GROUP3_LEVELS);
const PRACTICE_TYPES = new Set(GROUP3_PRACTICE_TYPES);
const GROUP3_SCENE_COUNT = 3;

function pathParts(pathname = "/") {
  const parts = String(pathname || "/").split("/").filter(Boolean);
  if (parts[0] && /^group\d+$/i.test(parts[0])) parts.shift();
  return parts.map((part) => part.toLowerCase());
}

function lessonSlug(value) {
  const match = String(value || "").match(/^lesson-(\d+)$/i);
  if (!match) return null;
  const number = Number(match[1]);
  return Number.isInteger(number) && number > 0 ? `lesson-${number}` : null;
}

function formatLessonSegment(slugOrNumber) {
  if (typeof slugOrNumber === "number") {
    return `lesson-${String(slugOrNumber).padStart(2, "0")}`;
  }
  const match = String(slugOrNumber || "").match(/^lesson-(\d+)$/i);
  if (match) {
    return `lesson-${String(Number(match[1])).padStart(2, "0")}`;
  }
  return String(slugOrNumber || "");
}

function sceneIndex(value, sceneCount = GROUP3_SCENE_COUNT) {
  const match = String(value || "").match(/^scene-(\d+)$/i);
  const number = match ? Number(match[1]) : Number.NaN;
  const safeCount = Number.isInteger(sceneCount) && sceneCount > 0 ? sceneCount : GROUP3_SCENE_COUNT;
  return Number.isInteger(number) && number >= 1 && number <= safeCount ? number - 1 : null;
}

function lessonSegment(lesson) {
  return `lesson-${String(Number(lesson.number)).padStart(2, "0")}`;
}

function routeLesson(route) {
  return route.level && route.lessonSlug
    ? findLesson(route.level, route.lessonSlug)
    : null;
}

export function getInitialTheme() {
  const queryTheme = new URLSearchParams(window.location.search).get("theme");
  if (queryTheme === "light" || queryTheme === "dark") return queryTheme;
  return window.matchMedia?.("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

export function normalizeSceneIndex(search, sceneCount = GROUP3_SCENE_COUNT) {
  const rawScene = new URLSearchParams(search).get("scene");
  const parsedScene = rawScene === null || rawScene.trim() === "" ? 1 : Number(rawScene);
  const scene = Number.isInteger(parsedScene) ? parsedScene : 1;
  const safeCount = Number.isInteger(sceneCount) && sceneCount > 0 ? sceneCount : GROUP3_SCENE_COUNT;
  return Math.min(safeCount, Math.max(1, scene)) - 1;
}

/* ============================================================
   CANONICAL ROUTE BUILDERS (Section 11)
   ============================================================ */

export function homePath() {
  return "/home/";
}

export function levelsPath() {
  return "/home/levels/";
}

export function levelPath(level) {
  if (!LEVELS.has(level)) return levelsPath();
  return `/home/${level}/`;
}

export function lessonBasePath(levelOrLesson, lessonSlugInput) {
  if (typeof levelOrLesson === "object" && levelOrLesson !== null) {
    const level = levelOrLesson.level || "hsk1";
    return `/home/${level}/lessons/${lessonSegment(levelOrLesson)}/`;
  }
  const level = String(levelOrLesson || "hsk1");
  const segment = formatLessonSegment(lessonSlugInput);
  return `/home/${level}/lessons/${segment}/`;
}

export function lessonContentsPath(levelOrLesson, lessonSlugInput) {
  return `${lessonBasePath(levelOrLesson, lessonSlugInput)}contents/`;
}

export function lessonVocabularyPath(levelOrLesson, lessonSlugInput) {
  return `${lessonBasePath(levelOrLesson, lessonSlugInput)}vocabulary/`;
}

export function lessonScenePath(levelOrLesson, lessonSlugOrSceneNum, sceneSlugOrNum) {
  if (typeof levelOrLesson === "object" && levelOrLesson !== null) {
    const safeScene = Math.max(1, Math.min(levelOrLesson.scenes?.length || GROUP3_SCENE_COUNT, Number(lessonSlugOrSceneNum) || 1));
    return `${lessonBasePath(levelOrLesson)}scenes/scene-${String(safeScene).padStart(2, "0")}/`;
  }
  let sceneSegment = "scene-01";
  if (typeof sceneSlugOrNum === "number") {
    sceneSegment = `scene-${String(Math.max(1, sceneSlugOrNum)).padStart(2, "0")}`;
  } else if (typeof sceneSlugOrNum === "string") {
    const match = sceneSlugOrNum.match(/^scene-(\d+)$/i);
    if (match) {
      sceneSegment = `scene-${String(Number(match[1])).padStart(2, "0")}`;
    } else {
      sceneSegment = sceneSlugOrNum;
    }
  }
  return `${lessonBasePath(levelOrLesson, lessonSlugOrSceneNum)}scenes/${sceneSegment}/`;
}

export function practicePath(level) {
  return LEVELS.has(level) ? `/home/${level}/practice/` : levelsPath();
}

export function practiceExercisePath(level, exerciseType) {
  const base = practicePath(level);
  return LEVELS.has(level) && PRACTICE_TYPES.has(exerciseType)
    ? `${base}${exerciseType}/`
    : base;
}

export function practiceSummaryPath(level) {
  return LEVELS.has(level) ? `/home/${level}/practice/summary/` : levelsPath();
}

/* Backward-compatible wrappers */
export function lessonPath(lesson, section = "contents") {
  const normalized = String(section || "contents").replace(/^\/+|\/+$/g, "").toLowerCase();
  if (normalized === "vocabulary") return lessonVocabularyPath(lesson);
  return lessonContentsPath(lesson);
}

export function scenePath(lesson, sceneNumber = 1) {
  return lessonScenePath(lesson, sceneNumber);
}

export function gamesPath(lesson) {
  return lessonContentsPath(lesson);
}

export function gamePath(lesson) {
  return lessonContentsPath(lesson);
}

export function frontMatterRoutes(lesson) {
  return [
    { name: "contents", path: lessonContentsPath(lesson), number: "I" },
    { name: "vocabulary", path: lessonVocabularyPath(lesson), number: "II" },
  ];
}

/* ============================================================
   ROUTER PARSER (Section 13 & 14)
   ============================================================ */

export function routeFromLocation(location = window.location) {
  const parts = pathParts(location.pathname);
  if (parts.length === 0) return { name: "home", redirect: true };

  const [home, level] = parts;
  if (home !== "home") return { name: "home", redirect: true };

  if (parts.length === 1) return { name: "home" };
  if (level === "levels") return { name: "levels" };

  // Invalid level normalization -> Levels
  if (!LEVELS.has(level)) {
    return { name: "levels", redirect: true };
  }

  // /home/:level/
  if (parts.length === 2) {
    return { level, name: "catalog" };
  }

  // /home/:level/practice/...
  if (parts[2] === "practice") {
    if (parts.length === 3) {
      return { level, name: "practice" };
    }
    // Match summary FIRST before generic exercise
    if (parts[3] === "summary") {
      return { level, name: "practice-summary" };
    }
    const exerciseType = parts[3];
    if (exerciseType && PRACTICE_TYPES.has(exerciseType)) {
      return { exerciseType, level, name: "practice-exercise" };
    }
    // Unknown exercise type -> redirect Practice Hub
    return { level, name: "practice", redirect: true };
  }

  // /home/:level/lessons/...
  if (parts[2] === "lessons") {
    const slug = lessonSlug(parts[3]);
    const lesson = slug ? findLesson(level, slug) : null;
    if (!lesson) {
      // Invalid lesson -> redirect to level catalog
      return { level, name: "catalog", redirect: true };
    }

    const canonicalSegment = lessonSegment(lesson);
    const hasUnpaddedLessonSlug = parts[3] !== canonicalSegment;

    // /home/:level/lessons/:lessonSlug/ -> redirect to /contents/
    if (parts.length === 4) {
      return { level, lessonSlug: lesson.slug, name: "contents", redirect: true };
    }

    const section = parts[4] || "contents";

    // Overview & Preface -> redirect to contents
    if (section === "overview" || section === "preface") {
      return { level, lessonSlug: lesson.slug, name: "contents", redirect: true };
    }

    // Games -> redirect to contents
    if (section === "games") {
      return { level, lessonSlug: lesson.slug, name: "contents", redirect: true };
    }

    if (section === "contents") {
      return {
        level,
        lessonSlug: lesson.slug,
        name: "contents",
        ...(hasUnpaddedLessonSlug ? { redirect: true } : {}),
      };
    }

    if (section === "vocabulary") {
      return {
        level,
        lessonSlug: lesson.slug,
        name: "vocabulary",
        ...(hasUnpaddedLessonSlug ? { redirect: true } : {}),
      };
    }

    if (section === "scenes") {
      const scene = sceneIndex(parts[5], lesson.scenes?.length);
      if (scene === null) {
        // Invalid scene -> lesson contents
        return { level, lessonSlug: lesson.slug, name: "contents", redirect: true };
      }
      const canonicalSceneSegment = `scene-${String(scene + 1).padStart(2, "0")}`;
      const hasUnpaddedScene = parts[5] !== canonicalSceneSegment;
      return {
        level,
        lessonSlug: lesson.slug,
        name: "reader",
        scene,
        ...(hasUnpaddedLessonSlug || hasUnpaddedScene ? { redirect: true } : {}),
      };
    }

    // Any unrecognized section -> redirect to contents
    return { level, lessonSlug: lesson.slug, name: "contents", redirect: true };
  }

  // Legacy route fallbacks: /home/:level/lesson-1/...
  const legacySlug = lessonSlug(parts[2]);
  if (legacySlug) {
    const lesson = findLesson(level, legacySlug);
    if (!lesson) return { level, name: "catalog", redirect: true };
    const leaf = parts[3];
    if (leaf === "vocabulary") {
      return { level, lessonSlug: lesson.slug, name: "vocabulary", redirect: true };
    }
    if (leaf === "scenes") {
      const scene = sceneIndex(parts[4], lesson.scenes?.length);
      return scene === null
        ? { level, lessonSlug: lesson.slug, name: "contents", redirect: true }
        : { level, lessonSlug: lesson.slug, name: "reader", scene, redirect: true };
    }
    return { level, lessonSlug: lesson.slug, name: "contents", redirect: true };
  }

  return { level, name: "catalog", redirect: true };
}

export function canonicalPathForRoute(route) {
  if (route.name === "home") return homePath();
  if (route.name === "levels") return levelsPath();
  if (route.name === "catalog") return levelPath(route.level);
  if (route.name === "practice") return practicePath(route.level);
  if (route.name === "practice-exercise") return practiceExercisePath(route.level, route.exerciseType);
  if (route.name === "practice-summary") return practiceSummaryPath(route.level);
  const lesson = routeLesson(route);
  if (!lesson) return levelPath(route.level);
  if (route.name === "reader") return lessonScenePath(lesson, Number(route.scene) + 1);
  if (route.name === "vocabulary") return lessonVocabularyPath(lesson);
  if (route.name === "contents") return lessonContentsPath(lesson);
  return lessonContentsPath(lesson);
}

export function locationForRoute(path, { hash = "", location = window.location, theme = "" } = {}) {
  const hasGroupPrefix = /^\/group3(?:\/|$)/i.test(location.pathname);
  const prefix = hasGroupPrefix ? "/group3" : "";
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const activeTheme = theme || new URLSearchParams(location.search).get("theme");
  const params = new URLSearchParams();
  if (activeTheme === "light" || activeTheme === "dark") params.set("theme", activeTheme);
  const search = params.size ? `?${params}` : "";
  const normalizedHash = hash ? (hash.startsWith("#") ? hash : `#${hash}`) : "";
  return `${prefix}${cleanPath}${search}${normalizedHash}`;
}
