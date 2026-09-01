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

const utterance = (hanzi, pinyin, th) => Object.freeze({
  hanzi,
  pinyin,
  translations: Object.freeze({ th }),
});

const vocabulary = (hanzi, pinyin, th) => utterance(hanzi, pinyin, th);

const QUESTION_CONVERSATION_BY_SCENE = Object.freeze({
  "hsk1-l1-s1": Object.freeze({
    sampleAnswers: Object.freeze([utterance("他跟小语打招呼。", "Tā gēn Xiǎoyǔ dǎ zhāohu.", "เขาทักทายเสี่ยวหวี่")]),
    followUps: Object.freeze([Object.freeze({
      question: utterance("他怎么打招呼？", "Tā zěnme dǎ zhāohu?", "เขาทักทายอย่างไร?"),
      sampleAnswers: Object.freeze([utterance("你好，小语！", "Nǐ hǎo, Xiǎoyǔ!", "สวัสดี เสี่ยวหวี่!")]),
      expectedTerms: Object.freeze(["你好", "小语"]),
    })]),
    vocabulary: Object.freeze([
      vocabulary("谁", "shéi", "ใคร"),
      vocabulary("打招呼", "dǎ zhāohu", "ทักทาย"),
      vocabulary("你好", "nǐ hǎo", "สวัสดี"),
    ]),
  }),
  "hsk1-l1-s2": Object.freeze({
    sampleAnswers: Object.freeze([utterance("老师，您好！", "Lǎoshī, nín hǎo!", "สวัสดีค่ะ/ครับ อาจารย์!")]),
    followUps: Object.freeze([Object.freeze({
      question: utterance("老师怎么回答？", "Lǎoshī zěnme huídá?", "คุณครูตอบอย่างไร?"),
      sampleAnswers: Object.freeze([utterance("你们好！", "Nǐmen hǎo!", "สวัสดีนักเรียนทุกคน!")]),
      expectedTerms: Object.freeze(["你们好", "好"]),
    })]),
    vocabulary: Object.freeze([
      vocabulary("学生", "xuésheng", "นักเรียน"),
      vocabulary("老师", "lǎoshī", "คุณครู / อาจารย์"),
      vocabulary("您好", "nín hǎo", "สวัสดี (สุภาพ)"),
    ]),
  }),
  "hsk2-l1-s1": Object.freeze({
    sampleAnswers: Object.freeze([utterance("北京烤鸭。", "Běijīng kǎoyā.", "เป็ดปักกิ่ง")]),
    followUps: Object.freeze([Object.freeze({
      question: utterance("在哪里吃？", "Zài nǎlǐ chī?", "กินที่ไหน?"),
      sampleAnswers: Object.freeze([utterance("在饭店吃。", "Zài fàndiàn chī.", "กินที่ร้านอาหาร")]),
      expectedTerms: Object.freeze(["饭店", "在饭店吃"]),
    })]),
    vocabulary: Object.freeze([
      vocabulary("请", "qǐng", "เชิญ / เลี้ยง"),
      vocabulary("大家", "dàjiā", "ทุกคน"),
      vocabulary("吃", "chī", "กิน"),
      vocabulary("饭店", "fàndiàn", "ร้านอาหาร"),
    ]),
  }),
  "hsk2-l1-s2": Object.freeze({
    sampleAnswers: Object.freeze([utterance("羊肉和鱼。", "Yángròu hé yú.", "เนื้อแกะและปลา")]),
    followUps: Object.freeze([Object.freeze({
      question: utterance("谁准备的午饭？", "Shéi zhǔnbèi de wǔfàn?", "ใครเป็นคนเตรียมอาหารกลางวัน?"),
      sampleAnswers: Object.freeze([utterance("刘明准备的。", "Liú Míng zhǔnbèi de.", "หลิวหมิงเป็นคนเตรียม")]),
      expectedTerms: Object.freeze(["刘明", "准备"]),
    })]),
    vocabulary: Object.freeze([
      vocabulary("准备", "zhǔnbèi", "เตรียม"),
      vocabulary("午饭", "wǔfàn", "อาหารกลางวัน"),
      vocabulary("羊肉", "yángròu", "เนื้อแกะ"),
      vocabulary("鱼", "yú", "ปลา"),
    ]),
  }),
  "hsk3-l1-s1": Object.freeze({
    sampleAnswers: Object.freeze([utterance("味道好极了。", "Wèidào hǎo jí le.", "รสชาติดีเยี่ยม")]),
    followUps: Object.freeze([Object.freeze({
      question: utterance("你也喜欢这个菜吗？", "Nǐ yě xǐhuan zhège cài ma?", "คุณก็ชอบอาหารจานนี้ไหม?"),
      sampleAnswers: Object.freeze([utterance("我也喜欢这个菜。", "Wǒ yě xǐhuan zhège cài.", "ฉันก็ชอบอาหารจานนี้")]),
      expectedTerms: Object.freeze(["喜欢", "菜"]),
    })]),
    vocabulary: Object.freeze([
      vocabulary("味道", "wèidào", "รสชาติ"),
      vocabulary("好极了", "hǎo jí le", "ดีเยี่ยม"),
      vocabulary("喜欢", "xǐhuan", "ชอบ"),
    ]),
  }),
  "hsk3-l1-s2": Object.freeze({
    sampleAnswers: Object.freeze([utterance("可以点外卖。", "Kěyǐ diǎn wàimài.", "สามารถสั่งอาหารเดลิเวอรีได้")]),
    followUps: Object.freeze([Object.freeze({
      question: utterance("这个服务方便吗？", "Zhège fúwù fāngbiàn ma?", "บริการนี้สะดวกไหม?"),
      sampleAnswers: Object.freeze([utterance("很方便。", "Hěn fāngbiàn.", "สะดวกมาก")]),
      expectedTerms: Object.freeze(["方便", "很方便"]),
    })]),
    vocabulary: Object.freeze([
      vocabulary("高铁", "gāotiě", "รถไฟความเร็วสูง"),
      vocabulary("服务", "fúwù", "บริการ"),
      vocabulary("外卖", "wàimài", "อาหารเดลิเวอรี / ส่งอาหาร"),
      vocabulary("方便", "fāngbiàn", "สะดวก"),
    ]),
  }),
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

function conceptGroupsFromTerms(terms) {
  return terms.map((term, index) => ({ id: `follow-up-concept-${index + 1}`, terms: [term] }));
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
  const conversation = QUESTION_CONVERSATION_BY_SCENE[scene.id];
  if (!conversation) return null;
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
    expectedConcepts: conceptGroupsFromTerms([qte.correct]),
    hints: answerWords.slice(0, 3),
    image: scene.image,
    imageAlt: scene.imageAlt || { en: scene.contextEn || scene.titleEn, th: scene.contextTh || scene.titleTh, zh: scene.context || scene.title },
    imageSrcSet: scene.imageSrcSet || "",
    level: lesson.level,
    question: {
      hanzi: qte.prompt.zh,
      pinyin: QUESTION_PINYIN_BY_SCENE[scene.id] || derivePinyin(qte.prompt.zh, lesson.vocabulary),
      translations: { en: qte.prompt.en || "", th: thaiPrompt },
    },
    sampleAnswers: conversation.sampleAnswers,
    followUps: conversation.followUps.map((followUp) => ({
      expectedConcepts: conceptGroupsFromTerms(followUp.expectedTerms),
      question: followUp.question,
      sampleAnswers: followUp.sampleAnswers,
    })),
    vocabulary: conversation.vocabulary,
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
