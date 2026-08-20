## 2026-08-19T15:45:47Z
You are Worker 1 for Milestone 2 (M2: Hero Layout & Single-Screen Responsiveness) of Group 3 Standalone.
Your working directory is: /home/pisitpong/group3-standalone/.agents/worker_m2_1

MANDATORY: First read /home/pisitpong/group3-standalone/.agents/ORIGINAL_REQUEST.md, /home/pisitpong/group3-standalone/PROJECT.md, and /home/pisitpong/group3-standalone/.agents/explorer_survey_1/report.md.

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Scope & Exclusive File Ownership:
You have exclusive write ownership of:
1. `source/src/surfaces/group-3-8104/styles/home-single-screen.css`
2. `source/src/surfaces/group-3-8104/styles/home-enhancements.css`

Tasks to execute:
1. In `source/src/surfaces/group-3-8104/styles/home-enhancements.css` and `source/src/surfaces/group-3-8104/styles/home-single-screen.css`:
   - Correct the single screen container height calculation to account for the true 88px header height:
     In `home-enhancements.css` (lines ~495-503):
       `height: calc(100dvh - 88px); max-height: calc(100dvh - 88px);`
     In `home-single-screen.css` (lines ~222-228):
       `height: calc(100svh - 88px); min-height: 480px;`
   - Fix the phantom grid row in `home-enhancements.css` (lines ~505-513):
     Change `grid-template-rows: minmax(0, 1fr) auto;` to `grid-template-rows: 1fr;` (or `minmax(0, 1fr)`).
   - In `home-single-screen.css` (lines ~508-520):
     Adjust `.g3-manga-viewport` so it scales fluidly on standard 1280x800 desktop without clipping dots:
     Set `min-height: 320px; max-height: min(56vh, 460px); aspect-ratio: 16 / 10;`.
   - In `home-single-screen.css` (lines ~372-378):
     Set `.g3-home-carousel-dots { display: flex; justify-content: center; align-items: center; gap: 0.5rem; margin-top: 0.5rem; }`.
   - Normalize hero copy margins in `home-enhancements.css` / `home-single-screen.css`:
     Add `.g3-home.is-single-screen .g3-home-sub { margin: 0; }` and `.g3-home.is-single-screen .g3-home-cta-row { margin-top: 0.35rem; }` so margins don't compound with flex gap `0.75rem`.
   - Prevent top bar / vocab pill collision on mid-desktop in `home-single-screen.css`:
     Add `max-width: clamp(120px, 16vw, 240px); overflow: hidden; text-overflow: ellipsis; white-space: nowrap;` to `.g3-manga-scenario-title`.
2. Ensure stylesheet line limit invariants remain valid (`home-enhancements.css` <= 2300 lines; `home-single-screen.css` <= 1200 lines).
3. Verification:
   - Run `cd /home/pisitpong/group3-standalone/source && npm test` to ensure all 104 tests pass.
   - Run `npm run build` in `source/` to ensure clean build.
4. Write handoff report to `/home/pisitpong/group3-standalone/.agents/worker_m2_1/handoff.md` and send a message back when done.
