import { detectSpeakingCapabilities, RECORDING_MIME_TYPE_CANDIDATES } from "./browserCapabilities.js";
import { PRACTICE_ERROR_CODES, practiceError } from "../errors.js";

function stopTracks(stream) {
  for (const track of stream?.getTracks?.() || []) {
    try {
      track.stop();
    } catch {
      // already stopped
    }
  }
}

function permissionError(error) {
  return error?.name === "NotAllowedError" || error?.name === "PermissionDeniedError";
}

export function createAudioRecorder({
  durationLimitMs = 120_000,
  environment = globalThis,
  now = () => performance.now(),
  onEvent = () => {},
} = {}) {
  const Recorder = environment?.MediaRecorder;
  const getUserMedia = environment?.navigator?.mediaDevices?.getUserMedia;
  const capabilities = detectSpeakingCapabilities(environment);
  const supported = capabilities.captureErrorCode === null;
  const mimeType = typeof Recorder?.isTypeSupported === "function"
    ? RECORDING_MIME_TYPE_CANDIDATES.find((type) => Recorder.isTypeSupported(type)) || ""
    : "";
  let recorder = null;
  let stream = null;
  let chunks = [];
  let startedAt = 0;
  let timeoutId = null;
  let completionReason = "user";
  let cancelled = false;
  let recording = null;

  const clearTimer = () => {
    if (timeoutId !== null) environment.clearTimeout(timeoutId);
    timeoutId = null;
  };
  const discard = () => {
    if (recording?.playbackUrl) environment.URL?.revokeObjectURL?.(recording.playbackUrl);
    recording = null;
  };
  const releaseStream = () => {
    stopTracks(stream);
    stream = null;
  };

  const controller = {
    cancel() {
      if (!recorder || recorder.state === "inactive") return false;
      cancelled = true;
      clearTimer();
      try {
        recorder.stop();
      } catch {
        // already stopped
      }
      return true;
    },
    discard,
    dispose() {
      clearTimer();
      if (recorder && recorder.state !== "inactive") {
        cancelled = true;
        try {
          recorder.stop();
        } catch {
          // already stopped
        }
      } else {
        releaseStream();
      }
      discard();
    },
    mimeType,
    async start() {
      if (!supported) {
        onEvent({ type: "error", error: practiceError(capabilities.captureErrorCode) });
        return false;
      }
      if (recorder && recorder.state !== "inactive") return false;
      discard();
      chunks = [];
      cancelled = false;
      completionReason = "user";
      try {
        const mediaDevices = environment.navigator?.mediaDevices;
        try {
          stream = await getUserMedia.call(mediaDevices, {
            audio: {
              echoCancellation: true,
              noiseSuppression: true,
              autoGainControl: true,
            },
          });
        } catch (constraintErr) {
          if (permissionError(constraintErr)) throw constraintErr;
          stream = await getUserMedia.call(mediaDevices, { audio: true });
        }

        recorder = mimeType ? new Recorder(stream, { mimeType }) : new Recorder(stream);
        recorder.ondataavailable = (event) => {
          if (event?.data?.size > 0) chunks.push(event.data);
        };
        recorder.onerror = () => {
          releaseStream();
          onEvent({ type: "error", error: practiceError(PRACTICE_ERROR_CODES.MEDIA_DEVICE_UNAVAILABLE) });
        };
        recorder.onstop = () => {
          clearTimer();
          const durationMs = Math.max(0, now() - startedAt);
          releaseStream();
          if (cancelled) {
            chunks = [];
            onEvent({ type: "cancelled" });
            return;
          }
          const BlobConstructor = environment.Blob || globalThis.Blob;
          const blob = new BlobConstructor(chunks, { type: recorder.mimeType || mimeType || "audio/webm" });
          const playbackUrl = environment.URL?.createObjectURL?.(blob) || "";
          recording = { blob, durationMs, mimeType: blob.type, playbackUrl };
          chunks = [];
          onEvent({ type: "completed", reason: completionReason, recording });
        };
        startedAt = now();
        try {
          recorder.start(250);
        } catch {
          recorder.start();
        }
        timeoutId = environment.setTimeout(() => controller.stop("timeout"), Math.max(1, Number(durationLimitMs) || 120_000));
        onEvent({ type: "started", mimeType: recorder.mimeType || mimeType });
        return true;
      } catch (error) {
        releaseStream();
        const code = permissionError(error)
          ? PRACTICE_ERROR_CODES.MIC_PERMISSION_DENIED
          : PRACTICE_ERROR_CODES.MEDIA_DEVICE_UNAVAILABLE;
        onEvent({ type: "error", error: practiceError(code) });
        return false;
      }
    },
    stop(reason = "user") {
      if (!recorder || recorder.state === "inactive") return false;
      completionReason = reason;
      clearTimer();
      try {
        recorder.stop();
      } catch {
        // already stopped
      }
      return true;
    },
    supported,
  };
  return Object.freeze(controller);
}
