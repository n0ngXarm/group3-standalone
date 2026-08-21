/**
 * Group 3 Arcade data, scoring, localization, and storage contracts.
 */

export const GAME_ROUND_LIMITS = Object.freeze({ blitz: 15, dash: 15, sprint: 12 });

export const GAME_DEFINITIONS = Object.freeze([
  { id: "blitz", slug: "vocab-blitz", icon: "速", asset: "vocab-blitz" },
  { id: "frenzy", slug: "card-frenzy", icon: "对", asset: "card-frenzy" },
  { id: "sprint", slug: "sound-sprint", icon: "听", asset: "sound-sprint" },
  { id: "dash", slug: "pinyin-dash", icon: "音", asset: "pinyin-dash" },
]);

export const GAME_COPY = Object.freeze({
  th: {
    arcadeTitle: "เกมฝึกคำศัพท์",
    arcadeIntro: "ฝึกทบทวนคำศัพท์และพินอินจากบทเรียนนี้ผ่านเกมสั้นๆ ที่เล่นง่าย",
    backLesson: "กลับไปที่บทเรียน",
    backHub: "กลับสู่หน้าหลักเกม",
    bestScore: "คะแนนสูงสุด",
    noScore: "ยังไม่มีคะแนน",
    play: "เล่นเกมนี้",
    start: "เริ่มเกม",
    rulesTitle: "กติกาและวิธีเล่น",
    readyHint: "ระบบจะเริ่มจับเวลาเมื่อกดเริ่มเล่น",
    paused: "เกมหยุดชั่วคราว",
    pause: "หยุดชั่วคราว",
    resume: "เล่นต่อ",
    score: "คะแนน",
    lives: "หัวใจ",
    combo: "คอมโบ",
    moves: "จำนวนครั้งที่เปิด",
    progress: "ความคืบหน้า",
    time: "เวลาที่เหลือ",
    playSound: "ฟังเสียงคำศัพท์",
    replaySound: "ฟังซ้ำ",
    soundPlaying: "กำลังเล่นเสียง...",
    soundReady: "เล่นเสร็จแล้ว สามารถตอบได้เลย",
    soundBlocked: "เบราว์เซอร์ปิดเสียงไว้ กดฟังอีกครั้ง",
    soundUnavailable: "ไม่สามารถเล่นเสียงได้ในตอนนี้ ลองอีกครั้ง",
    turbo: "โหมดเร่งสปีด",
    resultTitle: "สรุปคะแนน",
    practiceNote: "คะแนนนี้ใช้สำหรับทบทวนบทเรียนเท่านั้น ไม่ใช่ผลสอบ HSK อย่างเป็นทางการ",
    accuracy: "ความแม่นยำ",
    grade: "ระดับคะแนน",
    hskPractice: "คะแนนฝึกตามสเกล HSK",
    cefrReference: "ระดับ CEFR ที่อ้างอิง",
    totalScore: "คะแนนรวม",
    correct: "ตอบถูก",
    maxCombo: "คอมโบสูงสุด",
    rounds: "จำนวนรอบ",
    leaderboard: "จัดอันดับ 5 อันดับแรกของบทนี้",
    emptyLeaderboard: "ยังไม่มีคะแนนในบทนี้ มาเป็นคนแรกกันเลย",
    playAgain: "เล่นอีกครั้ง",
    guest: "ผู้เรียน",
    correctStatus: "ถูกต้อง!",
    wrongStatus: "ยังไม่ถูก",
    timeoutStatus: "หมดเวลา!",
    games: {
      blitz: {
        title: "Vocab Blitz (ทายความหมาย)",
        desc: "เลือกความหมายที่ถูกต้องก่อนหมดเวลา",
        rules: [
          "ดูคำศัพท์ภาษาจีนที่แสดงบนหน้าจอ",
          "เลือกความหมายภาษาไทยที่ถูกต้องให้เร็วที่สุด",
          "มี 3 หัวใจ และเล่นทั้งหมด 15 ข้อ",
          "ตอบถูกต่อเนื่องเพื่อสะสมคอมโบและคะแนนพิเศษ",
        ],
      },
      frenzy: {
        title: "Card Frenzy (จับคู่คำศัพท์)",
        desc: "จับคู่คำศัพท์จีนกับความหมายภาษาไทยให้ครบ",
        rules: [
          "เปิดการ์ด 2 ใบต่อรอบ",
          "จับคู่คำศัพท์จีนกับความหมายภาษาไทยให้ตรงกัน",
          "จับคู่ให้ครบ 6 คู่ และใช้เวลาหยิบได้เร็วที่สุด",
        ],
      },
      sprint: {
        title: "Sound Sprint (ฟังแล้วตอบ)",
        desc: "ฟังเสียงอ่านภาษาจีนแล้วเลือกคำแปลที่ถูกต้อง",
        rules: [
          "กดฟังเสียงภาษาจีนในแต่ละข้อ",
          "เลือกความหมายภาษาไทยที่ตรงกับเสียงที่ฟังได้",
          "มี 3 หัวใจ และเล่นทั้งหมด 12 ข้อ",
        ],
      },
      dash: {
        title: "Pinyin Dash (ทายพินอิน)",
        desc: "เลือกพินอินและเสียงวรรณยุกต์ให้ตรงกับอักษรจีน",
        rules: [
          "ดูอักษรจีนที่แสดงบนหน้าจอ",
          "เลือกพินอินที่ถูกต้อง",
          "มี 3 หัวใจ และเล่นทั้งหมด 15 ข้อ",
          "ตอบถูกติดกัน 5 ข้อเพื่อเปิดโหมดเร่งสปีด",
        ],
      },
    },
  },
  zh: {
    arcadeTitle: "课后小游戏",
    arcadeIntro: "用本课内容做快速复习，简单又好玩。",
    backLesson: "返回课文",
    backHub: "退出游戏",
    bestScore: "最高分",
    noScore: "暂无成绩",
    play: "选择这个游戏",
    start: "开始游戏",
    rulesTitle: "玩法",
    readyHint: "点击开始后才会计时",
    paused: "游戏已暂停",
    pause: "暂停",
    resume: "继续",
    score: "得分",
    lives: "机会",
    combo: "连击",
    moves: "翻牌次数",
    progress: "进度",
    time: "剩余时间",
    playSound: "播放词语",
    replaySound: "再听一次",
    soundPlaying: "正在播放",
    soundReady: "播放结束后即可作答",
    soundBlocked: "浏览器阻止音频，请再点一次",
    soundUnavailable: "暂时不能播放，请稍后再试",
    turbo: "加速模式",
    resultTitle: "成绩结果",
    practiceNote: "本成绩仅用于课后练习，不是官方 HSK 成绩。",
    accuracy: "正确率",
    grade: "练习等级",
    hskPractice: "HSK 练习分",
    cefrReference: "参考 CEFR 等级",
    totalScore: "总分",
    correct: "答对",
    maxCombo: "最高连击",
    rounds: "完成轮数",
    leaderboard: "本课前 5 名",
    emptyLeaderboard: "本课还没有记录，先来第一个吧",
    playAgain: "再玩一次",
    guest: "学习者",
    correctStatus: "回答正确",
    wrongStatus: "回答错误",
    timeoutStatus: "时间到",
    games: {
      blitz: { title: "Vocab Blitz · 词义快选", desc: "在时间结束前选出正确词义", rules: ["选择汉字的正确意思", "一共 15 题和 3 次机会", "连续答对可提高分数"] },
      frenzy: { title: "Card Frenzy · 翻牌配对", desc: "把中文词语与释义配成一组", rules: ["每次翻开两张牌", "配对中文和对应词义", "以尽量少的步数完成 6 组配对"] },
      sprint: { title: "Sound Sprint · 听音快选", desc: "听中文发音后选择正确词义", rules: ["每题先点击播放音频", "等声音结束后再作答", "一共 12 题和 3 次机会"] },
      dash: { title: "Pinyin Dash · 拼音冲刺", desc: "为汉字选择正确拼音", rules: ["选择屏幕上的正确拼音", "一共 15 题和 3 次机会", "连续答对 5 题进入加速模式"] },
    },
  },
  en: {
    arcadeTitle: "Quick practice games",
    arcadeIntro: "Review this lesson with short, easy games you can replay anytime.",
    backLesson: "Back to lesson",
    backHub: "Exit game",
    bestScore: "Best score",
    noScore: "No score yet",
    play: "Play this game",
    start: "Start game",
    rulesTitle: "How to play",
    readyHint: "The timer starts after you press Start",
    paused: "Game paused",
    pause: "Pause",
    resume: "Resume",
    score: "Score",
    lives: "Lives",
    combo: "Combo",
    moves: "Moves",
    progress: "Progress",
    time: "Time left",
    playSound: "Play audio",
    replaySound: "Play again",
    soundPlaying: "Audio is playing",
    soundReady: "Audio finished. You can answer now.",
    soundBlocked: "Audio is blocked. Tap to play again.",
    soundUnavailable: "Audio is unavailable right now. Try again.",
    turbo: "Turbo mode",
    resultTitle: "Score summary",
    practiceNote: "This score is only for lesson practice and not an official HSK result.",
    accuracy: "Accuracy",
    grade: "Score band",
    hskPractice: "HSK practice score",
    cefrReference: "CEFR reference",
    totalScore: "Total score",
    correct: "Correct",
    maxCombo: "Best combo",
    rounds: "Rounds played",
    leaderboard: "Top 5 for this lesson",
    emptyLeaderboard: "No scores yet. Be the first one!",
    playAgain: "Play again",
    guest: "Learner",
    correctStatus: "Correct",
    wrongStatus: "Not quite",
    timeoutStatus: "Time's up",
    games: {
      blitz: { title: "Vocab Blitz · Match meaning", desc: "Choose the right meaning before time runs out", rules: ["Look at the Chinese word", "Pick the correct meaning quickly", "Play 15 questions with 3 lives", "Keep a streak to earn bonus points"] },
      frenzy: { title: "Card Frenzy · Match pairs", desc: "Match Chinese words with the correct meanings", rules: ["Flip two cards at a time", "Match each Chinese word to its meaning", "Complete 6 pairs in as few moves as possible"] },
      sprint: { title: "Sound Sprint · Listen and choose", desc: "Hear the Chinese word and pick the correct meaning", rules: ["Play the audio for each question", "Answer only after the sound ends", "Complete 12 questions with 3 lives"] },
      dash: { title: "Pinyin Dash", desc: "Choose the pinyin that matches the word shown", rules: ["Look at the Chinese character", "Pick the correct pinyin", "Complete 15 questions with 3 lives", "Reach a 5-answer streak to activate Turbo"] },
    },
  },
});

