import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import puppeteer from "puppeteer";

const base = process.argv[2] || process.env.G3_BASE_URL || "http://127.0.0.1:4178/group3";
const outputDirectory = process.env.G3_RECORDING_LAYOUT_QA_DIR || "/tmp/group3-image-recording-layout";
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
    sessionStorage.setItem("huayun_learner_name", "Recording Layout QA");
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
      start() { this.onstart?.(); }
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

async function reachRecording(page) {
  await waitForPhase(page, "observe");
  await page.click(".g3-image-stage-actions .g3-practice-primary");
  await waitForPhase(page, "prepare");
  await page.click(".g3-image-stage-actions .g3-image-start");
  await waitForPhase(page, "recording");
  await new Promise((resolve) => setTimeout(resolve, 250));
}

async function measureRecording(page) {
  return page.evaluate(() => {
    const rect = (selector) => {
      const bounds = document.querySelector(selector)?.getBoundingClientRect();
      if (!bounds) throw new Error(`Missing recording layout target: ${selector}`);
      return Object.fromEntries(["top", "right", "bottom", "left", "width", "height"].map((key) => [key, Number(bounds[key].toFixed(2))]));
    };
    const content = document.querySelector(".g3-image-description-content");
    const microphone = document.querySelector(".g3-image-microphone");
    const title = document.querySelector(".g3-image-speaking .g3-image-state-copy h2");
    const lineHeight = Number.parseFloat(getComputedStyle(title).lineHeight);

    return {
      actions: rect(".g3-image-stage-actions"),
      card: rect(".g3-free-speaking--image-description"),
      content: rect(".g3-image-description-content"),
      copy: rect(".g3-image-speaking .g3-image-state-copy"),
      image: rect(".g3-image-description-visual"),
      mic: rect(".g3-image-microphone"),
      speaking: rect(".g3-image-speaking"),
      stage: rect(".g3-image-stage-content"),
      status: rect(".g3-image-recording-status"),
      stepper: rect(".g3-image-description-steps"),
      stop: rect(".g3-image-stage-actions .is-stop"),
      title: rect(".g3-image-speaking .g3-image-state-copy h2"),
      contentOverflow: content.scrollHeight - content.clientHeight,
      documentOverflowX: document.documentElement.scrollWidth - window.innerWidth,
      externalStatus: document.querySelector(".g3-practice-live")?.textContent?.trim() || "",
      micCssWidth: Number(Number.parseFloat(getComputedStyle(microphone).width).toFixed(2)),
      titleLineHeight: Number(lineHeight.toFixed(2)),
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

function assertRecordingLayout(layout, caseName, level) {
  const label = `${level} ${caseName}`;
  assert.equal(layout.externalStatus, "", `${label} repeats recording status outside the card`);
  assert.ok(layout.contentOverflow <= 1, `${label} content overflows by ${layout.contentOverflow}px`);
  assert.ok(layout.documentOverflowX <= 1, `${label} page overflows horizontally by ${layout.documentOverflowX}px`);
  assert.ok(layout.speaking.top >= layout.stage.top - 2, `${label} recording content extends above its stage`);
  assert.ok(layout.speaking.bottom <= layout.stage.bottom + 2, `${label} recording content extends below its stage`);
  assertOrdered(layout.stepper, layout.stage, `${label} stepper/stage`, 12);
  assertOrdered({ bottom: Math.max(layout.mic.bottom, layout.copy.bottom) }, layout.status, `${label} prompt/status`, 12);
  assertOrdered(layout.status, layout.actions, `${label} status/actions`, 12);
  assert.ok(layout.stop.height >= 44, `${label} stop target is below 44px`);
  assert.ok(layout.actions.bottom <= layout.card.bottom + 1, `${label} actions extend below the card`);

  if (caseName === "mobile") {
    assertOrdered(layout.image, layout.content, `${label} image/content`, 0);
    assert.ok(layout.card.width <= layout.viewportWidth, `${label} card exceeds viewport width`);
    assert.ok(layout.micCssWidth <= 56, `${label} microphone indicator is too large at ${layout.micCssWidth}px`);
  } else {
    assert.ok(layout.image.right <= layout.content.left + 1, `${label} desktop columns overlap`);
    assert.ok(layout.image.width / layout.content.width >= 1.25, `${label} image is not visually dominant during recording`);
    assert.ok(layout.micCssWidth <= 64, `${label} microphone indicator is too large at ${layout.micCssWidth}px`);
    assert.ok(layout.mic.right <= layout.copy.left, `${label} microphone and prompt overlap`);
    assert.ok(layout.title.height <= layout.titleLineHeight * 1.25, `${label} Thai recording title wraps on desktop`);
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
      await reachRecording(page);
      const layout = await measureRecording(page);
      assertRecordingLayout(layout, testCase.name, level);
      await page.screenshot({ path: `${outputDirectory}/${level}-${testCase.name}.png`, fullPage: true });
      await page.close();
    }
  }

  console.log("GROUP3_IMAGE_DESCRIPTION_RECORDING_LAYOUT_PASS");
} finally {
  await browser.close();
}
