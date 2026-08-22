import { PRACTICE_ERROR_CODES, practiceError } from "../errors.js";

const ERROR_CODE_MAP = Object.freeze({
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
  environment = globalThis,
  interimResults = false,
  locale = "zh-CN",
  onEvent = () => {},
} = {}) {
  const { Constructor, provider } = recognitionConstructor(environment);
  if (!Constructor) {
    return Object.freeze({
      abort: () => false,
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
  instance.continuous = false;
  instance.maxAlternatives = 1;

  instance.onstart = () => onEvent({ type: "started" });
  instance.onend = () => onEvent({ type: "ended" });
  instance.onnomatch = () => onEvent({
    type: "noSpeech",
    error: practiceError(PRACTICE_ERROR_CODES.NO_SPEECH),
  });
  instance.onerror = (browserEvent) => {
    const providerCode = String(browserEvent?.error ?? "unknown");
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
      instance.abort();
      return true;
    },
    interimResults,
    locale,
    provider,
    start() {
      instance.start();
      return true;
    },
    stop() {
      instance.stop();
      return true;
    },
    supported: true,
  });
}
