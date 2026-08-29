import React, { useCallback, useEffect, useLayoutEffect, useReducer, useRef, useState } from "react";
import { stopChineseVoice, unlockChineseAudio } from "../../../services/audio/index.js";
import { languageCopy } from "./gameData.js";
import { GAME_EVENTS, GAME_PHASES, PAUSE_REASONS, createGameSession, isGameActivePhase, reduceGameSession } from "./gameSession.js";
import { createPausableClock, createPausableScheduler } from "./gameTiming.js";

export function useGameSession() {
  const [session, dispatch] = useReducer(reduceGameSession, undefined, createGameSession);
  const sessionRef = useRef(session);
  sessionRef.current = session;

  const send = useCallback((event) => {
    sessionRef.current = reduceGameSession(sessionRef.current, event);
    dispatch(event);
  }, []);
  const prepare = useCallback(() => send({ type: GAME_EVENTS.PREPARE }), [send]);
  const start = useCallback(() => send({ type: GAME_EVENTS.START }), [send]);
  const complete = useCallback(() => send({ type: GAME_EVENTS.COMPLETE }), [send]);
  const restart = useCallback(() => send({ type: GAME_EVENTS.RESTART }), [send]);
  const exit = useCallback(() => send({ type: GAME_EVENTS.EXIT }), [send]);
  const toggleManualPause = useCallback(() => {
    const manualPaused = sessionRef.current.pauseReasons.includes(PAUSE_REASONS.MANUAL);
    send({ type: manualPaused ? GAME_EVENTS.RESUME : GAME_EVENTS.PAUSE, reason: PAUSE_REASONS.MANUAL });
  }, [send]);
  const isPlaying = useCallback(() => sessionRef.current.phase === GAME_PHASES.PLAYING, []);
  const active = isGameActivePhase(session.phase);

  useEffect(() => {
    if (!active || typeof document === "undefined") return undefined;
    const syncVisibility = () => send({
      type: document.hidden ? GAME_EVENTS.PAUSE : GAME_EVENTS.RESUME,
      reason: PAUSE_REASONS.VISIBILITY,
    });
    syncVisibility();
    document.addEventListener("visibilitychange", syncVisibility);
    return () => document.removeEventListener("visibilitychange", syncVisibility);
  }, [active, send]);

  useEffect(() => {
    if (session.phase === GAME_PHASES.PAUSED) stopChineseVoice();
  }, [session.phase]);

  useEffect(() => () => stopChineseVoice(), []);

  return {
    ...session,
    active,
    paused: session.phase === GAME_PHASES.PAUSED,
    complete,
    exit,
    isPlaying,
    prepare,
    restart,
    start,
    toggleManualPause,
  };
}

export function usePausableScheduler(paused) {
  const schedulerRef = useRef(null);
  if (!schedulerRef.current) schedulerRef.current = createPausableScheduler();

  useLayoutEffect(() => {
    if (paused) schedulerRef.current.pause();
    else schedulerRef.current.resume();
  }, [paused]);
  useEffect(() => () => schedulerRef.current.dispose(), []);

  const schedule = useCallback((callback, delay) => schedulerRef.current.schedule(callback, delay), []);
  const cancel = useCallback((id) => schedulerRef.current.cancel(id), []);
  const invalidate = useCallback(() => schedulerRef.current.invalidate(), []);
  return { cancel, invalidate, schedule };
}

