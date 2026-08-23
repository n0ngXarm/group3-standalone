import assert from "node:assert/strict";
import { test } from "node:test";

const capabilitiesModule = "../../src/surfaces/group-3-8104/features/practice/audio/browserCapabilities.js";
const recognitionModule = "../../src/surfaces/group-3-8104/features/practice/audio/speechRecognition.js";

test("capability detection reports standard and prefixed browser APIs without side effects", async () => {
  const { detectSpeakingCapabilities } = await import(capabilitiesModule);
  let permissionRequests = 0;
  class Recognition {}
  class Recorder {
    static isTypeSupported(type) {
      return type === "audio/webm;codecs=opus" || type === "audio/mp4";
    }
  }
  class Context {}
  const environment = {
    isSecureContext: true,
    SpeechRecognition: Recognition,
    MediaRecorder: Recorder,
    AudioContext: Context,
    navigator: { mediaDevices: { getUserMedia() { permissionRequests += 1; } } },
  };

  assert.deepEqual(detectSpeakingCapabilities(environment), {
    audioContext: true,
    asrErrorCode: null,
    captureErrorCode: null,
    mediaRecorder: true,
    microphoneCapture: true,
    secureContext: true,
    speechRecognition: true,
    speechRecognitionUsable: true,
    speechRecognitionPrefix: "standard",
    supportedRecordingMimeTypes: ["audio/webm;codecs=opus", "audio/mp4"],
  });
  assert.equal(permissionRequests, 0);

  assert.equal(detectSpeakingCapabilities({ webkitSpeechRecognition: Recognition }).speechRecognitionPrefix, "webkit");
});

test("capability detection handles missing APIs, insecure contexts, and unavailable MIME probing", async () => {
  const { detectSpeakingCapabilities } = await import(capabilitiesModule);
  assert.deepEqual(detectSpeakingCapabilities({ isSecureContext: false, navigator: {} }), {
    audioContext: false,
    asrErrorCode: "INSECURE_CONTEXT",
    captureErrorCode: "INSECURE_CONTEXT",
    mediaRecorder: false,
    microphoneCapture: false,
    secureContext: false,
    speechRecognition: false,
    speechRecognitionUsable: false,
    speechRecognitionPrefix: null,
    supportedRecordingMimeTypes: [],
  });
  assert.deepEqual(detectSpeakingCapabilities({
    MediaRecorder: class Recorder {},
    navigator: { mediaDevices: { getUserMedia() {} } },
    webkitAudioContext: class Context {},
  }).supportedRecordingMimeTypes, []);
});

test("an insecure origin reports browser APIs separately from whether speech can be used", async () => {
  const { detectSpeakingCapabilities } = await import(capabilitiesModule);
  class Recognition {}
  class Recorder {}
  const capabilities = detectSpeakingCapabilities({
    isSecureContext: false,
    MediaRecorder: Recorder,
    webkitSpeechRecognition: Recognition,
    navigator: {},
  });

  assert.equal(capabilities.speechRecognition, true);
  assert.equal(capabilities.speechRecognitionUsable, false);
  assert.equal(capabilities.asrErrorCode, "INSECURE_CONTEXT");
  assert.equal(capabilities.captureErrorCode, "INSECURE_CONTEXT");
});

test("a secure browser without media devices distinguishes device unavailability from recorder support", async () => {
  const { detectSpeakingCapabilities } = await import(capabilitiesModule);
  const capabilities = detectSpeakingCapabilities({
    isSecureContext: true,
    MediaRecorder: class Recorder {},
    SpeechRecognition: class Recognition {},
    navigator: {},
  });

  assert.equal(capabilities.captureErrorCode, "MEDIA_DEVICE_UNAVAILABLE");
  assert.equal(capabilities.asrErrorCode, null);
});

test("speech recognizer translates browser callbacks into stable internal events", async () => {
  const { createSpeechRecognizer } = await import(recognitionModule);
  const events = [];
  let instance;
  class FakeRecognition {
    constructor() { instance = this; }
    start() { this.onstart(); }
    stop() { this.onend(); }
    abort() { this.onend(); }
  }
  const recognizer = createSpeechRecognizer({
    environment: { SpeechRecognition: FakeRecognition },
    interimResults: true,
    locale: "zh-CN",
    onEvent: (event) => events.push(event),
  });

  assert.equal(recognizer.supported, true);
  assert.equal(recognizer.locale, "zh-CN");
  assert.equal(recognizer.interimResults, true);
  recognizer.start();
  instance.onresult({
    resultIndex: 0,
    results: [
      Object.assign([{ transcript: "我要", confidence: 0.4 }], { isFinal: false }),
      Object.assign([{ transcript: "我要去学校", confidence: 0.93 }], { isFinal: true }),
    ],
  });
  instance.onnomatch();
  instance.onerror({ error: "not-allowed", message: "browser detail" });
  recognizer.stop();

  assert.deepEqual(events, [
    { type: "started" },
    { confidence: 0.4, transcript: "我要", type: "interim" },
    { confidence: 0.93, transcript: "我要去学校", type: "final" },
    { error: { code: "NO_SPEECH" }, type: "noSpeech" },
    { error: { code: "MIC_PERMISSION_DENIED", providerCode: "not-allowed" }, type: "error" },
    { type: "ended" },
  ]);
  assert.equal(Object.hasOwn(events[4].error, "message"), false);
});

test("webkit recognition uses the same contract and maps browser error codes", async () => {
  const { createSpeechRecognizer } = await import(recognitionModule);
  const events = [];
  let instance;
  class PrefixedRecognition { constructor() { instance = this; } }
  const recognizer = createSpeechRecognizer({
    environment: { webkitSpeechRecognition: PrefixedRecognition },
    onEvent: (event) => events.push(event),
  });
  assert.equal(recognizer.provider, "browser-webkit");
  instance.onerror({ error: "no-speech" });
  instance.onerror({ error: "network" });
  assert.deepEqual(events, [
    { error: { code: "NO_SPEECH", providerCode: "no-speech" }, type: "noSpeech" },
    { error: { code: "ASR_ERROR", providerCode: "network" }, type: "error" },
  ]);
});

test("unsupported recognizer fails safely through the provider-neutral contract", async () => {
  const { createSpeechRecognizer } = await import(recognitionModule);
  const events = [];
  const recognizer = createSpeechRecognizer({ environment: {}, onEvent: (event) => events.push(event) });
  assert.equal(recognizer.supported, false);
  assert.equal(recognizer.start(), false);
  assert.deepEqual(events, [{ error: { code: "ASR_UNSUPPORTED" }, type: "error" }]);
  assert.equal(recognizer.stop(), false);
  assert.equal(recognizer.abort(), false);
});
