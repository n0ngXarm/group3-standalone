# Survey Investigation Report: R1 Home Page Layout & Overlap / Clipping

**Target Route**: `/group3/home/`  
**Focus**: Hero Section Layout, Single-Screen Viewport Fit (1280×800), Overlap/Clipping Diagnostics, CTA Row, Manga Carousel Stage & Pagination Dots  
**Investigator**: Explorer 1  
**Date**: 2026-08-19  

---

## 1. Executive Summary

A comprehensive diagnostic of the Group 3 Standalone Home Page (`/group3/home/`) reveals that visual clipping and element overflow under the single-screen constraint (`is-single-screen`, `overflow: hidden`) stem from **four compounding CSS sizing discrepancies**:

1. **Header Height Viewport Miscalculation**: The Home header (`.g3-header.is-home`) has a fixed minimum height of `88px` (`tokens-shell.css:187`), but the single-screen container `.g3-home.is-single-screen` computes its height using `calc(100svh - 70px)` in `home-single-screen.css:223` and `calc(100dvh - 4.5rem)` (`72px`) in `home-enhancements.css:496`. This creates an immediate **16px to 19px vertical overflow** beyond the `800px` desktop viewport boundary (`88px + 728px = 816px > 800px`).
2. **Over-Constrained Stage Minimum Height (`min-height: 32.5rem` / `520px`)**: The manga carousel viewport (`.g3-manga-viewport` in `home-single-screen.css:510`) enforces `min-height: 32.5rem` (`520px`). Combined with the stage frame borders (`16px`), carousel flex gap (`10.4px`), dots margin (`13.6px`), and dot height (`10px`), the carousel component demands a rigid minimum of **`570px`**. When combined with shell paddings (`24px`) and header (`88px`), any desktop window with inner height <= 760px pushes the **pagination dots below the fold**, where they are clipped by `overflow: hidden`.
3. **Stale Multi-Row Grid Track Definition**: `home-enhancements.css:508` applies `grid-template-rows: minmax(0, 1fr) auto;` (a legacy artifact from when the 4-card method rail was rendered in the hero). Because `StoryHome.jsx` now only contains 2 children (`.g3-hero-copy` and `<HomeCarousel>`), the second `auto` row track is empty and distorts the vertical centering and flex stretch calculations.
4. **Compounding Margins with Flex Gaps in Hero Copy**: `.g3-hero-copy` defines `display: flex; flex-direction: column; gap: 0.75rem;` (`home-enhancements.css:521`), but child elements carry redundant large top margins: `.g3-home-sub` has `margin: 1.6rem 0 0;` (25.6px) and `.g3-home-cta-row` has `margin-top: 1.75rem;` (28px). These compounding margins bloat the left column height and prevent fluid responsive shrinking.

---

## 2. Component Architecture Map

```
Group3App.jsx (Root Shell)
 ├── StoryHeader.jsx (.g3-header.is-home) [Height: 88px]
 └── #g3-main (Main Route Outlet)
      └── StoryExperience.jsx -> StoryHome (<main className="g3-home is-single-screen">)
           └── <section className="g3-home-hero"> [Grid: 2 Columns]
                ├── <div className="g3-hero-copy"> [Left Column]
                │    ├── <p className="g3-home-eyebrow"> {text.heroBadge} (Target for R2 removal)
                │    ├── <h1 id="g3-home-title" className="g3-home-title g3-wow-text"> {text.heroTitleLine}
                │    ├── <p className="g3-home-sub"> {text.heroSubLine}
                │    └── <div className="g3-home-cta-row">
                │         └── <button className="g3-home-cta-primary g3-wow-button-primary"> {text.ctaStart}
                │
                └── <HomeCarousel> [Right Column]
                     └── <div className="g3-home-carousel">
                          ├── <div className="g3-home-carousel-stage">
                          │    ├── <ScenarioMangaStage> (.g3-manga-stage-card)
                          │    │    └── <div className="g3-manga-viewport">
                          │    │         ├── .g3-manga-backdrop (<img className="g3-manga-bg-img">)
                          │    │         ├── .g3-manga-top-bar (Live badge + HSK tag + Title + Pause btn)
                          │    │         ├── .g3-manga-actors-layer (<ActorSprite> left & right)
                          │    │         ├── .g3-manga-subtitle-box (Speaker + Audio btn + Hanzi + Pinyin + Thai)
                          │    │         └── .g3-manga-arrow.is-prev / .is-next
                          │    └── <button className="g3-vocab-pill"> ("ดูคำศัพท์")
                          └── <div className="g3-home-carousel-dots"> [5 Pagination Dots]
```