export const THAI_GRADE_TABLE = Object.freeze([
  { min: 80, grade: "A", gpa: 4.0, th: "ดีเยี่ยม", en: "Excellent", zh: "优秀" },
  { min: 75, grade: "B+", gpa: 3.5, th: "ดีมาก", en: "Very good", zh: "很好" },
  { min: 70, grade: "B", gpa: 3.0, th: "ดี", en: "Good", zh: "良好" },
  { min: 65, grade: "C+", gpa: 2.5, th: "ดีพอใช้", en: "Fairly good", zh: "较好" },
  { min: 60, grade: "C", gpa: 2.0, th: "พอใช้", en: "Fair", zh: "合格" },
  { min: 55, grade: "D+", gpa: 1.5, th: "ควรฝึกเพิ่ม", en: "Keep practising", zh: "继续练习" },
  { min: 50, grade: "D", gpa: 1.0, th: "ควรทบทวน", en: "Review needed", zh: "需要复习" },
  { min: 0, grade: "F", gpa: 0, th: "เริ่มใหม่ได้", en: "Try again", zh: "再试一次" },
]);

export const HSK_BAND_TABLE = Object.freeze([
  { min: 90, zh: "优秀", pinyin: "yōuxiù", th: "ดีเยี่ยม", en: "Excellent" },
  { min: 75, zh: "良好", pinyin: "liánghǎo", th: "ดี", en: "Good" },
  { min: 60, zh: "及格", pinyin: "jígé", th: "ผ่านเกณฑ์ฝึก", en: "Practice target met" },
  { min: 0, zh: "继续练习", pinyin: "jìxù liànxí", th: "ฝึกต่ออีกนิด", en: "Keep practising" },
]);

