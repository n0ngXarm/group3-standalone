import { useEffect, useRef, useState } from "react";

import Icon from "../../../../../shared/components/ui/Icon.jsx";
import { pauseIcon, playIcon, rotateLeftIcon } from "../../../../../shared/components/ui/iconPaths.js";
import { COPY } from "../../../content/copy.js";
import PINYIN_MAP from "../../../data/pinyin-map.json";

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

const QTE_FOCUS_FALLBACKS = Object.freeze([
  "[data-g3-playback-primary]",
  "#g3-scene-title",
]);

const BUILDER_FOCUS_FALLBACKS = Object.freeze([
  "[data-g3-scene-complete-primary]",
  ".g3-scene-complete button",
  "#g3-scene-title",
  "#g3-briefing-title",
]);

function isMeaningfulFocusTarget(element) {
  return element instanceof HTMLElement
    && element !== document.body
    && element !== document.documentElement
    && element.isConnected
    && !element.matches(":disabled, [hidden]")
    && !element.closest("[inert], [aria-hidden='true']")
    && element.getClientRects().length > 0;
}

function useChallengeDialog(fallbackSelectors) {
  const dialogRef = useRef(null);
  const headingRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    const heading = headingRef.current;
    if (!dialog || !heading) return undefined;

    const previousFocus = document.activeElement;
    heading.focus();
    const hiddenBackground = [];
    let current = dialog;

    while (current?.parentElement) {
      const parent = current.parentElement;
      [...parent.children].forEach((sibling) => {
        if (sibling === current || hiddenBackground.some((entry) => entry.element === sibling)) return;
        hiddenBackground.push({
          element: sibling,
          hadInert: sibling.hasAttribute("inert"),
          ariaHidden: sibling.getAttribute("aria-hidden"),
        });
        sibling.setAttribute("inert", "");
        sibling.setAttribute("aria-hidden", "true");
      });
      current = parent;
      if (parent.classList.contains("g3-story-shell")) break;
    }

    const trapFocus = (event) => {
      if (event.key !== "Tab") return;
      const focusable = [...dialog.querySelectorAll(FOCUSABLE_SELECTOR)]
        .filter((element) => element.getClientRects().length && element.getAttribute("aria-hidden") !== "true");
      if (!focusable.length) {
        event.preventDefault();
        heading.focus();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && (document.activeElement === first || document.activeElement === heading)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || !dialog.contains(document.activeElement))) {
        event.preventDefault();
        first.focus();
      }
    };

    dialog.addEventListener("keydown", trapFocus);
    return () => {
      dialog.removeEventListener("keydown", trapFocus);
      hiddenBackground.forEach(({ element, hadInert, ariaHidden }) => {
        if (!hadInert) element.removeAttribute("inert");
        if (ariaHidden === null) element.removeAttribute("aria-hidden");
        else element.setAttribute("aria-hidden", ariaHidden);
      });
      window.requestAnimationFrame(() => {
        if (dialog.isConnected) return;
        const fallback = fallbackSelectors
          .map((selector) => document.querySelector(selector))
          .find(isMeaningfulFocusTarget);
        const target = isMeaningfulFocusTarget(previousFocus) ? previousFocus : fallback;
        target?.focus({ preventScroll: true });
      });
    };
  }, [fallbackSelectors]);

  return { dialogRef, headingRef };
}

