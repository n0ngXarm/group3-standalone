import { buildLearnerUtterance } from "./questionResponseFlow.js";

function SpeakerIcon() {
  return <span aria-hidden="true">🔊</span>;
}

function MicrophoneIcon() {
  return <span aria-hidden="true">🎙</span>;
}

function Utterance({ utterance }) {
  if (!utterance) return null;
  return (
    <div className="g3-question-utterance">
      <strong className="g3-question-hanzi" lang="zh-CN">{utterance.hanzi}</strong>
      <span className="g3-question-pinyin" lang="zh-Latn-pinyin">{utterance.pinyin}</span>
      <span className="g3-question-thai" lang="th">{utterance.translations?.th}</span>
    </div>
  );
}

function ConversationMessage({ message, onReplay }) {
  const isLearner = message.role === "learner";
  return (
    <div className={`g3-question-message is-${message.role}`}>
      <span className="g3-question-avatar" aria-hidden="true">{isLearner ? "你" : "练"}</span>
      <div className="g3-question-bubble">
        <div className="g3-question-speaker-row">
          <span>{isLearner ? "คำตอบของคุณ" : "ระบบฝึก"}</span>
          {message.utterance?.hanzi && (
            <button type="button" className="g3-question-icon-button" aria-label={`ฟัง ${message.utterance.hanzi}`} onClick={() => onReplay(message.utterance)}>
              <SpeakerIcon />
            </button>
          )}
        </div>
        {message.utterance ? <Utterance utterance={message.utterance} /> : <p className="g3-question-voice-note">{message.note}</p>}
        {message.feedback && <small className={`g3-question-feedback is-${message.feedback.kind}`}>{message.feedback.kind === "success" ? "✓ " : ""}{message.feedback.text}</small>}
      </div>
    </div>
  );
}

function HelpSection({ children, defaultOpen = false, title }) {
  return (
    <details className="g3-question-help-section" open={defaultOpen}>
      <summary>{title}<span aria-hidden="true">＋</span></summary>
      <div className="g3-question-help-content">{children}</div>
    </details>
  );
}

