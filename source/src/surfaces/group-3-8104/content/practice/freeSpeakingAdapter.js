import { PRACTICE_ERROR_CODES } from "../../features/practice/errors.js";
import { normalizeChineseTranscript } from "../../features/practice/evaluation/normalizeTranscript.js";
import { GROUP3_LESSONS } from "../registry.js";

const SUPPORTED_TYPES = new Set(["image-description", "question-response"]);
const DEFAULT_PROMPT_COUNT = 2;
const QUESTION_PINYIN_BY_SCENE = Object.freeze({
  "hsk1-l1-s1": "Wáng Yīfēi gēn shéi dǎ zhāohu?",
  "hsk1-l1-s2": "Xuéshengmen zěnyàng gēn lǎoshī dǎ zhāohu?",
  "hsk2-l1-s1": "Lǐ Wén jīntiān qǐng dàjiā chī shénme?",
  "hsk2-l1-s2": "Liú Míng zhǔnbèi le shénme měiwèi wǔfàn?",
  "hsk3-l1-s1": "Bái Jiāyuè juéde zhège cài de wèidào zěnmeyàng?",
  "hsk3-l1-s2": "Zài gāotiě shàng yǒu shénme biànjié de fúwù?",
});
const HINT_PINYIN_BY_SCENE = Object.freeze({
  "hsk3-l1-s2": Object.freeze({ "还": "hái" }),
});

function sourceError(details) {
  const error = new Error(PRACTICE_ERROR_CODES.EXERCISE_SOURCE_NOT_FOUND);
  error.code = PRACTICE_ERROR_CODES.EXERCISE_SOURCE_NOT_FOUND;
  error.details = details;
  return error;
}

async function loadLesson(meta) {
  return typeof meta?.load === "function" ? meta.load() : meta;
}

function uniqueVocabulary(lesson, text, limit = 5) {
  const comparable = normalizeChineseTranscript(text);
  const seen = new Set();
  return (lesson.vocabulary || []).filter((word) => {
    const hanzi = normalizeChineseTranscript(word?.hanzi);
    if (!hanzi || seen.has(hanzi) || !comparable.includes(hanzi)) return false;
    seen.add(hanzi);
    return true;
  }).slice(0, limit).map((word) => ({
    hanzi: word.hanzi,
    pinyin: word.pinyin || "",
    translations: { en: word.en || "", th: word.thAid || word.th || "" },
  }));
}

function conceptGroups(words, fallback = "") {
  const concepts = words.map((word, index) => ({
    id: `concept-${index + 1}`,
    terms: [word.hanzi],
  }));
  const normalizedFallback = normalizeChineseTranscript(fallback);
  if (!concepts.length && normalizedFallback) {
    concepts.push({ id: "concept-1", terms: [normalizedFallback] });
  }
  return concepts;
}

function imageDefinition(lesson, scene) {
  const sceneText = [scene.context, ...(scene.lines || []).map((line) => line.hanzi)].filter(Boolean).join(" ");
  const hintPinyin = HINT_PINYIN_BY_SCENE[scene.id] || {};
  const hints = uniqueVocabulary(lesson, sceneText, 5).map((hint) => ({
    ...hint,
    pinyin: hintPinyin[hint.hanzi] || hint.pinyin,
  }));
  const qteTerm = scene.qte?.correct;
  if (hints.length < 3 && qteTerm && !hints.some((item) => item.hanzi === qteTerm)) {
    const answer = scene.qte.options?.find((option) => option.value === qteTerm) || {};
    hints.push({
      hanzi: qteTerm,
      pinyin: answer.pinyin || "",
      translations: { en: "", th: answer.th || "" },
    });
  }
  const safeHints = hints.slice(0, 5);
  return {
    exerciseId: `image-description:${lesson.id}:${scene.id}`,
    expectedConcepts: conceptGroups(safeHints, qteTerm || scene.title),
    hints: safeHints,
    image: scene.image,
    imageAlt: scene.imageAlt || { en: scene.contextEn || scene.titleEn, th: scene.contextTh || scene.titleTh, zh: scene.context || scene.title },
    imageSrcSet: scene.imageSrcSet || "",
    level: lesson.level,
    sourceRef: { lessonId: lesson.id, sceneId: scene.id },
    timing: { preparationMs: 15_000, responseWindowMs: 120_000 },
    type: "image-description",
  };
}

function derivePinyin(hanzi, vocabulary) {
  const words = (vocabulary || []).filter((word) => word?.hanzi && word?.pinyin)
    .sort((a, b) => Array.from(b.hanzi).length - Array.from(a.hanzi).length);
  let remaining = String(hanzi || "");
  const parts = [];
  while (remaining) {
    const match = words.find((word) => remaining.startsWith(word.hanzi));
    if (match) {
      parts.push(match.pinyin);
      remaining = remaining.slice(match.hanzi.length);
      continue;
    }
    const [character] = Array.from(remaining);
    if (!/[\p{P}\p{Z}]/u.test(character)) parts.push(character);
    remaining = remaining.slice(character.length);
  }
  return parts.join(" ");
}

function questionDefinition(lesson, scene) {
  const qte = scene.qte;
  if (!qte?.prompt?.zh || !qte?.correct) return null;
  const evidenceText = `${qte.correct} ${qte.evidence || ""}`;
  const answerWords = uniqueVocabulary(lesson, evidenceText, 5);
  const correctOption = qte.options?.find((option) => option.value === qte.correct);
  if (!answerWords.some((word) => word.hanzi === qte.correct)) {
    answerWords.unshift({
      hanzi: qte.correct,
      pinyin: correctOption?.pinyin || "",
      translations: { en: "", th: correctOption?.th || "" },
    });
  }
  const thaiPrompt = /\p{Script=Han}/u.test(qte.prompt.th || "") ? "" : qte.prompt.th || "";
  return {
    exerciseId: `question-response:${lesson.id}:${scene.id}`,
    expectedConcepts: conceptGroups(answerWords.slice(0, 5), qte.correct),
    hints: answerWords.slice(0, 3),
    level: lesson.level,
    question: {
      hanzi: qte.prompt.zh,
      pinyin: QUESTION_PINYIN_BY_SCENE[scene.id] || derivePinyin(qte.prompt.zh, lesson.vocabulary),
      translations: { en: qte.prompt.en || "", th: thaiPrompt },
    },
    sourceRef: { lessonId: lesson.id, sceneId: scene.id },
    timing: { preparationMs: 15_000, responseWindowMs: 120_000 },
    type: "question-response",
  };
}

export async function buildFreeSpeakingDefinitions(level, type, { limit = DEFAULT_PROMPT_COUNT } = {}) {
  const normalizedLevel = String(level || "").toLowerCase();
  const safeLimit = Number(limit);
  const metas = GROUP3_LESSONS.filter((lesson) => lesson.level === normalizedLevel);
  if (!metas.length || !SUPPORTED_TYPES.has(type) || !Number.isInteger(safeLimit) || safeLimit < 1) {
    throw sourceError({ level: normalizedLevel, type });
  }

  const definitions = [];
  for (const meta of metas) {
    const lesson = await loadLesson(meta);
    for (const scene of lesson.scenes || []) {
      const next = type === "image-description"
        ? [imageDefinition(lesson, scene)]
        : [questionDefinition(lesson, scene)].filter(Boolean);
      definitions.push(...next);
      if (definitions.length >= safeLimit) return definitions.slice(0, safeLimit);
    }
  }
  throw sourceError({ availableCount: definitions.length, level: normalizedLevel, requiredCount: safeLimit, type });
}
