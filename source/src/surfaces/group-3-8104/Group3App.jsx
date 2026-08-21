import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from "react";

import {
  getBrowserAdaptiveThreePolicy,
  canonicalSurfaceLocation,
  surfaceAssetPath,
} from "@lib";
import { COPY } from "./content/copy.js";
import {
  canonicalPathForRoute,
  gamePath,
  gamesPath,
  getInitialTheme,
  lessonPath,
  routeFromLocation,
} from "./routing/routes.js";
import { stopChineseVoice } from "./services/audio/index.js";
import { findLesson, FEATURED_LESSON, GROUP3_LESSONS } from "./content/registry.js";
import { ContentsPage, PrefacePage, VocabularyPage } from "./features/lesson/index.js";
import { AboutModal, StoryFooter, StoryHeader } from "./shared/components/index.js";
import { AboutView, LevelPicker, ReportView, StoryCatalog, StoryHome } from "./features/catalog/index.js";

const Group3GameHub = lazy(() => import("./features/games/hub/index.js").catch(() => ({

  default: StoryCatalog,
})));
const ReadingTheatre = lazy(() => import("./features/reader/index.js").then((module) => ({

  default: module.ReadingTheatre,
})).catch(() => ({
  default: StoryCatalog,
})));

const LESSON_ROUTE_NAMES = new Set(["reader", "preface", "contents", "vocabulary", "games", "game"]);
const HSK_COURSE_LEVELS = new Set(["hsk1", "hsk2", "hsk3"]);

