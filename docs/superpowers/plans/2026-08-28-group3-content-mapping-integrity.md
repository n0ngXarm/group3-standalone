# Group 3 Content Mapping Integrity Rescue

## Scope

Repair runtime content ownership for all seven registered lessons without redesigning UI, changing scoring, generating assets, or committing.

## Tasks

1. Add structural tests proving lesson, scene, dialogue, QTE, builder, Repeat, and free-speaking source ownership.
2. Make Sentence Builder consume its declared target and pinyin chunks, never the last dialogue line.
3. Assign canonical runtime IDs/owners and reject conflicting Repeat references.
4. Replace scene-index media assumptions with explicit existing-asset mappings for recomposed scenes.
5. Correct verified QTE language contamination, lesson title/context contamination, and stale vocabulary ownership.
6. Add browser click-through coverage for every lesson and scene.
7. Run focused tests, route tests, browser checks, build, and `git diff --check`.

## Constraints

- Preserve unrelated dirty-worktree changes.
- Reuse only existing content/assets.
- Do not modify layout, mic/ASR, scoring, session, responsive CSS, or commit history.
