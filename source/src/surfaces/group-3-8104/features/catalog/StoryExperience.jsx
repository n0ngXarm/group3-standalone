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
import { levelPath, lessonPath, scenePath } from "../../routing/routes.js";
import { SourceStamp } from "../../shared/components/index.js";

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

import { HomeCarousel } from "./HomeCarousel.jsx";

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
      bgImg: group3AssetPath("/assets/group3/shared/characters/visual-novel-backgrounds/scene-01-market-tea.png"),
      charIdle: group3AssetPath("/assets/group3/shared/characters/visual-novel-characters-idle/02-david-idle.png"),
      charTalk: group3AssetPath("/assets/group3/shared/characters/visual-novel-character-poses-talk/02-david-talk.png"),
      accent: "#ef5845"
    },
    { 
      id: "hsk2", 
      number: "02", 
      code: "HSK2", 
      title: text.hsk2Title, 
      body: text.hsk2Body, 
      bgImg: group3AssetPath("/assets/group3/shared/characters/visual-novel-backgrounds/scene-03-chinese-restaurant.png"),
      charIdle: group3AssetPath("/assets/group3/shared/characters/visual-novel-characters-idle/06-liu-ming-idle.png"),
      charTalk: group3AssetPath("/assets/group3/shared/characters/visual-novel-character-poses-talk/06-liu-ming-talk.png"),
      accent: "#64a85c"
    },
    { 
      id: "hsk3", 
      number: "03", 
      code: "HSK3", 
      title: text.hsk3Title, 
      body: text.hsk3Body, 
      bgImg: group3AssetPath("/assets/group3/shared/characters/visual-novel-backgrounds/scene-04-high-speed-rail-station.png"),
      charIdle: group3AssetPath("/assets/group3/shared/characters/visual-novel-characters-idle/08-wang-yixue-idle.png"),
      charTalk: group3AssetPath("/assets/group3/shared/characters/visual-novel-character-poses-talk/08-wang-yixue-talk.png"),
      accent: "#4f8fd5"
    },
  ];

  const startLevel = (levelId) => navigate(levelPath(levelId));
  const previewLevel = (levelId) => {
    const firstLesson = GROUP3_LESSONS
      .filter((item) => item.level === levelId)
      .sort((first, second) => Number(first.number) - Number(second.number))[0];
    navigate(firstLesson ? lessonPath(firstLesson, "overview") : levelPath(levelId));
  };

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
                      {text.startLearning}<span aria-hidden="true">→</span>
                    </button>
                    <button type="button" className="g3-secondary-action" onClick={() => previewLevel(level.id)} tabIndex={isActive ? 0 : -1}>
                      {text.previewContent}
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

