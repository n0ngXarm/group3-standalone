import React, { useCallback, useEffect, useRef, useState } from "react";
import { playSynthSound } from "../../../../../shared/features/games/gameSound.js";
import { playChineseTTS, stopChineseVoice } from "../../../services/audio/index.js";
import { buildBlitzQuestions, evaluateScore, GAME_COPY, GameFeedback, GameHud, GameIntro, GameResults, GameTimer, languageCopy, useGameLifecycle, useGameVisibilityPause } from "../shared/index.js";

const INITIAL_TIME = 5000;

export default function VocabBlitzGame({ lesson, language, onBack }) {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [lives, setLives] = useState(3);
  const [correctCount, setCorrectCount] = useState(0);
  const [attempted, setAttempted] = useState(0);
  const [status, setStatus] = useState("intro");
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME);
  const [timerDuration, setTimerDuration] = useState(INITIAL_TIME);
  const [selectedOption, setSelectedOption] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [liveStatus, setLiveStatus] = useState("");
  const optionsRef = useRef(null);
  const copy = languageCopy(language);
  const game = (GAME_COPY[language] || GAME_COPY.th).games.blitz;
  const paused = useGameVisibilityPause(status === "playing");
  const { cancelFrame, capture, invalidate, requestFrame, schedule } = useGameLifecycle();

  const enterResults = useCallback(() => {
    invalidate();
    setStatus("results");
  }, [invalidate]);

  const exitGame = useCallback(() => {
    invalidate();
    onBack();
  }, [invalidate, onBack]);

  const prepareGame = useCallback(() => {
    invalidate();
    setQuestions(buildBlitzQuestions(lesson.vocabulary));
    setCurrentIndex(0);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setLives(3);
    setCorrectCount(0);
    setAttempted(0);
    setTimerDuration(INITIAL_TIME);
    setTimeLeft(INITIAL_TIME);
    setSelectedOption(null);
    setFeedback("");
    setLiveStatus("");
    setStatus("intro");
  }, [invalidate, lesson.vocabulary]);

  useEffect(() => {
    prepareGame();
    return () => stopChineseVoice();
  }, [prepareGame]);

  useEffect(() => {
    stopChineseVoice();
  }, [currentIndex]);

  useEffect(() => {
    if (status === "playing" && selectedOption === null) optionsRef.current?.querySelector("button")?.focus();
  }, [currentIndex, selectedOption, status]);

  const startGame = () => {
    invalidate();
    setStatus(questions.length ? "playing" : "results");
  };

  const nextQuestion = useCallback((nextAttempted, nextLives) => {
    if (nextLives <= 0 || nextAttempted >= questions.length) {
      enterResults();
      return;
    }
    const nextIndex = currentIndex + 1;
    const nextDuration = nextIndex >= 14 ? 3000 : nextIndex >= 9 ? 3500 : nextIndex >= 4 ? 4000 : INITIAL_TIME;
    setCurrentIndex(nextIndex);
    setTimerDuration(nextDuration);
    setTimeLeft(nextDuration);
    setSelectedOption(null);
    setFeedback("");
  }, [currentIndex, enterResults, questions.length]);

  const handleTimeout = useCallback(() => {
    if (selectedOption !== null || status !== "playing") return;
    const nextAttempted = attempted + 1;
    const nextLives = lives - 1;
    const epoch = invalidate();
    setSelectedOption("timeout");
    setAttempted(nextAttempted);
    setLives(nextLives);
    setCombo(0);
    setFeedback(copy.timeoutStatus);
    setLiveStatus(`${copy.timeoutStatus}. ${copy.score}: ${score}. ${copy.lives}: ${nextLives}/3. ${copy.progress}: ${nextAttempted}/${questions.length}`);
    playSynthSound("wrong");
    schedule(() => nextQuestion(nextAttempted, nextLives), 650, epoch);
  }, [attempted, copy.lives, copy.progress, copy.score, copy.timeoutStatus, invalidate, lives, nextQuestion, questions.length, schedule, score, selectedOption, status]);

  useEffect(() => {
    if (status !== "playing" || selectedOption !== null || paused) return undefined;
    const epoch = capture();
    let previous = performance.now();
    let frameId = 0;
    const tick = (now) => {
      const delta = now - previous;
      previous = now;
      setTimeLeft((value) => {
        const next = Math.max(0, value - delta);
        if (next <= 0) schedule(handleTimeout, 0, epoch);
        else frameId = requestFrame(tick, epoch);
        return next;
      });
    };
    frameId = requestFrame(tick, epoch);
    return () => cancelFrame(frameId);
  }, [cancelFrame, capture, handleTimeout, paused, requestFrame, schedule, selectedOption, status]);

  const handleOption = (option, index) => {
    if (selectedOption !== null || status !== "playing" || paused) return;
    const epoch = invalidate();
    setSelectedOption(index);
    const nextAttempted = attempted + 1;
    setAttempted(nextAttempted);
    let nextLives = lives;

    if (option.isCorrect) {
      const nextCombo = combo + 1;
      const multiplier = nextCombo >= 12 ? 5 : nextCombo >= 8 ? 3 : nextCombo >= 5 ? 2 : nextCombo >= 3 ? 1.5 : 1;
      const timeBonus = timeLeft > timerDuration / 2 ? 1.5 : 1;
      const earned = Math.round(100 * multiplier * timeBonus);
      const nextScore = score + earned;
      setCombo(nextCombo);
      setMaxCombo((value) => Math.max(value, nextCombo));
      setCorrectCount((value) => value + 1);
      setScore(nextScore);
      setFeedback(copy.correctStatus);
      setLiveStatus(`${copy.correctStatus}. ${copy.score}: ${nextScore}. ${copy.lives}: ${nextLives}/3. ${copy.progress}: ${nextAttempted}/${questions.length}`);
      playSynthSound("correct");
      playChineseTTS(questions[currentIndex].hanzi);
    } else {
      nextLives -= 1;
      setLives(nextLives);
      setCombo(0);
      setFeedback(copy.wrongStatus);
      setLiveStatus(`${copy.wrongStatus}. ${copy.score}: ${score}. ${copy.lives}: ${nextLives}/3. ${copy.progress}: ${nextAttempted}/${questions.length}`);
      playSynthSound("wrong");
    }
    schedule(() => nextQuestion(nextAttempted, nextLives), 650, epoch);
  };

  if (status === "intro") return <GameIntro game={{ id: "blitz", ...game }} language={language} onBack={exitGame} onStart={startGame} />;

  if (status === "results") {
    return <GameResults gameId="blitz" correct={correctCount} total={questions.length} lesson={lesson} language={language} gameScore={score} stats={{ maxCombo, rounds: attempted }} onPlayAgain={prepareGame} onBack={exitGame} scoreData={evaluateScore(correctCount, questions.length, lesson.level)} />;
  }

  const currentQuestion = questions[currentIndex];
  if (!currentQuestion) return <GameResults gameId="blitz" correct={correctCount} total={questions.length} lesson={lesson} language={language} gameScore={score} stats={{ maxCombo, rounds: attempted }} onPlayAgain={prepareGame} onBack={exitGame} scoreData={evaluateScore(correctCount, questions.length, lesson.level)} />;

  return (
    <main className="g3-arcade-game">
      <GameHud gameTitle={game.title} language={language} liveStatus={liveStatus} onBack={exitGame} paused={paused}>
        <span>{copy.score}: <strong>{score.toLocaleString()}</strong></span>
        <span>{copy.combo}: <strong>{combo}</strong></span>
        <span>{copy.lives}: <strong>{lives}/3</strong></span>
        <span>{copy.progress}: <strong>{Math.min(attempted + 1, questions.length)}/{questions.length}</strong></span>
      </GameHud>
      <GameTimer duration={timerDuration} language={language} onThreshold={(seconds) => setLiveStatus(`${copy.time}: ${seconds}s`)} resetKey={currentIndex} timeLeft={timeLeft} />
      <GameFeedback message={paused ? copy.paused : feedback} />
      <section className="g3-game-stage" aria-labelledby="g3-blitz-question">
        <h1 className="g3-game-hanzi" id="g3-blitz-question" lang="zh-CN">{currentQuestion.hanzi}</h1>
        <p className="g3-game-pinyin">{currentQuestion.pinyin}</p>
        <div className="g3-game-options" ref={optionsRef}>
          {currentQuestion.options.map((option, index) => (
            <button key={option.text} className={`g3-game-option ${selectedOption !== null && option.isCorrect ? "correct" : selectedOption === index ? "wrong" : ""}`} type="button" disabled={selectedOption !== null || paused} onClick={() => handleOption(option, index)}>{option.text}</button>
          ))}
        </div>
      </section>
    </main>
  );
}
