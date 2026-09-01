import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import puppeteer from "puppeteer";

const base = process.argv[2] || process.env.G3_BASE_URL || "http://127.0.0.1:4178/group3";
const outputDirectory = process.env.G3_STAGE_QA_DIR || "/tmp/group3-image-stable-stage";
const viewport = { width: 1366, height: 768 };
const geometryTolerance = Object.freeze({ cardHeight: 4, position: 2, size: 2 });

await mkdir(outputDirectory, { recursive: true });

const browser = await puppeteer.launch({
  args: ["--no-sandbox", "--use-fake-ui-for-media-stream", "--use-fake-device-for-media-stream"],
  headless: true,
});

function installSpeakingHarness(page) {
  return page.evaluateOnNewDocument(() => {
    sessionStorage.setItem("huayun_learner_name", "Stable Stage QA");
    const track = { stop() {} };
    Object.defineProperty(navigator, "mediaDevices", {
      configurable: true,
      value: { getUserMedia: async () => ({ getTracks: () => [track] }) },
    });

    class FakeMediaRecorder {
      static isTypeSupported(type) { return type.includes("webm") || type.includes("mp4"); }
      constructor(_stream, options = {}) {
        this.mimeType = options.mimeType || "audio/webm";
        this.state = "inactive";
      }
      start() { this.state = "recording"; }
      stop() {
        if (this.state === "inactive") return;
        this.state = "inactive";
        this.ondataavailable?.({ data: new Blob(["voice"], { type: this.mimeType }) });
        this.onstop?.();
      }
    }

    class FakeRecognition {
      start() {
        this.onstart?.();
        setTimeout(() => {
          const result = Object.assign([{ transcript: "照片里有两个人在公园喝茶", confidence: 0.96 }], { isFinal: true });
          this.onresult?.({ resultIndex: 0, results: [result] });
        }, 20);
      }
      stop() { this.onend?.(); }
      abort() {}
    }

    Object.defineProperty(window, "MediaRecorder", { configurable: true, value: FakeMediaRecorder });
    Object.defineProperty(window, "SpeechRecognition", { configurable: true, value: FakeRecognition });
    Object.defineProperty(window, "webkitSpeechRecognition", { configurable: true, value: undefined });

    window.__g3LayoutShifts = [];
    new PerformanceObserver((list) => {
      window.__g3LayoutShifts.push(...list.getEntries().map((entry) => ({
        hadRecentInput: entry.hadRecentInput,
        value: entry.value,
      })));
    }).observe({ type: "layout-shift", buffered: true });
  });
}

async function settle(page) {
  await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  await new Promise((resolve) => setTimeout(resolve, 60));
}

async function resetShiftEntries(page) {
  await page.evaluate(() => { window.__g3LayoutShifts = []; });
}

async function measure(page, state) {
  await settle(page);
  const geometry = await page.evaluate(() => {
    const rect = (selector) => {
      const bounds = document.querySelector(selector)?.getBoundingClientRect();
      assertBounds(bounds, selector);
      return Object.fromEntries(["x", "y", "width", "height"].map((key) => [key, Number(bounds[key].toFixed(3))]));
    };
    function assertBounds(bounds, selector) {
      if (!bounds) throw new Error(`Missing geometry target: ${selector}`);
    }
    return {
      action: rect(".g3-image-stage-actions"),
      card: rect(".g3-free-speaking--image-description"),
      image: rect(".g3-image-description-visual"),
      panel: rect(".g3-image-description-content"),
      stepper: rect(".g3-image-description-steps"),
    };
  });
  await page.screenshot({ path: `${outputDirectory}/hsk1-light-1366x768-${state}.png`, fullPage: false });
  return geometry;
}

async function visualTreatment(page) {
  return page.evaluate(() => {
    const style = (selector, pseudo) => getComputedStyle(document.querySelector(selector), pseudo);
    return {
      activeStepAnimation: style('.g3-image-description-steps [aria-current="step"] span').animationName,
      activeStepColor: style('.g3-image-description-steps [aria-current="step"] span').backgroundColor,
      imageOverlay: style(".g3-image-description-visual", "::after").backgroundImage,
      panelBackground: style(".g3-image-description-content").backgroundImage,
      primaryColor: style(".g3-image-stage-actions .g3-practice-primary").backgroundColor,
      primaryShadow: style(".g3-image-stage-actions .g3-practice-primary").boxShadow,
      secondaryColor: style(".g3-image-stage-actions .is-secondary").backgroundColor,
      stateAnimation: style(".g3-image-description-state").animationName,
    };
  });
}

async function transition(page, from, to, action) {
  await resetShiftEntries(page);
  await action();
  await page.waitForSelector(`.g3-free-speaking--image-description[data-phase="${to}"]`);
  await settle(page);
  const shifts = await page.evaluate(() => window.__g3LayoutShifts || []);
  return {
    cls: Number(shifts.filter((entry) => !entry.hadRecentInput).reduce((sum, entry) => sum + entry.value, 0).toFixed(6)),
    rawLayoutShift: Number(shifts.reduce((sum, entry) => sum + entry.value, 0).toFixed(6)),
    transition: `${from}-${to}`,
  };
}

