const ERROR_COPY_KEYS = Object.freeze({
  ASR_ERROR: "asrErrorMessage",
  ASR_TIMEOUT: "asrTimeoutMessage",
  ASR_UNSUPPORTED: "asrUnsupportedSelfReview",
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

export function formatPracticeProgress(template, current, total) {
  return String(template || "")
    .replace("{current}", String(current))
    .replace("{total}", String(total));
}

export function percent(value) {
  const number = Number(value);
  return `${Math.round(Math.min(1, Math.max(0, Number.isFinite(number) ? number : 0)) * 100)}%`;
}