export function usePausableGameClock({ active, duration, onExpire, paused, rate = 1, resetKey }) {
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;
  const clockRef = useRef(null);
  if (!clockRef.current) {
    clockRef.current = createPausableClock({ duration, onExpire: () => onExpireRef.current?.() });
  }
  const [timeLeft, setTimeLeft] = useState(() => Math.max(0, Number(duration) || 0));

  useEffect(() => {
    const remaining = clockRef.current.reset(duration);
    clockRef.current.setRate(rate);
    if (active && !paused) clockRef.current.resume();
    setTimeLeft(remaining);
  }, [duration, resetKey]);

  useLayoutEffect(() => {
    clockRef.current.setRate(rate);
    if (active && !paused) clockRef.current.resume();
    else clockRef.current.pause();
    setTimeLeft(clockRef.current.getRemaining());
  }, [active, paused, rate]);

  useEffect(() => {
    if (!active || paused) return undefined;
    let frameId = 0;
    const tick = () => {
      const remaining = clockRef.current.getRemaining();
      setTimeLeft(remaining);
      if (remaining > 0) frameId = requestAnimationFrame(tick);
    };
    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [active, paused, resetKey]);

  useEffect(() => () => clockRef.current.dispose(), []);

  const addTime = useCallback((amount, maximum) => {
    const remaining = clockRef.current.addTime(amount, maximum);
    setTimeLeft(remaining);
    return remaining;
  }, []);

  return { addTime, timeLeft };
}

export function GameIntro({ game, language, onBack, onStart }) {
  const copy = languageCopy(language);
  const headingRef = useRef(null);

  useEffect(() => {
    headingRef.current?.focus();
    return () => stopChineseVoice();
  }, []);

  const start = () => {
    unlockChineseAudio();
    onStart();
  };

  return (
    <section className="g3-game-intro" aria-labelledby={`g3-${game.id}-intro-title`}>
      <p className="g3-game-kicker">{copy.arcadeTitle}</p>
      <h1 id={`g3-${game.id}-intro-title`} ref={headingRef} tabIndex="-1">{game.title}</h1>
      <p className="g3-game-intro-desc">{game.desc}</p>
      <div className="g3-game-rules">
        <h2>{copy.rulesTitle}</h2>
        <ol>{game.rules.map((rule) => <li key={rule}>{rule}</li>)}</ol>
      </div>
      <p className="g3-game-ready-hint">{copy.readyHint}</p>
      <div className="g3-game-intro-actions">
        <button className="g3-game-primary" type="button" onClick={start}>{copy.start}</button>
        <button className="g3-game-secondary" type="button" onClick={onBack}>{copy.backHub}</button>
      </div>
    </section>
  );
}

export function GameHud({ children, gameTitle, language, liveStatus, onBack, onPauseToggle, paused }) {
  const copy = languageCopy(language);
  return (
    <header className="g3-game-hud">
      <div className="g3-game-hud-title">
        <span>{gameTitle}</span>
        {paused && <strong role="status">{copy.paused}</strong>}
      </div>
      <div className="g3-game-hud-metrics">{children}</div>
      <button className="g3-game-pause" type="button" onClick={onPauseToggle} aria-label={paused ? copy.resume : copy.pause} aria-pressed={paused} title={paused ? copy.resume : copy.pause}>
        <span aria-hidden="true">{paused ? "▶" : "Ⅱ"}</span>
        <span>{paused ? copy.resume : copy.pause}</span>
      </button>
      <button className="g3-game-exit" type="button" onClick={onBack} aria-label={copy.backHub} title={copy.backHub}>
        <span className="g3-game-exit-text">{copy.backHub}</span>
        <span className="g3-game-exit-icon" aria-hidden="true">✕</span>
      </button>
      <p className="g3-game-live-status" aria-live="polite" aria-atomic="true">{liveStatus || ""}</p>
    </header>
  );
}

export function GameTimer({ duration, language, onThreshold, resetKey, timeLeft, warningAt = 0.25 }) {
  const copy = languageCopy(language);
  const safeDuration = Math.max(1, duration);
  const safeTime = Math.max(0, Math.min(safeDuration, timeLeft));
  const percent = (safeTime / safeDuration) * 100;
  const seconds = Math.ceil(safeTime / 1000);
  const lastThresholdRef = useRef(null);

  useEffect(() => {
    lastThresholdRef.current = null;
  }, [resetKey]);

  useEffect(() => {
    const threshold = [10, 5, 3, 0].includes(seconds) ? seconds : null;
    if (threshold !== null && lastThresholdRef.current !== threshold) {
      lastThresholdRef.current = threshold;
      onThreshold?.(threshold);
    }
  }, [onThreshold, seconds]);
  return (
    <div className="g3-game-timer">
      <span className="g3-game-timer-label">{copy.time}: {seconds}s</span>
      <div
        className="g3-game-timer-track"
        role="progressbar"
        aria-label={copy.time}
        aria-valuemin="0"
        aria-valuemax={Math.ceil(safeDuration / 1000)}
        aria-valuenow={seconds}
        aria-valuetext={`${seconds} s`}
      >
        <div className={`g3-game-timer-bar ${percent <= warningAt * 100 ? "urgent" : percent <= 50 ? "warning" : ""}`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

export function GameFeedback({ message }) {
  return <p className="g3-game-feedback">{message || "\u00a0"}</p>;
}
