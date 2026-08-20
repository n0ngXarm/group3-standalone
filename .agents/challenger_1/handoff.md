# Challenger 1 Empirical Verification Report: R2 (Branding/Label String Removal)

## 1. Observation

Direct empirical observations from codebase inspection, ripgrep searches, test executions, and production build:

### 1.1 Banned Hero Badge Strings
- **Strings checked**: `"HSK 1–3 · สถานการณ์จำลอง"`, `"HSK 1–3 · 情景模拟"`, `"HSK 1–3 · Scenario Practice"`
- **Grep search across `source/src/`**: 0 occurrences.
- **Grep search across `source/dist/`**: 0 occurrences.
- **Direct inspection of `source/src/surfaces/group-3-8104/content/copy.js`**:
  - Line 21 (`th`): `heroBadge: ""`
  - Line 197 (`zh`): `heroBadge: ""`
  - Line 373 (`en`): `heroBadge: ""`
- **Direct inspection of `source/dist/assets/index-BPlxwQK3.js`**:
  - `heroBadge:""` present across all language bundles.

### 1.2 Banned Brand Subtitle String
- **String checked**: `"GROUP 03 · LEARN BY SITUATION"`
- **Grep search across `source/src/` and `source/dist/`**: 0 occurrences.
- **Direct inspection of `source/src/surfaces/group-3-8104/content/copy.js`**:
  - Line 9 (`th`): `group: ""`
  - Line 185 (`zh`): `group: ""`
  - Line 361 (`en`): `group: ""`
- **Direct inspection of `source/src/surfaces/group-3-8104/shared/components/StoryLayout.jsx`**:
  - Lines 53 & 108: `{text.group ? <small>{text.group}</small> : null}` correctly prevents rendering when `text.group` is empty.

### 1.3 Banned Group Attributions
- **Strings checked**: `"กลุ่มที่ 3"`, `"พัฒนาโดยกลุ่มที่ 3"`, `"Development team (Group 3)"`, `"第 3 组"`, `"第3组"`
- **Grep search across `source/src/` and `source/dist/`**: 0 occurrences in visible UI copy or copy dictionaries.
- **Direct inspection of `source/src/surfaces/group-3-8104/content/copy.js`**:
  - `th`: `footerCourse: "หลักสูตร New HSK ระดับ 1–3"`, `footerMembersTitle: "ทีมพัฒนา"`
  - `zh`: `footerCourse: "新 HSK 1–3 课程"`, `footerMembersTitle: "开发团队"`
  - `en`: `footerCourse: "New HSK Levels 1–3"`, `footerMembersTitle: "Development team"`
- **Direct inspection of `AboutModal` (`StoryLayout.jsx` lines 274-297) & `AboutView` (`HomeViews.jsx` lines 9-31)**:
  - Clean rendering of `footerMembersTitle`, `footerTitle`, `footerGroupInfo`, `footerMember1..3`, and `footerCourse` without any Group 3 attribution tags.

### 1.4 Eyebrow Element in `StoryExperience.jsx`
- **Element checked**: `<p className="g3-home-eyebrow">`
- **Direct inspection of `source/src/surfaces/group-3-8104/features/catalog/StoryExperience.jsx`**:
  - Lines 48-64: `StoryHome` directly contains `g3-hero-copy` with `h1.g3-home-title` and `p.g3-home-sub`, with no `g3-home-eyebrow` DOM node.
- **Grep search across `source/src/` for `g3-home-eyebrow`**:
  - 0 occurrences in any `.jsx` or `.js` file.
  - Present only as CSS rules in `home-single-screen.css` for stylesheet safety.

### 1.5 Automated Unit Tests & Build Verification
- **Test execution (`cd source && npm test`)**:
  - Command output:
    ```
    ℹ tests 104
    ℹ suites 4
    ℹ pass 104
    ℹ fail 0
    ℹ cancelled 0
    ℹ skipped 0
    ℹ todo 0
    ℹ duration_ms 1598.899198
    ```
  - Exit code: `0` (104/104 passed).
- **Production build execution (`cd source && npm run build`)**:
  - Command output: `✓ built in 1.78s`
  - Exit code: `0` (Clean Vite build, dist bundles generated).

---

## 2. Logic Chain

1. **Requirement R2 specification**: All variations of Group 3 branding, hero badge strings ("HSK 1–3 · สถานการณ์จำลอง" / zh / en), header subtitle ("GROUP 03 · LEARN BY SITUATION"), footer attributions ("กลุ่มที่ 3" / zh / en), and the `<p className="g3-home-eyebrow">` DOM element must be eliminated from rendered UI copy.
2. **Empirical verification of source copy**: `copy.js` defines trilingual dictionaries for `th`, `zh`, and `en`. Inspections confirmed `heroBadge: ""` and `group: ""` across all three languages, and `footerCourse` / `footerMembersTitle` stripped of any group attributions.
3. **Empirical verification of UI components**: Inspection of `StoryExperience.jsx`, `StoryLayout.jsx`, `HomeViews.jsx`, `HomeCarousel.jsx`, and `ScenarioMangaStage.jsx` verified that no hardcoded fallback strings or lingering DOM elements exist.
4. **Empirical verification of compiled assets**: Inspection of `dist/assets/index-BPlxwQK3.js` verified that minified production bundles do not bundle any banned strings.
5. **Empirical verification of quality gates**: Executing `npm test` verified that all 104 unit tests passed without regressions, and `npm run build` completed successfully.

---

## 3. Caveats

- Internal code identifiers, repository folder names, and CSS class selectors (e.g. `g3-`, `group-3-8104`, `group3AssetPath`) remain intact, which complies with Requirement R2 ("Internal code identifiers do not need to change").
- Visual viewport layout and clipping (R1) are verified independently by Challenger 2.

---

## 4. Conclusion

**Verdict: APPROVE**

Requirement R2 is fully satisfied:
- All banned branding strings have been completely removed from `copy.js` and all UI components.
- The `<p className="g3-home-eyebrow">` element has been cleanly removed from `StoryExperience.jsx`.
- All 104 automated unit tests pass with 0 failures (`npm test`).
- Production build succeeds without error (`npm run build`).

---

## 5. Verification Method

To independently reproduce and verify this report:

1. **Verify string absence in source and dist**:
   ```bash
   cd /home/pisitpong/group3-standalone/source
   # Should return 0 matches for all commands
   grep -rn "HSK 1–3 · สถานการณ์จำลอง" src/ dist/
   grep -rn "HSK 1–3 · 情景模拟" src/ dist/
   grep -rn "HSK 1–3 · Scenario Practice" src/ dist/
   grep -rn "GROUP 03 · LEARN BY SITUATION" src/ dist/
   grep -rn "กลุ่มที่ 3" src/ dist/
   grep -rn "第 3 组" src/ dist/
   grep -rn "g3-home-eyebrow" src/**/*.jsx
   ```

2. **Run full unit test suite**:
   ```bash
   cd /home/pisitpong/group3-standalone/source
   npm test
   # Expected: 104 passed, 0 failed, exit code 0
   ```

3. **Run production frontend build**:
   ```bash
   cd /home/pisitpong/group3-standalone/source
   npm run build
   # Expected: vite build succeeds, exit code 0
   ```
