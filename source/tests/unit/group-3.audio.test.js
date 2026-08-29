import assert from "node:assert/strict";
import { afterEach, beforeEach, test } from "node:test";

import {
  resetChineseAudioForTests,
  speakChinese,
  speakWithDeviceVoice,
  stopChineseVoice,
  unlockChineseAudio,
} from "../../src/surfaces/group-3-8104/services/audio/group3Audio.js";

/*
Test cases:
1. A local dialogue file resolves with `ended` and applies the requested speed.
2. Explicit cancellation resolves the active playback once as `cancelled`.
3. Browser autoplay rejection resolves as `blocked` without attempting device TTS.
4. A failed local file falls back to a Chinese device voice and resolves on speech end.
5. Missing browser speech APIs resolve as `unavailable` instead of hanging.
6. A device voice that never ends resolves deterministically as `timeout`.
7. Device TTS selects a matching Chinese voice and clamps the effective speaking rate.
8. Cancelling a stale playback handle cannot cancel the newer active manual voice.
*/

class FakeAudio {
  static instances = [];
  static playError = null;

  constructor(src) {
    this.src = src;
    this.listeners = new Map();
    this.loadCalls = 0;
    this.pauseCalls = 0;
    this.playbackRate = 1;
    this.preload = "";
    this.removedAttributes = [];
    this.volume = 1;
    FakeAudio.instances.push(this);
  }

  addEventListener(type, listener) {
    this.listeners.set(type, listener);
  }

  emit(type, event = {}) {
    this.listeners.get(type)?.(event);
  }

  load() {
    this.loadCalls += 1;
  }

  pause() {
    this.pauseCalls += 1;
  }

  play() {
    return FakeAudio.playError
      ? Promise.reject(FakeAudio.playError)
      : Promise.resolve();
  }

  removeAttribute(name) {
    this.removedAttributes.push(name);
    if (name === "src") this.src = "";
  }
}

class FakeSource {
  static instances = [];

  constructor() {
    this.playbackRate = { value: 1 };
    this.buffer = null;
    this.connected = false;
    this.started = false;
    this.stopCalls = 0;
    this.disconnectCalls = 0;
    this.onended = null;
    FakeSource.instances.push(this);
  }

  connect() {
    this.connected = true;
  }

  start() {
    this.started = true;
  }

  stop() {
    this.stopCalls += 1;
  }

  disconnect() {
    this.disconnectCalls += 1;
  }
}

class FakeAudioContext {
  static instance = null;
  static decodeError = null;
  static defaultState = "running";

  constructor() {
    this.state = FakeAudioContext.defaultState;
    this.destination = {};
    FakeAudioContext.instance = this;
  }

  async decodeAudioData() {
    if (FakeAudioContext.decodeError) throw FakeAudioContext.decodeError;
    return new ArrayBuffer(8);
  }

  createBufferSource() {
    return new FakeSource();
  }

  resume() {
    this.state = "running";
    return Promise.resolve();
  }
}

class FakeUtterance {
  constructor(text) {
    this.text = text;
  }
}

function installBrowserMocks({ speech = true, voices = [] } = {}) {
  const synthesis = speech
    ? {
        cancelCalls: 0,
        getVoices: () => voices,
        speakCalls: [],
        cancel() {
          this.cancelCalls += 1;
        },
        speak(utterance) {
          this.speakCalls.push(utterance);
        },
      }
    : undefined;

  globalThis.window = {
    clearTimeout,
    setTimeout,
    speechSynthesis: synthesis,
    AudioContext: FakeAudioContext,
  };
  globalThis.Audio = FakeAudio;
  globalThis.SpeechSynthesisUtterance = speech ? FakeUtterance : undefined;
  globalThis.AudioContext = FakeAudioContext;
  FakeAudioContext.instance = null;
  FakeAudioContext.decodeError = null;
  FakeAudioContext.defaultState = "running";
  FakeSource.instances = [];
  globalThis.fetch = async (url) => {
    fetchCalls.push(url);
    return fetchResponses.has(url)
      ? { ok: true, arrayBuffer: async () => new ArrayBuffer(8) }
      : { ok: false, status: 404 };
  };
  globalThis.window.fetch = globalThis.fetch;
  return synthesis;
}

