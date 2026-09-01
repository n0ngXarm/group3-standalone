import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { COPY } from "../../../content/copy.js";
import { buildFreeSpeakingDefinitions } from "../../../content/practice/freeSpeakingAdapter.js";
import { practiceSummaryPath } from "../../../routing/routes.js";
import { speakChinese, stopChineseVoice } from "../../../services/audio/group3Audio.js";
import { createAudioRecorder } from "../audio/audioRecorder.js";
import { detectSpeakingCapabilities } from "../audio/browserCapabilities.js";
import { createSpeechRecognizer } from "../audio/speechRecognition.js";
import { evaluateFreeSpeakingResponse } from "../evaluation/freeSpeaking.js";
import { PracticeExerciseShell } from "../shared/PracticeExerciseShell.jsx";
import { practiceErrorCopyKey } from "../shared/practiceUi.js";
import { savePracticeResult } from "../sessionStore.js";
import { QuestionResponseConversation } from "./QuestionResponseConversation.jsx";
import {
  buildLearnerUtterance,
  buildQuestionFeedback,
  createQuestionConversation,
  createQuestionPromptAutoplay,
  getQuestionRound,
  nextQuestionRound,
  questionPromptKey,
  summarizeQuestionRounds,
} from "./questionResponseFlow.js";
import "./question-response.css";

const RESPONSE_WINDOW_MS = 120_000;
const FOLLOW_UP_DELAY_MS = 420;

