import { getLearnerSession } from "../../shared/session.js";

export const SUMMARY_COPY = {
  th: {
    title: "สรุปผลการเรียน",
    learner: "ผู้เรียน",
    level: "ระดับ",
    overallScore: "คะแนนรวม",
    exercises: "บททดสอบ",
    repeatSentence: "ฟังแล้วพูดตาม",
    imageDescription: "บรรยายภาพ",
    questionResponse: "ตอบคำถาม",
    metrics: "รายละเอียด",
    accuracy: "ความแม่นยำ",
    completion: "ความครบถ้วน",
    vocabulary: "คำศัพท์",
    timing: "จังหวะ",
    strengths: "จุดเด่นของคุณ",
    improvements: "จุดที่พัฒนาได้อีก",
    actionRetry: "ฝึกฝนอีกครั้ง",
    actionHome: "กลับหน้าหลัก",
    scoreExcellent: "ยอดเยี่ยม! คุณเข้าใจเนื้อหาได้เป็นอย่างดี",
    scoreVeryGood: "ดีมาก! พยายามต่อไป",
    scoreGood: "ดี! แต่ยังมีจุดที่พัฒนาได้อีก",
    scorePass: "ผ่านเกณฑ์ แนะนำให้ทบทวนบทเรียนอีกครั้ง",
    scoreNeedsPractice: "ควรฝึกฝนเพิ่มเติม ลองทบทวนบทเรียนอีกครั้ง",
    noPracticeResults: "ยังไม่มีผลการฝึกฝน",
    practiceCompleted: "ทำแบบฝึกหัดเสร็จสิ้น (ไม่ประเมินคะแนน)"
  },
  zh: {
    title: "学习总结",
    learner: "学习者",
    level: "级别",
    overallScore: "总分",
    exercises: "练习项目",
    repeatSentence: "跟读句子",
    imageDescription: "看图说话",
    questionResponse: "回答问题",
    metrics: "具体指标",
    accuracy: "准确度",
    completion: "完整度",
    vocabulary: "词汇量",
    timing: "节奏感",
    strengths: "你的优势",
    improvements: "有待提高",
    actionRetry: "再次练习",
    actionHome: "返回首页",
    scoreExcellent: "太棒了！你掌握得非常好。",
    scoreVeryGood: "很好！继续保持。",
    scoreGood: "不错！但还有进步空间。",
    scorePass: "及格。建议再复习一下课文。",
    scoreNeedsPractice: "需要更多练习，请重温课文。",
    noPracticeResults: "暂无练习记录",
    practiceCompleted: "练习已完成（未评分）"
  },
  en: {
    title: "Learning Summary",
    learner: "Learner",
    level: "Level",
    overallScore: "Overall Score",
    exercises: "Exercises",
    repeatSentence: "Repeat Sentence",
    imageDescription: "Image Description",
    questionResponse: "Question Response",
    metrics: "Metrics",
    accuracy: "Accuracy",
    completion: "Completion",
    vocabulary: "Vocabulary",
    timing: "Timing",
    strengths: "Your Strengths",
    improvements: "Areas for Improvement",
    actionRetry: "Practice Again",
    actionHome: "Back to Home",
    scoreExcellent: "Excellent! You've mastered the content.",
    scoreVeryGood: "Very good! Keep it up.",
    scoreGood: "Good! But there's room for improvement.",
    scorePass: "Pass. Consider reviewing the lesson.",
    scoreNeedsPractice: "Needs practice. Try reviewing the lesson again.",
    noPracticeResults: "No practice results yet",
    practiceCompleted: "Practice completed (Unscored)"
  }
};

export function getScoreLabel(score, language = "th", hasResults = true) {
  const dict = SUMMARY_COPY[language] || SUMMARY_COPY.th;
  if (score === null || score === undefined) return hasResults ? dict.practiceCompleted : dict.noPracticeResults;
  if (score >= 90) return dict.scoreExcellent;
  if (score >= 80) return dict.scoreVeryGood;
  if (score >= 70) return dict.scoreGood;
  if (score >= 60) return dict.scorePass;
  return dict.scoreNeedsPractice;
}

