import assert from "node:assert/strict";
import { test } from "node:test";

import {
  getAdaptiveThreePolicy,
  getBrowserAdaptiveThreePolicy,
} from "../../src/shared/lib/adaptive-performance.js";

test("uses the capable desktop tier and caps DPR", () => {
  const policy = getAdaptiveThreePolicy({
    viewportWidth: 1440,
    devicePixelRatio: 3,
    deviceMemory: 8,
    hardwareConcurrency: 8,
  });

  assert.equal(policy.allowDecorativeWebGL, true);
  assert.equal(policy.devicePixelRatio, 1.75);
  assert.equal(policy.targetFps, 60);
  assert.equal(policy.visibleCharacterCount, 20);
  assert.equal(policy.particleCount, 160);
});

test("uses the standard mobile frame, DPR, and scene budgets", () => {
  const policy = getAdaptiveThreePolicy({
    viewportWidth: 390,
    devicePixelRatio: 3,
    deviceMemory: 4,
    hardwareConcurrency: 6,
  });

  assert.equal(policy.allowDecorativeWebGL, true);
  assert.equal(policy.devicePixelRatio, 1.25);
  assert.equal(policy.targetFps, 30);
  assert.equal(policy.visibleCharacterCount, 10);
  assert.equal(policy.particleCount, 64);
});

test("disables decorative WebGL for accessibility and constrained devices", () => {
  const constrainedCases = [
    { reducedMotion: true },
    { saveData: true },
    { deviceMemory: 2 },
    { hardwareConcurrency: 2 },
  ];

  constrainedCases.forEach((capabilities) => {
    assert.equal(
      getAdaptiveThreePolicy({ viewportWidth: 1024, ...capabilities }).allowDecorativeWebGL,
      false,
    );
  });
});

test("treats missing, zero, and invalid hardware hints as unknown", () => {
  for (const value of [undefined, null, 0, -1, "unknown"]) {
    const policy = getAdaptiveThreePolicy({
      viewportWidth: 1024,
      deviceMemory: value,
      hardwareConcurrency: value,
    });
    assert.equal(policy.allowDecorativeWebGL, true);
  }
});

test("reads browser capability signals without requiring real globals", () => {
  const policy = getBrowserAdaptiveThreePolicy(
    {
      innerWidth: 430,
      devicePixelRatio: 2,
      matchMedia: () => ({ matches: false }),
    },
    {
      connection: { saveData: true },
      deviceMemory: 4,
      hardwareConcurrency: 8,
    },
  );

  assert.equal(policy.mobile, true);
  assert.equal(policy.saveData, true);
  assert.equal(policy.allowDecorativeWebGL, false);
});
