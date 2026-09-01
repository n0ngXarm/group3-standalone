import { getLearnerSession } from "../../../shared/session.js";

export const SUMMARY_COPY = {
  th: {
    title: "สรุปผลการเรียน",
    learner: "ผู้เรียน",
    level: "ระดับ",
    overallScore: "คะแนนรวม",
    exercises: "ผลการทดสอบแต่ละประเภท",
    skills: "ทักษะสำคัญ 4 ด้าน",
    repeatSentence: "ฟังแล้วพูดตาม",
    repeatSentenceDesc: "ฝึกฟังสำเนียงมาตรฐานและพูดตามเพื่อพัฒนาการออกเสียง",
    imageDescription: "บรรยายภาพ",
    imageDescriptionDesc: "ฝึกพูดบรรยายภาพจากเหตุการณ์จริงด้วยคำศัพท์ในบทเรียน",
    questionResponse: "ตอบคำถาม",
    questionResponseDesc: "ฝึกตอบคำถามตามสถานการณ์เพื่อสื่อสารได้อย่างเป็นธรรมชาติ",
    metrics: "รายละเอียดทักษะ",
    accuracy: "ความแม่นยำ (Accuracy)",
    accuracyDesc: "ความถูกต้องของการออกเสียงและโครงสร้างภาษา",
    completion: "ความครบถ้วน (Completion)",
    completionDesc: "ความสมบูรณ์ของประโยคและการตอบตรงคำถาม",
    vocabulary: "การใช้คำศัพท์ (Vocabulary)",
    vocabularyDesc: "การเลือกใช้คำศัพท์ที่สอดคล้องกับบทเรียน",
    timing: "จังหวะและความคล่อง (Fluency)",
    timingDesc: "ความต่อเนื่อง จังหวะการพูด และความเป็นธรรมชาติ",
    strengths: "จุดเด่นของคุณ (Strengths)",
    improvements: "จุดที่พัฒนาได้อีก (Areas to Improve)",
    actionRetry: "ฝึกอีกครั้ง (Practice Again)",
    actionHome: "เสร็จสิ้น (Finish)",
    actionStart: "เริ่มฝึกฝน (Start Practice)",
    notPracticed: "ยังไม่ได้ทำแบบฝึกหัด",
    completedNoScore: "ฝึกครบแล้ว",
    scoreExcellent: "ยอดเยี่ยม! คุณเข้าใจและสื่อสารเนื้อหาได้เป็นอย่างดี",
    scoreVeryGood: "ดีมาก! ทักษะการสื่อสารอยู่ในเกณฑ์ดีเยี่ยม พยายามต่อไป",
    scoreGood: "ดี! สื่อสารได้เข้าใจ แต่ยังมีจุดที่พัฒนาได้อีก",
    scorePass: "ผ่านเกณฑ์ แนะนำให้ทบทวนบทเรียนและฝึกพูดซ้ำอีกครั้ง",
    scoreNeedsPractice: "ควรฝึกฝนเพิ่มเติม ลองทบทวนบทเรียนอีกครั้งเพื่อเพิ่มความมั่นใจ",
    noPracticeResults: "ยังไม่มีผลการฝึก",
    practiceCompleted: "ฝึกครบแล้ว",
    emptyTitle: "พร้อมเริ่มต้นการฝึกฝนแล้วหรือยัง?",
    emptyDesc: "คุณยังไม่ได้ทำแบบฝึกหัดในระดับนี้ เลือกบททดสอบด้านล่างเพื่อเริ่มฝึกพูด ฟัง และสะสมคะแนนทักษะของคุณได้ทันที!"
  },
  zh: {
    title: "学习总结",
    learner: "学习者",
    level: "级别",
    overallScore: "总分",
    exercises: "各项目练习情况",
    skills: "四大核心技能",
    repeatSentence: "跟读句子",
    repeatSentenceDesc: "听标准发音并跟读，提升发音与语调",
    imageDescription: "看图说话",
    imageDescriptionDesc: "观察情境图片并运用课文词汇进行口语表达",
    questionResponse: "回答问题",
    questionResponseDesc: "根据情境回答问题，提升自然对话能力",
    metrics: "具体技能指标",
    accuracy: "准确度 (Accuracy)",
    accuracyDesc: "发音与语言结构的准确性",
    completion: "完整度 (Completion)",
    completionDesc: "回答的完整性与切题程度",
    vocabulary: "词汇量 (Vocabulary)",
    vocabularyDesc: "课文词汇与句型的运用丰富度",
    timing: "节奏感与流利度 (Fluency)",
    timingDesc: "说话节奏、连贯性与表达流利度",
    strengths: "你的优势 (Strengths)",
    improvements: "有待提高 (Areas to Improve)",
    actionRetry: "再次练习 (Practice Again)",
    actionHome: "完成 (Finish)",
    actionStart: "开始练习 (Start Practice)",
    notPracticed: "尚未练习",
    completedNoScore: "已完成练习",
    scoreExcellent: "太棒了！你掌握得非常好。",
    scoreVeryGood: "很好！表达流利，继续保持。",
    scoreGood: "不错！能够清晰表达，还有进步空间。",
    scorePass: "及格。建议再多复习一下课文。",
    scoreNeedsPractice: "需要更多练习，请重温课文以增强信心。",
    noPracticeResults: "暂无练习结果",
    practiceCompleted: "练习已完成",
    emptyTitle: "准备好开始练习了吗？",
    emptyDesc: "你尚未进行该级别的口语练习，点击下方按钮开始练习并提升技能！"
  },
  en: {
    title: "Learning Summary",
    learner: "Learner",
    level: "Level",
    overallScore: "Overall Score",
    exercises: "Exercise Breakdown",
    skills: "Core Skills",
    repeatSentence: "Repeat Sentence",
    repeatSentenceDesc: "Listen to native audio and repeat to refine pronunciation",
    imageDescription: "Image Description",
    imageDescriptionDesc: "Describe visual scenarios using vocabulary from the lesson",
    questionResponse: "Question Response",
    questionResponseDesc: "Respond to situational questions to build conversational fluency",
    metrics: "Skill Metrics",
    accuracy: "Accuracy",
    accuracyDesc: "Correctness of pronunciation and sentence structure",
    completion: "Completion",
    completionDesc: "Completeness and relevancy of your responses",
    vocabulary: "Vocabulary",
    vocabularyDesc: "Effective use of target vocabulary from the lesson",
    timing: "Fluency & Timing",
    timingDesc: "Speaking pace, pause control, and natural flow",
    strengths: "Your Strengths",
    improvements: "Areas for Improvement",
    actionRetry: "Practice Again",
    actionHome: "Finish",
    actionStart: "Start Practice",
    notPracticed: "Not yet practiced",
    completedNoScore: "Completed",
    scoreExcellent: "Excellent! You've mastered the content.",
    scoreVeryGood: "Very good! Strong communication skills. Keep it up.",
    scoreGood: "Good! Solid expression, with a little room for improvement.",
    scorePass: "Pass. Consider reviewing the lesson to strengthen fluency.",
    scoreNeedsPractice: "Needs practice. Try reviewing the lesson again.",
    noPracticeResults: "No practice results",
    practiceCompleted: "Practice completed",
    emptyTitle: "Ready to start practicing?",
    emptyDesc: "You haven't completed any practice exercises for this level yet. Start now to build your speaking and listening skills!"
  }
};

