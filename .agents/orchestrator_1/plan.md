# Project Plan — Group 3 Standalone Home Page Fixes

## Objectives
1. Fix visual overlap, clipping, and single-screen responsiveness on `/group3/home/` (1280x800 desktop viewport, CTA buttons, hero copy, manga carousel, pagination dots).
2. Completely remove Group 3 branding and specified labels across all UI, copy (`th`, `zh`, `en`), footer, header, modals, and remove `<p className="g3-home-eyebrow">` element from `StoryHome`.
3. Verify test suite (`npm test`), update test assertions where strings were removed, and achieve 100% test pass.

## Phases
- **Phase 0: Survey & Investigation**
  - Spawn 3 Explorers:
    - Explorer 1: Focus on R1 (Hero layout CSS, `is-single-screen`, flex/grid clipping, carousel dots, viewport 1280x800 constraints).
    - Explorer 2: Focus on R2 (Branding scan across `source/`, `copy.js`, `Header.jsx`, `Footer.jsx`, `StoryHome.jsx`, modals, etc.).
    - Explorer 3: Focus on R3 (Test suite scan, test files matching hero/branding/copy, current test run state).
- **Phase 1: Project Scope & Milestone Definition**
  - Synthesize findings into `PROJECT.md`.
- **Phase 2: Implementation & Verification Loop**
  - Milestone 1: Branding & Copy Removal (Worker -> Reviewers -> Challengers -> Auditor -> Gate).
  - Milestone 2: Hero Layout & Single-Screen Responsiveness (Worker -> Reviewers -> Challengers -> Auditor -> Gate).
  - Milestone 3: Full Test Suite Verification (Worker -> Reviewers -> Challengers -> Auditor -> Gate).
- **Phase 3: Final Verification & Reporting**
  - Comprehensive review and report to parent.
