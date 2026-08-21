import React, { useCallback, useEffect, useRef, useState } from "react";
import { playSynthSound } from "../../../../../shared/features/games/gameSound.js";
import { playChineseTTS, stopChineseVoice } from "../../../services/audio/index.js";
import { buildPinyinQuestions, evaluateScore, GAME_COPY, GAME_PHASES, GameFeedback, GameHud, GameIntro, GameResults, GameTimer, languageCopy, useGameSession, usePausableGameClock, usePausableScheduler } from "../shared/index.js";

const DASH_TIME = 60000;
const TURBO_COMBO = 5;

export default function PinyinDashGame({ lesson, language, onBack }) {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [lives, setLives] = useState(3);
  const [correctCount, setCorrectCount] = useState(0);
  const [attempted, setAttempted] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [liveStatus, setLiveStatus] = useState("");
  const optionsRef = useRef(null);
  const answerLockRef = useRef(false);
  const copy = languageCopy(language);
  const game = (GAME_COPY[language] || GAME_COPY.th).games.dash;
  const isTurbo = combo >= TURBO_COMBO;
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
    setQuestions(buildPinyinQuestions(lesson.vocabulary));
    setCurrentIndex(0);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setLives(3);
    setCorrectCount(0);
    setAttempted(0);
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
    const readyQuestions = questions.length ? questions : buildPinyinQuestions(lesson.vocabulary);
    if (!questions.length) setQuestions(readyQuestions);
    prepare();
    start();
    if (!readyQuestions.length) complete();
  };

  const { timeLeft } = usePausableGameClock({
    active,
    duration: DASH_TIME,
    onExpire: enterResults,
    paused,
    rate: isTurbo ? 0.55 : 1,
    resetKey: questions,
  });

  const nextQuestion = useCallback((nextAttempted, nextLives) => {
    if (nextLives <= 0 || nextAttempted >= questions.length) {
      enterResults();
      return;
    }
    setCurrentIndex((value) => value + 1);
    setSelectedOption(null);
    answerLockRef.current = false;
    setFeedback("");
  }, [enterResults, questions.length]);

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
      const turboActivated = nextCombo === TURBO_COMBO;
      const earned = nextCombo >= TURBO_COMBO ? 300 : nextCombo >= 3 ? 200 : 100;
      const nextScore = score + earned;
      setCombo(nextCombo);
      setMaxCombo((value) => Math.max(value, nextCombo));
      setCorrectCount((value) => value + 1);
      setScore(nextScore);
      setFeedback(turboActivated ? `${copy.correctStatus} · ${copy.turbo}` : copy.correctStatus);
      setLiveStatus(`${turboActivated ? `${copy.correctStatus} · ${copy.turbo}` : copy.correctStatus}. ${copy.score}: ${nextScore}. ${copy.lives}: ${nextLives}/3. ${copy.progress}: ${nextAttempted}/${questions.length}`);
      playSynthSound(turboActivated ? "victory" : "correct");
      playChineseTTS(questions[currentIndex].hanzi);
    } else {
      nextLives -= 1;
      setLives(nextLives);
      setCombo(0);
      setFeedback(copy.wrongStatus);
      setLiveStatus(`${copy.wrongStatus}. ${copy.score}: ${score}. ${copy.lives}: ${nextLives}/3. ${copy.progress}: ${nextAttempted}/${questions.length}`);
      playSynthSound("wrong");
    }
    schedule(() => nextQuestion(nextAttempted, nextLives), 600);
  };

  if (phase === GAME_PHASES.IDLE || phase === GAME_PHASES.READY) return <GameIntro game={{ id: "dash", ...game }} language={language} onBack={exitGame} onStart={startGame} />;

  if (phase === GAME_PHASES.COMPLETED) {
    return <GameResults gameId="dash" correct={correctCount} total={questions.length} lesson={lesson} language={language} gameScore={score} stats={{ maxCombo, rounds: attempted }} onPlayAgain={prepareGame} onBack={exitGame} scoreData={evaluateScore(correctCount, questions.length, lesson.level)} />;
  }

  const question = questions[currentIndex];
  if (!question) return <GameResults gameId="dash" correct={correctCount} total={questions.length} lesson={lesson} language={language} gameScore={score} stats={{ maxCombo, rounds: attempted }} onPlayAgain={prepareGame} onBack={exitGame} scoreData={evaluateScore(correctCount, questions.length, lesson.level)} />;

  return (
    <main className={`g3-arcade-game ${isTurbo ? "g3-turbo-mode" : ""}`}>
      <GameHud gameTitle={game.title} language={language} liveStatus={liveStatus} onBack={exitGame} onPauseToggle={toggleManualPause} paused={paused}>
        <span>{copy.score}: <strong>{score.toLocaleString()}</strong></span>
        <span>{isTurbo ? copy.turbo : copy.combo}: <strong>{isTurbo ? "⚡" : combo}</strong></span>
        <span>{copy.lives}: <strong>{lives}/3</strong></span>
        <span>{copy.progress}: <strong>{Math.min(attempted + 1, questions.length)}/{questions.length}</strong></span>
      </GameHud>
      <GameTimer duration={DASH_TIME} language={language} onThreshold={(seconds) => setLiveStatus(`${copy.time}: ${seconds}s`)} timeLeft={timeLeft} warningAt={0.2} />
      <GameFeedback message={paused ? copy.paused : feedback} />
      <section className="g3-game-stage" aria-labelledby="g3-dash-question">
        <div className="g3-game-question">
          <h1 className="g3-game-hanzi" id="g3-dash-question" lang="zh-CN">{question.hanzi}</h1>
          <p className="g3-game-meaning">{question.th}</p>
        </div>
        <div className="g3-game-options g3-pinyin-options" ref={optionsRef}>
          {question.options.map((option, index) => (
            <button key={option.text} className={`g3-game-option ${selectedOption !== null && option.isCorrect ? "correct" : selectedOption === index ? "wrong" : ""}`} type="button" disabled={selectedOption !== null || paused} onClick={() => handleOption(option, index)}>{option.text}</button>
          ))}
        </div>
      </section>
    </main>
  );
}
