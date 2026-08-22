export const RECORDING_MIME_TYPE_CANDIDATES = Object.freeze([
  "audio/webm;codecs=opus",
  "audio/webm",
  "audio/mp4;codecs=mp4a.40.2",
  "audio/mp4",
  "audio/ogg;codecs=opus",
]);

function hasFunction(value) {
  return typeof value === "function";
}

export function detectSpeakingCapabilities(environment = globalThis) {
  const standardRecognition = environment?.SpeechRecognition;
  const prefixedRecognition = environment?.webkitSpeechRecognition;
  const Recorder = environment?.MediaRecorder;
  const canProbeMimeTypes = hasFunction(Recorder?.isTypeSupported);

  return {
    audioContext: hasFunction(environment?.AudioContext) || hasFunction(environment?.webkitAudioContext),
    mediaRecorder: hasFunction(Recorder),
    microphoneCapture: hasFunction(environment?.navigator?.mediaDevices?.getUserMedia),
    secureContext: environment?.isSecureContext === true,
    speechRecognition: hasFunction(standardRecognition) || hasFunction(prefixedRecognition),
    speechRecognitionPrefix: hasFunction(standardRecognition)
      ? "standard"
      : hasFunction(prefixedRecognition) ? "webkit" : null,
    supportedRecordingMimeTypes: canProbeMimeTypes
      ? RECORDING_MIME_TYPE_CANDIDATES.filter((type) => Recorder.isTypeSupported(type))
      : [],
  };
}
