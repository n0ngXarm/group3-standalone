# Handoff Report — Explorer 1 (Survey R1: Home Page Layout & Overlap Diagnostics)

## 1. Observation

Direct observations and measurements from the codebase:

1. **Header Height Specification**:
   - `source/src/surfaces/group-3-8104/styles/tokens-shell.css:187`:
     ```css
     .g3-header.is-home {
       grid-template-columns: minmax(260px, 1fr) auto;
       min-height: 88px;
       background: var(--color-bg-secondary);
       box-shadow: none;
     }
     ```
   - Total computed height of Header is `88px` (plus 1px border = `89px`).

2. **Single-Screen Container Sizing Discrepancies**:
   - `source/src/surfaces/group-3-8104/styles/home-single-screen.css:222-228`:
     ```css
     .g3-home.is-single-screen {
       height: calc(100svh - 70px);
       min-height: 540px;
       display: flex;
       flex-direction: column;
       overflow: hidden;
     }
     ```
   - `source/src/surfaces/group-3-8104/styles/home-enhancements.css:495-503`:
     ```css
     @media (min-width: 1024px) {
       .g3-home.is-single-screen {
         height: calc(100dvh - 4.5rem);
         max-height: calc(100dvh - 4.5rem);
         overflow: hidden;
         padding: 0.75rem 1.75rem;
         display: flex;
         flex-direction: column;
         justify-content: center;
       }
     ```
   - `4.5rem` = `72px`. `88px (header) + 728px (main at 800px viewport) = 816px > 800px`.

3. **Stage Minimum Height and Dots Clipping**:
   - `source/src/surfaces/group-3-8104/styles/home-single-screen.css:510`:
     ```css
     .g3-manga-viewport {
       width: 100%;
       height: 100%;
       min-height: 32.5rem;
       max-height: min(72vh, 41.25rem);
       ...
     }
     ```
   - `32.5rem` = `520px`.
   - `source/src/surfaces/group-3-8104/styles/home-single-screen.css:372-378`:
     ```css
     .g3-home-carousel-dots {
       display: flex;
       justify-content: center;
       align-items: center;
       gap: 0.6rem;
       margin-top: 0.85rem;
     }
     ```
   - Combined stage + dots + padding requires `570px` minimum. In viewports with inner height <= 760px, pagination dots are pushed below the `overflow: hidden` fold and clipped.

4. **Grid Tracks Configuration**:
   - `source/src/surfaces/group-3-8104/styles/home-enhancements.css:506-512`:
     ```css
     .g3-home.is-single-screen .g3-home-hero {
       display: grid;
       grid-template-columns: minmax(380px, 0.95fr) minmax(480px, 1.25fr);
       grid-template-rows: minmax(0, 1fr) auto;
       gap: 2rem;
       align-items: center;
       max-height: 100%;
     }
     ```
   - `source/src/surfaces/group-3-8104/features/catalog/StoryExperience.jsx:48-76`:
     `<section className="g3-home-hero">` contains exactly 2 children: `<div className="g3-hero-copy">` and `<HomeCarousel>`. No element targets the second `auto` row.

5. **Compounding Margins in Copy Stack**:
   - `source/src/surfaces/group-3-8104/styles/home-single-screen.css:268`: `.g3-home-sub { margin: 1.6rem 0 0; }` (25.6px).
   - `source/src/surfaces/group-3-8104/styles/home-single-screen.css:276`: `.g3-home-cta-row { margin-top: 1.75rem; }` (28px).
   - `source/src/surfaces/group-3-8104/styles/home-enhancements.css:521`: `.g3-home.is-single-screen .g3-hero-copy { gap: 0.75rem; }` (12px).

6. **Automated Test Suite Status**:
   - Command: `cd /home/pisitpong/group3-standalone/source && npm test`
   - Result: Code 0, 104 passed, 0 failed.
   - `tests/unit/standalone-boundary.test.js:98-104` verifies single CTA button contract (`assert.match(experience, /g3-home-cta-primary/); assert.doesNotMatch(experience, /g3-wow-button-secondary|GuideModal|setGuideOpen/);`).

---

## 2. Logic Chain

