import assert from "node:assert/strict";
import test from "node:test";

const modulePath = "../../src/surfaces/group-3-8104/features/practice/exercises/practiceUi.js";

test("practice UI selects localized translations without inventing another language state", async () => {
  const { localizedValue } = await import(modulePath);
  const translations = { en: "Hello", th: "สวัสดี" };
  assert.equal(localizedValue(translations, "th"), "สวัสดี");
  assert.equal(localizedValue(translations, "en"), "Hello");
  assert.equal(localizedValue(translations, "zh"), "");
});

test("practice error codes map to stable COPY keys", async () => {
  const { practiceErrorCopyKey } = await import(modulePath);
  assert.equal(practiceErrorCopyKey("MIC_PERMISSION_DENIED"), "micPermissionDenied");
  assert.equal(practiceErrorCopyKey("INSECURE_CONTEXT"), "insecureContextMessage");
  assert.equal(practiceErrorCopyKey("MEDIA_DEVICE_UNAVAILABLE"), "mediaDeviceUnavailable");
  assert.equal(practiceErrorCopyKey("ASR_UNSUPPORTED"), "asrUnsupportedSelfReview");
  assert.equal(practiceErrorCopyKey("NO_SPEECH"), "noSpeechDetected");
  assert.equal(practiceErrorCopyKey("ASR_TIMEOUT"), "asrTimeoutMessage");
  assert.equal(practiceErrorCopyKey("ASR_ERROR"), "asrErrorMessage");
  assert.equal(practiceErrorCopyKey("MEDIARECORDER_UNSUPPORTED"), "mediaRecorderUnsupported");
  assert.equal(practiceErrorCopyKey("unknown"), "asrErrorMessage");
});

test("technical capture and transcription failures select unscored self-review", async () => {
  const { isAutomaticEvaluationUnavailable } = await import(modulePath);
  for (const code of ["INSECURE_CONTEXT", "MIC_PERMISSION_DENIED", "MEDIA_DEVICE_UNAVAILABLE", "MEDIARECORDER_UNSUPPORTED", "ASR_UNSUPPORTED", "ASR_ERROR", "ASR_TIMEOUT"]) {
    assert.equal(isAutomaticEvaluationUnavailable(code), true, code);
  }
  assert.equal(isAutomaticEvaluationUnavailable("NO_SPEECH"), false);
  assert.equal(isAutomaticEvaluationUnavailable(""), false);
});

test("formatPracticeProgress replaces both localized placeholders", async () => {
  const { formatPracticeProgress } = await import(modulePath);
  assert.equal(formatPracticeProgress("ข้อ {current} / {total}", 2, 10), "ข้อ 2 / 10");
});
