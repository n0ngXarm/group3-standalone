import assert from "node:assert/strict";
import test from "node:test";

import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";

const modulePath = "/src/surfaces/group-3-8104/features/practice/question-response/QuestionResponseConversation.jsx";
let viteServer;

async function loadPresentation() {
  try {
    viteServer ||= await createServer({ appType: "custom", logLevel: "silent", server: { middlewareMode: true } });
    return await viteServer.ssrLoadModule(modulePath);
  } catch (error) {
    assert.fail(`Question Response presentation must exist: ${error.message}`);
  }
}

test.after(async () => viteServer?.close());

const question = {
  hanzi: "李文今天请大家吃什么？",
  pinyin: "Lǐ Wén jīntiān qǐng dàjiā chī shénme?",
  translations: { th: "วันนี้หลี่เหวินเลี้ยงอะไรทุกคน?" },
};
const answer = {
  hanzi: "北京烤鸭。",
  pinyin: "Běijīng kǎoyā.",
  translations: { th: "เป็ดปักกิ่ง" },
};
const followUp = {
  hanzi: "在哪里吃？",
  pinyin: "Zài nǎlǐ chī?",
  translations: { th: "กินที่ไหน?" },
};

function props(overrides = {}) {
  return {
    complete: false,
    conversation: [
      { role: "system", utterance: question },
      { feedback: { kind: "success", text: "ตอบได้ตรงประเด็น" }, role: "learner", utterance: answer },
      { role: "system", utterance: followUp },
    ],
    current: {
      image: "/group3/assets/group3/lessons/hsk2/lesson-01/scenes/scene-01-1400w.webp",
      imageAlt: { th: "เพื่อนพบกันที่สนามบินก่อนเดินทางไปกินอาหารด้วยกัน" },
      imageSrcSet: "/group3/assets/group3/lessons/hsk2/lesson-01/scenes/scene-01-720w.webp 720w, /group3/assets/group3/lessons/hsk2/lesson-01/scenes/scene-01-1400w.webp 1400w",
      question,
      sampleAnswers: [answer],
      vocabulary: [
        { hanzi: "请", pinyin: "qǐng", translations: { th: "เชิญ / เลี้ยง" } },
        { hanzi: "大家", pinyin: "dàjiā", translations: { th: "ทุกคน" } },
        { hanzi: "吃", pinyin: "chī", translations: { th: "กิน" } },
      ],
    },
    errorMessage: "",
    interim: "",
    isLastQuestion: false,
    micAvailable: true,
    onNext: () => {},
    onReplay: () => {},
    onSkip: () => {},
    onStart: () => {},
    onStop: () => {},
    onSubmit: () => {},
    onToggleTyped: () => {},
    phase: "ready",
    recordingSeconds: 120,
    transcript: "",
    typedAnswer: "",
    typedOpen: true,
    onTypedAnswerChange: () => {},
    ...overrides,
  };
}

test("Design B presentation keeps question, chat, help, and primary response controls in one workspace", async () => {
  const { QuestionResponseConversation } = await loadPresentation();
  const markup = renderToStaticMarkup(React.createElement(QuestionResponseConversation, props()));

  assert.match(markup, /g3-question-response-layout/);
  assert.match(markup, /g3-question-main-card/);
  assert.match(markup, /role="log"/);
  assert.match(markup, /g3-question-help/);
  assert.match(markup, /เริ่มพูด/);
  assert.match(markup, /ฟังอีกครั้ง/);
  assert.match(markup, /ข้ามข้อนี้/);
  assert.match(markup, /พิมพ์แทน/);
});

test("main question presents its responsive scene image as learning context", async () => {
  const { QuestionResponseConversation } = await loadPresentation();
  const markup = renderToStaticMarkup(React.createElement(QuestionResponseConversation, props()));

  assert.match(markup, /g3-question-visual-context/);
  assert.match(markup, /scene-01-1400w\.webp/);
  assert.match(markup, /scene-01-720w\.webp 720w/);
  assert.match(markup, /alt="เพื่อนพบกันที่สนามบินก่อนเดินทางไปกินอาหารด้วยกัน"/);
});

test("every visible conversation utterance renders Hanzi, Pinyin, and Thai", async () => {
  const { QuestionResponseConversation } = await loadPresentation();
  const markup = renderToStaticMarkup(React.createElement(QuestionResponseConversation, props()));

  for (const value of [
    question.hanzi, question.pinyin, question.translations.th,
    answer.hanzi, answer.pinyin, answer.translations.th,
    followUp.hanzi, followUp.pinyin, followUp.translations.th,
  ]) assert.match(markup, new RegExp(value.replace(/[.?！？]/g, ".")));
});

test("completed conversation stays visible with one clear next action", async () => {
  const { QuestionResponseConversation } = await loadPresentation();
  const markup = renderToStaticMarkup(React.createElement(QuestionResponseConversation, props({ complete: true })));

  assert.match(markup, /จบบทสนทนานี้แล้ว/);
  assert.match(markup, /ไปข้อถัดไป/);
  assert.doesNotMatch(markup, /เริ่มพูด/);
});

test("review and live transcript states keep learner Hanzi with Pinyin and Thai support", async () => {
  const { QuestionResponseConversation } = await loadPresentation();
  const reviewMarkup = renderToStaticMarkup(React.createElement(QuestionResponseConversation, props({
    conversation: [{ role: "system", utterance: question }],
    phase: "review",
    transcript: "北京烤鸭",
    typedOpen: false,
  })));
  const liveMarkup = renderToStaticMarkup(React.createElement(QuestionResponseConversation, props({
    conversation: [{ role: "system", utterance: question }],
    phase: "recording",
    transcript: "北京烤鸭",
    typedOpen: false,
  })));

  assert.match(reviewMarkup, /g3-question-review-utterance[\s\S]*北京烤鸭[\s\S]*Běijīng kǎoyā[\s\S]*เป็ดปักกิ่ง/);
  assert.match(liveMarkup, /g3-question-live-utterance[\s\S]*北京烤鸭[\s\S]*Běijīng kǎoyā[\s\S]*เป็ดปักกิ่ง/);
});
