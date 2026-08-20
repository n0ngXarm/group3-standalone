## 2026-08-19T15:48:05Z

You are Reviewer 1 for Group 3 Standalone Home Page fixes.
Your working directory is: /home/pisitpong/group3-standalone/.agents/reviewer_1

MANDATORY: First read /home/pisitpong/group3-standalone/.agents/ORIGINAL_REQUEST.md and /home/pisitpong/group3-standalone/PROJECT.md.

Your objective: Perform thorough, rigorous code and design review of all modified files:
- `source/src/surfaces/group-3-8104/features/catalog/StoryExperience.jsx`
- `source/src/surfaces/group-3-8104/shared/components/StoryLayout.jsx`
- `source/src/surfaces/group-3-8104/content/copy.js`
- `source/src/surfaces/group-3-8104/styles/home-single-screen.css`
- `source/src/surfaces/group-3-8104/styles/home-enhancements.css`

Verify:
1. R1: Single-screen height math (88px header offset), carousel stage scaling (aspect-ratio 16/10, min-height 320px, max-height min(56vh, 460px)), pagination dots visibility, single-row grid track (1fr), copy margins (margin 0 on sub, margin-top 0.35rem on cta row), zero clipping or overlap on standard desktop viewport (1280x800).
2. R2: `<p className="g3-home-eyebrow">` is completely removed from JSX; `heroBadge`, `group`, `footerCourse`, `footerMembersTitle` and all Group 3 branding strings are removed/cleaned in `th`, `zh`, `en`.
3. R3: Run `cd /home/pisitpong/group3-standalone/source && npm test` and `npm run build` and ensure 0 failures.

Write your findings and verdict (APPROVE or REQUEST_CHANGES) to `/home/pisitpong/group3-standalone/.agents/reviewer_1/handoff.md`, and send a message back.
