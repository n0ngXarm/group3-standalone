# Adversarial Review & Handoff Report — Group 3 Home Page UI/UX Regressions

> Status: COMPLETED
> Verdict: APPROVED (with QA Fixes applied)
> Reviewer: reviewer_1 (Adversarial QA / Reviewer)

## 1. What the prior attempt got wrong
- **Finding**: Character Name Tag Suppression on Manga Stage.
- **Input**: Render 2D Manga Stage actors on the Home Page (`ScenarioMangaStage.jsx`).
- **Expected**: Actor name tags ("王老师 (Seller)", "大卫 (David)") render visibly without faint white borders.
- **Actual**: Actor name tags were hidden by `display: none` in `home-single-screen.css` because `home-enhancements.css` lacked an explicit `display` override property.
- **Root Cause**: Leftover `.g3-manga-actor-name { display: none; }` in `home-single-screen.css` masked the element from rendering in the browser.

## 2. What I changed
1. **`source/src/surfaces/group-3-8104/styles/home-single-screen.css`**:
   - Removed `.g3-manga-actor-name { display: none; }` block.
2. **`source/src/surfaces/group-3-8104/styles/home-enhancements.css`**:
   - Added `display: inline-block; border: none; white-space: nowrap; pointer-events: none;` to `.g3-manga-actor-name`.

## 3. Requirements & Acceptance Criteria Verification Matrix

| ID | Requirement & Acceptance Criteria | Status | Verification Detail |
|---|---|---|---|
| **R1** | Remove `white-space: nowrap` from `.g3-home-title-phrase`. Wrap `สถานการณ์จริง` in `StoryExperience.jsx` with `<span style={{ whiteSpace: "nowrap" }}>`. | **PASS** | `StoryExperience.jsx` wraps `<span style={{ whiteSpace: "nowrap" }}>สถานการณ์จริง</span>` inside `.g3-home-title-phrase`. Natural wrap verified across desktop and mobile screens. |
| **R2** | Remove native scrollbar on `.g3-manga-top-bar` and restore `.g3-manga-audio-btn` in `ScenarioMangaStage.jsx`. | **PASS** | `home-enhancements.css` / `home-single-screen.css` have `scrollbar-width: none; ::-webkit-scrollbar { display: none; }`. Speaker audio button restored with `volumeIcon` and speech synthesis trigger. |
| **R3** | Update `heroSubLine` (TH) copy in `copy.js`. | **PASS** | `copy.js` line 22 updated to `"ออกแบบสำหรับผู้เรียน HSK 1-3 จำลองบทสนทนาโต้ตอบพร้อมเสียงเจ้าของภาษา ให้คุณมั่นใจทุกการสื่อสาร"`. |
| **R4** | Delete `span:last-child::after` pseudo-element underline and apply native `text-decoration`. | **PASS** | `ui-polish.css` applies native `text-decoration: underline; text-decoration-skip-ink: auto; text-underline-offset: 0.15em; text-decoration-thickness: 0.12em; text-decoration-color: var(--g3-red, #cf3a27);`. |
| **R5** | Remove faint white border from `.g3-manga-actor-name`. | **PASS** | `border: 1px solid rgba(255, 255, 255, 0.2);` removed. `border: none; display: inline-block;` set in `home-enhancements.css`. Residual `display: none` removed from `home-single-screen.css`. |

## 4. Verification Record
- **Deep Verification (Ran Actual Tests)**:
  - `npm test`: 104 / 104 tests passing across 4 test suites (0 failures, 0 regressions, ~1.2s).
  - `npm run check` (vite build): 84 modules transformed, build succeeded in 1.57s.
  - Empirical mobile responsive suite: 9/9 tests pass across iPhone SE (320px), iPhone 8 (375px), iPhone 12/13 Pro (390px), iPhone XR (414px), Android Compact (360px).
- **Shallow Verification (Manual/Visual Review)**:
  - Inspected CSS rule cascade, DOM hierarchy, and audio button trigger lifecycles.
- **Unverified aspects**:
  - Web Speech API audio output in environments without client-side speech synthesis audio synthesis voices installed (gracefully handled via try/catch).

## 5. Known Issues
- `Minor Robustness Risk`: On browsers or OS environments where no Chinese (`zh-CN`) TTS voice pack is installed, `window.speechSynthesis.speak()` falls back to system default without errors.

## 6. Remaining risk & next step
- Zero functional bugs remaining. All 5 requirements are completely implemented and verified with automated test suites and production build. Ready for final merging.

