import React, { useCallback, useEffect, useRef, useState } from "react";
import { playSynthSound } from "../../../../../shared/features/games/gameSound.js";
import { playChineseTTS, stopChineseVoice } from "../../../services/audio/index.js";
import { buildMatchCards, evaluateScore, GAME_COPY, GameFeedback, GameHud, GameIntro, GameResults, languageCopy, useGameLifecycle, useGameVisibilityPause } from "../shared/index.js";

export default function CardFrenzyGame({ lesson, language, onBack }) {
  const [cards, setCards] = useState([]);
  const [selection, setSelection] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [moves, setMoves] = useState(0);
  const [status, setStatus] = useState("intro");
  const [feedback, setFeedback] = useState("");
  const [liveStatus, setLiveStatus] = useState("");
  const gridRef = useRef(null);
  const copy = languageCopy(language);
  const game = (GAME_COPY[language] || GAME_COPY.th).games.frenzy;
  const paused = useGameVisibilityPause(status === "playing");
  const pairCount = cards.length / 2;
  const completed = new Set(matchedPairs);
  const { cancelTimer, capture, invalidate, schedule } = useGameLifecycle();

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
    setCards(buildMatchCards(lesson.vocabulary, 6));
    setSelection([]);
    setMatchedPairs([]);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setMoves(0);
    setFeedback("");
    setLiveStatus("");
    setStatus("intro");
  }, [invalidate, lesson.vocabulary]);

  useEffect(() => {
    prepareGame();
    return () => stopChineseVoice();
  }, [prepareGame]);

  useEffect(() => {
    if (status === "playing") gridRef.current?.querySelector("button:not(:disabled)")?.focus();
  }, [status]);

  const startGame = () => {
    invalidate();
    setStatus(cards.length ? "playing" : "results");
  };

  useEffect(() => {
    if (status !== "playing" || paused || selection.length !== 2) return undefined;
    const [firstId, secondId] = selection;
    const first = cards.find((card) => card.id === firstId);
    const second = cards.find((card) => card.id === secondId);
    if (!first || !second) {
      setSelection([]);
      return undefined;
    }
    const matched = first.matchId === second.matchId;
    const epoch = capture();
    const timerId = schedule(() => {
      if (matched) {
        const nextCombo = combo + 1;
        const multiplier = nextCombo >= 5 ? 3 : nextCombo >= 3 ? 2 : nextCombo >= 2 ? 1.5 : 1;
        const nextPairs = [...matchedPairs, first.matchId];
        const nextScore = score + Math.round(200 * multiplier);
        setMatchedPairs(nextPairs);
        setCombo(nextCombo);
        setMaxCombo((value) => Math.max(value, nextCombo));
        setScore(nextScore);
        setFeedback(copy.correctStatus);
        setLiveStatus(`${copy.correctStatus}. ${copy.score}: ${nextScore}. ${copy.progress}: ${nextPairs.length}/${pairCount}. ${copy.moves}: ${moves}`);
        playSynthSound("correct");
        const chineseCard = first.type === "zh" ? first : second;
        playChineseTTS(chineseCard.content);
        setSelection([]);
        if (nextPairs.length >= pairCount) {
          playSynthSound("victory");
          enterResults();
        }
      } else {
        const nextScore = Math.max(0, score - 20);
        setCombo(0);
        setScore(nextScore);
        setFeedback(copy.wrongStatus);
        setLiveStatus(`${copy.wrongStatus}. ${copy.score}: ${nextScore}. ${copy.progress}: ${matchedPairs.length}/${pairCount}. ${copy.moves}: ${moves}`);
        setSelection([]);
        playSynthSound("wrong");
      }
    }, matched ? 500 : 850, epoch);
    return () => cancelTimer(timerId);
  }, [cancelTimer, capture, cards, combo, copy.correctStatus, copy.moves, copy.progress, copy.score, copy.wrongStatus, enterResults, matchedPairs, moves, pairCount, paused, schedule, score, selection, status]);

  const chooseCard = (card) => {
    if (status !== "playing" || paused || selection.length >= 2 || selection.includes(card.id) || matchedPairs.includes(card.matchId)) return;
    playSynthSound("pop");
    setFeedback("");
    if (selection.length === 1) setMoves((value) => value + 1);
    setSelection((current) => [...current, card.id]);
  };

  if (status === "intro") return <GameIntro game={{ id: "frenzy", ...game }} language={language} onBack={exitGame} onStart={startGame} />;

  if (status === "results") {
    const safeMoves = Math.max(pairCount, moves);
    return <GameResults gameId="frenzy" correct={pairCount} total={safeMoves} lesson={lesson} language={language} gameScore={score} stats={{ maxCombo, rounds: moves }} onPlayAgain={prepareGame} onBack={exitGame} scoreData={evaluateScore(pairCount, safeMoves, lesson.level)} />;
  }

  return (
    <main className="g3-arcade-game">
      <GameHud gameTitle={game.title} language={language} liveStatus={liveStatus} onBack={exitGame} paused={paused}>
        <span>{copy.score}: <strong>{score.toLocaleString()}</strong></span>
        <span>{copy.combo}: <strong>{combo}</strong></span>
        <span>{copy.moves}: <strong>{moves}</strong></span>
        <span>{copy.progress}: <strong>{matchedPairs.length}/{pairCount}</strong></span>
      </GameHud>
      <GameFeedback message={paused ? copy.paused : feedback} />
      <section className="g3-match-grid" ref={gridRef} aria-label={`${copy.progress} ${matchedPairs.length}/${pairCount}`}>
        {cards.map((card) => {
          const isFlipped = selection.includes(card.id) || completed.has(card.matchId);
          const isMatched = completed.has(card.matchId);
          return (
            <button
              key={card.id}
              className={`g3-match-card ${isFlipped ? "flipped" : ""} ${isMatched ? "matched" : ""}`}
              type="button"
              onClick={() => chooseCard(card)}
              disabled={paused || selection.length >= 2 || isMatched}
              aria-pressed={isFlipped}
              aria-label={isFlipped ? `${card.content}${card.pinyin ? `, ${card.pinyin}` : ""}` : `${copy.play} ${card.id}`}
            >
              <span className="g3-match-card-front" aria-hidden="true"><span>华韵</span></span>
              <span className={`g3-match-card-back type-${card.type}`} aria-hidden={!isFlipped}>
                <span>{card.content}{card.type === "zh" && <small>{card.pinyin}</small>}</span>
              </span>
            </button>
          );
        })}
      </section>
    </main>
  );
}