### Key Source Files & Stylesheet Cascading Order

1. `source/src/surfaces/group-3-8104/features/catalog/StoryExperience.jsx` (Lines 38–77: `StoryHome`)
2. `source/src/surfaces/group-3-8104/features/catalog/HomeCarousel.jsx` (Lines 18–59: `HomeCarousel`)
3. `source/src/surfaces/group-3-8104/features/catalog/ScenarioMangaStage.jsx` (Lines 278–480: `ScenarioMangaStage`)
4. `source/src/surfaces/group-3-8104/shared/components/StoryLayout.jsx` (Lines 34–91: `StoryHeader.is-home`)
5. `source/src/surfaces/group-3-8104/styles/tokens-shell.css` (Header & Shell tokens)
6. `source/src/surfaces/group-3-8104/styles/home.css` (Base home styles)
7. `source/src/surfaces/group-3-8104/styles/home-single-screen.css` (Single screen layout rules)
8. `source/src/surfaces/group-3-8104/styles/home-enhancements.css` (Overriding enhancements, loaded last in `group-3-story.css`)

---

## 3. Viewport Math Analysis (Standard 1280×800 Desktop Viewport)

### Vertical Budget Breakdown

| Container / Element | CSS Property & Value | Computed Pixels (at 1280×800) | Available Remaining | Notes |
| :--- | :--- | :--- | :--- | :--- |
| **Total Viewport Height** | `100vh` / `100dvh` | **800.0px** | 800.0px | Standard 1280×800 target screen |
| **Header (`.g3-header.is-home`)** | `min-height: 88px;` (`tokens-shell.css:187`) | **88.0px** | 712.0px | Sticky top navigation |
| **Main Single-Screen (`.g3-home`)** | `height: calc(100dvh - 4.5rem)` (`home-enhancements.css:496`) | **728.0px** | **-16.0px (OVERFLOW)** | `88px + 728px = 816px > 800px` |
| **`.g3-home` Padding** | `padding: 0.75rem 1.75rem` (`home-enhancements.css:499`) | Top/Bottom: **24.0px** | Inner: **688.0px** | Available for `.g3-home-hero` |
| **Hero Section Padding** | `padding: clamp(0.75rem, 2vh, 1.5rem)` (`home-single-screen.css:237`) | Top/Bottom: **32.0px** (2vh × 2) | Inner: **656.0px** | Remaining height for grid contents |

### Right Column: Manga Carousel Height Demands

| Element | CSS Property & Location | Pixel Height | Notes |
| :--- | :--- | :--- | :--- |
| `.g3-manga-viewport` | `min-height: 32.5rem;` (`home-single-screen.css:510`) | **520.0px** | Hard minimum constraint |
| `.g3-manga-viewport` borders/ring | `box-shadow` / `border` (`home-single-screen.css:1030`) | **16.0px** | Multi-layer decorative ring |
| `.g3-home-carousel` gap | `gap: 0.65rem;` (`home-single-screen.css:333`) | **10.4px** | Flex gap between stage and dots |
| `.g3-home-carousel-dots` margin | `margin-top: 0.85rem;` (`home-single-screen.css:377`) | **13.6px** | Top margin on dots container |
| `.g3-home-carousel-dot` height | `height: 0.62rem;` (`home-single-screen.css:1051`) | **10.0px** | Active dot pill height |
| **Total Carousel Min Height** | — | **570.0px** | **Demands 570px out of 656px available** |

> **Critical Finding**: If the browser window has browser tabs / URL bar (reducing inner viewport from 800px to ~720px), available height drops from 656px to **576px**. Because the carousel demands **570px**, any slight misalignment or padding overflow causes the `.g3-home-carousel-dots` to be pushed into the overflow zone, where `overflow: hidden` **clips the dots completely off the bottom edge**.

### Left Column: Hero Copy Vertical Height Demands

