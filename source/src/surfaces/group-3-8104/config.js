import { surfaceAssetPath } from "@lib";


export const surfaceConfig = Object.freeze({
  key: "group-3-8104",
  groupId: 3,
  port: 8104,
});

export const GROUP3_PLAYBACK_CONFIG = Object.freeze({
  audioTimeoutMs: 14000,
  challengeDelayMs: 420,
  defaultSpeed: 1,
  lineGapMs: 480,
  silentLineMs: 1350,
  speedOptions: Object.freeze([0.85, 1, 1.15]),
});

export const GROUP3_WEBP_REVISION = "scene-art-20260811";

function lessonMediaRoot(lesson) {
  const level = String(lesson?.level || "").toLowerCase();
  const number = Number(lesson?.number);
  if (!/^hsk[123]$/.test(level) || !Number.isInteger(number) || number < 1) {
    throw new TypeError("Group 3 lesson media requires a valid level and lesson number");
  }
  return `/assets/group3/lessons/${level}/lesson-${String(number).padStart(2, "0")}`;
}

export function group3AssetPath(path) {
  const assetPath = surfaceAssetPath(surfaceConfig.groupId, path);
  return path.startsWith("/assets/group3/") && path.endsWith(".webp")
    ? `${assetPath}?v=${GROUP3_WEBP_REVISION}`
    : assetPath;
}

export function group3LessonAssetPath(lesson, relativePath) {
  const cleanRelativePath = String(relativePath || "").replace(/^\/+/, "");
  if (!cleanRelativePath || cleanRelativePath.includes("..")) {
    throw new TypeError("Group 3 lesson media requires a safe relative path");
  }
  return group3AssetPath(`${lessonMediaRoot(lesson)}/${cleanRelativePath}`);
}

export function group3SceneMedia(lesson, sceneIndex) {
  const sceneNumber = Number(sceneIndex) + 1;
  if (!Number.isInteger(sceneNumber) || sceneNumber < 1) {
    throw new TypeError("Group 3 scene media requires a zero-based scene index");
  }
  const scene = `scene-${String(sceneNumber).padStart(2, "0")}`;
  const small = group3LessonAssetPath(lesson, `scenes/${scene}-720w.webp`);
  const full = group3LessonAssetPath(lesson, `scenes/${scene}-1400w.webp`);
  return {
    image: full,
    imageSrcSet: `${small} 720w, ${full} 1400w`,
  };
}
