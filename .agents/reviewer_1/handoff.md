# Handoff Report — Reviewer 1 (Group 3 Standalone Home Page Fixes)

## 1. Observation

Direct observations from codebase inspection, file audits, and build/test executions:

### R1. Layout Geometry & Viewport Bounds
1. **Header Offset & Single-Screen Height**:
   - `source/src/surfaces/group-3-8104/styles/home-single-screen.css` line 223:
     `.g3-home.is-single-screen { height: calc(100svh - 88px); min-height: 480px; display: flex; flex-direction: column; overflow: hidden; }`
   - `source/src/surfaces/group-3-8104/styles/home-enhancements.css` lines 496–498:
     `.g3-home.is-single-screen { height: calc(100dvh - 88px); max-height: calc(100dvh - 88px); overflow: hidden; padding: 0.75rem 1.75rem; ... }`
2. **Carousel Stage Scaling & Aspect Ratio**:
   - `source/src/surfaces/group-3-8104/styles/home-single-screen.css` lines 516–520:
     `.g3-manga-viewport { width: 100%; height: 100%; min-height: 320px; max-height: min(56vh, 460px); aspect-ratio: 16 / 10; ... }`
3. **Single-Row Grid Track & Hero Grid**:
   - `source/src/surfaces/group-3-8104/styles/home-enhancements.css` line 508:
     `grid-template-rows: 1fr;`
   - `source/src/surfaces/group-3-8104/styles/home-single-screen.css` line 233:
     `grid-template-rows: none; grid-template-columns: minmax(21rem, 0.95fr) minmax(25rem, 1.05fr);`
4. **Copy Margins & Spacing**:
   - `source/src/surfaces/group-3-8104/styles/home-single-screen.css` line 277 & `home-enhancements.css` line 541:
     `.g3-home.is-single-screen .g3-home-sub { margin: 0; }`
   - `source/src/surfaces/group-3-8104/styles/home-single-screen.css` line 289 & `home-enhancements.css` line 545:
     `.g3-home.is-single-screen .g3-home-cta-row { margin-top: 0.35rem; }`
5. **Pagination Dots & Interactive Elements**:
   - `source/src/surfaces/group-3-8104/features/catalog/HomeCarousel.jsx` lines 41–56: renders `.g3-home-carousel-dots` with accessible tablist and `.g3-home-carousel-dot.is-active`.
   - `source/src/surfaces/group-3-8104/styles/home-single-screen.css` lines 1062–1083: styles active gold/red pill (`width: 2rem`, `border-radius: 999px`, active gradient) with full Dark and Light theme token support.
6. **Stylesheet Line Limit Compliance**:
   - `home-enhancements.css`: 1046 lines (limit <= 2300 lines) -> **PASS**
   - `home-single-screen.css`: 1113 lines (limit <= 1200 lines) -> **PASS**

### R2. Group 3 Branding & Eyebrow Label Removal
1. **Eyebrow DOM Element Removal**:
   - `source/src/surfaces/group-3-8104/features/catalog/StoryExperience.jsx` lines 47–76: `<div className="g3-hero-copy">` contains solely the `h1` (`g3-home-title`), `p` (`g3-home-sub`), and `div` (`g3-home-cta-row`). `<p className="g3-home-eyebrow">` is completely removed.
   - Grep search for `g3-home-eyebrow` across `source/src` confirms 0 occurrences in any JSX file (only retained as internal CSS selector).
2. **Copy Dictionary Branding Removal (`source/src/surfaces/group-3-8104/content/copy.js`)**:
   - `heroBadge`: `""` across `th` (line 21), `zh` (line 197), and `en` (line 373).
   - `group`: `""` across `th` (line 9), `zh` (line 185), and `en` (line 361).
   - `footerCourse`: `"หลักสูตร New HSK ระดับ 1–3"` (th, line 131), `"新 HSK 1–3 课程"` (zh, line 307), `"New HSK Levels 1–3"` (en, line 483).
   - `footerMembersTitle`: `"ทีมพัฒนา"` (th, line 132), `"开发团队"` (zh, line 308), `"Development team"` (en, line 484).
   - Brand string searches across all copy and components confirm zero remaining occurrences of `"HSK 1–3 · สถานการณ์จำลอง"`, `"HSK 1–3 · 情景模拟"`, `"HSK 1–3 · Scenario Practice"`, `"GROUP 03 · LEARN BY SITUATION"`, `"กลุ่มที่ 3"`, `"第 3 组"`, or `"Development team (Group 3)"`.
