## 2026-08-20T13:56:00Z
<USER_REQUEST>
<original_task>
Task Objective:
Fix 4 specific UI/UX issues on the Home page of 中文练习 based on a system review:
1. R1. Resolve Theme Consistency Failure (Critical):
   Ensure the right column (carousel/hero image) and header language selector properly respect the active theme (light/dark mode) using centralized CSS custom properties instead of hardcoded dark-mode colors.
2. R2. Improve Accessibility and Contrast Ratio (High):
   Audit and adjust the color of the "01/02/03" numbers on the light background to meet WCAG 2.1 AA standards (minimum 4.5:1 contrast ratio).
3. R3. Fix Visual Hierarchy and Line Breaking (Medium):
   Correct the line breaking of the heading "ฟังจีนจาก สถานการณ์จริง แล้วตอบให้ทัน" so that related words stay together (e.g., "ฟังจีนจากสถานการณ์จริง" on one line).
4. R4. Resolve Split-Brain Layout Problem (Medium):
   Integrate the right side fully into the global theme system by refactoring the CSS to bind to the same global design tokens.

Acceptance Criteria:
- Theme toggling works seamlessly, affecting both the left and right columns properly.
- The "01/02/03" numbers on the light cream background achieve a contrast ratio of >= 4.5:1.
- The heading line does not break in the middle of words (i.e. "ฟังจีนจากสถานการณ์จริง" is kept on a single line).
- All unit tests pass and build succeeds.
</original_task>

<prior_attempt>
All 5 target files have been committed to disk in `/home/pisitpong/group3-standalone/source`:
1. `source/src/surfaces/group-3-8104/group-3-story.css`
2. `source/src/surfaces/group-3-8104/styles/home-single-screen.css`
3. `source/src/surfaces/group-3-8104/styles/home-enhancements.css`
4. `source/src/surfaces/group-3-8104/styles/ui-polish.css`
5. `source/src/surfaces/group-3-8104/features/catalog/StoryExperience.jsx`
</prior_attempt>
</USER_REQUEST>
