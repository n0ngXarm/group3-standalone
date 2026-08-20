---
name: group3-curation-media
description: >-
  Guide for adding, curating, and validating HSK 1–3 lesson content, vocabulary lists, voice personas (28 signatures), and media assets (WebP images & MP3 audio). Use when modifying lesson dialogues, adding audio tracks, registering new lessons, or validating media manifests.
---

# Group 3 Lesson Curation & Media Pipeline

Guide for managing HSK 1–3 learning content, character voice mapping, and media assets in Group 3 Standalone.

---

## Content Structure & Registry

All lessons are registered in [`registry.js`](file:///home/nong_ing/group3-standalone/source/src/surfaces/group-3-8104/content/registry.js) and split by level under [`lessons/`](file:///home/nong_ing/group3-standalone/source/src/surfaces/group-3-8104/content/lessons/):

```text
source/src/surfaces/group-3-8104/content/
├── registry.js               # Central lesson manifest and findLesson helper
├── copy.js                   # UI copy and localized strings (TH, ZH, EN)
└── lessons/
    ├── hsk1/                 # Level 1 lessons (e.g. lesson-01, lesson-02, ...)
    ├── hsk2/                 # Level 2 lessons
    └── hsk3/                 # Level 3 lessons
```

### Lesson Content Schema Contract
Every lesson file (`content.js`) must export a lesson object conforming to:
- `id`: Unique identifier (e.g. `"hsk1-l1"`).
- `title`: Multilingual title `{ zh, pinyin, en, thAid }`. Note that Thai text is strictly **editorial aid** (`thAid`), not a raw translation.
- `scenes`: Array of scenario scenes containing:
  - Scene title & context (`title`, `titleTh`, `context`, `contextTh`).
  - `lines`: Dialogue entries with `speaker`, `role`, `hanzi`, `pinyin`, `thAid`, and `dialogueVoicePath`.
  - `vocabulary`: Key vocabulary words for the scene `{ hanzi, pinyin, meaningTh, partOfSpeech }`.
- `learningRows`: Row items with local PDF source reference contracts.

---

## Voice Persona Registry (28 Personas)

The voice synthesis and audio playback system maps speakers to 28 distinct personas:
- **Registry files**: [`voice-cast.json`](file:///home/nong_ing/group3-standalone/source/src/surfaces/group-3-8104/services/audio/voice-cast.json) and [`voices.js`](file:///home/nong_ing/group3-standalone/source/src/surfaces/group-3-8104/services/audio/voices.js).
- **Speaker Mapping**: Every character in every lesson scene must resolve to one of the 28 registered personas with matching gender, age tone, and transform parameters.
- **Audio Files**: MP3 files reside in `source/public/audio/` and are resolved via canonical helper [`surfaceAssetPath`](file:///home/nong_ing/group3-standalone/source/src/shared/lib/index.js).

---

## Media Asset Constraints

1. **WebP Images**:
   - All background and character pose images must be in WebP format.
   - File size must remain strictly **under 160 KiB** per image for mobile performance.
2. **Audio Cache Busting**:
   - Independent revision hashes are maintained for media assets to ensure seamless client updates.

---

## Curation & Manifest Scripts

Use the scripts in [`source/scripts/`](file:///home/nong_ing/group3-standalone/source/scripts/) when batch-updating or verifying content:

```bash
cd /home/nong_ing/group3-standalone

# Verify media manifest and dialogue audio integrity
node source/scripts/verify-manifest.mjs

# Curate or sync dynamic lesson content
node source/scripts/curate-lessons.mjs
```

---

## Quality Gate Tests

Run the following unit tests to verify content schemas and media links:

```bash
cd /home/nong_ing/group3-standalone/source

# Verify voice personas and 28 persona signatures
npm test tests/unit/group-3.voice-personas.test.js

# Verify audio path resolution and manifest coverage
npm test tests/unit/group-3.audio.test.js

# Verify lesson content contracts and PDF source references
npm test tests/unit/group-3.lesson-13.test.js
```
