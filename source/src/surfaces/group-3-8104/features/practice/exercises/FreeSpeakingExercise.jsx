import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { COPY } from "../../../content/copy.js";
import { buildFreeSpeakingDefinitions } from "../../../content/practice/freeSpeakingAdapter.js";
import { practicePath } from "../../../routing/routes.js";
import { createAudioRecorder } from "../audio/audioRecorder.js";
import { detectSpeakingCapabilities } from "../audio/browserCapabilities.js";
import { createSpeechRecognizer } from "../audio/speechRecognition.js";
import { evaluateFreeSpeakingResponse } from "../evaluation/freeSpeaking.js";
import { PracticeExerciseShell } from "./PracticeExerciseShell.jsx";
import { savePracticeResult } from "../sessionStore.js";
import { isAutomaticEvaluationUnavailable, localizedValue, percent, practiceErrorCopyKey } from "./practiceUi.js";

export function FreeSpeakingExercise({ exerciseType, language, level, navigate }) {
  const text = COPY[language] || COPY.th;
  const title = exerciseType === "image-description" ? text.imageDescription : text.questionResponse;
  const instruction = exerciseType === "image-description" ? text.imageInstruction : text.questionInstruction;
  const [definitions, setDefinitions] = useState([]);
  const [index, setIndex] = useState(0);
  const [phase, setPhaseState] = useState("loading");
  const [errorCode, setErrorCode] = useState("");
  const [transcript, setTranscript] = useState("");
  const [interim, setInterim] = useState("");
  const [recording, setRecording] = useState(null);
  const [result, setResult] = useState(null);
  const [sessionResults, setSessionResults] = useState([]);
  const [remainingMs, setRemainingMs] = useState(120_000);
  const [completedCount, setCompletedCount] = useState(0);
  const phaseRef = useRef(phase);
  const transcriptRef = useRef("");
  const recorderRef = useRef(null);
  const recognizerRef = useRef(null);
  const intervalRef = useRef(null);
  const startedAtRef = useRef(0);
  const transcriptionUnavailableRef = useRef(false);
  const capabilities = useMemo(() => detectSpeakingCapabilities(typeof window === "undefined" ? {} : window), []);

  const setPhase = useCallback((value) => {
    phaseRef.current = value;
    setPhaseState(value);
  }, []);

  useEffect(() => {
    let active = true;
    setPhase("loading");
    buildFreeSpeakingDefinitions(level, exerciseType).then((items) => {
      if (!active) return;
      setDefinitions(items);
      setPhase("ready");
    }).catch(() => active && setPhase("error"));
    return () => { active = false; };
  }, [exerciseType, level, setPhase]);

  const clearTicker = useCallback(() => {
    window.clearInterval(intervalRef.current);
    intervalRef.current = null;
  }, []);

  useEffect(() => () => {
    clearTicker();
    recognizerRef.current?.abort?.();
    recorderRef.current?.dispose?.();
  }, [clearTicker]);

  const current = definitions[index];

  const stopRecognizer = useCallback(() => {
    const recognizer = recognizerRef.current;
    recognizerRef.current = null;
    try { recognizer?.stop?.(); } catch { /* browser already ended */ }
  }, []);

  const startRecognitionCycle = useCallback(() => {
    if (!capabilities.speechRecognitionUsable || phaseRef.current !== "recording") return;
    const recognizer = createSpeechRecognizer({
      interimResults: true,
      locale: "zh-CN",
      onEvent(event) {
        if (event.type === "interim") setInterim(event.transcript);
        if (event.type === "final") {
          const combined = `${transcriptRef.current} ${event.transcript}`.trim();
          transcriptRef.current = combined;
          setTranscript(combined);
          setInterim("");
        }
        if (event.type === "noSpeech") setErrorCode("NO_SPEECH");
        if (event.type === "error" && event.error?.code !== "NO_SPEECH") {
          const code = event.error?.code || "ASR_ERROR";
          transcriptionUnavailableRef.current = isAutomaticEvaluationUnavailable(code);
          setErrorCode(code);
        }
        if (event.type === "ended" && phaseRef.current === "recording") {
          window.setTimeout(() => startRecognitionCycle(), 180);
        }
      },
    });
    recognizerRef.current = recognizer;
    try { recognizer.start(); } catch {
      transcriptionUnavailableRef.current = true;
      setErrorCode("ASR_ERROR");
    }
  }, [capabilities.speechRecognitionUsable]);

  const handleRecorderEvent = useCallback((event) => {
    if (event.type === "error") {
      setErrorCode(event.error?.code || "ASR_ERROR");
      setPhase("ready");
    }
    if (event.type === "completed") {
      phaseRef.current = "review";
      setRecording(event.recording);
      setPhaseState("review");
      clearTicker();
      stopRecognizer();
    }
  }, [clearTicker, setPhase, stopRecognizer]);

  const startSpeaking = async () => {
    if (!current || phaseRef.current !== "ready") return;
    recorderRef.current?.dispose?.();
    setRecording(null);
    setResult(null);
    setTranscript("");
    transcriptRef.current = "";
    setInterim("");
    setErrorCode("");
    transcriptionUnavailableRef.current = !capabilities.speechRecognitionUsable;
    startedAtRef.current = performance.now();
    setRemainingMs(current.timing.responseWindowMs);

    if (capabilities.captureErrorCode) {
      setErrorCode(capabilities.captureErrorCode);
      return;
    }

    const recorder = createAudioRecorder({
      durationLimitMs: current.timing.responseWindowMs,
      onEvent: handleRecorderEvent,
    });
    recorderRef.current = recorder;
    const recorderStarted = await recorder.start();
    if (!recorderStarted) return;
    setPhase("recording");
    startRecognitionCycle();
    const deadline = performance.now() + current.timing.responseWindowMs;
    intervalRef.current = window.setInterval(() => {
      const next = Math.max(0, deadline - performance.now());
      setRemainingMs(next);
      if (next === 0 && !recorder.supported) {
        clearTicker();
        stopRecognizer();
        setPhase("review");
      }
    }, 200);
  };

  const stopSpeaking = () => {
    if (phaseRef.current !== "recording") return;
    setPhase("review");
    clearTicker();
    stopRecognizer();
    if (!recorderRef.current?.stop?.()) setPhase("review");
  };

  const submit = () => {
    const durationMs = Math.max(0, performance.now() - startedAtRef.current);
    const recognized = transcriptRef.current.trim();
    let evalResult = null;
    if (transcriptionUnavailableRef.current) {
      evalResult = { status: "self-review" };
    } else {
      evalResult = evaluateFreeSpeakingResponse({
        durationMs,
        expectedConcepts: current.expectedConcepts,
        transcript: recognized,
      });
    }
    setResult(evalResult);
    setCompletedCount((value) => Math.min(definitions.length, value + 1));
    setSessionResults(prev => [...prev, evalResult]);
    setPhase("result");
  };

  const retry = () => {
    recorderRef.current?.discard?.();
    setRecording(null);
    setResult(null);
    setTranscript("");
    transcriptRef.current = "";
    setInterim("");
    setErrorCode("");
    transcriptionUnavailableRef.current = !capabilities.speechRecognitionUsable;
    setPhase("ready");
  };

  const next = () => {
    recorderRef.current?.discard?.();
    setRecording(null);
    setResult(null);
    setTranscript("");
    transcriptRef.current = "";
    setErrorCode("");
    transcriptionUnavailableRef.current = !capabilities.speechRecognitionUsable;
    if (index === definitions.length - 1) setPhase("completed");
    else {
      setIndex((value) => value + 1);
      setPhase("ready");
    }
  };

  const restart = () => {
    recorderRef.current?.discard?.();
    setIndex(0);
    setCompletedCount(0);
    setSessionResults([]);
    setRecording(null);
    setResult(null);
    setTranscript("");
    transcriptRef.current = "";
    setErrorCode("");
    transcriptionUnavailableRef.current = !capabilities.speechRecognitionUsable;
    setPhase("ready");
  };

  const status = errorCode ? text[practiceErrorCopyKey(errorCode)] : phase === "recording" ? text.recordingStatus : "";

  if (phase === "loading" || !current) {
    return <PracticeExerciseShell exerciseType={exerciseType} level={level} navigate={navigate} status="" text={text} title={title}><div className="g3-practice-message">{text.processingSpeech}</div></PracticeExerciseShell>;
  }
  if (phase === "error") {
    return <PracticeExerciseShell exerciseType={exerciseType} level={level} navigate={navigate} status={text.asrErrorMessage} text={text} title={title}><div className="g3-practice-message">{text.asrErrorMessage}</div></PracticeExerciseShell>;
  }
  if (phase === "completed") {
    savePracticeResult(level, exerciseType, sessionResults);
    return (
      <PracticeExerciseShell exerciseType={exerciseType} level={level} navigate={navigate} status={text.practiceCompleted} text={text} title={title}>
        <article className="g3-practice-summary"><span className="g3-practice-success-mark" aria-hidden="true">✓</span><h2>{text.practiceCompleted}</h2><p>{text.completedCount}: {completedCount} / {definitions.length}</p><div className="g3-practice-actions"><button className="is-secondary" type="button" onClick={() => navigate(practicePath(level))}>{text.backToPractice}</button>
<button className="g3-practice-primary" type="button" onClick={() => navigate(`/home/${level}/practice/summary/`)}>{text.practiceSummary || "สรุปผลการฝึก"}</button><button type="button" onClick={restart}>{text.practiceAgain}</button></div></article>
      </PracticeExerciseShell>
    );
  }

  const translation = exerciseType === "question-response" ? (current.question.translations?.th || localizedValue(current.question.translations, "th")) : "";
  return (
    <PracticeExerciseShell exerciseType={exerciseType} level={level} navigate={navigate} progress={{ current: index + 1, total: definitions.length }} status={status} text={text} title={title}>
      <article className={`g3-free-speaking-panel is-${exerciseType}`}>
        {exerciseType === "image-description" && <figure className="g3-free-speaking-image"><img src={current.image} srcSet={current.imageSrcSet || undefined} sizes="(max-width: 720px) 100vw, 48vw" alt={current.imageAlt?.[language] || current.imageAlt?.zh || ""} /></figure>}
        <div className="g3-free-speaking-content">
          <div className="g3-free-speaking-prompt">
            {exerciseType === "image-description" ? (
              <>
                <h2 lang="zh-CN">请用中文描述这张图片。</h2>
                <p className="g3-practice-pinyin">Qǐng yòng Zhōngwén miáoshù zhè zhāng túpiàn.</p>
                <p>กรุณาบรรยายภาพนี้เป็นภาษาจีน</p>
              </>
            ) : (
              <><h2 lang="zh-CN">{current.question.hanzi}</h2><p className="g3-practice-pinyin">{current.question.pinyin}</p>{translation && <p>{translation}</p>}</>
            )}
            <ul className="g3-practice-hints" aria-label={text.recommendedWords}>{current.hints.map((hint) => <li key={hint.hanzi}><strong>{hint.hanzi}</strong><span>{hint.pinyin}</span></li>)}</ul>
          </div>

          {phase === "ready" && <div className="g3-free-speaking-controls"><p>{text.preparationTime}: 15 {text.secondsShort}</p><button className="g3-practice-primary" type="button" onClick={startSpeaking} disabled={Boolean(capabilities.captureErrorCode)}>● {text.startSpeaking}</button>{capabilities.captureErrorCode ? <p className="g3-practice-notice">{text[practiceErrorCopyKey(capabilities.captureErrorCode)]}</p> : !capabilities.speechRecognitionUsable && <p className="g3-practice-notice">{text.asrUnsupportedSelfReview}</p>}</div>}

          {phase === "recording" && <div className="g3-free-speaking-controls"><div className="g3-practice-recording-state"><i aria-hidden="true" /><strong>{text.recordingStatus}</strong><span>{Math.ceil(remainingMs / 1000)} {text.secondsShort}</span></div><p className="g3-practice-transcript">{interim || transcript || (capabilities.speechRecognition ? text.readyToSpeak : text.selfReviewResult)}</p><button className="g3-practice-primary is-stop" type="button" onClick={stopSpeaking}>{text.stopSpeaking}</button></div>}

          {phase === "review" && <div className="g3-free-speaking-review">
            {recording?.playbackUrl && <div><span>{text.recordingPlayback}</span><audio controls preload="metadata" src={recording.playbackUrl}>{text.playRecording}</audio></div>}
            <p><span>{text.recognizedTranscript}</span><strong lang="zh-CN">{transcript || text.transcriptUnavailable}</strong></p>
            {!capabilities.speechRecognitionUsable && <p className="g3-practice-notice">{text.selfReviewResult}</p>}
            <div className="g3-practice-actions"><button className="is-secondary" type="button" onClick={retry}>{text.tryAgain}</button><button className="g3-practice-primary" type="button" onClick={submit}>{text.submitAnswer}</button></div>
          </div>}

          {phase === "result" && <div className="g3-free-speaking-result">
            <h3>{text.preliminaryResult}</h3>
            {result?.status === "self-review" ? <><p>{text.automaticEvaluationUnavailable}</p><p>{text.selfReviewResult}</p></> : <>
              <p><span>{text.recognizedTranscript}</span><strong lang="zh-CN">{transcript || text.transcriptUnavailable}</strong></p>
              <dl><div><dt>{text.speechContentAmount}</dt><dd>{result?.metrics.chineseCharacterCount}</dd></div><div><dt>{text.keywordCoverage}</dt><dd>{percent(result?.metrics.keywordCoverage)}</dd></div><div><dt>{text.responseDuration}</dt><dd>{result?.metrics.responseDurationSeconds} {text.secondsShort}</dd></div><div><dt>{text.baselineScore}</dt><dd>{result?.baselineScore} / 100</dd></div></dl>
              <p><span>{text.mentionedKeywords}</span><strong>{result?.mentionedConceptIds.length || 0}</strong></p>
              <p><span>{text.recommendedWords}</span><strong lang="zh-CN">{result?.recommendedTerms.join(" · ") || "—"}</strong></p>
            </>}
            <div className="g3-practice-actions"><button className="is-secondary" type="button" onClick={retry}>{text.tryAgain}</button><button className="g3-practice-primary" type="button" onClick={next}>{text.nextExercise} →</button></div>
          </div>}
        </div>
      </article>
    </PracticeExerciseShell>
  );
}