| Element | CSS Properties & Location | Height | Notes |
| :--- | :--- | :--- | :--- |
| `.g3-home-eyebrow` | `padding: 0.4rem 1rem; font-size: 0.72rem;` (`home-single-screen.css:898`) | **30.0px** | To be removed in R2 |
| Flex gap (1) | `gap: 0.75rem;` (`home-enhancements.css:521`) | **12.0px** | Between eyebrow and title |
| `.g3-home-title` (`h1`) | `font-size: clamp(2.2rem, 3.2vw, 3.3rem); line-height: 1.12;` (`home-enhancements.css:525`) | **90.0px – 130.0px** | 2 lines of Thai text |
| `.g3-home-sub` top margin | `margin: 1.6rem 0 0;` (`home-single-screen.css:268`) | **25.6px** | **Redundant margin** on top of flex gap |
| Flex gap (2) | `gap: 0.75rem;` (`home-enhancements.css:521`) | **12.0px** | Gap between title and sub-headline |
| `.g3-home-sub` (`p`) | `font-size: 1.1rem; line-height: 1.75;` (`home-single-screen.css:946`) | **50.0px – 60.0px** | 2 lines of Thai text |
| `.g3-home-cta-row` margin | `margin-top: 1.75rem;` (`home-single-screen.css:281`) | **28.0px** | **Redundant margin** on top of flex gap |
| Flex gap (3) | `gap: 0.75rem;` (`home-enhancements.css:521`) | **12.0px** | Gap between sub and CTA row |
| `.g3-home-cta-primary` | `min-height: 3.75rem; padding: 0 2.3rem;` (`home-single-screen.css:956`) | **60.0px** | Primary CTA button |
| **Total Left Column Height** | — | **319.6px – 369.6px** | Fits easily within 656px |

---

## 4. Root Causes & Detailed Diagnosis

### Root Cause 1: Viewport Height Mismatch with Header (`88px`)
- **Observation**:
  - `tokens-shell.css:187`: `.g3-header.is-home` sets `min-height: 88px;`.
  - `home-single-screen.css:223`: `.g3-home.is-single-screen` sets `height: calc(100svh - 70px);`.
  - `home-enhancements.css:496`: `@media (min-width: 1024px) .g3-home.is-single-screen` sets `height: calc(100dvh - 4.5rem);` (`4.5rem = 72px`).
- **Impact**:
  - The home container is allocated `800 - 72 = 728px` instead of `800 - 88 = 712px`.
  - Total page height exceeds viewport by `16px`. Combined with `overflow: hidden`, the bottom 16px of content is pushed out of view.
- **Fix Recommendation**:
  - Define `--g3-home-header-height: 88px;` and set `.g3-home.is-single-screen { height: calc(100dvh - 88px); max-height: calc(100dvh - 88px); }`.

---

### Root Cause 2: Inflexible Stage Minimum Height (`min-height: 32.5rem` / `520px`)
- **Observation**:
  - `home-single-screen.css:510`: `.g3-manga-viewport` has `min-height: 32.5rem; max-height: min(72vh, 41.25rem);`.
- **Impact**:
  - On viewports with heights <= 800px, 520px stage + 24px dots + paddings exceeds available vertical space.
  - The pagination dots container (`.g3-home-carousel-dots`) is pushed downwards and clipped off at the bottom.
- **Fix Recommendation**:
  - Reduce `min-height` on `.g3-manga-viewport` to `clamp(22rem, 50vh, 32.5rem)` or `clamp(360px, 52vh, 500px)`.
  - Set `.g3-manga-viewport { aspect-ratio: 16 / 10; max-height: min(58vh, 460px); min-height: 340px; }`.
  - Set `.g3-home-carousel-dots { margin-top: 0.5rem; }` to keep dots tight with stage.

---

### Root Cause 3: Phantom Second Grid Row in `home-enhancements.css`
- **Observation**:
  - `home-enhancements.css:508`:
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
- **Impact**:
  - `grid-template-rows: minmax(0, 1fr) auto;` expects two rows. Since there are only two child elements (`.g3-hero-copy` and `.g3-home-carousel`), they both sit in row 1, while row 2 is an empty phantom track.
  - This prevents `align-items: center` and `align-self: stretch` from calculating clean vertical bounds.
- **Fix Recommendation**:
  - Change to `grid-template-rows: 1fr;` (single row) or `grid-template-rows: minmax(0, 1fr);`.

---

