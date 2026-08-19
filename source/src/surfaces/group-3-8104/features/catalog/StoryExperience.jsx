import { useEffect, useRef, useState } from "react";

import Icon from "../../../../shared/components/ui/Icon.jsx";
import {
  bookIcon,
  expandIcon,
  eyeSlashIcon,
  fileImageIcon,
  waveSquareIcon,
  xmarkIcon,
} from "../../../../shared/components/ui/iconPaths.js";
import { group3AssetPath } from "../../config.js";
import { COPY } from "../../content/copy.js";
import { FEATURED_LESSON, GROUP3_CATALOG_PATH, GROUP3_LESSONS } from "../../content/registry.js";
import { GROUP3_VOICE_PROFILES, playUiCue } from "../../services/audio/index.js";
import { lessonPath, levelPath, scenePath } from "../../routing/routes.js";
import { MarketIllustration, SourceStamp } from "../../shared/components/index.js";

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

const LEVEL_GUIDE = {
  th: {
    title: "เลือกระดับบทเรียนที่ต้องการฝึก",
    body: "เลือกระดับความรู้ภาษาจีน เพื่อเริ่มต้นฝึกฟังและสนทนาในสถานการณ์จำลอง",
    lessonUnit: "บทเรียน",
    action: "เข้าสู่บทเรียน",
    sceneLabel: "สถานการณ์",
    languageLabel: "ลักษณะประโยค",
    levels: [
      { id: "hsk1", title: "HSK 1", stage: "ระดับเริ่มต้น", difficulty: "ระดับ 1: ง่าย", glyph: "听", outcome: "เข้าใจคำศัพท์และประโยคสั้น ๆ ในชีวิตประจำวัน", situation: "สนทนาพื้นฐาน 1 ต่อ 1", languageShape: "ประโยคสั้น เข้าใจง่าย" },
      { id: "hsk2", title: "HSK 2", stage: "ระดับกลางต้น", difficulty: "ระดับ 2: ปานกลาง", glyph: "行", outcome: "ถาม-ตอบและสื่อสารในสถานการณ์ทั่วไปได้คล่องขึ้น", situation: "สนทนาต่อเนื่องหลายประโยค", languageShape: "ประโยคเชื่อมโยง ต่อเนื่อง" },
      { id: "hsk3", title: "HSK 3", stage: "ระดับกลาง", difficulty: "ระดับ 3: ท้าทาย", glyph: "议", outcome: "เข้าใจบทสนทนาที่มีรายละเอียด อธิบายและแสดงความเห็นได้", situation: "การสนทนาและแสดงความคิดเห็น", languageShape: "ประโยคซับซ้อนขึ้น" },
    ],
  },
  zh: {
    title: "选择适合你的等级",
    body: "从你现在能做到的事情开始，看看下一级的对话会怎样变化。",
    lessonUnit: "课",
    action: "查看课程",
    sceneLabel: "场景",
    languageLabel: "语言形式",
    levels: [
      { id: "hsk1", title: "HSK 1", stage: "从零开始", difficulty: "难度 1 / 3", glyph: "听", outcome: "听懂简单表达，立即回应", situation: "一对一交流", languageShape: "简短句子" },
      { id: "hsk2", title: "HSK 2", stage: "实际交流", difficulty: "难度 2 / 3", glyph: "行", outcome: "继续追问，完成多步骤交流", situation: "多轮互动", languageShape: "连续对话" },
      { id: "hsk3", title: "HSK 3", stage: "思考表达", difficulty: "难度 3 / 3", glyph: "议", outcome: "理解不同观点，有逻辑地回应", situation: "小组讨论", languageShape: "复杂结构" },
    ],
  },
  en: {
    title: "Choose your starting level",
    body: "Choose what you can do now, then see how the conversation changes at the next level.",
    lessonUnit: "lessons",
    action: "View lessons",
    sceneLabel: "Scene type",
    languageLabel: "Language shape",
    levels: [
      { id: "hsk1", title: "HSK 1", stage: "Start from zero", difficulty: "Difficulty 1 of 3", glyph: "听", outcome: "Understand simple words and respond right away", situation: "One-to-one", languageShape: "Short sentences" },
      { id: "hsk2", title: "HSK 2", stage: "Use it outside", difficulty: "Difficulty 2 of 3", glyph: "行", outcome: "Ask follow-ups and handle a multi-step exchange", situation: "Multi-turn", languageShape: "Connected dialogue" },
      { id: "hsk3", title: "HSK 3", stage: "Think and explain", difficulty: "Difficulty 3 of 3", glyph: "议", outcome: "Follow different viewpoints and answer with reasons", situation: "Group discussion", languageShape: "Complex structures" },
    ],
  },
};

