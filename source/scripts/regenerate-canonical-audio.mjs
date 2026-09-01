import { execFile } from "node:child_process";
import { createHash } from "node:crypto";
import { copyFile, mkdir, readFile, readdir, rename, stat, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";

import { GROUP3_LESSONS } from "../src/surfaces/group-3-8104/content/registry.js";
import voiceCast from "../src/surfaces/group-3-8104/services/audio/voice-cast.json" with { type: "json" };

const execFileAsync = promisify(execFile);
const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const SOURCE_ROOT = path.resolve(SCRIPT_DIR, "..");
const GROUP3_ASSET_ROOT = path.join(SOURCE_ROOT, "public/assets/group3");
const AUDIO_MANIFEST_FILE = path.join(GROUP3_ASSET_ROOT, "audio/manifest.json");
const PROVENANCE_FILE = path.join(SCRIPT_DIR, "audio-payload-provenance.json");
const ATTESTATION_FILE = "canonical-audio-attestation.json";
const MIN_AUDIO_BYTES = 1_000;
const EXPECTED_TARGETS = 48;
const EXPECTED_RETAINED = 6;

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function pad(value) {
  return String(value).padStart(2, "0");
}

function approvedTarget(record) {
  if (record.level === "hsk1") return [2, 3].includes(record.lesson);
  return ["hsk2", "hsk3"].includes(record.level) && [1, 2].includes(record.lesson);
}

function normalizedSpeechText(value) {
  return String(value || "").normalize("NFKC").replace(/[\p{P}\p{S}\s]/gu, "").toLowerCase();
}

function subtitleText(vtt) {
  return String(vtt || "")
    .split(/\r?\n/)
    .filter((line) => line && line !== "WEBVTT" && !line.includes("-->") && !/^\d+$/.test(line))
    .join("");
}

function parseArgs(argv) {
  const options = {
    concurrency: 3,
    mode: "generate",
    outputRoot: "",
    python: "python3",
  };
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === "--plan") options.mode = "plan";
    else if (argument === "--promote") options.mode = "promote";
    else if (argument === "--output-root") options.outputRoot = argv[++index] || "";
    else if (argument === "--python") options.python = argv[++index] || "";
    else if (argument === "--concurrency") options.concurrency = Number(argv[++index]);
    else throw new TypeError(`Unknown argument: ${argument}`);
  }
  if (!Number.isInteger(options.concurrency) || options.concurrency < 1 || options.concurrency > 6) {
    throw new TypeError("--concurrency must be an integer from 1 to 6");
  }
  if (options.mode !== "plan" && !options.outputRoot) {
    throw new TypeError("--output-root is required for generation and promotion");
  }
  return options;
}

async function canonicalRecords() {
  const lessons = await Promise.all(GROUP3_LESSONS.map((entry) => entry.load ? entry.load() : entry));
  const records = [];
  for (const lesson of lessons) {
    for (const [sceneIndex, scene] of lesson.scenes.entries()) {
      const profileByRole = new Map(scene.characters.map((character) => [character.role, character.profile]));
      for (const [lineIndex, line] of scene.lines.entries()) {
        const profile = line.voiceProfiles?.[0] || profileByRole.get(line.role) || "teacherWang";
        const persona = voiceCast.profiles[profile];
        if (!persona) throw new Error(`Unknown canonical voice profile ${profile} for ${line.id}`);
        records.push({
          canonicalFile: `lessons/${lesson.level}/lesson-${pad(lesson.number)}/audio/scene-${pad(sceneIndex + 1)}/line-${pad(lineIndex + 1)}.mp3`,
          hanzi: line.hanzi,
          lesson: lesson.number,
          lessonId: lesson.id,
          level: lesson.level,
          line: lineIndex + 1,
          lineId: line.id,
          personaPitch: persona.personaPitch,
          personaTempo: persona.personaTempo,
          pinyin: line.pinyin || line.reading || "",
          profile,
          scene: sceneIndex + 1,
          sceneId: scene.id,
          speaker: line.speaker,
          thai: line.th || line.thAid || "",
          voice: persona.voice,
        });
      }
    }
  }
  const targets = records.filter(approvedTarget);
  const retained = records.filter((record) => !approvedTarget(record));
  if (records.length !== 54 || targets.length !== EXPECTED_TARGETS || retained.length !== EXPECTED_RETAINED) {
    throw new Error(`Refusing unexpected canonical scope: total=${records.length}, targets=${targets.length}, retained=${retained.length}`);
  }
  return { records, retained, targets };
}

