import { PRACTICE_ERROR_CODES, practiceError } from "../errors.js";

export const REPEAT_SESSION_SCHEMA_VERSION = "repeat-session-v1";
export const REPEAT_AGGREGATE_SCHEMA_VERSION = "repeat-aggregate-v1";
export const REPEAT_SESSION_SIZE = 10;

const VALID_LEVELS = new Set([1, 2, 3]);
const TERMINAL_PHASES = new Set(["completed", "cancelled"]);

function failInvalidSession() {
  const error = new Error(PRACTICE_ERROR_CODES.INVALID_SESSION);
  error.code = PRACTICE_ERROR_CODES.INVALID_SESSION;
  throw error;
}

function currentExerciseId(state) {
  return state.exerciseIds[state.currentIndex];
}

function updateAttempt(state, attemptId, status) {
  const exerciseId = currentExerciseId(state);
  return {
    ...state.attemptsByExercise,
    [exerciseId]: (state.attemptsByExercise[exerciseId] ?? []).map((attempt) => (
      attempt.attemptId === attemptId ? { ...attempt, status } : attempt
    )),
  };
}

function stripTranscriptFields(result) {
  if (!result || typeof result !== "object") return {};
  const {
    normalizedTarget: _normalizedTarget,
    normalizedTranscript: _normalizedTranscript,
    transcript: _transcript,
    ...safeResult
  } = result;
  return safeResult;
}

export function createRepeatSession({ exerciseIds, level, sessionId } = {}) {
  if (
    typeof sessionId !== "string"
    || sessionId.length === 0
    || !VALID_LEVELS.has(Number(level))
    || !Array.isArray(exerciseIds)
    || exerciseIds.length !== REPEAT_SESSION_SIZE
    || exerciseIds.some((id) => typeof id !== "string" || id.length === 0)
    || new Set(exerciseIds).size !== exerciseIds.length
  ) failInvalidSession();

  return {
    attemptId: null,
    attemptsByExercise: {},
    currentIndex: 0,
    currentTranscript: null,
    error: null,
    exerciseIds: [...exerciseIds],
    level: Number(level),
    phase: "idle",
    results: [],
    schemaVersion: REPEAT_SESSION_SCHEMA_VERSION,
    sessionId,
  };
}

export function isCurrentAttempt(state, attemptId) {
  return typeof attemptId === "string" && attemptId.length > 0 && state.attemptId === attemptId;
}

export function getRepeatSessionProgress(state) {
  const totalCount = Array.isArray(state?.exerciseIds) ? state.exerciseIds.length : 0;
  const completedCount = Array.isArray(state?.results) ? state.results.length : 0;
  return {
    completedCount,
    currentIndex: totalCount > 0 ? Math.min(totalCount - 1, Math.max(0, Number(state?.currentIndex) || 0)) : 0,
    progress: totalCount > 0 ? Number((completedCount / totalCount).toFixed(4)) : 0,
    totalCount,
  };
}

