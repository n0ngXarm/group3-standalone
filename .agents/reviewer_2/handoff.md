# Review & Adversarial Critic Report: Group 3 Standalone Home Page Fixes

**Reviewer**: Reviewer 2 (`reviewer_2`)  
**Roles**: reviewer, critic  
**Target Milestone**: M3 (Verification, Review, and Invariant Audit)  
**Date**: 2026-08-19  
**Verdict**: **APPROVE**

---

## 1. Observation

Direct observations and evidence collected from codebase inspection, invariant bounds verification, and execution:

### 1.1 Stylesheet Line Limits & Entrypoint Invariants
- Direct line counts for all stylesheets in `source/src/surfaces/group-3-8104/styles/`:
  - `home-single-screen.css`: **1,112 lines** (Contract bound: <= **1,200 lines** -> **PASS**)
  - `home-enhancements.css`: **1,045 lines** (Contract bound: <= **2,300 lines** -> **PASS**)
  - `tokens-shell.css`: 894 lines (<= 1200 -> PASS)
  - `catalog.css`: 319 lines (<= 1200 -> PASS)
  - `reader.css`: 835 lines (<= 1200 -> PASS)
  - `challenges.css`: 483 lines (<= 1200 -> PASS)
  - `responsive.css`: 643 lines (<= 1200 -> PASS)
  - `playback.css`: 265 lines (<= 1200 -> PASS)
  - `compatibility.css`: 206 lines (<= 1200 -> PASS)
  - `roleplay.css`: 545 lines (<= 1200 -> PASS)
  - `role-picker-responsive.css`: 265 lines (<= 1200 -> PASS)
  - `ui-polish.css`: 1,043 lines (<= 1200 -> PASS)
  - `home.css`: 911 lines (<= 1200 -> PASS)
  - Total across all 13 stylesheets: 8,989 lines.
- `group-3-story.css` imports all 13 stylesheets in the exact expected sequence specified by `group-3.autoplay-contract.test.js`.

### 1.2 Automated Test Suite Execution
- Running `cd /home/pisitpong/group3-standalone/source && npm test` resulted in:
  - **104 tests passed**, **0 failed**, 0 cancelled, 0 skipped, 0 todo across **4 suites**.
  - Verified tests include:
    - `group-3.autoplay-contract.test.js` (including style bounds, entrypoint order, playback config)
    - `standalone-boundary.test.js` (surface containment, local media, package exclusion, metadata, hero layers, ability-led HSK selector, dev server base, React root reuse)
    - `mobile_group3_empirical.test.js` (mobile viewports 320px–414px, touch target sizes, safe area insets)
    - `group-3.audio.test.js`, `group-3.games.test.js`, `group-3.arcade-stress.test.js`, `group-3.lesson-13.test.js`, `group-3.routes.test.js`, `group-3.voice-personas.test.js`, `surface-url.test.js`, `theme-policy.test.js`, `adaptive-performance.test.js`, `standalone-container-contract.test.js`.

### 1.3 Production Build Execution
- Running `cd /home/pisitpong/group3-standalone/source && npm run build` completed successfully:
  - 84 modules transformed.
  - Production bundles generated cleanly in `dist/` (HTML, JS, CSS) in ~2.8s.

### 1.4 Branding and Eyebrow Removal Verification (§R2)
- In `StoryExperience.jsx`: `<p className="g3-home-eyebrow">` element was completely removed from the JSX tree.
- In `copy.js`: `heroBadge: ""` and `group: ""` across `th`, `zh`, and `en`.
- In `copy.js`: `footerCourse` ("หลักสูตร New HSK ระดับ 1–3", "新 HSK 1–3 课程", "New HSK Levels 1–3") and `footerMembersTitle` ("ทีมพัฒนา", "开发团队", "Development team") cleaned of Group 3 numbering and references across all 3 languages.
- In `StoryLayout.jsx`: Brand subtitle rendered with `{text.group ? <small>{text.group}</small> : null}`, preventing empty `<small>` DOM nodes when `group` is empty.

### 1.5 Viewport & Layout Sizing Verification (§R1)
- Header offset corrected to 88px (`calc(100dvh - 88px)` and `calc(100svh - 88px)`), matching `.g3-header.is-home` min-height of 88px.
- Manga viewport scaled to `min-height: 320px; max-height: min(56vh, 460px); aspect-ratio: 16 / 10;` with carousel dots margin reduced to `0.5rem`, ensuring carousel pagination dots and scenario titles remain visible within standard desktop viewports (1280×800) under `overflow: hidden`.
- Normalized hero copy and CTA margins under `.g3-home.is-single-screen` to eliminate compounding vertical spacing.
- Scenario title protected with `max-width: clamp(120px, 16vw, 240px); overflow: hidden; text-overflow: ellipsis; white-space: nowrap;` against collision with `.g3-vocab-pill`.

---

## 2. Logic Chain

