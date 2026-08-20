# DISPATCH LOG

## 2026-08-19T15:36:25Z
User request:
You are the Project Orchestrator for Group 3 Standalone Home Page fixes.

Your working directory is: /home/pisitpong/group3-standalone/.agents/orchestrator_1
Project root: /home/pisitpong/group3-standalone
Source directory: /home/pisitpong/group3-standalone/source
Authoritative user request file: /home/pisitpong/group3-standalone/.agents/ORIGINAL_REQUEST.md

Please review /home/pisitpong/group3-standalone/.agents/ORIGINAL_REQUEST.md and coordinate the full implementation:
1. R1: Fix visual overlap and missing text on the Home page hero section (`/group3/home/`).
   - Hero title, sub-headline, CTA buttons ("เริ่มเรียน", "วิธีใช้งาน", "เลือกบทเรียน"), manga carousel stage and pagination dots must be fully visible and not clipped/cut off within `is-single-screen` / `overflow: hidden` constraint on standard desktop viewport (1280x800).
   - No visual overlap between elements.
2. R2: Remove all Group 3 / group-3 branding labels from the visible UI:
   - Remove `<p className="g3-home-eyebrow">` element completely from `StoryHome`.
   - Remove `"HSK 1–3 · สถานการณ์จำลอง"`, `"HSK 1–3 · 情景模拟"`, `"HSK 1–3 · Scenario Practice"` from copy/UI.
   - Remove `"GROUP 03 · LEARN BY SITUATION"` from header brand copy/UI.
   - Remove `"กลุ่มที่ 3"`, `"Development team (Group 3)"`, `"พัฒนาโดยกลุ่มที่ 3"`, `"第 3 组"`, and any other Group 3 branding from visible UI (footer, header, modals, etc.).
3. R3: Run unit tests via `cd /home/pisitpong/group3-standalone/source && npm test` and ensure all tests pass (0 failures). Update test assertions that check for removed strings if needed.

Maintain your `plan.md`, `progress.md`, and `BRIEFING.md` in `/home/pisitpong/group3-standalone/.agents/orchestrator_1/`.
When complete, send a message to parent reporting completion and detailing results.
