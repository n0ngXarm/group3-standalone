import assert from "node:assert/strict";
import test from "node:test";

const modulePath = "../../src/surfaces/group-3-8104/features/practice/audio/audioRecorder.js";

function createEnvironment({ permissionError = null } = {}) {
  const revoked = [];
  const tracks = [{ stopped: 0, stop() { this.stopped += 1; } }];
  const stream = { getTracks: () => tracks };
  const timers = new Map();
  let timerId = 0;
  class FakeMediaRecorder {
    static isTypeSupported(type) { return type === "audio/webm;codecs=opus"; }
    constructor(input, options) {
      this.input = input;
      this.mimeType = options.mimeType;
      this.state = "inactive";
    }
    start() { this.state = "recording"; }
    stop() {
      if (this.state === "inactive") return;
      this.state = "inactive";
      this.ondataavailable?.({ data: new Blob(["voice"], { type: this.mimeType }) });
      this.onstop?.();
    }
  }
  const environment = {
    Blob,
    MediaRecorder: FakeMediaRecorder,
    navigator: { mediaDevices: { getUserMedia: async () => {
      if (permissionError) throw permissionError;
      return stream;
    } } },
    URL: {
      createObjectURL: () => "blob:voice-answer",
      revokeObjectURL: (url) => revoked.push(url),
    },
    clearTimeout: (id) => timers.delete(id),
    setTimeout: (fn) => { timerId += 1; timers.set(timerId, fn); return timerId; },
  };
  return { environment, revoked, runTimers: () => [...timers.values()].forEach((fn) => fn()), tracks };
}

test("recorder starts, stops, exposes a playable blob, and releases tracks", async () => {
  const { createAudioRecorder } = await import(modulePath);
  const fixture = createEnvironment();
  const events = [];
  const recorder = createAudioRecorder({ environment: fixture.environment, now: (() => { let time = 100; return () => (time += 500); })(), onEvent: (event) => events.push(event) });

  assert.equal(await recorder.start(), true);
  assert.equal(recorder.stop(), true);
  assert.deepEqual(events.map((event) => event.type), ["started", "completed"]);
  assert.equal(events[1].recording.playbackUrl, "blob:voice-answer");
  assert.equal(events[1].recording.blob.size, 5);
  assert.equal(fixture.tracks[0].stopped, 1);

  recorder.discard();
  assert.deepEqual(fixture.revoked, ["blob:voice-answer"]);
});

test("recorder maps permission denial to a stable error and does not leak tracks", async () => {
  const { createAudioRecorder } = await import(modulePath);
  const fixture = createEnvironment({ permissionError: Object.assign(new Error("denied"), { name: "NotAllowedError" }) });
  const events = [];
  const recorder = createAudioRecorder({ environment: fixture.environment, onEvent: (event) => events.push(event) });

  assert.equal(await recorder.start(), false);
  assert.equal(events.at(-1).error.code, "MIC_PERMISSION_DENIED");
  assert.equal(fixture.tracks[0].stopped, 0);
});

test("duration limit stops recording once and cleanup remains idempotent", async () => {
  const { createAudioRecorder } = await import(modulePath);
  const fixture = createEnvironment();
  const events = [];
  const recorder = createAudioRecorder({ durationLimitMs: 120_000, environment: fixture.environment, onEvent: (event) => events.push(event) });

  await recorder.start();
  fixture.runTimers();
  recorder.dispose();
  recorder.dispose();

  assert.equal(events.filter((event) => event.type === "completed").length, 1);
  assert.equal(events.find((event) => event.type === "completed").reason, "timeout");
  assert.equal(fixture.tracks[0].stopped, 1);
  assert.deepEqual(fixture.revoked, ["blob:voice-answer"]);
});

test("unsupported MediaRecorder returns a localized error code contract", async () => {
  const { createAudioRecorder } = await import(modulePath);
  const events = [];
  const recorder = createAudioRecorder({ environment: { navigator: { mediaDevices: {} } }, onEvent: (event) => events.push(event) });

  assert.equal(recorder.supported, false);
  assert.equal(await recorder.start(), false);
  assert.equal(events.at(-1).error.code, "MEDIARECORDER_UNSUPPORTED");
});