export function getLearnerName(language = "th") {
  const name = getLearnerSession();
  if (name && name.trim().length > 0) return name.trim();
  if (language === "zh") return "学习者";
  if (language === "en") return "Learner";
  return "ผู้เรียน";
}

const finite = (val) => Number.isFinite(Number(val)) ? Number(val) : 0;
const average = (arr) => arr.length > 0 ? arr.reduce((a, b) => a + finite(b), 0) / arr.length : null;

// ADAPTER: Real Runtime Contract mapping
export function createLearningSummary({ learnerName, hskLevel, repeatResult, imageResult, questionResult }) {
  // 1. REPEAT SENTENCE
  // repeatResult is either a session object { results: [] } or just an array of results.
  const repeatItems = Array.isArray(repeatResult?.results) ? repeatResult.results : (Array.isArray(repeatResult) ? repeatResult : []);
  const repeatScored = repeatItems.filter(item => typeof item.score === "number");
  const repeatScore = repeatScored.length > 0 ? average(repeatScored.map(i => i.score)) : null;
  const repeatAccuracy = repeatScored.length > 0 ? average(repeatScored.map(i => i.metrics?.transcriptAccuracy)) : null;
  const repeatCompletion = repeatScored.length > 0 ? average(repeatScored.map(i => i.metrics?.completion)) : null;
  const repeatTiming = repeatScored.length > 0 ? average(repeatScored.map(i => i.metrics?.timingScore)) : null;

  // 2. IMAGE DESCRIPTION
  const imageItems = Array.isArray(imageResult) ? imageResult : [];
  const imageScored = imageItems.filter(item => typeof item.baselineScore === "number");
  const imageScore = imageScored.length > 0 ? average(imageScored.map(i => i.baselineScore)) : null;
  const imageVocab = imageScored.length > 0 ? average(imageScored.map(i => i.metrics?.keywordCoverage)) * 100 : null; // coverage is 0-1
  const imageTiming = imageScored.length > 0 ? average(imageScored.map(i => i.metrics?.responseDurationSeconds)) : null;
  const imageCompletion = imageScored.length > 0 ? (imageScored.filter(i => i.status === "complete").length / imageScored.length) * 100 : null;

  // 3. QUESTION RESPONSE
  const questionItems = Array.isArray(questionResult) ? questionResult : [];
  const questionScored = questionItems.filter(item => typeof item.baselineScore === "number");
  const questionScore = questionScored.length > 0 ? average(questionScored.map(i => i.baselineScore)) : null;
  const questionVocab = questionScored.length > 0 ? average(questionScored.map(i => i.metrics?.keywordCoverage)) * 100 : null;
  const questionTiming = questionScored.length > 0 ? average(questionScored.map(i => i.metrics?.responseDurationSeconds)) : null;
  const questionCompletion = questionScored.length > 0 ? (questionScored.filter(i => i.status === "complete").length / questionScored.length) * 100 : null;

  // 4. OVERALL AGGREGATION
  const exerciseScores = [];
  if (repeatScore !== null) exerciseScores.push(repeatScore);
  if (imageScore !== null) exerciseScores.push(imageScore);
  if (questionScore !== null) exerciseScores.push(questionScore);

  const overallScore = exerciseScores.length > 0 ? Math.round(average(exerciseScores)) : null;

  const validAccuracies = [repeatAccuracy].filter(v => v !== null);
  const accuracy = validAccuracies.length > 0 ? Math.round(average(validAccuracies)) : null;

  const validCompletions = [repeatCompletion, imageCompletion, questionCompletion].filter(v => v !== null);
  const completion = validCompletions.length > 0 ? Math.round(average(validCompletions)) : null;

  const validVocabs = [imageVocab, questionVocab].filter(v => v !== null);
  const vocabulary = validVocabs.length > 0 ? Math.round(average(validVocabs)) : null;

  // For timing, mapping duration to a score is tricky. For repeat, timingScore is already 0-100.
  // For free speaking, it's duration. We'll just use repeat's timingScore for the UI timing metric, or omit if missing.
  const timing = repeatTiming !== null ? Math.round(repeatTiming) : null;

  // 5. STRENGTHS & IMPROVEMENTS
  const strengths = { th: [], zh: [], en: [] };
  const improvements = { th: [], zh: [], en: [] };

  if (completion !== null) {
    if (completion >= 80) {
      strengths.th.push("ความครบถ้วนของการตอบ (High completion rate)");
    } else {
      improvements.th.push("พยายามตอบให้ครบถ้วนขึ้น (Try to provide more complete answers)");
    }
  }

  if (accuracy !== null) {
    if (accuracy >= 80) {
      strengths.th.push("ความถูกต้องของเนื้อหา (Strong content accuracy)");
    } else if (accuracy < 60) {
      improvements.th.push("ทบทวนประโยคต้นฉบับ (Review source sentences)");
    }
  }

  if (vocabulary !== null) {
    if (vocabulary >= 70) {
      strengths.th.push("การใช้คำศัพท์ได้ครอบคลุม (Good vocabulary coverage)");
    } else {
      improvements.th.push("พยายามนำคำศัพท์ในบทเรียนมาใช้มากขึ้น (Use more lesson vocabulary)");
    }
  }

  if (imageItems.length > 0 || questionItems.length > 0) {
    const avgDur = average([...imageScored.map(i => i.metrics?.responseDurationSeconds || 0), ...questionScored.map(i => i.metrics?.responseDurationSeconds || 0)]);
    if (avgDur !== null && avgDur < 5) {
      improvements.th.push("อธิบายให้ยาวขึ้นอีกนิด (Expand your free speaking responses)");
    }
  }

  return {
    learnerName: learnerName || getLearnerName("th"), // fallback handled in UI
    hskLevel: hskLevel || "hsk1",
    overall: {
      score: overallScore,
      hasResults: repeatItems.length + imageItems.length + questionItems.length > 0,
      scoredCount: exerciseScores.length,
      totalCount: 3,
      isPartial: exerciseScores.length > 0 && exerciseScores.length < 3
    },
    exercises: {
      repeatSentence: { score: repeatScore !== null ? Math.round(repeatScore) : null },
      imageDescription: { score: imageScore !== null ? Math.round(imageScore) : null },
      questionResponse: { score: questionScore !== null ? Math.round(questionScore) : null }
    },
    metrics: {
      accuracy,
      completion,
      vocabulary,
      timing
    },
    strengths,
    improvements,
    capabilityMode: exerciseScores.length === 0 ? "unscored" : "scored"
  };
}

export const DEMO_SUMMARY_DATA = {
  learnerName: "พิสิษฐ์พงษ์",
  hskLevel: "hsk1",
  overall: {
    score: 82,
    scoredCount: 3,
    totalCount: 3,
    isPartial: false
  },
  exercises: {
    repeatSentence: { score: 86 },
    imageDescription: { score: 74 },
    questionResponse: { score: 83 }
  },
  metrics: {
    accuracy: 88,
    completion: 91,
    vocabulary: 72,
    timing: 79
  },
  strengths: {
    th: ["ความถูกต้องของเนื้อหา", "ความครบถ้วนของการตอบ"],
    zh: ["内容准确", "回答完整"],
    en: ["Content accuracy", "Response completion"]
  },
  improvements: {
    th: ["พยายามนำคำศัพท์ใหม่มาใช้ให้มากขึ้น", "การอธิบายภาพให้ยาวขึ้น"],
    zh: ["多使用新词汇", "尽量多描述图片细节"],
    en: ["Use more new vocabulary", "Expand image descriptions"]
  },
  capabilityMode: "scored"
};
