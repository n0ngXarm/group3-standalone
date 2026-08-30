import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

import { GROUP3_LESSONS as GROUP3_LESSONS_META } from "../../src/surfaces/group-3-8104/content/registry.js";
import {
  GROUP3_PERSONA_COUNT,
  GROUP3_VOICE_CAST_VERSION,
  GROUP3_VOICE_CAST_REVISION,
  GROUP3_VOICE_PROFILES,
  dialogueVoicePath,
} from "../../src/surfaces/group-3-8104/services/audio/voices.js";

const FRONTEND_ROOT = fileURLToPath(new URL("../../", import.meta.url));
const REPO_ROOT = fileURLToPath(new URL("../../../", import.meta.url));
const PUBLIC_ROOT = path.join(FRONTEND_ROOT, "public");
const MANIFEST_FILE = path.join(PUBLIC_ROOT, "assets/group3/audio/manifest.json");
const GROUP3_LESSONS = await Promise.all(
  GROUP3_LESSONS_META.map((lesson) => (lesson.load ? lesson.load() : lesson)),
);

function audioFileFor(url) {
  const pathname = new URL(url, "https://group3.test").pathname.replace(/^\/group3(?=\/)/, "");
  return path.join(PUBLIC_ROOT, pathname.slice(1));
}

async function sha256(file) {
  return createHash("sha256").update(await readFile(file)).digest("hex");
}

test("Group 3 exposes exactly 28 stable and audibly distinct persona signatures", () => {
  const profiles = Object.entries(GROUP3_VOICE_PROFILES);
  const signatures = new Set(
    profiles.map(([, profile]) => `${profile.voice}|${profile.personaPitch}|${profile.personaTempo}`),
  );
  const labels = new Set(profiles.map(([, profile]) => profile.label));
  const baseVoices = new Set(profiles.map(([, profile]) => profile.voice));

  assert.equal(GROUP3_VOICE_CAST_VERSION, 1);
  assert.equal(GROUP3_VOICE_CAST_REVISION, "voice-cast-20260811-v1");
  assert.equal(GROUP3_PERSONA_COUNT, 28);
  assert.equal(profiles.length, 28);
  assert.equal(signatures.size, 28, "every persona has a unique base/pitch/tempo signature");
  assert.equal(labels.size, 28, "every persona has a unique learner-facing cast label");
  assert.equal(baseVoices.size, 6, "personas use only the six standard Mandarin base voices");
  assert.equal(Object.hasOwn(GROUP3_VOICE_PROFILES, "yifei"), false, "duplicate Wang Yifei profile is retired");
  assert.deepEqual(GROUP3_VOICE_PROFILES.teacherWang.legacyProfiles, ["yifei"]);
});

test("all 7 curated lessons resolve character roles to the canonical persona registry", () => {
  const namedSpeakerProfiles = new Map();
  const genericLabels = new Set(["服务员", "售货员", "司机", "同事", "学生们"]);
  let lineCount = 0;

  for (const lesson of GROUP3_LESSONS) {
    for (const scene of lesson.scenes) {
      const roleProfiles = new Map(scene.characters.map((character) => [character.role, character.profile]));
      for (const character of scene.characters) {
        assert.ok(GROUP3_VOICE_PROFILES[character.profile], `${lesson.id}/${scene.id}/${character.role}`);
        assert.notEqual(character.profile, "yifei");
      }
      for (const line of scene.lines) {
        lineCount += 1;
        const profiles = line.voiceProfiles || [roleProfiles.get(line.role)];
        for (const profile of profiles) {
          assert.ok(GROUP3_VOICE_PROFILES[profile], `${lesson.id}/${scene.id}/${line.speaker}`);
        }
        if (!genericLabels.has(line.speaker) && !line.speaker.includes("、")) {
          if (!namedSpeakerProfiles.has(line.speaker)) namedSpeakerProfiles.set(line.speaker, new Set());
          namedSpeakerProfiles.get(line.speaker).add(profiles[0]);
        }
      }
    }
  }

  assert.equal(lineCount, 54);
  assert.deepEqual([...namedSpeakerProfiles.get("王一飞")], ["teacherWang"]);
  for (const [speaker, profiles] of namedSpeakerProfiles) {
    assert.equal(profiles.size, 1, `${speaker} must keep one canonical persona across lessons`);
  }
});

test("persona manifest covers every line with identity, transform, loudness, and checksum", async () => {
  const manifest = JSON.parse(await readFile(MANIFEST_FILE, "utf8"));
  const byFile = new Map(manifest.files.map((entry) => [entry.file, entry]));
  assert.equal(manifest.voiceCastVersion, 1);
  assert.equal(manifest.personaCount, 28);
  assert.equal(manifest.loudnessTargetLufs, -23);
  assert.equal(Object.keys(manifest.profiles).length, 28);
  assert.equal(manifest.files.length, 54);

  for (const lesson of GROUP3_LESSONS) {
    for (const [sceneIndex, scene] of lesson.scenes.entries()) {
      const roleProfiles = new Map(scene.characters.map((character) => [character.role, character.profile]));
      for (const [lineIndex, line] of scene.lines.entries()) {
        const filename = `${scene.id}-${String(lineIndex + 1).padStart(2, "0")}.mp3`;
        const entry = byFile.get(filename);
        const expectedProfiles = line.voiceProfiles || [roleProfiles.get(line.role)];
        const audioFile = audioFileFor(dialogueVoicePath(lesson, sceneIndex, lineIndex));
        const persona = GROUP3_VOICE_PROFILES[expectedProfiles[0]];

        assert.ok(entry, filename);
        assert.equal(entry.profile, expectedProfiles[0], `${filename} profile`);
        assert.equal(entry.identityId, expectedProfiles[0], `${filename} identity`);
        assert.equal(entry.voice, persona.voice, `${filename} base voice`);
        assert.equal(entry.personaPitch, persona.personaPitch, `${filename} pitch`);
        assert.equal(entry.personaTempo, persona.personaTempo, `${filename} tempo`);
        assert.equal(entry.loudnessTargetLufs, -23, `${filename} loudness target`);
        assert.equal(entry.sha256, await sha256(audioFile), `${filename} checksum`);
      }
    }
  }
});

test("voice generator stages the complete batch and restores backups on promotion failure", async () => {
  const generator = await readFile(
    path.join(REPO_ROOT, "source/scripts/tools/media/generate-group3-voices-8104.py"),
    "utf8",
  );

  assert.match(generator, /STAGING_ROOT = ASSET_ROOT \/ "\.voice-persona-staging"/);
  assert.match(generator, /BACKUP_ROOT = ASSET_ROOT \/ "\.voice-persona-backup"/);
  assert.match(generator, /rubberband=pitch=/);
  assert.match(generator, /loudnorm=I=\{LOUDNESS_TARGET_LUFS\}/);
  assert.match(generator, /for current, backup in reversed\(promoted\)/);
  assert.match(generator, /shutil\.copy2\(backup, current\)/);
});
