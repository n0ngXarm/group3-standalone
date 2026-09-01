import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import puppeteer from "puppeteer";

const base = process.argv[2] || process.env.G3_BASE_URL || "http://127.0.0.1:4178/group3";
const outputDirectory = process.env.G3_RESULT_LAYOUT_QA_DIR || "/tmp/group3-image-result-layout";
const cases = [
  { name: "desktop", viewport: { width: 1440, height: 900 } },
  { name: "mobile", viewport: { width: 390, height: 844, isMobile: true, hasTouch: true } },
];

await mkdir(outputDirectory, { recursive: true });

const browser = await puppeteer.launch({
  args: ["--no-sandbox", "--use-fake-ui-for-media-stream", "--use-fake-device-for-media-stream"],
  headless: true,
});

function installSpeakingHarness(page) {
  return page.evaluateOnNewDocument(() => {
    sessionStorage.setItem("huayun_learner_name", "Result Layout QA");
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
          const result = Object.assign([{ transcript: "照片里有人在一起说话", confidence: 0.96 }], { isFinal: true });
          this.onresult?.({ resultIndex: 0, results: [result] });
        }, 20);
      }
      stop() { this.onend?.(); }
      abort() {}
    }

    Object.defineProperty(window, "MediaRecorder", { configurable: true, value: FakeMediaRecorder });
    Object.defineProperty(window, "SpeechRecognition", { configurable: true, value: FakeRecognition });
    Object.defineProperty(window, "webkitSpeechRecognition", { configurable: true, value: undefined });
  });
}

async function waitForPhase(page, phase) {
  await page.waitForSelector(`.g3-free-speaking--image-description[data-phase="${phase}"]`);
}

async function reachResult(page) {
  await waitForPhase(page, "observe");
  await page.click(".g3-image-stage-actions .g3-practice-primary");
  await waitForPhase(page, "prepare");
  await page.click(".g3-image-stage-actions .g3-image-start");
  await waitForPhase(page, "recording");
  await page.click(".g3-image-stage-actions .is-stop");
  await waitForPhase(page, "review");
  await page.click(".g3-image-stage-actions .g3-practice-primary");
  await waitForPhase(page, "result");
  await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  await new Promise((resolve) => setTimeout(resolve, 250));
}

async function measureResult(page) {
  return page.evaluate(() => {
    const rect = (selector) => {
      const bounds = document.querySelector(selector)?.getBoundingClientRect();
      if (!bounds) throw new Error(`Missing result layout target: ${selector}`);
      return Object.fromEntries(["top", "right", "bottom", "left", "width", "height"].map((key) => [key, Number(bounds[key].toFixed(2))]));
    };
    const content = document.querySelector(".g3-image-description-content");
    const stage = document.querySelector(".g3-image-stage-content");
    const buttons = [...document.querySelectorAll(".g3-image-stage-actions button")];

    return {
      actions: rect(".g3-image-stage-actions"),
      card: rect(".g3-free-speaking--image-description"),
      content: rect(".g3-image-description-content"),
      detail: rect(".g3-image-detail-button"),
      heading: rect(".g3-image-result-heading"),
      image: rect(".g3-image-description-visual"),
      metrics: rect(".g3-image-metrics"),
      notes: rect(".g3-image-feedback-notes"),
      result: rect(".g3-image-feedback"),
      stage: rect(".g3-image-stage-content"),
      stepper: rect(".g3-image-description-steps"),
      contentOverflow: content.scrollHeight - content.clientHeight,
      documentOverflowX: document.documentElement.scrollWidth - window.innerWidth,
      stageOverflow: stage.scrollHeight - stage.clientHeight,
      touchTargets: buttons.map((button) => Number(button.getBoundingClientRect().height.toFixed(2))),
      viewportWidth: window.innerWidth,
    };
  });
}

function assertOrdered(upper, lower, label, minimumGap = 8) {
  assert.ok(
    lower.top - upper.bottom >= minimumGap,
    `${label} overlaps or has insufficient spacing: ${lower.top - upper.bottom}px`,
  );
}

function assertResultLayout(layout, caseName, level) {
  const label = `${level} ${caseName}`;
  assert.ok(layout.contentOverflow <= 1, `${label} content overflows by ${layout.contentOverflow}px`);
  assert.ok(layout.stageOverflow <= 1, `${label} result stage overflows by ${layout.stageOverflow}px`);
  assert.ok(layout.documentOverflowX <= 1, `${label} page overflows horizontally by ${layout.documentOverflowX}px`);
  assertOrdered(layout.stepper, layout.result, `${label} stepper/result`, 12);
  assertOrdered(layout.heading, layout.metrics, `${label} heading/metrics`);
  assertOrdered(layout.metrics, layout.notes, `${label} metrics/notes`);
  assertOrdered(layout.notes, layout.detail, `${label} notes/details`);
  assertOrdered(layout.detail, layout.actions, `${label} details/actions`, 12);
  assert.ok(layout.actions.bottom <= layout.card.bottom + 1, `${label} actions extend below the card`);
  assert.ok(layout.touchTargets.every((height) => height >= 44), `${label} action target is below 44px`);

  if (caseName === "mobile") {
    assertOrdered(layout.image, layout.content, `${label} image/content`, 0);
    assert.ok(layout.card.width <= layout.viewportWidth, `${label} card exceeds viewport width`);
  } else {
    assert.ok(layout.image.right <= layout.content.left + 1, `${label} desktop columns overlap`);
  }
}

try {
  for (const testCase of cases) {
    for (const level of ["hsk1", "hsk2", "hsk3"]) {
      const page = await browser.newPage();
      await page.setViewport(testCase.viewport);
      await installSpeakingHarness(page);
      await page.goto(`${base}/home/${level}/practice/image-description/?theme=light`, { waitUntil: "networkidle0" });
      await page.waitForFunction(() => {
        const image = document.querySelector(".g3-image-description-visual img");
        return image?.complete && image.naturalWidth > 0;
      });
      await page.$eval(".g3-image-description-visual img", (image) => image.decode());
      await reachResult(page);
      const layout = await measureResult(page);
      assertResultLayout(layout, testCase.name, level);
      await page.screenshot({ path: `${outputDirectory}/${level}-${testCase.name}.png`, fullPage: true });
      await page.close();
    }
  }

  console.log("GROUP3_IMAGE_DESCRIPTION_RESULT_LAYOUT_PASS");
} finally {
  await browser.close();
}
