import { useEffect, useState } from "react";

import { COPY } from "../../../content/copy.js";
import { FEATURED_LESSON, GROUP3_LESSONS } from "../../../content/registry.js";
import { lessonScenePath, levelsPath } from "../../../routing/routes.js";
import { Group3DetailModal } from "../../../shared/components/index.js";
import "./LessonCatalog.css";

const FALLBACK_SCENE_COUNT = 2;

const ENTRY_COPY = {
  th: {
    back: "กลับไปเลือกระดับ",
    contents: "สารบัญ",
    details: "ดูรายละเอียด",
    detailsTitle: "รายละเอียดตอนเรียน",
    episode: "ตอนที่",
    estimatedTime: "ประมาณ 5–7 นาที",
    lesson: "บท",
    loading: "กำลังเตรียมตอนเรียน…",
    openContents: "เลือกบทและตอน",
    retry: "ลองโหลดอีกครั้ง",
    start: "เริ่มเรียน",
    voiceCast: "เสียงพากย์",
  },
  zh: {
    back: "返回等级选择",
    contents: "目录",
    details: "查看详情",
    detailsTitle: "场景详情",
    episode: "场景",
    estimatedTime: "约 5–7 分钟",
    lesson: "第",
    loading: "正在准备场景…",
    openContents: "选择课程和场景",
    retry: "重新加载",
    start: "开始学习",
    voiceCast: "声音角色",
  },
  en: {
    back: "Back to levels",
    contents: "Contents",
    details: "View details",
    detailsTitle: "Scene details",
    episode: "Scene",
    estimatedTime: "About 5–7 minutes",
    lesson: "Lesson",
    loading: "Preparing this scene…",
    openContents: "Choose lesson and scene",
    retry: "Try loading again",
    start: "Start learning",
    voiceCast: "Voice cast",
  },
};

function lessonTitle(lesson, language) {
  return {
    th: lesson.title?.thAid,
    zh: lesson.title?.zh,
    en: lesson.title?.en,
  }[language] || lesson.title?.zh || lesson.slug;
}

function sceneTitle(scene, language) {
  return {
    th: scene.titleTh,
    zh: scene.title,
    en: scene.titleEn,
  }[language] || scene.title;
}

function sceneContext(scene, language) {
  return {
    th: scene.contextTh,
    zh: scene.context,
    en: scene.contextEn,
  }[language] || scene.context;
}

function profileName(profile, language) {
  if (!profile) return "—";
  return {
    th: profile.nameTh,
    zh: profile.hanzi,
    en: profile.nameEn || profile.pinyin,
  }[language] || profile.hanzi || profile.pinyin;
}

function loadingScene() {
  return {
    characters: [],
    context: "",
    contextEn: "",
    contextTh: "",
    glyph: "…",
    id: "loading",
    imageAlt: {},
    number: "00",
    place: "",
    placePy: "",
    placeTh: "",
    source: "",
    title: "",
    titleEn: "",
    titleTh: "",
  };
}

