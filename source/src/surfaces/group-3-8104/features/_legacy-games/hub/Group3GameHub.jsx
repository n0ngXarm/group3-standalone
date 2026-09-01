import React, { useEffect, useMemo, useRef } from "react";
import "../../../styles/games.css";
import { group3AssetPath } from "../../../config.js";
import {
  GAME_COPY,
  GAME_DEFINITIONS,
  languageCopy,
  lessonTitle,
  loadHighScores,
} from "../shared/index.js";
import VocabBlitzGame from "../vocab-blitz/index.js";
import CardFrenzyGame from "../card-frenzy/index.js";
import SoundSprintGame from "../sound-sprint/index.js";
import PinyinDashGame from "../pinyin-dash/index.js";

const GAME_COMPONENTS = Object.freeze({
  "vocab-blitz": VocabBlitzGame,
  "card-frenzy": CardFrenzyGame,
  "sound-sprint": SoundSprintGame,
  "pinyin-dash": PinyinDashGame,
});


export default function Group3GameHub({ activeGame = null, lesson, language, onBack, onSelectGame, onShowHub }) {
  const returnFocusRef = useRef(null);
  const restoreTimerRef = useRef(null);
  const previousGameRef = useRef(activeGame);
  const copy = languageCopy(language);

  useEffect(() => () => window.clearTimeout(restoreTimerRef.current), []);

  useEffect(() => {
    const previousGame = previousGameRef.current;
    previousGameRef.current = activeGame;
    if (!previousGame || activeGame) return undefined;
    restoreTimerRef.current = window.setTimeout(() => {
      returnFocusRef.current?.querySelector(`[data-game-id="${previousGame}"]`)?.focus();
    }, 0);
    return () => window.clearTimeout(restoreTimerRef.current);
  }, [activeGame]);

  const scoreScope = (game) => ({ game, lessonId: lesson.id || lesson.slug, level: lesson.level });
  const games = useMemo(() => GAME_DEFINITIONS.map((definition) => {
    const localized = (GAME_COPY[language] || GAME_COPY.th).games[definition.id];
    const topScore = loadHighScores(scoreScope(definition.id))[0] || null;
    const assetBase = `/assets/group3/games/${definition.asset}/cover`;
    return {
      ...definition,
      ...localized,
      image: group3AssetPath(`${assetBase}-960w.webp`),
      imageSrcSet: `${group3AssetPath(`${assetBase}-640w.webp`)} 640w, ${group3AssetPath(`${assetBase}-960w.webp`)} 960w`,
      topScore,
    };
  }), [activeGame, language, lesson.id, lesson.level, lesson.slug]);

  if (activeGame && GAME_COMPONENTS[activeGame]) {
    const ActiveGame = GAME_COMPONENTS[activeGame];
    return <ActiveGame lesson={lesson} language={language} onBack={onShowHub} />;
  }

  return (
    <main className="g3-arcade-hub" ref={returnFocusRef}>
      <header className="g3-arcade-header">
        <p className="g3-game-kicker">{lesson.level?.toUpperCase()} · {lesson.number}</p>
        <h1>{copy.arcadeTitle}</h1>
        <p className="g3-arcade-lesson-title">
          {language === "zh" ? lessonTitle(lesson, language) : <><span lang="zh-CN">{lesson.title?.zh}</span> · {lessonTitle(lesson, language)}</>}
        </p>
        <p className="g3-arcade-intro">{copy.arcadeIntro}</p>
        <div className="g3-arcade-header-actions" style={{ display: "flex", gap: "0.75rem", justifyContent: "center", alignItems: "center", flexWrap: "wrap" }}>
          <button className="g3-game-secondary" type="button" onClick={onBack}>{copy.backLesson}</button>
        </div>
      </header>

      <div className="g3-arcade-grid" aria-label={copy.arcadeTitle}>
        {games.map((game) => (
          <button
            key={game.id}
            className="g3-arcade-card"
            data-game-id={game.slug}
            type="button"
            onClick={() => onSelectGame(game.slug)}
            aria-label={`${game.title}: ${game.desc}`}
          >
            <img
              className="g3-arcade-card-image"
              src={game.image}
              srcSet={game.imageSrcSet}
              sizes="(max-width: 700px) calc(100vw - 32px), 420px"
              width="960"
              height="540"
              loading="lazy"
              decoding="async"
              alt=""
            />
            <span className="g3-arcade-card-content">
              <span className="g3-arcade-card-glyph" aria-hidden="true">{game.icon}</span>
              <span className="g3-arcade-card-title">{game.title}</span>
              <span className="g3-arcade-card-desc">{game.desc}</span>
              <span className="g3-arcade-card-score">
                <span>{copy.bestScore}</span>
                <span>{game.topScore ? `${game.topScore.score.toLocaleString()} · ${"★".repeat(game.topScore.stars)}${"☆".repeat(3 - game.topScore.stars)}` : copy.noScore}</span>
              </span>
              <span className="g3-arcade-card-cta">{copy.play}<span aria-hidden="true"> →</span></span>
            </span>
          </button>
        ))}
      </div>
    </main>
  );
}