export function QteChallenge({ challenge, language, timed, onResolve, onRestart }) {
  const text = COPY[language];
  const prompt = { th: challenge.prompt.th, zh: challenge.prompt.zh, en: challenge.prompt.en || text.educationalUnavailable }[language];
  const duration = timed ? 15 : null;
  const deadlineRef = useRef(0);
  const intervalRef = useRef(null);
  const [remaining, setRemaining] = useState(duration || 15);
  const [paused, setPaused] = useState(false);
  const [status, setStatus] = useState("active");
  const [choice, setChoice] = useState("");
  const { dialogRef, headingRef } = useChallengeDialog(QTE_FOCUS_FALLBACKS);

  const armTimer = () => {
    window.clearInterval(intervalRef.current);
    setRemaining(duration || 15);
    setPaused(false);
    setStatus("active");
    setChoice("");
    if (!duration) return;
    deadlineRef.current = Date.now() + duration * 1000;
    intervalRef.current = window.setInterval(() => {
      const next = Math.max(0, (deadlineRef.current - Date.now()) / 1000);
      setRemaining(next);
      if (next <= 0) {
        window.clearInterval(intervalRef.current);
        setStatus("timeout");
      }
    }, 100);
  };

  useEffect(() => {
    armTimer();
    return () => window.clearInterval(intervalRef.current);
  }, [challenge, duration]);

  useEffect(() => {
    const pauseWhenHidden = () => {
      if (!document.hidden || !duration || status !== "active" || paused) return;
      window.clearInterval(intervalRef.current);
      setPaused(true);
    };
    document.addEventListener("visibilitychange", pauseWhenHidden);
    return () => document.removeEventListener("visibilitychange", pauseWhenHidden);
  }, [duration, paused, status]);

  const pick = (option) => {
    if (status !== "active") return;
    window.clearInterval(intervalRef.current);
    setChoice(option.value);
    setStatus(option.value === challenge.correct ? "correct" : "wrong");
  };

  const togglePause = () => {
    if (!duration || status !== "active") return;
    if (paused) {
      deadlineRef.current = Date.now() + remaining * 1000;
      intervalRef.current = window.setInterval(() => {
        const next = Math.max(0, (deadlineRef.current - Date.now()) / 1000);
        setRemaining(next);
        if (next <= 0) {
          window.clearInterval(intervalRef.current);
          setStatus("timeout");
        }
      }, 100);
    } else {
      window.clearInterval(intervalRef.current);
    }
    setPaused((value) => !value);
  };

  const progress = duration ? Math.max(0, Math.min(100, (remaining / duration) * 100)) : 100;
  const ratio = duration ? Math.max(0, remaining / duration) : 1;
  const tone = ratio > 0.5 ? "ok" : ratio > 0.25 ? "warn" : "low";
  return (
    <div className="g3-challenge-backdrop">
      <section ref={dialogRef} className={`g3-challenge g3-qte is-${status}`} role="dialog" aria-modal="true" aria-labelledby="g3-qte-title">
        <header>
          <div><span>{text.qte}</span><h2 ref={headingRef} id="g3-qte-title" tabIndex="-1">{prompt}</h2></div>
          <div className="g3-qte-clock" aria-label={timed ? `${Math.ceil(remaining)} ${text.seconds}` : text.timerOff}>
            <b>{timed ? Math.ceil(remaining) : "∞"}</b><small>{timed ? text.seconds : text.timerOff}</small>
          </div>
        </header>
        <div className="g3-qte-progress" aria-hidden="true"><span data-tone={tone} style={{ width: `${progress}%` }} /></div>
        {timed && status === "active" && <button className="g3-pause-time" type="button" onClick={togglePause}><Icon paths={paused ? playIcon : pauseIcon} />{paused ? text.resume : text.pause}</button>}
        <div className="g3-qte-options">
          {challenge.options.map((option, index) => (
            <button type="button" key={option.value} onClick={() => pick(option)} disabled={status !== "active" || paused} className={choice === option.value ? "is-selected" : ""}>
              <span>{String.fromCharCode(65 + index)}</span>
              <span className="g3-qte-option-copy">
                <strong>{option.th}</strong>
                <small><b>{option.zh}</b>{option.pinyin}</small>
              </span>
            </button>
          ))}
        </div>
        {status !== "active" && (
          <div className="g3-challenge-result" aria-live="polite">
            <strong>{status === "correct" ? text.correct : status === "timeout" ? text.timeout : text.wrong}</strong>
            <p>
              <span>{text.evidence}</span>
              {challenge.evidenceTh}
              <small>{challenge.evidence}</small>
            </p>
            <div>
              {status !== "correct" && <button type="button" onClick={armTimer}>{text.retry}</button>}
              {status === "correct" && <button className="is-primary" type="button" onClick={onResolve}>{text.continue} →</button>}
            </div>
          </div>
        )}
        {onRestart && (
          <footer className="g3-qte-restart">
            <button type="button" onClick={onRestart}>
              <Icon paths={rotateLeftIcon} />
              {text.qteRestart || "เริ่มเล่นใหม่"}
            </button>
          </footer>
        )}
      </section>
    </div>
  );
}

