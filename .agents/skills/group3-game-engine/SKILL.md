---
name: group3-game-engine
description: >-
  Guide for developing, updating, and debugging the 4 Group 3 mini-games (Card Frenzy, Pinyin Dash, Sound Sprint, Vocab Blitz) and the Game Hub. Use when modifying game mechanics, question generation, scoring, audio/timer lifecycles, or mobile touch controls.
---

# Group 3 Mini-Games Engine & Lifecycle

Guide for implementing, maintaining, and testing the 4 interactive Chinese learning mini-games under [`source/src/surfaces/group-3-8104/features/games/`](file:///home/nong_ing/group3-standalone/source/src/surfaces/group-3-8104/features/games/).

---

## The 4 Mini-Games & Hub

| Game | Directory | Core Mechanic | Key Responsive / UI Contract |
| :--- | :--- | :--- | :--- |
| **Card Frenzy** | [`card-frenzy/`](file:///home/nong_ing/group3-standalone/source/src/surfaces/group-3-8104/features/games/card-frenzy/) | Card pair matching (Hanzi, Pinyin, Meaning). | 3-column scaling, 1:1 square aspect ratio, zero text truncation down to 320px width. |
| **Pinyin Dash** | [`pinyin-dash/`](file:///home/nong_ing/group3-standalone/source/src/surfaces/group-3-8104/features/games/pinyin-dash/) | Tone & pronunciation identification. | 2x2 option button grid on mobile (`<= 640px`) to preserve vertical fold space. |
| **Sound Sprint** | [`sound-sprint/`](file:///home/nong_ing/group3-standalone/source/src/surfaces/group-3-8104/features/games/sound-sprint/) | Rapid audio listening and character identification. | Dedicated replay button, clear audio feedback, instant score transition. |
| **Vocab Blitz** | [`vocab-blitz/`](file:///home/nong_ing/group3-standalone/source/src/surfaces/group-3-8104/features/games/vocab-blitz/) | Speed vocabulary recognition. | High-visibility Hanzi font sizing, countdown progress bar. |
| **Game Hub** | [`hub/`](file:///home/nong_ing/group3-standalone/source/src/surfaces/group-3-8104/features/games/hub/) | Game selection, score display, lesson picker. | Native button elements, surface-aware image paths. |

---

## Strict Lifecycle & State Contracts

### 1. Audio & Voice Teardown (P0)
Whenever a user exits a game, replays, or transitions to the result screen:
- **Always invoke `stopChineseVoice()`** from [`group3Audio.js`](file:///home/nong_ing/group3-standalone/source/src/surfaces/group-3-8104/services/audio/index.js).
- Clear any playing sound effect instances.
- Never allow background dialogue or sound cues to bleed across route transitions.

### 2. Timers and Animation Frames (P0)
- All `setInterval`, `setTimeout`, and `requestAnimationFrame` IDs must be tracked in refs or state.
- Clear all active timers in the component cleanup function (`useEffect(() => () => cleanup(), [])`).
- Protect against state updates on unmounted components after async timeouts.

### 3. Safe Scoring & RNG Determinism (P0)
- **Score Clamping**: `evaluateScore(correct, total)` must normalize invalid totals, prevent division by zero, and clamp output accuracy between 0% and 100%.
- **Deterministic Pools**: Question generators must support optional injected random number generators (RNG) for reproducible unit tests.
- **Local Storage Scoping**: High scores and game progress must be scoped by lesson ID (e.g. `g3_game_score_${lessonId}_${gameId}`) with fallback error handling for private browsing / blocked storage.

---

## Mobile & Touch Requirements (P1)

- **Touch Targets**: All clickable cards and answer buttons must have a minimum height of `>= 44px` with `>= 8px` touch padding.
- **Micro Viewports (`<= 380px`)**: Use dynamic viewport units (`100dvh`) in [`games.css`](file:///home/nong_ing/group3-standalone/source/src/surfaces/group-3-8104/styles/games.css) to avoid vertical overflow and address browser URL bar dynamics.
- **Sticky Actions**: The `GameResults` action buttons ("เล่นอีกครั้ง", "กลับไปหน้าบทเรียน") must remain sticky and visible within the viewport without requiring excessive scrolling.

---

## Verification Commands

Run unit and contract tests to ensure no regressions in game logic or mobile layout:

```bash
cd /home/nong_ing/group3-standalone/source
# Test game logic, scoring, pool builders, and storage safety
npm test tests/unit/group-3.games.test.js

# Test mobile touch targets, 2x2 grid, and responsive CSS contracts
npm test tests/unit/mobile_group3_empirical.test.js

# Test arcade stress and memory lifecycle
npm test tests/unit/group-3.arcade-stress.test.js
```
