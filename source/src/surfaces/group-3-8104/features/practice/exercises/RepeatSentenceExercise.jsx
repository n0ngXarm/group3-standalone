import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { COPY } from "../../../content/copy.js";
import { buildRepeatSessionDefinitions } from "../../../content/practice/repeatAdapter.js";
import { practicePath, practiceSummaryPath } from "../../../routing/routes.js";
import { surfaceAssetPath } from "../../../../../shared/lib/surface-url.js";
import { speakChinese, stopChineseVoice } from "../../../services/audio/index.js";
import { detectSpeakingCapabilities } from "../audio/browserCapabilities.js";
import { createAudioRecorder } from "../audio/audioRecorder.js";
import { createSpeechRecognizer } from "../audio/speechRecognition.js";
import { evaluateRepeatSentence } from "../evaluation/deterministic.js";
import { aggregateRepeatResults, createRepeatSession, repeatSessionReducer } from "../session/repeatSession.js";
import { PracticeExerciseShell } from "./PracticeExerciseShell.jsx";
import { isAutomaticEvaluationUnavailable, localizedValue, percent, practiceErrorCopyKey } from "./practiceUi.js";
import { savePracticeResult } from "../sessionStore.js";
import { getSpeechCoachingAdvice } from "../evaluation/speechFeedback.js";
import { analyzePronunciationDetail } from "../evaluation/pronunciationAnalyzer.js";
import { SpeechFeedbackAlert } from "./SpeechFeedbackAlert.jsx";
import { PronunciationDetailCard } from "./PronunciationDetailCard.jsx";
import { getRepeatPresentation, resolveRepeatVisualAsset } from "./repeatPresentation.js";

const RESPONSE_WINDOW_MS = 10_000;
const REPEAT_VISUAL_MANIFEST = "/assets/group3/shared/repeat-visuals/repeat-visual-manifest.json";
let attemptSequence = 0;

function nextAttemptId() {
  attemptSequence += 1;
  return `repeat-attempt-${attemptSequence}`;
}

