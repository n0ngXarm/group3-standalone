# Challenger 2 Handoff Report: Adversarial Verification of R1 (Hero Layout & Single-Screen Constraint)

## 1. Observation

### Codebase and Stylesheet Evidence

1. **Header Layout & Offset Geometry**:
   - `source/src/surfaces/group-3-8104/styles/tokens-shell.css` (lines 185–191):
     ```css
     .g3-header.is-home {
       grid-template-columns: minmax(260px, 1fr) auto;
       min-height: 88px;
       background: var(--color-bg-secondary);
       box-shadow: none;
     }
     ```
   - `source/src/surfaces/group-3-8104/styles/home-enhancements.css` (lines 495–503):
     ```css
     @media (min-width: 1024px) {
       .g3-home.is-single-screen {
         height: calc(100dvh - 88px);
         max-height: calc(100dvh - 88px);
         overflow: hidden;
         padding: 0.75rem 1.75rem;
         display: flex;
         flex-direction: column;
         justify-content: center;
       }
     ```
   - Verified that the header offset in the main single-screen container height strictly aligns with the header height: `88px` offset subtracted from `100dvh` / `100svh`.

2. **Hero Grid and Row Normalization**:
   - `source/src/surfaces/group-3-8104/styles/home-enhancements.css` (lines 505–512):
     ```css
     .g3-home.is-single-screen .g3-home-hero {
       display: grid;
       grid-template-columns: minmax(380px, 0.95fr) minmax(480px, 1.25fr);
       grid-template-rows: 1fr;
       gap: 2rem;
       align-items: center;
       max-height: 100%;
     }
     ```
   - Phantom grid row issue (`grid-template-rows: minmax(0, 1fr) auto;` from legacy `home.css:6`) is overridden with a single row `grid-template-rows: 1fr;`.

3. **Left Column Structure & Margin Normalization**:
   - `source/src/surfaces/group-3-8104/features/catalog/StoryExperience.jsx` (lines 48–64):
     - Renders `.g3-hero-copy` with:
       - `h1.g3-home-title.g3-wow-text`: `{text.heroTitleLine}`
       - `p.g3-home-sub`: `{text.heroSubLine}`
       - `div.g3-home-cta-row` containing primary CTA button: `{text.ctaStart}`
     - The `<p className="g3-home-eyebrow">` element has been completely removed from DOM.
   - `source/src/surfaces/group-3-8104/styles/home-enhancements.css` (lines 518–547):
     ```css
     .g3-home.is-single-screen .g3-hero-copy {
       display: flex;
       flex-direction: column;
       gap: 0.75rem;
     }
     .g3-home.is-single-screen .g3-hero-copy h1 {
       font-size: clamp(2.2rem, 3.2vw, 3.3rem);
       line-height: 1.12;
       margin: 0;
     }
     .g3-home.is-single-screen .g3-home-sub {
       margin: 0;
     }
     .g3-home.is-single-screen .g3-home-cta-row {
       margin-top: 0.35rem;
     }
     ```

4. **Right Column Manga Carousel & Stage Geometry**:
   - `source/src/surfaces/group-3-8104/features/catalog/HomeCarousel.jsx` (lines 28–58):
     - Stage card: `<ScenarioMangaStage />`
     - Absolute vocab pill: `<button className="g3-vocab-pill">` (pinned top right: `top: 0.85rem; right: 0.85rem; z-index: 12`)
     - Pagination dots: `<div className="g3-home-carousel-dots">`
   - `source/src/surfaces/group-3-8104/styles/home-enhancements.css` (lines 681–690):
     ```css
     .g3-manga-viewport {
       width: 100%;
       height: clamp(380px, 48vh, 520px);
       border-radius: 1.75rem;
       border: 1px solid var(--g3-line);
       background: #111;
       position: relative;
       overflow: hidden;
       box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.28);
     }
     ```
   - `source/src/surfaces/group-3-8104/styles/home-single-screen.css` (lines 380–386, 1062–1070):
     - Dot size: `height: 0.62rem;` (~10px), container gap: `0.5rem;` (8px), margin-top: `0.5rem;` (8px).

