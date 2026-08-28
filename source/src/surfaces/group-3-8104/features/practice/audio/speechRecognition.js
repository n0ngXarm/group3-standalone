import { PRACTICE_ERROR_CODES, practiceError } from "../errors.js";

const ERROR_CODE_MAP = Object.freeze({
  "audio-capture": PRACTICE_ERROR_CODES.MEDIA_DEVICE_UNAVAILABLE,
  "bad-grammar": PRACTICE_ERROR_CODES.ASR_ERROR,
  "language-not-supported": PRACTICE_ERROR_CODES.ASR_UNSUPPORTED,
  "network": PRACTICE_ERROR_CODES.ASR_ERROR,
  "no-speech": PRACTICE_ERROR_CODES.NO_SPEECH,
  "not-allowed": PRACTICE_ERROR_CODES.MIC_PERMISSION_DENIED,
  "service-not-allowed": PRACTICE_ERROR_CODES.MIC_PERMISSION_DENIED,
});

function recognitionConstructor(environment) {
  if (typeof environment?.SpeechRecognition === "function") {
    return { Constructor: environment.SpeechRecognition, provider: "browser-standard" };
  }
  if (typeof environment?.webkitSpeechRecognition === "function") {
    return { Constructor: environment.webkitSpeechRecognition, provider: "browser-webkit" };
  }
  return { Constructor: null, provider: null };
}

function firstAlternative(result) {
  const alternative = result?.[0];
  return {
    confidence: Number.isFinite(alternative?.confidence) ? alternative.confidence : null,
    transcript: String(alternative?.transcript ?? ""),
  };
}

export function createSpeechRecognizer({
  continuous = false,
  environment = globalThis,
  interimResults = false,
  locale = "zh-CN",
  onEvent = () => {},
} = {}) {
  const { Constructor, provider } = recognitionConstructor(environment);
  if (!Constructor) {
    return Object.freeze({
      abort: () => false,
      continuous,
      interimResults,
      locale,
      provider: null,
      start() {
        onEvent({ type: "error", error: practiceError(PRACTICE_ERROR_CODES.ASR_UNSUPPORTED) });
        return false;
      },
      stop: () => false,
      supported: false,
    });
  }

  const instance = new Constructor();
  instance.lang = locale;
  instance.interimResults = interimResults;
  instance.continuous = continuous;
  instance.maxAlternatives = 1;

  let isAborting = false;

  instance.onstart = () => {
    isAborting = false;
    onEvent({ type: "started" });
  };
  instance.onend = () => {
    onEvent({ type: "ended" });
  };
  instance.onnomatch = () => onEvent({
    type: "noSpeech",
    error: practiceError(PRACTICE_ERROR_CODES.NO_SPEECH),
  });
  instance.onerror = (browserEvent) => {
    const providerCode = String(browserEvent?.error ?? "unknown");
    if (isAborting && (providerCode === "aborted" || providerCode === "unknown")) return;
    const code = ERROR_CODE_MAP[providerCode] ?? PRACTICE_ERROR_CODES.ASR_ERROR;
    const type = code === PRACTICE_ERROR_CODES.NO_SPEECH ? "noSpeech" : "error";
    onEvent({ type, error: { code, providerCode } });
  };
  instance.onresult = (browserEvent) => {
    const firstIndex = Number.isInteger(browserEvent?.resultIndex) ? browserEvent.resultIndex : 0;
    const resultCount = Number(browserEvent?.results?.length ?? 0);
    for (let index = firstIndex; index < resultCount; index += 1) {
      const result = browserEvent.results[index];
      const { confidence, transcript } = firstAlternative(result);
      onEvent({
        confidence,
        transcript,
        type: result?.isFinal ? "final" : "interim",
      });
    }
  };

  return Object.freeze({
    abort() {
      isAborting = true;
      try {
        instance.abort();
      } catch {
        // ignore
      }
      return true;
    },
    continuous,
    interimResults,
    locale,
    provider,
    start() {
      isAborting = false;
      try {
        instance.start();
      } catch {
        return false;
      }
      return true;
    },
    stop() {
      try {
        instance.stop();
      } catch {
        // ignore
      }
      return true;
    },
    supported: true,
  });
}