export function QuestionResponseConversation({
  complete,
  conversation,
  current,
  errorMessage,
  interim,
  isLastQuestion,
  language = "th",
  micAvailable,
  onNext,
  onReplay,
  onSkip,
  onStart,
  onStop,
  onSubmit,
  onToggleTyped,
  onTypedAnswerChange,
  phase,
  recording,
  recordingSeconds,
  transcript,
  typedAnswer,
  typedOpen,
}) {
  const allSamples = [
    ...(current.sampleAnswers || []),
    ...(current.followUps || []).flatMap((followUp) => followUp.sampleAnswers || []),
  ];
  const previewText = String(interim || transcript || "").trim();
  const learnerPreview = previewText ? buildLearnerUtterance(previewText, allSamples) : null;
  const micStatus = phase === "recording" ? "กำลังฟัง..." : errorMessage ? "ไมโครโฟนยังไม่พร้อม" : "พร้อมใช้งาน";
  const responseValue = typedAnswer.trim() || transcript.trim();

  return (
    <article className={`g3-question-response-layout is-${phase}`} data-exercise-type="question-response" data-phase={phase}>
      <section className="g3-question-conversation-column" aria-label="บทสนทนาฝึกตอบคำถาม">
        <div className="g3-question-main-card">
          <div className="g3-question-main-copy">
            <div className="g3-question-main-label">
              <span>คำถามหลัก</span>
              <button type="button" className="g3-question-icon-button" aria-label="ฟังคำถามหลัก" onClick={() => onReplay(current.question)}><SpeakerIcon /></button>
            </div>
            <Utterance utterance={current.question} />
          </div>
          {current.image && (
            <figure className="g3-question-visual-context">
              <img
                alt={current.imageAlt?.[language] || current.imageAlt?.th || current.imageAlt?.en || current.imageAlt?.zh || ""}
                loading="eager"
                sizes="(max-width: 760px) calc(100vw - 3rem), (max-width: 1020px) 13rem, 17rem"
                src={current.image}
                srcSet={current.imageSrcSet || undefined}
              />
              <figcaption>ภาพบริบท</figcaption>
            </figure>
          )}
        </div>

        <div className="g3-question-chat" role="log" aria-live="polite" aria-label="ประวัติบทสนทนา">
          {conversation.map((message, messageIndex) => (
            <ConversationMessage key={`${message.role}-${messageIndex}-${message.utterance?.hanzi || "voice"}`} message={message} onReplay={onReplay} />
          ))}
          {phase === "processing" && <div className="g3-question-processing" role="status"><span aria-hidden="true" />กำลังตรวจคำตอบ...</div>}
        </div>
      </section>

      <aside className="g3-question-help" aria-label="ตัวช่วยสำหรับการฝึก">
        <h2>ตัวช่วยฝึกตอบ</h2>
        <HelpSection title="คำตอบตัวอย่าง" defaultOpen>
          <div className="g3-question-samples">
            {allSamples.map((sample) => <Utterance key={sample.hanzi} utterance={sample} />)}
          </div>
        </HelpSection>
        <HelpSection title="คำศัพท์">
          <ul className="g3-question-vocabulary">
            {(current.vocabulary || []).map((word) => (
              <li key={word.hanzi}>
                <Utterance utterance={word} />
                <button type="button" className="g3-question-icon-button" aria-label={`ฟังคำว่า ${word.hanzi}`} onClick={() => onReplay(word)}><SpeakerIcon /></button>
              </li>
            ))}
          </ul>
        </HelpSection>
        <HelpSection title="สถานะไมค์" defaultOpen>
          <div className={`g3-question-mic-status is-${phase === "recording" ? "listening" : errorMessage ? "error" : "ready"}`}>
            <strong><span aria-hidden="true">●</span>{micStatus}</strong>
            <p>{errorMessage || (phase === "recording" ? "พูดภาษาจีนได้เลย เมื่อเสร็จแล้วกดหยุด" : "เสียงของคุณจะถูกบันทึกเมื่อกดปุ่มพูด")}</p>
          </div>
        </HelpSection>
      </aside>

      <footer className="g3-question-response-bar" aria-label="ตอบคำถาม">
        {complete ? (
          <div className="g3-question-complete" role="status">
            <div><span aria-hidden="true">✓</span><p><strong>{isLastQuestion ? "ฝึกตอบคำถามครบแล้ว" : "จบบทสนทนานี้แล้ว"}</strong><small>{isLastQuestion ? "พร้อมดูผลสรุปการฝึก" : "พร้อมไปยังคำถามถัดไป"}</small></p></div>
            <button type="button" className="g3-question-primary" onClick={onNext}>{isLastQuestion ? "ดูผลสรุป" : "ไปข้อถัดไป"}<span aria-hidden="true"> →</span></button>
          </div>
        ) : (
          <>
            {(phase === "review" || typedOpen) && (
              <form className="g3-question-response-entry" onSubmit={(event) => { event.preventDefault(); if (responseValue) onSubmit(responseValue); }}>
                {phase === "review" && recording?.playbackUrl && <audio controls preload="metadata" src={recording.playbackUrl}>ฟังเสียงที่บันทึก</audio>}
                {phase === "review" && !typedOpen && (
                  <div className="g3-question-review-utterance">
                    <span>ระบบได้ยิน</span>
                    {learnerPreview ? <Utterance utterance={learnerPreview} /> : <strong>ยังไม่มีข้อความถอดเสียง</strong>}
                  </div>
                )}
                {typedOpen && <label><span>พิมพ์คำตอบภาษาจีน</span><input autoComplete="off" inputMode="text" lang="zh-CN" value={typedAnswer} onChange={(event) => onTypedAnswerChange(event.target.value)} placeholder="เช่น 北京烤鸭" /></label>}
                <button type="submit" className="g3-question-submit" disabled={!responseValue}>ส่งคำตอบ</button>
              </form>
            )}
            {phase === "recording" && <div className="g3-question-live-transcript"><span className="g3-question-wave" aria-hidden="true"><i /><i /><i /><i /></span><div className="g3-question-live-utterance">{learnerPreview ? <Utterance utterance={learnerPreview} /> : <p>กำลังรอฟังเสียงภาษาจีนของคุณ...</p>}</div><strong>{recordingSeconds} วินาที</strong></div>}
            {errorMessage && <p className="g3-question-error" role="alert">{errorMessage}</p>}
            <div className="g3-question-action-row">
              <button type="button" className="g3-question-secondary is-replay" onClick={() => onReplay(current.question)}><SpeakerIcon /> ฟังอีกครั้ง</button>
              {phase === "recording" ? (
                <button type="button" className="g3-question-primary is-listening" onClick={onStop}><span aria-hidden="true">●</span> กำลังฟัง... กดเพื่อหยุด</button>
              ) : phase === "review" ? (
                <button type="button" className="g3-question-primary" onClick={() => responseValue && onSubmit(responseValue)} disabled={!responseValue}>ส่งคำตอบ</button>
              ) : (
                <button type="button" className="g3-question-primary is-microphone" onClick={onStart} disabled={!micAvailable || phase === "processing"}><MicrophoneIcon /> เริ่มพูด</button>
              )}
              <button type="button" className="g3-question-secondary is-skip" onClick={onSkip}>ข้ามข้อนี้ <span aria-hidden="true">→</span></button>
            </div>
            <button type="button" className="g3-question-type-toggle" aria-expanded={typedOpen} onClick={onToggleTyped}>⌨ พิมพ์แทน</button>
          </>
        )}
      </footer>
    </article>
  );
}
