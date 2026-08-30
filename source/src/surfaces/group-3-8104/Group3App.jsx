import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from "react";

import {
  getBrowserAdaptiveThreePolicy,
  canonicalSurfaceLocation,
  surfaceAssetPath,
} from "@lib";
import { COPY } from "./content/copy.js";
import {
  PROTECTED_ROUTE_NAMES,
  canonicalPathForRoute,
  getInitialTheme,
  homePath,
  levelsPath,
  levelPath,
  practicePath,
  routeFromLocation,
} from "./routing/routes.js";
import { stopChineseVoice } from "./services/audio/index.js";
import { findLesson, FEATURED_LESSON, GROUP3_LESSONS } from "./content/registry.js";
import { VocabularyPage } from "./features/lessons/vocabulary/VocabularyPage.jsx";
import { AboutModal, StoryFooter } from "./shared/components/index.js";
import { AppTopbar } from "./shared/components/AppTopbar.jsx";
import { AboutView, ReportView } from "./features/home/HomeViews.jsx";
import { StoryHome } from "./features/home/StoryHome.jsx";
import { LevelPicker } from "./features/levels/LevelPicker.jsx";
import { LessonCatalog } from "./features/lessons/catalog/LessonCatalog.jsx";
import { PracticeHub } from "./features/practice/hub/PracticeHub.jsx";
import { PracticeExercise } from "./features/practice/shared/PracticeExercise.jsx";
import { PracticeSummary } from "./features/practice/summary/PracticeSummary.jsx";
import { createPracticeSummary } from "./features/practice/summary/summaryModel.js";
import { getPracticeResults, clearAllPracticeResults } from "./features/practice/sessionStore.js";
import {
  getLearnerSession,
  endLearnerSession,
  hasLearnerSession,
  markSessionInvalidated,
  getSessionInvalidationReason,
} from "./shared/session.js";
import { shouldLoadReadingBackground } from "./shared/routeMediaPolicy.js";

const ReadingTheatre = lazy(() => import("./features/lessons/reader/ReadingTheatre.jsx").then((module) => ({
  default: module.ReadingTheatre,
})).catch(() => ({
  default: LessonCatalog,
})));

const LESSON_ROUTE_NAMES = new Set(["reader", "vocabulary"]);

function PracticeSummaryPage({ language, level, navigate }) {
  const results = getPracticeResults(level);
  const data = createPracticeSummary({
    hskLevel: level,
    repeatResult: results["repeat-sentence"] || [],
    imageResult: results["image-description"] || [],
    questionResult: results["question-response"] || [],
  });
  return (
    <PracticeSummary
      language={language}
      data={data}
      onRetry={() => navigate(practicePath(level))}
      onHome={() => navigate(levelsPath())}
    />
  );
}