function safeOutputRoot(value) {
  const outputRoot = path.resolve(value);
  if (outputRoot === GROUP3_ASSET_ROOT || outputRoot.startsWith(`${GROUP3_ASSET_ROOT}${path.sep}`)) {
    throw new Error("Generation output must be staged outside production Group3 assets");
  }
  return outputRoot;
}

async function fileSha256(file) {
  return sha256(await readFile(file));
}

async function filesBelow(root) {
  const files = [];
  const visit = async (directory) => {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) await visit(file);
      else if (entry.isFile()) files.push(file);
    }
  };
  await visit(root);
  return files.sort();
}

async function providerVersion(python) {
  const { stdout } = await execFileAsync(python, ["-m", "edge_tts", "--version"], { timeout: 30_000 });
  return stdout.trim();
}

async function renderRecord(record, outputRoot, python, provider) {
  const output = path.join(outputRoot, record.canonicalFile);
  const raw = `${output}.raw.mp3`;
  const subtitles = `${output}.raw.vtt`;
  await mkdir(path.dirname(output), { recursive: true });
  await execFileAsync(python, [
    "-m", "edge_tts",
    "--voice", record.voice,
    "--text", record.hanzi,
    "--rate", "+0%",
    "--pitch", "+0Hz",
    "--write-media", raw,
    "--write-subtitles", subtitles,
  ], { maxBuffer: 1024 * 1024, timeout: 90_000 });

  const providerText = subtitleText(await readFile(subtitles, "utf8"));
  if (!providerText || normalizedSpeechText(providerText) !== normalizedSpeechText(record.hanzi)) {
    throw new Error(`Provider word-boundary text mismatch for ${record.canonicalFile}: ${providerText}`);
  }

  const filter = `rubberband=pitch=${record.personaPitch}:tempo=${record.personaTempo}:formant=shifted:pitchq=quality,loudnorm=I=${voiceCast.loudnessTargetLufs}:LRA=7:TP=-2`;
  await execFileAsync("ffmpeg", [
    "-hide_banner", "-loglevel", "error", "-y",
    "-i", raw,
    "-af", filter,
    "-ar", "24000", "-ac", "1", "-b:a", "48k",
    output,
  ], { maxBuffer: 1024 * 1024, timeout: 90_000 });
  await unlink(raw);
  await unlink(subtitles);

  const outputStat = await stat(output);
  if (outputStat.size < MIN_AUDIO_BYTES) throw new Error(`Generated MP3 is too small: ${record.canonicalFile}`);
  const { stdout: probeOutput } = await execFileAsync("ffprobe", [
    "-v", "error",
    "-show_entries", "stream=codec_name,sample_rate,channels:format=duration",
    "-of", "json",
    output,
  ], { timeout: 30_000 });
  const probe = JSON.parse(probeOutput);
  const stream = probe.streams?.[0] || {};
  const durationSeconds = Number(probe.format?.duration);
  if (stream.codec_name !== "mp3" || Number(stream.sample_rate) !== 24_000 || Number(stream.channels) !== 1 || !(durationSeconds > 0.3 && durationSeconds < 20)) {
    throw new Error(`Generated MP3 contract failed for ${record.canonicalFile}: ${probeOutput}`);
  }
  return {
    ...record,
    bytes: outputStat.size,
    durationSeconds,
    generatedBy: provider,
    hash: await fileSha256(output),
    inputFingerprint: sha256(JSON.stringify({ hanzi: record.hanzi, profile: record.profile, voice: record.voice })),
    providerText,
  };
}

