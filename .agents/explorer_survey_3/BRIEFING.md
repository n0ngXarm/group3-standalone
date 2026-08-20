# BRIEFING — 2026-08-19T15:42:00Z

## Mission
Investigate R3 (Test Suite and Existing Verification) for Group 3 Standalone Home Page fixes.

## 🔒 My Identity
- Archetype: explorer
- Roles: investigation, synthesis
- Working directory: /home/pisitpong/group3-standalone/.agents/explorer_survey_3
- Original parent: 363a75d8-cd9c-4490-a997-e3fdea9b137b
- Milestone: Survey R3 Complete

## 🔒 Key Constraints
- Read-only investigation — do NOT implement
- Inspect test suite in /home/pisitpong/group3-standalone/source
- Identify all tests touching Home page, StoryHome, Header, Footer, copy.js, or checking strings ("กลุ่มที่ 3", "HSK 1–3 · สถานการณ์จำลอง", "GROUP 03", etc.)
- Document current test status (pass/fail) and required assertion updates for R1 and R2

## Current Parent
- Conversation ID: 363a75d8-cd9c-4490-a997-e3fdea9b137b
- Updated: 2026-08-19T15:42:00Z

## Investigation State
- **Explored paths**:
  - `source/package.json`
  - `source/test-alias-loader.js`
  - `source/tests/unit/` (all 13 test files)
  - `source/src/surfaces/group-3-8104/` (components, styles, content, routing)
  - `source/index.html`
- **Key findings**:
  - Test runner is Node.js built-in runner `node --import ./test-alias-loader.js --test` (`npm test`).
  - Exactly 13 unit test files with 96 test assertions.
  - Zero test assertions check for the branding strings being removed in R2 (`heroBadge`, `group`, `footerCourse`, `footerMembersTitle`, `<p className="g3-home-eyebrow">`). Removing them will not break any unit test.
  - `standalone-boundary.test.js:60` asserts `assert.match(html, /Group 3/)` against `index.html`. If `index.html` is altered, this test assertion must be updated.
  - `standalone-boundary.test.js:100-117` enforces structural invariants on `StoryExperience.jsx` and `HomeCarousel.jsx` and forbids specific legacy component names (`GuideModal`, `setGuideOpen`, `g3-wow-button-secondary`, `g3-home-text-link`, `g3-home-feature-bar`, etc.).
  - `group-3.autoplay-contract.test.js` enforces exact 13 stylesheet imports in `group-3-story.css` and line boundaries (1200 / 2300 lines).
- **Unexplored areas**: None. R3 investigation complete.

## Key Decisions Made
- Fully documented all 13 test files, their assertions, branding string audit, and structural guardrails for R1/R2.
- Compiled complete reports in `report.md` and `handoff.md`.

## Artifact Index
- `/home/pisitpong/group3-standalone/.agents/explorer_survey_3/DISPATCH.md` — Dispatch history
- `/home/pisitpong/group3-standalone/.agents/explorer_survey_3/progress.md` — Progress log
- `/home/pisitpong/group3-standalone/.agents/explorer_survey_3/report.md` — Full investigation report
- `/home/pisitpong/group3-standalone/.agents/explorer_survey_3/handoff.md` — Handoff report
