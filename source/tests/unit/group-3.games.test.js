import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";

import { surfaceAssetPath } from "../../src/shared/lib/surface-url.js";
import { GROUP3_LESSONS } from "../../src/surfaces/group-3-8104/content/registry.js";
import {
  GROUP3_GAME_SLUGS,
  routeFromLocation,
} from "../../src/surfaces/group-3-8104/routing/routes.js";
import {
  GAME_DEFINITIONS,
  buildBlitzQuestions,
  buildListenQuestions,
  buildListenQuestionSet,
  buildMatchCards,
  buildPinyinQuestions,
  evaluateScore,
  highScoreStorageKey,
  lessonTitle,
  loadHighScores,
  rankHighScores,
  saveHighScore,
  shuffle,
} from "../../src/surfaces/group-3-8104/features/games/shared/gameData.js";

/*
P0/P1 contract list written before the assertions:
- P0: all 48 lesson builders return finite, exact, duplicate-free playable data.
- P0: injected RNG is deterministic, builders do not mutate vocabulary, and low vocab is safe.
- P0: scores stay finite within 0-100 and invalid totals normalize safely.
- P0: lesson/game storage scopes do not mix, malformed/blocked storage is safe, and ranking is deterministic top 5.
- P0: HSK1/2/3 game routes resolve and game source always has a finite results fallback.
- P1: current lesson titles/back paths, surface-aware responsive WebP references, and asset budgets stay intact.
- P1: hub/cards/intro/HUD/timer/status/exit use semantic native controls and ARIA contracts.
- P1: mobile does not receive an inline four-column pinyin grid and reduced motion remains supported.
- P1: micro-screen (<= 320px) touch targets enforce >= 44px height and >= 8px touch padding contracts.
- P1: Card Frenzy grid maintains 3-column scaling, 1:1 aspect ratio, and zero text truncation down to 320px.
- P1: option buttons scale for mobile viewports (2x2 / 1fr grid saving vertical fold space).
- P1: safe-area inset support (env(safe-area-inset-top/bottom)) is configured across headers, HUDs, and overlays.
- P1: GameResults sticky CTA button layout guarantees visible, full-width touch actions on mobile.
*/

const HERE = path.dirname(fileURLToPath(import.meta.url));
const FRONTEND_ROOT = path.resolve(HERE, "../..");
const GROUP3_SOURCE_ROOT = path.join(FRONTEND_ROOT, "src/surfaces/group-3-8104");
const GAME_SOURCE_ROOT = path.join(GROUP3_SOURCE_ROOT, "features/games");
const ASSET_ROOT = path.join(FRONTEND_ROOT, "public/assets/group3/games");

const GAME_COMPONENTS = [
  "vocab-blitz/VocabBlitzGame.jsx",
  "card-frenzy/CardFrenzyGame.jsx",
  "sound-sprint/SoundSprintGame.jsx",
  "pinyin-dash/PinyinDashGame.jsx",
];

const TIMED_GAME_COMPONENTS = [
  "vocab-blitz/VocabBlitzGame.jsx",
  "sound-sprint/SoundSprintGame.jsx",
  "pinyin-dash/PinyinDashGame.jsx",
];

const EXPECTED_ASSETS = ["vocab-blitz", "card-frenzy", "sound-sprint", "pinyin-dash"]
  .flatMap((name) => [`${name}/cover-640w.webp`, `${name}/cover-960w.webp`]);

function seededRng(initialSeed = 20260810) {
  let seed = initialSeed >>> 0;
  return () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
}

async function materializeLesson(entry) {
  return entry.load ? entry.load() : entry;
}

function assertChoiceSet(questions, expectedCount, label) {
  assert.equal(questions.length, expectedCount, `${label}: exact question count`);
  for (const [index, question] of questions.entries()) {
    assert.ok(question?.hanzi, `${label} question ${index + 1}: visible prompt`);
    assert.equal(question.options.length, 4, `${label} question ${index + 1}: exactly four options`);
    assert.equal(new Set(question.options.map((option) => option.text)).size, 4, `${label} question ${index + 1}: unique visible options`);
    assert.equal(question.options.filter((option) => option.isCorrect).length, 1, `${label} question ${index + 1}: one answer`);
  }
}

