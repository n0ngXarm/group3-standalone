import React, { useEffect, useMemo, useRef, useState } from "react";
import { playSynthSound } from "../../../../../shared/features/games/gameSound.js";
import {
  createGameRunId,
  GAME_COPY,
  languageCopy,
  loadHighScores,
  loadPlayerName,
  rankHighScores,
  saveHighScore,
} from "./gameData.js";

export default function GameResults({
  gameId,
  lesson,
  language,
  gameScore,
  stats,
  onPlayAgain,
  onBack,
  scoreData,
}) {
  const copy = languageCopy(language);
  const game = (GAME_COPY[language] || GAME_COPY.th).games[gameId];
  const headingRef = useRef(null);
  const savedRef = useRef(false);
  const runIdRef = useRef(createGameRunId(gameId));
  const scoreScope = useMemo(() => ({ game: gameId, lessonId: lesson.id || lesson.slug, level: lesson.level }), [gameId, lesson.id, lesson.level, lesson.slug]);
  const currentEntry = useMemo(() => ({
    runId: runIdRef.current,
    name: loadPlayerName(copy.guest),
    score: Math.max(0, Math.floor(Number(gameScore) || 0)),
    stars: scoreData.stars,
    accuracy: scoreData.accuracy,
    date: new Date().toISOString(),
  }), [copy.guest, gameScore, scoreData.accuracy, scoreData.stars]);
  const [topScores, setTopScores] = useState(() => rankHighScores([...loadHighScores(scoreScope), currentEntry]));

  useEffect(() => {
    headingRef.current?.focus();
    if (!savedRef.current) {
      savedRef.current = true;
      setTopScores(saveHighScore(scoreScope, currentEntry));
      playSynthSound("victory");
    }
  }, [currentEntry, scoreScope]);

  const gradeText = language === "zh" ? scoreData.thaiGrade.zh : language === "en" ? scoreData.thaiGrade.en : scoreData.thaiGrade.th;
  const bandText = language === "zh" ? scoreData.hskBand.zh : language === "en" ? scoreData.hskBand.en : scoreData.hskBand.th;

  return (
    <main className="g3-results" aria-labelledby="g3-results-title">
      <header className="g3-results-header">
        <p className="g3-game-kicker">{game.title}</p>
        <h1 id="g3-results-title" ref={headingRef} tabIndex="-1">{copy.resultTitle}</h1>
        <div className="g3-results-stars" aria-label={`${scoreData.stars} / 3`}>{"★".repeat(scoreData.stars)}{"☆".repeat(3 - scoreData.stars)}</div>
        <div className="g3-results-accuracy">{scoreData.accuracy}%</div>
        <p className="g3-results-note">{copy.practiceNote}</p>
      </header>

      <div className="g3-results-details">
        <dl className="g3-results-grades">
          <div className="g3-grade-row"><dt>{copy.grade}</dt><dd>{scoreData.thaiGrade.grade} · {gradeText}</dd></div>
          <div className="g3-grade-row"><dt>{copy.accuracy}</dt><dd>{bandText}</dd></div>
          <div className="g3-grade-row"><dt>{copy.cefrReference}</dt><dd>{scoreData.hskRef.level} · {scoreData.cefr}</dd></div>
          <div className="g3-grade-row"><dt>{copy.hskPractice}</dt><dd>{scoreData.hskRef.simulatedScore}/{scoreData.hskRef.maxScore}</dd></div>
        </dl>

        <dl className="g3-results-stats">
          <div className="g3-stat-box"><dt>{copy.totalScore}</dt><dd>{currentEntry.score.toLocaleString()}</dd></div>
          <div className="g3-stat-box"><dt>{copy.correct}</dt><dd>{scoreData.correct}/{scoreData.total}</dd></div>
          {stats.maxCombo !== undefined && <div className="g3-stat-box"><dt>{copy.maxCombo}</dt><dd>{stats.maxCombo}</dd></div>}
          {stats.rounds !== undefined && <div className="g3-stat-box"><dt>{copy.rounds}</dt><dd>{stats.rounds}</dd></div>}
        </dl>

        <section className="g3-leaderboard" aria-labelledby="g3-leaderboard-title">
          <h2 id="g3-leaderboard-title">{copy.leaderboard}</h2>
          {topScores.length ? (
            <ol className="g3-leaderboard-list">
              {topScores.map((entry) => (
                <li key={entry.runId} className={entry.runId === currentEntry.runId ? "is-current" : ""}>
                  <span className="g3-leaderboard-name">{entry.name}</span>
                  <span className="g3-leaderboard-score">{entry.score.toLocaleString()}</span>
                  <span className="g3-leaderboard-stars" aria-label={`${entry.stars} / 3`}>{"★".repeat(entry.stars)}{"☆".repeat(3 - entry.stars)}</span>
                </li>
              ))}
            </ol>
          ) : <p>{copy.emptyLeaderboard}</p>}
        </section>
      </div>

      <div className="g3-results-actions">
        <button className="g3-game-primary" type="button" onClick={onPlayAgain}>{copy.playAgain}</button>
        <button className="g3-game-secondary" type="button" onClick={onBack}>{copy.backHub}</button>
      </div>
    </main>
  );
}