export default function Group3App() {
  const [route, setRoute] = useState(routeFromLocation);
  const [theme, setTheme] = useState(getInitialTheme);
  const [language, setLanguage] = useState("th");
  const [aboutOpen, setAboutOpen] = useState(false);
  const [homeView, setHomeView] = useState("home");
  const isHskCourseRoute = HSK_COURSE_LEVELS.has(route.level);

  const lowData = useMemo(() => {
    const policy = getBrowserAdaptiveThreePolicy();
    return policy.saveData || policy.lowEnd;
  }, []);
  const requestedLesson = useMemo(() => {
    if (route.level && route.lessonSlug) {
      return findLesson(route.level, route.lessonSlug) || FEATURED_LESSON;
    }
    if (route.level) {
      const levelLessons = GROUP3_LESSONS
        .filter((l) => l.level === route.level)
        .sort((a, b) => Number(a.number) - Number(b.number));
      return levelLessons[0] || FEATURED_LESSON;
    }
    return FEATURED_LESSON;
  }, [route.level, route.lessonSlug]);
  const requestedLessonKey = `${requestedLesson.level}:${requestedLesson.slug}`;
  const [lessonLoadAttempt, setLessonLoadAttempt] = useState(0);
  const [lessonRequest, setLessonRequest] = useState(() => ({
    data: FEATURED_LESSON,
    error: null,
    key: `${FEATURED_LESSON.level}:${FEATURED_LESSON.slug}`,
    status: "ready",
  }));

  useEffect(() => {
    let active = true;
    if (!requestedLesson.load) {
      setLessonRequest({ data: requestedLesson, error: null, key: requestedLessonKey, status: "ready" });
      return () => { active = false; };
    }

    setLessonRequest({ data: requestedLesson, error: null, key: requestedLessonKey, status: "loading" });
    Promise.resolve()
      .then(() => requestedLesson.load())
      .then((data) => {
        if (active) setLessonRequest({ data, error: null, key: requestedLessonKey, status: "ready" });
      })
      .catch((error) => {
        if (active) setLessonRequest({ data: requestedLesson, error, key: requestedLessonKey, status: "error" });
      });

    return () => { active = false; };
  }, [lessonLoadAttempt, requestedLesson, requestedLessonKey]);

  const lessonRequestMatches = lessonRequest.key === requestedLessonKey;
  const lessonStatus = lessonRequestMatches
    ? lessonRequest.status
    : requestedLesson.load ? "loading" : "ready";
  const lesson = lessonRequestMatches ? lessonRequest.data : requestedLesson;
  const retryLesson = useCallback(() => setLessonLoadAttempt((attempt) => attempt + 1), []);
  const routeNeedsLesson = LESSON_ROUTE_NAMES.has(route.name);

  
  useEffect(() => {
    const url = new URL(window.location.href);
    if (url.searchParams.get("theme") !== theme) {
      url.searchParams.set("theme", theme);
      window.history.replaceState(window.history.state, "", url);
    }
  }, [theme]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.dataset.experience = "group3-reading";
    document.documentElement.dataset.lowData = String(lowData);
    if (lowData || isHskCourseRoute) {
      document.documentElement.style.removeProperty("--g3-reading-background");
    } else {
      document.documentElement.style.setProperty(
        "--g3-reading-background",
        `url("${surfaceAssetPath(3, "/assets/group3/shared/backgrounds/reading-background-v1.webp")}")`,
      );
    }
    return () => {
      delete document.documentElement.dataset.experience;
      delete document.documentElement.dataset.lowData;
      document.documentElement.style.removeProperty("--g3-reading-background");
    };
  }, [isHskCourseRoute, lowData, theme]);

  useEffect(() => {
    document.documentElement.lang = { th: "th", zh: "zh-CN", en: "en" }[language];
  }, [language]);

  useEffect(() => {
    stopChineseVoice();
    return () => stopChineseVoice();
  }, [language, route.gameSlug, route.name, route.scene]);

  useEffect(() => {
    const sync = () => setRoute(routeFromLocation());
    const initial = routeFromLocation();
    setRoute(initial);
    history.replaceState(
      { ...(history.state || {}), g3: true },
      "",
      canonicalSurfaceLocation(3, canonicalPathForRoute(initial), {
        hash: window.location.hash,
        theme: getInitialTheme(),
      }),
    );
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);

  useEffect(() => {
    const text = COPY[language];
    const lessonTitle = {
      th: lesson.title?.thAid,
      zh: lesson.title?.zh,
      en: lesson.title?.en,
    }[language];
    const loadedScene = lessonStatus === "ready" ? lesson.scenes?.[route.scene] : null;
    const sceneTitle = loadedScene ? {
      th: loadedScene.titleTh,
      zh: loadedScene.title,
      en: loadedScene.titleEn || loadedScene.title,
    }[language] : lessonTitle;
    const frontTitles = { preface: text.prefaceTitle, contents: text.contentsTitle, vocabulary: text.vocabularyTitle };
    const title = route.name === "home"
      ? homeView === "about"
        ? `${text.about} · ${text.brand}`
        : homeView === "report"
          ? `${text.report} · ${text.brand}`
          : `${text.brand}`
      : route.name === "reader"
        ? `${sceneTitle} · ${text.brand}`
        : route.name === "catalog"
          ? `${route.level ? route.level.toUpperCase() + " · " : ""}${text.catalogTitle} · ${text.brand}`
          : frontTitles[route.name]
            ? `${frontTitles[route.name]} · ${lessonTitle} · ${text.brand}`
            : route.name === "games" || route.name === "game"
              ? `${lessonTitle} · ${text.brand}`
              : `${text.brand}`;
    document.title = title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", COPY[language].sourceOnly);
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [homeView, language, lesson, lessonStatus, route]);

  const navigate = (pathname) => {
    history.pushState(
      { g3: true },
      "",
      canonicalSurfaceLocation(3, pathname, { theme }),
    );
    setRoute(routeFromLocation());
  };

  const switchHomeView = (view) => {
    setHomeView(view);
    if (route.name !== "home") {
      navigate("/home/");
    } else {
      history.replaceState(
        { g3: true },
        "",
        canonicalSurfaceLocation(3, "/home/", { theme }),
      );
    }
  };

  const goHome = () => {
    setHomeView("home");
    navigate("/home/");
  };

  const content = useMemo(() => {
    if (routeNeedsLesson && lessonStatus !== "ready") {
      return <StoryCatalog key={`lesson-fallback-${requestedLessonKey}`} initialLessonId={requestedLesson.id} language={language} level={route.level} navigate={navigate} lowData={lowData} onRetry={retryLesson} />;
    }
    if (route.name === "reader") return <ReadingTheatre key={lesson.id} initialLessonId={lesson.id} initialScene={route.scene} language={language} lesson={lesson} navigate={navigate} lowData={lowData} level={route.level} />;
    if (route.name === "levels") return <LevelPicker language={language} navigate={navigate} />;
    if (route.name === "catalog") return <StoryCatalog key={route.level} language={language} level={route.level} navigate={navigate} lowData={lowData} />;
    if (route.name === "preface") {
      return <PrefacePage key={`${lesson.id}-preface`} language={language} lesson={lesson} navigate={navigate} />;
    }
    if (route.name === "contents") {
      return <ContentsPage key={`${lesson.id}-contents`} language={language} lesson={lesson} navigate={navigate} />;
    }
    if (route.name === "vocabulary") {
      return <VocabularyPage key={`${lesson.id}-vocabulary`} language={language} lesson={lesson} navigate={navigate} />;
    }
    if (route.name === "games" || route.name === "game") return <Group3GameHub activeGame={route.name === "game" ? route.gameSlug : null} lesson={lesson} language={language} onBack={() => navigate(lessonPath(lesson))} onSelectGame={(gameSlug) => navigate(gamePath(lesson, gameSlug))} onShowHub={() => navigate(gamesPath(lesson))} />;
    if (homeView === "about") return <AboutView language={language} onBack={() => switchHomeView("home")} />;
    if (homeView === "report") return <ReportView language={language} onBack={() => switchHomeView("home")} />;
    return <StoryHome language={language} navigate={navigate} lowData={lowData} />;
  }, [homeView, language, lowData, route, theme, lesson, lessonStatus, requestedLesson, requestedLessonKey, retryLesson, routeNeedsLesson]);

  const mainSuspense = (
    <Suspense fallback={<StoryCatalog key={`chunk-fallback-${requestedLessonKey}`} initialLessonId={requestedLesson.id} language={language} level={requestedLesson.level} navigate={navigate} lowData={lowData} onRetry={retryLesson} />}>
      {content}
    </Suspense>
  );

  return (
    <div className="g3-story-shell">
      <a className="g3-skip-link" href="#g3-main">{COPY[language].skip}</a>
      <StoryHeader
        route={route}
        theme={theme}
        language={language}
        lesson={lesson}
        onTheme={() => setTheme((value) => value === "dark" ? "light" : "dark")}
        onLanguage={setLanguage}
        onHome={goHome}
        onAbout={() => setAboutOpen(true)}
      />
      <div id="g3-main" tabIndex="-1" aria-busy={routeNeedsLesson && lessonStatus === "loading" ? "true" : undefined}>
        {mainSuspense}
      </div>
      {route.name !== "reader" && route.name !== "catalog" && route.name !== "home" && route.name !== "levels" && (
        <StoryFooter language={language} lesson={lesson} route={route} />
      )}
      <AboutModal isOpen={aboutOpen} onClose={() => setAboutOpen(false)} language={language} />
    </div>
  );
}