### Root Cause 4: Compounding Margins inside Flex Copy Column
- **Observation**:
  - In `home-single-screen.css:268`: `.g3-home-sub { margin: 1.6rem 0 0; }`
  - In `home-single-screen.css:276`: `.g3-home-cta-row { margin-top: 1.75rem; }`
  - In `home-enhancements.css:521`: `.g3-hero-copy { display: flex; flex-direction: column; gap: 0.75rem; }`
  - Note: `home-enhancements.css:530` defined `.g3-hero-body { margin: 0; }`, but `StoryHome.jsx` renders `<p className="g3-home-sub">`, so the margin reset was never applied!
- **Impact**:
  - Compounding margins (flex gap `12px` + margin `25.6px` = `37.6px` between title and sub, and flex gap `12px` + margin `28px` = `40px` between sub and CTA row).
- **Fix Recommendation**:
  - Set `.g3-home.is-single-screen .g3-home-sub { margin: 0; }`.
  - Set `.g3-home.is-single-screen .g3-home-cta-row { margin-top: 0.5rem; }`.

---

### Root Cause 5: Top Bar vs Vocab Pill Horizontal Collision at 900px–1150px
- **Observation**:
  - `.g3-manga-top-bar` (`home-single-screen.css:541`) sits at `top: 0.85rem; left: 0.85rem;`.
  - `.g3-vocab-pill` (`home-single-screen.css:345`) sits at `top: 0.85rem; right: 0.85rem;`.
  - On desktop widths between 900px and 1150px (e.g. tablet landscape / small laptops), the stage width is ~460px.
  - Top bar width (~380px) + Vocab pill (~100px) = 480px > 460px, causing them to visually collide and overlap.
- **Fix Recommendation**:
  - Add `max-width: calc(100% - 7.5rem);` and `text-overflow: ellipsis; white-space: nowrap; overflow: hidden;` on `.g3-manga-scenario-title` in desktop styles, or position the vocab pill with a responsive safety inset.

---

### Root Cause 6: Subtitle Box and Actor Sprites Vertical Proportion
- **Observation**:
  - `home-single-screen.css:630`: `.g3-manga-subtitle-box` has `position: absolute; bottom: 0.75rem; left: 1rem; right: 1rem; z-index: 10;`.
  - `home-single-screen.css:595`: `.g3-manga-actor-sprite` has `max-height: clamp(24rem, 62vh, 38rem);`.
  - The subtitle box is ~140px tall and floats over the lower portion of the character sprites.
- **Assessment**:
  - This is standard visual novel composition (characters stand on stage with dialogue overlay at the bottom).
  - To prevent character faces from being cut off or text from obscuring critical character features on compact viewports, actor sprites should use `max-height: clamp(18rem, 50vh, 32rem);` and `object-position: bottom center;`.

---

## 5. File-by-File Line-by-Line Evidence Catalog

### File 1: `source/src/surfaces/group-3-8104/styles/tokens-shell.css`
- **Lines 185–191**:
  ```css
  /* Home header variant: brand left, 3 round utility buttons right */
  .g3-header.is-home {
    grid-template-columns: minmax(260px, 1fr) auto;
    min-height: 88px;
    background: var(--color-bg-secondary);
    box-shadow: none;
  }
  ```
  *Evidence*: Establishes `88px` header height for home route.

---

### File 2: `source/src/surfaces/group-3-8104/styles/home-single-screen.css`
- **Lines 222–228**:
  ```css
  .g3-home.is-single-screen {
    height: calc(100svh - 70px);
    min-height: 540px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  ```
  *Evidence*: Uses stale `70px` header offset instead of `88px`.
- **Lines 230–238**:
  ```css
  .g3-home.is-single-screen .g3-home-hero {
    flex: 1;
    min-height: 0;
    grid-template-rows: none;
    grid-template-columns: minmax(21rem, 0.95fr) minmax(25rem, 1.05fr);
    gap: clamp(1rem, 3vw, 2.5rem);
    align-items: center;
    padding: clamp(0.75rem, 2vh, 1.5rem) max(1rem, calc((100vw - 82.5rem) / 2));
  }
  ```
  *Evidence*: Base single-screen grid definition.
