# Project: Group 3 Standalone Home Page Fixes

## Architecture
- **Application Framework**: React (Vite-based standalone SPA)
- **Primary Routes**: `/group3/home/` (Home), `/group3/story/` (Story Lesson), `/group3/games/` (Game Hub)
- **Key Modules**:
  - `source/src/surfaces/group-3-8104/features/catalog/StoryExperience.jsx` (Home view)
  - `source/src/surfaces/group-3-8104/shared/components/StoryLayout.jsx` (Global header & footer)
  - `source/src/surfaces/group-3-8104/content/copy.js` (Trilingual copy dictionary: th, zh, en)
  - `source/src/surfaces/group-3-8104/styles/home-single-screen.css` & `home-enhancements.css` (Hero styling & single-screen layout rules)
  - `source/tests/unit/` (Unit test suite executed via `npm test`)

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Remove Eyebrow Badge | Remove `<p className="g3-home-eyebrow">` element completely from `StoryExperience.jsx` | M1 | ORIGINAL_REQUEST §R2 |
| 2 | Clean Hero Copy Strings | Blank out `heroBadge` strings ("HSK 1–3 · สถานการณ์จำลอง" / "情景模拟" / "Scenario Practice") in `copy.js` | M1 | ORIGINAL_REQUEST §R2 |
| 3 | Remove Header Group Subtitle | Remove `"GROUP 03 · LEARN BY SITUATION"` from `copy.js` and ensure clean header rendering in `StoryLayout.jsx` | M1 | ORIGINAL_REQUEST §R2 |
| 4 | Clean Footer & Modal Branding | Remove `"กลุ่มที่ 3"`, `"Development team (Group 3)"`, `"พัฒนาโดยกลุ่มที่ 3"`, `"第 3 组"` from `copy.js` and all UI | M1 | ORIGINAL_REQUEST §R2 |
| 5 | Fix Header Height Viewport Offset | Correct header offset from 70px/72px to 88px in `home-single-screen.css` & `home-enhancements.css` | M2 | ORIGINAL_REQUEST §R1 |
| 6 | Fix Carousel Stage & Dots Clipping | Reduce stage min-height from 520px to flexible height (320px-460px) so dots stay within 1280x800 viewport | M2 | ORIGINAL_REQUEST §R1 |
| 7 | Fix Phantom Grid Rows & Margins | Set single-row grid template and normalize copy margins to prevent overlap and clipping | M2 | ORIGINAL_REQUEST §R1 |
| 8 | Ensure CTA Visibility | Ensure all 3 CTA buttons ("เริ่มเรียน", "วิธีใช้งาน", "เลือกบทเรียน") are visible and unobstructed | M2 | ORIGINAL_REQUEST §R1 |
| 9 | Test Suite Pass & Invariant Checks | Ensure all unit tests pass (0 failures) and meet stylesheet line limits and boundary rules | M3 | ORIGINAL_REQUEST §R3 |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | M1: Branding & Copy Removal | Remove eyebrow DOM element, blank out/clean all Group 3 branding in `copy.js`, `StoryExperience.jsx`, `StoryLayout.jsx` | None | DONE |
| 2 | M2: Hero Layout & Viewport Fixes | Fix single-screen CSS, header offset, carousel sizing, grid rows, and margin spacing | M1 | DONE |
| 3 | M3: Verification & Test Suite | Run full unit test suite via `npm test`, verify all assertions, stylesheet line limits, and boundaries | M1, M2 | DONE |

## Interface Contracts
### `copy.js` ↔ UI Components
- `copy.js` exports trilingual dictionaries (`th`, `zh`, `en`).
- `heroBadge`: `""` (empty string) across all languages.
- `group`: `""` (empty string) across all languages.
- `footerCourse` & `footerMembersTitle`: clean strings without Group 3 attributions across all languages.

### CSS Layout Contracts
- `.g3-home-container.is-single-screen`: single screen constraint at `height: calc(100dvh - 88px)` or `calc(100vh - 88px)`.
- Line limits: `home-enhancements.css` <= 2300 lines; `home-single-screen.css` <= 1200 lines.
- All 13 stylesheets imported in `group-3-story.css` in exact sequence.

## Code Layout
- UI Components: `source/src/surfaces/group-3-8104/features/catalog/`
- Shared Layout: `source/src/surfaces/group-3-8104/shared/components/`
- Localization / Copy: `source/src/surfaces/group-3-8104/content/`
- Stylesheets: `source/src/surfaces/group-3-8104/styles/`
- Tests: `source/tests/unit/`
