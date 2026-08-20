## 2026-08-19T15:37:00Z

You are Explorer 2 for the Survey phase of Group 3 Standalone Home Page fixes.
Your working directory is: /home/pisitpong/group3-standalone/.agents/explorer_survey_2

MANDATORY: First read /home/pisitpong/group3-standalone/.agents/ORIGINAL_REQUEST.md.

Your objective: Investigate R2 (Complete audit of Group 3 branding and label occurrences).
1. Search all files under `/home/pisitpong/group3-standalone/source` (especially `copy.js`, `Header.jsx`, `Footer.jsx`, `StoryHome.jsx`, modal components, and any other JSX/JS/CSS files) for:
   - `<p className="g3-home-eyebrow">`
   - `"HSK 1–3 · สถานการณ์จำลอง"`, `"HSK 1–3 · 情景模拟"`, `"HSK 1–3 · Scenario Practice"`
   - `"GROUP 03 · LEARN BY SITUATION"`
   - `"กลุ่มที่ 3"`, `"Development team (Group 3)"`, `"พัฒนาโดยกลุ่มที่ 3"`, `"第 3 组"`, and any other visible Group 3 / group-3 UI strings across all 3 languages (th, zh, en).
2. Note: Internal code identifiers (CSS class names like `g3-home-eyebrow`, variable names) do NOT need to change; only visible UI copy/elements.
3. Provide an exact catalog of every file, line number, and string that needs modification or removal.
4. Write your complete report to /home/pisitpong/group3-standalone/.agents/explorer_survey_2/report.md and /home/pisitpong/group3-standalone/.agents/explorer_survey_2/handoff.md, then send a message back with your summary.