async function mapConcurrent(items, concurrency, operation) {
  const results = new Array(items.length);
  let cursor = 0;
  const workers = Array.from({ length: concurrency }, async () => {
    while (cursor < items.length) {
      const index = cursor;
      cursor += 1;
      results[index] = await operation(items[index], index);
      process.stdout.write(`generated ${index + 1}/${items.length} ${items[index].canonicalFile}\n`);
    }
  });
  await Promise.all(workers);
  return results;
}

async function generate({ concurrency, outputRoot: outputValue, python }) {
  const outputRoot = safeOutputRoot(outputValue);
  const { targets } = await canonicalRecords();
  const provider = await providerVersion(python);
  await mkdir(outputRoot, { recursive: true });
  const payloads = await mapConcurrent(targets, concurrency, (record) => renderRecord(record, outputRoot, python, provider));
  if (new Set(payloads.map((payload) => payload.hash)).size !== EXPECTED_TARGETS) {
    throw new Error("Generated target set contains duplicate MP3 hashes");
  }
  const attestation = {
    generatedAt: new Date().toISOString(),
    generator: "canonical lesson registry -> Edge TTS -> FFmpeg rubberband persona",
    loudnessTargetLufs: voiceCast.loudnessTargetLufs,
    outputContract: { bitrate: "48k", channels: 1, codec: "mp3", sampleRate: 24000 },
    payloads,
    provider,
    schemaVersion: "group3-canonical-audio-attestation-v1",
    source: "GROUP3_LESSONS + voice-cast.json",
  };
  await writeFile(path.join(outputRoot, ATTESTATION_FILE), `${JSON.stringify(attestation, null, 2)}\n`, "utf8");
  process.stdout.write(`staged ${payloads.length} canonical MP3s at ${outputRoot}\n`);
}

async function validateStaging(outputRoot, targets) {
  const attestation = JSON.parse(await readFile(path.join(outputRoot, ATTESTATION_FILE), "utf8"));
  if (attestation.payloads?.length !== EXPECTED_TARGETS) throw new Error("Staging attestation must contain exactly 48 payloads");
  const targetByFile = new Map(targets.map((record) => [record.canonicalFile, record]));
  const attestedFiles = new Set();
  for (const payload of attestation.payloads) {
    const canonical = targetByFile.get(payload.canonicalFile);
    if (!canonical || attestedFiles.has(payload.canonicalFile)) throw new Error(`Unexpected staged payload: ${payload.canonicalFile}`);
    for (const field of ["hanzi", "lessonId", "level", "lineId", "profile", "sceneId", "speaker", "voice"]) {
      if (payload[field] !== canonical[field]) throw new Error(`Staged ${field} mismatch: ${payload.canonicalFile}`);
    }
    const stagedFile = path.join(outputRoot, payload.canonicalFile);
    if (await fileSha256(stagedFile) !== payload.hash) throw new Error(`Staged hash mismatch: ${payload.canonicalFile}`);
    attestedFiles.add(payload.canonicalFile);
  }
  const stagedMp3s = (await filesBelow(outputRoot)).filter((file) => file.endsWith(".mp3"));
  if (stagedMp3s.length !== EXPECTED_TARGETS || attestedFiles.size !== EXPECTED_TARGETS) {
    throw new Error(`Unexpected staged file count: mp3=${stagedMp3s.length}, attested=${attestedFiles.size}`);
  }
  return attestation;
}

