import { useEffect } from "react";

import { playUiCue } from "../../services/audio/index.js";
import { lessonPath } from "../../routing/routes.js";
import { GROUP3_LESSONS } from "../../content/registry.js";
import { SCENARIOS, ScenarioMangaStage } from "./ScenarioMangaStage.jsx";

// Map each preview scenario to the closest lesson so the vocab pill can
// jump straight to that lesson's vocabulary page.
const SCENARIO_LESSON_SLUG = {
  market: "lesson-1",
  restaurant: "lesson-1",
  campus: "lesson-2",
  train: "lesson-3",
  dumplings: "lesson-4",
};

export function HomeCarousel({ language, navigate, activeScenario, onSelectScenario, lowData = false }) {
  const scenario = SCENARIOS[activeScenario] || SCENARIOS[0];
  const lesson = GROUP3_LESSONS.find((item) => item.slug === SCENARIO_LESSON_SLUG[scenario.id]) || GROUP3_LESSONS[0];

  // Speak the slide's opening line once on mount (manga panel reads itself).
  useEffect(() => {
    const dialogue = scenario.dialogues?.[0];
    if (!dialogue || !("speechSynthesis" in window)) return undefined;
    const timer = setTimeout(() => {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(dialogue.zh);
        utterance.lang = "zh-CN";
        utterance.rate = 0.88;
        window.speechSynthesis.speak(utterance);
      } catch {
        // ignore
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [activeScenario, scenario]);

  const openVocabulary = () => {
    playUiCue("tap");
    navigate(lessonPath(lesson, "vocabulary"));
  };

  return (
    <div className="g3-home-carousel">
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