export function SentenceChallenge({ challenge, language, onResolve, onRestart }) {
  const text = COPY[language];
  const prompt = { th: challenge.prompt.th, zh: challenge.prompt.zh, en: challenge.prompt.en || text.educationalUnavailable }[language];
  const [selected, setSelected] = useState([]);
  const [status, setStatus] = useState("active");
  const { dialogRef, headingRef } = useChallengeDialog(BUILDER_FOCUS_FALLBACKS);
  const sentence = selected.map((index) => challenge.tiles[index]);

  useEffect(() => {
    setSelected([]);
    setStatus("active");
  }, [challenge]);

  const add = (index) => {
    if (selected.includes(index) || status === "correct") return;
    setSelected((current) => [...current, index]);
    setStatus("active");
  };

  const check = () => {
    const correct = sentence.length === challenge.answer.length && sentence.every((word, index) => word === challenge.answer[index]);
    setStatus(correct ? "correct" : "wrong");
  };

  const getPinyin = (word) => PINYIN_MAP[word] || "";

  return (
    <div className="g3-challenge-backdrop">
      <section ref={dialogRef} className={`g3-challenge g3-builder is-${status}`} role="dialog" aria-modal="true" aria-labelledby="g3-builder-title">
        <header><div><span>{text.builder}</span><h2 ref={headingRef} id="g3-builder-title" tabIndex="-1">{prompt}</h2></div><i aria-hidden="true">句</i></header>
        <p className="g3-builder-hint">{text.builderHint}</p>

        <div className="g3-sentence-track" aria-live="polite">
          {sentence.length ? sentence.map((word, index) => (
            <span key={`${word}-${index}`}><b>{word}</b><small className="g3-word-pinyin">{getPinyin(word)}</small><em>{challenge.gloss[word]}</em><small className="g3-word-index">{index + 1}</small></span>
          )) : <em>…</em>}
        </div>

        {/* Hint track (faded answer) */}
        {status !== "correct" && (
          <div className="g3-sentence-track is-hint" style={{ opacity: 0.3, marginTop: '-1rem', pointerEvents: 'none' }} aria-hidden="true">
            {challenge.answer.map((word, index) => (
              <span key={`hint-${word}-${index}`}><b>{word}</b><small className="g3-word-pinyin">{getPinyin(word)}</small><em>{challenge.gloss[word]}</em><small className="g3-word-index">{index + 1}</small></span>
            ))}
          </div>
        )}

        <div className="g3-word-bank">
          {challenge.tiles.map((word, index) => (
            <button type="button" key={`${word}-${index}`} onClick={() => add(index)} disabled={selected.includes(index) || status === "correct"}>
              <strong>{word}</strong><small className="g3-word-pinyin">{getPinyin(word)}</small><em>{challenge.gloss[word]}</em>
            </button>
          ))}
        </div>
        <div className="g3-builder-controls">
          <button type="button" onClick={() => { setSelected((current) => current.slice(0, -1)); setStatus("active"); }} disabled={!selected.length || status === "correct"}>{text.undo}</button>
          <button type="button" onClick={() => { setSelected([]); setStatus("active"); }} disabled={!selected.length || status === "correct"}>{text.reset}</button>
          <button className="is-primary" type="button" onClick={check} disabled={sentence.length !== challenge.answer.length || status === "correct"}>{text.check}</button>
        </div>
        {status !== "active" && (
          <div className="g3-challenge-result" aria-live="polite">
            <strong>{status === "correct" ? text.builderCorrect : text.builderWrong}</strong>
            <p>
              <span>{text.evidence}</span>
              {status === "correct" ? challenge.answer.join("") : challenge.evidence}
              {status === "correct" && <small>{challenge.translationTh}</small>}
            </p>
            {status === "correct" && <button className="is-primary" type="button" onClick={onResolve}>{text.continue} →</button>}
          </div>
        )}
        {onRestart && (
          <footer className="g3-qte-restart">
            <button type="button" onClick={onRestart}>
              <Icon paths={rotateLeftIcon} />
              {text.qteRestart || "เริ่มเล่นใหม่"}
            </button>
          </footer>
        )}
      </section>
    </div>
  );
}
