import { COPY } from "../copy.js";
import { GROUP3_LESSONS } from "../registry.js";
import { practiceExercisePath } from "../../routing/routes.js";

const PRACTICE_FAMILIES = Object.freeze([
  Object.freeze({
    descriptionKey: "repeatSentenceDescription",
    titleKey: "repeatSentence",
    type: "repeat-sentence",
  }),
  Object.freeze({
    descriptionKey: "imageDescriptionDescription",
    titleKey: "imageDescription",
    type: "image-description",
  }),
  Object.freeze({
    descriptionKey: "questionResponseDescription",
    titleKey: "questionResponse",
    type: "question-response",
  }),
]);

export function getPracticeHubEntries(level, language = "th") {
  const lessons = GROUP3_LESSONS.filter((lesson) => lesson.level === level);
  if (!lessons.length) return [];
  const text = COPY[language] || COPY.th;
  const sourceRefs = lessons.map((lesson) => Object.freeze({ lessonId: lesson.id }));
  return PRACTICE_FAMILIES.map((family) => ({
    id: `${level}-${family.type}`,
    type: family.type,
    title: text[family.titleKey],
    description: text[family.descriptionKey],
    progress: { state: "not-started" },
    route: practiceExercisePath(level, family.type),
    sourceRefs: [...sourceRefs],
  }));
}
