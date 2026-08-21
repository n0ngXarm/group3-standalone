# CROSS-AGENT RECONCILIATION CHANGE MATRIX

## 1. Change Classification Matrix

| Area / File | AGY | Codex | Unknown | Shared | Conflict Risk |
|---|---|---|---|---|---|
| `ScenarioMangaStage.jsx` | ✓ | | | | LOW |
| `home-enhancements.css` | ✓ | | | | LOW |
| `home-single-screen.css` | ✓ | | | | LOW |
| `tokens-shell.css` | | ✓ | | | LOW (No semantic overlap with AGY variables) |
| `content.js` files | | ✓ | | | LOW (Added `characters` payload; VN scenarios are currently hardcoded) |
| Game Engine files | | ✓ | | | LOW (Isolated boundary) |
| Game Hub | | ✓ | | | LOW (Isolated boundary) |
| `tests/` | | ✓ | | | LOW |
| `public/assets/group3/**` | | ✓ | | | LOW (Deleted unused legacy `.webp` files) |
| `dist/**` | ✓ | ✓ | | ✓ | LOW (Automatically regenerated build output) |
| `documentation/handoff` | | ✓ | | | LOW |
| `Group3App.jsx` | | ✓ | | | LOW (Theme sync logic) |
| `config.js` | | ✓ | | | LOW (`imageAlt` logic) |
| `StoryLayout.jsx` | | ✓ | | | MED (Refactored `StoryHeader` for `is-home`) |
| `group-3-story.css` | | ✓ | | | **HIGH** (Codex added `.g3-home.is-single-screen` and `.g3-manga-top-bar` overrides here, overlapping with AGY's CSS ownership) |

---

## 2. AGY Clean Patch Candidate
Exact files safe to isolate as AGY's structural Home/VN refactor:
- `src/surfaces/group-3-8104/features/catalog/ScenarioMangaStage.jsx`
- `src/surfaces/group-3-8104/styles/home-enhancements.css`
- `src/surfaces/group-3-8104/styles/home-single-screen.css`

## 3. Codex Expected Patch Boundary
- Game Engine (`features/games/**`)
- `tests/**`
- `content/lessons/**/content.js`
- `tokens-shell.css`
- `Group3App.jsx`, `config.js`, `StoryLayout.jsx`
- Deletion of legacy `.webp` assets in `public/`

## 4. Shared-File Reconciliation List & Conflicts
**`group-3-story.css` (Direct Conflict Risk):** 
Codex injected layout rules for the Home screen (`.g3-home.is-single-screen` and `.g3-manga-top-bar`) directly into `group-3-story.css`. This violates the canonical CSS ownership just established by AGY. 
*Recommendation:* These hunks must be extracted from `group-3-story.css` and moved into `home-enhancements.css` during merge.

## 5. Asset Deletion Risk List
Codex deleted 23 `.webp` files from `public/assets/group3/shared/characters/`. 
*Risk Analysis:* **LOW** for the Visual Novel. AGY verified that `ScenarioMangaStage.jsx` utilizes newer `.png` assets in distinct folders (`visual-novel-characters-idle`, etc.). Provided Game Engine does not rely on these `.webp` files, the deletion is safe.

## 6. Safe Merge Order
1. **Commit AGY Clean Patch** (ScenarioMangaStage, home-enhancements, home-single-screen) to lock the canonical Home/VN UI structure.
2. **Reconcile `group-3-story.css`**: Manually move Codex's `.g3-home.is-single-screen` and top-bar overrides into AGY's `home-enhancements.css`.
3. **Commit Codex Patch** (Games, content.js, tokens, layouts, and asset deletions).
4. Ignore `dist/`.

## 7. Files that must NOT be committed yet
- `group-3-story.css` (Until the overlapping CSS is moved to respect canonical ownership).
- `dist/**` (Generated build artifact).

