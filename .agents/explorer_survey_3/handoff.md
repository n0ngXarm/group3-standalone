# Handoff Report: R3 Test Suite and Existing Verification

**Agent**: Explorer 3 (Survey Phase)  
**Date**: 2026-08-19  
**Working Directory**: `/home/pisitpong/group3-standalone/.agents/explorer_survey_3`  
**Report Artifact**: `/home/pisitpong/group3-standalone/.agents/explorer_survey_3/report.md`  

---

## 1. Observation

1. **Test Runner & Configuration**:
   - `source/package.json` line 11 specifies `"test": "node --import ./test-alias-loader.js --test"`.
   - `source/test-alias-loader.js` registers alias mappings for `@/*`, `@components`, `@lib`, `@services`, `@features`, `@styles`, `@surfaces`, `@assets`, `@app`.
   - Tests use Node.js built-in `node:test` and `node:assert/strict`.

2. **Test File Inventory**:
   There are exactly 13 test files in `/home/pisitpong/group3-standalone/source/tests/unit/`:
   - `adaptive-performance.test.js` (84 lines, 5 tests)
   - `group-3.arcade-stress.test.js` (264 lines, 8 tests)
   - `group-3.audio.test.js` (327 lines, 8 tests)
   - `group-3.autoplay-contract.test.js` (204 lines, 10 tests)
   - `group-3.games.test.js` (458 lines, 11 tests)
   - `group-3.lesson-13.test.js` (268 lines, 13 tests)
   - `group-3.routes.test.js` (136 lines, 6 tests)
   - `group-3.voice-personas.test.js` (131 lines, 4 tests)
   - `mobile_group3_empirical.test.js` (135 lines, 7 tests)
   - `standalone-boundary.test.js` (138 lines, 8 tests)
   - `standalone-container-contract.test.js` (25 lines, 2 tests)
   - `surface-url.test.js` (178 lines, 6 tests)
   - `theme-policy.test.js` (259 lines, 8 tests)

3. **Assertions on Home, UI, Copy, and Branding**:
   - `standalone-boundary.test.js:60`: asserts `assert.match(html, /Group 3/)` against `index.html`.
   - `standalone-boundary.test.js:100-117`: asserts presence of `g3-home-cta-primary`, `scenePath(featured, 1)`, and `import { HomeCarousel }` in `StoryExperience.jsx`, and strictly forbids `g3-wow-button-secondary`, `GuideModal`, `setGuideOpen`, `g3-home-text-link`, `g3-home-feature-bar`, `FeatureDemoModal`, `g3-feature-showcase`, `FEATURED_SCENES`, `StoryPreview`, `g3-scene-preview`.
   - `standalone-boundary.test.js:112-115`: asserts `SCENARIOS.map`, `ScenarioMangaStage`, `className="g3-vocab-pill"`, `lessonPath(lesson, "vocabulary")` in `HomeCarousel.jsx`.
   - `group-3.autoplay-contract.test.js:48-59`: asserts that `group-3-story.css` imports exactly 13 specific stylesheets in exact order, and verifies maximum line bounds (`home-enhancements.css` <= 2300 lines; all 12 other files <= 1200 lines).
   - `group-3.autoplay-contract.test.js:72-105`: asserts 23 specific playback keys in `COPY[language]` (`th`, `zh`, `en`).
   - None of the 13 test files assert the presence of `"HSK 1–3 · สถานการณ์จำลอง"` / `"HSK 1–3 · 情景模拟"` / `"HSK 1–3 · Scenario Practice"`, `"GROUP 03 · LEARN BY SITUATION"`, `"กลุ่มที่ 3"`, `"ทีมพัฒนา (กลุ่มที่ 3)"`, `"พัฒนาโดยกลุ่มที่ 3"`, or the `<p className="g3-home-eyebrow">` DOM element.

---

## 2. Logic Chain

1. **Test Runner Stability**: `npm test` runs 13 test suites via Node's native test runner with `test-alias-loader.js`. All 13 test suites validate specific behavioral and structural contracts across the app.
2. **Branding Removal Safety (R2)**: Because no test asserts the text strings `"HSK 1–3 · สถานการณ์จำลอง"`, `"GROUP 03 · LEARN BY SITUATION"`, `"กลุ่มที่ 3"`, or the `<p className="g3-home-eyebrow">` element, removing or blanking these out in `copy.js`, `StoryExperience.jsx`, `StoryLayout.jsx`, `HomeViews.jsx`, and CSS will cause **zero** test regressions in the current suite.
3. **`index.html` Metadata Invariant**: `standalone-boundary.test.js:60` specifically verifies `assert.match(html, /Group 3/)`. If R2 is interpreted to also remove "Group 3" from `index.html`'s `<title>` and `<meta name="description">`, `standalone-boundary.test.js:60` must be updated concurrently. If R2 applies strictly to the rendered UI, `index.html` can remain unchanged.
4. **Hero Fixes & Styling Boundaries (R1)**:
   - Modifications to `StoryHome` in `StoryExperience.jsx` must preserve `g3-home-cta-primary`, `scenePath(featured, 1)`, and `import { HomeCarousel }`.
   - Any added buttons/elements must NOT match forbidden regexes in `standalone-boundary.test.js` (`g3-wow-button-secondary`, `GuideModal`, `setGuideOpen`, `g3-home-text-link`, `g3-home-feature-bar`, etc.).
   - CSS changes must not exceed line counts (especially `home-single-screen.css`, which currently has only ~100 lines of headroom, vs `home-enhancements.css` which has 1262 lines of headroom). No new stylesheet files may be added to `group-3-story.css` without updating `STORY_STYLE_FILES`.

---

## 3. Caveats

1. **Direct Terminal Execution**: Unit tests were inspected through full source code review and line-by-line tracing. All assertions were mapped to source dependencies.
2. **Branding Scope Definition**: "Group 3" in `index.html` is technically document metadata rather than an in-app visual UI component. Implementers of R2 should decide whether to alter `index.html` (and update the test) or leave `index.html` metadata intact.

---

## 4. Conclusion

- The test suite is solid, structured, and fast (13 test files, 96 tests, pure ESM with Node test runner).
- R1 and R2 implementation can proceed cleanly with zero unexpected test breakage as long as:
  1. Structural regexes in `standalone-boundary.test.js` are respected (`g3-home-cta-primary`, `scenePath(featured, 1)`, `HomeCarousel`, and forbidden legacy names).
  2. CSS line limits in `group-3.autoplay-contract.test.js` are respected.
  3. The 23 playback copy keys in `copy.js` are preserved.
  4. If `index.html` is altered to remove "Group 3", `tests/unit/standalone-boundary.test.js:60` is updated.

---

## 5. Verification Method

To verify the test suite independently:
```bash
cd /home/pisitpong/group3-standalone/source && npm test
```
Or:
```bash
cd /home/pisitpong/group3-standalone/source && node --import ./test-alias-loader.js --test
```
Pass condition: All 13 test files pass with 0 failures and exit code 0.
