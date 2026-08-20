import { findLesson } from "../content/registry.js";

export const GROUP3_LEVELS = Object.freeze(["hsk1", "hsk2", "hsk3"]);
export const GROUP3_GAME_SLUGS = Object.freeze([
  "vocab-blitz",
  "card-frenzy",
  "sound-sprint",
  "pinyin-dash",
]);

const LEVELS = new Set(GROUP3_LEVELS);
const GAMES = new Set(GROUP3_GAME_SLUGS);
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

export function levelPath(level) {
  if (!LEVELS.has(level)) return "/home/";
  return `/home/${level}/`;
}

export function lessonBasePath(lesson) {
  return `/home/${lesson.level}/lessons/${lessonSegment(lesson)}/`;
}

export function lessonPath(lesson, section = "overview") {
  const normalized = section === "preface" ? "overview" : String(section || "overview").replace(/^\/+|\/+$/g, "");
  return `${lessonBasePath(lesson)}${normalized}/`;
}

export function scenePath(lesson, sceneNumber = 1) {
  const safeScene = Math.max(1, Math.min(lesson.scenes?.length || GROUP3_SCENE_COUNT, Number(sceneNumber) || 1));
  return `${lessonBasePath(lesson)}scenes/scene-${String(safeScene).padStart(2, "0")}/`;
}

export function gamesPath(lesson) {
  return `${lessonBasePath(lesson)}games/`;
}

export function gamePath(lesson, gameSlug) {
  return GAMES.has(gameSlug) ? `${gamesPath(lesson)}${gameSlug}/` : gamesPath(lesson);
}

export function frontMatterRoutes(lesson) {
  return [
    { name: "preface", path: lessonPath(lesson, "overview"), number: "I" },
    { name: "contents", path: lessonPath(lesson, "contents"), number: "II" },
    { name: "vocabulary", path: lessonPath(lesson, "vocabulary"), number: "III" },
  ];
}

export function routeFromLocation(location = window.location) {
  const parts = pathParts(location.pathname);
  const [home, level] = parts;
  if (home !== "home") return { name: "home" };
  if (level === "levels") return { name: "levels" };
  if (!LEVELS.has(level)) return { name: "home" };
  if (parts.length === 2) {
    return { level, name: "catalog" };
  }

  if (parts[2] === "lessons") {
    const slug = lessonSlug(parts[3]);
    const lesson = slug ? findLesson(level, slug) : null;
    if (!lesson) return { level, name: "catalog" };

    const section = parts[4] || "overview";
    if (section === "overview") return { level, lessonSlug: slug, name: "preface" };
    if (section === "contents") return { level, lessonSlug: slug, name: "contents" };
    if (section === "vocabulary") return { level, lessonSlug: slug, name: "vocabulary" };
    if (section === "scenes") {
      const scene = sceneIndex(parts[5], lesson.scenes?.length);
      return scene === null
        ? { level, lessonSlug: slug, name: "preface" }
        : { level, lessonSlug: slug, name: "reader", scene };
    }
    if (section === "games") {
      const gameSlug = parts[5];
      return gameSlug && GAMES.has(gameSlug)
        ? { gameSlug, level, lessonSlug: slug, name: "game" }
        : { level, lessonSlug: slug, name: "games" };
    }
    return { level, lessonSlug: slug, name: "preface" };
  }

  const legacySlug = lessonSlug(parts[2]);
  if (legacySlug) {
    const lesson = findLesson(level, legacySlug);
    if (!lesson) return { name: "catalog" };
    const leaf = parts[3];
    if (leaf === "preface" || leaf === "overview") return { level, lessonSlug: legacySlug, name: "preface" };
    if (leaf === "contents") return { level, lessonSlug: legacySlug, name: "contents" };
    if (leaf === "vocabulary") return { level, lessonSlug: legacySlug, name: "vocabulary" };
    if (leaf === "games") {
      const gameSlug = parts[4];
      return gameSlug && GAMES.has(gameSlug)
        ? { gameSlug, level, lessonSlug: legacySlug, name: "game" }
        : { level, lessonSlug: legacySlug, name: "games" };
    }
    return {
      level,
      lessonSlug: legacySlug,
      name: "reader",
      scene: normalizeSceneIndex(location.search, lesson.scenes?.length),
    };
  }

  return { level, name: "catalog" };
}

export function canonicalPathForRoute(route) {
  if (route.name === "home") return "/home/";
  if (route.name === "levels") return "/home/levels/";
  if (route.name === "catalog") return levelPath(route.level);
  const lesson = routeLesson(route);
  if (!lesson) return levelPath(route.level);
  if (route.name === "reader") return scenePath(lesson, Number(route.scene) + 1);
  if (route.name === "contents") return lessonPath(lesson, "contents");
  if (route.name === "vocabulary") return lessonPath(lesson, "vocabulary");
  if (route.name === "games") return gamesPath(lesson);
  if (route.name === "game") return gamePath(lesson, route.gameSlug);
  return lessonPath(lesson, "overview");
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
