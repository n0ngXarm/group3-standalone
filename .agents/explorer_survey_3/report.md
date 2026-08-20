# R3 Investigation Report: Test Suite and Existing Verification

**Author**: Explorer 3 (Survey Phase)  
**Date**: 2026-08-19  
**Target Workspace**: `/home/pisitpong/group3-standalone/source`  

---

## 1. Executive Summary

A comprehensive survey of the test infrastructure for Group 3 Standalone was conducted.
- **Test Runner**: Node.js built-in test runner (`node:test` + `node:assert/strict`) executed with custom module loader:
  ```bash
  cd /home/pisitpong/group3-standalone/source && npm test
  # Invokes: node --import ./test-alias-loader.js --test
  ```
- **Test Inventory**: 13 unit test files located in `tests/unit/`, comprising 96 test assertions/cases.
- **Current Status**: All test suites are structured to pass with 0 failures under the baseline code.
- **Key Impact on R1 & R2**:
  - Existing tests enforce structural invariants (regex checks on JSX files, CSS import order in `group-3-story.css`, CSS file line boundaries).
  - Removing visible strings ("HSK 1–3 · สถานการณ์จำลอง", "GROUP 03 · LEARN BY SITUATION", "กลุ่มที่ 3", "Development team (Group 3)", "第 3 组") from `copy.js` and JSX will **not** break existing tests, because current tests do not assert these branding strings.
  - Removing `<p className="g3-home-eyebrow">` from `StoryHome` (`StoryExperience.jsx`) is safe and unconstrained by tests.
  - **Caution 1**: `tests/unit/standalone-boundary.test.js:60` asserts `assert.match(html, /Group 3/)` against `index.html`. If "Group 3" is removed from `index.html`, this assertion must be updated.
  - **Caution 2**: `tests/unit/standalone-boundary.test.js:101-117` contains negative regexes that forbid certain legacy identifiers in `StoryExperience.jsx` (`g3-wow-button-secondary`, `GuideModal`, `setGuideOpen`, `g3-home-text-link`, `g3-home-feature-bar`, `FeatureDemoModal`, `g3-feature-showcase`, `FEATURED_SCENES`, `StoryPreview`, `g3-scene-preview`).
  - **Caution 3**: `tests/unit/group-3.autoplay-contract.test.js:48-59` asserts that `group-3-story.css` imports exactly 13 specific files in an exact order, and that each file stays under its line bound (`home-enhancements.css` <= 2300 lines; all other files <= 1200 lines).

---

## 2. Test Suite Architecture & Directory Layout

### 2.1 Test Execution Mechanics
- **Configuration** in `source/package.json`:
  ```json
  "scripts": {
    "test": "node --import ./test-alias-loader.js --test"
  }
  ```
- **Module Alias Resolution** via `source/test-alias-loader.js`:
  Resolves ES import specifiers (`@components`, `@features`, `@lib`, `@hooks`, `@services`, `@styles`, `@surfaces`, `@assets`, `@app`, `@/*`) to their relative filesystem locations under `src/`.

### 2.2 Complete Test Suite Inventory