export function RepeatSentenceExercise({ language, level, navigate }) {
  const text = COPY[language] || COPY.th;
  const [definitions, setDefinitions] = useState([]);
  const [loadError, setLoadError] = useState(false);
  const [lastTranscript, setLastTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [userAudioUrl, setUserAudioUrl] = useState("");
  const [remainingMs, setRemainingMs] = useState(RESPONSE_WINDOW_MS);
  const [errorCode, setErrorCode] = useState("");
  const [selfReviewSpeaking, setSelfReviewSpeaking] = useState(false);
  const [visualManifest, setVisualManifest] = useState(null);
  const [brokenVisualId, setBrokenVisualId] = useState("");
  const [restartKey, setRestartKey] = useState(0);
  const recognizerRef = useRef(null);
  const recorderRef = useRef(null);
  const timeoutRef = useRef(null);
  const intervalRef = useRef(null);
  const attemptStartedAtRef = useRef(0);
  const capabilities = useMemo(() => detectSpeakingCapabilities(typeof window === "undefined" ? {} : window), []);

  useEffect(() => {
    let active = true;
    buildRepeatSessionDefinitions(level).then((items) => {
      if (!active) return;
      setDefinitions(items);
    }).catch(() => active && setLoadError(true));
    return () => { active = false; };
  }, [level, restartKey]);

  useEffect(() => {
    let active = true;
    fetch(surfaceAssetPath(3, REPEAT_VISUAL_MANIFEST))
      .then((response) => response.ok ? response.json() : Promise.reject(new Error(`repeat visual manifest ${response.status}`)))
      .then((manifest) => {
        if (active) setVisualManifest(manifest);
      })
      .catch(() => {
        if (active) setVisualManifest({});
      });
    return () => { active = false; };
  }, []);

  const [liveSession, setLiveSession] = useState(null);
  useEffect(() => {
    if (!definitions.length) return;
    const created = createRepeatSession({
      exerciseIds: definitions.map((item) => item.exerciseId),
      level: Number(String(level).replace("hsk", "")),
      sessionId: `repeat-${level}-${restartKey + 1}`,
    });
    setLiveSession(repeatSessionReducer(created, { type: "START" }));
  }, [definitions, level, restartKey]);
  const send = useCallback((event) => setLiveSession((state) => state ? repeatSessionReducer(state, event) : state), []);

  const clearListeningTimers = useCallback(() => {
    window.clearTimeout(timeoutRef.current);
    window.clearInterval(intervalRef.current);
    timeoutRef.current = null;
    intervalRef.current = null;
  }, []);

  useEffect(() => () => {
    clearListeningTimers();
    recognizerRef.current?.abort?.();
    recorderRef.current?.dispose?.();
    stopChineseVoice();
  }, [clearListeningTimers]);

  const current = liveSession ? definitions[liveSession.currentIndex] : null;
  const currentResult = liveSession?.results.find((item) => item.exerciseId === current?.exerciseId);
  const presentation = getRepeatPresentation(liveSession?.phase);
  const visualAsset = resolveRepeatVisualAsset(visualManifest, current?.exerciseId);
  const visualSrc = visualAsset && brokenVisualId !== current?.exerciseId
    ? surfaceAssetPath(3, visualAsset)
    : "";

  const pronunciationAnalysis = useMemo(() => {
    if (liveSession?.phase !== "feedback" || !current) return null;
    return analyzePronunciationDetail({
      audioDurationMs: currentResult?.metrics?.speechMs || 0,
      language,
      speechMs: currentResult?.metrics?.speechMs || 0,
      targetHanzi: current.hanzi,
      targetPinyin: current.pinyin,
      userTranscript: lastTranscript,
    });
  }, [liveSession?.phase, current, currentResult, language, lastTranscript]);

  const coachingAdvice = useMemo(() => {
    if (liveSession?.phase !== "feedback" || !currentResult) return null;
    return getSpeechCoachingAdvice({
      accuracy: currentResult.metrics?.transcriptAccuracy,
      analysis: pronunciationAnalysis,
      language,
      score: currentResult.score,
      status: currentResult.status,
      transcript: lastTranscript,
    });
  }, [liveSession?.phase, currentResult, language, lastTranscript, pronunciationAnalysis]);

  const playPrompt = useCallback((advancePhase = false) => {
    if (!current) return;
    setErrorCode("");
    if (advancePhase) send({ type: "PLAY_PROMPT" });
    const playback = speakChinese(current.hanzi, { audioSrc: current.referenceAudio });
    playback.completion.finally(() => {
      if (advancePhase) send({ type: "PROMPT_FINISHED" });
    });
  }, [current, send]);

  useEffect(() => {
    if (liveSession?.phase === "transition" && current) playPrompt(true);
  }, [current, liveSession?.phase, playPrompt]);

  const finishAttempt = useCallback((attemptId, transcript, timedOut = false) => {
    clearListeningTimers();
    recognizerRef.current = null;
    recorderRef.current?.stop();
    setSelfReviewSpeaking(false);
    const endedAt = performance.now();
    const spoken = String(transcript || "");
    setLastTranscript(spoken);
    setInterimTranscript("");
    if (timedOut) send({ type: "TIMEOUT", attemptId });
    else send({ type: "TRANSCRIPT_FINAL", attemptId, transcript: spoken });
    const result = evaluateRepeatSentence({
      target: current?.hanzi,
      transcript: spoken,
      timing: {
        endedAt,
        responseWindowMs: RESPONSE_WINDOW_MS,
        speechMs: Math.max(0, endedAt - attemptStartedAtRef.current),
        silenceMs: spoken ? 0 : Math.max(0, endedAt - attemptStartedAtRef.current),
        startedAt: attemptStartedAtRef.current,
      },
    });
    send({ type: "PROCESS_SUCCESS", attemptId, result });
  }, [clearListeningTimers, current?.hanzi, send]);

  const finishUnscoredAttempt = useCallback((attemptId) => {
    clearListeningTimers();
    recognizerRef.current = null;
    recorderRef.current?.stop();
    setSelfReviewSpeaking(false);
    setLastTranscript("");
    setInterimTranscript("");
    send({ type: "TRANSCRIPT_FINAL", attemptId, transcript: "" });
    send({ type: "PROCESS_SUCCESS", attemptId, result: { metrics: {}, score: null, status: "self-review" } });
  }, [clearListeningTimers, send]);

  const startTimer = useCallback((attemptId, onTimeout) => {
    const deadline = performance.now() + RESPONSE_WINDOW_MS;
    setRemainingMs(RESPONSE_WINDOW_MS);
    intervalRef.current = window.setInterval(() => setRemainingMs(Math.max(0, deadline - performance.now())), 100);
    timeoutRef.current = window.setTimeout(() => onTimeout(attemptId), RESPONSE_WINDOW_MS);
  }, []);

  const startSpeaking = () => {
    if (!current || liveSession?.phase !== "ready") return;
    setErrorCode("");
    setLastTranscript("");
    setUserAudioUrl("");
    recorderRef.current?.dispose?.();
    const attemptId = nextAttemptId();
    attemptStartedAtRef.current = performance.now();
    send({ type: "RECORD_START", attemptId });

    if (capabilities.microphoneCapture && capabilities.mediaRecorder) {
      const recorder = createAudioRecorder({
        durationLimitMs: RESPONSE_WINDOW_MS,
        onEvent(event) {
          if (event.type === "completed" && event.recording?.playbackUrl) {
            setUserAudioUrl(event.recording.playbackUrl);
          }
        },
      });
      recorderRef.current = recorder;
      recorder.start().catch(() => {});
    }

    if (!capabilities.speechRecognitionUsable) {
      setErrorCode(capabilities.asrErrorCode || "ASR_UNSUPPORTED");
      setSelfReviewSpeaking(true);
      startTimer(attemptId, (id) => {
        send({ type: "TRANSCRIPT_FINAL", attemptId: id, transcript: "" });
        send({ type: "PROCESS_SUCCESS", attemptId: id, result: { metrics: {}, score: null, status: "self-review" } });
        setSelfReviewSpeaking(false);
      });
      return;
    }

    let settled = false;
    let accumulatedTranscript = "";
    const settle = (transcript, timedOut = false) => {
      if (settled) return;
      settled = true;
      finishAttempt(attemptId, transcript, timedOut);
    };
    const recognizer = createSpeechRecognizer({
      continuous: false,
      interimResults: true,
      locale: "zh-CN",
      onEvent(event) {
        if (event.type === "interim") {
          accumulatedTranscript = event.transcript;
          setInterimTranscript(event.transcript);
        }
        if (event.type === "final") {
          accumulatedTranscript = event.transcript;
          settle(event.transcript);
        }
        if (event.type === "noSpeech") {
          if (!accumulatedTranscript) setErrorCode("NO_SPEECH");
          settle(accumulatedTranscript);
        }
        if (event.type === "error") {
          const code = event.error?.code || "ASR_ERROR";
          setErrorCode(code);
          if (isAutomaticEvaluationUnavailable(code)) {
            settled = true;
            finishUnscoredAttempt(attemptId);
          } else {
            settle(accumulatedTranscript);
          }
        }
        if (event.type === "ended" && !settled) {
          if (accumulatedTranscript) {
            settle(accumulatedTranscript);
          } else {
            setErrorCode("NO_SPEECH");
            settle("");
          }
        }
      },
    });
    recognizerRef.current = recognizer;
    try {
      recognizer.start();
      startTimer(attemptId, (id) => {
        recognizer.stop();
        settle(accumulatedTranscript, true);
      });
    } catch {
      setErrorCode("ASR_ERROR");
      settled = true;
      finishUnscoredAttempt(attemptId);
    }
  };

  const finishSpeakingEarly = () => {
    if (liveSession?.phase !== "listening") return;
    recognizerRef.current?.stop();
  };

  const finishSelfReview = () => {
    if (!liveSession?.attemptId) return;
    clearListeningTimers();
    setSelfReviewSpeaking(false);
    send({ type: "TRANSCRIPT_FINAL", attemptId: liveSession.attemptId, transcript: "" });
    send({ type: "PROCESS_SUCCESS", attemptId: liveSession.attemptId, result: { metrics: {}, score: null, status: "self-review" } });
  };

  const retry = () => {
    clearListeningTimers();
    setErrorCode("");
    setLastTranscript("");
    send({ type: "RETRY" });
  };

  const restart = () => {
    setDefinitions([]);
    setLiveSession(null);
    setRestartKey((value) => value + 1);
  };

  const title = text.repeatSentence;
  const status = errorCode ? text[practiceErrorCopyKey(errorCode)] : liveSession?.phase === "listening" ? text.recordingStatus : "";

  if (loadError) {
    return <PracticeExerciseShell exerciseType="repeat-sentence" level={level} navigate={navigate} status={text.asrErrorMessage} text={text} title={title}><div className="g3-practice-message">{text.asrErrorMessage}</div></PracticeExerciseShell>;
  }
  if (!current || !liveSession) {
    return <PracticeExerciseShell exerciseType="repeat-sentence" level={level} navigate={navigate} status="" text={text} title={title}><div className="g3-practice-message">{text.processingSpeech}</div></PracticeExerciseShell>;
  }

  if (liveSession.phase === "completed") {
    savePracticeResult(level, "repeat-sentence", liveSession);
    const scored = liveSession.results.filter((result) => Number.isFinite(result.score));
    const summary = aggregateRepeatResults(scored);
    return (
      <PracticeExerciseShell exerciseType="repeat-sentence" level={level} navigate={navigate} status={text.practiceCompleted} text={text} title={title}>
        <article className="g3-practice-summary">
          <span className="g3-practice-success-mark" aria-hidden="true">✓</span>
          <h2>{text.repeatSummaryTitle}</h2>
          <dl>
            <div><dt>{text.completedCount}</dt><dd>{liveSession.results.length} / {definitions.length}</dd></div>
            {scored.length > 0 && <><div><dt>{text.averageContentAccuracy}</dt><dd>{percent(summary.averageAccuracy)}</dd></div><div><dt>{text.averageCompletion}</dt><dd>{percent(summary.averageCompletion)}</dd></div><div><dt>{text.overallDeterministicScore}</dt><dd>{Math.round(summary.overallScore)} / 100</dd></div></>}
          </dl>
          {!capabilities.speechRecognitionUsable && <p>{text.selfReviewResult}</p>}
          <div className="g3-practice-actions">
  <button className="is-secondary" type="button" onClick={() => navigate(practicePath(level))}>{text.backToPractice}</button>
  <button type="button" onClick={restart}>{text.practiceAgain}</button>
  <button className="g3-practice-primary" type="button" onClick={() => navigate(practiceSummaryPath(level))}>{text.practiceSummary || "สรุปผลการฝึก"}</button>
</div>
        </article>
      </PracticeExerciseShell>
    );
  }

  return (
    <PracticeExerciseShell exerciseType="repeat-sentence" level={level} navigate={navigate} progress={{ current: liveSession.currentIndex + 1, total: definitions.length }} status={status} text={text} title={title}>
      {coachingAdvice && <SpeechFeedbackAlert advice={coachingAdvice} language={language} />}
      <article className={`g3-repeat-panel is-${presentation.layout} ${visualSrc ? "has-visual" : "is-text-only"}`} data-phase={liveSession.phase}>
        {visualSrc && (
          <figure className="g3-repeat-visual">
            <img
              alt={`${current.hanzi} — ${current.translations?.th || current.translations?.en || ""}`}
              decoding="async"
              onError={() => setBrokenVisualId(current.exerciseId)}
              src={visualSrc}
            />
          </figure>
        )}
        <div className="g3-repeat-prompt">
          <span>{text.practiceInstructions}</span>
          <h2 lang="zh-CN">{current.hanzi}</h2>
          <p className="g3-practice-pinyin">{current.pinyin}</p>
          <p>{current.translations?.th || current.translations?.thAid || ""}</p>
        </div>

        <div className="g3-repeat-interaction">
          {presentation.showPrepareControls && <div className="g3-repeat-prepare-copy">
            <p className="g3-practice-help">{text.repeatInstructionBody}</p>
            <button className="g3-practice-primary" type="button" onClick={() => playPrompt(true)}>{text.practiceBegin}</button>
          </div>}

          {["playingPrompt", "transition"].includes(liveSession.phase) && (
            <div className="g3-repeat-playback-state" role="status">
              <span aria-hidden="true">▶</span>
              <strong>{text.listenExample}</strong>
            </div>
          )}

          {["ready", "listening", "processing"].includes(liveSession.phase) && <>
            <div className="g3-practice-timer" aria-label={`${text.speakingTime} ${Math.ceil(remainingMs / 1000)} ${text.secondsShort}`}><strong>{Math.ceil(remainingMs / 1000)}</strong><span>{text.secondsShort}</span></div>
            <div className="g3-practice-actions">
              <button className="is-secondary" type="button" onClick={() => playPrompt(false)} disabled={liveSession.phase !== "ready"}>▶ {text.listenExample}</button>
              {liveSession.phase === "ready" && <button className="g3-practice-primary" type="button" onClick={startSpeaking}>● {text.startSpeaking}</button>}
              {liveSession.phase === "listening" && <button className="g3-practice-primary is-stop" type="button" onClick={finishSpeakingEarly}>{text.finishSpeaking || "เสร็จสิ้น"}</button>}
              {selfReviewSpeaking && <button className="g3-practice-primary" type="button" onClick={finishSelfReview}>{text.finishSpeaking}</button>}
            </div>
            {!capabilities.speechRecognitionUsable && <p className="g3-practice-notice">{text[practiceErrorCopyKey(capabilities.asrErrorCode || "ASR_UNSUPPORTED")]}</p>}
            {(interimTranscript || liveSession.phase === "processing") && <p className="g3-practice-transcript">{interimTranscript || text.processingSpeech}</p>}
          </>}

          {presentation.showFeedback && <div className="g3-repeat-feedback">
            <h3>{currentResult?.status === "correct" ? text.correctStatus : currentResult?.status === "close" ? text.closeStatus : currentResult?.status === "self-review" ? text.selfReviewResult : text.retryStatus}</h3>
            {Number.isFinite(currentResult?.score) ? <>
              <dl><div><dt>{text.contentAccuracy}</dt><dd>{percent(currentResult.metrics?.transcriptAccuracy)}</dd></div><div><dt>{text.completionMetric}</dt><dd>{percent(currentResult.metrics?.completion)}</dd></div></dl>
              <div className="g3-repeat-feedback-detail">
                <p><span>{text.recognizedTranscript}</span><strong lang="zh-CN">{lastTranscript || text.transcriptUnavailable}</strong></p>
                {pronunciationAnalysis && (
                  <PronunciationDetailCard
                    analysis={pronunciationAnalysis}
                    language={language}
                    referenceAudio={current.referenceAudio}
                    targetHanzi={current.hanzi}
                    targetPinyin={current.pinyin}
                    userAudioUrl={userAudioUrl}
                  />
                )}
              </div>
            </> : <div className="g3-repeat-feedback-detail"><p>{text.automaticEvaluationUnavailable}</p><p>{text.selfReviewResult}</p></div>}
            <div className="g3-practice-actions"><button className="is-secondary" type="button" onClick={retry}>{text.tryAgain}</button><button className="g3-practice-primary" type="button" onClick={() => send({ type: "NEXT" })}>{text.nextExercise} →</button></div>
          </div>}
        </div>
      </article>
    </PracticeExerciseShell>
  );
}