function webpDimensions(buffer) {
  assert.equal(buffer.toString("ascii", 0, 4), "RIFF");
  assert.equal(buffer.toString("ascii", 8, 12), "WEBP");
  const chunk = buffer.toString("ascii", 12, 16);
  if (chunk === "VP8 ") {
    assert.deepEqual([...buffer.subarray(23, 26)], [0x9d, 0x01, 0x2a]);
    return {
      width: buffer.readUInt16LE(26) & 0x3fff,
      height: buffer.readUInt16LE(28) & 0x3fff,
    };
  }
  if (chunk === "VP8L") {
    const bits = buffer.readUInt32LE(21);
    return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
  }
  if (chunk === "VP8X") {
    return { width: buffer.readUIntLE(24, 3) + 1, height: buffer.readUIntLE(27, 3) + 1 };
  }
  throw new Error(`Unsupported WebP chunk: ${chunk}`);
}

function memoryStorage() {
  const values = new Map();
  return {
    getItem: (key) => values.has(key) ? values.get(key) : null,
    setItem: (key, value) => values.set(key, String(value)),
  };
}

async function withLocalStorage(value, callback) {
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, "localStorage");
  Object.defineProperty(globalThis, "localStorage", { configurable: true, value });
  try {
    return await callback();
  } finally {
    if (descriptor) Object.defineProperty(globalThis, "localStorage", descriptor);
    else delete globalThis.localStorage;
  }
}

test("[P0] all 7 curated lesson builders create exact unique visible choices and card faces", async () => {
  assert.deepEqual(
    GROUP3_LESSONS.reduce((counts, lesson) => ({ ...counts, [lesson.level]: (counts[lesson.level] || 0) + 1 }), {}),
    { hsk1: 3, hsk2: 2, hsk3: 2 },
  );

  for (const entry of GROUP3_LESSONS) {
    const lesson = await materializeLesson(entry);
    const label = `${lesson.level}/${lesson.slug}`;
    assertChoiceSet(buildBlitzQuestions(lesson.vocabulary, 15, seededRng(11)), 15, `${label} blitz`);
    assertChoiceSet(buildListenQuestionSet(lesson.vocabulary, 12, seededRng(12)), 12, `${label} sprint`);
    assertChoiceSet(buildPinyinQuestions(lesson.vocabulary, 15, seededRng(13)), 15, `${label} dash`);

    const oneListen = buildListenQuestions(lesson.vocabulary, 4, seededRng(14));
    assert.ok(oneListen, `${label}: listen question exists`);
    assertChoiceSet([oneListen], 1, `${label} single listen`);

    const cards = buildMatchCards(lesson.vocabulary, 6, seededRng(15));
    assert.equal(cards.length, 12, `${label}: exactly six card pairs`);
    assert.equal(new Set(cards.map((card) => card.id)).size, 12, `${label}: unique card ids`);
    assert.equal(new Set(cards.map((card) => card.content)).size, 12, `${label}: unique visible card faces`);
    const pairs = Map.groupBy(cards, (card) => card.matchId);
    assert.equal(pairs.size, 6, `${label}: exactly six match ids`);
    for (const pair of pairs.values()) {
      assert.deepEqual(pair.map((card) => card.type).sort(), ["th", "zh"], `${label}: pair has two distinct sides`);
    }
  }
});

test("[P0] RNG injection is repeatable, shuffle is non-mutating, and builders preserve vocabulary", async () => {
  const lesson = await materializeLesson(GROUP3_LESSONS.find((item) => item.level === "hsk3"));
  const snapshot = structuredClone(lesson.vocabulary);
  const first = buildBlitzQuestions(lesson.vocabulary, 15, seededRng(99));
  const second = buildBlitzQuestions(lesson.vocabulary, 15, seededRng(99));
  assert.deepEqual(first, second);
  assert.deepEqual(lesson.vocabulary, snapshot);

  const input = [1, 2, 3, 4, 5];
  const shuffled = shuffle(input, seededRng(8));
  assert.deepEqual(input, [1, 2, 3, 4, 5]);
  assert.notStrictEqual(shuffled, input);
});