export function StoryHome({ language, navigate, lowData = false }) {
  const [activeScenario, setActiveScenario] = useState(0);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [learnerName, setLearnerName] = useState("");
  const [registerError, setRegisterError] = useState(false);
  const nameInputRef = useRef(null);
  const text = COPY[language];
  const featured = FEATURED_LESSON;
  const featuredPath = scenePath(featured, 1);
  const navigateWithCue = (path) => {
    navigate(path || featuredPath);
  };

  useEffect(() => {
    if (!registerOpen) return undefined;
    nameInputRef.current?.focus();
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setRegisterOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [registerOpen]);

  const startPractice = (event) => {
    event.preventDefault();
    const name = learnerName.trim();
    if (!name) {
      setRegisterError(true);
      nameInputRef.current?.focus();
      return;
    }
    try {
      window.localStorage?.setItem("huayun_learner_name", name);
    } catch {
      // Continue even when browser storage is unavailable.
    }
    setRegisterOpen(false);
    navigateWithCue("/home/levels/");
  };

  return (
    <main className="g3-home is-single-screen">
      <section className="g3-home-hero" aria-labelledby="g3-home-title">
        <div className="g3-hero-copy">
          <h1 id="g3-home-title" className="g3-home-title g3-wow-text" tabIndex="-1">
            {text.heroTitleLine}
          </h1>
          <p className="g3-home-sub">{text.heroSubLine}</p>
          <ul className="g3-home-benefits" aria-label={text.benefitsLabel}>
            <li>{text.benefitOne}</li>
            <li>{text.benefitTwo}</li>
            <li>{text.benefitThree}</li>
          </ul>

          <div className="g3-home-cta-row">
            <button
              className="g3-home-cta-primary g3-wow-button-primary"
              type="button"
              onClick={() => {
                setRegisterError(false);
                setRegisterOpen(true);
              }}
            >
              {text.ctaStart}<i aria-hidden="true">→</i>
            </button>
          </div>
          <p className="g3-home-free-tag">{text.noStorage}</p>
        </div>

        {/* 5-Slide Manga Carousel — animated 2D frame-by-frame scenes */}
        <HomeCarousel
          language={language}
          navigate={navigate}
          activeScenario={activeScenario}
          onSelectScenario={setActiveScenario}
          lowData={lowData}
        />
      </section>
      {registerOpen && (
        <div
          className="g3-register-modal-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setRegisterOpen(false);
          }}
        >
          <form className="g3-register-modal" role="dialog" aria-modal="true" aria-labelledby="g3-register-title" onSubmit={startPractice}>
            <button className="g3-register-close" type="button" aria-label={text.registerClose} onClick={() => setRegisterOpen(false)}>×</button>
            <p className="g3-home-section-label">{text.registerKicker}</p>
            <h2 id="g3-register-title">{text.registerTitle}</h2>
            <p>{text.registerPrompt}</p>
            <label htmlFor="g3-learner-name">{text.registerNameLabel}</label>
            <input
              ref={nameInputRef}
              id="g3-learner-name"
              type="text"
              value={learnerName}
              onChange={(event) => {
                setLearnerName(event.target.value);
                setRegisterError(false);
              }}
              placeholder={text.registerNamePlaceholder}
              autoComplete="name"
              aria-invalid={registerError}
            />
            {registerError && <small className="g3-register-error">{text.registerNameRequired}</small>}
            <button className="g3-register-submit" type="submit">{text.registerContinue}<i aria-hidden="true">→</i></button>
          </form>
        </div>
      )}
    </main>
  );
}