export function QuestionResponseExercise({ language = "th", level, navigate }) {
  const text = COPY[language] || COPY.th;
  const [definitions, setDefinitions] = useState([]);
  const [index, setIndex] = useState(0);
  const [roundIndex, setRoundIndex] = useState(0);
  const [conversation, setConversation] = useState([]);
  const [phase, setPhaseState] = useState("loading");
  const [questionComplete, setQuestionComplete] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interim, setInterim] = useState("");
  const [typedAnswer, setTypedAnswer] = useState("");
  const [typedOpen, setTypedOpen] = useState(false);
  const [recording, setRecording] = useState(null);
  const [remainingMs, setRemainingMs] = useState(RESPONSE_WINDOW_MS);
  const [errorCode, setErrorCode] = useState("");
  const [sessionResults, setSessionResults] = useState([]);
  const phaseRef = useRef(phase);
  const transcriptRef = useRef("");
  const roundResultsRef = useRef([]);
  const recorderRef = useRef(null);
  const recognizerRef = useRef(null);
  const intervalRef = useRef(null);
  const followUpTimerRef = useRef(null);
  const startedAtRef = useRef(0);
  const promptAutoplayRef = useRef(null);
  if (!promptAutoplayRef.current) {
    promptAutoplayRef.current = createQuestionPromptAutoplay((utterance) => {
      stopChineseVoice();
      speakChinese(utterance.hanzi, { rate: 0.9 });
    });
  }
  const capabilities = useMemo(() => detectSpeakingCapabilities(typeof window === "undefined" ? {} : window), []);

  const setPhase = useCallback((nextPhase) => {
    phaseRef.current = nextPhase;
    setPhaseState(nextPhase);
  }, []);

  const clearTicker = useCallback(() => {
    window.clearInterval(intervalRef.current);
    intervalRef.current = null;
  }, []);

  const resetQuestion = useCallback((definition, nextIndex) => {
    recorderRef.current?.discard?.();
    setIndex(nextIndex);
    setRoundIndex(0);
    setConversation(createQuestionConversation(definition));
    setQuestionComplete(false);
    setTranscript("");
    transcriptRef.current = "";
    setInterim("");
    setTypedAnswer("");
    setTypedOpen(false);
    setRecording(null);
    setRemainingMs(RESPONSE_WINDOW_MS);
    setErrorCode("");
    startedAtRef.current = 0;
    roundResultsRef.current = [];
    setPhase("ready");
  }, [capabilities.speechRecognitionUsable, setPhase]);

  useEffect(() => {
    let active = true;
    setPhase("loading");
    buildFreeSpeakingDefinitions(level, "question-response").then((items) => {
      if (!active) return;
      setDefinitions(items);
      resetQuestion(items[0], 0);
    }).catch(() => active && setPhase("error"));
    return () => { active = false; };
  }, [level, resetQuestion, setPhase]);

  useEffect(() => () => {
    clearTicker();
    window.clearTimeout(followUpTimerRef.current);
    recognizerRef.current?.abort?.();
    recorderRef.current?.dispose?.();
    stopChineseVoice();
  }, [clearTicker]);

  const current = definitions[index];
  const currentRound = current ? getQuestionRound(current, roundIndex) : null;
  const isLastQuestion = index >= definitions.length - 1;
  const promptKey = questionPromptKey(current, roundIndex);

  useEffect(() => {
    promptAutoplayRef.current.play(promptKey, currentRound?.question);
  }, [currentRound?.question, promptKey]);

  const stopRecognizer = useCallback(() => {
    const recognizer = recognizerRef.current;
    recognizerRef.current = null;
    try { recognizer?.stop?.(); } catch { /* recognizer already ended */ }
  }, []);

  const startRecognitionCycle = useCallback(() => {
    if (!capabilities.speechRecognitionUsable || phaseRef.current !== "recording") return;
    const recognizer = createSpeechRecognizer({
      continuous: true,
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
          const nextError = event.error?.code || "ASR_ERROR";
          setErrorCode(nextError);
        }
        if (event.type === "ended" && phaseRef.current === "recording" && recognizerRef.current === recognizer) {
          window.setTimeout(() => {
            if (phaseRef.current === "recording") startRecognitionCycle();
          }, 180);
        }
      },
    });
    recognizerRef.current = recognizer;
    try { recognizer.start(); } catch {
      setErrorCode("ASR_ERROR");
    }
  }, [capabilities.speechRecognitionUsable]);

  const handleRecorderEvent = useCallback((event) => {
    if (event.type === "error") {
      setErrorCode(event.error?.code || "ASR_ERROR");
      setPhase("ready");
    }
    if (event.type === "completed") {
      setRecording(event.recording);
      clearTicker();
      stopRecognizer();
      setPhase("review");
    }
  }, [clearTicker, setPhase, stopRecognizer]);

  const startSpeaking = async () => {
    if (!currentRound || phaseRef.current !== "ready") return;
    stopChineseVoice();
    recorderRef.current?.dispose?.();
    setRecording(null);
    setTranscript("");
    transcriptRef.current = "";
    setInterim("");
    setTypedAnswer("");
    setTypedOpen(false);
    setErrorCode("");
    startedAtRef.current = performance.now();
    setRemainingMs(RESPONSE_WINDOW_MS);
    if (capabilities.captureErrorCode) {
      setErrorCode(capabilities.captureErrorCode);
      return;
    }
    const recorder = createAudioRecorder({ durationLimitMs: RESPONSE_WINDOW_MS, onEvent: handleRecorderEvent });
    recorderRef.current = recorder;
    if (!await recorder.start()) return;
    setPhase("recording");
    startRecognitionCycle();
    const deadline = performance.now() + RESPONSE_WINDOW_MS;
    intervalRef.current = window.setInterval(() => {
      const remaining = Math.max(0, deadline - performance.now());
      setRemainingMs(remaining);
      if (remaining === 0) {
        clearTicker();
        stopRecognizer();
      }
    }, 200);
  };

  const stopSpeaking = () => {
    if (phaseRef.current !== "recording") return;
    clearTicker();
    stopRecognizer();
    if (!recorderRef.current?.stop?.()) setPhase("review");
  };

  const finishQuestion = useCallback((result) => {
    const summary = summarizeQuestionRounds([...roundResultsRef.current, result]);
    setSessionResults((previous) => {
      const nextResults = [...previous, summary];
      if (index >= definitions.length - 1) savePracticeResult(level, "question-response", nextResults);
      return nextResults;
    });
    setQuestionComplete(true);
    setPhase("complete");
  }, [definitions.length, index, level, setPhase]);

  const submitResponse = (providedAnswer = "") => {
    if (!currentRound || !["ready", "review"].includes(phaseRef.current)) return;
    const recognized = String(providedAnswer || transcriptRef.current || "").trim();
    const durationMs = startedAtRef.current ? Math.max(0, performance.now() - startedAtRef.current) : 0;
    startedAtRef.current = 0;
    const result = recognized
      ? evaluateFreeSpeakingResponse({ durationMs, expectedConcepts: currentRound.expectedConcepts, transcript: recognized })
      : { status: "self-review" };
    const learnerMessage = recognized
      ? { role: "learner", utterance: buildLearnerUtterance(recognized, currentRound.sampleAnswers), feedback: buildQuestionFeedback(result) }
      : { role: "learner", note: "บันทึกคำตอบด้วยเสียงแล้ว ระบบไม่ได้ถอดเสียงในครั้งนี้", feedback: buildQuestionFeedback(result) };
    roundResultsRef.current = [...roundResultsRef.current, result];
    setConversation((previous) => [...previous, learnerMessage]);
    setTypedAnswer("");
    setTypedOpen(false);
    setRecording(null);
    setPhase("processing");
    const nextRound = nextQuestionRound(current, roundIndex);
    followUpTimerRef.current = window.setTimeout(() => {
      if (nextRound.complete) {
        roundResultsRef.current = roundResultsRef.current.slice(0, -1);
        finishQuestion(result);
        return;
      }
      const followUp = getQuestionRound(current, nextRound.roundIndex);
      setRoundIndex(nextRound.roundIndex);
      setConversation((previous) => [...previous, { role: "system", utterance: followUp.question }]);
      setTranscript("");
      transcriptRef.current = "";
      setInterim("");
      setErrorCode("");
      setPhase("ready");
    }, FOLLOW_UP_DELAY_MS);
  };

  const skipQuestion = () => {
    if (!current || questionComplete) return;
    stopChineseVoice();
    clearTicker();
    stopRecognizer();
    recorderRef.current?.dispose?.();
    roundResultsRef.current = [];
    setConversation((previous) => [...previous, { role: "learner", note: "ข้ามบทสนทนานี้" }]);
    finishQuestion({ status: "skipped" });
  };

  const nextQuestion = () => {
    if (!questionComplete) return;
    if (isLastQuestion) {
      navigate(practiceSummaryPath(level));
      return;
    }
    resetQuestion(definitions[index + 1], index + 1);
  };

  const replay = (utterance) => {
    if (utterance?.hanzi) speakChinese(utterance.hanzi, { rate: 0.9 });
  };

  const effectiveErrorCode = errorCode || capabilities.captureErrorCode || "";
  const errorMessage = effectiveErrorCode ? text[practiceErrorCopyKey(effectiveErrorCode)] : "";
  const status = phase === "recording" ? "กำลังฟังเสียงคำตอบของคุณ" : errorMessage;

  if (phase === "loading" || !current) {
    return <PracticeExerciseShell exerciseType="question-response" level={level} navigate={navigate} status="" text={text} title={text.questionResponse}><div className="g3-practice-message">{text.processingSpeech}</div></PracticeExerciseShell>;
  }
  if (phase === "error") {
    return <PracticeExerciseShell exerciseType="question-response" level={level} navigate={navigate} status={text.asrErrorMessage} text={text} title={text.questionResponse}><div className="g3-practice-message">{text.asrErrorMessage}</div></PracticeExerciseShell>;
  }

  return (
    <PracticeExerciseShell exerciseType="question-response" level={level} navigate={navigate} progress={{ current: index + 1, total: definitions.length }} status={status} text={text} title={text.questionResponse}>
      <QuestionResponseConversation
        complete={questionComplete}
        conversation={conversation}
        current={current}
        errorMessage={errorMessage}
        interim={interim}
        isLastQuestion={isLastQuestion}
        language={language}
        micAvailable={!capabilities.captureErrorCode}
        onNext={nextQuestion}
        onReplay={replay}
        onSkip={skipQuestion}
        onStart={startSpeaking}
        onStop={stopSpeaking}
        onSubmit={submitResponse}
        onToggleTyped={() => setTypedOpen((open) => !open)}
        onTypedAnswerChange={setTypedAnswer}
        phase={phase}
        recording={recording}
        recordingSeconds={Math.ceil(remainingMs / 1000)}
        transcript={transcript}
        typedAnswer={typedAnswer}
        typedOpen={typedOpen}
      />
    </PracticeExerciseShell>
  );
}
