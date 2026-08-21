import React, { useCallback, useEffect, useRef, useState } from "react";
import { playSynthSound } from "../../../../../shared/features/games/gameSound.js";
import { playChineseTTS, stopChineseVoice } from "../../../services/audio/index.js";
import { buildBlitzQuestions, evaluateScore, GAME_COPY, GAME_PHASES, GameFeedback, GameHud, GameIntro, GameResults, GameTimer, languageCopy, useGameSession, usePausableGameClock, usePausableScheduler } from "../shared/index.js";

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
  const [timerDuration, setTimerDuration] = useState(INITIAL_TIME);
  const [selectedOption, setSelectedOption] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [liveStatus, setLiveStatus] = useState("");
  const optionsRef = useRef(null);
  const answerLockRef = useRef(false);
  const copy = languageCopy(language);
  const game = (GAME_COPY[language] || GAME_COPY.th).games.blitz;
  const { active, complete, exit, isPlaying, paused, phase, prepare, start, toggleManualPause } = useGameSession();
  const { invalidate, schedule } = usePausableScheduler(paused);

  const enterResults = useCallback(() => {
    invalidate();
    complete();
  }, [complete, invalidate]);

  const exitGame = useCallback(() => {
    invalidate();
    exit();
    stopChineseVoice();
    onBack();
  }, [exit, invalidate, onBack]);

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
    setSelectedOption(null);
    answerLockRef.current = false;
    setFeedback("");
    setLiveStatus("");
    prepare();
  }, [invalidate, lesson.vocabulary, prepare]);

  useEffect(() => {
    prepareGame();
    return () => stopChineseVoice();
  }, [prepareGame]);

  useEffect(() => {
    stopChineseVoice();
  }, [currentIndex]);

  useEffect(() => {
    if (phase === GAME_PHASES.PLAYING && selectedOption === null) optionsRef.current?.querySelector("button")?.focus();
  }, [currentIndex, phase, selectedOption]);

  const startGame = () => {
    invalidate();
    const readyQuestions = questions.length ? questions : buildBlitzQuestions(lesson.vocabulary);
    if (!questions.length) setQuestions(readyQuestions);
    prepare();
    start();
    if (!readyQuestions.length) complete();
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
    setSelectedOption(null);
    answerLockRef.current = false;
    setFeedback("");
  }, [currentIndex, enterResults, questions.length]);

  const handleTimeout = useCallback(() => {
    if (answerLockRef.current || selectedOption !== null || paused || !isPlaying()) return;
    answerLockRef.current = true;
    const nextAttempted = attempted + 1;
    const nextLives = lives - 1;
    invalidate();
    setSelectedOption("timeout");
    setAttempted(nextAttempted);
    setLives(nextLives);
    setCombo(0);
    setFeedback(copy.timeoutStatus);
    setLiveStatus(`${copy.timeoutStatus}. ${copy.score}: ${score}. ${copy.lives}: ${nextLives}/3. ${copy.progress}: ${nextAttempted}/${questions.length}`);
    playSynthSound("wrong");
    schedule(() => nextQuestion(nextAttempted, nextLives), 650);
  }, [attempted, copy.lives, copy.progress, copy.score, copy.timeoutStatus, invalidate, isPlaying, lives, nextQuestion, paused, questions.length, schedule, score, selectedOption]);

  const { timeLeft } = usePausableGameClock({
    active: active && selectedOption === null,
    duration: timerDuration,
    onExpire: handleTimeout,
    paused,
    resetKey: currentIndex,
  });

  const handleOption = (option, index) => {
    if (answerLockRef.current || selectedOption !== null || !isPlaying() || paused) return;
    answerLockRef.current = true;
    invalidate();
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
    schedule(() => nextQuestion(nextAttempted, nextLives), 650);
  };

  if (phase === GAME_PHASES.IDLE || phase === GAME_PHASES.READY) return <GameIntro game={{ id: "blitz", ...game }} language={language} onBack={exitGame} onStart={startGame} />;

  if (phase === GAME_PHASES.COMPLETED) {
    return <GameResults gameId="blitz" correct={correctCount} total={questions.length} lesson={lesson} language={language} gameScore={score} stats={{ maxCombo, rounds: attempted }} onPlayAgain={prepareGame} onBack={exitGame} scoreData={evaluateScore(correctCount, questions.length, lesson.level)} />;
  }

  const currentQuestion = questions[currentIndex];
  if (!currentQuestion) return <GameResults gameId="blitz" correct={correctCount} total={questions.length} lesson={lesson} language={language} gameScore={score} stats={{ maxCombo, rounds: attempted }} onPlayAgain={prepareGame} onBack={exitGame} scoreData={evaluateScore(correctCount, questions.length, lesson.level)} />;

  return (
    <main className="g3-arcade-game">
      <GameHud gameTitle={game.title} language={language} liveStatus={liveStatus} onBack={exitGame} onPauseToggle={toggleManualPause} paused={paused}>
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
