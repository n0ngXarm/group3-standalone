import assert from "node:assert/strict";
import { test } from "node:test";

const sessionModule = "../../src/surfaces/group-3-8104/features/practice/session/repeatSession.js";

function tenExerciseIds() {
  return Array.from({ length: 10 }, (_, index) => `repeat-${index + 1}`);
}

function advanceToReady(reducer, state) {
  state = reducer(state, { type: "START" });
  state = reducer(state, { type: "PLAY_PROMPT" });
  return reducer(state, { type: "PROMPT_FINISHED" });
}

test("repeat session follows a successful reducer flow without contradictory flags", async () => {
  const { createRepeatSession, getRepeatSessionProgress, repeatSessionReducer } = await import(sessionModule);
  let state = createRepeatSession({ exerciseIds: tenExerciseIds(), level: 1, sessionId: "session-1" });
  assert.equal(state.phase, "idle");
  assert.deepEqual(getRepeatSessionProgress(state), {
    completedCount: 0, currentIndex: 0, progress: 0, totalCount: 10,
  });
  state = advanceToReady(repeatSessionReducer, state);
  assert.equal(state.phase, "ready");
  state = repeatSessionReducer(state, { attemptId: "attempt-1", type: "RECORD_START" });
  assert.equal(state.phase, "listening");
  state = repeatSessionReducer(state, { attemptId: "attempt-1", transcript: "我要去学校", type: "TRANSCRIPT_FINAL" });
  assert.equal(state.phase, "processing");
  state = repeatSessionReducer(state, {
    attemptId: "attempt-1",
    result: { metrics: { completion: 1, timingScore: 100, transcriptAccuracy: 1 }, normalizedTranscript: "我要去学校", score: 100, status: "correct" },
    type: "PROCESS_SUCCESS",
  });
  assert.equal(state.phase, "feedback");
  assert.equal(state.results.length, 1);
  assert.equal(state.results[0].exerciseId, "repeat-1");
  assert.equal(Object.hasOwn(state.results[0], "normalizedTranscript"), false);
  assert.equal(state.currentTranscript, null);
  assert.deepEqual(getRepeatSessionProgress(state), {
    completedCount: 1, currentIndex: 0, progress: 0.1, totalCount: 10,
  });
});

test("retry creates a new attempt and stale asynchronous responses are ignored", async () => {
  const { createRepeatSession, repeatSessionReducer } = await import(sessionModule);
  let state = advanceToReady(repeatSessionReducer, createRepeatSession({
    exerciseIds: tenExerciseIds(), level: 2, sessionId: "session-2",
  }));
  state = repeatSessionReducer(state, { attemptId: "old-attempt", type: "RECORD_START" });
  state = repeatSessionReducer(state, { attemptId: "old-attempt", transcript: "不完整", type: "TRANSCRIPT_FINAL" });
  state = repeatSessionReducer(state, { attemptId: "old-attempt", result: { score: 40, status: "retry" }, type: "PROCESS_SUCCESS" });
  state = repeatSessionReducer(state, { type: "RETRY" });
  state = repeatSessionReducer(state, { attemptId: "new-attempt", type: "RECORD_START" });

  const staleTranscriptState = repeatSessionReducer(state, { attemptId: "old-attempt", transcript: "旧响应", type: "TRANSCRIPT_FINAL" });
  const staleResultState = repeatSessionReducer(state, { attemptId: "old-attempt", result: { score: 100 }, type: "PROCESS_SUCCESS" });
  assert.equal(staleTranscriptState, state);
  assert.equal(staleResultState, state);
  assert.equal(state.attemptsByExercise["repeat-1"].length, 2);
});

test("timeout, processing error, and cancellation have explicit states and codes", async () => {
  const { createRepeatSession, repeatSessionReducer } = await import(sessionModule);
  let state = advanceToReady(repeatSessionReducer, createRepeatSession({
    exerciseIds: tenExerciseIds(), level: 3, sessionId: "session-3",
  }));
  state = repeatSessionReducer(state, { attemptId: "timeout-attempt", type: "RECORD_START" });
  state = repeatSessionReducer(state, { attemptId: "timeout-attempt", type: "TIMEOUT" });
  assert.equal(state.phase, "processing");
  assert.deepEqual(state.error, { code: "ASR_TIMEOUT" });
  state = repeatSessionReducer(state, { attemptId: "timeout-attempt", error: { code: "EVALUATION_ERROR" }, type: "PROCESS_FAILURE" });
  assert.equal(state.phase, "error");
  state = repeatSessionReducer(state, { type: "CANCEL" });
  assert.equal(state.phase, "cancelled");
});

test("NEXT advances through transition and completes after the tenth result", async () => {
  const { createRepeatSession, repeatSessionReducer } = await import(sessionModule);
  let state = createRepeatSession({ exerciseIds: tenExerciseIds(), level: 1, sessionId: "session-4" });
  for (let index = 0; index < 10; index += 1) {
    state = advanceToReady(repeatSessionReducer, state);
    const attemptId = `attempt-${index + 1}`;
    state = repeatSessionReducer(state, { attemptId, type: "RECORD_START" });
    state = repeatSessionReducer(state, { attemptId, transcript: "你好", type: "TRANSCRIPT_FINAL" });
    state = repeatSessionReducer(state, { attemptId, result: { score: 100, status: "correct" }, type: "PROCESS_SUCCESS" });
    state = repeatSessionReducer(state, { type: "NEXT" });
    if (index < 9) {
      assert.equal(state.phase, "transition");
      assert.equal(state.currentIndex, index + 1);
    }
  }
  assert.equal(state.phase, "completed");
  assert.equal(state.currentIndex, 9);
  assert.equal(state.results.length, 10);
});

test("session creation rejects malformed sessions and reducer ignores invalid transitions", async () => {
  const { createRepeatSession, repeatSessionReducer } = await import(sessionModule);
  assert.throws(() => createRepeatSession({ exerciseIds: ["one"], level: 1, sessionId: "short" }), /INVALID_SESSION/);
  assert.throws(() => createRepeatSession({ exerciseIds: tenExerciseIds(), level: 4, sessionId: "bad-level" }), /INVALID_SESSION/);
  const state = createRepeatSession({ exerciseIds: tenExerciseIds(), level: 1, sessionId: "session-5" });
  assert.equal(repeatSessionReducer(state, { type: "NEXT" }), state);
  assert.equal(repeatSessionReducer(state, { attemptId: "x", type: "TRANSCRIPT_FINAL" }), state);
});

test("repeat aggregation averages structured metrics and counts retries", async () => {
  const { aggregateRepeatResults } = await import(sessionModule);
  assert.deepEqual(aggregateRepeatResults([]), {
    averageAccuracy: 0,
    averageCompletion: 0,
    averageTiming: 0,
    completedCount: 0,
    overallScore: 0,
    retryCount: 0,
    schemaVersion: "repeat-aggregate-v1",
  });
  assert.deepEqual(aggregateRepeatResults([
    { attemptCount: 1, metrics: { completion: 1, timingScore: 80, transcriptAccuracy: 0.8 }, score: 88, status: "close" },
    { attemptCount: 3, metrics: { completion: 0.5, timingScore: 60, transcriptAccuracy: 0.6 }, score: 56, status: "retry" },
  ]), {
    averageAccuracy: 0.7,
    averageCompletion: 0.75,
    averageTiming: 70,
    completedCount: 2,
    overallScore: 72,
    retryCount: 2,
    schemaVersion: "repeat-aggregate-v1",
  });
});