- **Lines 268–274 & 276–282**:
  ```css
  .g3-home-sub {
    margin: 1.6rem 0 0;
    max-width: 30rem;
    color: var(--color-text-secondary);
    font-size: 1.05rem;
    line-height: 1.75;
  }

  .g3-home-cta-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 1.1rem;
    margin-top: 1.75rem;
  }
  ```
  *Evidence*: Margins `1.6rem` and `1.75rem` compound with flex gaps.
- **Lines 508–517**:
  ```css
  .g3-manga-viewport {
    width: 100%;
    height: 100%;
    min-height: 32.5rem;
    max-height: min(72vh, 41.25rem);
    border: 0.5rem solid #111;
    ...
  }
  ```
  *Evidence*: Hardcoded `min-height: 32.5rem` (520px) causes pagination dots clipping at <= 800px viewport heights.
- **Lines 372–378**:
  ```css
  .g3-home-carousel-dots {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.6rem;
    margin-top: 0.85rem;
  }
  ```
  *Evidence*: Dots container positioned below stage.

---

### File 3: `source/src/surfaces/group-3-8104/styles/home-enhancements.css`
- **Lines 494–513**:
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

    .g3-home.is-single-screen .g3-home-hero {
      display: grid;
      grid-template-columns: minmax(380px, 0.95fr) minmax(480px, 1.25fr);
      grid-template-rows: minmax(0, 1fr) auto;
      gap: 2rem;
      align-items: center;
      max-height: 100%;
    }
  ```
  *Evidence*: Overrides `home-single-screen.css` at `>= 1024px`. `4.5rem` (72px) height offset and `minmax(0, 1fr) auto` phantom 2nd row track.
- **Lines 518–538**:
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

  .g3-home.is-single-screen .g3-hero-body {
    font-size: 1.05rem;
    line-height: 1.5;
    margin: 0;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  ```
  *Evidence*: Introduces `gap: 0.75rem;` but resets `.g3-hero-body` instead of `.g3-home-sub`.

---

### File 4: `source/src/surfaces/group-3-8104/features/catalog/StoryExperience.jsx`
- **Lines 48–76**:
  ```jsx
  return (
    <main className="g3-home is-single-screen">
      <section className="g3-home-hero" aria-labelledby="g3-home-title">
        <div className="g3-hero-copy">
          <p className="g3-home-eyebrow">{text.heroBadge}</p>
          <h1 id="g3-home-title" className="g3-home-title g3-wow-text" tabIndex="-1">{text.heroTitleLine}</h1>
          <p className="g3-home-sub">{text.heroSubLine}</p>

          <div className="g3-home-cta-row">
            <button
              className="g3-home-cta-primary g3-wow-button-primary"
              type="button"
              onClick={() => navigateWithCue(scenePath(featured, 1), "confirm")}
            >
              {text.ctaStart}<i aria-hidden="true">→</i>
            </button>
          </div>
        </div>

        {/* 5-Slide Manga Carousel — animated 2D frame-by-frame scenes */}
        <HomeCarousel
          language={language}
          navigate={navigate}
          activeScenario={activeScenario}
          onSelectScenario={setActiveScenario}
          lowData={lowData}
        />
      </section>
    </main>
  );
  ```
  *Evidence*: Structure has exactly 2 grid items. `<p className="g3-home-eyebrow">` is rendered at line 51 (target for R2 removal).

---

## 6. Concrete Proposed CSS / JSX Fix Recommendations

### Recommendation 1: Fix Single-Screen Viewport Height Offset in `home-enhancements.css` and `home-single-screen.css`

```css
/* In home-enhancements.css:495-503 */
@media (min-width: 1024px) {
  .g3-home.is-single-screen {
    height: calc(100dvh - 88px);
    max-height: calc(100dvh - 88px);
    overflow: hidden;
    padding: clamp(0.5rem, 1.5vh, 1rem) clamp(1rem, 2.5vw, 2rem);
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
}

/* In home-single-screen.css:222-228 */
.g3-home.is-single-screen {
  height: calc(100svh - 88px);
  min-height: 480px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
```

### Recommendation 2: Remove Phantom Row and Fix Grid Layout in `home-enhancements.css`

```css
/* In home-enhancements.css:505-513 */
@media (min-width: 1024px) {
  .g3-home.is-single-screen .g3-home-hero {
    display: grid;
    grid-template-columns: minmax(360px, 0.95fr) minmax(460px, 1.25fr);
    grid-template-rows: 1fr;
    gap: clamp(1.2rem, 2.5vw, 2.2rem);
    align-items: center;
    height: 100%;
    max-height: 100%;
    padding: 0;
  }
}
```

