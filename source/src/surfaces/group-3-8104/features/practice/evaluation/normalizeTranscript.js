export function normalizeChineseTranscript(value) {
  return String(value ?? "")
    .normalize("NFC")
    .replace(/[\p{P}\p{Z}\s]+/gu, "");
}