test("[P0] low and invalid vocabulary returns finite safe pools", () => {
  const low = {
    a: { hanzi: "你", pinyin: "nǐ", th: "คุณ" },
    duplicate: { hanzi: "你", pinyin: "nǐ", th: "คุณ" },
    b: { hanzi: "好", pinyin: "hǎo", th: "ดี" },
    invalid: { hanzi: "", pinyin: "", th: "" },
  };
  assert.deepEqual(buildBlitzQuestions(low, 15, seededRng()), []);
  assert.deepEqual(buildListenQuestionSet(low, 12, seededRng()), []);
  assert.deepEqual(buildPinyinQuestions(low, 15, seededRng()), []);
  assert.equal(buildListenQuestions(low, 4, seededRng()), null);
  const cards = buildMatchCards(low, 6, seededRng());
  assert.equal(cards.length, 4);
  assert.equal(new Set(cards.map((card) => card.content)).size, cards.length);
  assert.deepEqual(buildMatchCards(null, 6, seededRng()), []);
});

test("[P0] evaluateScore clamps correct/accuracy and normalizes invalid totals", () => {
  const cases = [
    { correct: 8, total: 10, accuracy: 80, safeCorrect: 8, safeTotal: 10 },
    { correct: 999, total: 10, accuracy: 100, safeCorrect: 10, safeTotal: 10 },
    { correct: -5, total: 10, accuracy: 0, safeCorrect: 0, safeTotal: 10 },
    { correct: 2, total: 0, accuracy: 0, safeCorrect: 0, safeTotal: 0 },
    { correct: "bad", total: "bad", accuracy: 0, safeCorrect: 0, safeTotal: 0 },
    { correct: Infinity, total: -Infinity, accuracy: 0, safeCorrect: 0, safeTotal: 0 },
  ];
  for (const item of cases) {
    const score = evaluateScore(item.correct, item.total, "hsk3");
    assert.equal(score.accuracy, item.accuracy);
    assert.equal(score.correct, item.safeCorrect);
    assert.equal(score.total, item.safeTotal);
    assert.ok(Number.isFinite(score.accuracy) && score.accuracy >= 0 && score.accuracy <= 100);
    assert.ok(Number.isFinite(score.hskRef.simulatedScore));
  }
  assert.equal(evaluateScore(6, 10, "unknown").hskRef.level, "HSK1");
});

test("[P0] storage is lesson scoped, deterministic top 5, malformed-safe, and write-block safe", async () => {
  const firstScope = { level: "hsk1", lessonId: "lesson-1", game: "blitz" };
  const secondScope = { level: "hsk1", lessonId: "lesson-2", game: "blitz" };
  assert.notEqual(highScoreStorageKey(firstScope), highScoreStorageKey(secondScope));
  assert.notEqual(highScoreStorageKey(firstScope), highScoreStorageKey({ ...firstScope, game: "dash" }));

  await withLocalStorage(memoryStorage(), () => {
    const entries = Array.from({ length: 7 }, (_, index) => ({
      runId: `run-${index}`,
      name: `P${index}`,
      score: 100 + index,
      stars: index % 4,
      accuracy: 50 + index,
      date: new Date(Date.UTC(2026, 0, index + 1)).toISOString(),
    }));
    for (const entry of entries) saveHighScore(firstScope, entry);
    saveHighScore(firstScope, { ...entries[6], score: 999 });
    saveHighScore(secondScope, { ...entries[0], runId: "other", score: 500 });
    assert.deepEqual(loadHighScores(firstScope).map((entry) => entry.score), [999, 105, 104, 103, 102]);
    assert.deepEqual(loadHighScores(secondScope).map((entry) => entry.score), [500]);
  });

  const tied = rankHighScores([
    { runId: "b", score: 50, stars: 1, accuracy: 80, date: "2026-01-02T00:00:00.000Z" },
    { runId: "a", score: 50, stars: 1, accuracy: 80, date: "2026-01-01T00:00:00.000Z" },
  ]);
  assert.deepEqual(tied.map((entry) => entry.runId), ["a", "b"]);

  await withLocalStorage({ getItem: () => "{broken", setItem: () => {} }, () => {
    assert.deepEqual(loadHighScores(firstScope), []);
  });
  await withLocalStorage({ getItem: () => { throw new Error("blocked"); }, setItem: () => { throw new Error("blocked"); } }, () => {
    assert.deepEqual(loadHighScores(firstScope), []);
    assert.equal(saveHighScore(firstScope, { runId: "safe", score: 12 }).length, 1);
  });
});

