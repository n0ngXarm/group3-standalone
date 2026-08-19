---
name: group3-home-redesign
description: >-
  Guide for implementing and refining the Group 3 Home Page, 2D Manga/Visual-Novel story preview, and interactive feature demo popups. Use when modifying the Home page layout, hero section, 2D character dialogue preview, feature cards, or demo modals based on the prototype reference in .agents/home-redesign-reference/.
---

# Group 3 Home Redesign & 2D Story Experience

Provides procedures and architectural guardrails for developing and refining the Group 3 Home experience, following the design direction in [`.agents/home-redesign-reference/`](file:///home/nong_ing/group3-standalone/.agents/home-redesign-reference/).

---

## Key Principles & Guardrails

1. **Reference Only — No Direct File Replacement**:
   - The reference [`home-preview-v8.html`](file:///home/nong_ing/group3-standalone/.agents/home-redesign-reference/home-preview-v8.html) is a visual & interaction blueprint.
   - **Never overwrite React components directly with raw HTML**. Translate concepts into React architecture.
2. **2D Visual Novel / Manga Presentation**:
   - No heavy 3D scene required for the hero preview.
   - Use multi-frame 2D character illustrations with expression/pose switches synchronized with dialogue and audio.
   - Display Hanzi + Pinyin + Thai translation aid clearly.
3. **Preserve System Boundaries**:
   - Do not break existing routing in [`routes.js`](file:///home/nong_ing/group3-standalone/source/src/surfaces/group-3-8104/routing/routes.js).
   - Reuse the central audio service [`group3Audio.js`](file:///home/nong_ing/group3-standalone/source/src/surfaces/group-3-8104/services/audio/group3Audio.js).
   - Use CSS tokens from [`tokens-shell.css`](file:///home/nong_ing/group3-standalone/source/src/surfaces/group-3-8104/styles/tokens-shell.css) instead of hardcoding arbitrary color codes.

---

## Core Components & Structure

| Section | Component File | Key Responsibilities |
| :--- | :--- | :--- |
| **App Root & Navigation** | [`Group3App.jsx`](file:///home/nong_ing/group3-standalone/source/src/surfaces/group-3-8104/Group3App.jsx) | Route state, theme sync, guide modal, shell layout. |
| **Home Experience** | [`StoryExperience.jsx`](file:///home/nong_ing/group3-standalone/source/src/surfaces/group-3-8104/features/catalog/StoryExperience.jsx) | Hero 2-column layout, HSK level selector, catalog navigation. |
| **Home Styles** | [`home.css`](file:///home/nong_ing/group3-standalone/source/src/surfaces/group-3-8104/styles/home.css) & [`home-enhancements.css`](file:///home/nong_ing/group3-standalone/source/src/surfaces/group-3-8104/styles/home-enhancements.css) | Hero grid, responsive breakpoints, slide animations. |
| **Design Reference** | [`home-preview-v8.html`](file:///home/nong_ing/group3-standalone/.agents/home-redesign-reference/home-preview-v8.html) | Visual target for layout, card flows, and interactive popups. |

---

## Implementation Steps

### 1. Hero Section (2-Column Grid)
- **Left Column**:
  - Main headline with tracked typography.
  - Short supporting copy in Thai + Chinese context.
  - Primary CTA ("เริ่มเรียน" / "เลือกบทเรียน") linking to HSK level catalog.
  - Secondary CTA ("ดูตัวอย่างบทเรียน" / "คู่มือการใช้งาน").
- **Right Column (2D Preview Card)**:
  - Responsive preview card containing scene illustration and character pose layers.
  - Speech bubble / dialogue box showing:
    - Chinese Hanzi (large, readable)
    - Pinyin with tone marks
    - Thai translation aid (editorial support)
  - Interactive audio button triggering [`playUiCue`](file:///home/nong_ing/group3-standalone/source/src/surfaces/group-3-8104/services/audio/index.js) or character voice.
  - Previous / Next slide arrows and pagination dots.

### 2. Feature Cards & Modal Demos
The 4 feature cards below the Hero section must open working interactive demo modals without leaving the Home page:
1. **ฟังและอ่าน (Listen & Read)**: Demo dialogue line with sentence playback and Pinyin toggle.
2. **ลองพูดตอบ (Roleplay & Speak)**: Interactive dialogue response choice with instant feedback.
3. **จำคำศัพท์จากเรื่อง (Vocab in Context)**: Mini flashcard showing character stroke, meaning, and audio.
4. **ทบทวนด้วยเกม (Review with Mini-Games)**: Interactive sample question (e.g. tone or pinyin match).

> **Flow Alignment**: Keep demo data across all 4 modals contextualized around the same scenario (e.g., ordering food or greeting friends) to illustrate the learning journey.

### 3. Responsive & Mobile Touch Checks
- On mobile (`<= 640px`), stack hero columns vertically (headline top, preview below).
- Ensure all interactive buttons meet the `>= 44px` minimum touch target contract.
- Support safe-area insets (`env(safe-area-inset-top)` and `env(safe-area-inset-bottom)`).

---

## Verification

After making changes to Home components or styles, run:

```bash
cd /home/nong_ing/group3-standalone/source
npm test tests/unit/standalone-boundary.test.js
npm test tests/unit/theme-policy.test.js
npm test tests/unit/mobile_group3_empirical.test.js
```
