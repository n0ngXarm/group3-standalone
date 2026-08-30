import { Group3DetailModal } from "../../../shared/components/index.js";
import { percent } from "../shared/practiceUi.js";

const COPY = Object.freeze({
  th: Object.freeze({
    back: "ย้อนกลับ",
    details: "ดูรายละเอียดคำตอบ",
    enlarge: "ดูภาพขนาดใหญ่",
    feedbackTitle: "ผลการฝึก",
    imageDialogTitle: "ภาพสำหรับบรรยาย",
    improvementFallback: "ลองเพิ่มว่าใครอยู่ที่ไหน กำลังทำอะไร และบรรยากาศเป็นอย่างไร",
    improvementLabel: "ลองพัฒนาต่อ",
    improvementTerms: "ลองเพิ่มคำว่า {terms} เพื่อให้คำบรรยายชัดขึ้น",
    observeBody: "สังเกตคน สิ่งของ สถานที่ และเหตุการณ์ในภาพ",
    observePoints: ["ใครอยู่ที่ไหน", "กำลังทำอะไร", "บรรยากาศเป็นอย่างไร"],
    observeTitle: "ดูภาพและคิด",
    positiveConcepts: "คุณกล่าวถึงองค์ประกอบสำคัญในภาพได้ {count} จุด",
    positiveLabel: "ทำได้ดี",
    positiveRecording: "คุณบันทึกคำตอบและกลับมาทบทวนได้ครบขั้นตอน",
    prepareBody: "เลือกใช้เฉพาะคำที่ช่วยเล่าเรื่องในภาพ ไม่จำเป็นต้องใช้ทุกคำ",
    prepareTime: "คุณมีเวลาเตรียมตัว {seconds} วินาที",
    prepareTitle: "เตรียมคำตอบ",
    readyAction: "ฉันพร้อมบรรยายแล้ว",
    recordingBody: "พูดต่อเนื่องตามสิ่งที่เห็น เมื่อเสร็จแล้วกดหยุดการบันทึก",
    recordingListening: "กำลังฟังและบันทึกเสียง",
    reviewBody: "ฟังเสียงของคุณ แล้วส่งเมื่อพอใจกับคำตอบ",
    reviewTitle: "ตรวจคำตอบก่อนส่ง",
    selfReview: "ระบบถอดเสียงไม่พร้อม กรุณาฟังเสียงของคุณและทบทวนคำตอบด้วยตนเอง",
    speakTitle: "บรรยายภาพเป็นภาษาจีน",
    steps: ["สังเกต", "เตรียม", "พูด", "ทบทวน"],
    transcriptPreview: "ข้อความที่ระบบได้ยิน",
  }),
  zh: Object.freeze({
    back: "返回",
    details: "查看回答详情",
    enlarge: "查看大图",
    feedbackTitle: "练习结果",
    imageDialogTitle: "看图说话图片",
    improvementFallback: "可以再说明谁在哪里、正在做什么，以及场景气氛。",
    improvementLabel: "下一步",
    improvementTerms: "试着加入 {terms}，让描述更清楚。",
    observeBody: "观察图中的人物、物品、地点和正在发生的事情。",
    observePoints: ["谁在哪里", "正在做什么", "场景气氛怎么样"],
    observeTitle: "先观察图片",
    positiveConcepts: "你已经提到了图中的 {count} 个重要信息。",
    positiveLabel: "做得好",
    positiveRecording: "你完成了录音和自我检查。",
    prepareBody: "选择少量有用词语帮助表达，不需要全部使用。",
    prepareTime: "你有 {seconds} 秒准备时间",
    prepareTitle: "准备回答",
    readyAction: "我准备好描述了",
    recordingBody: "根据图片连续表达，说完后停止录音。",
    recordingListening: "正在听并录音",
    reviewBody: "先回听录音，满意后再提交。",
    reviewTitle: "提交前检查回答",
    selfReview: "自动转写不可用，请回听录音并自行检查回答。",
    speakTitle: "用中文描述图片",
    steps: ["观察", "准备", "说话", "检查"],
    transcriptPreview: "系统识别到",
  }),
  en: Object.freeze({
    back: "Back",
    details: "View answer details",
    enlarge: "View larger image",
    feedbackTitle: "Practice result",
    imageDialogTitle: "Image description prompt",
    improvementFallback: "Add who is where, what they are doing, and what the scene feels like.",
    improvementLabel: "Improve next",
    improvementTerms: "Try adding {terms} to make your description clearer.",
    observeBody: "Notice the people, objects, place, and events in the image.",
    observePoints: ["Who is where?", "What are they doing?", "What is the atmosphere?"],
    observeTitle: "Observe and think",
    positiveConcepts: "You included {count} important details from the image.",
    positiveLabel: "Strong point",
    positiveRecording: "You completed the recording and review flow.",
    prepareBody: "Choose a few useful words. You do not need to use every word.",
    prepareTime: "You have {seconds} seconds to prepare",
    prepareTitle: "Prepare your answer",
    readyAction: "I am ready to describe it",
    recordingBody: "Describe what you see. Stop the recording when you finish.",
    recordingListening: "Listening and recording",
    reviewBody: "Listen to your recording and submit when you are satisfied.",
    reviewTitle: "Review before submitting",
    selfReview: "Automatic transcription is unavailable. Listen back and review your answer yourself.",
    speakTitle: "Describe the image in Chinese",
    steps: ["Observe", "Prepare", "Speak", "Review"],
    transcriptPreview: "Transcript preview",
  }),
});

