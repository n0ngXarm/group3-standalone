import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { GROUP3_LESSONS } from "../src/surfaces/group-3-8104/content/registry.js";
import { dialogueVoicePath } from "../src/surfaces/group-3-8104/services/audio/voices.js";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const SOURCE_ROOT = path.resolve(SCRIPT_DIR, "..");
const REPOSITORY_ROOT = path.resolve(SOURCE_ROOT, "..");
const PUBLIC_ROOT = path.join(SOURCE_ROOT, "public");
const GROUP3_ASSET_ROOT = path.join(PUBLIC_ROOT, "assets/group3");
const VOICE_ROOT = path.join(GROUP3_ASSET_ROOT, "voices");
const LESSON_AUDIO_ROOT = path.join(GROUP3_ASSET_ROOT, "lessons");
const GENERATOR_SOURCE = path.join(REPOSITORY_ROOT, "scripts/media/generate-group3-voices-8104.py");
const AUDIO_MANIFEST = path.join(GROUP3_ASSET_ROOT, "audio/manifest.json");
const PAYLOAD_PROVENANCE = path.join(SCRIPT_DIR, "audio-payload-provenance.json");

function sha256(buffer) {
  return createHash("sha256").update(buffer).digest("hex");
}

function pad(value) {
  return String(value).padStart(2, "0");
}

function assetFileFromUrl(url) {
  const pathname = new URL(url, "https://group3.audit").pathname.replace(/^\/group3(?=\/)/, "");
  if (!pathname.startsWith("/assets/group3/")) {
    throw new TypeError(`Unexpected Group3 audio URL: ${url}`);
  }
  return path.join(PUBLIC_ROOT, pathname.slice(1));
}

function canonicalRelativeFromUrl(url) {
  return new URL(url, "https://group3.audit").pathname
    .replace(/^\/group3(?=\/)/, "")
    .replace(/^\/assets\/group3\//, "");
}

function resolvedOwnership(url) {
  const canonical = canonicalRelativeFromUrl(url);
  const match = canonical.match(
    /^lessons\/(hsk[123])\/lesson-(\d{2})\/audio\/scene-(\d{2})\/line-(\d{2})\.mp3$/,
  );
  return match
    ? { canonical, level: match[1], lesson: Number(match[2]), scene: Number(match[3]), line: Number(match[4]) }
    : { canonical, level: "", lesson: NaN, scene: NaN, line: NaN };
}

export function parseVoiceGenerationSource(source) {
  const records = [];
  const tuple = /^\s*\('([^']+)',\s*'([^']+)',\s*'([^']*)'\),\s*$/gm;
  for (const match of source.matchAll(tuple)) {
    records.push({ file: `${match[1]}.mp3`, profile: match[2], text: match[3] });
  }
  return records;
}

export function classifyAudioMapping({
  actualProfile,
  actualText,
  duplicateExpectedTexts = [],
  exists,
  expectedProfile,
  expectedText,
  ownership = null,
}) {
  if (!exists) return "MISSING";
  if (new Set(duplicateExpectedTexts).size > 1) return "DUPLICATE_AUDIO";
  if (ownership) {
    if (ownership.level !== ownership.expectedLevel || ownership.lesson !== ownership.expectedLesson) {
      return "WRONG_LESSON";
    }
    if (ownership.scene !== ownership.expectedScene) return "WRONG_SCENE";
    if (ownership.line !== ownership.expectedLine) return "WRONG_LINE";
  }
  if (!actualText || !actualProfile) return "FALLBACK_TTS";
  if (actualText !== expectedText || actualProfile !== expectedProfile) return "WRONG_LINE";
  return "MATCH";
}

async function filesBelow(root) {
  if (!existsSync(root)) return [];
  const files = [];
  const visit = async (directory) => {
    const entries = await readdir(directory, { withFileTypes: true });
    for (const entry of entries) {
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) await visit(file);
      else if (entry.isFile() && entry.name.endsWith(".mp3")) files.push(file);
    }
  };
  await visit(root);
  return files.sort();
}

async function hashFiles(files) {
  const byHash = new Map();
  for (const file of files) {
    const hash = sha256(await readFile(file));
    const group = byHash.get(hash) || [];
    group.push(file);
    byHash.set(hash, group);
  }
  return byHash;
}

function durationSeconds(file) {
  const args = [
    "-v", "error",
    "-show_entries", "format=duration",
    "-of", "default=noprint_wrappers=1:nokey=1",
    file,
  ];
  try {
    return Number(execFileSync("ffprobe", args, { encoding: "utf8" }).trim());
  } catch (error) {
    const captured = String(error?.stdout || "").trim();
    return captured ? Number(captured) : null;
  }
}