export function LessonCatalog({
  language,
  level = "hsk1",
  navigate,
  lowData = false,
  initialLessonId = null,
  onRetry,
}) {
  const text = COPY[language] || COPY.en;
  const ui = ENTRY_COPY[language] || ENTRY_COPY.en;
  const levelLessons = GROUP3_LESSONS
    .filter((item) => item.level === level)
    .sort((first, second) => Number(first.number) - Number(second.number));
  const defaultLesson = levelLessons[0] || FEATURED_LESSON;
  const initialLesson = levelLessons.find((item) => item.id === initialLessonId) || defaultLesson;
  const [activeLessonId, setActiveLessonId] = useState(initialLesson.id);
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [mobileTocOpen, setMobileTocOpen] = useState(false);
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [activeLessonRequest, setActiveLessonRequest] = useState(() => ({
    data: initialLesson,
    error: null,
    key: initialLesson.id,
    status: initialLesson.load ? "loading" : "ready",
  }));

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [level]);

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
  const scene = lessonReady ? lesson.scenes?.[activeSceneIndex] || loadingScene() : loadingScene();

  const retryLesson = () => {
    setLoadAttempt((attempt) => attempt + 1);
    onRetry?.();
  };

  const selectScene = (lessonMeta, sceneIndex) => {
    if (lessonMeta.id === activeLessonId && activeLessonStatus === "error") retryLesson();
    setActiveLessonId(lessonMeta.id);
    setActiveSceneIndex(sceneIndex);
    setDetailsOpen(false);
    setMobileTocOpen(false);
  };

  const enterScene = () => {
    if (activeLessonStatus === "error") {
      retryLesson();
      return;
    }
    if (!lessonReady) return;
    navigate(lessonScenePath(lesson, activeSceneIndex + 1));
  };

  const castNames = scene.characters
    .map((character) => profileName(lesson.characters?.[character.profile], language))
    .filter(Boolean);

  return (
    <main className={`g3-lesson-selector g3-lesson-selector--${level}`}>
      <section
        className="g3-lesson-workspace"
        aria-busy={activeLessonStatus === "loading" ? "true" : undefined}
        data-lesson-id={lesson.id}
        data-scene-id={scene.id}
      >
        <aside className="g3-lesson-toc" aria-label={ui.contents}>
          <header className="g3-lesson-toc-header">
            <button className="g3-lesson-back" type="button" onClick={() => navigate(levelsPath())}>
              <span aria-hidden="true">←</span>
              {ui.back}
            </button>
            <div>
              <span>{level.toUpperCase()}</span>
              <h1>{ui.contents}</h1>
            </div>
          </header>

          <button
            className="g3-lesson-toc-toggle"
            type="button"
            aria-expanded={mobileTocOpen}
            aria-controls="g3-lesson-toc-list"
            onClick={() => setMobileTocOpen((open) => !open)}
          >
            <span>{ui.lesson} {lesson.number} · {ui.episode} {activeSceneIndex + 1}</span>
            <small>{ui.openContents}</small>
            <i aria-hidden="true">⌄</i>
          </button>

          <nav
            id="g3-lesson-toc-list"
            className={`g3-lesson-toc-list${mobileTocOpen ? " is-open" : ""}`}
            aria-label={text.scenePicker || ui.openContents}
          >
            {levelLessons.map((item) => {
              const sceneCount = item.scenes?.length || FALLBACK_SCENE_COUNT;
              const isCurrentLesson = item.id === activeLessonId;
              return (
                <section className="g3-lesson-toc-group" key={item.id}>
                  <div className="g3-lesson-toc-lesson">
                    <strong>{ui.lesson} {item.number}</strong>
                    <span>
                      <b>{lessonTitle(item, language)}</b>
                      <small>{item.title?.pinyin}</small>
                    </span>
                  </div>
                  <div className="g3-lesson-toc-scenes">
                    {Array.from({ length: sceneCount }, (_, sceneIndex) => {
                      const isActive = isCurrentLesson && activeSceneIndex === sceneIndex;
                      return (
                        <button
                          className={`g3-lesson-scene-option${isActive ? " is-active" : ""}`}
                          type="button"
                          key={`${item.id}-scene-${sceneIndex + 1}`}
                          data-lesson-id={item.id}
                          data-scene-index={sceneIndex}
                          aria-current={isActive ? "page" : undefined}
                          onClick={() => selectScene(item, sceneIndex)}
                        >
                          <span aria-hidden="true" />
                          {ui.episode} {sceneIndex + 1}
                        </button>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </nav>
        </aside>

        <figure className={`g3-lesson-preview${lessonReady ? " is-ready" : " is-loading"}`}>
          {lessonReady && !lowData ? (
            <img
              key={scene.id}
              src={scene.image}
              srcSet={scene.imageSrcSet}
              sizes="(max-width: 760px) 100vw, 50vw"
              alt={scene.imageAlt?.[language] || sceneTitle(scene, language)}
              width="1400"
              height={scene.imageSrcSet ? "788" : "900"}
              decoding="async"
            />
          ) : (
            <div className="g3-lesson-preview-loading" role="status">{ui.loading}</div>
          )}
          {lessonReady && (
            <figcaption>
              <span>{ui.episode} {String(activeSceneIndex + 1).padStart(2, "0")}</span>
              <strong>{scene.glyph}</strong>
            </figcaption>
          )}
        </figure>

        <article className="g3-lesson-detail" aria-live="polite">
          {activeLessonStatus === "error" ? (
            <div className="g3-lesson-load-error" role="alert">
              <span>{level.toUpperCase()}</span>
              <h2>{ui.retry}</h2>
              <button type="button" onClick={retryLesson}>{ui.retry}</button>
            </div>
          ) : (
            <>
              <div className="g3-lesson-detail-heading">
                <span>{ui.lesson} {lesson.number}</span>
                <small>{ui.episode} {activeSceneIndex + 1}</small>
                <h2>{lessonReady ? sceneTitle(scene, language) : ui.loading}</h2>
                {lessonReady && <strong lang="zh-Hans">{scene.title}</strong>}
                {lessonReady && scene.placePy && <em>{scene.placePy}</em>}
              </div>

              {lessonReady && (
                <>
                  <p className="g3-lesson-detail-context">{sceneContext(scene, language)}</p>
                  <div className="g3-lesson-detail-meta">
                    <span><i aria-hidden="true">👥</i>{ui.voiceCast}: {castNames.join(", ")}</span>
                    <span><i aria-hidden="true">◷</i>{ui.estimatedTime}</span>
                  </div>
                </>
              )}

              <div className="g3-lesson-detail-actions">
                <button
                  className="g3-lesson-start"
                  type="button"
                  disabled={!lessonReady}
                  onClick={enterScene}
                >
                  <span aria-hidden="true">▶</span>
                  {ui.start}
                  <i aria-hidden="true">→</i>
                </button>
                <button
                  className="g3-lesson-details-trigger"
                  type="button"
                  disabled={!lessonReady}
                  onClick={() => setDetailsOpen(true)}
                >
                  {ui.details}
                </button>
              </div>
            </>
          )}
        </article>
      </section>

      <Group3DetailModal open={detailsOpen} title={ui.detailsTitle} onClose={() => setDetailsOpen(false)}>
        {lessonReady && (
          <div className="g3-lesson-detail-dialog">
            <header>
              <span>{ui.lesson} {lesson.number} · {ui.episode} {activeSceneIndex + 1}</span>
              <h3>{sceneTitle(scene, language)}</h3>
              <strong lang="zh-Hans">{scene.title}</strong>
              {scene.placePy && <em>{scene.placePy}</em>}
            </header>
            <p>{sceneContext(scene, language)}</p>
            {language !== "zh" && <p lang="zh-Hans">{scene.context}</p>}
            <section>
              <h4>{ui.voiceCast}</h4>
              <ul>
                {scene.characters.map((character) => {
                  const profile = lesson.characters?.[character.profile];
                  return (
                    <li key={`${scene.id}-${character.role}`}>
                      <span>{character.role}</span>
                      <strong>{profileName(profile, language)}</strong>
                      {profile?.pinyin && <small>{profile.pinyin}</small>}
                    </li>
                  );
                })}
              </ul>
            </section>
          </div>
        )}
      </Group3DetailModal>
    </main>
  );
}
