import { GROUP3_VOICE_PROFILES } from "./voices.js";

let activeVoiceAudio = null;
let activeVoiceUtterance = null;
let activeVoicePlayback = null;
let activeBufferSource = null;
let voiceSession = 0;

let audioContext = null;
const audioBufferCache = new Map();

function createPlayback(session) {
  let resolveCompletion;
  const completion = new Promise((resolve) => {
    resolveCompletion = resolve;
  });
  const playback = {
    audio: null,
    bufferSource: null,
    completion,
    done: false,
    session,
    settle(status, error = null) {
      if (playback.done) return;
      playback.done = true;
      if (activeVoicePlayback === playback) activeVoicePlayback = null;
      resolveCompletion({ error, status });
    },
    timeoutId: null,
    utterance: null,
  };
  playback.cancel = () => {
    if (activeVoicePlayback === playback && playback.session === voiceSession) stopChineseVoice();
  };
  return playback;
}

function clearPlaybackMedia(playback) {
  if (!playback) return;
  window.clearTimeout(playback.timeoutId);
  playback.timeoutId = null;
  if (playback.audio) {
    const audio = playback.audio;
    playback.audio = null;
    if (activeVoiceAudio === audio) activeVoiceAudio = null;
    audio.pause();
    audio.removeAttribute("src");
    audio.load();
  }
  if (playback.bufferSource) {
    const source = playback.bufferSource;
    playback.bufferSource = null;
    if (activeBufferSource === source) activeBufferSource = null;
    source.onended = null;
    try {
      source.stop();
    } catch (error) {
      // already stopped
    }
    try {
      source.disconnect();
    } catch (error) {
      // already disconnected
    }
  }
  if (playback.utterance) {
    const utterance = playback.utterance;
    playback.utterance = null;
    if (activeVoiceUtterance === utterance) activeVoiceUtterance = null;
    utterance.onend = null;
    utterance.onerror = null;
  }
}

function finishPlayback(playback, status, error = null) {
  if (!playback || playback.done) return;
  if (playback.utterance) window.speechSynthesis?.cancel();
  clearPlaybackMedia(playback);
  playback.settle(status, error);
}

export function stopChineseVoice() {
  voiceSession += 1;
  const playback = activeVoicePlayback;
  activeVoicePlayback = null;
  clearPlaybackMedia(playback);
  playback?.settle("cancelled");
  activeVoiceAudio = null;
  activeVoiceUtterance = null;
  activeBufferSource = null;
  window.speechSynthesis?.cancel();
}

export function unlockChineseAudio() {
  const Ctor = window.AudioContext || window.webkitAudioContext;
  if (!Ctor) return;
  if (!audioContext) audioContext = new Ctor();
  if (audioContext.state === "suspended") {
    audioContext.resume().catch(() => {});
  }
}

export function playUiCue(kind = "tap") {
  const Ctor = window.AudioContext || window.webkitAudioContext;
  if (!Ctor) return false;
  if (!audioContext) audioContext = new Ctor();

  const play = () => {
    const now = audioContext.currentTime;
    const gain = audioContext.createGain();
    const frequencies = kind === "confirm" ? [523.25, 659.25] : [440];
    const duration = kind === "confirm" ? 0.16 : 0.08;

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.032, now + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    gain.connect(audioContext.destination);

    frequencies.forEach((frequency, index) => {
      const oscillator = audioContext.createOscillator();
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(frequency, now);
      oscillator.connect(gain);
      oscillator.start(now + index * 0.035);
      oscillator.stop(now + duration + index * 0.035);
      oscillator.addEventListener("ended", () => oscillator.disconnect(), { once: true });
    });
    window.setTimeout(() => gain.disconnect(), (duration + 0.08) * 1000);
  };

  if (audioContext.state === "suspended") {
    audioContext.resume().then(play).catch(() => {});
  } else {
    play();
  }
  return true;
}

export function resetChineseAudioForTests() {
  stopChineseVoice();
  audioContext = null;
  audioBufferCache.clear();
  voiceSession = 0;
}

function getChineseVoices() {
  if (typeof window === "undefined" || !window.speechSynthesis?.getVoices) return [];
  const voices = window.speechSynthesis.getVoices() || [];
  return voices.filter((voice) => /^(zh|cmn|yue)[-_]/i.test(voice.lang) || voice.lang === "zh");
}

function createUtterance(text, profileId, playback, maxDurationMs, rate) {
  const profile = GROUP3_VOICE_PROFILES[profileId] || GROUP3_VOICE_PROFILES.wang;
  const chineseVoices = getChineseVoices();
  const fallbackHints = profile.browserHints.includes("female")
    ? ["natural", "google", "ting-ting", "xiaoxiao", "meijia", "sinji", "huihui"]
    : ["natural", "google", "yunjian", "yunxi", "yunyang", "zhiyu", "kangkang"];
  const hintedVoice = chineseVoices.find((voice) => profile.browserHints.some((hint) => voice.name.toLowerCase().includes(hint))) ||
    chineseVoices.find((voice) => fallbackHints.some((hint) => voice.name.toLowerCase().includes(hint)));
  const profileIndex = Object.keys(GROUP3_VOICE_PROFILES).indexOf(profileId);
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "zh-CN";
  utterance.voice = hintedVoice || chineseVoices[Math.max(0, profileIndex) % Math.max(1, chineseVoices.length)] || null;
  utterance.rate = Math.max(0.5, Math.min(2, profile.fallbackRate * rate));
  utterance.pitch = profile.fallbackPitch;
  utterance.onend = () => {
    if (playback.session === voiceSession) finishPlayback(playback, "ended");
  };
  utterance.onerror = (event) => {
    if (playback.session === voiceSession) finishPlayback(playback, "unavailable", event.error || null);
  };
  playback.utterance = utterance;
  activeVoiceUtterance = utterance;
  playback.timeoutId = window.setTimeout(() => {
    if (playback.session === voiceSession) finishPlayback(playback, "timeout");
  }, maxDurationMs);
  return utterance;
}