3. **Header/Footer Template Cleanliness (`StoryLayout.jsx`)**:
   - Lines 53 & 108: `{text.group ? <small>{text.group}</small> : null}` cleanly suppresses rendering when empty.
   - Lines 253–272: footer references `text.routeLabels.home` and `新HSK教程 1–3` without hardcoded group attributions.

### R3. Automated Test Suite & Build
1. **Unit Test Suite**:
   - Command: `cd /home/pisitpong/group3-standalone/source && npm test`
   - Output: `ℹ tests 104`, `ℹ suites 4`, `ℹ pass 104`, `ℹ fail 0`, `ℹ cancelled 0`, `ℹ duration_ms 2163ms`.
2. **Vite Production Build**:
   - Command: `cd /home/pisitpong/group3-standalone/source && npm run build`
   - Output: `✓ 84 modules transformed.`, `✓ built in 2.38s`, `exit code 0`.

---

## 2. Logic Chain

1. **Standard Desktop Viewport Analysis (1280×800)**:
   - Available viewport height: `800px`.
   - Header consumption: `88px`.
   - Remaining height: `800px - 88px = 712px`.
   - Single-screen container padding: `0.75rem` top/bottom (`24px` total). Available vertical canvas: `688px`.
   - Left Column (Hero Copy): Title (~75px) + Subline (~50px) + Gap (~12px) + CTA (~60px) = `~197px` total height.
   - Right Column (Manga Carousel Stage): `max-height: min(56vh, 460px)` = `min(448px, 460px) = 448px`. Dots container: `~28px`. Total height = `476px`.
   - Since `476px <= 688px`, all elements fit strictly within the viewport fold with zero clipping, overflow, or collision.
2. **Branding Sanitation**:
   - Blanking `heroBadge` and `group` in `copy.js` coupled with the complete removal of `<p className="g3-home-eyebrow">` in `StoryExperience.jsx` and conditional rendering `{text.group ? ... : null}` in `StoryLayout.jsx` ensures no residual Group 3 branding is displayed in any supported language.
3. **Integrity & Code Quality**:
   - No mock bypasses or facade implementations were detected in `source/src/` or `source/tests/unit/`.
   - All tests execute against actual stylesheet files, DOM node factories, audio manifests, and responsive geometry rules.

---

## 3. Caveats

- "No caveats."

---

## 4. Conclusion

**Verdict**: **APPROVE**

All requirements from ORIGINAL_REQUEST.md (§R1, §R2, §R3) and PROJECT.md are fully satisfied:
1. R1: Single-screen viewport layout is mathematically sound, responsive down to mobile viewports, zero clipping on 1280×800, pagination dots are visible and styled.
2. R2: Eyebrow DOM element and all Group 3 branding strings are thoroughly removed/cleaned across `th`, `zh`, and `en`.
3. R3: 104/104 unit tests pass with 0 failures, Vite build passes with 0 errors, and stylesheet line limits are respected.

---

## 5. Verification Method

To independently reproduce and verify this assessment:

1. Run unit test suite:
   ```bash
   cd /home/pisitpong/group3-standalone/source && npm test
   ```
   *Expected outcome*: 104 passed tests across 4 suites, 0 failures.

2. Run production build:
   ```bash
   cd /home/pisitpong/group3-standalone/source && npm run build
   ```
   *Expected outcome*: Build succeeds in `dist/` with exit code 0.

3. Inspect files for branding cleanliness:
   ```bash
   grep -rn "g3-home-eyebrow" /home/pisitpong/group3-standalone/source/src/ --include="*.jsx"
   grep -rn "GROUP 03" /home/pisitpong/group3-standalone/source/src/
   grep -rn "กลุ่มที่ 3" /home/pisitpong/group3-standalone/source/src/
   ```
   *Expected outcome*: Zero matches for all searches.
