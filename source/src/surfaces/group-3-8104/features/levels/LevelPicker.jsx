import { useEffect, useRef, useState } from "react";

import Icon from "../../../../shared/components/ui/Icon.jsx";
import {
  expandIcon,
  fileImageIcon,
  waveSquareIcon,
  xmarkIcon,
} from "../../../../shared/components/ui/iconPaths.js";
import { group3AssetPath } from "../../config.js";
import { COPY } from "../../content/copy.js";
import { FEATURED_LESSON, GROUP3_LESSONS } from "../../content/registry.js";
import { GROUP3_VOICE_PROFILES } from "../../services/audio/index.js";
import { levelPath, levelsPath, lessonScenePath, practicePath, scenePath } from "../../routing/routes.js";
import { startLearnerSession } from "../../shared/session.js";

function sceneTitle(scene, language) {
  return { th: scene.titleTh, zh: scene.title, en: scene.titleEn || scene.title }[language];
}

function sceneSupportingTitle(scene, language, text) {
  return { th: scene.title, zh: scene.titleTh, en: scene.title }[language];
}

function sceneContext(scene, language) {
  return { th: scene.contextTh, zh: scene.context, en: scene.contextEn || scene.context }[language];
}

function sceneSupportingContext(scene, language, text) {
  return { th: scene.context, zh: scene.contextTh, en: scene.context }[language];
}

function profileName(profile, language) {
  return { th: profile.nameTh, zh: profile.hanzi, en: profile.nameEn || profile.pinyin }[language];
}

function profileWithSceneMedia(profile, character) {
  return character?.image ? { ...profile, image: character.image, imageSrcSet: character.imageSrcSet } : profile;
}

import { HomeCarousel } from "../home/HomeCarousel.jsx";