async function waitForSource(index = 0) {
  for (let i = 0; i < 200; i += 1) {
    if (FakeSource.instances.length > index) {
      return FakeSource.instances[index];
    }
    await new Promise((resolve) => setTimeout(resolve, 1));
  }
  return undefined;
}

const fetchResponses = new Set([
  "/group3/assets/group3/voices/test.mp3",
  "/voice.mp3",
  "/autoplay.mp3",
  "/manual.mp3",
]);
let fetchCalls = [];

beforeEach(() => {
  FakeAudio.instances = [];
  FakeAudio.playError = null;
  fetchCalls = [];
  installBrowserMocks();
  fetchResponses.add("/group3/assets/group3/voices/test.mp3");
  fetchResponses.add("/voice.mp3");
  fetchResponses.add("/autoplay.mp3");
  fetchResponses.add("/manual.mp3");
  resetChineseAudioForTests();
  unlockChineseAudio();
  stopChineseVoice();
});

afterEach(() => {
  stopChineseVoice();
  delete globalThis.Audio;
  delete globalThis.SpeechSynthesisUtterance;
  delete globalThis.AudioContext;
  delete globalThis.fetch;
  delete globalThis.window;
  fetchResponses.clear();
});

test("local dialogue audio resolves when playback ends", { concurrency: false }, async () => {
  const synthesis = installBrowserMocks();
  const playback = speakChinese("你好", {
    audioSrc: "/group3/assets/group3/voices/test.mp3",
    profileId: "wang",
    rate: 1.15,
  });
  const source = await waitForSource();

  assert.equal(source.playbackRate.value, 1.15);
  assert.equal(source.connected, true);
  assert.equal(source.started, true);
  source.onended();

  assert.deepEqual(await playback.completion, { error: null, status: "ended" });
  assert.equal(synthesis.speakCalls.length, 0);
  assert.equal(source.stopCalls, 1);
});

test("stopping active playback resolves it as cancelled only once", { concurrency: false }, async () => {
  const playback = speakChinese("谢谢", { audioSrc: "/voice.mp3" });
  const source = await waitForSource();
  const onended = source.onended;

  stopChineseVoice();
  onended();

  assert.deepEqual(await playback.completion, { error: null, status: "cancelled" });
  assert.equal(source.stopCalls, 1);
});

test("an autoplay permission rejection resolves as blocked", { concurrency: false }, async () => {
  const synthesis = globalThis.window.speechSynthesis;
  FakeAudioContext.instance.state = "suspended";
  FakeAudioContext.instance.resume = () =>
    Promise.reject(Object.assign(new Error("gesture required"), { name: "NotAllowedError" }));

  const playback = speakChinese("请问", { audioSrc: "/voice.mp3" });
  const result = await playback.completion;

  assert.equal(result.status, "blocked");
  assert.equal(synthesis.speakCalls.length, 0);
});

test("a failed dialogue file falls back to the matching Chinese device voice", { concurrency: false }, async () => {
  const voices = [
    { lang: "en-US", name: "English" },
    { lang: "zh-CN", name: "Microsoft Xiaoxiao Online" },
  ];
  const synthesis = installBrowserMocks({ voices });
  unlockChineseAudio();
  const playback = speakChinese("苹果多少钱", {
    audioSrc: "/missing.mp3",
    profileId: "wang",
  });

  await new Promise((resolve) => setTimeout(resolve, 10));
  assert.equal(synthesis.speakCalls.length, 1);
  const utterance = synthesis.speakCalls[0];
  assert.equal(utterance.lang, "zh-CN");
  assert.equal(utterance.voice, voices[1]);
  utterance.onend();

  assert.deepEqual(await playback.completion, { error: null, status: "ended" });
});

test("missing speech APIs resolve as unavailable", { concurrency: false }, async () => {
  installBrowserMocks({ speech: false });
  globalThis.Audio = undefined;

  const playback = speakChinese("再见", { audioSrc: "" });

  assert.deepEqual(await playback.completion, { error: null, status: "unavailable" });
});

test("device speech that never ends resolves as timeout", { concurrency: false }, async () => {
  installBrowserMocks({ voices: [{ lang: "zh-CN", name: "Chinese" }] });
  const playback = speakWithDeviceVoice("一杯茶", "wang", { maxDurationMs: 5 });

  assert.deepEqual(await playback.completion, { error: null, status: "timeout" });
});