function expectedHanziUnits(text) {
  return [...String(text || "")].filter((character) => /[\p{Script=Han}A-Za-z0-9]/u.test(character)).length;
}

async function payloadProvenance() {
  const generator = await readFile(GENERATOR_SOURCE, "utf8");
  const records = parseVoiceGenerationSource(generator);
  const currentLegacyByHash = new Map();
  for (const record of records) {
    const file = path.join(VOICE_ROOT, record.file);
    if (!existsSync(file)) continue;
    const hash = sha256(await readFile(file));
    const group = currentLegacyByHash.get(hash) || [];
    group.push({ ...record, filePath: file, hash });
    currentLegacyByHash.set(hash, group);
  }
  const trustedSnapshot = JSON.parse(await readFile(PAYLOAD_PROVENANCE, "utf8"));
  const trustedByHash = new Map(
    trustedSnapshot.payloads.map((payload) => [payload.hash, [{ ...payload, filePath: "", hash: payload.hash }]]),
  );
  return { currentLegacyByHash, records, trustedByHash, trustedSnapshot };
}

export async function auditDialogueAudio({ includeDurations = false } = {}) {
  const manifest = JSON.parse(await readFile(AUDIO_MANIFEST, "utf8"));
  const manifestByCanonical = new Map(manifest.files.map((entry) => [entry.canonicalFile, entry]));
  const provenance = await payloadProvenance();
  const lessons = await Promise.all(GROUP3_LESSONS.map((meta) => meta.load ? meta.load() : meta));
  const rows = [];

  for (const lesson of lessons) {
    for (const [sceneIndex, scene] of lesson.scenes.entries()) {
      const profileByRole = new Map(scene.characters.map((character) => [character.role, character.profile]));
      for (const [lineIndex, line] of scene.lines.entries()) {
        const audioUrl = dialogueVoicePath(lesson, sceneIndex, lineIndex);
        const file = assetFileFromUrl(audioUrl);
        const exists = existsSync(file);
        const hash = exists ? sha256(await readFile(file)) : "";
        const payloadCandidates = hash ? provenance.trustedByHash.get(hash) || [] : [];
        const payload = payloadCandidates.length === 1 ? payloadCandidates[0] : null;
        const ownership = resolvedOwnership(audioUrl);
        const expectedProfile = line.voiceProfiles?.[0] || profileByRole.get(line.role) || "teacherWang";
        rows.push({
          actualHanzi: payload?.text || "",
          actualProfile: payload?.profile || "",
          audioUrl,
          canonicalFile: ownership.canonical,
          durationSeconds: includeDurations && exists ? durationSeconds(file) : null,
          expectedHanzi: line.hanzi,
          expectedPinyin: line.pinyin || line.reading || "",
          expectedProfile,
          fileExists: exists,
          hash,
          lesson: lesson.number,
          lessonId: lesson.id,
          level: lesson.level,
          line: lineIndex + 1,
          lineId: line.id,
          manifestEntry: manifestByCanonical.get(ownership.canonical) || null,
          payloadCandidates,
          payloadSource: payload?.file || "",
          scene: sceneIndex + 1,
          sceneId: scene.id,
          speaker: line.speaker,
          thai: line.th || line.thAid || "",
          ownership: {
            ...ownership,
            expectedLevel: lesson.level,
            expectedLesson: lesson.number,
            expectedScene: sceneIndex + 1,
            expectedLine: lineIndex + 1,
          },
        });
      }
    }
  }

  const registeredByHash = new Map();
  for (const row of rows) {
    if (!row.hash) continue;
    const group = registeredByHash.get(row.hash) || [];
    group.push(row);
    registeredByHash.set(row.hash, group);
  }
  for (const row of rows) {
    const duplicateExpectedTexts = (registeredByHash.get(row.hash) || []).map((entry) => entry.expectedHanzi);
    row.audioMappingStatus = classifyAudioMapping({
      actualProfile: row.actualProfile,
      actualText: row.actualHanzi,
      duplicateExpectedTexts,
      exists: row.fileExists,
      expectedProfile: row.expectedProfile,
      expectedText: row.expectedHanzi,
      ownership: row.ownership,
    });
    row.payloadStatus = row.fileExists && row.actualHanzi && (
      row.actualHanzi !== row.expectedHanzi || row.actualProfile !== row.expectedProfile
    )
      ? "WRONG_AUDIO_PAYLOAD"
      : row.audioMappingStatus;
  }

  const canonicalFiles = await filesBelow(LESSON_AUDIO_ROOT);
  const legacyFiles = await filesBelow(VOICE_ROOT);
  const canonicalHashes = await hashFiles(canonicalFiles);
  const registeredDuplicateGroups = [...registeredByHash.entries()]
    .filter(([, group]) => group.length > 1)
    .map(([hash, group]) => ({ hash, rows: group }));
  const legacyDifferentTextGroups = [...provenance.currentLegacyByHash.entries()]
    .filter(([, group]) => group.length > 1 && new Set(group.map((entry) => entry.text)).size > 1)
    .map(([hash, group]) => ({ hash, payloads: group }));

  const count = (status) => rows.filter((row) => row.audioMappingStatus === status).length;
  const measuredDurations = rows.map((row) => row.durationSeconds).filter(Number.isFinite);
  const semanticDurationOutliers = rows.filter((row) => {
    if (!Number.isFinite(row.durationSeconds)) return false;
    const units = expectedHanziUnits(row.expectedHanzi);
    return (units <= 8 && row.durationSeconds > 4) || (units >= 14 && row.durationSeconds < 2);
  });
  const summary = {
    canonicalPhysicalMp3: canonicalFiles.length,
    duplicateCanonicalHashGroups: [...canonicalHashes.values()].filter((group) => group.length > 1).length,
    duplicateLegacyDifferentTextGroups: legacyDifferentTextGroups.length,
    durationHardOutliers: rows.filter((row) => (
      Number.isFinite(row.durationSeconds) && (row.durationSeconds < 0.3 || row.durationSeconds > 14)
    )).length,
    durationMaximumSeconds: measuredDurations.length ? Math.max(...measuredDurations) : null,
    durationMinimumSeconds: measuredDurations.length ? Math.min(...measuredDurations) : null,
    durationSemanticOutliers: semanticDurationOutliers.length,
    expectedMp3: rows.length,
    fallbackTts: count("FALLBACK_TTS"),
    foundMp3: rows.filter((row) => row.fileExists).length,
    legacyVoiceMp3: legacyFiles.length,
    mappingMatches: count("MATCH"),
    mappingMismatches: rows.filter((row) => row.audioMappingStatus !== "MATCH").length,
    missingMp3: count("MISSING"),
    registeredDuplicateHashGroups: registeredDuplicateGroups.length,
    speakerMismatches: rows.filter((row) => row.actualProfile && row.actualProfile !== row.expectedProfile).length,
    wrongAudioPayloads: rows.filter((row) => row.payloadStatus === "WRONG_AUDIO_PAYLOAD").length,
    wrongSpokenContentPayloads: rows.filter((row) => (
      row.fileExists && row.actualHanzi && row.actualHanzi !== row.expectedHanzi
    )).length,
    wrongVoicePayloads: rows.filter((row) => (
      row.fileExists && row.actualProfile && row.actualProfile !== row.expectedProfile
    )).length,
  };

  return {
    duplicateGroups: {
      legacyDifferentText: legacyDifferentTextGroups,
      registered: registeredDuplicateGroups,
    },
    rows,
    summary,
  };
}