export function speakWithDeviceVoice(text, profileId, {
  maxDurationMs = 14000,
  playback = null,
  rate = 1,
} = {}) {
  const controller = playback || createPlayback(voiceSession);
  if (!playback) activeVoicePlayback = controller;
  if (!window.speechSynthesis || typeof SpeechSynthesisUtterance === "undefined") {
    finishPlayback(controller, "unavailable");
    return controller;
  }
  const utterance = createUtterance(text, profileId, controller, maxDurationMs, rate);
  try {
    window.speechSynthesis.speak(utterance);
  } catch (error) {
    finishPlayback(controller, error?.name === "NotAllowedError" ? "blocked" : "unavailable", error);
  }
  return controller;
}

async function fetchAudioBuffer(src) {
  if (audioBufferCache.has(src)) return audioBufferCache.get(src);
  const response = await fetch(src);
  if (!response.ok) throw new Error(`audio fetch ${response.status}`);
  const arrayBuffer = await response.arrayBuffer();
  const buffer = await audioContext.decodeAudioData(arrayBuffer);
  audioBufferCache.set(src, buffer);
  return buffer;
}

function playViaWebAudio(playback, audioSrc, maxDurationMs, session, text, profileId, rate) {
  const Ctor = window.AudioContext || window.webkitAudioContext;
  if (!Ctor || !window.fetch) return null;
  if (!audioContext) audioContext = new Ctor();

  let settled = false;
  const settle = (status, error = null) => {
    if (settled || playback.done) return;
    settled = true;
    clearPlaybackMedia(playback);
    playback.settle(status, error);
  };
  const startFromBuffer = (buffer) => {
    if (playback.session !== session || playback.done) return;
    if (audioContext.state === "suspended") {
      audioContext.resume().catch(() => settle("blocked")).then(() => {
        if (!settled && audioContext.state !== "suspended") startFromBuffer(buffer);
        else if (!settled) settle("blocked");
      });
      return;
    }
    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.playbackRate.value = Math.max(0.5, Math.min(2, rate));
    source.connect(audioContext.destination);
    source.onended = () => {
      if (activeBufferSource === source) activeBufferSource = null;
      settle("ended");
    };
    playback.bufferSource = source;
    activeBufferSource = source;
    playback.timeoutId = window.setTimeout(() => settle("timeout"), maxDurationMs / Math.max(0.5, rate));
    try {
      source.start();
    } catch (error) {
      settle("unavailable", error);
    }
  };

  fetchAudioBuffer(audioSrc)
    .then((buffer) => {
      if (playback.session === session && !playback.done) startFromBuffer(buffer);
    })
    .catch(() => {
      if (playback.session === session && !playback.done) {
        if (audioContext.state === "suspended") settle("blocked");
        else speakWithDeviceVoice(text, profileId, { maxDurationMs, playback, rate });
      }
    });
  return playback;
}

function playViaElement(playback, audioSrc, maxDurationMs, session, text, profileId, rate) {
  const audio = new Audio(audioSrc);
  let fallbackStarted = false;
  const fallback = (error = null) => {
    if (fallbackStarted || activeVoiceAudio !== audio || session !== voiceSession) return;
    fallbackStarted = true;
    window.clearTimeout(playback.timeoutId);
    playback.timeoutId = null;
    audio.pause();
    audio.removeAttribute("src");
    audio.load();
    playback.audio = null;
    activeVoiceAudio = null;
    if (error?.name === "NotAllowedError") {
      finishPlayback(playback, "blocked", error);
      return;
    }
    speakWithDeviceVoice(text, profileId, { maxDurationMs, playback, rate });
  };
  audio.preload = "metadata";
  audio.volume = 0.96;
  audio.playbackRate = rate;
  playback.audio = audio;
  audio.addEventListener("ended", () => {
    if (session === voiceSession && activeVoiceAudio === audio) finishPlayback(playback, "ended");
  }, { once: true });
  audio.addEventListener("error", () => fallback(), { once: true });
  activeVoiceAudio = audio;
  playback.timeoutId = window.setTimeout(() => {
    if (session === voiceSession) fallback();
  }, maxDurationMs);
  audio.play().catch(fallback);
  return playback;
}

export function speakChinese(text, {
  audioSrc = "",
  maxDurationMs = 14000,
  profileId = "wang",
  rate = 1,
} = {}) {
  stopChineseVoice();
  const session = voiceSession;
  const playback = createPlayback(session);
  activeVoicePlayback = playback;
  if (!audioSrc || typeof Audio === "undefined") {
    return speakWithDeviceVoice(text, profileId, { maxDurationMs, playback, rate });
  }
  return playViaWebAudio(playback, audioSrc, maxDurationMs, session, text, profileId, rate);
}

export function playChineseTTS(text, options = {}) {
  return speakChinese(text, options);
}
