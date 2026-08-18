import React, { useCallback, useEffect, useRef, useState } from "react";
import { playSynthSound } from "../../../../../shared/features/games/gameSound.js";
import { playChineseTTS, stopChineseVoice } from "../../../services/audio/index.js";
import { buildListenQuestionSet, evaluateScore, GAME_COPY, GameFeedback, GameHud, GameIntro, GameResults, GameTimer, languageCopy, useGameLifecycle, useGameVisibilityPause } from "../shared/index.js";

const SPRINT_TIME = 45000;

export default function SoundSprintGame({ lesson, language, onBack }) {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [attempted, setAttempted] = useState(0);
  const [lives, setLives] = useState(3);
  const [status, setStatus] = useState("intro");
  const [timeLeft, setTimeLeft] = useState(SPRINT_TIME);
  const [audioStatus, setAudioStatus] = useState("idle");
  const [selectedOption, setSelectedOption] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [liveStatus, setLiveStatus] = useState("");
  const audioTokenRef = useRef(0);
  const answerStartRef = useRef(0);
  const speakerRef = useRef(null);
  const copy = languageCopy(language);
  const game = (GAME_COPY[language] || GAME_COPY.th).games.sprint;
  const paused = useGameVisibilityPause(status === "playing");
  const { cancelFrame, capture, invalidate, isCurrent, requestFrame, schedule } = useGameLifecycle();

  const invalidateAudio = useCallback(() => {
    audioTokenRef.current += 1;
    return invalidate();
  }, [invalidate]);

  const enterResults = useCallback(() => {
    invalidateAudio();
    setStatus("results");
  }, [invalidateAudio]);

  const exitGame = useCallback(() => {
    invalidateAudio();
    onBack();
  }, [invalidateAudio, onBack]);

  const prepareGame = useCallback(() => {
    invalidateAudio();
    setQuestions(buildListenQuestionSet(lesson.vocabulary));
    setCurrentIndex(0);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setCorrectCount(0);
    setAttempted(0);
    setLives(3);
    setTimeLeft(SPRINT_TIME);
    setAudioStatus("idle");
    setSelectedOption(null);
    setFeedback("");
    setLiveStatus("");
    setStatus("intro");
  }, [invalidateAudio, lesson.vocabulary]);

  useEffect(() => {
    prepareGame();
    return () => stopChineseVoice();
  }, [prepareGame]);

  useEffect(() => {
    stopChineseVoice();
  }, [currentIndex]);

  useEffect(() => {
    if (!paused) return;
    audioTokenRef.current += 1;
    setAudioStatus("idle");
  }, [paused]);

  useEffect(() => {
    if (status === "playing" && selectedOption === null && audioStatus === "idle") speakerRef.current?.focus();
  }, [audioStatus, currentIndex, selectedOption, status]);

  const startGame = () => {
    invalidateAudio();
    setStatus(questions.length ? "playing" : "results");
  };

  useEffect(() => {
    if (status !== "playing" || paused) return undefined;
    const epoch = capture();
    let previous = performance.now();
    let ended = false;
    let frameId = 0;
    const tick = (now) => {
      const delta = now - previous;
      previous = now;
      setTimeLeft((value) => {
        const next = Math.max(0, value - delta);
        if (next <= 0 && !ended) {
          ended = true;
          schedule(enterResults, 0, epoch);
        } else if (!ended) {
          frameId = requestFrame(tick, epoch);
        }
        return next;
      });
    };
    frameId = requestFrame(tick, epoch);
    return () => cancelFrame(frameId);
  }, [cancelFrame, capture, enterResults, paused, requestFrame, schedule, status]);

  const playSound = () => {
    const question = questions[currentIndex];
    if (!question || paused || selectedOption !== null || audioStatus === "playing") return;
    const token = audioTokenRef.current + 1;
    const epoch = capture();
    audioTokenRef.current = token;
    setAudioStatus("playing");
    setFeedback(copy.soundPlaying);
    const playback = playChineseTTS(question.hanzi);
    playback.completion.then((result) => {
      if (audioTokenRef.current !== token || !isCurrent(epoch) || status !== "playing") return;
      if (result.status === "ended") {
        answerStartRef.current = performance.now();
        setAudioStatus("ready");
        setFeedback(copy.soundReady);
      } else {
        setAudioStatus(result.status === "blocked" ? "blocked" : "unavailable");
        setFeedback(result.status === "blocked" ? copy.soundBlocked : copy.soundUnavailable);
      }
    });
  };

  const nextQuestion = useCallback((nextAttempted, nextLives) => {
    if (nextLives <= 0 || nextAttempted >= questions.length) {
      enterResults();
      return;
    }
    setCurrentIndex((value) => value + 1);
    setSelectedOption(null);
    setAudioStatus("idle");
    setFeedback("");
  }, [enterResults, questions.length]);

  const handleOption = (option, index) => {
    if (selectedOption !== null || audioStatus !== "ready" || paused || status !== "playing") return;
    const epoch = invalidateAudio();
    setSelectedOption(index);
    const nextAttempted = attempted + 1;
    setAttempted(nextAttempted);
    let nextLives = lives;
    if (option.isCorrect) {
      const reactionTime = Math.max(0, performance.now() - answerStartRef.current);
      const basePoints = reactionTime < 1200 ? 200 : reactionTime < 2200 ? 150 : reactionTime < 3500 ? 100 : 50;
      const nextCombo = combo + 1;
      const earned = Math.round(basePoints * (1 + Math.min(nextCombo, 10) * 0.1));
      const nextScore = score + earned;
      setCombo(nextCombo);
      setMaxCombo((value) => Math.max(value, nextCombo));
      setCorrectCount((value) => value + 1);
      setScore(nextScore);
      setTimeLeft((value) => Math.min(SPRINT_TIME, value + 1500));
      setFeedback(copy.correctStatus);
      setLiveStatus(`${copy.correctStatus}. ${copy.score}: ${nextScore}. ${copy.lives}: ${nextLives}/3. ${copy.progress}: ${nextAttempted}/${questions.length}`);
      playSynthSound("correct");
    } else {
      nextLives -= 1;
      setLives(nextLives);
      setCombo(0);
      setFeedback(copy.wrongStatus);
      setLiveStatus(`${copy.wrongStatus}. ${copy.score}: ${score}. ${copy.lives}: ${nextLives}/3. ${copy.progress}: ${nextAttempted}/${questions.length}`);
      playSynthSound("wrong");
    }
    schedule(() => nextQuestion(nextAttempted, nextLives), 750, epoch);
  };

  if (status === "intro") return <GameIntro game={{ id: "sprint", ...game }} language={language} onBack={exitGame} onStart={startGame} />;

  if (status === "results") {
    return <GameResults gameId="sprint" correct={correctCount} total={questions.length} lesson={lesson} language={language} gameScore={score} stats={{ maxCombo, rounds: attempted }} onPlayAgain={prepareGame} onBack={exitGame} scoreData={evaluateScore(correctCount, questions.length, lesson.level)} />;
  }

  const question = questions[currentIndex];
  if (!question) return <GameResults gameId="sprint" correct={correctCount} total={questions.length} lesson={lesson} language={language} gameScore={score} stats={{ maxCombo, rounds: attempted }} onPlayAgain={prepareGame} onBack={exitGame} scoreData={evaluateScore(correctCount, questions.length, lesson.level)} />;

  const soundLabel = audioStatus === "idle" ? copy.playSound : audioStatus === "ready" ? copy.replaySound : audioStatus === "playing" ? copy.soundPlaying : audioStatus === "blocked" ? copy.soundBlocked : copy.soundUnavailable;
  return (
    <main className="g3-arcade-game">
      <GameHud gameTitle={game.title} language={language} liveStatus={liveStatus} onBack={exitGame} paused={paused}>
        <span>{copy.score}: <strong>{score.toLocaleString()}</strong></span>
        <span>{copy.combo}: <strong>{combo}</strong></span>
        <span>{copy.lives}: <strong>{lives}/3</strong></span>
        <span>{copy.progress}: <strong>{Math.min(attempted + 1, questions.length)}/{questions.length}</strong></span>
      </GameHud>
      <GameTimer duration={SPRINT_TIME} language={language} onThreshold={(seconds) => setLiveStatus(`${copy.time}: ${seconds}s`)} timeLeft={timeLeft} warningAt={0.15} />
      <GameFeedback message={paused ? copy.paused : feedback} />
      <section className="g3-game-stage" aria-label={game.title}>
        <button ref={speakerRef} className={`g3-sprint-speaker ${audioStatus === "playing" ? "playing" : ""}`} type="button" onClick={playSound} disabled={paused || selectedOption !== null || audioStatus === "playing"} aria-label={soundLabel}>
          <span aria-hidden="true">听</span><small>{audioStatus === "ready" ? copy.replaySound : copy.playSound}</small>
        </button>
        <div className="g3-game-options">
          {question.options.map((option, index) => (
            <button key={option.text} className={`g3-game-option ${selectedOption !== null && option.isCorrect ? "correct" : selectedOption === index ? "wrong" : ""}`} type="button" disabled={selectedOption !== null || paused || audioStatus !== "ready"} onClick={() => handleOption(option, index)}>{option.text}</button>
          ))}
        </div>
      </section>
    </main>
  );
}