export function repeatSessionReducer(state, event = {}) {
  if (!state || TERMINAL_PHASES.has(state.phase) || typeof event.type !== "string") return state;

  switch (event.type) {
    case "START":
      return state.phase === "idle" ? { ...state, phase: "instructions" } : state;
    case "PLAY_PROMPT":
      return state.phase === "instructions" || state.phase === "transition"
        ? { ...state, error: null, phase: "playingPrompt" }
        : state;
    case "PROMPT_FINISHED":
      return state.phase === "playingPrompt" ? { ...state, phase: "ready" } : state;
    case "RECORD_START": {
      if (state.phase !== "ready" || typeof event.attemptId !== "string" || event.attemptId.length === 0) return state;
      const exerciseId = currentExerciseId(state);
      const attempts = state.attemptsByExercise[exerciseId] ?? [];
      if (attempts.some((attempt) => attempt.attemptId === event.attemptId)) return state;
      return {
        ...state,
        attemptId: event.attemptId,
        attemptsByExercise: {
          ...state.attemptsByExercise,
          [exerciseId]: [...attempts, { attemptId: event.attemptId, status: "listening" }],
        },
        currentTranscript: null,
        error: null,
        phase: "listening",
      };
    }
    case "TRANSCRIPT_FINAL":
      if (state.phase !== "listening" || !isCurrentAttempt(state, event.attemptId)) return state;
      return {
        ...state,
        attemptsByExercise: updateAttempt(state, event.attemptId, "processing"),
        currentTranscript: String(event.transcript ?? ""),
        phase: "processing",
      };
    case "TIMEOUT":
      if (state.phase !== "listening" || !isCurrentAttempt(state, event.attemptId)) return state;
      return {
        ...state,
        attemptsByExercise: updateAttempt(state, event.attemptId, "timedOut"),
        currentTranscript: "",
        error: practiceError(PRACTICE_ERROR_CODES.ASR_TIMEOUT),
        phase: "processing",
      };
    case "PROCESS_SUCCESS": {
      if (state.phase !== "processing" || !isCurrentAttempt(state, event.attemptId)) return state;
      const exerciseId = currentExerciseId(state);
      const attempts = state.attemptsByExercise[exerciseId] ?? [];
      const result = {
        ...stripTranscriptFields(event.result),
        attemptCount: attempts.length,
        exerciseId,
      };
      return {
        ...state,
        attemptsByExercise: updateAttempt(state, event.attemptId, "completed"),
        currentTranscript: null,
        error: null,
        phase: "feedback",
        results: [...state.results.filter((item) => item.exerciseId !== exerciseId), result],
      };
    }
    case "PROCESS_FAILURE":
      if (state.phase !== "processing" || !isCurrentAttempt(state, event.attemptId)) return state;
      return {
        ...state,
        attemptsByExercise: updateAttempt(state, event.attemptId, "failed"),
        currentTranscript: null,
        error: event.error?.code ? { code: event.error.code } : practiceError(PRACTICE_ERROR_CODES.EVALUATION_ERROR),
        phase: "error",
      };
    case "RETRY":
      return state.phase === "feedback" || state.phase === "error"
        ? { ...state, attemptId: null, currentTranscript: null, error: null, phase: "ready" }
        : state;
    case "NEXT":
      if (state.phase !== "feedback") return state;
      if (state.currentIndex === state.exerciseIds.length - 1) {
        return { ...state, attemptId: null, phase: "completed" };
      }
      return {
        ...state,
        attemptId: null,
        currentIndex: state.currentIndex + 1,
        phase: "transition",
      };
    case "COMPLETE":
      return state.results.length === state.exerciseIds.length ? { ...state, phase: "completed" } : state;
    case "CANCEL":
      return { ...state, attemptId: null, currentTranscript: null, phase: "cancelled" };
    default:
      return state;
  }
}

const finite = (value) => Number.isFinite(Number(value)) ? Number(value) : 0;
const average = (values) => values.length === 0
  ? 0
  : Number((values.reduce((sum, value) => sum + finite(value), 0) / values.length).toFixed(4));

export function aggregateRepeatResults(results = []) {
  const completedResults = Array.isArray(results) ? results.filter((result) => result && typeof result === "object") : [];
  return {
    averageAccuracy: average(completedResults.map((result) => result.metrics?.transcriptAccuracy)),
    averageCompletion: average(completedResults.map((result) => result.metrics?.completion)),
    averageTiming: average(completedResults.map((result) => result.metrics?.timingScore)),
    completedCount: completedResults.length,
    overallScore: average(completedResults.map((result) => result.score)),
    retryCount: completedResults.reduce((count, result) => count + Math.max(0, finite(result.attemptCount) - 1), 0),
    schemaVersion: REPEAT_AGGREGATE_SCHEMA_VERSION,
  };
}