const LEVEL_ART = {
  hsk1: {
    src: group3AssetPath("/assets/group3/shared/level-paths/hsk1-path-v2-720w.webp"),
    srcSet: `${group3AssetPath("/assets/group3/shared/level-paths/hsk1-path-v2-720w.webp")} 720w, ${group3AssetPath("/assets/group3/shared/level-paths/hsk1-path-v2-1440w.webp")} 1440w`,
  },
  hsk2: {
    src: group3AssetPath("/assets/group3/shared/level-paths/hsk2-path-v2-720w.webp"),
    srcSet: `${group3AssetPath("/assets/group3/shared/level-paths/hsk2-path-v2-720w.webp")} 720w, ${group3AssetPath("/assets/group3/shared/level-paths/hsk2-path-v2-1440w.webp")} 1440w`,
  },
  hsk3: {
    src: group3AssetPath("/assets/group3/shared/level-paths/hsk3-path-v2-720w.webp"),
    srcSet: `${group3AssetPath("/assets/group3/shared/level-paths/hsk3-path-v2-720w.webp")} 720w, ${group3AssetPath("/assets/group3/shared/level-paths/hsk3-path-v2-1440w.webp")} 1440w`,
  },
};

import { GuideButton } from "../../shared/components/GuideModal.jsx";
import { FeatureDemoModal, FeatureShowcase } from "./FeatureDemoModal.jsx";
import { HeroPreviewCarousel } from "./HeroPreviewCarousel.jsx";

