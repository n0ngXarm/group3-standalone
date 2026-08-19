import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

import { GROUP3_PLAYBACK_CONFIG } from "../../src/surfaces/group-3-8104/config.js";
import { COPY } from "../../src/surfaces/group-3-8104/content/copy.js";

/*
Test cases:
1. Guided playback configuration exposes finite, safe delays and supported speeds.
2. TH/ZH/EN all expose the complete autoplay control vocabulary.
3. The briefing offers explicit autoplay and manual entry modes.
4. ReadingTheatre owns audio cleanup, auto-scroll, transport, and challenge pause/resume state.
5. The new playback dock replaces the old sentence lens/manual footer in rendered source.
6. Responsive dock CSS preserves 44px controls, bottom safe-area placement, and reduced motion.
7. Manual speaker intent is isolated from autoplay cleanup and unrelated rerenders.
8. QTE and sentence-builder dialogs share heading focus, focus trapping, background inertness, and restoration.
9. Blocked playback has an explicit status and retry path with light-theme contrast overrides.
*/

const sourceRoot = new URL("../../src/surfaces/group-3-8104/", import.meta.url);
const STORY_STYLE_FILES = [
  "tokens-shell.css",
  "home.css",
  "home-single-screen.css",
  "catalog.css",
  "reader.css",
  "challenges.css",
  "responsive.css",
  "playback.css",
  "compatibility.css",
  "roleplay.css",
  "role-picker-responsive.css",
  "ui-polish.css",
  "home-enhancements.css",
  "home-features.css",
];

const   STYLE_LINE_BOUNDS = { "home-enhancements.css": 2300 };

async function source(path) {
  return readFile(new URL(path, sourceRoot), "utf8");
}

async function storyStyles() {
  return (await Promise.all(STORY_STYLE_FILES.map((file) => source(`styles/${file}`)))).join("\n");
}

test("Group 3 style entrypoint keeps ordered bounded feature styles", async () => {
  const entrypoint = await source("group-3-story.css");
  const imports = [...entrypoint.matchAll(/@import "\.\/styles\/([^\"]+)";/g)]
    .map((match) => match[1]);
  assert.deepEqual(imports, STORY_STYLE_FILES);

  for (const file of STORY_STYLE_FILES) {
    const css = await source(`styles/${file}`);
    const bound = STYLE_LINE_BOUNDS[file] || 1200;
    assert.ok(css.split("\n").length <= bound, `${file} stays within the ${bound}-line boundary`);
  }
});

test("guided playback configuration is finite, ordered, and immutable", () => {
  assert.equal(Object.isFrozen(GROUP3_PLAYBACK_CONFIG), true);
  assert.equal(Object.isFrozen(GROUP3_PLAYBACK_CONFIG.speedOptions), true);
  assert.deepEqual(GROUP3_PLAYBACK_CONFIG.speedOptions, [0.85, 1, 1.15]);
  assert.equal(GROUP3_PLAYBACK_CONFIG.defaultSpeed, 1);
  for (const key of ["audioTimeoutMs", "challengeDelayMs", "lineGapMs", "silentLineMs"]) {
    assert.equal(Number.isFinite(GROUP3_PLAYBACK_CONFIG[key]), true, key);
    assert.ok(GROUP3_PLAYBACK_CONFIG[key] > 0, key);
  }
});

test("all Group 3 languages expose complete guided playback copy", () => {
  const keys = [
    "autoplayBegin",
    "manualBegin",
    "autoplayHint",
    "storyPlaybackControls",
    "playbackPlaying",
    "playbackPaused",
    "playbackChallenge",
    "playbackSoundBlocked",
    "lineProgress",
    "sceneProgress",
    "nowSpeaking",
    "upNext",
    "previousLine",
    "nextLine",
    "pausePlayback",
    "resumePlayback",
    "replayLine",
    "soundOn",
    "soundOff",
    "enableSound",
    "playbackSpeed",
    "showPlaybackDetails",
    "hidePlaybackDetails",
  ];

  for (const language of ["th", "zh", "en"]) {
    for (const key of keys) {
      assert.equal(typeof COPY[language][key], "string", `${language}.${key}`);
      assert.notEqual(COPY[language][key].trim(), "", `${language}.${key}`);
    }
  }
});

test("scene briefing exposes autoplay and manual entry paths", async () => {
  const story = await source("features/catalog/StoryExperience.jsx");

  assert.match(story, /onBegin\("autoplay"\)/);
  assert.match(story, /onBegin\("manual"\)/);
  assert.match(story, /text\.autoplayHint/);
});