5. **Test Suite & Build Execution**:
   - `npm test`:
     - 104 tests passed, 0 failures, 0 skipped, duration 1.76s.
   - `npm run build`:
     - Built `dist/` in 1.89s, 84 modules transformed, 0 build errors.

---

## 2. Logic Chain

### Layout Geometry Math Across Target Viewports

```
+-------------------------------------------------------------------------------+
| Viewport Height (H)                                                           |
| ├── Header (.g3-header.is-home): 88px (Fixed)                                 |
| └── Single-Screen Container (.g3-home.is-single-screen): H - 88px             |
|     ├── Vertical Padding: 0.75rem * 2 = 24px (12px top, 12px bottom)          |
|     └── Available Hero Inner Height: (H - 88px) - 24px = H - 112px            |
+-------------------------------------------------------------------------------+
```

#### Viewport 1: 1280 × 800 (Standard Desktop — Baseline Constraint)
1. **Total Container Height**: `calc(100dvh - 88px)` = `800px - 88px` = **712px**.
2. **Inner Available Hero Height**: `712px - 24px padding` = **688px**.
3. **Left Column (`.g3-hero-copy`)**:
   - Title `h1`: `clamp(35.2px, 3.2vw (40.96px), 52.8px)` = `40.96px` font size. Line-height `1.12`.
     2 wrapped lines = `2 * (40.96px * 1.12)` = **91.75px**.
   - Flex gap: `0.75rem` = **12px**.
   - Sub-headline `p.g3-home-sub`: `1.05rem` (16.8px), line-height `1.75` (29.4px/line).
     ~3 wrapped lines = **88.2px**.
   - Flex gap + CTA row margin: `12px + 5.6px` = **17.6px**.
   - CTA primary button: `min-height: 3.5rem` = **56px**.
   - **Total Left Column Height**: `91.75 + 12 + 88.2 + 17.6 + 56` = **~265.6px**.
   - **Headroom**: `688px - 265.6px` = **+422.4px clearance** (160% headroom).
4. **Right Column (`.g3-home-carousel`)**:
   - Manga stage (`.g3-manga-viewport`): `clamp(380px, 48vh (384px), 520px)` = **384px**.
   - Dots container gap + margin: `10.4px + 8px` = **18.4px**.
   - Dots height: **10px**.
   - **Total Right Column Height**: `384px + 18.4px + 10px` = **412.4px**.
   - **Headroom**: `688px - 412.4px` = **+275.6px clearance** (66% headroom).
5. **Horizontal Fit**:
   - Available width: `1280px - 56px (padding)` = `1224px`.
   - Grid gap: `32px` (`2rem`).
   - Col 1 (min 380px): `514.7px` >= 380px.
   - Col 2 (min 480px): `677.3px` >= 480px.
   - Fits horizontally without triggering column wrapping.

#### Viewport 2: 1440 × 900 (Widescreen Desktop)
1. **Container Height**: `900px - 88px` = **812px** (Inner: **788px**).
2. **Left Column**:
   - `h1`: `3.2vw` = `46.08px` (2 lines = ~103px).
   - `sub`: ~88px.
   - `cta`: 56px + gaps (31.6px).
   - **Total Left Column Height**: **~278.6px** (Headroom: `788px - 278.6px` = **+509.4px**).
3. **Right Column**:
   - Stage: `clamp(380px, 48vh (432px), 520px)` = **432px**.
   - Dots + gap: `28.4px`.
   - **Total Right Column Height**: **460.4px** (Headroom: `788px - 460.4px` = **+327.6px**).

