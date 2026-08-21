# Implementer 1 Handoff Report — Group 3 Home Page UI/UX Regressions

## 1. Summary of Changes

Implemented all 5 requested UI/UX regression fixes on the Home page of 中文练习 (`group3-standalone`):

### R1. Fix Text Truncation in Heading
- **`home-enhancements.css`**: Removed `white-space: nowrap;` from `.g3-home-title-phrase`.
- **`StoryExperience.jsx`**: Wrapped the specific Thai word `สถานการณ์จริง` in `<span style={{ whiteSpace: "nowrap" }}>` to prevent unnatural word breaks while allowing natural browser wrapping of the full heading phrase on narrow viewports.

### R2. Fix Native Scrollbar Anomaly & Restore Audio Button
- **`home-enhancements.css` & `home-single-screen.css`**: Added `scrollbar-width: none; -ms-overflow-style: none;` and pseudo-element `::-webkit-scrollbar { display: none; }` to `.g3-manga-top-bar` to prevent native scrollbars from appearing at any viewport size.
- **`ScenarioMangaStage.jsx`**: Restored the `.g3-manga-audio-btn` speaker button inside `.g3-manga-subtitle-actions` within `.g3-manga-subtitle-box`. Wired speech synthesis handler (`speak()`) and character animation cue on click.

### R3. Rewrite Redundant Subtitle Copy
- **`src/surfaces/group-3-8104/content/copy.js`**: Updated `heroSubLine` (TH) to:
  `"ออกแบบสำหรับผู้เรียน HSK 1-3 จำลองบทสนทนาโต้ตอบพร้อมเสียงเจ้าของภาษา ให้คุณมั่นใจทุกการสื่อสาร"`

### R4. Fix Underline Misalignment
- **`ui-polish.css`**: Deleted the `.g3-hero-copy h1 span:last-child::after` pseudo-element underline rule.
- Applied native text decoration (`text-decoration: underline; text-decoration-skip-ink: auto; text-underline-offset: 0.15em; text-decoration-thickness: 0.12em; text-decoration-color: var(--g3-red, #cf3a27);`) to `.g3-hero-copy h1 span:last-child`, aligning the underline directly with the font baseline.

### R5. Remove Name Tag Outline
- **`home-enhancements.css`**: Ensured `.g3-manga-actor-name` has explicit `border: none;` and no border rule, eliminating any faint outline on character name tags like "大卫 (David)".

---

## 2. Verification Record

### Deep Verification (Ran Automated Test Suites & Production Build)
1. **Full Test Suite (`npm test`)**:
   - `tests/unit/group-3.games.test.js`
   - `tests/unit/mobile_group3_empirical.test.js`
   - `tests/unit/group-3.audio.test.js`
   - `tests/unit/theme-policy.test.js`
   - `tests/unit/standalone-boundary.test.js`
   - `tests/unit/group-3.autoplay-contract.test.js`
   - **Result**: 104 / 104 tests passing (0 failures, 0 regressions).

2. **Targeted Verification Suites**:
   - `npm test tests/unit/standalone-boundary.test.js`: 8/8 tests pass.
   - `npm test tests/unit/theme-policy.test.js`: 8/8 tests pass.
   - `npm test tests/unit/mobile_group3_empirical.test.js`: 9/9 tests pass across iPhone SE (320px), iPhone 8 (375px), iPhone 12/13 Pro (390px), iPhone XR (414px), Android Compact (360px).

3. **Production Vite Build Check (`npm run check`)**:
   - Vite bundle compiled in 1.46s with all chunks successfully rendered and minified.

---

## 3. Touched Files
- `source/src/surfaces/group-3-8104/features/catalog/StoryExperience.jsx`
- `source/src/surfaces/group-3-8104/features/catalog/ScenarioMangaStage.jsx`
- `source/src/surfaces/group-3-8104/content/copy.js`
- `source/src/surfaces/group-3-8104/styles/ui-polish.css`
- `source/src/surfaces/group-3-8104/styles/home-enhancements.css`
- `source/src/surfaces/group-3-8104/styles/home-single-screen.css`