const CEFR_MAP = Object.freeze({ hsk1: "A1", hsk2: "A2", hsk3: "B1" });

const finiteNumber = (value, fallback = 0) => Number.isFinite(Number(value)) ? Number(value) : fallback;
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export function languageCopy(language = "th") {
  return GAME_COPY[language] || GAME_COPY.th;
}

export function lessonTitle(lesson, language = "th") {
  const title = lesson?.title || {};
  return ({ th: title.thAid, zh: title.zh, en: title.en }[language] || title.thAid || title.zh || title.en || "—").trim();
}

export function evaluateScore(correct, total, hskLevel = "hsk1") {
  const safeTotal = Math.max(0, Math.floor(finiteNumber(total)));
  const safeCorrect = clamp(Math.floor(finiteNumber(correct)), 0, safeTotal);
  const accuracy = clamp(safeTotal > 0 ? (safeCorrect / safeTotal) * 100 : 0, 0, 100);
  const thaiGrade = THAI_GRADE_TABLE.find((item) => accuracy >= item.min) || THAI_GRADE_TABLE.at(-1);
  const hskBand = HSK_BAND_TABLE.find((item) => accuracy >= item.min) || HSK_BAND_TABLE.at(-1);
  const stars = accuracy >= 95 ? 3 : accuracy >= 80 ? 2 : accuracy >= 60 ? 1 : 0;
  const level = Object.hasOwn(CEFR_MAP, hskLevel) ? hskLevel : "hsk1";
  const hskMaxScore = level === "hsk3" ? 300 : 200;
  const hskPassScore = level === "hsk3" ? 180 : 120;
  const hskSimulatedScore = clamp(Math.round((accuracy / 100) * hskMaxScore), 0, hskMaxScore);
  return {
    accuracy: Math.round(accuracy * 10) / 10,
    correct: safeCorrect,
    total: safeTotal,
    thaiGrade,
    hskBand,
    stars,
    cefr: CEFR_MAP[level],
    hskRef: { level: level.toUpperCase(), simulatedScore: hskSimulatedScore, maxScore: hskMaxScore, passScore: hskPassScore, passed: hskSimulatedScore >= hskPassScore },
  };
}