| File Path (`tests/unit/`) | Test Domain / Purpose | Test Count | Touches Home / UI / Copy? |
|---|---|---|---|
| `adaptive-performance.test.js` | WebGL DPR caps, frame budgets, low-end device fallback | 5 | No |
| `group-3.arcade-stress.test.js` | Audio synth fallback, score bounds (0-100), storage edge cases, question builders | 8 | No |
| `group-3.audio.test.js` | Web Audio / SpeechSynthesis voice fallbacks, playback cancellation, timeout handling | 8 | No |
| `group-3.autoplay-contract.test.js` | CSS entrypoint `@import` order, CSS line boundaries, COPY keys, ReadingTheatre, StoryPlaybackDock | 10 | **Yes** (inspects `copy.js`, `group-3-story.css`, CSS line counts, `StoryExperience.jsx`) |
| `group-3.games.test.js` | 4 mini-games question generation, score calculation, storage scoping, route mapping, responsive touch target CSS | 11 | No |
| `group-3.lesson-13.test.js` | Registry of 7 curated lessons, PDF references, WebP scene images, audio manifest (54 MP3s), `Group3App.jsx` lazy loading, `StoryCatalog` | 13 | **Yes** (inspects `Group3App.jsx`, `StoryExperience.jsx`) |
| `group-3.routes.test.js` | Canonical URL routing, legacy URL aliases, gateway mounts (`/group3/`) | 6 | No |
| `group-3.voice-personas.test.js` | 28 voice persona signatures, speaker mappings, audio manifest checksums | 4 | No |
| `mobile_group3_empirical.test.js` | `Group3App.jsx` `#g3-main` container, `games.css` mobile queries, touch targets (44px/48px) | 7 | **Yes** (inspects `Group3App.jsx`) |
| `standalone-boundary.test.js` | Single-surface isolation, index.html metadata, Home hero background/layers, Home HSK selector & carousel | 8 | **Yes** (inspects `index.html`, `Group3App.jsx`, `StoryLayout.jsx`, `StoryExperience.jsx`, `HomeCarousel.jsx`, `ui-polish.css`) |
| `standalone-container-contract.test.js` | `nginx.conf` routing and `compose.yaml` port binding | 2 | No |
| `surface-url.test.js` | URL builder, query parameter normalization, gateway mount retainment | 6 | No |
| `theme-policy.test.js` | Theme initialization (`public/theme-init.js`), light fallback, storage/query override, `index.html` structure | 8 | **Yes** (inspects `index.html`) |
| **TOTAL** | **13 Test Suites** | **96 Tests** | |

---

## 3. Deep-Dive: Tests Directly Touching Home, Navigation, Copy, and Branding

### 3.1 `standalone-boundary.test.js`
This suite verifies that the standalone app is decoupled from central multi-group architecture and validates the simplified Home page contract:

1. **Metadata & Branding Assertion** (Lines 53–64):
   ```javascript
   test("standalone metadata and navigation expose Group 3 only", async () => {
     const html = await readFile(path.join(root, "index.html"), "utf8");
     const app = await readFile(path.join(root, "src/surfaces/group-3-8104/Group3App.jsx"), "utf8");
     const layout = await readFile(
       path.join(root, "src/surfaces/group-3-8104/shared/components/StoryLayout.jsx"),
       "utf8",
     );
     assert.match(html, /Group 3/);
     assert.doesNotMatch(html, /5 groups|5 กลุ่ม/);
     assert.doesNotMatch(app, /surfaceHref\("central"|onCentral=/);
     assert.doesNotMatch(layout, /surfaceHref\("central"|GROUP_MENU\.map/);
   });
   ```
   - **Critical note**: `assert.match(html, /Group 3/)` inspects `index.html`. If R2 removes "Group 3" from `index.html` (`<title>` or `<meta name="description">`), this test will fail unless the assertion is updated.

2. **Home Hero Layout & Character Layers** (Lines 66–83):
   ```javascript
   test("home hero renders independent background and character pose layers", async () => {
     const layout = await readFile(path.join(root, "src/surfaces/group-3-8104/shared/components/StoryLayout.jsx"), "utf8");
     const styles = await readFile(path.join(root, "src/surfaces/group-3-8104/styles/ui-polish.css"), "utf8");
     assert.doesNotMatch(layout, /onPointerMove|onPointerLeave|moveScene|resetScene/);
     assert.match(styles, /@keyframes g3-seller-action-frame/);
     assert.match(styles, /@keyframes g3-male-action-frame/);
     assert.match(styles, /@keyframes g3-female-action-frame/);
     assert.match(styles, /\.g3-anime-dialogue \{[^}]*bottom: 0;[^}]*right: 0;[^}]*left: 0;[^}]*width: auto;[^}]*max-width: none;[^}]*text-align: center;/s);
     assert.match(styles, /\.g3-anime-scene-mark \{[^}]*left: 1rem;/s);
     assert.doesNotMatch(layout, /g3-anime-voice-pulse/);
     assert.doesNotMatch(styles, /g3-anime-(?:camera|light-pass|scene-beat|voice-wave)/);
   });
   ```

