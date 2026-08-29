import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { test } from "node:test";

import {
  GAME_EVENTS,
  GAME_PHASES,
  PAUSE_REASONS,
  createGameSession,
  reduceGameSession,
} from "../../src/surfaces/group-3-8104/features/_legacy-games/shared/gameSession.js";
import {
  createPausableClock,
  createPausableScheduler,
} from "../../src/surfaces/group-3-8104/features/_legacy-games/shared/gameTiming.js";
import {
  GAME_COPY,
  highScoreStorageKey,
  loadHighScores,
  resetHighScores,
  saveHighScore,
  shuffle,
} from "../../src/surfaces/group-3-8104/features/_legacy-games/shared/gameData.js";

const GAME_ROOT = path.resolve("src/surfaces/group-3-8104/features/_legacy-games");

function transition(state, type, reason) {
  return reduceGameSession(state, { type, reason });
}

test("session reducer accepts the complete valid lifecycle and makes invalid transitions no-ops", () => {
  const idle = createGameSession();
  assert.equal(idle.phase, GAME_PHASES.IDLE);

  const ready = transition(idle, GAME_EVENTS.PREPARE);
  const playing = transition(ready, GAME_EVENTS.START);
  const completed = transition(playing, GAME_EVENTS.COMPLETE);
  const replayReady = transition(completed, GAME_EVENTS.RESTART);
  const cleanup = transition(replayReady, GAME_EVENTS.EXIT);

  assert.deepEqual(
    [ready.phase, playing.phase, completed.phase, replayReady.phase, cleanup.phase],
    [GAME_PHASES.READY, GAME_PHASES.PLAYING, GAME_PHASES.COMPLETED, GAME_PHASES.READY, GAME_PHASES.CLEANUP],
  );
  assert.strictEqual(transition(idle, GAME_EVENTS.START), idle);
  assert.strictEqual(transition(ready, GAME_EVENTS.RESUME, PAUSE_REASONS.MANUAL), ready);
  assert.strictEqual(transition(completed, GAME_EVENTS.PAUSE, PAUSE_REASONS.MANUAL), completed);
  assert.strictEqual(transition(cleanup, GAME_EVENTS.DISPOSE), cleanup);
});

test("visibility resume never clears an overlapping manual pause", () => {
  let state = transition(transition(createGameSession(), GAME_EVENTS.PREPARE), GAME_EVENTS.START);
  state = transition(state, GAME_EVENTS.PAUSE, PAUSE_REASONS.MANUAL);
  state = transition(state, GAME_EVENTS.PAUSE, PAUSE_REASONS.VISIBILITY);
  assert.equal(state.phase, GAME_PHASES.PAUSED);
  assert.deepEqual(state.pauseReasons, [PAUSE_REASONS.MANUAL, PAUSE_REASONS.VISIBILITY]);

  state = transition(state, GAME_EVENTS.RESUME, PAUSE_REASONS.VISIBILITY);
  assert.equal(state.phase, GAME_PHASES.PAUSED);
  assert.deepEqual(state.pauseReasons, [PAUSE_REASONS.MANUAL]);

  state = transition(state, GAME_EVENTS.RESUME, PAUSE_REASONS.MANUAL);
  assert.equal(state.phase, GAME_PHASES.PLAYING);
  assert.deepEqual(state.pauseReasons, []);
});

test("completion, restart, exit, and dispose clear pause reasons deterministically", () => {
  let state = transition(transition(createGameSession(), GAME_EVENTS.PREPARE), GAME_EVENTS.START);
  state = transition(state, GAME_EVENTS.PAUSE, PAUSE_REASONS.MANUAL);
  const completed = transition(state, GAME_EVENTS.COMPLETE);
  const restarted = transition(completed, GAME_EVENTS.RESTART);
  const exited = transition(restarted, GAME_EVENTS.EXIT);

  assert.deepEqual(completed, { phase: GAME_PHASES.COMPLETED, pauseReasons: [] });
  assert.deepEqual(restarted, { phase: GAME_PHASES.READY, pauseReasons: [] });
  assert.deepEqual(exited, { phase: GAME_PHASES.CLEANUP, pauseReasons: [] });
  assert.strictEqual(transition(exited, GAME_EVENTS.EXIT), exited);
  assert.strictEqual(transition(exited, GAME_EVENTS.DISPOSE), exited);
});

