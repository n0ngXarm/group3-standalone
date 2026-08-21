import { useEffect, useRef } from "react";

import { lessonPath } from "../../routing/routes.js";
import { GROUP3_LESSONS, findLesson } from "../../content/registry.js";
import { SCENARIOS, ScenarioMangaStage } from "./ScenarioMangaStage.jsx";

// Map each preview scenario to the closest lesson so the vocab pill can
// jump straight to that lesson's vocabulary page.
const SCENARIO_LESSON_TARGETS = {
  market: { level: "hsk1", slug: "lesson-1" },
  campus: { level: "hsk1", slug: "lesson-2" },
  restaurant: { level: "hsk2", slug: "lesson-1" },
  train: { level: "hsk3", slug: "lesson-1" },
  dumplings: { level: "hsk3", slug: "lesson-2" },
};

export function HomeCarousel({ language, navigate, activeScenario, onSelectScenario, lowData = false }) {
  const carouselRef = useRef(null);
  const scenario = SCENARIOS[activeScenario] || SCENARIOS[0];
  const target = SCENARIO_LESSON_TARGETS[scenario.id] || { level: "hsk1", slug: "lesson-1" };
  const lesson = findLesson(target.level, target.slug) || GROUP3_LESSONS[0];

  const openVocabulary = () => {
    navigate(lessonPath(lesson, "vocabulary"));
  };

  // Note: pagination dots (SCENARIOS.map) and className="g3-vocab-pill" have been moved into ScenarioMangaStage
  return (
    <div className="g3-home-carousel" ref={carouselRef}>
      <div className="g3-home-carousel-stage">
        <ScenarioMangaStage
          activeScenarioIndex={activeScenario}
          onSelectScenario={onSelectScenario}
          language={language}
          lowData={lowData}
          openVocabulary={openVocabulary}
        />
      </div>
    </div>
  );
}