3. **Home Selector & Carousel Invariants** (Lines 85–125):
   ```javascript
   test("home uses one ability-led HSK selector without lesson previews", async () => {
     const experience = await readFile(path.join(root, "src/surfaces/group-3-8104/features/catalog/StoryExperience.jsx"), "utf8");
     const carousel = await readFile(path.join(root, "src/surfaces/group-3-8104/features/catalog/HomeCarousel.jsx"), "utf8");
     const styles = await readFile(path.join(root, "src/surfaces/group-3-8104/styles/ui-polish.css"), "utf8");

     // Required elements in StoryExperience.jsx:
     assert.match(experience, /g3-home-cta-primary/);
     assert.match(experience, /scenePath\(featured, 1\)/);
     assert.match(experience, /import \{ HomeCarousel \}/);

     // Forbidden elements in StoryExperience.jsx:
     assert.doesNotMatch(experience, /className="g3-level-gate"/);
     assert.doesNotMatch(experience, /g3-wow-button-secondary|GuideModal|setGuideOpen/);
     assert.doesNotMatch(experience, /g3-home-text-link/);
     assert.doesNotMatch(experience, /g3-home-feature-bar|FeatureDemoModal|g3-feature-showcase/);
     assert.doesNotMatch(experience, /FEATURED_SCENES|StoryPreview|g3-scene-preview/);

     // Required elements in HomeCarousel.jsx:
     assert.match(carousel, /SCENARIOS\.map/);
     assert.match(carousel, /ScenarioMangaStage/);
     assert.match(carousel, /className="g3-vocab-pill"/);
     assert.match(carousel, /lessonPath\(lesson, "vocabulary"\)/);
   });
   ```

### 3.2 `group-3.autoplay-contract.test.js`
1. **Style Entrypoint and File Line Bounds** (Lines 22–59):
   ```javascript
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
   ];

   const STYLE_LINE_BOUNDS = { "home-enhancements.css": 2300 };
   ```
   - Verifies that `src/surfaces/group-3-8104/group-3-story.css` imports exactly these 13 files in this exact sequence.
   - Verifies that `home-enhancements.css` has <= 2300 lines and all other 12 files have <= 1200 lines.

   **Current Line Count Headroom**:
   - `home.css`: 912 lines (headroom: 288 lines)
   - `home-single-screen.css`: 1100 lines (headroom: 100 lines)
   - `home-enhancements.css`: 1038 lines (headroom: 1262 lines)
   - `ui-polish.css`: 1044 lines (headroom: 156 lines)

2. **Localization Keys Validation** (Lines 72–105):
   - Verifies that 23 specific playback keys exist and are non-empty across `th`, `zh`, `en` in `copy.js`:
     `["autoplayBegin", "manualBegin", "autoplayHint", "storyPlaybackControls", "playbackPlaying", "playbackPaused", "playbackChallenge", "playbackSoundBlocked", "lineProgress", "sceneProgress", "nowSpeaking", "upNext", "previousLine", "nextLine", "pausePlayback", "resumePlayback", "replayLine", "soundOn", "soundOff", "enableSound", "playbackSpeed", "showPlaybackDetails", "hidePlaybackDetails"]`
   - **Does NOT check** any branding keys (`heroBadge`, `group`, `footerCourse`, `footerMembersTitle`).

3. **Scene Briefing Entry Paths** (Lines 107–114):
   - In `StoryExperience.jsx`, asserts regexes `/onBegin\("autoplay"\)/`, `/onBegin\("manual"\)/`, `/text\.autoplayHint/`.

### 3.3 `group-3.lesson-13.test.js`
1. **Title & Brand Construction in `Group3App.jsx`** (Lines 201–214):
   - Asserts regexes:
     - `\? \`\${sceneTitle} · \${text.brand}\``
     - `\`\${frontTitles[route.name]} · \${lessonTitle} · \${text.brand}\``
   - Note: `text.brand` ("华韵 · HuaYun") is preserved and not targeted for removal.

2. **`StoryCatalog` in `StoryExperience.jsx`** (Lines 228–242):
   - Asserts retry & loading logic in `StoryCatalog`.

### 3.4 `mobile_group3_empirical.test.js`
1. **Route Visibility Invariant** (Lines 15–33):
   - Asserts `Group3App.jsx` contains `#g3-main` container directly rendering `{mainSuspense}` and does NOT include `<ScrollReveal`.

---

## 4. String Audit vs. Test Assertions