### Recommendation 3: Responsive Stage Viewport & Dots Sizing in `home-single-screen.css`

```css
/* In home-single-screen.css:508-517 */
.g3-manga-viewport {
  width: 100%;
  height: 100%;
  min-height: 320px;
  max-height: min(56vh, 460px);
  aspect-ratio: 16 / 10;
  border: 0.4rem solid #111;
  background: radial-gradient(circle at 20% 20%, rgba(207, 58, 39, .15), transparent 24%),
              radial-gradient(circle at 80% 70%, rgba(27, 117, 119, .16), transparent 26%),
              linear-gradient(180deg, #f7ede3, #efe6d7);
  position: relative;
  overflow: hidden;
}

/* In home-single-screen.css:372-378 */
.g3-home-carousel-dots {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
}
```

### Recommendation 4: Normalize Hero Copy Margins in `home-single-screen.css` / `home-enhancements.css`

```css
/* In home-enhancements.css:518-538 */
.g3-home.is-single-screen .g3-hero-copy {
  display: flex;
  flex-direction: column;
  gap: clamp(0.5rem, 1.2vh, 0.85rem);
  padding: 0.5rem 1rem;
}

.g3-home.is-single-screen .g3-home-sub {
  margin: 0;
  max-width: 32rem;
  font-size: clamp(0.95rem, 1.1vw, 1.05rem);
  line-height: 1.6;
}

.g3-home.is-single-screen .g3-home-cta-row {
  margin-top: 0.35rem;
}
```

### Recommendation 5: Prevent Top Bar / Vocab Pill Collision

```css
/* In home-single-screen.css:566-570 */
.g3-manga-scenario-title {
  font-size: 0.82rem;
  font-weight: 700;
  max-width: clamp(120px, 16vw, 240px);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
```

---

## 7. Automated Test & Boundary Verification

The test suite in `source/tests/unit/standalone-boundary.test.js` enforces specific home architecture contracts:
- `assert.match(experience, /g3-home-cta-primary/);` -> Exactly one primary CTA button.
- `assert.doesNotMatch(experience, /g3-wow-button-secondary|GuideModal|setGuideOpen/);` -> No secondary guide modal on home.
- `assert.match(carousel, /SCENARIOS\.map/);` -> 5-slide scenario map.
- `assert.match(carousel, /ScenarioMangaStage/);` -> Manga stage inclusion.
- `assert.match(carousel, /className="g3-vocab-pill"/);` -> Vocab pill inclusion.
- `npm test` currently passes with 104/104 tests. Proposed layout fixes strictly preserve these contracts while fixing the visual bounding box math.

---

## 8. Summary Table of Findings

| ID | Issue | Affected File(s) | Severity | Root Cause | Proposed Remediation |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **F1** | 16–19px Viewport Height Overflow | `home-enhancements.css:496`, `home-single-screen.css:223` | **High** | Header offset computed as 70px/72px instead of actual 88px | Change offset to `88px` (`calc(100dvh - 88px)`) |
| **F2** | Carousel Pagination Dots Clipped Off | `home-single-screen.css:510`, `home-single-screen.css:377` | **High** | `min-height: 32.5rem` (520px) leaves zero margin in <=800px viewports | Lower stage min-height to `320px`, max-height to `min(56vh, 460px)`, dots margin to `0.5rem` |
| **F3** | Phantom Second Grid Track | `home-enhancements.css:508` | **Medium** | Stale `grid-template-rows: minmax(0, 1fr) auto` from retired method rail | Simplify to `grid-template-rows: 1fr` |
| **F4** | Compounding Margins in Copy | `home-single-screen.css:268, 276`, `home-enhancements.css:521` | **Medium** | `.g3-home-sub` and `.g3-home-cta-row` have large top margins on top of flex gap | Reset `margin: 0` on sub and `margin-top: 0.35rem` on cta row |
| **F5** | Top Bar / Vocab Pill Collision on mid-desktop | `home-single-screen.css:541, 566` | **Low** | No max-width / ellipsis on title in 900px–1150px range | Add responsive `max-width` and `text-overflow: ellipsis` |