export function getScoreLabel(score, language = "th", hasResults = true) {
  const dict = SUMMARY_COPY[language] || SUMMARY_COPY.th;
  if (score === null || score === undefined) return hasResults ? dict.practiceCompleted : dict.noPracticeResults;
  if (score >= 90) return dict.scoreExcellent;
  if (score >= 80) return dict.scoreVeryGood;
  if (score >= 70) return dict.scoreGood;
  if (score >= 60) return dict.scorePass;
  if (score === 0) return language === "zh" ? "尚未录入有效语音" : language === "en" ? "No speech recorded yet" : "ยังไม่ได้บันทึกเสียงพูด";
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
  // 1. REPEAT SENTENCE (10 questions, 2 pts each -> Max 20 pts)
  const repeatItems = Array.isArray(repeatResult?.results) ? repeatResult.results : (Array.isArray(repeatResult) ? repeatResult : []);
  const repeatScored = repeatItems.filter(item => typeof item.score === "number");
  const repeatScore = repeatScored.length > 0
    ? Math.min(20, Math.round(repeatScored.reduce((sum, i) => sum + (((Number(i.score) || 0) / 100) * 2), 0) * 10) / 10)
    : null;
  const repeatAccuracy = repeatScored.length > 0 ? average(repeatScored.map(i => i.metrics?.transcriptAccuracy)) : null;
  const repeatCompletion = repeatScored.length > 0 ? average(repeatScored.map(i => i.metrics?.completion)) : null;
  const repeatTiming = repeatScored.length > 0 ? average(repeatScored.map(i => i.metrics?.timingScore)) : null;

  // 2. IMAGE DESCRIPTION (2 questions, 5 pts each -> Max 10 pts)
  const imageItems = Array.isArray(imageResult) ? imageResult : [];
  const imageScored = imageItems.filter(item => typeof item.baselineScore === "number");
  const imageScore = imageScored.length > 0
    ? Math.min(10, Math.round(imageScored.reduce((sum, i) => sum + (((Number(i.baselineScore) || 0) / 100) * 5), 0) * 10) / 10)
    : null;
  const imageVocab = imageScored.length > 0 ? average(imageScored.map(i => i.metrics?.keywordCoverage)) * 100 : null; // coverage is 0-1
  const imageCompletion = imageScored.length > 0 ? (imageScored.filter(i => i.status === "complete").length / imageScored.length) * 100 : null;

  // 3. QUESTION RESPONSE (2 questions, 5 pts each -> Max 10 pts)
  const questionItems = Array.isArray(questionResult) ? questionResult : [];
  const questionScored = questionItems.filter(item => typeof item.baselineScore === "number");
  const questionScore = questionScored.length > 0
    ? Math.min(10, Math.round(questionScored.reduce((sum, i) => sum + (((Number(i.baselineScore) || 0) / 100) * 5), 0) * 10) / 10)
    : null;
  const questionVocab = questionScored.length > 0 ? average(questionScored.map(i => i.metrics?.keywordCoverage)) * 100 : null;
  const questionCompletion = questionScored.length > 0 ? (questionScored.filter(i => i.status === "complete").length / questionScored.length) * 100 : null;

  // 4. OVERALL AGGREGATION (20 + 10 + 10 = Max 40 pts)
  const hasAnyScored = repeatScore !== null || imageScore !== null || questionScore !== null;
  const overallScore = hasAnyScored
    ? Math.round(((repeatScore || 0) + (imageScore || 0) + (questionScore || 0)) * 10) / 10
    : null;
  const maxOverallScore = 40;

  const validAccuracies = [repeatAccuracy].filter(v => v !== null);
  const accuracy = validAccuracies.length > 0 ? Math.round(average(validAccuracies)) : null;

  const validCompletions = [repeatCompletion, imageCompletion, questionCompletion].filter(v => v !== null);
  const completion = validCompletions.length > 0 ? Math.round(average(validCompletions)) : null;

  const validVocabs = [imageVocab, questionVocab].filter(v => v !== null);
  const vocabulary = validVocabs.length > 0 ? Math.round(average(validVocabs)) : null;

  const timing = repeatTiming !== null ? Math.round(repeatTiming) : null;

  // 5. STRENGTHS & IMPROVEMENTS
  const strengths = { th: [], zh: [], en: [] };
  const improvements = { th: [], zh: [], en: [] };
  const hasAnySpeech = [repeatAccuracy, imageVocab, questionVocab, completion].some(v => v !== null && v > 0);

  if (completion !== null && completion > 0) {
    if (completion >= 80) {
      strengths.th.push("ความครบถ้วนของการตอบและการปฏิบัติตามโจทย์ (High completion rate)");
      strengths.zh.push("回答完整度高，能较好地完成练习要求");
      strengths.en.push("High response completion rate");
    } else {
      improvements.th.push("พยายามตอบให้ครบถ้วนทุกประเด็น (Try to provide more complete answers)");
      improvements.zh.push("尽量使回答更加完整充实");
      improvements.en.push("Aim to provide more comprehensive responses");
    }
  }

  if (accuracy !== null && accuracy > 0) {
    if (accuracy >= 80) {
      strengths.th.push("ความถูกต้องแม่นยำของการออกเสียงและรูปประโยค (Strong pronunciation & structure)");
      strengths.zh.push("发音及句子结构准确度高");
      strengths.en.push("High pronunciation and grammatical accuracy");
    } else if (accuracy < 60) {
      improvements.th.push("ทบทวนประโยคต้นฉบับและฝึกออกเสียงซ้ำ (Review source sentences & pronunciation)");
      improvements.zh.push("多听录音并反复跟读以纠正发音");
      improvements.en.push("Review lesson audio and practice pronunciation");
    }
  }

  if (vocabulary !== null && vocabulary > 0) {
    if (vocabulary >= 70) {
      strengths.th.push("การเลือกใช้คำศัพท์ในบทเรียนได้อย่างครอบคลุม (Good vocabulary coverage)");
      strengths.zh.push("课文核心词汇运用熟练");
      strengths.en.push("Effective usage of lesson vocabulary");
    } else {
      improvements.th.push("พยายามนำคำศัพท์ใหม่ในบทเรียนมาใช้แต่งประโยคมากขึ้น (Incorporate more lesson vocabulary)");
      improvements.zh.push("多尝试在表达中使用本课的新词汇");
      improvements.en.push("Incorporate more new vocabulary into your responses");
    }
  }

  if (hasAnySpeech && (imageItems.length > 0 || questionItems.length > 0)) {
    const avgDur = average([...imageScored.map(i => i.metrics?.responseDurationSeconds || 0), ...questionScored.map(i => i.metrics?.responseDurationSeconds || 0)]);
    if (avgDur !== null && avgDur > 0 && avgDur < 5) {
      improvements.th.push("อธิบายรายละเอียดเพิ่มเติมให้ยาวขึ้นอีกนิด (Expand your free speaking descriptions)");
      improvements.zh.push("尝试多描述图片细节，增加口语表达长度");
      improvements.en.push("Expand your speaking responses with more details");
    }
  }

  // Fallback defaults if no specific evaluations
  if (strengths.th.length === 0) {
    if (hasAnySpeech) {
      strengths.th.push("ความมุ่งมั่นและตั้งใจในการฝึกฝนภาษาจีนอย่างสม่ำเสมอ");
      strengths.zh.push("积极参与中文口语练习，保持良好的学习热情");
      strengths.en.push("Dedication and enthusiasm in practicing Chinese speaking");
    } else {
      strengths.th.push("ยังไม่มีข้อมูลเสียงพูดเพื่อประเมินจุดเด่น (กรุณาฝึกพูดเพื่อดูผลวิเคราะห์)");
      strengths.zh.push("暂无有效语音数据以评估优势（请完成口语作答以查看分析）");
      strengths.en.push("No speech data recorded yet to evaluate strengths");
    }
  }
  if (improvements.th.length === 0) {
    if (hasAnySpeech) {
      improvements.th.push("ฝึกฟังสำเนียงและพูดออกเสียงเป็นประจำทุกวันเพื่อสร้างความคุ้นเคย");
      improvements.zh.push("建议每天坚持听音跟读，逐步提高口语自信心");
      improvements.en.push("Practice listening and speaking daily to build confidence");
    } else {
      improvements.th.push("กดเริ่มทำแบบฝึกหัดและออกเสียงตามบทเรียนเพื่อเริ่มสะสมคะแนนทักษะ");
      improvements.zh.push("建议点击开始练习并开口跟读，以建立口语技能分数");
      improvements.en.push("Start practicing and speak aloud to build your skill scores");
    }
  }

  const scoredCount = [repeatScore, imageScore, questionScore].filter(s => s !== null).length;

  return {
    learnerName: learnerName || getLearnerName("th"),
    hskLevel: hskLevel || "hsk1",
    overall: {
      score: overallScore,
      maxScore: maxOverallScore,
      hasResults: repeatItems.length + imageItems.length + questionItems.length > 0,
      scoredCount,
      totalCount: 3,
      isPartial: scoredCount > 0 && scoredCount < 3
    },
    exercises: {
      repeatSentence: {
        score: repeatScore,
        maxScore: 20,
        attempted: repeatItems.length > 0,
        completed: repeatScored.length > 0
      },
      imageDescription: {
        score: imageScore,
        maxScore: 10,
        attempted: imageItems.length > 0,
        completed: imageScored.length > 0
      },
      questionResponse: {
        score: questionScore,
        maxScore: 10,
        attempted: questionItems.length > 0,
        completed: questionScored.length > 0
      }
    },
    metrics: {
      accuracy,
      completion,
      vocabulary,
      timing
    },
    strengths,
    improvements,
    capabilityMode: scoredCount === 0 ? "unscored" : "scored"
  };
}

export const DEMO_SUMMARY_DATA = {
  learnerName: "พิสิษฐ์พงษ์",
  hskLevel: "hsk1",
  overall: {
    score: 33,
    maxScore: 40,
    scoredCount: 3,
    totalCount: 3,
    isPartial: false
  },
  exercises: {
    repeatSentence: { score: 17.5, maxScore: 20, attempted: true, completed: true },
    imageDescription: { score: 7.5, maxScore: 10, attempted: true, completed: true },
    questionResponse: { score: 8, maxScore: 10, attempted: true, completed: true }
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

export const createPracticeSummary = createLearningSummary;