test("device speech applies profile selection and clamps rate", { concurrency: false }, async () => {
  const voices = [
    { lang: "zh-CN", name: "Generic Chinese" },
    { lang: "zh-CN", name: "Yunyang Natural" },
  ];
  const synthesis = installBrowserMocks({ voices });
  const playback = speakWithDeviceVoice("一斤饺子", "restaurantServer", {
    maxDurationMs: 100,
    rate: 99,
  });
  const utterance = synthesis.speakCalls[0];

  assert.equal(utterance.voice, voices[1]);
  assert.equal(utterance.rate, 2);
  assert.equal(utterance.pitch, 0.82);
  utterance.onend();
  assert.equal((await playback.completion).status, "ended");
});

test("a stale playback cleanup cannot cancel the newer active voice", { concurrency: false }, async () => {
  const autoplay = speakChinese("第一句", { audioSrc: "/autoplay.mp3" });
  const autoplaySource = await waitForSource();
  while (!autoplaySource.started) {
    await new Promise((resolve) => setTimeout(resolve, 1));
  }
  const manual = speakChinese("手动播放", { audioSrc: "/manual.mp3" });
  const manualSource = await waitForSource(1);
  assert.notEqual(manualSource, autoplaySource);

  autoplay.cancel();
  assert.equal(manualSource.stopCalls, 0);
  assert.equal(autoplaySource.stopCalls, 1);

  manualSource.onended();
  assert.deepEqual(await manual.completion, { error: null, status: "ended" });
  assert.equal(manualSource.stopCalls, 1);
  assert.equal(autoplaySource.stopCalls, 1);
});

test("Web Audio cache keys use the complete resource URL across levels and lessons", { concurrency: false }, async () => {
  const hsk1 = "/assets/group3/lessons/hsk1/lesson-01/audio/scene-01/line-01.mp3?v=one";
  const hsk2 = "/assets/group3/lessons/hsk2/lesson-02/audio/scene-01/line-01.mp3?v=one";
  fetchResponses.add(hsk1);
  fetchResponses.add(hsk2);

  const first = speakChinese("第一课", { audioSrc: hsk1 });
  const firstSource = await waitForSource();
  firstSource.onended();
  await first.completion;

  const second = speakChinese("第二课", { audioSrc: hsk2 });
  const secondSource = await waitForSource(1);
  assert.equal(secondSource.started, true);
  assert.deepEqual(fetchCalls, [hsk1, hsk2]);
  secondSource.onended();
  await second.completion;

  const replay = speakChinese("第一课", { audioSrc: hsk1 });
  const replaySource = await waitForSource(2);
  assert.equal(replaySource.started, true);
  assert.deepEqual(fetchCalls, [hsk1, hsk2], "cached replay fetched a URL that was already decoded");
  replaySource.onended();
  await replay.completion;
});

test("a late fetch cannot start stale audio after the visible line changes", { concurrency: false }, async () => {
  const staleUrl = "/late/scene-01/line-01.mp3";
  const currentUrl = "/current/scene-01/line-02.mp3";
  let releaseStaleFetch;
  globalThis.fetch = (url) => {
    fetchCalls.push(url);
    if (url === staleUrl) {
      return new Promise((resolve) => {
        releaseStaleFetch = () => resolve({ ok: true, arrayBuffer: async () => new ArrayBuffer(8) });
      });
    }
    return Promise.resolve({ ok: true, arrayBuffer: async () => new ArrayBuffer(8) });
  };
  globalThis.window.fetch = globalThis.fetch;

  const stale = speakChinese("旧句子", { audioSrc: staleUrl });
  await Promise.resolve();
  const current = speakChinese("当前句子", { audioSrc: currentUrl });
  releaseStaleFetch();
  const currentSource = await waitForSource();
  await new Promise((resolve) => setTimeout(resolve, 5));

  assert.deepEqual(await stale.completion, { error: null, status: "cancelled" });
  assert.equal(FakeSource.instances.length, 1);
  assert.equal(currentSource.started, true);
  currentSource.onended();
  assert.deepEqual(await current.completion, { error: null, status: "ended" });
});
