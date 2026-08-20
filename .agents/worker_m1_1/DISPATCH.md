## 2026-08-19T15:42:21Z

You are Worker 1 for Milestone 1 (M1: Branding & Copy Removal) of Group 3 Standalone.
Your working directory is: /home/pisitpong/group3-standalone/.agents/worker_m1_1

MANDATORY: First read /home/pisitpong/group3-standalone/.agents/ORIGINAL_REQUEST.md and /home/pisitpong/group3-standalone/PROJECT.md. Also review /home/pisitpong/group3-standalone/.agents/explorer_survey_2/report.md for exact line-by-line instructions.

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Scope & Exclusive File Ownership:
You have exclusive write ownership of:
1. `source/src/surfaces/group-3-8104/features/catalog/StoryExperience.jsx`
2. `source/src/surfaces/group-3-8104/shared/components/StoryLayout.jsx`
3. `source/src/surfaces/group-3-8104/content/copy.js`

Tasks to execute:
1. In `StoryExperience.jsx`:
   - Remove the `<p className="g3-home-eyebrow">{text.heroBadge}</p>` element entirely from the JSX (around line 51). Do NOT leave empty `<p className="g3-home-eyebrow">` tags or comments in JSX.
2. In `StoryLayout.jsx`:
   - In `<div className="g3-brand-text">`: remove or safely condition `{text.group && <small>{text.group}</small>}` so empty string doesn't leave an empty `<small>` element (around lines 53 and 108).
3. In `copy.js`:
   - In `th`, `zh`, and `en` dictionaries:
     - Set `group: ""` (lines 9, 185, 361)
     - Set `heroBadge: ""` (lines 21, 197, 373)
     - Clean `footerCourse`:
       - `th`: change `"รายวิชา 01204441 · กลุ่มที่ 3"` to `"รายวิชา 01204441"`
       - `zh`: change `"课程 01204441 · 第 3 组"` to `"课程 01204441"`
       - `en`: change `"Course 01204441 · Group 3"` to `"Course 01204441"`
     - Clean `footerMembersTitle`:
       - `th`: change `"พัฒนาโดยกลุ่มที่ 3"` to `"ทีมพัฒนา"` or `"ผู้พัฒนา"`
       - `zh`: change `"开发团队（第 3 组）"` to `"开发团队"`
       - `en`: change `"Development team (Group 3)"` to `"Development team"`
4. Run verification:
   - Run `cd /home/pisitpong/group3-standalone/source && npm test` to ensure all tests pass.
   - Run `npm run build` in `source/` to ensure no Vite build regressions or syntax errors.
5. Write your handoff report to `/home/pisitpong/group3-standalone/.agents/worker_m1_1/handoff.md` and send a message back when done.