test("monotonic clock accounts for delayed event loops and expires exactly once", () => {
  let now = 0;
  let expiries = 0;
  const clock = createPausableClock({ duration: 1_000, now: () => now, onExpire: () => { expiries += 1; } });
  clock.start();
  now = 275;
  assert.equal(clock.getRemaining(), 725);
  now = 1_500;
  assert.equal(clock.getRemaining(), 0);
  assert.equal(clock.getRemaining(), 0);
  assert.equal(expiries, 1);
});

test("clock preserves time through rapid pause/resume and hidden-tab expiry boundaries", () => {
  let now = 0;
  let expiries = 0;
  const clock = createPausableClock({ duration: 1_000, now: () => now, onExpire: () => { expiries += 1; } });
  clock.start();
  for (let index = 0; index < 20; index += 1) {
    now += 10;
    clock.pause();
    now += 100;
    assert.equal(clock.getRemaining(), 1_000 - ((index + 1) * 10));
    clock.resume();
  }
  now += 799;
  assert.equal(clock.getRemaining(), 1);
  clock.pause();
  now += 5_000;
  assert.equal(clock.getRemaining(), 1);
  clock.resume();
  now += 1;
  assert.equal(clock.getRemaining(), 0);
  assert.equal(expiries, 1);
});

test("clock supports Turbo rate changes and bounded Sound Sprint time bonuses", () => {
  let now = 0;
  const clock = createPausableClock({ duration: 1_000, now: () => now });
  clock.start();
  now = 200;
  clock.setRate(0.55);
  now = 400;
  assert.equal(clock.getRemaining(), 690);
  assert.equal(clock.addTime(500, 1_000), 1_000);
  now = 600;
  assert.equal(clock.getRemaining(), 890);
});

function fakeTimers() {
  let now = 0;
  let nextId = 1;
  const timers = new Map();
  return {
    now: () => now,
    setTimer(callback, delay) {
      const id = nextId;
      nextId += 1;
      timers.set(id, { callback, due: now + delay });
      return id;
    },
    clearTimer(id) { timers.delete(id); },
    advance(delay) {
      now += delay;
      const due = [...timers.entries()].filter(([, timer]) => timer.due <= now);
      due.forEach(([id, timer]) => {
        timers.delete(id);
        timer.callback();
      });
    },
    pending: () => timers.size,
  };
}

test("scheduler freezes each callback's remaining delay while paused", () => {
  const timers = fakeTimers();
  let calls = 0;
  const scheduler = createPausableScheduler(timers);
  scheduler.schedule(() => { calls += 1; }, 100);
  timers.advance(30);
  scheduler.pause();
  timers.advance(500);
  assert.equal(calls, 0);
  assert.equal(timers.pending(), 0);
  scheduler.resume();
  timers.advance(69);
  assert.equal(calls, 0);
  timers.advance(1);
  assert.equal(calls, 1);
});

test("round invalidation and repeated cleanup do not stop the independent session clock", () => {
  let now = 0;
  const timers = fakeTimers();
  const scheduler = createPausableScheduler(timers);
  const clock = createPausableClock({ duration: 1_000, now: () => now });
  clock.start();
  scheduler.schedule(() => assert.fail("stale round callback ran"), 100);
  scheduler.invalidate();
  scheduler.invalidate();
  scheduler.dispose();
  scheduler.dispose();
  now = 250;
  assert.equal(clock.getRemaining(), 750);
  assert.equal(timers.pending(), 0);
});

test("scheduler invokes a rapid-submit callback at most once", () => {
  const timers = fakeTimers();
  let calls = 0;
  const scheduler = createPausableScheduler(timers);
  scheduler.schedule(() => { calls += 1; }, 0);
  timers.advance(0);
  timers.advance(0);
  assert.equal(calls, 1);
});

function memoryStorage(initial = {}) {
  const values = new Map(Object.entries(initial));
  return {
    getItem(key) { return values.has(key) ? values.get(key) : null; },
    setItem(key, value) { values.set(key, String(value)); },
    removeItem(key) { values.delete(key); },
  };
}

async function withStorage(storage, callback) {
  const original = globalThis.localStorage;
  Object.defineProperty(globalThis, "localStorage", { configurable: true, value: storage });
  try {
    await callback();
  } finally {
    if (original === undefined) delete globalThis.localStorage;
    else Object.defineProperty(globalThis, "localStorage", { configurable: true, value: original });
  }
}

