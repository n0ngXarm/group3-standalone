import assert from "node:assert/strict";
import test from "node:test";

const modulePath = "../../src/surfaces/group-3-8104/features/practice/question-response/questionResponseFlow.js";

async function loadFlow() {
  try {
    return await import(modulePath);
  } catch (error) {
    assert.fail(`Question Response flow module must exist: ${error.message}`);
  }
}

const definition = {
  question: {
    hanzi: "李文今天请大家吃什么？",
    pinyin: "Lǐ Wén jīntiān qǐng dàjiā chī shénme?",
    translations: { th: "วันนี้หลี่เหวินเลี้ยงอะไรทุกคน?" },
  },
  expectedConcepts: [{ id: "duck", terms: ["北京烤鸭"] }],
  sampleAnswers: [{
    hanzi: "北京烤鸭。",
    pinyin: "Běijīng kǎoyā.",
    translations: { th: "เป็ดปักกิ่ง" },
  }],
  followUps: [{
    question: {
      hanzi: "在哪里吃？",
      pinyin: "Zài nǎlǐ chī?",
      translations: { th: "กินที่ไหน?" },
    },
    expectedConcepts: [{ id: "restaurant", terms: ["饭店"] }],
    sampleAnswers: [{
      hanzi: "在饭店吃。",
      pinyin: "Zài fàndiàn chī.",
      translations: { th: "กินที่ร้านอาหาร" },
    }],
  }],
};

test("Question Response starts with one system turn and advances to one follow-up", async () => {
  const { createQuestionConversation, getQuestionRound, nextQuestionRound } = await loadFlow();

  assert.deepEqual(createQuestionConversation(definition), [{ role: "system", utterance: definition.question }]);
  assert.deepEqual(getQuestionRound(definition, 0), {
    expectedConcepts: definition.expectedConcepts,
    question: definition.question,
    sampleAnswers: definition.sampleAnswers,
  });
  assert.deepEqual(nextQuestionRound(definition, 0), { complete: false, roundIndex: 1 });
  assert.deepEqual(getQuestionRound(definition, 1), definition.followUps[0]);
  assert.deepEqual(nextQuestionRound(definition, 1), { complete: true, roundIndex: 1 });
});

test("system prompts autoplay once per conversation round even when the view renders again", async () => {
  const { createQuestionPromptAutoplay, questionPromptKey } = await loadFlow();
  const played = [];
  const autoplay = createQuestionPromptAutoplay((utterance) => played.push(utterance.hanzi));
  const mainKey = questionPromptKey({ id: "hsk2-l1-s1" }, 0);
  const followUpKey = questionPromptKey({ id: "hsk2-l1-s1" }, 1);
  const contentKey = questionPromptKey({ sourceRef: { lessonId: "hsk2-l1", sceneId: "hsk2-l1-s1" } }, 0);

  assert.equal(mainKey, "hsk2-l1-s1:0");
  assert.equal(followUpKey, "hsk2-l1-s1:1");
  assert.equal(contentKey, "hsk2-l1-s1:0");
  assert.equal(autoplay.play(mainKey, definition.question), true);
  assert.equal(autoplay.play(mainKey, definition.question), false);
  assert.equal(autoplay.play(followUpKey, definition.followUps[0].question), true);
  assert.deepEqual(played, ["李文今天请大家吃什么？", "在哪里吃？"]);
});

test("recognized learner answer keeps exact transcript with matching Pinyin and Thai support", async () => {
  const { buildLearnerUtterance } = await loadFlow();

  assert.deepEqual(buildLearnerUtterance("北京烤鸭", definition.sampleAnswers), {
    hanzi: "北京烤鸭",
    pinyin: "Běijīng kǎoyā.",
    translations: { th: "เป็ดปักกิ่ง" },
  });
  assert.deepEqual(buildLearnerUtterance("我想吃面条", definition.sampleAnswers), {
    hanzi: "我想吃面条",
    pinyin: "—",
    translations: { th: "ระบบยังไม่มีคำแปลอัตโนมัติสำหรับคำตอบนี้" },
  });
  assert.deepEqual(buildLearnerUtterance("鸭", definition.sampleAnswers), {
    hanzi: "鸭",
    pinyin: "—",
    translations: { th: "ระบบยังไม่มีคำแปลอัตโนมัติสำหรับคำตอบนี้" },
  });
});

test("deterministic feedback names success or one useful expected term without scores", async () => {
  const { buildQuestionFeedback } = await loadFlow();

  assert.deepEqual(buildQuestionFeedback({ status: "complete", recommendedTerms: [] }), {
    kind: "success",
    text: "ตอบได้ตรงประเด็น",
  });
  assert.deepEqual(buildQuestionFeedback({ status: "incomplete", recommendedTerms: ["北京烤鸭"] }), {
    kind: "retry",
    text: "ลองใช้คำว่า 北京烤鸭",
  });
  assert.deepEqual(buildQuestionFeedback({ status: "self-review" }), {
    kind: "review",
    text: "ฟังคำตอบของคุณแล้วทบทวนด้วยตนเอง",
  });
});

test("completed question summary keeps round score, coverage, and duration compatible with existing summary", async () => {
  const flow = await loadFlow();
  assert.equal(typeof flow.summarizeQuestionRounds, "function", "Question Response needs a summary-compatible round aggregator");
  const rounds = [
    { baselineScore: 70, metrics: { keywordCoverage: 0.5, responseDurationSeconds: 8.5 }, status: "partial" },
    { baselineScore: 80, metrics: { keywordCoverage: 1, responseDurationSeconds: 5.5 }, status: "complete" },
  ];

  assert.deepEqual(flow.summarizeQuestionRounds(rounds), {
    baselineScore: 75,
    metrics: { keywordCoverage: 0.75, responseDurationSeconds: 14 },
    rounds,
    status: "complete",
  });
  assert.deepEqual(flow.summarizeQuestionRounds([{ status: "skipped" }]), {
    baselineScore: null,
    metrics: { keywordCoverage: 0, responseDurationSeconds: 0 },
    rounds: [{ status: "skipped" }],
    status: "skipped",
  });
});