export function shuffle(array, rng = Math.random) {
  const arr = Array.isArray(array) ? [...array] : [];
  const random = typeof rng === "function" ? rng : Math.random;
  for (let index = arr.length - 1; index > 0; index -= 1) {
    const sample = Number(random());
    const normalized = Number.isFinite(sample) ? clamp(sample, 0, 1 - Number.EPSILON) : 0;
    const swapIndex = Math.floor(normalized * (index + 1));
    [arr[index], arr[swapIndex]] = [arr[swapIndex], arr[index]];
  }
  return arr;
}

function cleanText(value) {
  return typeof value === "string" ? value.trim() : "";
}

export function normalizeVocabulary(vocabulary) {
  const unique = new Map();
  Object.values(vocabulary || {}).forEach((entry) => {
    const word = {
      hanzi: cleanText(entry?.hanzi),
      pinyin: cleanText(entry?.pinyin),
      th: cleanText(entry?.th || entry?.thAid),
      en: cleanText(entry?.en),
    };
    if (!word.hanzi || !word.pinyin || !word.th) return;
    const key = [word.hanzi, word.pinyin.toLocaleLowerCase(), word.th.toLocaleLowerCase()].join("|");
    if (!unique.has(key)) unique.set(key, word);
  });
  return [...unique.values()];
}

function distinctBy(words, field) {
  const seen = new Set();
  return words.filter((word) => {
    const value = cleanText(word[field]).toLocaleLowerCase();
    if (!value || seen.has(value)) return false;
    seen.add(value);
    return true;
  });
}

function makeChoiceQuestion(target, words, answerField, rng) {
  const candidates = distinctBy(words.filter((word) => word !== target && word[answerField] !== target[answerField]), answerField);
  const distractors = shuffle(candidates, rng).slice(0, 3);
  if (distractors.length < 3) return null;
  return {
    hanzi: target.hanzi,
    pinyin: target.pinyin,
    th: target.th,
    options: shuffle([
      { text: target[answerField], isCorrect: true },
      ...distractors.map((word) => ({ text: word[answerField], isCorrect: false })),
    ], rng),
  };
}

function buildQuestionSet(vocabulary, answerField, count, rng) {
  const words = normalizeVocabulary(vocabulary);
  if (distinctBy(words, answerField).length < 4) return [];
  const targets = [];
  while (targets.length < count) targets.push(...shuffle(words, rng));
  return targets.slice(0, count).map((target) => makeChoiceQuestion(target, words, answerField, rng)).filter(Boolean);
}

export function buildBlitzQuestions(vocabulary, count = GAME_ROUND_LIMITS.blitz, rng = Math.random) {
  if (typeof count === "function") return buildQuestionSet(vocabulary, "th", GAME_ROUND_LIMITS.blitz, count);
  return buildQuestionSet(vocabulary, "th", Math.max(1, Math.floor(finiteNumber(count, GAME_ROUND_LIMITS.blitz))), rng);
}

export function buildMatchCards(vocabulary, pairCount = 6, rng = Math.random) {
  const unique = distinctBy(distinctBy(normalizeVocabulary(vocabulary), "hanzi"), "th");
  const count = clamp(Math.floor(finiteNumber(pairCount, 6)), 1, unique.length);
  const words = shuffle(unique, rng).slice(0, count);
  return shuffle(words.flatMap((word, index) => [
    { id: `zh-${index}`, matchId: `pair-${index}`, type: "zh", content: word.hanzi, pinyin: word.pinyin },
    { id: `th-${index}`, matchId: `pair-${index}`, type: "th", content: word.th },
  ]), rng);
}

