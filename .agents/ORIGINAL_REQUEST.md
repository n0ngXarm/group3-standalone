# Original User Request

## 2026-08-19T15:35:48Z

Survey and fix the Group 3 Standalone Home page (`/group3/home/`) frontend. There are visual overlap issues (images/elements stacking on top of each other), missing text, and specific hardcoded labels that must be removed from the UI and source copy.

Working directory: /home/pisitpong/group3-standalone

## Requirements

### R1. Fix visual overlap and missing text on the Home page
Investigate and fix any element overlap or clipping on the Home hero section. Ensure the hero title, sub-headline, CTA buttons ("เริ่มเรียน", "วิธีใช้งาน", "เลือกบทเรียน"), and the eyebrow label (`g3-home-eyebrow`) are all fully visible and not clipped within the single-screen constraint (`is-single-screen`, `overflow: hidden`). The manga carousel stage and its pagination dots must also remain fully visible without being cut off.

### R2. Remove all Group 3 / group-3 branding labels from the visible UI
Remove the following strings wherever they appear in the visible UI (copy.js, JSX templates, CSS content):
- `"HSK 1–3 · สถานการณ์จำลอง"` (the `heroBadge` / eyebrow text rendered on the Home hero)
- `"HSK 1–3 · 情景模拟"` (Chinese version of same)
- `"HSK 1–3 · Scenario Practice"` (English version of same)
- `"GROUP 03 · LEARN BY SITUATION"` (the `group` subtitle in the header brand)
- `"กลุ่มที่ 3"` and all variants (e.g. `"พัฒนาโดยกลุ่มที่ 3"`, `"Development team (Group 3)"`) wherever visible in the UI
- The `<p className="g3-home-eyebrow">` element rendered at the top of the hero copy in `StoryHome` (remove the element entirely, not just the text)

These strings may exist in `copy.js` (all three languages: `th`, `zh`, `en`) and in JSX files. Remove or blank them out so they no longer appear visually. Internal code identifiers (CSS class names like `g3-home-eyebrow`, variable names) do not need to change.

### R3. All automated tests must pass
After making changes, run the project's unit tests:
```bash
cd /home/pisitpong/group3-standalone/source && npm test
```
All tests must pass with 0 failures. If any test assertions check for the removed strings, update those assertions to match the new expected state.

## Acceptance Criteria

### Visual correctness
- [ ] All text in the Home hero section is fully visible (not clipped, not overlapping with other elements) when viewed at a standard desktop viewport (1280×800)
- [ ] The manga carousel stage image and pagination dots are both visible and not pushed below the fold
- [ ] No element visually overlaps another in an unintended way on the Home page

### Removed labels
- [ ] The `<p className="g3-home-eyebrow">` element is no longer rendered in `StoryHome`
- [ ] The string `"HSK 1–3 · สถานการณ์จำลอง"` (and its zh/en equivalents) no longer appears in any rendered UI text
- [ ] The string `"GROUP 03 · LEARN BY SITUATION"` no longer appears as visible text in the header
- [ ] No mention of `"กลุ่มที่ 3"` / `"Group 3"` / `"第 3 组"` appears in any visible UI element (footer, header, modal, etc.)

### Tests
- [ ] `npm test` exits with code 0 and 0 test failures
