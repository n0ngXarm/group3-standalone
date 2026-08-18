import { group3LessonAssetPath } from "../../app/config.js";
import voiceCast from "./voice-cast.json" with { type: "json" };

export const GROUP3_VOICE_PROFILES = Object.freeze(voiceCast.profiles);
export const GROUP3_VOICE_CAST_VERSION = voiceCast.version;
export const GROUP3_PERSONA_COUNT = voiceCast.personaCount;
export const GROUP3_VOICE_CAST_REVISION = "voice-cast-20260811-v1";

export function dialogueVoicePath(lesson, sceneIndex, lineIndex) {
  const scene = String(Number(sceneIndex) + 1).padStart(2, "0");
  const line = String(Number(lineIndex) + 1).padStart(2, "0");
  const assetPath = group3LessonAssetPath(lesson, `audio/scene-${scene}/line-${line}.mp3`);
  return `${assetPath}?v=${GROUP3_VOICE_CAST_REVISION}`;
}