export function buildListenQuestions(vocabulary, optionCount = 4, rng = Math.random) {
  const words = normalizeVocabulary(vocabulary);
  if (words.length < optionCount) return null;
  const target = shuffle(words, rng)[0];
  const question = makeChoiceQuestion(target, words, "th", rng);
  if (!question) return null;
  return { ...question, options: question.options.slice(0, Math.max(2, optionCount)) };
}

export function buildListenQuestionSet(vocabulary, count = GAME_ROUND_LIMITS.sprint, rng = Math.random) {
  return buildQuestionSet(vocabulary, "th", Math.max(1, Math.floor(finiteNumber(count, GAME_ROUND_LIMITS.sprint))), rng);
}

export function buildPinyinQuestions(vocabulary, count = GAME_ROUND_LIMITS.dash, rng = Math.random) {
  if (typeof count === "function") return buildQuestionSet(vocabulary, "pinyin", GAME_ROUND_LIMITS.dash, count);
  return buildQuestionSet(vocabulary, "pinyin", Math.max(1, Math.floor(finiteNumber(count, GAME_ROUND_LIMITS.dash))), rng);
}

function storage() {
  try {
    return globalThis.localStorage || null;
  } catch {
    return null;
  }
}

function safeSegment(value, fallback) {
  const segment = String(value || fallback).toLocaleLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "");
  return segment || fallback;
}

export function highScoreStorageKey(scope) {
  if (typeof scope === "string") return `huayun_g3_${safeSegment(scope, "game")}`;
  const level = safeSegment(scope?.level, "hsk1");
  const lesson = safeSegment(scope?.lessonId || scope?.lesson || scope?.slug, "lesson");
  const game = safeSegment(scope?.game || scope?.gameId, "game");
  return `huayun_g3_score_v2_${level}_${lesson}_${game}`;
}

function validScore(entry, index = 0) {
  if (!entry || typeof entry !== "object") return null;
  const score = Math.max(0, Math.floor(finiteNumber(entry.score)));
  const stars = clamp(Math.floor(finiteNumber(entry.stars)), 0, 3);
  const accuracy = clamp(finiteNumber(entry.accuracy), 0, 100);
  return {
    runId: cleanText(entry.runId) || `legacy-${index}-${score}-${cleanText(entry.date)}`,
    name: cleanText(entry.name).slice(0, 32) || "Learner",
    score,
    stars,
    accuracy,
    date: Number.isNaN(Date.parse(entry.date)) ? "1970-01-01T00:00:00.000Z" : new Date(entry.date).toISOString(),
  };
}

export function rankHighScores(scores) {
  const byRun = new Map();
  (Array.isArray(scores) ? scores : []).forEach((entry, index) => {
    const valid = validScore(entry, index);
    if (!valid) return;
    const previous = byRun.get(valid.runId);
    if (!previous || valid.score > previous.score) byRun.set(valid.runId, valid);
  });
  return [...byRun.values()].sort((left, right) =>
    right.score - left.score || right.stars - left.stars || right.accuracy - left.accuracy || left.date.localeCompare(right.date) || left.runId.localeCompare(right.runId)
  ).slice(0, 5);
}

export function loadHighScores(scope) {
  try {
    const raw = storage()?.getItem(highScoreStorageKey(scope));
    return rankHighScores(raw ? JSON.parse(raw) : []);
  } catch {
    return [];
  }
}

export function saveHighScore(scope, scoreData) {
  const scores = rankHighScores([...loadHighScores(scope), scoreData]);
  try {
    storage()?.setItem(highScoreStorageKey(scope), JSON.stringify(scores));
  } catch {
    // Private browsing and storage policies must not break game completion.
  }
  return scores;
}

export function resetHighScores(scope) {
  try {
    storage()?.removeItem(highScoreStorageKey(scope));
    return true;
  } catch {
    return false;
  }
}

export function loadPlayerName(fallback = "Learner") {
  try {
    return cleanText(storage()?.getItem("huayun_g3_player_name")).slice(0, 32) || fallback;
  } catch {
    return fallback;
  }
}

export function createGameRunId(gameId = "game") {
  const random = globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return `${safeSegment(gameId, "game")}-${random}`;
}
