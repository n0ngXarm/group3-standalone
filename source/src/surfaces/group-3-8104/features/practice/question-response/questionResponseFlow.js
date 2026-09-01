import { normalizeChineseTranscript } from "../evaluation/normalizeTranscript.js";

const UNKNOWN_PINYIN = "—";
const UNKNOWN_THAI = "ระบบยังไม่มีคำแปลอัตโนมัติสำหรับคำตอบนี้";

export function createQuestionConversation(definition) {
  return definition?.question ? [{ role: "system", utterance: definition.question }] : [];
}

export function getQuestionRound(definition, roundIndex = 0) {
  const safeRound = Math.max(0, Number(roundIndex) || 0);
  if (safeRound === 0) {
    return {
      expectedConcepts: definition?.expectedConcepts || [],
      question: definition?.question,
      sampleAnswers: definition?.sampleAnswers || [],
    };
  }
  return definition?.followUps?.[safeRound - 1] || null;
}

export function nextQuestionRound(definition, roundIndex = 0) {
  const safeRound = Math.max(0, Number(roundIndex) || 0);
  const nextRound = safeRound + 1;
  return nextRound <= (definition?.followUps?.length || 0)
    ? { complete: false, roundIndex: nextRound }
    : { complete: true, roundIndex: safeRound };
}

export function questionPromptKey(definition, roundIndex = 0) {
  const promptId = definition?.id || definition?.sourceRef?.sceneId;
  if (!promptId) return "";
  return `${promptId}:${Math.max(0, Number(roundIndex) || 0)}`;
}

export function createQuestionPromptAutoplay(playPrompt) {
  const playedKeys = new Set();
  return {
    play(key, utterance) {
      if (!key || !utterance?.hanzi || playedKeys.has(key)) return false;
      playedKeys.add(key);
      playPrompt(utterance);
      return true;
    },
  };
}

export function buildLearnerUtterance(transcript, sampleAnswers = []) {
  const hanzi = String(transcript || "").trim();
  const normalized = normalizeChineseTranscript(hanzi);
  const match = sampleAnswers.find((answer) => {
    const sample = normalizeChineseTranscript(answer?.hanzi);
    return sample && normalized === sample;
  });
  return {
    hanzi,
    pinyin: match?.pinyin || UNKNOWN_PINYIN,
    translations: { th: match?.translations?.th || UNKNOWN_THAI },
  };
}

export function buildQuestionFeedback(result) {
  if (result?.status === "self-review") {
    return { kind: "review", text: "ฟังคำตอบของคุณแล้วทบทวนด้วยตนเอง" };
  }
  const recommendedTerm = result?.recommendedTerms?.[0];
  if (result?.status === "complete" || !recommendedTerm) {
    return { kind: "success", text: "ตอบได้ตรงประเด็น" };
  }
  return { kind: "retry", text: `ลองใช้คำว่า ${recommendedTerm}` };
}

export function summarizeQuestionRounds(rounds = []) {
  const safeRounds = Array.isArray(rounds) ? rounds : [];
  const scored = safeRounds.filter((entry) => Number.isFinite(Number(entry?.baselineScore)));
  const coverage = scored.map((entry) => Number(entry?.metrics?.keywordCoverage)).filter(Number.isFinite);
  const durations = scored.map((entry) => Number(entry?.metrics?.responseDurationSeconds)).filter(Number.isFinite);
  const rounded = (value) => Math.round(value * 100) / 100;
  return {
    baselineScore: scored.length
      ? Math.round(scored.reduce((sum, entry) => sum + Number(entry.baselineScore), 0) / scored.length)
      : null,
    metrics: {
      keywordCoverage: coverage.length ? rounded(coverage.reduce((sum, value) => sum + value, 0) / coverage.length) : 0,
      responseDurationSeconds: rounded(durations.reduce((sum, value) => sum + value, 0)),
    },
    rounds: safeRounds,
    status: safeRounds.some((entry) => entry?.status === "skipped") ? "skipped" : "complete",
  };
}
