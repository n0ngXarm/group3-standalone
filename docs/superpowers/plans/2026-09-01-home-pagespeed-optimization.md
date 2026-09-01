# Group 3 Home PageSpeed Optimization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve the Home screen's mobile critical path and PageSpeed accessibility findings while preserving its desktop design and all route behavior.

**Architecture:** Keep the Home shell and critical media eager, move font loading and decorative WebGL out of the render path, and lazy-load non-Home route code/styles. Use browser-level contracts for rendered geometry/network behavior and Node contracts for document loading policy and bundle budgets.

**Tech Stack:** React 19, Vite 8, CSS, Node test runner, Puppeteer, WebP.

**Spec:** `docs/superpowers/specs/2026-09-01-home-pagespeed-optimization.md`

## Global Constraints

- Preserve light/dark theme startup without flicker.
- Keep all HSK 1–3 routes, lesson content, audio, and learner-session behavior unchanged.
- Use semantic Group 3 theme tokens; interactive targets are at least 44 by 44 CSS pixels.
- Keep CLS and TBT at zero in release verification.
- Validate desktop, tablet, and mobile viewports.

---

### Task 1: Lock the PageSpeed regressions

**Files:**
- Create: `source/tests/browser/group-3.home-pagespeed-contract.mjs`
- Modify: `source/tests/unit/group-3.font-loading.test.js`
- Modify: `source/tests/unit/group-3.home-performance.test.js`

**Interfaces:**
- Consumes: deployed PageSpeed failure selectors and existing `homeMedia` contracts.
- Produces: executable contracts for non-blocking fonts, deferred WebGL, 44 px carousel targets, AA language contrast, and initial bundle budgets.

- [ ] **Step 1: Write the failing document-loading tests**

  Assert that the Google Fonts link uses the preload/onload non-blocking pattern with a `<noscript>` stylesheet fallback, and that theme initialization is inline before `/src/main.jsx` rather than loaded through `theme-init.js`.

- [ ] **Step 2: Run the document tests and verify RED**

  Run: `cd source && npm test tests/unit/group-3.font-loading.test.js tests/unit/theme-policy.test.js`

  Expected: failures identify the current blocking font stylesheet and external theme script.

- [ ] **Step 3: Write the failing browser performance contract**

  Open Home at 1366x768, 1024x768, 768x1024, 412x915, and 360x800; assert every carousel tab is at least 44x44, selected-language contrast is at least 4.5:1 in both themes, and no `three.module` request occurs before interaction.

- [ ] **Step 4: Run the browser contract and verify RED**

  Run: `cd source && node tests/browser/group-3.home-pagespeed-contract.mjs`

  Expected: failures identify the carousel geometry, selected-language contrast, and early Three.js request.

### Task 2: Remove avoidable render blockers and accessibility failures

**Files:**
- Modify: `source/index.html`
- Modify: `source/src/main.jsx`
- Modify: `source/src/surfaces/group-3-8104/shared/components/AppTopbar.css`
- Modify: `source/src/surfaces/group-3-8104/styles/home-single-screen.css`
- Modify: `source/src/surfaces/group-3-8104/styles/home-enhancements.css`

**Interfaces:**
- Consumes: `getBrowserAdaptiveThreePolicy()` and existing theme tokens.
- Produces: non-blocking typography, inline startup theme, interaction-triggered WebGL, WCAG-AA active language state, and 44 px carousel controls.

- [ ] **Step 1: Implement the minimal loading-policy changes**

  Inline the existing `theme-init.js` body in `<head>`, convert Google Fonts to preload/onload with a `<noscript>` fallback, and mount `ThreeBackdrop` only after `pointerdown` or `keydown` when the adaptive policy allows it.

- [ ] **Step 2: Implement the minimal accessibility CSS**

  Use `var(--g3-ink)` on the active language surface where contrast passes, and render carousel dots as 44 px buttons with their current small visual dot represented by a pseudo-element.

- [ ] **Step 3: Run focused tests and verify GREEN**

  Run: `cd source && npm test tests/unit/group-3.font-loading.test.js tests/unit/theme-policy.test.js tests/unit/mobile_group3_empirical.test.js && node tests/browser/group-3.home-pagespeed-contract.mjs`

  Expected: all focused contracts pass at every required viewport and theme.

