const MOBILE_BREAKPOINT = 768;
const LOW_END_DEVICE_MEMORY_GB = 2;
const LOW_END_PROCESSOR_COUNT = 2;

function positiveNumber(value, fallback) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : fallback;
}

export function getAdaptiveThreePolicy(capabilities = {}) {
  const viewportWidth = positiveNumber(capabilities.viewportWidth, 1024);
  const devicePixelRatio = positiveNumber(capabilities.devicePixelRatio, 1);
  const deviceMemory = positiveNumber(capabilities.deviceMemory, 0);
  const hardwareConcurrency = positiveNumber(capabilities.hardwareConcurrency, 0);
  const mobile = viewportWidth <= MOBILE_BREAKPOINT;
  const reducedMotion = Boolean(capabilities.reducedMotion);
  const saveData = Boolean(capabilities.saveData);
  const lowEnd = (
    (deviceMemory > 0 && deviceMemory <= LOW_END_DEVICE_MEMORY_GB)
    || (hardwareConcurrency > 0 && hardwareConcurrency <= LOW_END_PROCESSOR_COUNT)
  );
  const allowDecorativeWebGL = !reducedMotion && !saveData && !lowEnd;
  const maxDpr = mobile ? 1.25 : 1.75;
  const targetFps = mobile ? 30 : 60;

  return {
    allowDecorativeWebGL,
    devicePixelRatio: Math.min(devicePixelRatio, maxDpr),
    lowEnd,
    maxDpr,
    mobile,
    particleCount: mobile ? 64 : 160,
    reducedMotion,
    saveData,
    targetFps,
    targetFrameMs: 1000 / targetFps,
    visibleCharacterCount: mobile ? 10 : 20,
  };
}

export function getBrowserAdaptiveThreePolicy(
  browserWindow = typeof window === "undefined" ? undefined : window,
  browserNavigator = typeof navigator === "undefined" ? undefined : navigator,
) {
  return getAdaptiveThreePolicy({
    viewportWidth: browserWindow?.innerWidth,
    devicePixelRatio: browserWindow?.devicePixelRatio,
    reducedMotion: browserWindow?.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches,
    saveData: browserNavigator?.connection?.saveData,
    deviceMemory: browserNavigator?.deviceMemory,
    hardwareConcurrency: browserNavigator?.hardwareConcurrency,
  });
}
