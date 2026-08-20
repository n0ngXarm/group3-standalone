import { useEffect } from "react";

import { playUiCue } from "../../services/audio/index.js";
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
  const scenario = SCENARIOS[activeScenario] || SCENARIOS[0];
  const target = SCENARIO_LESSON_TARGETS[scenario.id] || { level: "hsk1", slug: "lesson-1" };
  const lesson = findLesson(target.level, target.slug) || GROUP3_LESSONS[0];

  const openVocabulary = () => {
    playUiCue("tap");
    navigate(lessonPath(lesson, "vocabulary"));
  };

  return (
    <div className="g3-home-carousel">
      <div className="g3-home-preview-heading">
        <p className="g3-home-section-label">{language === "th" ? "ตัวอย่างบทเรียน" : language === "zh" ? "课程示例" : "Lesson preview"}</p>
        <p className="g3-home-preview-hint">{language === "th" ? "เลือกฉากเพื่อดูว่าในบทเรียนมีอะไรบ้าง" : language === "zh" ? "选择场景，看看课程内容" : "Choose a scene to see what you will practice"}</p>
      </div>
      <div className="g3-home-carousel-stage">
        <ScenarioMangaStage
          activeScenarioIndex={activeScenario}
          onSelectScenario={onSelectScenario}
          language={language}
          lowData={lowData}
        />
        <button type="button" className="g3-vocab-pill" onClick={openVocabulary}>
          {language === "th" ? "ดูคำศัพท์" : language === "zh" ? "看生词" : "View Words"}
        </button>
      </div>
      <div className="g3-home-carousel-dots" role="tablist" aria-label={language === "th" ? "เลือกตัวอย่างบทเรียน" : language === "zh" ? "选择课程预览" : "Choose lesson preview"}>
        {SCENARIOS.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            role="tab"
            aria-selected={activeScenario === index}
            aria-label={slide.title[language] || slide.title.th}
            className={`g3-home-carousel-dot${activeScenario === index ? " is-active" : ""}`}
            onClick={() => {
              playUiCue("tap");
              onSelectScenario(index);
            }}
          />
        ))}
      </div>
    </div>
  );
}