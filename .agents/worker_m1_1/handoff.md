# Handoff Report: Milestone 1 (M1) — Branding & Copy Removal

**Agent**: Worker 1 (`worker_m1_1`)  
**Milestone**: M1 (Branding & Copy Removal)  
**Date**: 2026-08-19  
**Status**: COMPLETE (Hard Handoff)

---

## 1. Observation

Direct observations from codebase inspection and modifications across exclusive write scope:

1. **`source/src/surfaces/group-3-8104/features/catalog/StoryExperience.jsx`**:
   - Line 51 previously contained `<p className="g3-home-eyebrow">{text.heroBadge}</p>`.
   - Removed this element completely from JSX without leaving orphan tags or comments.

2. **`source/src/surfaces/group-3-8104/shared/components/StoryLayout.jsx`**:
   - Lines 53 and 108 previously contained unconditional `<small>{text.group}</small>`.
   - Changed both to `{text.group ? <small>{text.group}</small> : null}` to prevent empty `<small>` DOM elements from rendering when `text.group` is empty string (`""`).

3. **`source/src/surfaces/group-3-8104/content/copy.js`**:
   - `th` dictionary:
     - `group`: `"GROUP 03 · LEARN BY SITUATION"` -> `""`
     - `heroBadge`: `"HSK 1–3 · สถานการณ์จำลอง"` -> `""`
     - `footerCourse`: `"หลักสูตร New HSK ระดับ 1–3 · พัฒนาโดยกลุ่มที่ 3"` -> `"หลักสูตร New HSK ระดับ 1–3"`
     - `footerMembersTitle`: `"ทีมพัฒนา (กลุ่มที่ 3)"` -> `"ทีมพัฒนา"`
   - `zh` dictionary:
     - `group`: `"GROUP 03 · LEARN BY SITUATION"` -> `""`
     - `heroBadge`: `"HSK 1–3 · 情景模拟"` -> `""`
     - `footerCourse`: `"新 HSK 1–3 课程 · 由第 3 组开发"` -> `"新 HSK 1–3 课程"`
     - `footerMembersTitle`: `"开发团队（第 3 组）"` -> `"开发团队"`
   - `en` dictionary:
     - `group`: `"GROUP 03 · LEARN BY SITUATION"` -> `""`
     - `heroBadge`: `"HSK 1–3 · Scenario Practice"` -> `""`
     - `footerCourse`: `"New HSK Levels 1–3 · Built by Group 3"` -> `"New HSK Levels 1–3"`
     - `footerMembersTitle`: `"Development team (Group 3)"` -> `"Development team"`

4. **Test & Build Commands Output**:
   - `cd /home/pisitpong/group3-standalone/source && npm test`:
     ```
     ℹ tests 104
     ℹ suites 4
     ℹ pass 104
     ℹ fail 0
     ℹ cancelled 0
     ℹ skipped 0
     ℹ todo 0
     ```
   - `cd /home/pisitpong/group3-standalone/source && npm run build`:
     ```
     ✓ 84 modules transformed.
     dist/index.html                          1.49 kB │ gzip:   0.74 kB
     dist/assets/index-KZc8RyrE.css         192.94 kB │ gzip:  37.22 kB
     dist/assets/index-CIs1Zxh1.js          396.63 kB │ gzip: 111.13 kB
     ✓ built in 2.18s
     ```

---

## 2. Logic Chain

1. The user request (§R2) and survey report (`explorer_survey_2/report.md`) identified specific visible branding strings and elements for removal: `heroBadge` eyebrow element in hero copy, `"HSK 1–3 · สถานการณ์จำลอง"` / `"情景模拟"` / `"Scenario Practice"`, `"GROUP 03 · LEARN BY SITUATION"`, `"กลุ่มที่ 3"`, `"第 3 组"`, and `"Group 3"` from headers, hero, footer, and modals.
2. In `StoryExperience.jsx`, removing `<p className="g3-home-eyebrow">{text.heroBadge}</p>` ensures the hero eyebrow badge is not rendered into the DOM at all on `/group3/home/`.
3. In `StoryLayout.jsx`, guarding `<small>{text.group}</small>` with `{text.group ? <small>{text.group}</small> : null}` ensures that setting `group: ""` in `copy.js` does not emit an empty `<small></small>` node into the brand container in either the home header or standard header.
4. In `copy.js`, setting `group: ""` and `heroBadge: ""` across `th`, `zh`, and `en` eliminates all residual hero badge and header subtitle strings. Cleaning `footerCourse` and `footerMembersTitle` eliminates course group numbering and group parentheses from the About modal and footer across all 3 languages.
5. Unit tests (`tests/unit/`) do not assert on the removed strings; the suite of 104 tests runs and passes with 0 failures. Vite production build succeeds without syntax or bundling errors.

---

## 3. Caveats

- Internal CSS selectors referencing `.g3-home-eyebrow` in `home-single-screen.css` remain untouched in accordance with the minimal change principle and milestone ownership (M2 owns stylesheet layouts). Because the DOM node is removed from JSX, the CSS rule is harmless and inactive.
- Internal identifiers (e.g. constant names, dataset attributes, file comments) are preserved as per specifications.

---

## 4. Conclusion

Milestone 1 tasks are completely implemented and verified:
- All Group 3 branding and eyebrow labels have been removed from the visible UI across all three languages (`th`, `zh`, `en`).
- The eyebrow DOM element was eliminated from `StoryExperience.jsx`.
- Header brand markup in `StoryLayout.jsx` handles empty `text.group` gracefully.
- All 104 unit tests pass with 0 failures.
- Production build via Vite succeeds cleanly.

---

## 5. Verification Method

To independently verify these changes:

1. **Run Unit Tests**:
   ```bash
   cd /home/pisitpong/group3-standalone/source && npm test
   ```
   *Expected*: 104 tests pass, 0 fail.

2. **Run Production Build**:
   ```bash
   cd /home/pisitpong/group3-standalone/source && npm run build
   ```
   *Expected*: Build exits with code 0 in ~2s.

3. **Verify String Removal**:
   ```bash
   grep -rn "heroBadge" /home/pisitpong/group3-standalone/source/src/surfaces/group-3-8104/features/
   grep -rn "GROUP 03" /home/pisitpong/group3-standalone/source/src/
   grep -rn "กลุ่มที่ 3" /home/pisitpong/group3-standalone/source/src/
   grep -rn "第 3 组" /home/pisitpong/group3-standalone/source/src/
   ```
   *Expected*: No matches found in `src/`.
