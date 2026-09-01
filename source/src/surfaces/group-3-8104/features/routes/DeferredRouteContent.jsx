import { lazy } from "react";

import { VocabularyPage } from "../lessons/vocabulary/VocabularyPage.jsx";
import { LessonCatalog } from "../lessons/catalog/LessonCatalog.jsx";
import { LevelPicker } from "../levels/LevelPicker.jsx";
import { PracticeHub } from "../practice/hub/PracticeHub.jsx";
import { PracticeExercise } from "../practice/shared/PracticeExercise.jsx";
import { PracticeSummary } from "../practice/summary/PracticeSummary.jsx";
import { createPracticeSummary } from "../practice/summary/summaryModel.js";
import { getPracticeResults } from "../practice/sessionStore.js";
import { getLearnerSession } from "../../shared/session.js";
import "../../styles/level-selection.css";
import "../../styles/deferred-route.css";

const ReadingTheatre = lazy(() => import("../lessons/reader/ReadingTheatre.jsx").then((module) => ({
  default: module.ReadingTheatre,
})).catch(() => ({
  default: LessonCatalog,
})));

function PracticeSummaryPage({ language, level, navigate }) {
  const results = getPracticeResults(level);
  const data = createPracticeSummary({
    learnerName: getLearnerSession(),
    hskLevel: level,
    repeatResult: results["repeat-sentence"] || [],
    imageResult: results["image-description"] || [],
    questionResult: results["question-response"] || [],
  });
  return (
    <PracticeSummary
      language={language}
      data={data}
      onRetry={() => navigate(`/home/${level}/practice/`)}
      onHome={() => navigate("/home/levels/")}
    />
  );
}

export default function DeferredRouteContent({
  language,
  lesson,
  lessonStatus,
  lowData,
  navigate,
  requestedLesson,
  requestedLessonKey,
  retryLesson,
  route,
  routeNeedsLesson,
}) {
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
      <ReadingTheatre
        key={lesson.id}
        initialLessonId={lesson.id}
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
  if (route.name === "practice-exercise") {
    return (
      <PracticeExercise
        exerciseType={route.exerciseType}
        language={language}
        level={route.level}
        navigate={navigate}
      />
    );
  }
  if (route.name === "catalog") {
    return <LessonCatalog key={route.level} language={language} level={route.level} navigate={navigate} lowData={lowData} />;
  }
  if (route.name === "vocabulary") {
    return <VocabularyPage key={`${lesson.id}-vocabulary`} language={language} lesson={lesson} navigate={navigate} />;
  }
  return null;
}
