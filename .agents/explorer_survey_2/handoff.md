# Handoff Report: R2 Branding & Label Removal Survey

**Agent**: Explorer Survey 2  
**Working Directory**: `/home/pisitpong/group3-standalone/.agents/explorer_survey_2`  
**Milestone**: Survey Phase - R2 Branding & Label Audit  
**Type**: Hard Handoff  

---

## 1. Observation

Direct observations from source inspection and pattern searches across `/home/pisitpong/group3-standalone/source`:

### 1.1 Eyebrow Element in Hero Section
- **File**: `source/src/surfaces/group-3-8104/features/catalog/StoryExperience.jsx`
- **Line 51**:
  ```jsx
  <p className="g3-home-eyebrow">{text.heroBadge}</p>
  ```
  Rendered inside `StoryHome` directly above the hero title `<h1 id="g3-home-title">`.

### 1.2 Eyebrow Badge Copy Strings (`heroBadge`)
- **File**: `source/src/surfaces/group-3-8104/content/copy.js`
- **Line 21 (`th`)**: `heroBadge: "HSK 1–3 · สถานการณ์จำลอง",`
- **Line 197 (`zh`)**: `heroBadge: "HSK 1–3 · 情景模拟",`
- **Line 373 (`en`)**: `heroBadge: "HSK 1–3 · Scenario Practice",`

### 1.3 Header Brand Subtitle Copy Strings & JSX (`group`)
- **File**: `source/src/surfaces/group-3-8104/content/copy.js`
  - **Line 9 (`th`)**: `group: "GROUP 03 · LEARN BY SITUATION",`
  - **Line 185 (`zh`)**: `group: "GROUP 03 · LEARN BY SITUATION",`
  - **Line 361 (`en`)**: `group: "GROUP 03 · LEARN BY SITUATION",`
- **File**: `source/src/surfaces/group-3-8104/shared/components/StoryLayout.jsx`
  - **Line 53 (Home Header)**: `<small>{text.group}</small>` inside `<button className="g3-brand">`
  - **Line 108 (Standard Header)**: `<small>{text.group}</small>` inside `<button className="g3-brand">`

### 1.4 Group 3 Team & Course Attribution Strings
- **File**: `source/src/surfaces/group-3-8104/content/copy.js`
  - **Line 131 (`th`)**: `footerCourse: "หลักสูตร New HSK ระดับ 1–3 · พัฒนาโดยกลุ่มที่ 3",`
  - **Line 132 (`th`)**: `footerMembersTitle: "ทีมพัฒนา (กลุ่มที่ 3)",`
  - **Line 307 (`zh`)**: `footerCourse: "新 HSK 1–3 课程 · 由第 3 组开发",`
  - **Line 308 (`zh`)**: `footerMembersTitle: "开发团队（第 3 组）",`
  - **Line 483 (`en`)**: `footerCourse: "New HSK Levels 1–3 · Built by Group 3",`
  - **Line 484 (`en`)**: `footerMembersTitle: "Development team (Group 3)",`
- **Rendered In**:
  - `StoryLayout.jsx` (lines 281, 292): `AboutModal` component rendered via `StoryHeader` about button.
  - `HomeViews.jsx` (lines 18, 25): `AboutView` full page view.

### 1.5 Internal Code Identifiers Verified
- `.g3-home-eyebrow` in `home-single-screen.css` (lines 253, 893, 910, 1095) is CSS styling only.
- `GROUP3_LESSONS`, `group3AssetPath`, `Group3App` are internal symbols.
- `index.html` static `<title>` contains `Group 3` for test boundary verification (`standalone-boundary.test.js:60`), but React dynamically replaces `document.title` on mount with `HuaYun` branding.

### 1.6 Test Suite Baseline
- Command: `npm test` inside `/home/pisitpong/group3-standalone/source`
- Result: 104 passed, 0 failed.
- Checked test assertions: No test verifies `heroBadge`, `group`, `footerCourse`, or `footerMembersTitle`.

---

## 2. Logic Chain

