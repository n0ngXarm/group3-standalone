# Survey Report: R2 Branding & Label Removal Audit

**Agent**: Explorer Survey 2  
**Date**: 2026-08-19  
**Objective**: Complete audit of Group 3 branding, eyebrow badge elements, and visible label occurrences across the codebase for removal from visible UI.

---

## 1. Executive Summary

A comprehensive scan across all source code (`src/`, `public/`, `tests/`, `index.html`, CSS, and configuration) was performed to identify all visible UI strings, elements, and attributes containing Group 3 branding, eyebrow badges, and related label occurrences across all 3 supported languages (`th`, `zh`, `en`).

### Summary of Items Requiring Modification
1. **Eyebrow Element in Hero Copy**: `<p className="g3-home-eyebrow">{text.heroBadge}</p>` in `StoryExperience.jsx` must be removed entirely.
2. **Hero Eyebrow Text in Copy (`heroBadge`)**: `heroBadge` in `copy.js` (lines 21, 197, 373) across `th`, `zh`, `en` must be removed / blanked (`""`).
3. **Header Subtitle in Copy (`group`)**: `group: "GROUP 03 · LEARN BY SITUATION"` in `copy.js` (lines 9, 185, 361) across `th`, `zh`, `en` must be blanked (`""`), and header brand rendering in `StoryLayout.jsx` (lines 53, 108) adjusted so no empty tags are rendered.
4. **Group 3 Attribution in Footer/About Copy**:
   - `footerCourse` in `copy.js` (lines 131, 307, 483): remove `" · พัฒนาโดยกลุ่มที่ 3"`, `" · 由第 3 组开发"`, and `" · Built by Group 3"`.
   - `footerMembersTitle` in `copy.js` (lines 132, 308, 484): remove `" (กลุ่มที่ 3)"`, `"（第 3 组）"`, and `" (Group 3)"`.
5. **Automated Tests Validation**: Test suite baseline currently has 104 passing tests. No test assertions check for the removed strings (`heroBadge`, `group`, etc.). Test suite will continue to pass with 0 failures.

---

## 2. Detailed Audit Catalog

### A. Element Removal: `<p className="g3-home-eyebrow">`

| Attribute | Detail |
| :--- | :--- |
| **Target File** | `/home/pisitpong/group3-standalone/source/src/surfaces/group-3-8104/features/catalog/StoryExperience.jsx` |
| **Line Number** | Line 51 |
| **Component** | `StoryHome` (inside `<div className="g3-hero-copy">`) |
| **Current Code** | `          <p className="g3-home-eyebrow">{text.heroBadge}</p>` |
| **Proposed Action** | Remove the `<p className="g3-home-eyebrow">` element completely from JSX. |
| **Context** | Lines 49–54 of `StoryExperience.jsx`: |

```jsx
// Before:
      <section className="g3-home-hero" aria-labelledby="g3-home-title">
        <div className="g3-hero-copy">
          <p className="g3-home-eyebrow">{text.heroBadge}</p>
          <h1 id="g3-home-title" className="g3-home-title g3-wow-text" tabIndex="-1">{text.heroTitleLine}</h1>
          <p className="g3-home-sub">{text.heroSubLine}</p>

// After:
      <section className="g3-home-hero" aria-labelledby="g3-home-title">
        <div className="g3-hero-copy">
          <h1 id="g3-home-title" className="g3-home-title g3-wow-text" tabIndex="-1">{text.heroTitleLine}</h1>
          <p className="g3-home-sub">{text.heroSubLine}</p>
```

---

### B. Eyebrow Badge Text: `heroBadge` across Languages

| Attribute | Detail |
| :--- | :--- |
| **Target File** | `/home/pisitpong/group3-standalone/source/src/surfaces/group-3-8104/content/copy.js` |
| **Lines** | Line 21 (`th`), Line 197 (`zh`), Line 373 (`en`) |
| **Proposed Action** | Blank out `heroBadge` or set to empty string `""` in all language objects. |

#### 1. Thai (`th`) — Line 21
```javascript
// Before:
    heroBadge: "HSK 1–3 · สถานการณ์จำลอง",
// After:
    heroBadge: "",
```

#### 2. Chinese (`zh`) — Line 197
```javascript
// Before:
    heroBadge: "HSK 1–3 · 情景模拟",
// After:
    heroBadge: "",
```

#### 3. English (`en`) — Line 373
```javascript
// Before:
    heroBadge: "HSK 1–3 · Scenario Practice",
// After:
    heroBadge: "",
```

