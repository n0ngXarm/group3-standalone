export const SUMMARY_COPY = {
  th: {
    title: "สรุปผลการฝึก",
    strengths: "จุดที่ทำได้ดี",
    improvements: "ควรฝึกเพิ่ม",
    scoreExcellent: "ยอดเยี่ยม",
    scoreVeryGood: "ดีมาก",
    scoreGood: "ดี",
    scorePass: "ผ่าน",
    scoreNeedsPractice: "ควรฝึกเพิ่ม",
    practiceCompleted: "ฝึกครบแล้ว",
    metrics: {
      accuracy: "ความถูกต้อง (Accuracy)",
      completion: "ความครบถ้วน (Completion)",
      vocabulary: "คำศัพท์ (Vocabulary)",
      timing: "เวลา (Timing)"
    },
    exercises: {
      repeatSentence: "ฟังแล้วพูดตาม",
      imageDescription: "บรรยายภาพ",
      questionResponse: "ตอบคำถาม"
    }
  },
  zh: {
    title: "练习总结",
    strengths: "做得好的地方",
    improvements: "需要多练习的地方",
    scoreExcellent: "优秀",
    scoreVeryGood: "很好",
    scoreGood: "好",
    scorePass: "及格",
    scoreNeedsPractice: "需要练习",
    practiceCompleted: "练习已完成",
    metrics: {
      accuracy: "准确度 (Accuracy)",
      completion: "完整度 (Completion)",
      vocabulary: "词汇 (Vocabulary)",
      timing: "时间 (Timing)"
    },
    exercises: {
      repeatSentence: "听后重复",
      imageDescription: "看图说话",
      questionResponse: "回答问题"
    }
  },
  en: {
    title: "Practice Summary",
    strengths: "Strengths",
    improvements: "Areas for Improvement",
    scoreExcellent: "Excellent",
    scoreVeryGood: "Very Good",
    scoreGood: "Good",
    scorePass: "Pass",
    scoreNeedsPractice: "Needs Practice",
    practiceCompleted: "Practice completed",
    metrics: {
      accuracy: "Content Accuracy",
      completion: "Completion",
      vocabulary: "Vocabulary Coverage",
      timing: "Timing"
    },
    exercises: {
      repeatSentence: "Repeat Sentence",
      imageDescription: "Image Description",
      questionResponse: "Question Response"
    }
  }
};

export function getScoreLabel(score, language = "th") {
  const dict = SUMMARY_COPY[language] || SUMMARY_COPY.th;
  if (score === null || score === undefined) return dict.practiceCompleted;
  if (score >= 90) return dict.scoreExcellent;
  if (score >= 80) return dict.scoreVeryGood;
  if (score >= 70) return dict.scoreGood;
  if (score >= 60) return dict.scorePass;
  return dict.scoreNeedsPractice;
}

export function getLearnerName(language = "th") {
  try {
    const name = window.localStorage.getItem("huayun_learner_name");
    if (name && name.trim().length > 0) return name.trim();
  } catch (e) {
    // Ignore localStorage errors
  }
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
