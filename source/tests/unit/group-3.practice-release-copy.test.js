import assert from "node:assert/strict";
import test from "node:test";

import { COPY } from "../../src/surfaces/group-3-8104/content/copy.js";

const REQUIRED_KEYS = [
  "practiceInstructions", "practiceBegin", "practiceProgress", "listenExample",
  "startSpeaking", "stopSpeaking", "submitAnswer", "tryAgain", "nextExercise",
  "recognizedTranscript", "contentAccuracy", "completionMetric", "preliminaryResult",
  "asrUnsupportedSelfReview", "mediaRecorderUnsupported", "micPermissionDenied",
  "noSpeechDetected", "repeatSummaryTitle", "averageContentAccuracy", "averageCompletion",
  "overallDeterministicScore", "practiceAgain", "recordingPlayback", "preparationTime",
  "speakingTime", "speechContentAmount", "mentionedKeywords", "recommendedWords",
  "baselineScore", "selfReviewResult", "practiceCompleted",
];

test("release practice controls and error messages are complete in TH, ZH, and EN", () => {
  for (const language of ["th", "zh", "en"]) {
    for (const key of REQUIRED_KEYS) {
      assert.equal(typeof COPY[language][key], "string", `${language}.${key}`);
      assert.ok(COPY[language][key].trim().length > 0, `${language}.${key}`);
    }
  }
});
