# Group3 Audio Content Integrity Rescue Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Prove the sentence/audio contract for all 54 registered dialogue lines and 30 Repeat prompts, block false-positive media verification, and preserve every MP3 until payload replacement is explicitly approved.

**Architecture:** Canonical lesson objects remain the expected-content authority. A development-only audit independently joins those objects to resolved URLs, physical hashes, payload metadata pinned from the pre-curation manifest, durations, and Repeat source references; runtime unit/browser tests separately prove cache, fallback, cancellation, and current-line behavior.

**Tech Stack:** Node.js ESM, native `node:test`, React 19, Puppeteer, Vite, ffprobe.

**Spec:** User-provided “GROUP3 — P0 AUDIO ↔ CONTENT INTEGRITY RESCUE” request in this session.

## Global Constraints

- Do not redesign UI, routing, learner session, scoring, pronunciation, QTE, Summary, Image Description, Question Response, or CSS.
- Do not rewrite Chinese lesson content unless separately classified as `CONTENT_SOURCE_ERROR`.
- Do not regenerate or replace any MP3 without reporting exact files and receiving approval.
- Resolver/code changes require a confirmed causal mechanism and a failing regression test first.
- Preserve existing user-owned `dist`, `artifacts`, and `docs` worktree changes.

---

### Task 1: Development Audio Manifest Audit

**Files:**
- Create: `source/scripts/audio-integrity-audit.mjs`
- Create: `source/tests/unit/group-3.audio-integrity-audit.test.js`
- Modify: `source/package.json`

**Interfaces:**
- Consumes: `GROUP3_LESSONS`, `dialogueVoicePath()`, `public/assets/group3/audio/manifest.json`, `scripts/media/generate-group3-voices-8104.py`, physical MP3 bytes, and ffprobe duration output.
- Produces: `auditDialogueAudio({ includeDurations }) -> { rows, duplicateGroups, summary }` and an `npm run audit:audio` release-blocking CLI exit code.

- [x] **Step 1: Write a failing detector test**

  Exercise a hand-written fixture where the expected line and payload provenance share a hash but have different Hanzi; require `WRONG_LINE`, plus `MISSING` and `DUPLICATE_AUDIO` fixture cases.

- [x] **Step 2: Run the test and verify RED**

  Run: `npm test tests/unit/group-3.audio-integrity-audit.test.js`

  Expected: FAIL because `audio-integrity-audit.mjs` does not exist.

- [x] **Step 3: Implement the minimal detector and real 54-line audit**

  Pin the pre-curation manifest metadata as independent payload provenance, hash canonical MP3s, join by SHA-256, validate URL ownership fields, and report actual payload text/profile without modifying media. The current generator tuples remain useful only for the broader legacy duplicate scan because legacy aliases were also overwritten.

- [x] **Step 4: Run the focused test and CLI**

  Run: `npm test tests/unit/group-3.audio-integrity-audit.test.js`

  Expected: PASS.

  Run: `npm run audit:audio`

  Expected: non-zero while any registered payload is not `MATCH`, with a complete 54-row table.

### Task 2: Runtime Resolver, Cache, TTS, and Race Contracts

**Files:**
- Modify: `source/tests/unit/group-3.audio.test.js`
- Modify: `source/tests/unit/group-3.repeat-content-adapter.test.js`
- Modify only if a new test proves a runtime defect: `source/src/surfaces/group-3-8104/services/audio/group3Audio.js`

**Interfaces:**
- Consumes: `speakChinese()`, `stopChineseVoice()`, `dialogueVoicePath()`, `buildRepeatSessionDefinitions()`.
- Produces: proof that full URLs are cache keys, late decode cannot play, fallback uses current Hanzi, and all 30 Repeat definitions derive audio from canonical `sourceRef`.

- [x] **Step 1: Add literal cross-level/cross-lesson cache and stale-playback tests**
- [x] **Step 2: Run focused tests and confirm whether existing behavior passes**
- [x] **Step 3: If and only if RED exposes a real runtime defect, make the narrowest production fix**
- [x] **Step 4: Re-run audio and Repeat unit gates**

### Task 3: Reader and Repeat Browser Audio Matrix

**Files:**
- Create: `source/tests/browser/group-3.audio-integrity-smoke.mjs`

**Interfaces:**
- Consumes: built/dev Group3 routes and browser network/runtime events.
- Produces: recorded visible Hanzi/audio URLs for HSK1–3 Reader and Repeat, rapid-switch cancellation proof, language/theme stability, and zero uncaught audio exceptions.

- [x] **Step 1: Add a browser smoke that stubs only audio output while observing real resolved network URLs**
- [x] **Step 2: Visit at least two registered lessons and both scenes per HSK level where available**
- [x] **Step 3: Exercise Play, Replay, rapid line switching, scene/lesson switching, TH/ZH/EN, light/dark, and Repeat Next**
- [x] **Step 4: Run against the local Vite server and capture the matrix result**

### Task 4: Release Evidence and Stop Gate

**Files:**
- No additional product files.

**Interfaces:**
- Consumes: Tasks 1–3.
- Produces: the requested final audit report and exact approval-gated regeneration list.

- [x] **Step 1: Run targeted audio, lesson content, Repeat, and autoplay tests**
- [x] **Step 2: Run the full relevant test suite and browser smoke**
- [x] **Step 3: Run `VITE_BASE_PATH=/group3 npm run build` and `git diff --check`**
- [x] **Step 4: Report exact counts, distinguish runtime correctness from legacy alias compatibility, and stop before MP3 replacement**
