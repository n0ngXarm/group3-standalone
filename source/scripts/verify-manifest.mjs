import fs from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SOURCE_ROOT = path.resolve(__dirname, "..");
const PUBLIC_ROOT = path.join(SOURCE_ROOT, "public");
const AUDIO_MANIFEST_PATH = path.join(PUBLIC_ROOT, "assets/group3/audio/manifest.json");

const pad = (n) => String(n).padStart(2, "0");

async function run() {
  const { GROUP3_LESSONS } = await import("../src/surfaces/group-3-8104/content/registry.js");
  const { GROUP3_VOICE_PROFILES } = await import("../src/surfaces/group-3-8104/services/audio/voices.js");
  
  console.log(`Loaded ${GROUP3_LESSONS.length} lessons from registry.`);
  const manifestFiles = [];

  for (const lessonMeta of GROUP3_LESSONS) {
    const lesson = lessonMeta.load ? await lessonMeta.load() : lessonMeta;
    console.log(`Processing [${lesson.level}] L${lesson.number}: "${lesson.title?.zh}" (${lesson.scenes.length} scenes, ${lesson.vocabulary.length} vocab)`);

    for (const [sceneIndex, scene] of lesson.scenes.entries()) {
      const sceneNum = sceneIndex + 1;
      const roleProfiles = new Map(scene.characters.map((c) => [c.role, c.profile]));

      for (const [lineIndex, line] of scene.lines.entries()) {
        const lineNum = lineIndex + 1;
        const filename = `${scene.id}-${pad(lineNum)}.mp3`;
        const canonicalFile = `lessons/${lesson.level}/lesson-${pad(lesson.number)}/audio/scene-${pad(sceneNum)}/line-${pad(lineNum)}.mp3`;
        const localPath = path.join(PUBLIC_ROOT, "assets/group3", canonicalFile);

        const profile = line.voiceProfiles?.[0] || roleProfiles.get(line.role) || "teacherWang";
        const audioBuffer = await fs.readFile(localPath);
        const audioHash = createHash("sha256").update(audioBuffer).digest("hex");
        const persona = GROUP3_VOICE_PROFILES[profile];

        manifestFiles.push({
          file: filename,
          canonicalFile: canonicalFile,
          level: lesson.level,
          lesson: lesson.number,
          scene: sceneNum,
          line: lineNum,
          profile: profile,
          identityId: profile,
          voice: persona?.voice || "zh-CN-XiaoxiaoNeural",
          text: line.hanzi,
          bytes: audioBuffer.length,
          sha256: audioHash,
          personaPitch: persona?.personaPitch || 1,
          personaTempo: persona?.personaTempo || 1,
          loudnessTargetLufs: -23,
        });
      }
    }
  }

  const manifestData = {
    lesson: "Group 3 Curated Lessons (HSK1 L1-L3, HSK2 L1-L3, HSK3 L1-L3)",
    generator: "edge-tts 7.2.8 + ffmpeg rubberband personas",
    voiceCastVersion: 1,
    personaCount: 28,
    loudnessTargetLufs: -23,
    profiles: GROUP3_VOICE_PROFILES,
    files: manifestFiles,
  };

  await fs.writeFile(AUDIO_MANIFEST_PATH, JSON.stringify(manifestData, null, 2), "utf8");
  console.log(`✓ Manifest updated with ${manifestFiles.length} dialogue audio entries.`);
}

run().catch(console.error);