test("storage handles first run, reset, duplicate run IDs, and versioned scope isolation", async () => {
  const first = { level: "hsk1", lessonId: "lesson-1", game: "dash" };
  const second = { level: "hsk1", lessonId: "lesson-2", game: "dash" };
  await withStorage(memoryStorage(), () => {
    assert.deepEqual(loadHighScores(first), []);
    saveHighScore(first, { runId: "same", score: 10, stars: 1, accuracy: 50, date: "2026-01-01T00:00:00Z" });
    saveHighScore(first, { runId: "same", score: 20, stars: 2, accuracy: 80, date: "2026-01-01T00:00:01Z" });
    assert.deepEqual(loadHighScores(first).map((row) => row.score), [20]);
    assert.deepEqual(loadHighScores(second), []);
    assert.notEqual(highScoreStorageKey(first), highScoreStorageKey(second));
    assert.equal(resetHighScores(first), true);
    assert.deepEqual(loadHighScores(first), []);
  });
});

test("storage reset tolerates blocked writes", async () => {
  await withStorage({
    getItem() { throw new Error("blocked"); },
    removeItem() { throw new Error("blocked"); },
  }, () => {
    assert.equal(resetHighScores({ game: "blitz" }), false);
  });
});

test("shuffle clamps RNG boundary values and invalid output without sparse array properties", () => {
  const source = ["a", "b", "c", "d"];
  assert.deepEqual(shuffle(source, () => 0), ["b", "c", "d", "a"]);
  assert.deepEqual(shuffle(source, () => 0.999999999999), source);
  assert.deepEqual(shuffle(source, () => 1), source);
  assert.deepEqual(shuffle(source, () => Number.NaN), ["b", "c", "d", "a"]);
  assert.deepEqual(Object.keys(shuffle(source, () => Number.POSITIVE_INFINITY)), ["0", "1", "2", "3"]);
});

test("seeded shuffle distribution visits every first-position bucket within fixed tolerance", () => {
  let seed = 0x12345678;
  const rng = () => {
    seed = (1664525 * seed + 1013904223) >>> 0;
    return seed / 0x1_0000_0000;
  };
  const counts = new Map([["a", 0], ["b", 0], ["c", 0], ["d", 0]]);
  for (let index = 0; index < 4_000; index += 1) {
    const first = shuffle(["a", "b", "c", "d"], rng)[0];
    counts.set(first, counts.get(first) + 1);
  }
  for (const count of counts.values()) assert.ok(count >= 850 && count <= 1_150, `bucket ${count} outside tolerance`);
});

test("all languages expose concise manual pause and resume controls", () => {
  for (const language of ["th", "zh", "en"]) {
    assert.equal(typeof GAME_COPY[language].pause, "string");
    assert.ok(GAME_COPY[language].pause.length > 0);
    assert.equal(typeof GAME_COPY[language].resume, "string");
    assert.ok(GAME_COPY[language].resume.length > 0);
  }
});

test("all four games use shared session and pausable scheduler contracts with a HUD pause toggle", async () => {
  const components = [
    "vocab-blitz/VocabBlitzGame.jsx",
    "card-frenzy/CardFrenzyGame.jsx",
    "sound-sprint/SoundSprintGame.jsx",
    "pinyin-dash/PinyinDashGame.jsx",
  ];
  for (const component of components) {
    const source = await readFile(path.join(GAME_ROOT, component), "utf8");
    assert.match(source, /useGameSession\(\)/, component);
    assert.match(source, /usePausableScheduler\(paused\)/, component);
    assert.match(source, /onPauseToggle=\{toggleManualPause\}/, component);
  }
});

test("all timed games use the independent monotonic pausable clock", async () => {
  for (const component of [
    "vocab-blitz/VocabBlitzGame.jsx",
    "sound-sprint/SoundSprintGame.jsx",
    "pinyin-dash/PinyinDashGame.jsx",
  ]) {
    const source = await readFile(path.join(GAME_ROOT, component), "utf8");
    assert.match(source, /usePausableGameClock\(\{/, component);
  }
});

test("Hub score memo refreshes exactly when active game returns to the Hub", async () => {
  const source = await readFile(path.join(GAME_ROOT, "hub/Group3GameHub.jsx"), "utf8");
  assert.match(source, /\[activeGame, language, lesson\.id, lesson\.level, lesson\.slug\]/);
});
