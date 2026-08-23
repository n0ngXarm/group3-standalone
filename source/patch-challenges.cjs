const fs = require('fs');
const path = require('path');
const p = path.resolve('src/surfaces/group-3-8104/features/reader/challenges/Challenges.jsx');
let content = fs.readFileSync(p, 'utf-8');

const replacement = `export function QteChallenge({ challenge, language, timed, onResolve, onRestart, sourceLine }) {
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

  const armTimer = () => {
    window.clearInterval(intervalRef.current);
    setRemaining(duration || 15);
    setPaused(false);
    setStatus("active");
    setChoice("");
    setWrongChoices([]);
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

  useEffect(() => {
    if (status === "correct") {
      const timer = window.setTimeout(onResolve, 1500);
      return () => window.clearTimeout(timer);
    }
    return undefined;
  }, [status, onResolve]);

  useEffect(() => {
    armTimer();
    return () => {
      window.clearInterval(intervalRef.current);
    };
  }, [challenge]);

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
    if (option.value === challenge.answer) {
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

  const showStrongHint = wrongAttempts >= 4;
  const wrongOptionToDisable = showStrongHint ? challenge.options.find(o => o.value !== challenge.answer)?.value : null;

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
      <section ref={dialogRef} className={\`g3-challenge g3-qte is-\${status}\`} role="dialog" aria-modal="true" aria-labelledby="g3-qte-title">
        <header>
          <div className="g3-qte-lead">
            <span>{qteTitle}</span>
            <div className="g3-challenge-prompt">
              <h2 ref={headingRef} id="g3-qte-title" tabIndex="-1">{promptZh}</h2>
              {promptPinyin && <small className="g3-prompt-pinyin">{promptPinyin}</small>}
              {promptTh && <em className="g3-prompt-th">{promptTh}</em>}
            </div>
          </div>
          {timed && <div className="g3-qte-clock" aria-hidden="true"><b>{Math.ceil(remaining)}</b><small>SEC</small></div>}
        </header>
        <p className="g3-builder-hint">{instruction}</p>
        <div className="g3-qte-progress" aria-hidden="true"><span data-tone={tone} style={{ width: \`\${progress}%\` }} /></div>
        {timed && status === "active" && <button className="g3-pause-time" type="button" onClick={togglePause}><Icon paths={paused ? playIcon : pauseIcon} />{paused ? text.resume : text.pause}</button>}

        <div className="g3-qte-options">
          {challenge.options.map((option, index) => {
            const isHintDisabled = showStrongHint && option.value === wrongOptionToDisable;
            const isWrongGuess = wrongChoices.includes(option.value);
            return (
              <button 
                type="button" 
                key={option.value} 
                onClick={() => pick(option)} 
                disabled={status !== "active" || paused || isHintDisabled || isWrongGuess} 
                className={\`\${choice === option.value ? "is-selected" : ""} \${isHintDisabled || isWrongGuess ? "is-wrong-hint" : ""}\`.trim()}
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
              {language === "th" ? \`ตอบผิด \${wrongAttempts} ครั้ง\` : language === "zh" ? \`错误 \${wrongAttempts} 次\` : \`Wrong \${wrongAttempts} times\`}
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
      </section>
    </div>
  );
}`;

content = content.replace(/export function QteChallenge\([\s\S]*?(?=export function SentenceChallenge)/, replacement);

fs.writeFileSync(p, content, 'utf-8');