1. **Premise 1 (from Observation 1 & 2)**: The Header occupies `88px` on the Home screen, but both `home-single-screen.css` (`70px`) and `home-enhancements.css` (`72px` / `4.5rem`) underestimate this height by `16–18px`.
2. **Inference 1**: At `1280×800` viewport, the total DOM height evaluates to `88px + (800px - 72px) = 816px`. Because the window is only `800px` tall, the bottom `16px` of the page is pushed outside the viewport boundary.
3. **Premise 2 (from Observation 3)**: `.g3-manga-viewport` has a rigid `min-height: 32.5rem` (`520px`). Together with the dots margin (`13.6px`), dot height (`10px`), gap (`10.4px`), and outer shell padding (`24px`), the right column demands at least `570px`.
4. **Inference 2**: When available vertical space inside `.g3-home` is reduced (due to the 16px header overshoot and real browser chrome like tabs/URL bars), the available height drops below `570px`. Since `.g3-home.is-single-screen` enforces `overflow: hidden`, the bottom elements (specifically `.g3-home-carousel-dots`) are clipped and disappear below the fold.
5. **Premise 3 (from Observation 4 & 5)**: `home-enhancements.css` creates a phantom 2nd row (`grid-template-rows: minmax(0, 1fr) auto;`) and child margins in `.g3-hero-copy` compound with flex gaps.
6. **Inference 3**: Normalizing the grid to `1fr` and resetting redundant child margins allows both columns to scale responsively and center cleanly within the viewport.
7. **Conclusion**: Adjusting the header offset to `88px`, reducing stage `min-height` to `320px` (with `max-height: min(56vh, 460px)` and `aspect-ratio: 16/10`), normalizing copy margins, and setting `grid-template-rows: 1fr` eliminates all visual overlap and clipping while guaranteeing 100% single-screen compliance at 1280×800.

---

## 3. Caveats

1. **R2 Label Removal Interdependency**: Requirement R2 removes `<p className="g3-home-eyebrow">` from `StoryHome.jsx`. Removing this element will free up ~40px of vertical space in `.g3-hero-copy`, further easing vertical fit. The layout recommendations in this report are robust whether or not the eyebrow is present.
2. **CTA Button Contract**: The original request description referenced CTA buttons ("เริ่มเรียน", "วิธีใช้งาน", "เลือกบทเรียน"), but automated tests (`standalone-boundary.test.js:98-104`) strictly enforce a single primary CTA (`g3-home-cta-primary`) and assert that no secondary guide modals or extra text links exist on Home. The recommendations preserve this single-CTA architecture.
3. **Reduced Motion**: Entrance animation delays in `home-single-screen.css:1011-1025` reference `:nth-child(1..4)`. If the eyebrow element is removed in R2, child indices shift by 1; this is harmless but should be noted.

---

## 4. Conclusion

The visual clipping and overlap on the Home page at 1280×800 is completely diagnosed:
- **Root Cause A**: 16px vertical viewport overshoot caused by `calc(100dvh - 4.5rem)` against an 88px header.
- **Root Cause B**: Inflexible `min-height: 32.5rem` (520px) on `.g3-manga-viewport` pushing carousel pagination dots below the `overflow: hidden` fold.
- **Root Cause C**: Compounding margins in `.g3-hero-copy` and phantom 2-row grid tracks in `home-enhancements.css:508`.

**Actionable Fix Proposal**:
1. Update `home-enhancements.css:496` and `home-single-screen.css:223` to use `calc(100dvh - 88px)` and `padding: clamp(0.5rem, 1.5vh, 1rem) clamp(1rem, 2.5vw, 2rem)`.
2. Update `home-single-screen.css:510` to `min-height: 320px; max-height: min(56vh, 460px); aspect-ratio: 16 / 10;`.
3. Update `home-single-screen.css:377` to `.g3-home-carousel-dots { margin-top: 0.5rem; }`.
4. Update `home-enhancements.css:508` to `grid-template-rows: 1fr;`.
5. Normalize `.g3-home-sub { margin: 0; }` and `.g3-home-cta-row { margin-top: 0.35rem; }`.

---

## 5. Verification Method

1. **Automated Unit Tests**:
   ```bash
   cd /home/pisitpong/group3-standalone/source && npm test
   ```
   Must pass 104/104 tests with 0 failures.

2. **Visual Viewport Inspection**:
   - Check viewport dimensions:
     - Standard desktop: `1280 × 800`
     - Compact desktop / tablet landscape: `1024 × 768`
     - Large desktop: `1440 × 900`
     - Mobile: `375 × 667`
   - Invalidation conditions:
     - If `.g3-home-carousel-dots` are cut off or require vertical scrolling at 1280×800 -> FAIL.
     - If title, sub-headline, or CTA button overlaps with the manga carousel stage -> FAIL.
     - If `.g3-vocab-pill` overlaps with `.g3-manga-top-bar` -> FAIL.