export default function Group3App() {
  const [route, setRoute] = useState(routeFromLocation);
  const [theme, setTheme] = useState(getInitialTheme);
  const [language, setLanguage] = useState("th");
  const [aboutOpen, setAboutOpen] = useState(false);
  const [homeView, setHomeView] = useState("home");

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
    if (shouldLoadReadingBackground({ routeName: route.name, lowData })) {
      document.documentElement.style.setProperty(
        "--g3-reading-background",
        `url("${surfaceAssetPath(3, "/assets/group3/shared/backgrounds/reading-background-v1.webp")}")`,
      );
    } else {
      document.documentElement.style.removeProperty("--g3-reading-background");
    }
    return () => {
      delete document.documentElement.dataset.experience;
      delete document.documentElement.dataset.lowData;
      document.documentElement.style.removeProperty("--g3-reading-background");
    };
  }, [lowData, route.name, theme]);

  useEffect(() => {
    document.documentElement.lang = { th: "th", zh: "zh-CN", en: "en" }[language];
  }, [language]);

  useEffect(() => {
    stopChineseVoice();
    return () => stopChineseVoice();
  }, [language, route.name, route.scene]);

  const navigate = useCallback((pathname, options = {}) => {
    const target = canonicalSurfaceLocation(3, pathname, { theme });
    if (options.replace) {
      history.replaceState({ g3: true }, "", target);
    } else {
      history.pushState({ g3: true }, "", target);
    }

    let next = routeFromLocation();
    const isProtected = PROTECTED_ROUTE_NAMES.has(next.name);
    const sessionActive = hasLearnerSession();

    if (isProtected && !sessionActive) {
      history.replaceState({ g3: true }, "", canonicalSurfaceLocation(3, homePath(), { theme }));
      next = { name: "home" };
    } else if (next.name === "home" && sessionActive) {
      history.replaceState({ g3: true }, "", canonicalSurfaceLocation(3, levelsPath(), { theme }));
      next = { name: "levels" };
    } else if (next.redirect) {
      history.replaceState({ g3: true }, "", canonicalSurfaceLocation(3, canonicalPathForRoute(next), { theme }));
      next = routeFromLocation();
    }
    setRoute(next);
  }, [theme]);

  useEffect(() => {
    let initial = routeFromLocation();
    const isProtected = PROTECTED_ROUTE_NAMES.has(initial.name);
    const sessionActive = hasLearnerSession();

    if (isProtected && !sessionActive) {
      history.replaceState({ g3: true }, "", canonicalSurfaceLocation(3, homePath(), { theme: getInitialTheme() }));
      initial = { name: "home" };
    } else if (initial.name === "home" && sessionActive) {
      history.replaceState({ g3: true }, "", canonicalSurfaceLocation(3, levelsPath(), { theme: getInitialTheme() }));
      initial = { name: "levels" };
    } else if (initial.redirect) {
      history.replaceState(
        { g3: true },
        "",
        canonicalSurfaceLocation(3, canonicalPathForRoute(initial), {
          hash: window.location.hash,
          theme: getInitialTheme(),
        }),
      );
      initial = routeFromLocation();
    } else {
      history.replaceState(
        { ...(history.state || {}), g3: true },
        "",
        canonicalSurfaceLocation(3, canonicalPathForRoute(initial), {
          hash: window.location.hash,
          theme: getInitialTheme(),
        }),
      );
    }

    setRoute(initial);

    const sync = () => {
      let current = routeFromLocation();
      const currentProtected = PROTECTED_ROUTE_NAMES.has(current.name);
      const currentSessionActive = hasLearnerSession();

      if (currentProtected && !currentSessionActive) {
        history.replaceState({ g3: true }, "", canonicalSurfaceLocation(3, homePath(), { theme: getInitialTheme() }));
        current = { name: "home" };
      } else if (current.name === "home" && currentSessionActive) {
        history.replaceState({ g3: true }, "", canonicalSurfaceLocation(3, levelsPath(), { theme: getInitialTheme() }));
        current = { name: "levels" };
      } else if (current.redirect) {
        history.replaceState(
          { g3: true },
          "",
          canonicalSurfaceLocation(3, canonicalPathForRoute(current), {
            hash: window.location.hash,
            theme: getInitialTheme(),
          }),
        );
        current = routeFromLocation();
      }
      setRoute(current);
    };

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
    const frontTitles = { vocabulary: text.vocabularyTitle };
    const title = route.name === "home"
      ? homeView === "about"
        ? `${text.about} · ${text.brand}`
        : homeView === "report"
          ? `${text.report} · ${text.brand}`
          : `${text.brand}`
      : route.name === "reader"
        ? `${sceneTitle} · ${text.brand}`
        : route.name === "practice" || route.name === "practice-exercise" || route.name === "practice-summary"
          ? `${route.level?.toUpperCase()} · ${text.practiceHubTitle} · ${text.brand}`
        : route.name === "catalog"
          ? `${route.level ? route.level.toUpperCase() + " · " : ""}${text.catalogTitle} · ${text.brand}`
          : frontTitles[route.name]
            ? `${frontTitles[route.name]} · ${lessonTitle} · ${text.brand}`
            : `${text.brand}`;
    document.title = title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", COPY[language].sourceOnly);
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [homeView, language, lesson, lessonStatus, route]);

  useEffect(() => {
    const handleOffline = () => {
      if (hasLearnerSession()) {
        markSessionInvalidated("network-loss");
      }
    };

    const handleOnline = () => {
      if (getSessionInvalidationReason() === "network-loss") {
        endLearnerSession();
        clearAllPracticeResults();
        navigate(homePath(), { replace: true });
      }
    };

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, [navigate]);

  const switchHomeView = (view) => {
    setHomeView(view);
    if (route.name !== "home") {
      navigate(homePath());
    } else {
      history.replaceState(
        { g3: true },
        "",
        canonicalSurfaceLocation(3, homePath(), { theme }),
      );
    }
  };

  const goHome = () => {
    endLearnerSession();
    clearAllPracticeResults();
    setHomeView("home");
    navigate(homePath());
  };

  useEffect(() => {
    if (route.name === "home" && hasLearnerSession()) {
      navigate(levelsPath(), { replace: true });
    } else if (route.redirect) {
      navigate(canonicalPathForRoute(route), { replace: true });
    }
  }, [navigate, route.name, route.redirect]);

  const content = useMemo(() => {
    if (routeNeedsLesson && lessonStatus !== "ready") {
      return (
        <LessonCatalog
          key={`lesson-fallback-${requestedLessonKey}`}
          initialLessonId={requestedLesson.id}
          language={language}
          level={route.level}
          navigate={navigate}
          lowData={lowData}
          onRetry={retryLesson}
        />
      );
    }
    if (route.name === "reader") {
      return (
        <ReadingTheatre key={lesson.id} initialLessonId={lesson.id}
          initialScene={route.scene}
          language={language}
          lesson={lesson}
          navigate={navigate}
          lowData={lowData}
          level={route.level}
        />
      );
    }
    if (route.name === "levels") return <LevelPicker language={language} navigate={navigate} />;
    if (route.name === "practice") return <PracticeHub language={language} level={route.level} navigate={navigate} />;
    if (route.name === "practice-summary") return <PracticeSummaryPage language={language} level={route.level} navigate={navigate} />;
    if (route.name === "practice-exercise") return <PracticeExercise exerciseType={route.exerciseType} language={language} level={route.level} navigate={navigate} />;
    if (route.name === "catalog") return <LessonCatalog key={route.level} language={language} level={route.level} navigate={navigate} lowData={lowData} />;
    if (route.name === "vocabulary") {
      return <VocabularyPage key={`${lesson.id}-vocabulary`} language={language} lesson={lesson} navigate={navigate} />;
    }
    if (homeView === "about") return <AboutView language={language} onBack={() => switchHomeView("home")} />;
    if (homeView === "report") return <ReportView language={language} onBack={() => switchHomeView("home")} />;
    return <StoryHome language={language} navigate={navigate} lowData={lowData} />;
  }, [homeView, language, lowData, route, lesson, lessonStatus, requestedLesson, requestedLessonKey, retryLesson, routeNeedsLesson, navigate]);

  const mainSuspense = (
    <Suspense fallback={<LessonCatalog key={`chunk-fallback-${requestedLessonKey}`} initialLessonId={requestedLesson.id} language={language} level={requestedLesson.level} navigate={navigate} lowData={lowData} onRetry={retryLesson} />}>
      {content}
    </Suspense>
  );

  return (
    <div className="g3-story-shell">
      <a className="g3-skip-link" href="#g3-main">{COPY[language].skip}</a>
      <AppTopbar
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
      {route.name !== "reader" && route.name !== "catalog" && route.name !== "practice" && route.name !== "practice-exercise" && route.name !== "practice-summary" && route.name !== "home" && route.name !== "levels" && (
        <StoryFooter language={language} lesson={lesson} route={route} />
      )}
      <AboutModal isOpen={aboutOpen} onClose={() => setAboutOpen(false)} language={language} />
    </div>
  );
}