export function LevelPicker({ language, navigate }) {
  const [activeCard, setActiveCard] = useState("hsk1");
  const text = COPY[language];
  const presentation = {
    th: {
      recommendation: "★ แนะนำสำหรับผู้เริ่มต้น",
      situationLabel: "สถานการณ์",
      difficultyLabel: "ความยาก",
      levels: {
        hsk1: { vocabulary: "150+ คำ", situation: "ง่ายมาก", difficulty: "★☆☆☆☆" },
        hsk2: { vocabulary: "300+ คำ", situation: "ทั่วไป", difficulty: "★★☆☆☆" },
        hsk3: { vocabulary: "600+ คำ", situation: "หลากหลาย", difficulty: "★★★☆☆" },
      },
    },
    zh: {
      recommendation: "★ 推荐给初学者",
      situationLabel: "场景",
      difficultyLabel: "难度",
      levels: {
        hsk1: { vocabulary: "150+ 词", situation: "基础", difficulty: "★☆☆☆☆" },
        hsk2: { vocabulary: "300+ 词", situation: "日常", difficulty: "★★☆☆☆" },
        hsk3: { vocabulary: "600+ 词", situation: "多样", difficulty: "★★★☆☆" },
      },
    },
    en: {
      recommendation: "★ Recommended for beginners",
      situationLabel: "Situations",
      difficultyLabel: "Difficulty",
      levels: {
        hsk1: { vocabulary: "150+ words", situation: "Essential", difficulty: "★☆☆☆☆" },
        hsk2: { vocabulary: "300+ words", situation: "Everyday", difficulty: "★★☆☆☆" },
        hsk3: { vocabulary: "600+ words", situation: "Varied", difficulty: "★★★☆☆" },
      },
    },
  }[language];
  const levels = [
    { 
      id: "hsk1", 
      number: "01", 
      code: "HSK1", 
      title: text.hsk1Title, 
      body: text.hsk1Body, 
      bgImg: group3AssetPath("/assets/group3/shared/characters/visual-novel-backgrounds/scene-01-market-tea-1200w.webp"),
      charIdle: group3AssetPath("/assets/group3/shared/characters/visual-novel-characters-idle/02-david-idle-480w.webp"),
      charTalk: group3AssetPath("/assets/group3/shared/characters/visual-novel-character-poses-talk/02-david-talk-480w.webp"),
      accent: "#ef5845"
    },
    { 
      id: "hsk2", 
      number: "02", 
      code: "HSK2", 
      title: text.hsk2Title, 
      body: text.hsk2Body, 
      bgImg: group3AssetPath("/assets/group3/shared/characters/visual-novel-backgrounds/scene-03-chinese-restaurant-1200w.webp"),
      charIdle: group3AssetPath("/assets/group3/shared/characters/visual-novel-characters-idle/06-liu-ming-idle-480w.webp"),
      charTalk: group3AssetPath("/assets/group3/shared/characters/visual-novel-character-poses-talk/06-liu-ming-talk-480w.webp"),
      accent: "#64a85c"
    },
    { 
      id: "hsk3", 
      number: "03", 
      code: "HSK3", 
      title: text.hsk3Title, 
      body: text.hsk3Body, 
      bgImg: group3AssetPath("/assets/group3/shared/characters/visual-novel-backgrounds/scene-04-high-speed-rail-station-1200w.webp"),
      charIdle: group3AssetPath("/assets/group3/shared/characters/visual-novel-characters-idle/08-wang-yixue-idle-480w.webp"),
      charTalk: group3AssetPath("/assets/group3/shared/characters/visual-novel-character-poses-talk/08-wang-yixue-talk-480w.webp"),
      accent: "#4f8fd5"
    },
  ];

  const startLevel = (levelId) => navigate(levelPath(levelId));
  const openPractice = (levelId) => navigate(practicePath(levelId));

  return (
    <main className="g3-level-selection g3-no-scroll" aria-labelledby="g3-level-selection-title">
      <div className="g3-level-selection-inner">
        <header className="g3-level-selection-header">
          <p className="g3-kicker">{text.shelfKicker}</p>
          <h1 id="g3-level-selection-title">{text.shelfTitle}</h1>
          <p className="g3-subtitle">{text.levelPickerBody}</p>
        </header>
        
        {/* Mobile Selector */}
        <nav className="g3-level-mobile-tabs" aria-label="Level Selector">
          {levels.map((level) => (
            <button 
              key={`tab-${level.id}`}
              type="button"
              className={activeCard === level.id ? "is-active" : ""}
              onClick={() => setActiveCard(level.id)}
              aria-current={activeCard === level.id ? "true" : undefined}
            >
              {level.code}
            </button>
          ))}
        </nav>

        <div className={`g3-level-selection-grid is-active-${activeCard}`} role="list" aria-label={text.shelfTitle}>
          {levels.map((level) => {
            const isActive = activeCard === level.id;
            return (
              <article 
                key={level.id}
                className={`g3-level-card ${isActive ? "is-active" : "is-compact"}`}
                role="listitem"
                onMouseEnter={() => setActiveCard(level.id)}
                onFocus={() => setActiveCard(level.id)}
                tabIndex="-1"
                style={{ "--accent": level.accent }}
              >
                <img className="g3-level-card-background" src={level.bgImg} alt="" role="presentation" decoding="async" />
                <div className="g3-level-card-scrim"></div>
                
                <div className="g3-level-card-character-layer">
                  <img className="g3-actor-idle" src={level.charIdle} alt="" role="presentation" decoding="async" />
                  <img className="g3-actor-talk" src={level.charTalk} alt="" role="presentation" decoding="async" />
                </div>
                
                <div className="g3-level-card-content">
                  {level.id === "hsk1" && <div className="g3-level-card-badge">{presentation.recommendation}</div>}
                  
                  <div className="g3-level-card-head">
                    <div className="g3-level-card-num">{level.number}</div>
                    <div className="g3-level-card-code">{level.code}</div>
                  </div>
                  
                  <h2 className="g3-level-card-title">{level.title}</h2>
                  
                  <div className="g3-level-card-details">
                    <p className="g3-level-card-desc">{level.body}</p>
                    <div className="g3-level-card-meta">
                      <span>{text.vocabularyLabel}<b>{presentation.levels[level.id].vocabulary}</b></span>
                      <span>{presentation.situationLabel}<b>{presentation.levels[level.id].situation}</b></span>
                      <span>{presentation.difficultyLabel}<b>{presentation.levels[level.id].difficulty}</b></span>
                    </div>
                  </div>
                  
                  <div className="g3-level-card-actions">
                    <button type="button" className="g3-primary-action" onClick={() => startLevel(level.id)} tabIndex={isActive ? 0 : -1}>
                      {text.lessonEntry}<span aria-hidden="true">→</span>
                    </button>
                    <button type="button" className="g3-secondary-action" onClick={() => openPractice(level.id)} tabIndex={isActive ? 0 : -1}>
                      {text.exerciseEntry}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </main>
  );
}
