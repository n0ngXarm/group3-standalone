#!/usr/bin/env node

import { access, lstat, mkdir, readFile, rename, symlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { GROUP3_LESSONS } from "../../apps/frontend/src/surfaces/group-3-8104/content/registry.js";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const ASSET_ROOT = path.join(ROOT, "apps/frontend/public/assets/group3");
const APPLY = process.argv.includes("--apply");
const moves = new Map();
const targetOwners = new Map();
const audioCanonicalByFile = new Map();

function pad(value) {
  return String(value).padStart(2, "0");
}

function assetRelative(url) {
  const pathname = new URL(String(url), "https://group3.local").pathname
    .replace(/^\/group3(?=\/)/, "");
  const prefix = "/assets/group3/";
  if (!pathname.startsWith(prefix)) throw new Error(`Unexpected Group 3 asset URL: ${url}`);
  return pathname.slice(prefix.length);
}

function srcSetCandidates(srcSet) {
  return String(srcSet || "")
    .split(",")
    .map((candidate) => candidate.trim().split(/\s+/)[0])
    .filter(Boolean);
}

function registerMove(source, target) {
  if (source === target) return;
  const owner = targetOwners.get(target);
  if (owner && owner !== source) {
    throw new Error(`Canonical target collision: ${target} <- ${owner}, ${source}`);
  }
  targetOwners.set(target, source);
  if (!moves.has(source)) moves.set(source, new Set());
  moves.get(source).add(target);
}

async function exists(file) {
  try {
    await access(file);
    return true;
  } catch {
    return false;
  }
}

function inferredSmallImage(source) {
  if (source.endsWith("-v1.webp")) return source.replace(/-v1\.webp$/, "-720w-v1.webp");
  if (source.endsWith(".webp")) return source.replace(/\.webp$/, "-720w.webp");
  return null;
}

async function registerLessonMedia(lesson) {
  const lessonRoot = `lessons/${lesson.level}/lesson-${pad(lesson.number)}`;
  for (const [sceneIndex, scene] of lesson.scenes.entries()) {
    const sceneBase = `${lessonRoot}/scenes/scene-${pad(sceneIndex + 1)}`;
    const candidates = [scene.image, ...srcSetCandidates(scene.imageSrcSet)]
      .filter(Boolean)
      .map(assetRelative);
    const full = candidates.find((candidate) => !candidate.includes("720w")) || candidates[0];
    const small = candidates.find((candidate) => candidate.includes("720w"))
      || inferredSmallImage(full);

    if (!full || !(await exists(path.join(ASSET_ROOT, full)))) {
      throw new Error(`Missing full scene image: ${lesson.level}/${lesson.slug}/${scene.id}`);
    }
    registerMove(full, `${sceneBase}-1400w.webp`);

    if (!small || !(await exists(path.join(ASSET_ROOT, small)))) {
      throw new Error(`Missing 720w scene image: ${lesson.level}/${lesson.slug}/${scene.id}`);
    }
    registerMove(small, `${sceneBase}-720w.webp`);

    for (const [lineIndex] of scene.lines.entries()) {
      const filename = `${scene.id}-${pad(lineIndex + 1)}.mp3`;
      const source = `voices/${filename}`;
      const target = `${lessonRoot}/audio/scene-${pad(sceneIndex + 1)}/line-${pad(lineIndex + 1)}.mp3`;
      if (!(await exists(path.join(ASSET_ROOT, source)))) {
        throw new Error(`Missing dialogue audio: ${source}`);
      }
      registerMove(source, target);
      audioCanonicalByFile.set(filename, target);
    }
  }
}

function registerSharedMedia() {
  for (const filename of [
    "character-fruit-vendor.webp",
    "character-liu-ming.webp",
    "character-shop-assistant.webp",
    "character-wang-yixue.webp",
  ]) {
    registerMove(filename, `shared/characters/${filename}`);
  }
  registerMove("hero-market-v2.webp", "shared/backgrounds/hero-market-v2.webp");
  registerMove("reading-background-v1.webp", "shared/backgrounds/reading-background-v1.webp");
}

function registerGameMedia() {
  for (const game of ["vocab-blitz", "card-frenzy", "sound-sprint", "pinyin-dash"]) {
    registerMove(`games/${game}-640w.webp`, `games/${game}/cover-640w.webp`);
    registerMove(`games/${game}-960w.webp`, `games/${game}/cover-960w.webp`);
  }
}

async function createRelativeSymlink(linkFile, targetFile) {
  await mkdir(path.dirname(linkFile), { recursive: true });
  const relativeTarget = path.relative(path.dirname(linkFile), targetFile);
  await symlink(relativeTarget, linkFile);
}

async function applyMove(sourceRelative, targetRelatives) {
  const source = path.join(ASSET_ROOT, sourceRelative);
  const targets = [...targetRelatives].sort();
  const primary = path.join(ASSET_ROOT, targets[0]);
  const sourceInfo = await lstat(source);
  if (sourceInfo.isSymbolicLink()) {
    for (const target of targets) {
      if (!(await exists(path.join(ASSET_ROOT, target)))) {
        throw new Error(`Migrated alias has a missing canonical target: ${sourceRelative} -> ${target}`);
      }
    }
    return;
  }
  if (await exists(primary)) {
    throw new Error(`Refusing to overwrite an existing canonical target: ${targets[0]}`);
  }

  await mkdir(path.dirname(primary), { recursive: true });
  await rename(source, primary);
  for (const targetRelative of targets.slice(1)) {
    await createRelativeSymlink(path.join(ASSET_ROOT, targetRelative), primary);
  }
  await createRelativeSymlink(source, primary);
}

async function updateManifest() {
  const legacyManifest = path.join(ASSET_ROOT, "voices/manifest.json");
  const canonicalManifest = path.join(ASSET_ROOT, "audio/manifest.json");
  const canonicalExists = await exists(canonicalManifest);
  const manifestSource = canonicalExists ? canonicalManifest : legacyManifest;
  const manifest = JSON.parse(await readFile(manifestSource, "utf8"));
  const files = manifest.files.map((entry) => {
    const canonicalFile = audioCanonicalByFile.get(entry.file);
    if (!canonicalFile) throw new Error(`Manifest entry has no canonical audio mapping: ${entry.file}`);
    const match = canonicalFile.match(/^lessons\/(hsk\d)\/lesson-(\d+)\/audio\/scene-(\d+)\/line-(\d+)\.mp3$/);
    return {
      ...entry,
      canonicalFile,
      level: match[1],
      lesson: Number(match[2]),
      scene: Number(match[3]),
      line: Number(match[4]),
    };
  });

  await mkdir(path.dirname(canonicalManifest), { recursive: true });
  if (!canonicalExists) await rename(legacyManifest, canonicalManifest);
  await writeFile(canonicalManifest, `${JSON.stringify({ ...manifest, files }, null, 2)}\n`);
  const legacyInfo = await lstat(legacyManifest).catch(() => null);
  if (!legacyInfo) await createRelativeSymlink(legacyManifest, canonicalManifest);
  else if (!legacyInfo.isSymbolicLink()) {
    throw new Error("Legacy manifest compatibility path exists but is not a symlink");
  }
}

const lessons = await Promise.all(GROUP3_LESSONS.map((lesson) => lesson.load ? lesson.load() : lesson));
for (const lesson of lessons) await registerLessonMedia(lesson);
registerSharedMedia();
registerGameMedia();

const targetCount = [...moves.values()].reduce((count, targets) => count + targets.size, 0);
const summary = {
  apply: APPLY,
  lessons: lessons.length,
  scenes: lessons.reduce((count, lesson) => count + lesson.scenes.length, 0),
  dialogueLines: audioCanonicalByFile.size,
  sourceFiles: moves.size,
  canonicalTargets: targetCount,
  compatibilityAliases: moves.size + 1,
};

if (APPLY) {
  for (const [source, targets] of moves) await applyMove(source, targets);
  await updateManifest();
}

process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
