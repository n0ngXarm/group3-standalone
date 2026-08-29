import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const presentationModule = "../../src/surfaces/group-3-8104/features/practice/repeat/repeatPresentation.js";
const adapterModule = "../../src/surfaces/group-3-8104/content/practice/repeatAdapter.js";
const sessionModule = "../../src/surfaces/group-3-8104/features/practice/session/repeatSession.js";
const manifestUrl = new URL("../../public/assets/group3/shared/repeat-visuals/repeat-visual-manifest.json", import.meta.url);

async function loadPresentationModule() {
  try {
    return await import(presentationModule);
  } catch {
    return {};
  }
}

function readySession(createRepeatSession, repeatSessionReducer) {
  let state = createRepeatSession({
    exerciseIds: Array.from({ length: 10 }, (_, index) => `repeat-${index + 1}`),
    level: 1,
    sessionId: "repeat-presentation-test",
  });
  state = repeatSessionReducer(state, { type: "START" });
  state = repeatSessionReducer(state, { type: "PLAY_PROMPT" });
  return repeatSessionReducer(state, { type: "PROMPT_FINISHED" });
}

function feedbackSession(createRepeatSession, repeatSessionReducer) {
  let state = readySession(createRepeatSession, repeatSessionReducer);
  state = repeatSessionReducer(state, { attemptId: "attempt-1", type: "RECORD_START" });
  state = repeatSessionReducer(state, { attemptId: "attempt-1", transcript: "你好", type: "TRANSCRIPT_FINAL" });
  return repeatSessionReducer(state, {
    attemptId: "attempt-1",
    result: { metrics: { completion: 1, transcriptAccuracy: 1 }, score: 100, status: "correct" },
    type: "PROCESS_SUCCESS",
  });
}

test("reducer phases derive prepare, active, and feedback presentation without feedback placeholders", async () => {
  const { getRepeatPresentation } = await loadPresentationModule();
  assert.equal(typeof getRepeatPresentation, "function");

  for (const phase of ["idle", "instructions"]) {
    assert.deepEqual(getRepeatPresentation(phase), {
      layout: "prepare",
      showActiveControls: false,
      showFeedback: false,
      showPrepareControls: phase === "instructions",
    });
  }

  for (const phase of ["playingPrompt", "ready", "listening", "processing", "transition"]) {
    assert.equal(getRepeatPresentation(phase).layout, "active");
    assert.equal(getRepeatPresentation(phase).showFeedback, false);
  }

  assert.deepEqual(getRepeatPresentation("feedback"), {
    layout: "feedback",
    showActiveControls: false,
    showFeedback: true,
    showPrepareControls: false,
  });
});

test("repeat visual resolver uses exact exerciseId manifest entry and safely rejects missing entries", async () => {
  const { resolveRepeatVisualAsset } = await loadPresentationModule();
  assert.equal(typeof resolveRepeatVisualAsset, "function");
  const manifest = JSON.parse(await readFile(manifestUrl, "utf8"));

  assert.equal(
    resolveRepeatVisualAsset(manifest, "repeat-sentence:hsk1-l1:hsk1-l1-s1:0"),
    "/assets/group3/shared/repeat-visuals/hsk1/repeat-hsk1-01.webp",
  );
  assert.equal(resolveRepeatVisualAsset(manifest, "repeat-sentence:missing"), null);
  assert.equal(resolveRepeatVisualAsset({ unsafe: { asset: "javascript:alert(1)" } }, "unsafe"), null);
});

test("all 30 Repeat image entries retain the same canonical exercise identity as sentence and audio", async () => {
  const { buildRepeatSessionDefinitions } = await import(adapterModule);
  const manifest = JSON.parse(await readFile(manifestUrl, "utf8"));
  let audited = 0;

  for (const level of ["hsk1", "hsk2", "hsk3"]) {
    for (const exercise of await buildRepeatSessionDefinitions(level)) {
      const visual = manifest[exercise.exerciseId];
      assert.ok(visual, exercise.exerciseId);
      assert.equal(visual.level, exercise.level, exercise.exerciseId);
      assert.equal(visual.lessonId, exercise.sourceRef.lessonId, exercise.exerciseId);
      assert.equal(visual.sceneId, exercise.sourceRef.sceneId, exercise.exerciseId);
      assert.equal(visual.hanzi, exercise.hanzi, exercise.exerciseId);
      assert.match(visual.asset, new RegExp(`/repeat-visuals/${level}/repeat-${level}-\\d{2}\\.webp$`));
      audited += 1;
    }
  }

  assert.equal(audited, 30);
});

test("Retry returns feedback to active controls and Next advances to item 2", async () => {
  const { getRepeatPresentation } = await loadPresentationModule();
  const { createRepeatSession, repeatSessionReducer } = await import(sessionModule);
  const feedback = feedbackSession(createRepeatSession, repeatSessionReducer);

  const retried = repeatSessionReducer(feedback, { type: "RETRY" });
  assert.equal(retried.phase, "ready");
  assert.equal(getRepeatPresentation(retried.phase).layout, "active");

  const advanced = repeatSessionReducer(feedback, { type: "NEXT" });
  assert.equal(advanced.currentIndex, 1);
  assert.equal(advanced.phase, "transition");
  assert.equal(getRepeatPresentation(advanced.phase).layout, "active");
});