export function StoryCatalog({ language, level = "hsk1", navigate, lowData = false, initialLessonId = null, onRetry }) {
  const text = COPY[language];
  const levelLessons = GROUP3_LESSONS
    .filter((item) => item.level === level)
    .sort((first, second) => Number(first.number) - Number(second.number));
  const defaultLesson = levelLessons[0] || FEATURED_LESSON;
  const initialLesson = levelLessons.find((item) => item.id === initialLessonId) || defaultLesson;
  const [activeLessonId, setActiveLessonId] = useState(initialLesson.id);
  const [activeScene, setActiveScene] = useState(0);
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [activeLessonRequest, setActiveLessonRequest] = useState(() => ({
    data: initialLesson,
    error: null,
    key: initialLesson.id,
    status: initialLesson.load ? "loading" : "ready",
  }));
  const lessonIndexRef = useRef(null);

  useEffect(() => {
    let active = true;
    const meta = levelLessons.find((item) => item.id === activeLessonId) || defaultLesson;
    if (!meta.load) {
      setActiveLessonRequest({ data: meta, error: null, key: meta.id, status: "ready" });
      return () => { active = false; };
    }

    setActiveLessonRequest({ data: meta, error: null, key: meta.id, status: "loading" });
    Promise.resolve()
      .then(() => meta.load())
      .then((data) => {
        if (active) setActiveLessonRequest({ data, error: null, key: meta.id, status: "ready" });
      })
      .catch((error) => {
        if (active) setActiveLessonRequest({ data: meta, error, key: meta.id, status: "error" });
      });

    return () => { active = false; };
  }, [activeLessonId, level, loadAttempt]);

  const activeLessonMeta = levelLessons.find((item) => item.id === activeLessonId) || defaultLesson;
  const activeRequestMatches = activeLessonRequest.key === activeLessonMeta.id;
  const activeLessonStatus = activeRequestMatches
    ? activeLessonRequest.status
    : activeLessonMeta.load ? "loading" : "ready";
  const lesson = activeRequestMatches ? activeLessonRequest.data : activeLessonMeta;
  const lessonReady = activeLessonStatus === "ready";
  const loadingScene = { id: "loading", number: "00", glyph: "...", title: "Loading...", titleTh: "กำลังโหลด...", characters: [], imageAlt: {}, source: "Loading..." };
  const scene = lessonReady ? lesson.scenes?.[activeScene] || loadingScene : loadingScene;
  const activeLessonIndex = Math.max(0, levelLessons.findIndex((item) => item.id === activeLessonId));
  const previousLesson = levelLessons[activeLessonIndex - 1];
  const nextLesson = levelLessons[activeLessonIndex + 1];

  useEffect(() => {
    const lessonIndex = lessonIndexRef.current;
    const activeButton = lessonIndex?.children[activeLessonIndex];
    if (!lessonIndex || !activeButton) return undefined;

    const frame = window.requestAnimationFrame(() => {
      const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
      const centeredLeft = activeButton.offsetLeft - ((lessonIndex.clientWidth - activeButton.offsetWidth) / 2);
      lessonIndex.scrollTo({
        behavior: reducedMotion ? "auto" : "smooth",
        left: Math.max(0, centeredLeft),
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [activeLessonId, activeLessonIndex]);

  const selectLesson = (lessonId) => {
    if (lessonId === activeLessonId && activeLessonStatus === "error") {
      setLoadAttempt((attempt) => attempt + 1);
      onRetry?.();
    }
    setActiveLessonId(lessonId);
    setActiveScene(0);
  };
  const enterLesson = (sceneNumber = null) => {
    if (activeLessonStatus === "error") {
      setLoadAttempt((attempt) => attempt + 1);
      onRetry?.();
      return;
    }
    if (!lessonReady) return;
    navigate(sceneNumber === null ? lessonPath(lesson, "overview") : scenePath(lesson, sceneNumber));
  };
  const moveSceneFocus = (event, index) => {
    const scenes = lesson.scenes || [loadingScene];
    const last = scenes.length - 1;
    let next = index;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = index === last ? 0 : index + 1;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = index === 0 ? last : index - 1;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = last;
    else return;
    event.preventDefault();
    setActiveScene(next);
    event.currentTarget.parentElement?.querySelectorAll('[role="tab"]')[next]?.focus();
  };
  return (
    <main className="g3-catalog">
      <section className="g3-catalog-intro">
        <button className="g3-back-link" type="button" onClick={() => navigate("/home/")}>← {text.back}</button>
        <div className="g3-catalog-intro-copy">
          <p className="g3-kicker">{text.catalogKicker.replace("{count}", String(levelLessons.length))}</p>
          <h1 tabIndex="-1">{text.catalogTitle}</h1>
          <p>{text.catalogBody}</p>
        </div>
        <div className="g3-catalog-intro-actions">
          <SourceStamp lesson={lesson} />
          <button className="g3-primary-action" type="button" disabled={activeLessonStatus === "loading"} onClick={() => enterLesson()}>{activeLessonStatus === "error" ? text.retry : text.readLesson}<i aria-hidden="true">→</i></button>
        </div>
      </section>
      <section className="g3-catalog-browser" aria-label={text.catalogTitle} aria-busy={activeLessonStatus === "loading" ? "true" : undefined}>
        <div className="g3-lesson-navigation">
          <button
            type="button"
            className="g3-lesson-step"
            aria-label={previousLesson ? `${text.lessonLabel} ${previousLesson.number}` : text.lessonLabel}
            disabled={!previousLesson}
            onClick={() => previousLesson && selectLesson(previousLesson.id)}
          >
            <span aria-hidden="true">←</span>
          </button>
          <nav ref={lessonIndexRef} className="g3-lesson-index" aria-label={language === "th" ? "เลือกบทเรียน" : language === "zh" ? "选择课文" : "Choose lesson"}>
            {levelLessons.map((item) => (
              <button type="button" className={item.id === activeLessonId ? "is-active" : ""} aria-current={item.id === activeLessonId ? "true" : undefined} key={item.id} onClick={() => selectLesson(item.id)}>
                <span>{item.number}</span><small>{text.lessonLabel}</small><strong>{{ th: item.title?.thAid, zh: item.title?.zh, en: item.title?.en }[language] || item.title?.zh || item.title?.en || item.title?.thAid || item.slug}</strong>
              </button>
            ))}
          </nav>
          <button
            type="button"
            className="g3-lesson-step"
            aria-label={nextLesson ? `${text.lessonLabel} ${nextLesson.number}` : text.lessonLabel}
            disabled={!nextLesson}
            onClick={() => nextLesson && selectLesson(nextLesson.id)}
          >
            <span aria-hidden="true">→</span>
          </button>
        </div>
        <nav className="g3-catalog-tabs" role="tablist" aria-label={text.scenePicker}>
          {(lesson.scenes || [loadingScene]).map((item, index) => (
            <button type="button" role="tab" aria-selected={activeScene === index} tabIndex={activeScene === index ? 0 : -1} className={activeScene === index ? "is-active" : ""} key={item.id} onClick={() => setActiveScene(index)} onKeyDown={(event) => moveSceneFocus(event, index)}>
              <span>{item.number}</span><i>{item.glyph}</i><strong>{sceneTitle(item, language)}</strong>
            </button>
          ))}
        </nav>
        <article className="g3-catalog-feature" role="tabpanel" data-source-ref={scene.sourceRef} key={`${scene.id}-${language}`}>
          <figure className="g3-catalog-feature-image">
            {lessonReady && !lowData && <img src={scene.image} srcSet={scene.imageSrcSet} sizes="(max-width: 760px) 100vw, 66vw" alt={scene.imageAlt[language]} width="1400" height={scene.imageSrcSet ? "788" : "900"} decoding="async" />}
            <figcaption><span>{text.sceneLabel} {scene.number}</span><i>{scene.glyph}</i><small>{scene.source}</small></figcaption>
          </figure>
          <div className="g3-catalog-feature-copy">
            <p>{{ th: scene.placeTh, zh: scene.place, en: scene.place }[language]} · TEXT {activeScene + 1}</p>
            <h2>{sceneTitle(scene, language)}</h2>
            <strong>{sceneSupportingTitle(scene, language, text)}</strong>
            <blockquote>{sceneContext(scene, language)}</blockquote>
            <small className="g3-context-original">{sceneSupportingContext(scene, language, text)}</small>
            <div className="g3-catalog-cast">
              {scene.characters.map((character) => {
                const profile = lesson.characters[character.profile];
                const voice = GROUP3_VOICE_PROFILES[character.profile];
                return <span key={character.role}>{!lowData && <img src={profile.image} srcSet={profile.imageSrcSet} alt="" width="640" height="640" loading="lazy" decoding="async" style={{ objectPosition: profile.imageFocus }} />}<b>{character.role}</b><em>{profileName(profile, language)}<small>{voice?.label || "TTS"}</small></em></span>;
              })}
            </div>
            <button type="button" disabled={activeLessonStatus === "loading"} onClick={() => enterLesson(activeScene + 1)}>{activeLessonStatus === "error" ? text.retry : text.enterScene}<i aria-hidden="true">↗</i></button>
          </div>
        </article>
      </section>
    </main>
  );
}

export function SceneBriefing({ characters, scene, language, text, onBegin, lowData = false }) {
  const [imageOpen, setImageOpen] = useState(false);
  const imageTriggerRef = useRef(null);
  const closeImage = () => {
    setImageOpen(false);
    window.requestAnimationFrame(() => imageTriggerRef.current?.focus());
  };

  useEffect(() => {
    if (!imageOpen) return undefined;
    const closeOnEscape = (event) => { if (event.key === "Escape") closeImage(); };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [imageOpen]);

  return (
    <section className="g3-scene-briefing" aria-labelledby="g3-briefing-title">
      <figure className="g3-briefing-image">
        {!lowData && <img src={scene.image} srcSet={scene.imageSrcSet} sizes="(max-width: 760px) 100vw, 55vw" alt={scene.imageAlt[language]} width="1400" height={scene.imageSrcSet ? "788" : "900"} decoding="async" />}
        <figcaption><Icon paths={fileImageIcon} />{text.sceneImage} · {scene.source}</figcaption>
        {!lowData && <button ref={imageTriggerRef} type="button" onClick={() => setImageOpen(true)} aria-label={text.enlargeImage}><Icon paths={expandIcon} />{text.enlargeImage}</button>}
      </figure>
      <div className="g3-briefing-copy">
        <p className="g3-kicker">BEFORE THE DIALOGUE · {scene.number}</p>
        <h2 id="g3-briefing-title" tabIndex="-1">{text.beforeReading}</h2>
        <p className="g3-briefing-guide">{text.beforeReadingBody}</p>
        <div className="g3-briefing-context">
          <strong>{sceneContext(scene, language)}</strong>
          <span>{sceneSupportingContext(scene, language, text)}</span>
        </div>
        <div className="g3-character-intros">
          {scene.characters.map((character) => {
            const profile = characters[character.profile];
            const voice = GROUP3_VOICE_PROFILES[character.profile];
            return (
              <article key={`${scene.id}-${character.role}`}>
                {!lowData && <img src={profile.image} srcSet={profile.imageSrcSet} alt={profileName(profile, language)} width="640" height="640" loading="lazy" decoding="async" style={{ objectPosition: profile.imageFocus }} />}
                <div>
                  <span>{text.role} {character.role}</span>
                  <h3>{profileName(profile, language)}</h3>
                  <small>{{ th: `${profile.hanzi} · ${profile.pinyin}`, zh: profile.pinyin, en: profile.hanzi }[language]}</small>
                  <em className="g3-character-voice"><Icon paths={waveSquareIcon} />{text.voiceCast} · {voice?.label || "TTS"}</em>
                  <p>{{ th: character.noteTh, zh: character.noteZh, en: character.noteEn || text.educationalUnavailable }[language]}</p>
                </div>
              </article>
            );
          })}
        </div>
        <div className="g3-briefing-actions">
          <button className="g3-primary-action" type="button" onClick={() => onBegin("autoplay")}>{text.autoplayBegin}<span aria-hidden="true">→</span></button>
          <button className="g3-briefing-manual" type="button" onClick={() => onBegin("manual")}>{text.manualBegin}</button>
          <small>{text.autoplayHint}</small>
        </div>
      </div>
      {imageOpen && !lowData && (
        <div className="g3-image-lightbox" role="dialog" aria-modal="true" aria-label={text.enlargeImage} onClick={(event) => { if (event.target === event.currentTarget) closeImage(); }}>
          <button type="button" onClick={closeImage} aria-label={text.closeImage}><Icon paths={xmarkIcon} /><span>{text.closeImage}</span></button>
          <img src={scene.image} srcSet={scene.imageSrcSet} alt={scene.imageAlt[language]} width="1400" height={scene.imageSrcSet ? "788" : "900"} decoding="async" />
          <p>{text.sceneImage} · {scene.source}</p>
        </div>
      )}
    </section>
  );
}
