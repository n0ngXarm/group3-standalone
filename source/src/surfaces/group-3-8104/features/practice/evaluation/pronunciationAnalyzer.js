import { buildCharacterEvidence, calculateCharacterErrorRate } from "./characterDistance.js";
import { normalizeChineseTranscript } from "./normalizeTranscript.js";

const TONE_MAP = {
  "ā": 1, "ē": 1, "ī": 1, "ō": 1, "ū": 1, "ǖ": 1,
  "á": 2, "é": 2, "í": 2, "ó": 2, "ú": 2, "ǘ": 2,
  "ǎ": 3, "ě": 3, "ǐ": 3, "ǒ": 3, "ǔ": 3, "ǚ": 3,
  "à": 4, "è": 4, "ì": 4, "ò": 4, "ù": 4, "ǜ": 4,
};

export function extractToneNumber(pinyinSyllable) {
  if (!pinyinSyllable) return 0;
  for (const char of String(pinyinSyllable)) {
    if (TONE_MAP[char]) return TONE_MAP[char];
  }
  return 0; // Neutral tone
}

export function splitPinyinSyllables(pinyinString) {
  if (!pinyinString) return [];
  return String(pinyinString)
    .replace(/[.,!?:;，。！？]/g, "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

/**
 * Analyzes pronunciation details at character, tone, pace, and energy levels.
 */
export function analyzePronunciationDetail({
  audioDurationMs = 0,
  language = "th",
  speechMs = 0,
  targetHanzi = "",
  targetPinyin = "",
  userTranscript = "",
} = {}) {
  const normTarget = normalizeChineseTranscript(targetHanzi);
  const normUser = normalizeChineseTranscript(userTranscript);
  const evidence = buildCharacterEvidence(normTarget, normUser);
  const cer = calculateCharacterErrorRate(normTarget, normUser);

  const targetChars = Array.from(normTarget);
  const pinyinList = splitPinyinSyllables(targetPinyin);

  const matchedIndices = new Set(evidence.matched.map((item) => item.referenceIndex));
  const missingIndices = new Set(evidence.missing.map((item) => item.referenceIndex));
  const substitutedIndices = new Map(evidence.substituted.map((item) => [item.referenceIndex, item.actual]));

  const characterBreakdown = targetChars.map((char, index) => {
    const pinyin = pinyinList[index] || "";
    const tone = extractToneNumber(pinyin);
    let status = "missing";
    let spokenAs = "";

    if (matchedIndices.has(index)) {
      status = "matched";
      spokenAs = char;
    } else if (substitutedIndices.has(index)) {
      status = "mispronounced";
      spokenAs = substitutedIndices.get(index);
    } else if (missingIndices.has(index)) {
      status = "missing";
      spokenAs = "";
    }

    return {
      character: char,
      index,
      pinyin,
      spokenAs,
      status,
      tone,
    };
  });

  const matchedCount = evidence.matched.length;
  const totalCount = targetChars.length || 1;
  const accuracy = Math.round((matchedCount / totalCount) * 100);

  // Speed and rhythm analysis (Characters per minute)
  const rawDuration = Number(speechMs) || Number(audioDurationMs) || 0;
  const effectiveTimeMs = Math.max(1200, rawDuration);
  const rawCpm = Math.round((Array.from(normUser).length * 60000) / effectiveTimeMs);
  const cpm = Math.min(360, Math.max(0, rawCpm));

  let paceAssessment = "optimal";
  let paceLabel = {
    en: "Optimal speaking pace",
    th: "จังหวะการพูดกำลังพอดี",
    zh: "语速适中",
  }[language] || "จังหวะการพูดกำลังพอดี";

  if (normUser.length > 0 && cpm < 85) {
    paceAssessment = "slow";
    paceLabel = {
      en: "Speaking slightly slow, try to speak more fluently",
      th: "พูดค่อนข้างช้า ลองเพิ่มความลื่นไหลอีกนิด",
      zh: "语速偏慢，建议提高流畅度",
    }[language] || "พูดค่อนข้างช้า ลองเพิ่มความลื่นไหลอีกนิด";
  } else if (cpm > 240) {
    paceAssessment = "fast";
    paceLabel = {
      en: "Speaking very fast, slow down slightly for clear tones",
      th: "พูดค่อนข้างเร็ว ลองผ่อนจังหวะเพื่อเน้นวรรณยุกต์",
      zh: "语速偏快，建议放缓并注重声调",
    }[language] || "พูดค่อนข้างเร็ว ลองผ่อนจังหวะเพื่อเน้นวรรณยุกต์";
  }

  // Targeted word corrections (only for Chinese characters)
  const isChineseChar = (ch) => /[\u4e00-\u9fa5]/.test(ch);
  const problemWords = characterBreakdown.filter((item) => item.status !== "matched" && isChineseChar(item.character));
  const specificTips = problemWords.slice(0, 3).map((item) => {
    const toneName = item.tone > 0
      ? (language === "th" ? `เสียงที่ ${item.tone}` : language === "zh" ? `第${item.tone}声` : `Tone ${item.tone}`)
      : (language === "th" ? "เสียงเบา/กลาง (Neutral)" : "轻声");
    const pinyinDisplay = item.pinyin ? ` (${item.pinyin})` : "";
    return {
      character: item.character,
      pinyin: item.pinyin,
      text: language === "th"
        ? `คำว่า "${item.character}"${pinyinDisplay} ควรออกเสียง ${toneName}`
        : language === "zh"
          ? `"${item.character}"${pinyinDisplay} 应读 ${toneName}`
          : `Word "${item.character}"${pinyinDisplay} is pronounced with ${toneName}`,
      tone: item.tone,
    };
  });

  return {
    accuracy,
    characterBreakdown,
    characterErrorRate: cer,
    cpm,
    evidence,
    matchedCount,
    normTarget,
    normUser,
    paceAssessment,
    paceLabel,
    problemWords,
    specificTips,
    totalCount,
  };
}
