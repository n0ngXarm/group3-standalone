# Codex Game Engine / QA Handoff

## Status

COMPLETED / VERIFIED CHECKPOINT

Game Engine implementation is complete and frozen. Do not modify it again without a new explicit requirement.

## Commit

`382210d575888db7f68223036677c72f7229d0e1` — `feat(group3-games): stabilize game runtime and QA`

## Ownership

- Card Frenzy
- Pinyin Dash
- Sound Sprint
- Vocab Blitz
- Game Hub
- Game runtime
- Game QA / stress tests

## Modified Files

1. `source/src/surfaces/group-3-8104/features/games/card-frenzy/CardFrenzyGame.jsx`
2. `source/src/surfaces/group-3-8104/features/games/hub/Group3GameHub.jsx`
3. `source/src/surfaces/group-3-8104/features/games/pinyin-dash/PinyinDashGame.jsx`
4. `source/src/surfaces/group-3-8104/features/games/shared/GameIntro.jsx`
5. `source/src/surfaces/group-3-8104/features/games/shared/gameData.js`
6. `source/src/surfaces/group-3-8104/features/games/shared/index.js`
7. `source/src/surfaces/group-3-8104/features/games/sound-sprint/SoundSprintGame.jsx`
8. `source/src/surfaces/group-3-8104/features/games/vocab-blitz/VocabBlitzGame.jsx`
9. `source/src/surfaces/group-3-8104/styles/games.css`
10. `source/tests/unit/group-3.games.test.js`

## Created Files

1. `source/src/surfaces/group-3-8104/features/games/shared/gameSession.js`
2. `source/src/surfaces/group-3-8104/features/games/shared/gameTiming.js`
3. `source/tests/unit/group-3.game-runtime.test.js`
4. `source/tests/browser/group-3.game-harness.html`
5. `source/tests/browser/group-3.game-harness.jsx`
6. `source/tests/browser/group-3.game-smoke.mjs`

## Runtime Architecture

- `gameSession` defines deterministic game phases, valid lifecycle transitions, manual/visibility pause reasons, and idempotent exit/dispose behavior. Invalid transitions are no-ops, and visibility resume cannot clear a manual pause.
- The pausable monotonic clock accounts for delayed event loops, pause/resume cycles, Turbo rate changes, bounded time bonuses, and single-fire expiry.
- The pausable scheduler freezes each callback's remaining delay while paused. Round invalidation is separate from the session clock, and repeated invalidation/disposal is safe.
- All four games use the shared session and scheduler. Timed games use the independent shared clock. HUD pause/resume is a native button and coexists with automatic visibility pause.
- Storage remains lesson/game/version scoped. High scores are sanitized, deterministically ranked, duplicate run IDs are replaced, blocked storage is tolerated, and the Hub refreshes scores when returning from a game.
- Audio lifecycle stops speech on pause/exit/unmount. Sound Sprint uses playback tokens and a rapid-play lock to prevent stale or duplicate audio completion; answering requires a completed/replayed prompt after pause.

## Verification

- Clean HEAD production build: PASS
- HEAD + Codex production build: PASS
- Game + runtime tests: PASS, 33/33
- Compatibility/stress tests: PASS, 17/17
- Chromium browser smoke/stress: PASS
- Desktop and `360x740` mobile game starts: PASS for all four games
- Start/exit cycles: 100
- Continuous game switches: 50
- Complete/replay cycles: 10
- Visibility pause/resume cycles: 20
- Keyboard Enter/Space, mouse, and touch paths: PASS
- Pinyin timer continued after answer: 60 -> 58
- Sound Sprint timer continued after answer: 45 -> 43
- Resource counters after stress: timeouts 0 -> 0; rAF 0 -> 0
- Forced-GC heap growth: 208,852 bytes, within the configured limit
- Browser console, React warning, stale audio, and network failure assertions: PASS

## Isolation Result

`CODEX_PATCH_TECHNICALLY_ISOLATABLE`

The exact 16-path patch was materialized over clean repository HEAD and passed build, unit, compatibility, browser, and stress verification without importing concurrent working-tree mutations.

## Dependencies

- DATA dependency: NONE
- UNKNOWN asset dependency: NONE
- GLOBAL CSS/TOKEN dependency: NONE

The games use lesson fields and game-cover assets already present in clean HEAD. Semantic CSS variables required by `games.css` are also defined in clean HEAD.

## Files Explicitly NOT Owned by Codex

- `Group3App.jsx`
- `config.js`
- `StoryLayout.jsx`
- `group-3-story.css`
- `tokens-shell.css`
- `content.js`
- `public/assets/**`
- deleted `.webp`
- `dist/**`
- Home/VN files

## Known Working Tree Condition

There are many UNKNOWN concurrent mutations in the working tree, including modified, deleted, generated, asset, content, Home/VN, shared, report, and untracked files.

Do not run repository-wide clean, reset, restore, checkout, or stash operations without first auditing exact ownership and obtaining authorization. Do not infer ownership from the working-tree diff alone.

## Recommended Next Step

When starting a new session:

1. Read this handoff before taking action.
2. Inspect `git status` and preserve unrelated dirty files.
3. Do not modify the Game Engine until a new requirement is explicitly approved.
4. For integration work, use committed Game patch `382210d575888db7f68223036677c72f7229d0e1` as the stable baseline.
