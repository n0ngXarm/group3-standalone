## 2026-08-20T15:11:47Z
Your working directory is: /home/pisitpong/group3-standalone/.agents/auditor_1

Relevant skills available in this workspace:
- /home/pisitpong/group3-standalone/.agents/skills/group3-home-redesign/SKILL.md
- /home/pisitpong/group3-standalone/.agents/skills/group3-verification-suite/SKILL.md
- /home/pisitpong/group3-standalone/.agents/skills/group3-theme-accessibility/SKILL.md

<original_task>
# Teamwork Project Prompt — Draft

> Status: Launched
> Goal: Craft prompt → get user approval → delegate to teamwork_preview
> Requested team: Small focused team

This is a single self-contained fix; keep it small and focused.
Fix 5 specific UI/UX regressions on the Home page of 中文练习 (group3-standalone), including text truncation, scrollbar anomaly, redundant copy, underline misalignment, and name tag outline.

Working directory: /home/pisitpong/group3-standalone
Integrity mode: development

## Requirements

### R1. Fix Text Truncation in Heading
- Remove `white-space: nowrap` from the `.g3-home-title-phrase` class.
- Update `StoryExperience.jsx` to wrap the specific word `สถานการณ์จริง` in a non-breaking inline style to ensure it doesn't split awkwardly, allowing the browser to wrap naturally.

### R2. Fix Native Input Element / Scrollbar Anomaly & Restore Audio Button
- Hide or remove the `overflow-x: auto` native scrollbar on `.g3-manga-top-bar`.
- Restore the removed `.g3-manga-audio-btn` inside `.g3-manga-subtitle-box` in `ScenarioMangaStage.jsx` so the user has the speaker button back.

### R3. Rewrite Redundant Subtitle Copy
- Update `heroSubLine` (TH) in `copy.js` to highlight the target audience and mechanism: `"ออกแบบสำหรับผู้เรียน HSK 1-3 จำลองบทสนทนาโต้ตอบพร้อมเสียงเจ้าของภาษา ให้คุณมั่นใจทุกการสื่อสาร"`

### R4. Fix Underline Misalignment
- Delete the `.g3-hero-copy h1 span:last-child::after` pseudo-element block in `ui-polish.css`.
- Apply native text decoration instead (`text-decoration: underline; text-decoration-skip-ink: auto; text-underline-offset: 0.15em; text-decoration-thickness: 0.12em;`) to the heading span.

### R5. Remove Name Tag Outline
- Remove the `border: 1px solid rgba(255, 255, 255, 0.2);` rule from `.g3-manga-actor-name` in `home-enhancements.css`.

## Acceptance Criteria

### Functionality & UI Polish
- [ ] The text "ฟังจีนจากสถานการณ์จริง" wraps naturally on small screens without hard clipping.
- [ ] No native scrollbar appears below the `.g3-manga-top-bar` at the top of the manga stage.
- [ ] The audio button (speaker icon) is visible again inside the subtitle box.
- [ ] The subtitle text under the main heading displays the new copy in Thai.
- [ ] The orange underline on the heading is rendered natively via `text-decoration` and aligns perfectly with the font baseline.
- [ ] The character name tag "大卫 (David)" no longer has a faint white border.

---
*Next: when approved → delegate via invoke_subagent*
</original_task>

Please conduct an independent post-victory audit:
1. Verify each acceptance criterion against the modified codebase.
2. Check for cheating/tampering with test files.
3. Run the automated test suites (`npm test`) and production build (`npm run check`).
4. Write your structured verdict and complete handoff report to /home/pisitpong/group3-standalone/.agents/auditor_1/handoff.md. Report back via send_message when done.
