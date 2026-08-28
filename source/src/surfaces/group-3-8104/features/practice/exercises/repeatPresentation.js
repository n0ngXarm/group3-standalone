const PREPARE_PHASES = new Set(["idle", "instructions"]);
const ACTIVE_PHASES = new Set(["playingPrompt", "ready", "listening", "processing", "transition"]);

export function getRepeatPresentation(phase) {
  const layout = phase === "feedback"
    ? "feedback"
    : PREPARE_PHASES.has(phase) ? "prepare" : "active";

  return {
    layout,
    showActiveControls: ACTIVE_PHASES.has(phase),
    showFeedback: phase === "feedback",
    showPrepareControls: phase === "instructions",
  };
}

export function resolveRepeatVisualAsset(manifest, exerciseId) {
  const asset = manifest?.[exerciseId]?.asset;
  return typeof asset === "string" && asset.startsWith("/assets/") ? asset : null;
}
