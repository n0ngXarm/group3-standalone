import assert from "node:assert/strict";
import { test } from "node:test";

import { GROUP3_LESSONS } from "../../src/surfaces/group-3-8104/content/registry.js";

function getTileGloss(glossMap, text) {
  if (!glossMap || !text) return "";
  if (glossMap[text]) return glossMap[text];
  const clean = text.replace(/^[，。！？、.!?, \s]+|[，。！？、.!?, \s]+$/g, "");
  if (glossMap[clean]) return glossMap[clean];
  for (const [key, val] of Object.entries(glossMap)) {
    const cleanKey = key.replace(/^[，。！？、.!?, \s]+|[，。！？、.!?, \s]+$/g, "");
    if (cleanKey === clean) return val;
  }
  return "";
}

test("All lessons and scenes have complete and resolved gloss for all builder tiles", async () => {
  let builderCount = 0;
  for (const lessonSummary of GROUP3_LESSONS) {
    const lesson = lessonSummary.load ? await lessonSummary.load() : lessonSummary;
    for (const scene of lesson.scenes) {
      if (!scene.builder) continue;
      builderCount += 1;
      const { answer, tiles, gloss } = scene.builder;
      assert.ok(gloss, `Scene ${lesson.id}/${scene.id} must have gloss object`);

      // Check all answer tokens have gloss
      for (const token of answer) {
        const translation = getTileGloss(gloss, token);
        assert.ok(
          translation && translation.trim().length > 0,
          `Answer token "${token}" in ${lesson.id}/${scene.id} must have a non-empty Thai translation, got: "${translation}"`
        );
      }

      // Check all tiles have gloss
      for (const tile of tiles) {
        const translation = getTileGloss(gloss, tile);
        assert.ok(
          translation && translation.trim().length > 0,
          `Tile "${tile}" in ${lesson.id}/${scene.id} must have a non-empty Thai translation, got: "${translation}"`
        );
      }
    }
  }

  assert.equal(builderCount, 14, "Must verify all 14 builder challenges");
});
