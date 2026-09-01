const ERROR_COPY_KEYS = Object.freeze({
  ASR_ERROR: "asrErrorMessage",
  ASR_TIMEOUT: "asrTimeoutMessage",
  ASR_UNSUPPORTED: "asrUnsupportedSelfReview",
  INSECURE_CONTEXT: "insecureContextMessage",
  MEDIA_DEVICE_UNAVAILABLE: "mediaDeviceUnavailable",
  MEDIARECORDER_UNSUPPORTED: "mediaRecorderUnsupported",
  MIC_PERMISSION_DENIED: "micPermissionDenied",
  NO_SPEECH: "noSpeechDetected",
});

export function localizedValue(translations, language) {
  return String(translations?.[language] || "");
}

export function practiceErrorCopyKey(code) {
  return ERROR_COPY_KEYS[code] || "asrErrorMessage";
}

const UNSCORED_ERROR_CODES = new Set([
  "ASR_ERROR",
  "ASR_TIMEOUT",
  "ASR_UNSUPPORTED",
  "INSECURE_CONTEXT",
  "MEDIA_DEVICE_UNAVAILABLE",
  "MEDIARECORDER_UNSUPPORTED",
  "MIC_PERMISSION_DENIED",
]);

export function isAutomaticEvaluationUnavailable(code) {
  return UNSCORED_ERROR_CODES.has(code);
}

export function formatPracticeProgress(template, current, total) {
  return String(template || "")
    .replace("{current}", String(current))
    .replace("{total}", String(total));
}

export function percent(value) {
  const number = Number(value);
  return `${Math.round(Math.min(1, Math.max(0, Number.isFinite(number) ? number : 0)) * 100)}%`;
}