---

### C. Header Brand Subtitle: `group` (`"GROUP 03 · LEARN BY SITUATION"`)

| Attribute | Detail |
| :--- | :--- |
| **Target Files** | 1. `/home/pisitpong/group3-standalone/source/src/surfaces/group-3-8104/content/copy.js`<br>2. `/home/pisitpong/group3-standalone/source/src/surfaces/group-3-8104/shared/components/StoryLayout.jsx` |
| **Copy Lines** | Line 9 (`th`), Line 185 (`zh`), Line 361 (`en`) |
| **JSX Lines** | Line 53 (Home Header), Line 108 (Standard Header) |
| **Proposed Action** | Blank out `group` in `copy.js` (`group: ""`). In `StoryLayout.jsx`, ensure `<small>{text.group}</small>` only renders if `text.group` is non-empty (or remove the `<small>` subtitle tag). |

#### 1. `copy.js` Changes
```javascript
// th (Line 9):
// Before:
    group: "GROUP 03 · LEARN BY SITUATION",
// After:
    group: "",

// zh (Line 185):
// Before:
    group: "GROUP 03 · LEARN BY SITUATION",
// After:
    group: "",

// en (Line 361):
// Before:
    group: "GROUP 03 · LEARN BY SITUATION",
// After:
    group: "",
```

#### 2. `StoryLayout.jsx` Rendering
```jsx
// Line 51-54 (Home Header):
// Before:
            <span>
              <strong>{text.brand}</strong>
              <small>{text.group}</small>
            </span>
// After:
            <span>
              <strong>{text.brand}</strong>
              {text.group ? <small>{text.group}</small> : null}
            </span>

// Line 106-109 (Standard Header):
// Before:
          <span>
            <strong>{text.brand}</strong>
            <small>{text.group}</small>
          </span>
// After:
          <span>
            <strong>{text.brand}</strong>
            {text.group ? <small>{text.group}</small> : null}
          </span>
```

---

### D. Group 3 Attributions in Footer & About Modals/Views

| Attribute | Detail |
| :--- | :--- |
| **Target File** | `/home/pisitpong/group3-standalone/source/src/surfaces/group-3-8104/content/copy.js` |
| **Rendered In** | 1. `AboutModal` (`StoryLayout.jsx:281, 292`)<br>2. `AboutView` (`HomeViews.jsx:18, 25`) |
| **Affected Keys** | `footerCourse`, `footerMembersTitle` across `th`, `zh`, `en` |
| **Proposed Action** | Remove all Group 3 mentions (`"กลุ่มที่ 3"`, `"第 3 组"`, `"Group 3"`, `"พัฒนาโดย..."`, `"Built by..."`) from these keys. |

#### 1. Thai (`th`) — Lines 131–132
```javascript
// Before:
    footerCourse: "หลักสูตร New HSK ระดับ 1–3 · พัฒนาโดยกลุ่มที่ 3",
    footerMembersTitle: "ทีมพัฒนา (กลุ่มที่ 3)",

// After:
    footerCourse: "หลักสูตร New HSK ระดับ 1–3",
    footerMembersTitle: "ทีมพัฒนา",
```

#### 2. Chinese (`zh`) — Lines 307–308
```javascript
// Before:
    footerCourse: "新 HSK 1–3 课程 · 由第 3 组开发",
    footerMembersTitle: "开发团队（第 3 组）",

// After:
    footerCourse: "新 HSK 1–3 课程",
    footerMembersTitle: "开发团队",
```

#### 3. English (`en`) — Lines 483–484
```javascript
// Before:
    footerCourse: "New HSK Levels 1–3 · Built by Group 3",
    footerMembersTitle: "Development team (Group 3)",

// After:
    footerCourse: "New HSK Levels 1–3",
    footerMembersTitle: "Development team",
```

---

## 3. Inventory of Non-Modifiable / Internal Code References

The audit verified all other occurrences of "group" / "Group 3" across the repository to ensure they are strictly internal code identifiers or covered by existing boundaries:

