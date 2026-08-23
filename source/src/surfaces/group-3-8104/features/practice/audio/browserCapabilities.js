import { PRACTICE_ERROR_CODES } from "../errors.js";

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
  const secureContext = environment?.isSecureContext === true;
  const microphoneCapture = hasFunction(environment?.navigator?.mediaDevices?.getUserMedia);
  const mediaRecorder = hasFunction(Recorder);
  const speechRecognition = hasFunction(standardRecognition) || hasFunction(prefixedRecognition);
  const captureErrorCode = !secureContext
    ? PRACTICE_ERROR_CODES.INSECURE_CONTEXT
    : !microphoneCapture
      ? PRACTICE_ERROR_CODES.MEDIA_DEVICE_UNAVAILABLE
      : !mediaRecorder
        ? PRACTICE_ERROR_CODES.MEDIARECORDER_UNSUPPORTED
        : null;
  const asrErrorCode = !secureContext
    ? PRACTICE_ERROR_CODES.INSECURE_CONTEXT
    : !speechRecognition ? PRACTICE_ERROR_CODES.ASR_UNSUPPORTED : null;

  return {
    audioContext: hasFunction(environment?.AudioContext) || hasFunction(environment?.webkitAudioContext),
    asrErrorCode,
    captureErrorCode,
    mediaRecorder,
    microphoneCapture,
    secureContext,
    speechRecognition,
    speechRecognitionUsable: speechRecognition && secureContext,
    speechRecognitionPrefix: hasFunction(standardRecognition)
      ? "standard"
      : hasFunction(prefixedRecognition) ? "webkit" : null,
    supportedRecordingMimeTypes: canProbeMimeTypes
      ? RECORDING_MIME_TYPE_CANDIDATES.filter((type) => Recorder.isTypeSupported(type))
      : [],
  };
}