export function StoryHome({ language, navigate, lowData = false, onOpenGuide }) {
  const [activeDemoFeature, setActiveDemoFeature] = useState(null);
  const text = COPY[language];
  const levelGuide = LEVEL_GUIDE[language];
  const featured = FEATURED_LESSON;
  const methods = [
    ["01", text.methodRead, text.methodReadBody],
    ["02", text.methodThink, text.methodThinkBody],
    ["03", text.methodBuild, text.methodBuildBody],
  ];
  const navigateWithCue = (path, cue = "tap") => {
    playUiCue(cue);
    navigate(path);
  };

  return (
    <main className="g3-home">
      <section className="g3-home-hero" aria-labelledby="g3-home-title">
        <div className="g3-hero-copy">
          <p className="g3-kicker">{text.heroKicker}</p>
          <h1 id="g3-home-title" tabIndex="-1">{text.heroTitle.split("\n").map((line, index) => <span style={{ "--g3-title-line": index }} key={line}>{line}</span>)}</h1>
          <p className="g3-hero-body">{text.heroBody}</p>
          <div className="g3-hero-actions">
            <button
              className="g3-primary-action"
              type="button"
              onClick={() => navigateWithCue(scenePath(featured, 1), "confirm")}
            >
              {text.startLessonNow || "🚀 เริ่มเรียนทันที (HSK 1 บทที่ 1)"}<i aria-hidden="true">→</i>
            </button>
            <button
              className="g3-text-action"
              type="button"
              onClick={() => {
                const el = document.getElementById("g3-level-gate-title");
                if (el) {
                  playUiCue("tap");
                  el.scrollIntoView({ behavior: "smooth" });
                } else {
                  navigateWithCue(levelPath("hsk1"), "confirm");
                }
              }}
            >
              {text.start}<i aria-hidden="true">↓</i>
            </button>
            {onOpenGuide && (
              <GuideButton onClick={onOpenGuide} label={text.howToPlay || "💡 แนะนำวิธีใช้งาน"} className="g3-home-guide-action" />
            )}
          </div>
          <p className="g3-privacy-note"><Icon paths={eyeSlashIcon} />{text.noStorage}</p>
        </div>
        <HeroPreviewCarousel
          language={language}
          lowData={lowData}
          onOpenFeatureDemo={(featureId) => setActiveDemoFeature(featureId)}
        />
        <div className="g3-method-rail">
          {methods.map(([number, title, body], index) => <article style={{ "--g3-method-index": index }} key={number}><span>{number}</span><div><strong>{title}</strong><p>{body}</p></div></article>)}
        </div>
      </section>

      <FeatureShowcase
        language={language}
        onSelectFeature={(featureId) => setActiveDemoFeature(featureId)}
      />

      <section className="g3-level-gate" aria-labelledby="g3-level-gate-title">
        <header className="g3-level-gate-heading">
          <h2 id="g3-level-gate-title">{levelGuide.title}</h2>
          <p>{levelGuide.body}</p>
        </header>
        <div className="g3-level-options">
          {levelGuide.levels.map((level, index) => {
            const lessonCount = GROUP3_LESSONS.filter((lesson) => lesson.level === level.id).length;
            const rank = index + 1;
            return (
              <button
                aria-label={`${level.title}, ${level.stage}, ${level.difficulty}`}
                className={`g3-level-option is-${level.id}`}
                data-rank={rank}
                key={level.id}
                onClick={() => navigateWithCue(levelPath(level.id), "confirm")}
                type="button"
              >
                <span className="g3-level-visual" aria-hidden="true">
                  {!lowData && <img alt="" decoding="async" height="405" loading="lazy" sizes="(max-width: 700px) 100vw, (max-width: 900px) 48vw, 42vw" src={LEVEL_ART[level.id].src} srcSet={LEVEL_ART[level.id].srcSet} width="720" />}
                </span>
                <span className="g3-level-copy">
                  <span className="g3-level-glyph" aria-hidden="true">{level.glyph}</span>
                  <small>{level.stage}</small>
                  <strong>{level.title}</strong>
                  <span className="g3-level-outcome">{level.outcome}</span>
                  <span className="g3-level-signals">
                    <span><small>{levelGuide.sceneLabel}</small><b>{level.situation}</b></span>
                    <span><small>{levelGuide.languageLabel}</small><b>{level.languageShape}</b></span>
                  </span>
                  <span className="g3-level-meta">
                    <span>{lessonCount} {levelGuide.lessonUnit}</span>
                    <span className="g3-level-difficulty">
                      <span className="g3-level-difficulty-steps" aria-hidden="true">
                        {[1, 2, 3].map((step) => <i className={step <= rank ? "is-active" : ""} key={step} />)}
                      </span>
                      {level.difficulty}
                    </span>
                  </span>
                  <span className="g3-level-action">{levelGuide.action}<b aria-hidden="true">→</b></span>
                </span>
              </button>
            );
          })}
        </div>
        <p className="g3-source-policy"><Icon paths={bookIcon} />{text.sourceOnly}</p>
      </section>

      <FeatureDemoModal
        activeFeature={activeDemoFeature}
        language={language}
        onClose={() => setActiveDemoFeature(null)}
        onSwitchFeature={(nextFeature) => setActiveDemoFeature(nextFeature)}
      />
    </main>
  );
}

export function StoryCatalog({ language, level = "hsk1", navigate, lowData = false, initialLessonId = null, onRetry, onOpenGuide }) {
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
          {onOpenGuide && (
            <GuideButton onClick={onOpenGuide} label={text.howToPlay || "💡 วิธีใช้งาน"} />
          )}
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
                <span>{item.number}</span><small>{text.lessonLabel}</small><strong>{{ th: item.title.thAid, zh: item.title.zh, en: item.title.en }[language]}</strong>
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
