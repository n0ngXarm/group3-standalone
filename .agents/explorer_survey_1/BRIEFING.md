# BRIEFING — 2026-08-19T15:39:40Z

## Mission
Investigate R1: Hero Section Layout & Overlap / Clipping on Home page `/group3/home/`, particularly under the single-screen constraint (`is-single-screen`, `overflow: hidden`) at 1280x800 desktop viewport.

## 🔒 My Identity
- Archetype: explorer
- Roles: investigation, synthesis
- Working directory: /home/pisitpong/group3-standalone/.agents/explorer_survey_1
- Original parent: 363a75d8-cd9c-4490-a997-e3fdea9b137b
- Milestone: Home Page R1 Survey & Diagnostic

## 🔒 Key Constraints
- Read-only investigation — do NOT implement
- Analyze R1 layout overlap, single-screen clipping at 1280x800
- Provide detailed file-by-file line-by-line evidence and concrete fix proposals

## Current Parent
- Conversation ID: 363a75d8-cd9c-4490-a997-e3fdea9b137b
- Updated: 2026-08-19T15:39:40Z

## Investigation State
- **Explored paths**: `ORIGINAL_REQUEST.md`, `StoryExperience.jsx`, `HomeCarousel.jsx`, `ScenarioMangaStage.jsx`, `StoryLayout.jsx`, `tokens-shell.css`, `home.css`, `home-single-screen.css`, `home-enhancements.css`, `standalone-boundary.test.js`
- **Key findings**:
  1. Header is 88px, but single-screen calc used 70px/72px, overshooting viewport by 16-18px.
  2. `min-height: 32.5rem` (520px) on `.g3-manga-viewport` plus dots margin/padding pushes pagination dots below `overflow: hidden` fold.
  3. `grid-template-rows: minmax(0, 1fr) auto` in `home-enhancements.css` has a phantom second row.
  4. Redundant copy margins in `.g3-hero-copy` compound with flex gaps.
- **Unexplored areas**: None for R1.

## Key Decisions Made
- Fully documented all 5 root causes, viewport calculations, and concrete CSS remediation recommendations.
- Produced `report.md` and 5-component `handoff.md`.

## Artifact Index
- `/home/pisitpong/group3-standalone/.agents/explorer_survey_1/report.md` — Detailed Survey Report
- `/home/pisitpong/group3-standalone/.agents/explorer_survey_1/handoff.md` — 5-component Handoff Report