| Location | Occurrence | Classification | Modification Needed? |
| :--- | :--- | :--- | :--- |
| `src/surfaces/group-3-8104/styles/home-single-screen.css` | `.g3-home-eyebrow { ... }` (lines 253, 893, 910, 1095) | Internal CSS class selector | **No** (CSS classes do not need renaming; removing element prevents render) |
| `src/surfaces/group-3-8104/content/lessons/**/content.js` | `// Auto-generated dynamic Group 3 lesson content` | Internal JS code comment | **No** |
| `src/surfaces/group-3-8104/config.js` | `TypeError("Group 3 lesson media...")` | Internal developer error message | **No** |
| `src/surfaces/group-3-8104/Group3App.jsx` | `Group3App`, dataset `group3-reading` | Internal React component & DOM dataset | **No** |
| `src/surfaces/group-3-8104/content/registry.js` | `GROUP3_LESSONS`, `GROUP3_CATALOG_PATH` | Internal JS constant identifiers | **No** |
| `src/surfaces/group-3-8104/features/reader/roleplay/RoleplayView.jsx` | `new THREE.Group()` | Three.js scene graph node API | **No** |
| `src/shared/features/group-portal/data/group-content.js` | Multi-group portal menu definitions | Dead shared file (not imported by standalone) | **No** |
| `source/index.html` | `<title>中文练习 (Zhōngwén Liànxí) · Group 3</title>` | HTML head title (overwritten on React mount; required by `standalone-boundary.test.js:60`) | **No** |

---

## 4. Test Suite Impact & Verification

- **Current Status**: `npm test` runs 104 unit tests with **0 failures**.
- **Test Assertions Check**:
  - `tests/unit/group-3.autoplay-contract.test.js`: Checks only guided playback copy keys (`autoplayBegin`, `manualBegin`, etc.). It does not assert on `group`, `heroBadge`, `footerCourse`, or `footerMembersTitle`.
  - `tests/unit/group-3.lesson-13.test.js`: Asserts on `text.brand` (`"华韵 · HuaYun"`), which remains intact.
  - `tests/unit/standalone-boundary.test.js`: Asserts on `index.html` containing `/Group 3/` and component isolation (`group-3-8104`).
- **Conclusion**: None of the proposed copy/element removals will break automated unit tests.

---

## 5. Complete Implementation Diff Plan

```diff
--- a/src/surfaces/group-3-8104/content/copy.js
+++ b/src/surfaces/group-3-8104/content/copy.js
@@ -9,1 +9,1 @@
-    group: "GROUP 03 · LEARN BY SITUATION",
+    group: "",
@@ -21,1 +21,1 @@
-    heroBadge: "HSK 1–3 · สถานการณ์จำลอง",
+    heroBadge: "",
@@ -131,2 +131,2 @@
-    footerCourse: "หลักสูตร New HSK ระดับ 1–3 · พัฒนาโดยกลุ่มที่ 3",
-    footerMembersTitle: "ทีมพัฒนา (กลุ่มที่ 3)",
+    footerCourse: "หลักสูตร New HSK ระดับ 1–3",
+    footerMembersTitle: "ทีมพัฒนา",
@@ -185,1 +185,1 @@
-    group: "GROUP 03 · LEARN BY SITUATION",
+    group: "",
@@ -197,1 +197,1 @@
-    heroBadge: "HSK 1–3 · 情景模拟",
+    heroBadge: "",
@@ -307,2 +307,2 @@
-    footerCourse: "新 HSK 1–3 课程 · 由第 3 组开发",
-    footerMembersTitle: "开发团队（第 3 组）",
+    footerCourse: "新 HSK 1–3 课程",
+    footerMembersTitle: "开发团队",
@@ -361,1 +361,1 @@
-    group: "GROUP 03 · LEARN BY SITUATION",
+    group: "",
@@ -373,1 +373,1 @@
-    heroBadge: "HSK 1–3 · Scenario Practice",
+    heroBadge: "",
@@ -483,2 +483,2 @@
-    footerCourse: "New HSK Levels 1–3 · Built by Group 3",
-    footerMembersTitle: "Development team (Group 3)",
+    footerCourse: "New HSK Levels 1–3",
+    footerMembersTitle: "Development team",

--- a/src/surfaces/group-3-8104/features/catalog/StoryExperience.jsx
+++ b/src/surfaces/group-3-8104/features/catalog/StoryExperience.jsx
@@ -51,1 +51,0 @@
-          <p className="g3-home-eyebrow">{text.heroBadge}</p>

--- a/src/surfaces/group-3-8104/shared/components/StoryLayout.jsx
+++ b/src/surfaces/group-3-8104/shared/components/StoryLayout.jsx
@@ -53,1 +53,1 @@
-              <small>{text.group}</small>
+              {text.group ? <small>{text.group}</small> : null}
@@ -108,1 +108,1 @@
-            <small>{text.group}</small>
+            {text.group ? <small>{text.group}</small> : null}
```