function delta(a, b, key) {
  return Math.abs(a[key] - b[key]);
}

function assertStable(reference, candidate, state) {
  for (const target of ["card", "image", "panel", "stepper", "action"]) {
    assert.ok(delta(reference[target], candidate[target], "x") <= geometryTolerance.position, `${state} ${target} x moved`);
    assert.ok(delta(reference[target], candidate[target], "y") <= geometryTolerance.position, `${state} ${target} y moved`);
    assert.ok(delta(reference[target], candidate[target], "width") <= geometryTolerance.size, `${state} ${target} width changed`);
    const heightLimit = target === "card" ? geometryTolerance.cardHeight : geometryTolerance.size;
    assert.ok(delta(reference[target], candidate[target], "height") <= heightLimit, `${state} ${target} height changed`);
  }
}

const page = await browser.newPage();
await page.setViewport(viewport);
await installSpeakingHarness(page);

try {
  await page.goto(`${base}/home/hsk1/practice/image-description/?theme=light`, { waitUntil: "networkidle0" });
  await page.waitForSelector('.g3-free-speaking--image-description[data-phase="observe"]');

  const stageHandle = await page.$(".g3-free-speaking--image-description");
  const stepperHandle = await page.$(".g3-image-description-steps");
  const geometry = { observe: await measure(page, "observe") };
  const observeTreatment = await visualTreatment(page);
  assert.notEqual(observeTreatment.stateAnimation, "none", "step content has no entrance effect");
  assert.notEqual(observeTreatment.activeStepAnimation, "none", "active step has no emphasis effect");
  assert.notEqual(observeTreatment.imageOverlay, "none", "image pane has no ambient treatment");
  assert.notEqual(observeTreatment.primaryShadow, "none", "primary action has no depth cue");
  assert.notEqual(observeTreatment.primaryColor, observeTreatment.secondaryColor, "primary and secondary actions have equal visual weight");
  assert.equal(observeTreatment.primaryColor, observeTreatment.activeStepColor, "10% accent is not shared by next action and active step");
  assert.notEqual(observeTreatment.panelBackground, "none", "30% surface layer is missing");
  const transitions = [];

  transitions.push(await transition(page, "observe", "prepare", () => page.click(".g3-image-stage-actions .g3-practice-primary")));
  geometry.prepare = await measure(page, "prepare");

  transitions.push(await transition(page, "prepare", "recording", () => page.click(".g3-image-stage-actions .g3-image-start")));
  geometry.speak = await measure(page, "speak");
  assert.notEqual(await page.$eval(".g3-image-microphone", (node) => getComputedStyle(node).animationName), "none", "recording microphone has no pulse effect");

  transitions.push(await transition(page, "recording", "review", () => page.click(".g3-image-stage-actions .is-stop")));
  geometry.review = await measure(page, "review");

  transitions.push(await transition(page, "review", "result", () => page.click(".g3-image-stage-actions .g3-practice-primary")));
  geometry.feedback = await measure(page, "feedback");

  transitions.push(await transition(page, "result", "observe", () => page.click(".g3-image-stage-actions .g3-practice-primary")));
  await page.waitForFunction(() => {
    const image = document.querySelector(".g3-image-description-visual img");
    return image?.complete && image.naturalWidth > 0;
  });
  geometry.item2 = await measure(page, "item2-observe");

  await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
  await settle(page);
  assert.equal(await page.$eval(".g3-image-description-state", (node) => getComputedStyle(node).animationName), "none", "reduced motion does not disable step animation");
  assert.equal(await page.$eval('.g3-image-description-steps [aria-current="step"] span', (node) => getComputedStyle(node).animationName), "none", "reduced motion does not disable step emphasis");

  const report = { geometry, transitions, viewport };
  await writeFile(`${outputDirectory}/geometry-report.json`, `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify(report, null, 2));

  assert.equal(await page.evaluate((node) => node === document.querySelector(".g3-free-speaking--image-description"), stageHandle), true, "stage DOM node remounted");
  assert.equal(await page.evaluate((node) => node === document.querySelector(".g3-image-description-steps"), stepperHandle), true, "stepper DOM node remounted");
  assert.ok(geometry.observe.card.height >= 440 && geometry.observe.card.height <= 480, `desktop card height ${geometry.observe.card.height}px outside target`);

  for (const state of ["prepare", "review", "item2"]) {
    assertStable(geometry.observe, geometry[state], state);
  }

  for (const key of ["x", "y", "width", "height"]) {
    const tolerance = key === "height" ? geometryTolerance.cardHeight : geometryTolerance.position;
    assert.ok(delta(geometry.observe.card, geometry.speak.card, key) <= tolerance, `speak card ${key} moved`);
  }

  assert.ok(
    geometry.feedback.card.height > geometry.observe.card.height,
    "feedback card does not expand to fit its result content",
  );

  for (const item of transitions) assert.equal(item.cls, 0, `${item.transition} CLS`);

  console.log("GROUP3_IMAGE_DESCRIPTION_STABLE_STAGE_PASS");
} finally {
  await page.close();
  await browser.close();
}