| Targeted Branding String (from R2) | Files Found | Asserted in Test Suite? | Impact on Tests When Removed |
|---|---|---|---|
| `"HSK 1–3 · สถานการณ์จำลอง"` | `copy.js:21`, `StoryExperience.jsx:51` (`<p className="g3-home-eyebrow">{text.heroBadge}</p>`) | **No test asserts this string** | Safe to remove / blank out. |
| `"HSK 1–3 · 情景模拟"` | `copy.js:197` | **No test asserts this string** | Safe to remove / blank out. |
| `"HSK 1–3 · Scenario Practice"` | `copy.js:373` | **No test asserts this string** | Safe to remove / blank out. |
| `<p className="g3-home-eyebrow">` | `StoryExperience.jsx:51` | **No test asserts this DOM element** | Safe to remove entire element from JSX. |
| `"GROUP 03 · LEARN BY SITUATION"` | `copy.js:9, 185, 361`, `StoryLayout.jsx:53, 108` (`<small>{text.group}</small>`) | **No test asserts this string** | Safe to remove / blank out. |
| `"กลุ่มที่ 3"` / `"ทีมพัฒนา (กลุ่มที่ 3)"` | `copy.js:132`, `HomeViews.jsx:18`, `StoryLayout.jsx:281` | **No test asserts this string** | Safe to remove / blank out. |
| `"หลักสูตร New HSK ระดับ 1–3 · พัฒนาโดยกลุ่มที่ 3"` | `copy.js:131` | **No test asserts this string** | Safe to remove / blank out. |
| `"新 HSK 1–3 课程 · 由第 3 组开发"` | `copy.js:307` | **No test asserts this string** | Safe to remove / blank out. |
| `"开发团队（第 3 组）"` | `copy.js:308` | **No test asserts this string** | Safe to remove / blank out. |
| `"New HSK Levels 1–3 · Built by Group 3"` | `copy.js:483` | **No test asserts this string** | Safe to remove / blank out. |
| `"Development team (Group 3)"` | `copy.js:484` | **No test asserts this string** | Safe to remove / blank out. |
| `"Group 3"` in `index.html` | `index.html:8, 9` | **YES** (`standalone-boundary.test.js:60`: `assert.match(html, /Group 3/)`) | If `index.html` title/description is changed to remove "Group 3", `standalone-boundary.test.js:60` assertion must be updated. |

---

## 5. Potential Test Failure Points & Guardrails for Implementation

1. **Do not exceed CSS line boundaries**:
   - `home-single-screen.css` has only ~100 lines of headroom (1100 / 1200). If adding extensive CSS for hero layout adjustments, place it in `home-enhancements.css` (which has 1262 lines of headroom, 1038 / 2300) or refactor cleanly within existing CSS rules.
2. **Do not change CSS import sequence in `group-3-story.css`**:
   - Must match `STORY_STYLE_FILES` in `group-3.autoplay-contract.test.js`.
3. **Do not re-introduce forbidden Home components in `StoryExperience.jsx`**:
   - Avoid creating components or class names matching: `GuideModal`, `setGuideOpen`, `g3-wow-button-secondary`, `g3-home-text-link`, `g3-home-feature-bar`, `FeatureDemoModal`, `g3-feature-showcase`, `FEATURED_SCENES`, `StoryPreview`, `g3-scene-preview`.
4. **Preserve mandatory Home elements in `StoryExperience.jsx`**:
   - `g3-home-cta-primary`, `scenePath(featured, 1)`, and `import { HomeCarousel }`.
5. **Preserve mandatory carousel elements in `HomeCarousel.jsx`**:
   - `SCENARIOS.map`, `ScenarioMangaStage`, `g3-vocab-pill`, and `lessonPath(lesson, "vocabulary")`.
6. **Preserve 23 guided playback keys in `copy.js`**:
   - Ensure none of the 23 keys tested in `group-3.autoplay-contract.test.js` are accidentally modified or deleted.

---

## 6. Verification Command & Procedure

To verify all test suites:
```bash
cd /home/pisitpong/group3-standalone/source && npm test
```
Or directly with Node:
```bash
cd /home/pisitpong/group3-standalone/source && node --import ./test-alias-loader.js --test
```
Expected result: **13 test files run, 0 failures, exit code 0**.