test("ReadingTheatre coordinates scrolling, transport, cleanup, and challenge resume", async () => {
  const theatre = await source("features/reader/ReadingTheatre.jsx");

  assert.match(theatre, /scrollIntoView\(\{[\s\S]*block: "center"/);
  assert.match(theatre, /prefers-reduced-motion: reduce/);
  assert.match(theatre, /document\.addEventListener\("visibilitychange"/);
  assert.match(theatre, /useEffect\(\(\) => \(\) => \{[\s\S]*stopChineseVoice\(\)/);
  assert.match(theatre, /openChallenge\(nextChallenge, true\)/);
  assert.match(theatre, /resumeAutoplay/);
  assert.match(theatre, /<StoryPlaybackDock/);
  assert.match(theatre, /onPrevious=\{previousLine\}/);
  assert.match(theatre, /onNext=\{nextLine\}/);
  assert.match(theatre, /onReplay=\{replayCurrentLine\}/);
  assert.match(theatre, /onTogglePlayback=\{togglePlayback\}/);
  assert.match(theatre, /controlsDisabled=\{Boolean\(challenge\)\}/);
});

test("rendered reader source uses the playback dock instead of the retired side lens", async () => {
  const [theatre, dock] = await Promise.all([
    source("features/reader/ReadingTheatre.jsx"),
    source("features/reader/playback/StoryPlaybackDock.jsx"),
  ]);

  assert.doesNotMatch(theatre, /className="g3-sentence-lens"/);
  assert.doesNotMatch(theatre, /className="g3-reader-controls"/);
  assert.match(dock, /className=\{`g3-playback-dock/);
  assert.match(dock, /role="progressbar"/);
  assert.match(dock, /aria-live="polite"/);
  assert.match(dock, /aria-pressed=\{isPlaying\}/);
  assert.match(dock, /aria-expanded=\{detailsOpen\}/);
});

test("responsive dock CSS protects touch size, safe areas, and reduced motion", async () => {
  const css = await storyStyles();
  const dockStart = css.indexOf("/* Story playback dock");
  assert.ok(dockStart >= 0);
  const dockCss = css.slice(dockStart);

  assert.match(dockCss, /min-width:\s*44px/);
  assert.match(dockCss, /min-height:\s*44px/);
  assert.match(dockCss, /env\(safe-area-inset-bottom\)/);
  assert.match(dockCss, /\.g3-playback-dock\s*\{[\s\S]*position: fixed/);
  assert.match(dockCss, /\.g3-playback-dock\s*\{[\s\S]*bottom: calc\(1rem \+ env\(safe-area-inset-bottom\)\)/);
  assert.match(dockCss, /\.g3-playback-dock-details\s*\{\s*display: none/);
  assert.match(dockCss, /\.g3-playback-dock\.is-details-open \.g3-playback-dock-details\s*\{/);
  assert.match(dockCss, /@media \(max-width: 700px\)[\s\S]*left: 0/);
  assert.match(dockCss, /@media \(max-width: 340px\)[\s\S]*grid-template-columns:\s*minmax\(0, 1fr\)/);
  assert.match(dockCss, /@media \(prefers-reduced-motion: reduce\)[\s\S]*transition: none/);
});

test("manual line playback is state-driven and isolated from autoplay cleanup", async () => {
  const theatre = await source("features/reader/ReadingTheatre.jsx");

  assert.match(theatre, /manualPlaybackSequenceRef/);
  assert.match(theatre, /setManualPlaybackIntent\(\{[\s\S]*revision:/);
  assert.match(theatre, /const intent = manualPlaybackIntent/);
  assert.match(theatre, /playback\.cancel\(\)/);
  assert.match(theatre, /queueManualPlayback\(index, voiceProfile\)/);
  assert.doesNotMatch(theatre, /queueManualPlayback\(index, voiceProfile\)[\s\S]{0,160}speakChinese/);
});

test("both challenge dialogs enforce modal focus and background isolation", async () => {
  const challenges = await source("features/reader/challenges/Challenges.jsx");

  assert.match(challenges, /function useChallengeDialog\(fallbackSelectors\)/);
  assert.match(challenges, /heading\.focus\(\)/);
  assert.match(challenges, /sibling\.setAttribute\("inert", ""\)/);
  assert.match(challenges, /sibling\.setAttribute\("aria-hidden", "true"\)/);
  assert.match(challenges, /event\.shiftKey/);
  assert.match(challenges, /isMeaningfulFocusTarget\(previousFocus\)/);
  assert.equal((challenges.match(/useChallengeDialog/g) || []).length, 3);
  assert.match(challenges, /id="g3-qte-title" tabIndex="-1"/);
  assert.match(challenges, /id="g3-builder-title" tabIndex="-1"/);
});

test("blocked playback exposes retry state and light-theme contrast overrides", async () => {
  const [theatre, dock, css] = await Promise.all([
    source("features/reader/ReadingTheatre.jsx"),
    source("features/reader/playback/StoryPlaybackDock.jsx"),
    storyStyles(),
  ]);

  assert.match(theatre, /soundBlocked \? "blocked" : playbackStatus/);
  assert.match(theatre, /if \(soundBlocked\) \{[\s\S]*setPlaybackRevision/);
  assert.match(dock, /blocked: text\.playbackSoundBlocked/);
  assert.match(dock, /className=\{soundBlocked \? "needs-attention"/);
  assert.match(css, /data-theme="light"[^\n]*button\.needs-attention[^\n]*\{[^}]*var\(--g3-red-deep\)/);
  assert.match(css, /data-theme="light"[^\n]*button\.is-active[^\n]*\{[^}]*var\(--g3-ink\)/);
});