1. **Stylesheet Line Bound Contract**: `group-3.autoplay-contract.test.js` sets a maximum line limit of 1,200 lines for general stylesheets and 2,300 lines for `home-enhancements.css`. Observations confirm `home-single-screen.css` is at 1,112 lines (<= 1,200) and `home-enhancements.css` is at 1,045 lines (<= 2,300), satisfying the contract.
2. **Standalone Boundary Contract**: `standalone-boundary.test.js` enforces that all surface references outside `group-3-8104` are absent, only Group 3 assets are packaged, and single-action CTA contracts are upheld. All assertions passed with 0 errors.
3. **Route Isolation (Story Reader & Game Hub)**:
   - CSS rules modified in `home-single-screen.css` and `home-enhancements.css` are explicitly prefixed with `.g3-home`, `.g3-manga-...`, `.g3-report-...`, `.g3-about-...`, or `.g3-vocab-pill`.
   - Header adjustments in `StoryLayout.jsx` discriminate between home (`is-home`) and inner routes (`/group3/story/`, `/group3/games/`).
   - All tests for Story Reader (`group-3.audio.test.js`, `group-3.lesson-13.test.js`, `ReadingTheatre.jsx`) and Game Hub (`group-3.games.test.js`, `group-3.arcade-stress.test.js`) executed and passed cleanly.
4. **Integrity Audit**: No mock cheats, hardcoded test overrides, or dummy implementations were found in source files. All changes represent genuine layout fixes and copy sanitization.

---

## 3. Adversarial Challenges & Stress Testing

### Challenge 1: Viewport Constraint at 1280×800 Desktop
- **Assumption Challenged**: Single-screen mode (`is-single-screen`) must fit both hero copy and 2D manga carousel stage + pagination dots within an 800px viewport without scrolling or clipping.
- **Stress Analysis**:
  - Total vertical space: 800px. Header height: 88px. Remaining container height: 712px.
  - Stage max height: `min(56vh, 460px)` = 448px. Dots height: 10px + 8px margin = 18px. Stage card total: ~466px.
  - Hero copy height: Title (~48px) + Subline (~36px) + CTA button (~60px) + gaps (~24px) = ~168px.
  - Both columns fit comfortably inside 712px with 0px vertical overflow.
- **Verdict**: PASS.

### Challenge 2: Mobile / Tablet Responsiveness
- **Assumption Challenged**: Single-screen desktop restrictions do not break mobile fluid layouts.
- **Stress Analysis**:
  - Single-screen desktop grid rules are guarded by `@media (min-width: 1024px)`.
  - Mobile viewports (320px to 640px) fall back to natural flow with full-width CTA and single-column stack.
  - `mobile_group3_empirical.test.js` tests 5 mobile viewports (iPhone SE 320x568, iPhone 8 375x667, iPhone 12/13 390x844, iPhone XR 414x896, Android 360x740), passing all touch target and safe area assertions.
- **Verdict**: PASS.

### Challenge 3: Header Subtitle Empty Node Bleed
- **Assumption Challenged**: When `text.group` is empty string (`""`), does the DOM still create an empty `<small>` element that shifts brand baseline alignment?
- **Stress Analysis**:
  - `StoryLayout.jsx` uses `{text.group ? <small>{text.group}</small> : null}` on both home and non-home headers.
  - When `text.group === ""`, React outputs `null` (no DOM node).
- **Verdict**: PASS.

---

## 4. Caveats

- Internal CSS selectors (e.g. `.g3-home-eyebrow`) remain in stylesheet files for backward selector compatibility; however, because the corresponding DOM elements were eliminated in `StoryExperience.jsx`, these CSS rules are inert.

---

## 5. Conclusion

**Verdict: APPROVE**

All acceptance criteria from `ORIGINAL_REQUEST.md`, architectural invariants from `PROJECT.md`, stylesheet boundary limits, and standalone test contracts are 100% met:
1. Stylesheet line limits: `home-single-screen.css` (1,112 <= 1,200) and `home-enhancements.css` (1,045 <= 2,300) pass.
2. Standalone boundary tests: `standalone-boundary.test.js` passes.
3. No side effects or regressions on Story Reader (`/group3/story/`) or Games (`/group3/games/`).
4. Full unit test suite passes: 104/104 tests pass with 0 failures. Production build passes cleanly.

---

## 6. Verification Method

To independently reproduce the verification:
```bash
# 1. Verify unit test suite (104 tests)
cd /home/pisitpong/group3-standalone/source && npm test

# 2. Verify Vite production build
cd /home/pisitpong/group3-standalone/source && npm run build

# 3. Verify stylesheet line limits
wc -l /home/pisitpong/group3-standalone/source/src/surfaces/group-3-8104/styles/home-single-screen.css \
      /home/pisitpong/group3-standalone/source/src/surfaces/group-3-8104/styles/home-enhancements.css
```