test("[P0] HSK1, HSK2, and HSK3 game routes resolve to their current lesson", () => {
  for (const level of ["hsk1", "hsk2", "hsk3"]) {
    assert.deepEqual(
      routeFromLocation({ pathname: `/group3/home/${level}/lesson-1/games/`, search: "?theme=dark" }),
      { name: "games", level, lessonSlug: "lesson-1" },
    );
  }
});

test("[P1] lesson title/back contract and runtime game sources avoid undefined/null pool screens", async () => {
  assert.equal(lessonTitle({ title: { thAid: "บทไทย", zh: "中文", en: "English" } }, "th"), "บทไทย");
  assert.equal(lessonTitle({ title: { thAid: "บทไทย", zh: "中文", en: "English" } }, "zh"), "中文");
  assert.equal(lessonTitle({ title: { thAid: "บทไทย", zh: "中文", en: "English" } }, "en"), "English");
  assert.equal(lessonTitle({}, "en"), "—");

  const app = await readFile(path.join(GROUP3_SOURCE_ROOT, "Group3App.jsx"), "utf8");

  assert.match(app, /route\.name === "games" \|\| route\.name === "game"/);
  assert.match(app, /activeGame=\{route\.name === "game" \? route\.gameSlug : null\}/);
  assert.match(app, /onSelectGame=\{\(gameSlug\) => navigate\(gamePath\(lesson, gameSlug\)\)\}/);
  assert.match(app, /onShowHub=\{\(\) => navigate\(gamesPath\(lesson\)\)\}/);
  for (const component of GAME_COMPONENTS) {
    const source = await readFile(path.join(GAME_SOURCE_ROOT, component), "utf8");
    assert.doesNotMatch(source, /return\s+null\s*;/, `${component}: must not render a blank null pool`);
  }
  for (const component of TIMED_GAME_COMPONENTS) {
    const source = await readFile(path.join(GAME_SOURCE_ROOT, component), "utf8");
    assert.match(source, /if \(!(?:currentQuestion|question)\) return <GameResults/, `${component}: exhausted pool renders results`);
  }
});