#### Viewport 3: 1920 × 1080 (Full HD Desktop)
1. **Container Height**: `1080px - 88px` = **992px** (Inner: **968px**).
2. **Left Column**:
   - `h1`: clamped to max `3.3rem` = `52.8px` (2 lines = ~118px).
   - `sub`: ~88px.
   - `cta`: 56px + gaps (31.6px).
   - **Total Left Column Height**: **~293.6px** (Headroom: `968px - 293.6px` = **+674.4px**).
3. **Right Column**:
   - Stage: `clamp(380px, 48vh (518.4px), 520px)` = **518.4px**.
   - Dots + gap: `28.4px`.
   - **Total Right Column Height**: **546.8px** (Headroom: `968px - 546.8px` = **+421.2px**).

#### Viewport 4: 1024 × 768 (Compact Desktop / Tablet Landscape)
1. **Container Height**: `768px - 88px` = **680px** (Inner: **656px**).
2. **Horizontal Fit**:
   - Available width: `1024px - 56px` = `968px`.
   - Grid gap: `32px`. Columns total space: `936px`.
   - Min required: `380px + 480px` = `860px` <= `936px` -> Fits on single row.
3. **Left Column**:
   - `h1`: clamped to min `2.2rem` = `35.2px` (2 lines = ~78.9px).
   - `sub`: ~88px.
   - `cta`: 56px + gaps (31.6px).
   - **Total Left Column Height**: **~254.5px** (Headroom: `656px - 254.5px` = **+401.5px**).
4. **Right Column**:
   - Stage: `48vh` = `368.64px` -> clamped to min `380px`.
   - Dots + gap: `28.4px`.
   - **Total Right Column Height**: `380px + 28.4px` = **408.4px**.
   - **Headroom**: `656px - 408.4px` = **+247.6px clearance**.

---

## 3. Caveats

- **Operating System Scaled Zoom**: At browser zoom levels >= 175% on a 1280x800 display, effective logical viewport height decreases below 480px, which triggers the `@media (max-width: 900px)` natural scrolling fallback. This is the intended fallback behavior specified in the design contract.
- **Font Rendering Variance**: Thai serif fonts ("Noto Serif Thai") have slightly taller ascender/descender metrics than standard sans-serif; calculations above used generous multi-line wrap assumptions (3 lines for sub-headline and 2 lines for title), leaving >= 247px headroom in the tightest viewport.
- No other caveats.

---

## 4. Conclusion

### **VERDICT: APPROVE**

- **R1 Verification**:
  1. The single-screen height constraint `calc(100dvh - 88px)` precisely matches the fixed `88px` header height.
  2. Across all desktop viewports (1280×800, 1440×900, 1920×1080, and 1024×768), both the Left column (height 254px–294px) and Right column (height 408px–547px) strictly fit within the available inner container height (656px–968px) with massive positive headroom (minimum +247.6px clearance).
  3. No clipping or vertical scroll is triggered under `overflow: hidden`.
  4. The manga stage image, vocabulary pill, subtitle box, and pagination dots all remain visible and unobstructed within the single screen.
- **Automated Tests**:
  - `npm test`: 104 passed / 0 failures.
  - `npm run build`: Clean production build in 1.89s with 0 errors.

---

## 5. Verification Method

To independently verify these empirical results:

1. **Run Unit Test Suite**:
   ```bash
   cd /home/pisitpong/group3-standalone/source && npm test
   ```
   *Expected result*: 104 passed, 0 failures, exit code 0.

2. **Run Production Build**:
   ```bash
   cd /home/pisitpong/group3-standalone/source && npm run build
   ```
   *Expected result*: Vite build succeeds, outputs `dist/index.html` and assets with 0 errors.

3. **Inspect Stylesheet Rules & Line Counts**:
   ```bash
   wc -l /home/pisitpong/group3-standalone/source/src/surfaces/group-3-8104/styles/home-enhancements.css \
         /home/pisitpong/group3-standalone/source/src/surfaces/group-3-8104/styles/home-single-screen.css
   ```
   *Expected result*: `home-enhancements.css` <= 2300 lines (actual: 1045), `home-single-screen.css` <= 1200 lines (actual: 1112).