### Task 3: Reduce initial Home route payload

**Files:**
- Create: `source/src/surfaces/group-3-8104/features/routes/DeferredRouteContent.jsx`
- Create: `source/src/surfaces/group-3-8104/styles/non-home-routes.css`
- Modify: `source/src/surfaces/group-3-8104/Group3App.jsx`
- Modify: `source/src/surfaces/group-3-8104/group-3-story.css`
- Modify: `source/tests/unit/group-3.home-performance.test.js`

**Interfaces:**
- Consumes: the existing `route`, `lesson`, `language`, `navigate`, `lowData`, and practice-summary props.
- Produces: a lazy route boundary that loads lesson/practice screens and their legacy CSS only after leaving Home.

- [ ] **Step 1: Add a failing initial-bundle budget**

  Build production output and assert the initial Home JavaScript and CSS exclude route-only chunks and remain within the measured post-split budgets recorded by the test.

- [ ] **Step 2: Run the bundle test and verify RED**

  Run: `cd source && npm run check && npm test tests/unit/group-3.home-performance.test.js`

  Expected: the current monolithic entry exceeds the initial-route budget.

- [ ] **Step 3: Add the lazy non-Home boundary**

  Move non-Home screen imports and their route-only legacy stylesheet imports behind one `React.lazy` boundary while leaving Home, topbar, modal, routing state, and session ownership in `Group3App.jsx`.

- [ ] **Step 4: Run route and browser smoke checks**

  Run: `cd source && npm test tests/unit/group-3.routes.test.js tests/unit/group-3.home-performance.test.js && node scripts/performance/p1-route-matrix.mjs`

  Expected: the Home payload budget passes and every protected route still renders after navigation.

### Task 4: Reduce the Home LCP image transfer

**Files:**
- Modify: `source/public/assets/group3/shared/characters/visual-novel-backgrounds/scene-01-market-tea-768w.webp`
- Modify: `source/tests/unit/group-3.home-performance.test.js`

**Interfaces:**
- Consumes: existing responsive `srcset` and the 768 px Home selection.
- Produces: the same 768 px WebP dimensions at no more than 50 KiB.

- [ ] **Step 1: Add a failing per-asset size budget**

  Assert the 768 px initial Home backdrop exists, retains its dimensions, and is no more than 50 KiB.

- [ ] **Step 2: Run the image budget and verify RED**

  Run: `cd source && npm test tests/unit/group-3.home-performance.test.js`

  Expected: the current 95,494-byte image exceeds the 50 KiB budget.

- [ ] **Step 3: Re-encode from the lossless source**

  Generate a 768 px WebP from `scene-01-market-tea.png` using a quality setting that meets the budget while preserving the existing crop and dimensions.

- [ ] **Step 4: Run media and visual checks**

  Run: `cd source && npm test tests/unit/group-3.home-performance.test.js && node tests/browser/group-3.home-pagespeed-contract.mjs`

  Expected: the size budget passes and Home geometry remains unchanged.

### Task 5: Release verification and measured comparison

**Files:**
- Modify: `source/dist/index.html` through the production build.

**Interfaces:**
- Consumes: all optimization changes.
- Produces: a production bundle and before/after evidence suitable for deployment review.

- [ ] **Step 1: Run the focused and full quality gates**

  Run: `cd source && npm test tests/unit/group-3.font-loading.test.js tests/unit/group-3.home-performance.test.js tests/unit/mobile_group3_empirical.test.js tests/unit/theme-policy.test.js tests/unit/group-3.routes.test.js && npm run check`

- [ ] **Step 2: Run cross-platform browser verification**

  Run: `cd source && node tests/browser/group-3.home-pagespeed-contract.mjs && node scripts/performance/home-font-audit.mjs && node scripts/performance/p1-route-matrix.mjs`

- [ ] **Step 3: Compare production payloads and Lighthouse metrics**

  Record initial CSS/JS/image transfer before and after, run desktop and mobile Lighthouse against the production preview, and report score variance plus FCP, LCP, TBT, and CLS.

- [ ] **Step 4: Review the diff and commit only verified files**

  Run: `git diff --check && git status --short && git diff --stat`

  Expected: no whitespace errors, no generated artifacts outside `source/dist`, and no unrelated changes.
