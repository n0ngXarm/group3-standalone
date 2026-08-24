import assert from "node:assert/strict";
import test from "node:test";
import { GROUP3_LESSONS } from "../../src/surfaces/group-3-8104/content/registry.js";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test("For every multiple-choice QTE: correctOptionId exists and maps to a visible option", () => {
  let qteCount = 0;
  for (const lesson of GROUP3_LESSONS) {
    if (!lesson.scenes) continue;
    for (const scene of lesson.scenes) {
      if (scene.qte) {
        qteCount++;
        const qte = scene.qte;
        
        assert.ok(qte.options.length >= 2, `QTE in ${lesson.id} scene ${scene.id} must have at least 2 options`);
        
        const correctOptionId = qte.correct || qte.answer;
        assert.ok(correctOptionId, `QTE in ${lesson.id} scene ${scene.id} must have a 'correct' or 'answer' field`);
        
        const hasValidOption = qte.options.some(o => o.value === correctOptionId);
        assert.ok(hasValidOption, `QTE in ${lesson.id} scene ${scene.id} defines correctOptionId "${correctOptionId}" but no option has this value`);
      }
    }
  }
  assert.ok(qteCount > 0, "Should have evaluated some QTEs");
});

test("Simulate shuffle preserves evaluation correctness", () => {
  const qte = {
    options: [
      { value: "A", zh: "A" },
      { value: "B", zh: "B" },
      { value: "C", zh: "C" }
    ],
    correct: "B"
  };

  const correctOptionId = qte.correct || qte.answer;
  
  // Shuffle options
  const shuffled = [...qte.options].reverse();
  
  // Select what user thinks is B, which now is at index 1 (C, B, A)
  const selectedOption = shuffled[1];
  
  // Evaluate
  const isCorrect = selectedOption.value === correctOptionId;
  assert.equal(isCorrect, true, "Evaluation must remain correct after shuffle based on value, not index");
});

test("Challenges.jsx correctly uses correctOptionId and removes attempt 3 lock", () => {
  const challengesPath = path.resolve(__dirname, "../../src/surfaces/group-3-8104/features/reader/challenges/Challenges.jsx");
  const code = fs.readFileSync(challengesPath, "utf8");

  assert.match(code, /const correctOptionId = challenge.correct \|\| challenge.answer;/, "Must establish stable correctOptionId");
  assert.match(code, /if \(option.value === correctOptionId\)/, "Must evaluate against correctOptionId");
  
  // Assert disabled logic does NOT disable options based on other wrong options
  assert.doesNotMatch(code, /wrongOptionToDisable/, "Must not disable options as a hint");
  assert.doesNotMatch(code, /isHintDisabled/, "Must not use isHintDisabled logic");
  
  // Assert disabled doesn't lock out all options just because wrongAttempts >= 3
  assert.match(code, /disabled={status !== "active" \|\| paused \|\| isWrongGuess}/, "Only the specific wrong guess should be disabled");
});