function formatTimer(remainingMs) {
  const seconds = Math.max(0, Math.ceil((Number(remainingMs) || 0) / 1000));
  return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
}

function activeStep(phase) {
  return { observe: 0, prepare: 1, recording: 2, review: 3, result: 3 }[phase] ?? 0;
}

function replace(template, values) {
  return Object.entries(values).reduce((output, [key, value]) => output.replace(`{${key}}`, String(value)), template);
}

export function ImageDescriptionPresentation({
  capabilities,
  coachingAdvice,
  current,
  errorMessage,
  feedback,
  interim,
  language,
  modalView,
  onCloseModal,
  onNext,
  onOpenDetails,
  onOpenImage,
  onPrepare,
  onRetry,
  onStart,
  onStop,
  onSubmit,
  phase,
  recording,
  remainingMs,
  text,
  transcript,
}) {
  const ui = COPY[language] || COPY.th;
  const step = activeStep(phase);
  const preparationSeconds = Math.round((current.timing?.preparationMs || 15_000) / 1000);
  const shownHints = current.hints.slice(0, 3);
  const mentioned = new Set(feedback?.scored ? feedback?.source?.mentionedConceptIds || [] : []);
  const matchedTerms = (current.expectedConcepts || [])
    .filter((concept) => mentioned.has(concept.id))
    .map((concept) => concept.terms?.[0])
    .filter(Boolean);
  const positive = feedback?.positive?.key === "conceptCoverage"
    ? replace(ui.positiveConcepts, { count: feedback.positive.count })
    : ui.positiveRecording;
  const improvement = feedback?.improvement?.key === "recommendedTerms"
    ? replace(ui.improvementTerms, { terms: feedback.improvement.terms.join("、") })
    : feedback?.improvement?.key === "selfReview" ? ui.selfReview : ui.improvementFallback;

  const stageActions = (
    <div className={`g3-image-stage-actions is-${phase}`} aria-label={ui.steps[step]}>
      {phase === "observe" && <>
        <button className="is-secondary" type="button" onClick={onOpenImage}>{ui.enlarge}</button>
        <button className="g3-practice-primary" type="button" onClick={onPrepare}>{ui.readyAction} <span aria-hidden="true">→</span></button>
      </>}
      {phase === "prepare" && <>
        <button className="is-secondary" type="button" onClick={onRetry}>{ui.back}</button>
        <button className="g3-practice-primary g3-image-start" type="button" onClick={onStart} disabled={Boolean(capabilities.captureErrorCode)}>{text.startSpeaking}</button>
      </>}
      {phase === "recording" && <button className="g3-practice-primary is-stop" type="button" onClick={onStop}>{text.stopSpeaking}</button>}
      {phase === "review" && <>
        <button className="is-secondary" type="button" onClick={onRetry}>{text.tryAgain}</button>
        <button className="g3-practice-primary" type="button" onClick={onSubmit}>{text.submitAnswer} <span aria-hidden="true">→</span></button>
      </>}
      {phase === "result" && <>
        <button className="is-secondary" type="button" onClick={onRetry}>{text.tryAgain}</button>
        <button className="is-secondary" type="button" onClick={onOpenDetails}>{ui.details}</button>
        <button className="g3-practice-primary" type="button" onClick={onNext}>{text.nextExercise} <span aria-hidden="true">→</span></button>
      </>}
    </div>
  );

  return (
    <article
      className={`g3-free-speaking-panel g3-free-speaking--image-description is-image-description is-${phase}`}
      data-exercise-type="image-description"
      data-phase={phase}
    >
      <figure className="g3-free-speaking-image g3-image-description-visual">
        <img
          src={current.image}
          srcSet={current.imageSrcSet || undefined}
          sizes="(max-width: 860px) calc(100vw - 1.5rem), 620px"
          alt={current.imageAlt?.[language] || current.imageAlt?.zh || ""}
          decoding="async"
          height="788"
          width="1400"
        />
      </figure>

      <div className="g3-free-speaking-content g3-image-description-content">
        <ol className="g3-image-description-steps" aria-label={ui.steps.join(", ")}>
          {ui.steps.map((label, index) => (
            <li aria-current={index === step ? "step" : undefined} className={index <= step ? "is-reached" : ""} key={label}>
              <span>{index + 1}</span><small>{label}</small>
            </li>
          ))}
        </ol>

        <div className="g3-image-stage-content">
        {phase === "observe" && (
          <section className="g3-image-description-state g3-image-observe" aria-labelledby="g3-image-observe-title">
            <div className="g3-image-state-copy">
              <span>STEP 1</span>
              <h2 id="g3-image-observe-title">{ui.observeTitle}</h2>
              <p>{ui.observeBody}</p>
            </div>
            <ul className="g3-image-observe-points">
              {ui.observePoints.map((point) => <li key={point}>{point}</li>)}
            </ul>
          </section>
        )}

        {phase === "prepare" && (
          <section className="g3-image-description-state g3-image-prepare" aria-labelledby="g3-image-prepare-title">
            <div className="g3-image-state-copy">
              <span>STEP 2</span>
              <h2 id="g3-image-prepare-title">{ui.prepareTitle}</h2>
              <p>{ui.prepareBody}</p>
            </div>
            <div className="g3-image-prepare-time"><span aria-hidden="true">◷</span><strong>{replace(ui.prepareTime, { seconds: preparationSeconds })}</strong></div>
            <ul className="g3-practice-hints g3-image-vocabulary" aria-label={text.recommendedWords}>
              {shownHints.map((hint) => <li key={hint.hanzi}><strong lang="zh-CN">{hint.hanzi}</strong><span>{hint.pinyin}</span></li>)}
            </ul>
            {errorMessage && <p className="g3-practice-notice" role="alert">{errorMessage}</p>}
            {!capabilities.speechRecognitionUsable && !errorMessage && <p className="g3-practice-notice">{text.asrUnsupportedSelfReview}</p>}
          </section>
        )}

        {phase === "recording" && (
          <section className="g3-image-description-state g3-image-speaking" aria-labelledby="g3-image-speak-title">
            <div className="g3-image-microphone" aria-hidden="true"><span>●</span></div>
            <div className="g3-image-state-copy">
              <span>STEP 3</span>
              <h2 id="g3-image-speak-title">{ui.speakTitle}</h2>
              <p>{ui.recordingBody}</p>
            </div>
            <div className="g3-image-recording-status" role="status" aria-live="polite">
              <span><i aria-hidden="true" />{ui.recordingListening}</span>
              <time aria-label={`${text.speakingTime} ${formatTimer(remainingMs)}`}>{formatTimer(remainingMs)}</time>
            </div>
          </section>
        )}

        {phase === "review" && (
          <section className="g3-image-description-state g3-image-review" aria-labelledby="g3-image-review-title">
            <div className="g3-image-state-copy">
              <span>STEP 4</span>
              <h2 id="g3-image-review-title">{ui.reviewTitle}</h2>
              <p>{ui.reviewBody}</p>
            </div>
            {recording?.playbackUrl && <div className="g3-image-playback"><span>{text.recordingPlayback}</span><audio controls preload="metadata" src={recording.playbackUrl}>{text.playRecording}</audio></div>}
            {transcript ? <div className="g3-image-transcript-preview"><span>{ui.transcriptPreview}</span><strong lang="zh-CN">{transcript}</strong></div> : <p className="g3-practice-notice">{capabilities.speechRecognitionUsable ? text.transcriptUnavailable : ui.selfReview}</p>}
            {errorMessage && <p className="g3-practice-notice" role="alert">{errorMessage}</p>}
          </section>
        )}

        {phase === "result" && (
          <section className="g3-image-description-state g3-image-feedback" aria-labelledby="g3-image-feedback-title">
            <div className="g3-image-result-heading">
              <div><span>STEP 4</span><h2 id="g3-image-feedback-title">{ui.feedbackTitle}</h2></div>
              {feedback.scored ? <strong className="g3-image-score"><span>{Math.round(feedback.score)}</span><small>/ 100</small></strong> : <strong className="g3-image-unscored">{text.selfReviewResult}</strong>}
            </div>
            {feedback.metrics.length > 0 && <dl className="g3-image-metrics">
              {feedback.metrics.map((metric) => <div key={metric.key}><dt>{text[metric.key]}</dt><dd>{metric.key === "keywordCoverage" ? percent(metric.value) : metric.key === "responseDuration" ? `${metric.value} ${text.secondsShort}` : metric.value}</dd></div>)}
            </dl>}
            <div className="g3-image-feedback-notes">
              <p className="is-positive"><span>{ui.positiveLabel}</span><strong>{positive}</strong></p>
              <p className="is-improvement"><span>{ui.improvementLabel}</span><strong>{improvement}</strong></p>
            </div>
          </section>
        )}
        </div>
        {stageActions}
      </div>

      <Group3DetailModal open={modalView === "image"} title={ui.imageDialogTitle} onClose={onCloseModal}>
        <figure className="g3-image-modal-figure"><img src={current.image} srcSet={current.imageSrcSet || undefined} alt={current.imageAlt?.[language] || current.imageAlt?.zh || ""} /></figure>
      </Group3DetailModal>

      <Group3DetailModal open={modalView === "details"} title={ui.details} onClose={onCloseModal}>
        <div className="g3-image-detail-content">
          <section><span>{text.recognizedTranscript}</span><strong lang="zh-CN">{transcript || text.transcriptUnavailable}</strong></section>
          {feedback?.scored && <>
            <section><span>{text.mentionedKeywords}</span><strong lang="zh-CN">{matchedTerms.join(" · ") || "—"}</strong></section>
            <section><span>{text.recommendedWords}</span><strong lang="zh-CN">{feedback.improvement?.terms?.join(" · ") || "—"}</strong></section>
          </>}
          {coachingAdvice?.text && <section><span>{ui.improvementLabel}</span><strong>{coachingAdvice.text}</strong></section>}
        </div>
      </Group3DetailModal>
    </article>
  );
}