async function promote(outputValue) {
  const outputRoot = safeOutputRoot(outputValue);
  const { records, retained, targets } = await canonicalRecords();
  const attestation = await validateStaging(outputRoot, targets);
  const existingProvenance = JSON.parse(await readFile(PROVENANCE_FILE, "utf8"));
  const existingByHash = new Map(existingProvenance.payloads.map((payload) => [payload.hash, payload]));
  const retainedPayloads = [];
  for (const record of retained) {
    const currentFile = path.join(GROUP3_ASSET_ROOT, record.canonicalFile);
    const hash = await fileSha256(currentFile);
    const evidence = existingByHash.get(hash);
    if (!evidence || evidence.text !== record.hanzi || evidence.profile !== record.profile) {
      throw new Error(`Known-good provenance changed before promotion: ${record.canonicalFile}`);
    }
    retainedPayloads.push({
      canonicalFile: record.canonicalFile,
      file: evidence.file,
      hash,
      profile: record.profile,
      source: "pre-curation-manifest:5c2f9e4",
      text: record.hanzi,
    });
  }

  for (const payload of attestation.payloads) {
    const staged = path.join(outputRoot, payload.canonicalFile);
    const destination = path.join(GROUP3_ASSET_ROOT, payload.canonicalFile);
    const temporary = `${destination}.g3-regenerating`;
    await copyFile(staged, temporary);
    await rename(temporary, destination);
  }

  const generatedPayloads = attestation.payloads.map((payload) => ({
    canonicalFile: payload.canonicalFile,
    file: payload.canonicalFile,
    generatedBy: payload.generatedBy,
    hash: payload.hash,
    inputFingerprint: payload.inputFingerprint,
    profile: payload.profile,
    providerText: payload.providerText,
    source: "canonical-runtime-content",
    text: payload.hanzi,
    voice: payload.voice,
  }));
  const payloads = [...retainedPayloads, ...generatedPayloads]
    .sort((left, right) => left.canonicalFile.localeCompare(right.canonicalFile));
  if (payloads.length !== records.length) throw new Error(`Unexpected promoted provenance count: ${payloads.length}`);
  const provenance = {
    generatedAt: attestation.generatedAt,
    generator: attestation.generator,
    payloads,
    provider: attestation.provider,
    schemaVersion: "group3-audio-payload-provenance-v2",
    source: attestation.source,
  };
  await writeFile(PROVENANCE_FILE, `${JSON.stringify(provenance, null, 2)}\n`, "utf8");
  const manifestFiles = [];
  for (const record of records) {
    const audioFile = path.join(GROUP3_ASSET_ROOT, record.canonicalFile);
    const audioStat = await stat(audioFile);
    manifestFiles.push({
      bytes: audioStat.size,
      canonicalFile: record.canonicalFile,
      file: `${record.sceneId}-${pad(record.line)}.mp3`,
      identityId: record.profile,
      lesson: record.lesson,
      level: record.level,
      line: record.line,
      loudnessTargetLufs: voiceCast.loudnessTargetLufs,
      personaPitch: record.personaPitch,
      personaTempo: record.personaTempo,
      profile: record.profile,
      scene: record.scene,
      sha256: await fileSha256(audioFile),
      text: record.hanzi,
      voice: record.voice,
    });
  }
  const manifest = {
    files: manifestFiles,
    generator: attestation.generator,
    lesson: "Group 3 canonical runtime lessons",
    loudnessTargetLufs: voiceCast.loudnessTargetLufs,
    personaCount: voiceCast.personaCount,
    profiles: voiceCast.profiles,
    provider: attestation.provider,
    source: attestation.source,
    voiceCastVersion: voiceCast.version,
  };
  await writeFile(AUDIO_MANIFEST_FILE, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  process.stdout.write(`promoted ${attestation.payloads.length} canonical MP3s; retained ${retainedPayloads.length} known-good files\n`);
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const { retained, targets } = await canonicalRecords();
  if (options.mode === "plan") {
    process.stdout.write(`${JSON.stringify({ retained, targets }, null, 2)}\n`);
    return;
  }
  if (options.mode === "promote") await promote(options.outputRoot);
  else await generate(options);
}

main().catch((error) => {
  process.stderr.write(`${error.stack || error.message}\n`);
  process.exitCode = 1;
});