function printAudit(audit) {
  const columns = [
    "LEVEL", "LESSON", "SCENE", "LINE", "SPEAKER", "EXPECTED_HANZI", "EXPECTED_PINYIN", "EXPECTED_THAI",
    "AUDIO_URL", "FILE_EXISTS", "AUDIO_MAPPING_STATUS", "EXPECTED_PROFILE", "ACTUAL_PROFILE",
    "ACTUAL_HANZI", "PAYLOAD_SOURCE", "SHA256", "DURATION_SECONDS",
  ];
  process.stdout.write(`${columns.join("\t")}\n`);
  for (const row of audit.rows) {
    process.stdout.write(`${[
      row.level,
      `lesson-${pad(row.lesson)}`,
      `scene-${pad(row.scene)}`,
      `line-${pad(row.line)}`,
      row.speaker,
      row.expectedHanzi,
      row.expectedPinyin,
      row.thai,
      row.audioUrl,
      row.fileExists,
      row.audioMappingStatus,
      row.expectedProfile,
      row.actualProfile,
      row.actualHanzi,
      row.payloadSource,
      row.hash,
      row.durationSeconds ?? "",
    ].join("\t")}\n`);
  }
  process.stdout.write(`SUMMARY\t${JSON.stringify(audit.summary)}\n`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const audit = await auditDialogueAudio({ includeDurations: !process.argv.includes("--skip-duration") });
  if (process.argv.includes("--summary")) process.stdout.write(`${JSON.stringify(audit.summary)}\n`);
  else printAudit(audit);
  if (audit.summary.mappingMismatches > 0) process.exitCode = 2;
}
