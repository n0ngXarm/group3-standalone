import React, { useCallback, useEffect, useRef, useState } from "react";
import { playSynthSound } from "../../../../../shared/features/games/gameSound.js";
import { playChineseTTS, stopChineseVoice } from "../../../services/audio/index.js";
import { buildPinyinQuestions, evaluateScore, GAME_COPY, GameFeedback, GameHud, GameIntro, GameResults, GameTimer, languageCopy, useGameLifecycle, useGameVisibilityPause } from "../shared/index.js";

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
  const [status, setStatus] = useState("intro");
  const [timeLeft, setTimeLeft] = useState(DASH_TIME);
  const [selectedOption, setSelectedOption] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [liveStatus, setLiveStatus] = useState("");
  const optionsRef = useRef(null);
  const copy = languageCopy(language);
  const game = (GAME_COPY[language] || GAME_COPY.th).games.dash;
  const paused = useGameVisibilityPause(status === "playing");
  const isTurbo = combo >= TURBO_COMBO;
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
    setQuestions(buildPinyinQuestions(lesson.vocabulary));
    setCurrentIndex(0);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setLives(3);
    setCorrectCount(0);
    setAttempted(0);
    setTimeLeft(DASH_TIME);
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
        const next = Math.max(0, value - delta * (isTurbo ? 0.55 : 1));
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
  }, [cancelFrame, capture, enterResults, isTurbo, paused, requestFrame, schedule, status]);

  const nextQuestion = useCallback((nextAttempted, nextLives) => {
    if (nextLives <= 0 || nextAttempted >= questions.length) {
      enterResults();
      return;
    }
    setCurrentIndex((value) => value + 1);
    setSelectedOption(null);
    setFeedback("");
  }, [enterResults, questions.length]);

  const handleOption = (option, index) => {
    if (selectedOption !== null || status !== "playing" || paused) return;
    const epoch = invalidate();
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
    schedule(() => nextQuestion(nextAttempted, nextLives), 600, epoch);
  };

  if (status === "intro") return <GameIntro game={{ id: "dash", ...game }} language={language} onBack={exitGame} onStart={startGame} />;

  if (status === "results") {
    return <GameResults gameId="dash" correct={correctCount} total={questions.length} lesson={lesson} language={language} gameScore={score} stats={{ maxCombo, rounds: attempted }} onPlayAgain={prepareGame} onBack={exitGame} scoreData={evaluateScore(correctCount, questions.length, lesson.level)} />;
  }

  const question = questions[currentIndex];
  if (!question) return <GameResults gameId="dash" correct={correctCount} total={questions.length} lesson={lesson} language={language} gameScore={score} stats={{ maxCombo, rounds: attempted }} onPlayAgain={prepareGame} onBack={exitGame} scoreData={evaluateScore(correctCount, questions.length, lesson.level)} />;

  return (
    <main className={`g3-arcade-game ${isTurbo ? "g3-turbo-mode" : ""}`}>
      <GameHud gameTitle={game.title} language={language} liveStatus={liveStatus} onBack={exitGame} paused={paused}>
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