1. **Premise 1 (R2 Objective)**: Requirement R2 mandates removing visible UI labels and branding ("HSK 1–3 · สถานการณ์จำลอง"/zh/en, "GROUP 03 · LEARN BY SITUATION", "กลุ่มที่ 3"/zh/en variants, and `<p className="g3-home-eyebrow">`).
2. **Step 2 (Eyebrow Element)**: Directly observing Observation 1.1, the `<p className="g3-home-eyebrow">` element exists only at `StoryExperience.jsx:51`. Removing this element stops the eyebrow badge from rendering on the Home page.
3. **Step 3 (Eyebrow Badge Copy)**: Directly observing Observation 1.2, `heroBadge` exists in `copy.js` (lines 21, 197, 373). Blanking it (`""`) prevents any fallback or other reference from rendering the text.
4. **Step 4 (Header Brand Subtitle)**: Directly observing Observation 1.3, `"GROUP 03 · LEARN BY SITUATION"` is provided by `COPY[lang].group` and rendered via `<small>{text.group}</small>` in `StoryLayout.jsx` (lines 53, 108). Blanking `group: ""` in `copy.js` and guarding `{text.group ? <small>{text.group}</small> : null}` in `StoryLayout.jsx` removes the header brand subtitle entirely.
5. **Step 5 (Footer & About Attributions)**: Directly observing Observation 1.4, `"กลุ่มที่ 3"`, `"第 3 组"`, `"Group 3"`, `"พัฒนาโดยกลุ่มที่ 3"`, `"Built by Group 3"` exist in `footerCourse` and `footerMembersTitle` in `copy.js`. Modifying these keys in `copy.js` cleans both `AboutModal` (`StoryLayout.jsx`) and `AboutView` (`HomeViews.jsx`) simultaneously.
6. **Step 6 (Non-interference with Tests)**: Directly observing Observation 1.6, no test relies on the removed text values. Therefore, applying these changes will satisfy R2 without violating R3.

---

## 3. Caveats

- **`index.html` Title**: `index.html` line 9 (`<title>中文练习 (Zhōngwén Liànxí) · Group 3</title>`) is asserted by `tests/unit/standalone-boundary.test.js:60` (`assert.match(html, /Group 3/);`). At runtime in the browser, `Group3App.jsx` line 169 immediately replaces the title with `华韵 · HuaYun`. `index.html` static text should NOT be modified to avoid failing the boundary test, or if modified, the test must be synchronized as per R3.
- **CSS classes**: CSS selectors like `.g3-home-eyebrow` in `home-single-screen.css` do not need renaming or deletion as internal class names do not violate visible UI constraints.
- No other caveats.

---

## 4. Conclusion

All occurrences of Group 3 branding and unwanted labels have been identified, pinpointed to exact lines, and cataloged into an actionable diff plan:

1. **`source/src/surfaces/group-3-8104/features/catalog/StoryExperience.jsx`**:
   - Delete line 51: `<p className="g3-home-eyebrow">{text.heroBadge}</p>`.
2. **`source/src/surfaces/group-3-8104/shared/components/StoryLayout.jsx`**:
   - Lines 53 & 108: Replace `<small>{text.group}</small>` with `{text.group ? <small>{text.group}</small> : null}`.
3. **`source/src/surfaces/group-3-8104/content/copy.js`**:
   - `th`:
     - Line 9: `group: ""`
     - Line 21: `heroBadge: ""`
     - Line 131: `footerCourse: "หลักสูตร New HSK ระดับ 1–3"`
     - Line 132: `footerMembersTitle: "ทีมพัฒนา"`
   - `zh`:
     - Line 185: `group: ""`
     - Line 197: `heroBadge: ""`
     - Line 307: `footerCourse: "新 HSK 1–3 课程"`
     - Line 308: `footerMembersTitle: "开发团队"`
   - `en`:
     - Line 361: `group: ""`
     - Line 373: `heroBadge: ""`
     - Line 483: `footerCourse: "New HSK Levels 1–3"`
     - Line 484: `footerMembersTitle: "Development team"`

---

## 5. Verification Method

To independently verify these findings:

1. **Verify Line Numbers and File Contents**:
   ```bash
   # Check hero badge and eyebrow in JSX:
   grep -n "g3-home-eyebrow" source/src/surfaces/group-3-8104/features/catalog/StoryExperience.jsx
   
   # Check header group subtitle rendering:
   grep -n "text.group" source/src/surfaces/group-3-8104/shared/components/StoryLayout.jsx
   
   # Check copy definitions:
   grep -n -E "heroBadge|group:|footerCourse|footerMembersTitle" source/src/surfaces/group-3-8104/content/copy.js
   ```

2. **Verify Test Execution**:
   ```bash
   cd /home/pisitpong/group3-standalone/source && npm test
   ```
   All 104 tests should pass with code 0.

3. **Invalidation Conditions**:
   - If any new visible UI strings referencing Group 3 are discovered outside of `copy.js`, `StoryLayout.jsx`, and `StoryExperience.jsx`.
