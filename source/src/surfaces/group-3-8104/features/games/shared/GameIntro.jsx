import React, { useCallback, useEffect, useRef, useState } from "react";
import { stopChineseVoice, unlockChineseAudio } from "../../../services/audio/index.js";
import { languageCopy } from "./gameData.js";

export function useGameLifecycle() {
  const epochRef = useRef(0);
  const frameIdsRef = useRef(new Set());
  const mountedRef = useRef(true);
  const timeoutIdsRef = useRef(new Set());

  const invalidate = useCallback(() => {
    epochRef.current += 1;
    frameIdsRef.current.forEach((id) => cancelAnimationFrame(id));
    timeoutIdsRef.current.forEach((id) => window.clearTimeout(id));
    frameIdsRef.current.clear();
    timeoutIdsRef.current.clear();
    stopChineseVoice();
    return epochRef.current;
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      invalidate();
    };
  }, [invalidate]);

  const capture = useCallback(() => epochRef.current, []);
  const isCurrent = useCallback((epoch) => mountedRef.current && epochRef.current === epoch, []);
  const cancelFrame = useCallback((id) => {
    cancelAnimationFrame(id);
    frameIdsRef.current.delete(id);
  }, []);
  const cancelTimer = useCallback((id) => {
    window.clearTimeout(id);
    timeoutIdsRef.current.delete(id);
  }, []);
  const requestFrame = useCallback((callback, epoch = epochRef.current) => {
    let id = 0;
    id = requestAnimationFrame((time) => {
      frameIdsRef.current.delete(id);
      if (mountedRef.current && epochRef.current === epoch) callback(time);
    });
    frameIdsRef.current.add(id);
    return id;
  }, []);
  const schedule = useCallback((callback, delay, epoch = epochRef.current) => {
    let id = 0;
    id = window.setTimeout(() => {
      timeoutIdsRef.current.delete(id);
      if (mountedRef.current && epochRef.current === epoch) callback();
    }, delay);
    timeoutIdsRef.current.add(id);
    return id;
  }, []);

  return { cancelFrame, cancelTimer, capture, invalidate, isCurrent, requestFrame, schedule };
}

export function useGameVisibilityPause(active) {
  const [paused, setPaused] = useState(() => typeof document !== "undefined" && document.hidden);

  useEffect(() => {
    if (!active) {
      setPaused(false);
      return undefined;
    }
    const sync = () => setPaused(document.hidden);
    sync();
    document.addEventListener("visibilitychange", sync);
    return () => document.removeEventListener("visibilitychange", sync);
  }, [active]);

  useEffect(() => {
    if (paused) stopChineseVoice();
  }, [paused]);

  return paused;
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

export function GameHud({ children, gameTitle, language, liveStatus, onBack, paused }) {
  const copy = languageCopy(language);
  return (
    <header className="g3-game-hud">
      <div className="g3-game-hud-title">
        <span>{gameTitle}</span>
        {paused && <strong role="status">{copy.paused}</strong>}
      </div>
      <div className="g3-game-hud-metrics">{children}</div>
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
