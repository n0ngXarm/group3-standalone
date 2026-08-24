import { useEffect, useRef, useState } from "react";

import Icon from "../../../../../shared/components/ui/Icon.jsx";
import { pauseIcon, playIcon, rotateLeftIcon } from "../../../../../shared/components/ui/iconPaths.js";
import { COPY } from "../../../content/copy.js";
import PINYIN_MAP from "../../../data/pinyin-map.json";
import { buildQteTokens } from "./tokenizer.js";

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

export function QteChallenge({ challenge, language, timed, onResolve, onRestart, sourceLine }) {
  const text = COPY[language];
  const duration = timed ? 15 : null;
  const deadlineRef = useRef(0);
  const intervalRef = useRef(null);
  const [remaining, setRemaining] = useState(duration || 15);
  const [paused, setPaused] = useState(false);
  const [status, setStatus] = useState("active");
  const [choice, setChoice] = useState("");
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [wrongChoices, setWrongChoices] = useState([]);
  const { dialogRef, headingRef } = useChallengeDialog(QTE_FOCUS_FALLBACKS);

  const correctOptionId = challenge.correct || challenge.answer;
  const isMalformed = !correctOptionId || !challenge.options.some(o => o.value === correctOptionId);

  const armTimer = () => {
    window.clearInterval(intervalRef.current);
    setRemaining(duration || 15);
    setPaused(false);
    setStatus(isMalformed ? "malformed" : "active");
    setChoice("");
    setWrongChoices([]);
    if (!duration || isMalformed) return;
    deadlineRef.current = Date.now() + duration * 1000;
    intervalRef.current = window.setInterval(() => {
      const next = Math.max(0, (deadlineRef.current - Date.now()) / 1000);
      setRemaining(next);
      if (next <= 0) {
        window.clearInterval(intervalRef.current);
        setStatus(currentStatus => {
          if (currentStatus === "active") {
            setWrongAttempts(w => w + 1);
            return "timeout";
          }
          return currentStatus;
        });
      }
    }, 100);
  };

  useEffect(() => {
    if (status === "correct") {
      const timer = window.setTimeout(onResolve, 1500);
      return () => window.clearTimeout(timer);
    }
    return undefined;
  }, [status, onResolve]);

  useEffect(() => {
    if (isMalformed) {
      console.error(`QTE Configuration Error: No valid correct answer found for challenge`, challenge);
    }
    armTimer();
    return () => {
      window.clearInterval(intervalRef.current);
    };
  }, [challenge, isMalformed]);

  const togglePause = () => {
    if (status !== "active") return;
    if (paused) {
      deadlineRef.current = Date.now() + remaining * 1000;
      intervalRef.current = window.setInterval(() => {
        const next = Math.max(0, (deadlineRef.current - Date.now()) / 1000);
        setRemaining(next);
        if (next <= 0) {
          window.clearInterval(intervalRef.current);
          setStatus(currentStatus => {
            if (currentStatus === "active") {
              setWrongAttempts(w => w + 1);
              return "timeout";
            }
            return currentStatus;
          });
        }
      }, 100);
      setPaused(false);
    } else {
      window.clearInterval(intervalRef.current);
      setPaused(true);
    }
  };

  const pick = (option) => {
    if (option.value === correctOptionId) {
      setChoice(option.value);
      window.clearInterval(intervalRef.current);
      setStatus("correct");
      setWrongAttempts(0);
    } else {
      // Wrong answer
      setChoice(option.value);
      setWrongAttempts((w) => w + 1);
      setWrongChoices((current) => [...current, option.value]);
      // Remove visual selection of the wrong choice after brief delay
      window.setTimeout(() => {
        setChoice("");
      }, 800);
    }
  };

  const retryTimeout = () => {
    // restart timer from 15s without clearing wrongAttempts
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
        setStatus(currentStatus => {
          if (currentStatus === "active") {
            setWrongAttempts(w => w + 1);
            return "timeout";
          }
          return currentStatus;
        });
      }
    }, 100);
  };

  const progress = duration ? (remaining / duration) * 100 : 100;
  const tone = progress > 50 ? "good" : progress > 20 ? "warn" : "critical";

  const genericPromptZh = "哪个答案是正确的？";
  const genericPromptPinyin = "Nǎge dá'àn shì zhèngquè de?";
  const genericPromptTh = "คำตอบข้อใดถูกต้อง?";

  const promptZh = challenge.prompt?.zh || genericPromptZh;
  const promptTh = challenge.prompt?.th || genericPromptTh;
  const promptPinyin = challenge.prompt?.pinyin || (challenge.prompt?.zh ? "" : genericPromptPinyin);

  const qteTitle = language === "th" ? "🎯 เลือกคำตอบที่ถูกต้อง" : language === "zh" ? "🎯 选择正确答案" : "🎯 Choose the correct answer";
  const instruction = language === "th" ? "แตะตัวเลือกที่ถูกต้องที่สุด" : language === "zh" ? "点击最正确的选项" : "Tap the most correct option";

  return (
    <div className="g3-challenge-backdrop">
      <section ref={dialogRef} className={`g3-challenge g3-qte is-${status}`} role="dialog" aria-modal="true" aria-labelledby="g3-qte-title">
        <header>
          <div className="g3-qte-lead">
            <span>{qteTitle}</span>
            <div className="g3-challenge-prompt">
              <h2 ref={headingRef} id="g3-qte-title" tabIndex="-1">{promptZh}</h2>
              {promptPinyin && <small className="g3-prompt-pinyin">{promptPinyin}</small>}
              {promptTh && <em className="g3-prompt-th">{promptTh}</em>}
            </div>
          </div>
          {timed && status !== "malformed" && <div className="g3-qte-clock" aria-hidden="true"><b>{Math.ceil(remaining)}</b><small>SEC</small></div>}
        </header>

        {status === "malformed" ? (
          <div className="g3-challenge-result is-error" aria-live="polite" style={{ marginTop: '2rem' }}>
            <strong>⚠️ {language === "th" ? "ข้อมูลแบบฝึกหัดไม่สมบูรณ์" : language === "zh" ? "练习数据不完整" : "Exercise Data Incomplete"}</strong>
            <p>{language === "th" ? "ไม่พบคำตอบที่ถูกต้องในระบบ กดปุ่มด้านล่างเพื่อข้ามและเรียนต่อไปโดยไม่ถูกหักคะแนน" : language === "zh" ? "系统未找到正确答案。点击下方按钮跳过，不计入错误。" : "No correct answer configured. Click continue to proceed without penalty."}</p>
            <button className="is-primary" type="button" onClick={onResolve}>{language === "th" ? "ข้าม" : language === "zh" ? "跳过" : "Skip"}</button>
          </div>
        ) : (
          <>
            <p className="g3-builder-hint">{instruction}</p>
            <div className="g3-qte-progress" aria-hidden="true"><span data-tone={tone} style={{ width: `${progress}%` }} /></div>
            {timed && status === "active" && <button className="g3-pause-time" type="button" onClick={togglePause}><Icon paths={paused ? playIcon : pauseIcon} />{paused ? text.resume : text.pause}</button>}

            <div className="g3-qte-options">
              {challenge.options.map((option, index) => {
                const isWrongGuess = wrongChoices.includes(option.value);
                return (
                  <button
                    type="button"
                    key={option.value}
                    onClick={() => pick(option)}
                    disabled={status !== "active" || paused || isWrongGuess}
                    className={`${choice === option.value ? "is-selected" : ""} ${isWrongGuess ? "is-wrong-hint" : ""}`.trim()}
                  >
                    <span>{String.fromCharCode(65 + index)}</span>
                    <span className="g3-qte-option-copy">
                      <strong>{isWrongGuess ? "✕ " : ""}{option.zh}</strong>
                      <small className="g3-word-pinyin">{option.pinyin}</small>
                      {option.th && <em>{option.th}</em>}
                    </span>
                  </button>
                );
              })}
            </div>

        {wrongAttempts > 0 && status === "active" && (
          <div className="g3-qte-feedback-block">
            <div className="g3-qte-wrong-count">
              {language === "th" ? `ตอบผิด ${wrongAttempts} ครั้ง` : language === "zh" ? `错误 ${wrongAttempts} 次` : `Wrong ${wrongAttempts} times`}
            </div>
            {wrongAttempts === 3 && (
              <div className="g3-qte-hint-text">
                {language === "th" ? "💡 ลองเลือกคำตอบใหม่อีกครั้ง" : "💡 Try selecting another answer"}
              </div>
            )}
            {wrongAttempts >= 4 && sourceLine && (
              <div className="g3-qte-target-hint">
                <div className="g3-qte-hint-label">💡 {language === "th" ? "คำใบ้" : "Hint"}</div>
                <strong>{sourceLine.hanzi}</strong>
                <small>{sourceLine.pinyin}</small>
                <em>{sourceLine.th}</em>
              </div>
            )}
          </div>
        )}

        {status === "timeout" && (
          <div className="g3-challenge-result" aria-live="polite">
            <strong>{language === "th" ? "⚠️ หมดเวลา" : language === "zh" ? "⚠️ 时间到了" : "⚠️ Time's up"}</strong>
            <p>{language === "th" ? "ลองตอบข้อนี้อีกครั้ง" : language === "zh" ? "请再试一次" : "Try this question again"}</p>
            <button type="button" onClick={retryTimeout}>{language === "th" ? "ลองอีกครั้ง" : "Try again"}</button>
          </div>
        )}

        {status === "correct" && (
          <div className="g3-challenge-result" aria-live="polite">
            <strong>{text.builderCorrect || "🎉 ถูกต้อง!"}</strong>
          </div>
        )}

        {status === "timeout" && onRestart && false && (
          <div className="g3-qte-restart">
            <button type="button" onClick={onRestart}><Icon paths={rotateLeftIcon} />{text.qteRestart}</button>
          </div>
        )}
          </>
        )}
      </section>
    </div>
  );
}export function SentenceChallenge({ challenge, language, level = "hsk2", onResolve, onRestart, sourceLine }) {
  const text = COPY[language];
  const [selected, setSelected] = useState([]);
  const [status, setStatus] = useState("active");
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const { dialogRef, headingRef } = useChallengeDialog(BUILDER_FOCUS_FALLBACKS);
  const [builtSentence, setBuiltSentence] = useState({ answer: [], tiles: [] });

  useEffect(() => {
    setSelected([]);
    setStatus("active");
    setWrongAttempts(0);

    const hanzi = sourceLine ? sourceLine.hanzi : challenge.answer.join("");
    const pinyin = sourceLine ? sourceLine.pinyin : "";
    const result = buildQteTokens({ hanzi, pinyin, level });

    const answer = [];
    let tileIndex = 0;
    challenge.answer.forEach(part => {
      let combined = "";
      let combinedPinyin = [];
      const partTokens = [];
      while (combined.length < part.length && tileIndex < result.tokens.length) {
        const token = result.tokens[tileIndex];
        combined += token.text;
        if (token.pinyin) combinedPinyin.push(token.pinyin);
        partTokens.push(token);
        tileIndex++;
      }
      answer.push({
        id: partTokens.map(t => t.id).join("-"),
        text: combined,
        pinyin: combinedPinyin.join(" ")
      });
    });

    const shuffled = [...result.tokens].sort(() => Math.random() - 0.5);
    setBuiltSentence({ answer: result.tokens, tiles: shuffled });
  }, [challenge, level, sourceLine]);

  const sentence = selected.map(index => builtSentence.tiles[index]);

  const add = (index) => {
    if (selected.includes(index)) return;
    const next = [...selected, index];
    setSelected(next);
    if (next.length === builtSentence.answer.length) {
      window.setTimeout(() => {
        headingRef.current?.parentElement?.parentElement?.querySelector(".is-primary")?.focus();
      }, 50);
    }
  };

  const check = () => {
    if (sentence.length !== builtSentence.answer.length) return;
    const isCorrect = sentence.every((token, i) => token.id === builtSentence.answer[i].id);
    if (isCorrect) {
      setStatus("correct");
      window.setTimeout(onResolve, 1500);
      setWrongAttempts(0);
    } else {
      setStatus("wrong");
      setWrongAttempts(w => w + 1);
    }
  };

  const isInstruction = challenge.prompt?.zh?.startsWith("重组");

  const genericPromptZh = "这句话应该怎么排列？";
  const genericPromptPinyin = "Zhè jù huà yīnggāi zěnme páiliè?";
  const genericPromptTh = "ประโยคนี้ควรเรียงอย่างไร?";

  const promptZh = (!challenge.prompt?.zh || isInstruction) ? genericPromptZh : challenge.prompt.zh;
  const promptTh = (!challenge.prompt?.th || isInstruction) ? genericPromptTh : challenge.prompt.th;
  const promptPinyin = (!challenge.prompt?.zh || isInstruction) ? genericPromptPinyin : (challenge.prompt.pinyin || "");

  return (
    <div className="g3-challenge-backdrop">
      <section ref={dialogRef} className={`g3-challenge g3-builder is-${status}`} role="dialog" aria-modal="true" aria-labelledby="g3-builder-title">
        <header>
          <div>
            <span>{text.builder}</span>
            <div className="g3-challenge-prompt">
              <h2 ref={headingRef} id="g3-builder-title" tabIndex="-1">{promptZh}</h2>
              {promptPinyin && <small className="g3-prompt-pinyin">{promptPinyin}</small>}
              {promptTh && <em className="g3-prompt-th">{promptTh}</em>}
            </div>
          </div>
          <i aria-hidden="true">句</i>
        </header>
        <p className="g3-builder-hint">{text.builderHint}</p>

        <div className="g3-sentence-track" aria-live="polite">
          {sentence.length ? sentence.map((token, index) => (
            <span key={token.id}><b>{token.text}</b>{token.pinyin && <small className="g3-word-pinyin">{token.pinyin}</small>}<em>{challenge.gloss && challenge.gloss[token.text]}</em><small className="g3-word-index">{index + 1}</small></span>
          )) : <em>…</em>}
        </div>

        <div className="g3-word-bank">
          {builtSentence.tiles.map((token, index) => (
            <button type="button" key={token.id} onClick={() => add(index)} disabled={selected.includes(index) || status === "correct"} className={wrongAttempts >= 6 && builtSentence.answer[sentence.length] && token.id === builtSentence.answer[sentence.length].id && status === "active" ? "is-hint-highlight" : ""}>
              <strong>{token.text}</strong>{token.pinyin && <small className="g3-word-pinyin">{token.pinyin}</small>}<em>{challenge.gloss && challenge.gloss[token.text]}</em>
            </button>
          ))}
        </div>

        {wrongAttempts > 0 && status === "active" && (
          <div className="g3-qte-feedback-block">
            <div className="g3-qte-wrong-count">
              {language === "th" ? `ตอบผิด ${wrongAttempts} ครั้ง` : language === "zh" ? `错误 ${wrongAttempts} 次` : `Wrong ${wrongAttempts} times`}
            </div>
            {wrongAttempts === 3 && (
              <div className="g3-qte-hint-text">
                {language === "th" ? "💡 ลองดูคำแต่ละคำอีกครั้ง" : "💡 Look at each word again"}
              </div>
            )}
            {wrongAttempts >= 4 && (
              <div className="g3-qte-target-hint">
                <div className="g3-qte-hint-label">💡 {language === "th" ? "คำใบ้" : "Hint"}</div>
                <strong>{sourceLine ? sourceLine.hanzi : builtSentence.answer.map(t=>t.text).join("")}</strong>
                <small>{sourceLine ? sourceLine.pinyin : builtSentence.answer.map(t=>t.pinyin).join(" ")}</small>
                {sourceLine && <em>{sourceLine.th}</em>}
              </div>
            )}
            {wrongAttempts >= 5 && (
              <div className="g3-qte-hint-text">
                {language === "th" && wrongAttempts === 5 && builtSentence.answer[0] ? `💡 คำใบ้เพิ่มเติม: คำแรกคือ "${builtSentence.answer[0].text}"` : ""}
                {language === "th" && wrongAttempts >= 6 && builtSentence.answer[0] && builtSentence.answer[1] ? `💡 คำใบ้เพิ่มเติม: เริ่มต้นด้วย "${builtSentence.answer[0].text}" ตามด้วย "${builtSentence.answer[1].text}"` : ""}
                {language !== "th" && wrongAttempts === 5 && builtSentence.answer[0] ? `💡 Extra hint: The first word is "${builtSentence.answer[0].text}"` : ""}
                {language !== "th" && wrongAttempts >= 6 && builtSentence.answer[0] && builtSentence.answer[1] ? `💡 Extra hint: Starts with "${builtSentence.answer[0].text}" then "${builtSentence.answer[1].text}"` : ""}
              </div>
            )}
          </div>
        )}

        <div className="g3-builder-controls">
          {selected.length > 0 && status !== "correct" && (
            <>
              <button type="button" onClick={() => { setSelected((current) => current.slice(0, -1)); setStatus("active"); }}>{text.undo}</button>
              <button type="button" onClick={() => { setSelected([]); setStatus("active"); }}>{text.reset}</button>
            </>
          )}
          <button className="is-primary" type="button" onClick={check} disabled={sentence.length !== builtSentence.answer.length || status === "correct"}>{text.check}</button>
        </div>
        {status !== "active" && (
          <div className="g3-challenge-result" aria-live="polite">
            <strong>{status === "correct" ? text.builderCorrect : text.builderWrong}</strong>
            <p>
              {status === "wrong" && text.retry}
              {status === "correct" && text.continue}
            </p>
            {status === "wrong" && <button type="button" onClick={() => { setSelected([]); setStatus("active"); }}>{text.retry}</button>}
            {status === "wrong" && onRestart && <button type="button" className="g3-text-action" onClick={onRestart}>{text.qteRestart}</button>}
          </div>
        )}
      </section>
    </div>
  );
}
