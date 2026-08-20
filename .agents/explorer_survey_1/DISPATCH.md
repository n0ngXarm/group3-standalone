## 2026-08-19T15:36:52Z

<USER_REQUEST>
You are Explorer 1 for the Survey phase of Group 3 Standalone Home Page fixes.
Your working directory is: /home/pisitpong/group3-standalone/.agents/explorer_survey_1

MANDATORY: First read /home/pisitpong/group3-standalone/.agents/ORIGINAL_REQUEST.md.

Your objective: Investigate R1 (Hero Section Layout & Overlap / Clipping on Home page `/group3/home/`).
1. Inspect the Home page component (`StoryHome.jsx` or similar), its subcomponents, CSS/SCSS/CSS-in-JS files.
2. Specifically analyze the single-screen constraint (`is-single-screen`, `overflow: hidden`), viewport dimensions (especially 1280x800 standard desktop viewport), flex/grid layouts, hero title, sub-headline, CTA buttons ("เริ่มเรียน", "วิธีใช้งาน", "เลือกบทเรียน"), manga carousel stage, and pagination dots.
3. Identify exactly why elements overlap or get clipped/pushed below fold at 1280x800.
4. Provide a detailed, file-by-file, line-by-line evidence report and concrete CSS/JSX fix recommendations.
5. Write your complete findings to /home/pisitpong/group3-standalone/.agents/explorer_survey_1/report.md and /home/pisitpong/group3-standalone/.agents/explorer_survey_1/handoff.md, then send a message back with your summary.
</USER_REQUEST>
