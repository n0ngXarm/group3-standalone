# AGY Home / Visual Novel Handoff

## Status
COMPLETED / STABLE CHECKPOINT

## Commit
e83b7a5

## Ownership
- Home
- Visual Novel Preview
- ScenarioMangaStage
- Home-specific CSS

## Files Completed
source/src/surfaces/group-3-8104/features/catalog/ScenarioMangaStage.jsx
source/src/surfaces/group-3-8104/styles/home-enhancements.css
source/src/surfaces/group-3-8104/styles/home-single-screen.css

## Architecture
- z0 Background
- z1 Atmosphere
- z2 Left Blend
- z3 Actors + Labels
- z4 Navigation
- z5 Dialogue + Audio
- z6 Pagination

## Verification
- production build result: PASS
- standalone-boundary result: FAIL (Baseline Defect)
- theme-policy result: PASS
- isolation result: PASS (AGY_PATCH_TECHNICALLY_ISOLATABLE)

## Known Baseline Issue
บันทึก standalone-boundary baseline failure ที่มีอยู่ก่อน AGY patch (AssertionError: `scenePath(featured, 1)` ไม่ match ใน `HomeCarousel.jsx` / `StoryExperience.jsx` เนื่องจาก Codex เข้าไปแก้)

## Important Unknown Working Tree
ไฟล์ต่อไปนี้ไม่ได้เป็น AGY ownership และยังคงค้างอยู่ใน Working Tree:
- Group3App.jsx
- config.js
- StoryLayout.jsx
- group-3-story.css
- tokens-shell.css
- content.js
- public asset deletions
- dist/**

## Do Not Assume
ห้าม Session ใหม่ assume ว่า UNKNOWN mutations เป็นของ Codex หรือ AGY (รอรับการยืนยัน Provenance ก่อน)

## Next Recommended Step
- visual QA หน้า Home จริง
- Light/Dark QA
- responsive QA
- ห้าม structural refactor ใหม่จนกว่าจะพบ confirmed defect