test("[P1] game hub uses native buttons and surface-aware responsive image references", async () => {
  const hub = await readFile(path.join(GAME_SOURCE_ROOT, "hub/Group3GameHub.jsx"), "utf8");
  assert.deepEqual(GAME_DEFINITIONS.map((game) => game.slug), GROUP3_GAME_SLUGS);
  assert.deepEqual(GAME_DEFINITIONS.map(({ id, slug }) => [id, slug]), [
    ["blitz", "vocab-blitz"],
    ["frenzy", "card-frenzy"],
    ["sprint", "sound-sprint"],
    ["dash", "pinyin-dash"],
  ]);
  assert.match(hub, /"vocab-blitz": VocabBlitzGame/);
  assert.match(hub, /"card-frenzy": CardFrenzyGame/);
  assert.match(hub, /"sound-sprint": SoundSprintGame/);
  assert.match(hub, /"pinyin-dash": PinyinDashGame/);
  assert.match(hub, /data-game-id=\{game\.slug\}/);
  assert.match(hub, /onClick=\{\(\) => onSelectGame\(game\.slug\)\}/);
  assert.match(hub, /<button[\s\S]*?className="g3-arcade-card"/);
  assert.doesNotMatch(hub, /<div[^>]*onClick=/);
  assert.match(hub, /group3AssetPath\(`\$\{assetBase\}-960w\.webp`\)/);
  assert.match(hub, /`\/assets\/group3\/games\/\$\{definition\.asset\}\/cover`/);
  assert.match(hub, /imageSrcSet:/);
  assert.match(hub, /srcSet=\{game\.imageSrcSet\}/);
  assert.match(hub, /sizes="\(max-width: 700px\)/);
  assert.match(hub, /width="960"/);
  assert.match(hub, /height="540"/);
  assert.match(hub, /loading="lazy"/);

  const gatewayLocation = { hostname: "www.nongmodels.com", pathname: "/group3/home/hsk1/lesson-1/games", port: "", protocol: "https:" };
  assert.equal(surfaceAssetPath(3, "/assets/group3/games/vocab-blitz/cover-960w.webp", gatewayLocation), "/group3/assets/group3/games/vocab-blitz/cover-960w.webp");
});

test("[P1] production WebP assets have expected dimensions and stay within 160 KiB", async () => {
  for (const asset of EXPECTED_ASSETS) {
    const assetPath = path.join(ASSET_ROOT, asset);
    const [buffer, info] = await Promise.all([readFile(assetPath), stat(assetPath)]);
    const width = asset.includes("-640w") ? 640 : 960;
    const height = asset.includes("-640w") ? 360 : 540;
    assert.deepEqual(webpDimensions(buffer), { width, height }, asset);
    assert.ok(info.size > 0 && info.size <= 160 * 1024, `${asset}: ${info.size} bytes`);
  }

  const runtimeSources = await Promise.all([
    ...GAME_COMPONENTS,
    "shared/GameIntro.jsx",
    "shared/GameResults.jsx",
    "hub/Group3GameHub.jsx",
  ].map((file) => readFile(path.join(GAME_SOURCE_ROOT, file), "utf8")));
  assert.doesNotMatch(runtimeSources.join("\n"), /(?:card_frenzy|pinyin_dash|sound_sprint|vocab_blitz)\.jpg/i);
});

test("[P1] intro/HUD expose semantic timer, live status, native exit, and no inline four-column mobile lock", async () => {
  const intro = await readFile(path.join(GAME_SOURCE_ROOT, "shared/GameIntro.jsx"), "utf8");
  assert.match(intro, /<button[^>]*type="button"[^>]*onClick=\{start\}/);
  assert.match(intro, /<button[^>]*g3-game-exit[^>]*type="button"/);
  assert.match(intro, /role="progressbar"/);
  assert.match(intro, /aria-valuemin="0"/);
  assert.match(intro, /aria-valuenow=\{seconds\}/);
  const pausedStatus = intro.match(/<strong\b(?=[^>]*\brole="status")[^>]*>/)?.[0] || "";
  const hudLiveRegion = intro.match(/<p\b(?=[^>]*\bclassName="g3-game-live-status")[^>]*>/)?.[0] || "";
  assert.match(pausedStatus, /\brole="status"/);
  assert.match(hudLiveRegion, /\baria-live="polite"/);
  assert.match(hudLiveRegion, /\baria-atomic="true"/);

  const dash = await readFile(path.join(GAME_SOURCE_ROOT, "pinyin-dash/PinyinDashGame.jsx"), "utf8");
  assert.doesNotMatch(dash, /gridTemplateColumns|style=\{\{[^}]*grid/i);
  assert.match(dash, /copy\.turbo/);

  const css = await readFile(path.join(GROUP3_SOURCE_ROOT, "styles/games.css"), "utf8");
  assert.match(css, /@media \(max-width: 640px\)[\s\S]*?\.g3-pinyin-options[\s\S]*?grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\);/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(css, /\.g3-match-card\s*\{\s*transition:\s*none;/);
});

test("[P0] shared lifecycle separates session clocks from pausable round cleanup", async () => {
  const lifecycle = await readFile(path.join(GAME_SOURCE_ROOT, "shared/GameIntro.jsx"), "utf8");
  const timing = await readFile(path.join(GAME_SOURCE_ROOT, "shared/gameTiming.js"), "utf8");
  assert.match(lifecycle, /export function useGameSession\(\)/);
  assert.match(lifecycle, /export function usePausableScheduler\(paused\)/);
  assert.match(lifecycle, /export function usePausableGameClock\(\{/);
  assert.match(lifecycle, /stopChineseVoice\(\)/);
  assert.match(timing, /export function createPausableClock/);
  assert.match(timing, /export function createPausableScheduler/);
  assert.match(timing, /tasks\.forEach\(clearTaskTimer\)/);
  assert.match(timing, /if \(disposed\) return;/);

  for (const component of GAME_COMPONENTS) {
    const source = await readFile(path.join(GAME_SOURCE_ROOT, component), "utf8");
    assert.match(source, /useGameSession\(\)/, component + ": uses shared session reducer");
    assert.match(source, /usePausableScheduler\(paused\)/, component + ": uses pausable round scheduler");
    assert.match(source, /const enterResults = useCallback\(\(\) => \{[\s\S]*?invalidate(?:Audio)?\(\);[\s\S]*?complete\(\);/, component + ": cleans rounds before results");
    assert.match(source, /const exitGame = useCallback\(\(\) => \{[\s\S]*?invalidate(?:Audio)?\(\);[\s\S]*?exit\(\);[\s\S]*?onBack\(\);/, component + ": cleans rounds before exit");
    assert.match(source, /const prepareGame = useCallback\(\(\) => \{[\s\S]*?invalidate(?:Audio)?\(\);[\s\S]*?prepare\(\);/, component + ": cleans rounds before replay reset");
  }
});

test("[P1] micro-screen (<= 320px) touch targets enforce >= 44px height and >= 8px touch padding contracts", async () => {
  const css = await readFile(path.join(GROUP3_SOURCE_ROOT, "styles/games.css"), "utf8");

  assert.match(css, /\.g3-arcade-card\s*\{[\s\S]*?min-height:\s*48px;/);
  assert.match(css, /\.g3-game-primary,\s*\n?\.g3-game-secondary,\s*\n?\.g3-game-pause,\s*\n?\.g3-game-exit\s*\{[\s\S]*?min-height:\s*48px;/);
  assert.match(css, /\.g3-game-option\s*\{[\s\S]*?min-height:\s*64px;/);

  assert.match(css, /@media \(max-width: 640px\)[\s\S]*?\.g3-results-actions button,\s*\n?\s*\.g3-game-intro-actions button\s*\{\s*width:\s*100%;\s*min-height:\s*44px;/);
  assert.match(css, /@media \(max-width: 380px\)[\s\S]*?\.g3-game-option\s*\{\s*min-height:\s*48px;/);
  assert.match(css, /@media \(max-width: 380px\)[\s\S]*?\.g3-game-primary,\s*\n?\s*\.g3-game-secondary,\s*\n?\s*\.g3-game-pause,\s*\n?\s*\.g3-game-exit\s*\{\s*width:\s*100%;\s*min-height:\s*44px;/);

  assert.match(css, /\.g3-game-primary[\s\S]*?padding:\s*0\.7rem\s+1\.2rem;/);
  assert.match(css, /\.g3-game-option\s*\{[\s\S]*?padding:\s*0\.9rem\s+1rem;/);
  assert.match(css, /@media \(max-width: 380px\)[\s\S]*?\.g3-game-option\s*\{\s*min-height:\s*48px;\s*padding:\s*0\.65rem\s+0\.75rem;/);
});

test("[P1] Card Frenzy grid maintains 3-column scaling, 1:1 aspect ratio, and zero text truncation down to 320px", async () => {
  const css = await readFile(path.join(GROUP3_SOURCE_ROOT, "styles/games.css"), "utf8");
  const cardComponent = await readFile(path.join(GAME_SOURCE_ROOT, "card-frenzy/CardFrenzyGame.jsx"), "utf8");

  assert.match(css, /\.g3-match-grid\s*\{[\s\S]*?grid-template-columns:\s*repeat\(4,\s*minmax\(0,\s*1fr\)\);/);
  assert.match(css, /@media \(max-width: 640px\)[\s\S]*?\.g3-match-grid\s*\{\s*grid-template-columns:\s*repeat\(3,\s*minmax\(0,\s*1fr\)\);/);
  assert.match(css, /@media \(max-width: 380px\)[\s\S]*?\.g3-match-grid\s*\{\s*grid-template-columns:\s*repeat\(3,\s*minmax\(0,\s*1fr\)\);\s*gap:\s*0\.35rem;/);

  assert.match(css, /\.g3-match-card\s*\{[\s\S]*?aspect-ratio:\s*1;/);

  assert.match(css, /\.g3-match-card-back\s*\{[\s\S]*?overflow-wrap:\s*anywhere;/);
  assert.match(cardComponent, /g3-match-card-back type-\$\{card\.type\}/);
});

test("[P1] option buttons scale for mobile viewports (2x2 / 1fr grid saving vertical fold space)", async () => {
  const css = await readFile(path.join(GROUP3_SOURCE_ROOT, "styles/games.css"), "utf8");
  const blitz = await readFile(path.join(GAME_SOURCE_ROOT, "vocab-blitz/VocabBlitzGame.jsx"), "utf8");
  const sprint = await readFile(path.join(GAME_SOURCE_ROOT, "sound-sprint/SoundSprintGame.jsx"), "utf8");
  const dash = await readFile(path.join(GAME_SOURCE_ROOT, "pinyin-dash/PinyinDashGame.jsx"), "utf8");

  assert.match(blitz, /className="g3-game-options"/);
  assert.match(sprint, /className="g3-game-options"/);
  assert.match(dash, /className="g3-game-options g3-pinyin-options"/);

  assert.match(css, /\.g3-game-options\s*\{\s*display:\s*grid;\s*grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\);/);
  assert.match(css, /\.g3-pinyin-options\s*\{\s*grid-template-columns:\s*repeat\(4,\s*minmax\(0,\s*1fr\)\);/);

  assert.match(css, /@media \(max-width: 640px\)[\s\S]*?\.g3-game-options[\s\S]*?grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\);/);
  assert.match(css, /@media \(max-width: 640px\)[\s\S]*?\.g3-pinyin-options[\s\S]*?grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\);/);

  assert.match(css, /\.g3-game-option\s*\{[\s\S]*?overflow-wrap:\s*anywhere;/);
});

test("[P1] safe-area inset support (env(safe-area-inset-top/bottom)) is configured across headers, HUDs, and overlays", async () => {
  const responsiveCss = await readFile(path.join(GROUP3_SOURCE_ROOT, "styles/responsive.css"), "utf8");

  assert.match(responsiveCss, /min-height:\s*calc\(68px\s*\+\s*env\(safe-area-inset-top\)\);/);
  assert.match(responsiveCss, /padding:\s*calc\(0\.5rem\s*\+\s*env\(safe-area-inset-top\)\)/);

  assert.match(responsiveCss, /\.g3-reader\s*\{[\s\S]*?min-height:\s*calc\(100svh\s*-\s*68px\s*-\s*env\(safe-area-inset-top\)\);/);
  assert.match(responsiveCss, /\.g3-reader-controls\s*\{[\s\S]*?bottom:\s*max\(0\.5rem,\s*env\(safe-area-inset-bottom\)\);/);

  assert.match(responsiveCss, /\.g3-challenge\s*\{[\s\S]*?max-height:\s*calc\(100dvh\s*-\s*env\(safe-area-inset-top\)\);/);
  assert.match(responsiveCss, /\.g3-challenge\s*\{[\s\S]*?padding-bottom:\s*env\(safe-area-inset-bottom\);/);
});

test("[P1] GameResults sticky CTA button layout guarantees visible, full-width touch actions on mobile", async () => {
  const css = await readFile(path.join(GROUP3_SOURCE_ROOT, "styles/games.css"), "utf8");
  const resultsComponent = await readFile(path.join(GAME_SOURCE_ROOT, "shared/GameResults.jsx"), "utf8");

  assert.match(resultsComponent, /className="g3-results-actions"/);
  assert.match(resultsComponent, /button className="g3-game-primary"[\s\S]*?\{copy\.playAgain\}/);
  assert.match(resultsComponent, /button className="g3-game-secondary"[\s\S]*?\{copy\.backHub\}/);

  assert.match(css, /@media \(max-width: 640px\)[\s\S]*?\.g3-results-actions,\s*\n?\s*\.g3-game-intro-actions\s*\{\s*flex-direction:\s*column;\s*width:\s*100%;\s*\}/);
  assert.match(css, /@media \(max-width: 640px\)[\s\S]*?\.g3-results-actions button,\s*\n?\s*\.g3-game-intro-actions button\s*\{\s*width:\s*100%;\s*min-height:\s*44px;\s*\}/);
  assert.match(css, /@media \(max-width: 380px\)[\s\S]*?\.g3-game-primary,\s*\n?\s*\.g3-game-secondary,\s*\n?\s*\.g3-game-pause,\s*\n?\s*\.g3-game-exit\s*\{\s*width:\s*100%;\s*min-height:\s*44px;\s*\}/);
});
