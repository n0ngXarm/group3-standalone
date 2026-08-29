export const GAME_PHASES = Object.freeze({
  IDLE: "IDLE",
  READY: "READY",
  PLAYING: "PLAYING",
  PAUSED: "PAUSED",
  COMPLETED: "COMPLETED",
  CLEANUP: "CLEANUP",
});

export const GAME_EVENTS = Object.freeze({
  PREPARE: "PREPARE",
  START: "START",
  PAUSE: "PAUSE",
  RESUME: "RESUME",
  COMPLETE: "COMPLETE",
  RESTART: "RESTART",
  EXIT: "EXIT",
  DISPOSE: "DISPOSE",
});

export const PAUSE_REASONS = Object.freeze({
  MANUAL: "manual",
  VISIBILITY: "visibility",
});

const VALID_PAUSE_REASONS = new Set(Object.values(PAUSE_REASONS));
const ACTIVE_PHASES = new Set([GAME_PHASES.PLAYING, GAME_PHASES.PAUSED]);

export function createGameSession() {
  return { phase: GAME_PHASES.IDLE, pauseReasons: [] };
}

function moveTo(phase) {
  return { phase, pauseReasons: [] };
}

export function reduceGameSession(state = createGameSession(), event = {}) {
  switch (event.type) {
    case GAME_EVENTS.PREPARE:
      return [GAME_PHASES.IDLE, GAME_PHASES.COMPLETED, GAME_PHASES.CLEANUP].includes(state.phase)
        ? moveTo(GAME_PHASES.READY)
        : state;
    case GAME_EVENTS.START:
      return state.phase === GAME_PHASES.READY ? moveTo(GAME_PHASES.PLAYING) : state;
    case GAME_EVENTS.PAUSE: {
      if (!ACTIVE_PHASES.has(state.phase) || !VALID_PAUSE_REASONS.has(event.reason) || state.pauseReasons.includes(event.reason)) return state;
      return { phase: GAME_PHASES.PAUSED, pauseReasons: [...state.pauseReasons, event.reason] };
    }
    case GAME_EVENTS.RESUME: {
      if (state.phase !== GAME_PHASES.PAUSED || !VALID_PAUSE_REASONS.has(event.reason) || !state.pauseReasons.includes(event.reason)) return state;
      const pauseReasons = state.pauseReasons.filter((reason) => reason !== event.reason);
      return { phase: pauseReasons.length ? GAME_PHASES.PAUSED : GAME_PHASES.PLAYING, pauseReasons };
    }
    case GAME_EVENTS.COMPLETE:
      return ACTIVE_PHASES.has(state.phase) ? moveTo(GAME_PHASES.COMPLETED) : state;
    case GAME_EVENTS.RESTART:
      return state.phase === GAME_PHASES.COMPLETED ? moveTo(GAME_PHASES.READY) : state;
    case GAME_EVENTS.EXIT:
    case GAME_EVENTS.DISPOSE:
      return state.phase === GAME_PHASES.CLEANUP ? state : moveTo(GAME_PHASES.CLEANUP);
    default:
      return state;
  }
}

export function isGameActivePhase(phase) {
  return ACTIVE_PHASES.has(phase);
}
