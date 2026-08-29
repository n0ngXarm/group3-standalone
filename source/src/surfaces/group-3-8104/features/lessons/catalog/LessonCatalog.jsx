import { useEffect, useRef, useState } from "react";

import Icon from "../../../../../shared/components/ui/Icon.jsx";
import {
  expandIcon,
  fileImageIcon,
  waveSquareIcon,
  xmarkIcon,
} from "../../../../../shared/components/ui/iconPaths.js";
import { group3AssetPath } from "../../../config.js";
import { COPY } from "../../../content/copy.js";
import { FEATURED_LESSON, GROUP3_LESSONS } from "../../../content/registry.js";
import { GROUP3_VOICE_PROFILES } from "../../../services/audio/index.js";
import { levelPath, levelsPath, lessonContentsPath, lessonScenePath, practicePath, scenePath } from "../../../routing/routes.js";
import { startLearnerSession } from "../../../shared/session.js";

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

import { HomeCarousel } from "../../../features/home/HomeCarousel.jsx";


export function LessonCatalog({ language, level = "hsk1", navigate, lowData = false, initialLessonId = null, onRetry }) {
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
    navigate(sceneNumber === null ? lessonContentsPath(lesson) : lessonScenePath(lesson, sceneNumber));
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
        <button className="g3-back-link" type="button" onClick={() => navigate(levelsPath())}>← {text.back}</button>
        <div className="g3-catalog-intro-copy">
          <p className="g3-kicker">{text.catalogKicker.replace("{count}", String(levelLessons.length))}</p>
          <h1 tabIndex="-1">{text.catalogTitle}</h1>
          <p>{text.catalogBody}</p>
        </div>
        <div className="g3-catalog-intro-actions">
          
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
                <span>{item.number}</span><small>{text.lessonLabel}</small><strong>{item.title?.zh || item.slug}</strong><em>{item.title?.pinyin}</em><span style={{ display: 'block', fontSize: '0.85em', opacity: 0.8, marginTop: '2px' }}>{item.title?.thAid}</span>
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
        <article className="g3-catalog-feature" role="tabpanel" data-lesson-id={lesson.id} data-scene-id={scene.id} data-source-ref={scene.sourceRef} key={`${scene.id}-${language}`}>
          <figure className="g3-catalog-feature-image">
            {lessonReady && !lowData && <img src={scene.image} srcSet={scene.imageSrcSet} sizes="(max-width: 760px) 100vw, 66vw" alt={scene.imageAlt[language]} width="1400" height={scene.imageSrcSet ? "788" : "900"} decoding="async" />}
            <figcaption><span>{text.sceneLabel} {scene.number}</span><i>{scene.glyph}</i><small>{scene.source}</small></figcaption>
          </figure>
          <div className="g3-catalog-feature-copy">
            <p>{{ th: scene.placeTh, zh: scene.place, en: scene.place }[language]}{scene.placePy && <span className="g3-place-pinyin"> · {scene.placePy}</span>} · TEXT {activeScene + 1}</p>
            <h2>{sceneTitle(scene, language)}</h2>
            <strong>{sceneSupportingTitle(scene, language, text)}</strong>
            <blockquote>{sceneContext(scene, language)}</blockquote>
            <small className="g3-context-original">{sceneSupportingContext(scene, language, text)}</small>
            <div className="g3-catalog-cast">
              {scene.characters.map((character) => {
                const profile = profileWithSceneMedia(lesson.characters[character.profile], character);
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
            const profile = profileWithSceneMedia(characters[character.profile], character);
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
