# Milestone 2 Handoff Report: Hero Layout & Single-Screen Responsiveness

**Date**: 2026-08-19  
**Agent**: Worker M2_1  
**Working Directory**: `/home/pisitpong/group3-standalone/.agents/worker_m2_1`  
**Target Milestone**: M2 (Hero Layout & Single-Screen Responsiveness)  

---

## 1. Observation

Direct observations from source code and runtime inspection:
- In `source/src/surfaces/group-3-8104/styles/tokens-shell.css:187`, the home header `.g3-header.is-home` sets `min-height: 88px;`.
- In `source/src/surfaces/group-3-8104/styles/home-enhancements.css:496`, `.g3-home.is-single-screen` was setting `height: calc(100dvh - 4.5rem);` (72px offset) and `max-height: calc(100dvh - 4.5rem);`, creating an immediate 16px vertical overflow beyond the 800px viewport boundary (`88px + 728px = 816px > 800px`).
- In `source/src/surfaces/group-3-8104/styles/home-single-screen.css:223`, `.g3-home.is-single-screen` was setting `height: calc(100svh - 70px); min-height: 540px;` (stale 70px offset).
- In `source/src/surfaces/group-3-8104/styles/home-enhancements.css:508`, `.g3-home.is-single-screen .g3-home-hero` defined `grid-template-rows: minmax(0, 1fr) auto;`, generating an empty phantom row track that distorted vertical alignment.
- In `source/src/surfaces/group-3-8104/styles/home-single-screen.css:510`, `.g3-manga-viewport` enforced `min-height: 32.5rem;` (520px) and `max-height: min(72vh, 41.25rem);`, which crowded out the pagination dots on standard 1280×800 screens and pushed them below the fold where `overflow: hidden` clipped them off.
- In `source/src/surfaces/group-3-8104/styles/home-single-screen.css:372-378`, `.g3-home-carousel-dots` had `gap: 0.6rem; margin-top: 0.85rem;`.
- In `source/src/surfaces/group-3-8104/styles/home-single-screen.css:268, 281`, `.g3-home-sub` had `margin: 1.6rem 0 0;` and `.g3-home-cta-row` had `margin-top: 1.75rem;`, which compounded redundantly with the column flex gap of `0.75rem`.
- In `source/src/surfaces/group-3-8104/styles/home-single-screen.css:566`, `.g3-manga-scenario-title` lacked width clamping and text ellipsis, creating risk of collision with `.g3-vocab-pill` on medium desktop viewports.

---

## 2. Logic Chain

1. **Header Viewport Accounting**: Replacing the stale `4.5rem` / `70px` offsets with `88px` (`calc(100dvh - 88px)` and `calc(100svh - 88px); min-height: 480px;`) guarantees that the entire home container fits within `100vh` minus the real header height, eliminating the 16px–19px vertical overflow.
2. **Phantom Row Elimination**: Changing `grid-template-rows: minmax(0, 1fr) auto;` to `grid-template-rows: 1fr;` removes the empty second track, allowing the 2-column grid (`.g3-hero-copy` and `<HomeCarousel>`) to cleanly center and stretch without layout skew.
3. **Manga Viewport Scaling & Dot Protection**: Setting `.g3-manga-viewport` to `min-height: 320px; max-height: min(56vh, 460px); aspect-ratio: 16 / 10;` and adjusting `.g3-home-carousel-dots` to `gap: 0.5rem; margin-top: 0.5rem;` ensures the stage fits within 1280×800 and <=760px inner heights, preserving dot visibility above the fold.
4. **Margin Normalization**: Adding `.g3-home.is-single-screen .g3-home-sub { margin: 0; }` and `.g3-home.is-single-screen .g3-home-cta-row { margin-top: 0.35rem; }` prevents compounding spacing with the flex gap `0.75rem`, allowing the left column to scale fluidly without clipping.
5. **Top Bar / Vocab Pill Safety**: Adding `max-width: clamp(120px, 16vw, 240px); overflow: hidden; text-overflow: ellipsis; white-space: nowrap;` to `.g3-manga-scenario-title` prevents title text from colliding with the absolute-positioned `.g3-vocab-pill` on mid-size screens.
6. **Invariant Maintenance**: Line counts for both modified stylesheets (`home-enhancements.css`: 1045 lines <= 2300; `home-single-screen.css`: 1112 lines <= 1200) strictly satisfy the layout and complexity constraints.

---

## 3. Caveats

- No caveats. All changes strictly adhere to assigned file ownership (`home-enhancements.css` and `home-single-screen.css`) without modifying files outside scope.

---

## 4. Conclusion

Milestone 2 tasks are complete and fully verified:
- Corrected single screen height calculation to account for 88px header height.
- Eliminated phantom grid row in hero section.
- Fluidly scaled manga stage viewport (320px–460px, 16:10 aspect ratio) and tightened carousel dots spacing.
- Normalized hero copy and CTA margins under `.g3-home.is-single-screen`.
- Added overflow protection and ellipsis to scenario title.
- Preserved stylesheet line limit invariants (`home-enhancements.css`: 1045; `home-single-screen.css`: 1112).
- Zero test regressions across the full suite (104/104 pass) and clean Vite production build.

---

## 5. Verification Method

To independently verify:
```bash
# 1. Run full unit test suite
cd /home/pisitpong/group3-standalone/source && npm test

# 2. Run Vite production build
cd /home/pisitpong/group3-standalone/source && npm run build

# 3. Verify stylesheet line limits
wc -l /home/pisitpong/group3-standalone/source/src/surfaces/group-3-8104/styles/home-enhancements.css /home/pisitpong/group3-standalone/source/src/surfaces/group-3-8104/styles/home-single-screen.css
```
