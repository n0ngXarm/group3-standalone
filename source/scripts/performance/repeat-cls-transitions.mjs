import assert from "node:assert/strict";
import puppeteer from "puppeteer";

const base = (process.argv[2] ?? "http://127.0.0.1:4178/group3").replace(/\/$/, "");
const theme = process.argv[3] ?? "dark";
const viewport = {
  height: Number(process.argv[5] ?? 768),
  width: Number(process.argv[4] ?? 1366),
};

const browser = await puppeteer.launch({
  headless: true,
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function clickByText(page, text) {
  const clicked = await page.evaluate((needle) => {
    const button = [...document.querySelectorAll("button")]
      .find((candidate) => candidate.textContent.includes(needle));
    button?.click();
    return Boolean(button);
  }, text);
  assert.equal(clicked, true, `button not found: ${text}`);
}

async function waitForPhase(page, phase, timeout = 15_000) {
  await page.waitForFunction(
    (expected) => document.querySelector(".g3-repeat-panel")?.dataset.phase === expected,
    { timeout },
    phase,
  );
}

async function beginWindow(page, label) {
  await page.evaluate((name) => {
    window.__g3ClsWindow = name;
    window.__g3ClsWindows[name] = [];
  }, label);
}

async function finishWindow(page, label) {
  await wait(800);
  return page.evaluate((name) => {
    const entries = window.__g3ClsWindows[name] ?? [];
    return {
      cls: entries.reduce((sum, entry) => sum + entry.value, 0),
      entries,
      phaseTimeline: window.__g3PhaseTimeline,
    };
  }, label);
}

async function snapshot(page, label) {
  const metrics = await page.evaluate(() => {
    const rect = (selector) => {
      const element = document.querySelector(selector);
      return element ? element.getBoundingClientRect().toJSON() : null;
    };
    const detail = document.querySelector(".g3-repeat-feedback-detail");
    return {
      action: rect(".g3-repeat-interaction .g3-practice-actions"),
      brokenImages: [...document.images]
        .filter((image) => image.complete && image.naturalWidth === 0)
        .map((image) => image.currentSrc || image.src),
      detail: detail ? { clientHeight: detail.clientHeight, scrollHeight: detail.scrollHeight } : null,
      documentWidth: document.documentElement.scrollWidth,
      interaction: rect(".g3-repeat-interaction"),
      panel: rect(".g3-repeat-panel"),
      phase: document.querySelector(".g3-repeat-panel")?.dataset.phase,
      prompt: rect(".g3-repeat-prompt"),
      viewportWidth: innerWidth,
      visual: rect(".g3-repeat-visual"),
    };
  });
  await page.screenshot({ path: `/tmp/group3-repeat-${viewport.width}x${viewport.height}-${theme}-${label}.png`, fullPage: false });
  assert.ok(metrics.panel?.width > 0 && metrics.panel?.height > 0, `${label}: missing panel`);
  assert.ok(metrics.documentWidth <= metrics.viewportWidth + 2, `${label}: horizontal overflow`);
  assert.deepEqual(metrics.brokenImages, [], `${label}: broken images`);
  return metrics;
}

async function runAttemptToFeedback(page) {
  await clickByText(page, "เริ่มพูด");
  await waitForPhase(page, "listening");
  await clickByText(page, "พูดเสร็จแล้ว");
  await waitForPhase(page, "feedback");
}

const page = await browser.newPage();
await page.setViewport(viewport);
await page.evaluateOnNewDocument(() => {
  sessionStorage.setItem("huayun_learner_name", "Repeat CLS Tester");

  class DeterministicRecognition {
    start() {
      this.onstart?.();
    }

    stop() {
      const alternative = { confidence: 0.96, transcript: "AI小语你好" };
      const result = Object.assign([alternative], { isFinal: true });
      this.onresult?.({ resultIndex: 0, results: [result] });
      this.onend?.();
    }

    abort() {
      this.onend?.();
    }
  }

  Object.defineProperty(window, "SpeechRecognition", {
    configurable: true,
    value: DeterministicRecognition,
  });
  Object.defineProperty(window, "webkitSpeechRecognition", {
    configurable: true,
    value: undefined,
  });

  const selectorFor = (node) => {
    if (!(node instanceof Element)) return String(node?.nodeName ?? "unknown");
    if (node.id) return `#${node.id}`;
    const classes = [...node.classList].slice(0, 3).join(".");
    return `${node.localName}${classes ? `.${classes}` : ""}`;
  };
  const rect = (value) => value ? ({
    height: value.height,
    left: value.left,
    top: value.top,
    width: value.width,
  }) : null;

  window.__g3ClsWindow = "cold_load";
  window.__g3ClsWindows = { cold_load: [] };
  window.__g3PhaseTimeline = [];
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.hadRecentInput) continue;
      const record = {
        phase: document.querySelector(".g3-repeat-panel")?.dataset.phase ?? "loading",
        sources: (entry.sources ?? []).map((source) => ({
          currentRect: rect(source.currentRect),
          node: selectorFor(source.node),
          previousRect: rect(source.previousRect),
        })),
        startTime: entry.startTime,
        value: entry.value,
      };
      const name = window.__g3ClsWindow;
      (window.__g3ClsWindows[name] ??= []).push(record);
    }
  }).observe({ type: "layout-shift", buffered: true });

  new MutationObserver(() => {
    const phase = document.querySelector(".g3-repeat-panel")?.dataset.phase ?? "loading";
    const latest = window.__g3PhaseTimeline.at(-1);
    if (latest?.phase !== phase) window.__g3PhaseTimeline.push({ phase, time: performance.now() });
  }).observe(document, { attributes: true, childList: true, subtree: true });
});

const errors = [];
page.on("pageerror", (error) => errors.push(`page: ${error.message}`));
page.on("console", (message) => {
  if (message.type() === "error") errors.push(`console: ${message.text()}`);
});

try {
  await page.goto(`${base}/home/hsk1/practice/repeat-sentence/?theme=${theme}`, {
    waitUntil: "domcontentloaded",
    timeout: 45_000,
  });
  await waitForPhase(page, "instructions");
  await page.evaluate(() => Promise.race([
    document.fonts.ready,
    new Promise((resolve) => setTimeout(resolve, 10_000)),
  ]));
  await wait(1_000);

  const snapshots = { prepare: await snapshot(page, "prepare") };

  const coldLoad = await page.evaluate(() => ({
    cls: Object.values(window.__g3ClsWindows).flat()
      .reduce((sum, entry) => sum + entry.value, 0),
    entries: Object.values(window.__g3ClsWindows).flat(),
    phaseTimeline: window.__g3PhaseTimeline,
  }));

  await beginWindow(page, "prepare_active");
  await clickByText(page, "เริ่มแบบฝึก");
  await waitForPhase(page, "ready");
  const prepareActive = await finishWindow(page, "prepare_active");
  snapshots.active = await snapshot(page, "active");

  await clickByText(page, "เริ่มพูด");
  await waitForPhase(page, "listening");
  await beginWindow(page, "active_feedback");
  await clickByText(page, "พูดเสร็จแล้ว");
  await waitForPhase(page, "feedback");
  const activeFeedback = await finishWindow(page, "active_feedback");
  snapshots.feedback = await snapshot(page, "feedback");
  const paintedProcessing = activeFeedback.phaseTimeline.some((entry) => entry.phase === "processing");
  const activeProcessingEntries = activeFeedback.entries.filter((entry) => entry.phase === "processing");
  const processingFeedbackEntries = activeFeedback.entries.filter((entry) => entry.phase === "feedback");

  await beginWindow(page, "feedback_retry");
  await clickByText(page, "ลองอีกครั้ง");
  await waitForPhase(page, "ready");
  const feedbackRetry = await finishWindow(page, "feedback_retry");

  await runAttemptToFeedback(page);
  await beginWindow(page, "feedback_next");
  await clickByText(page, "ข้อต่อไป");
  await waitForPhase(page, "ready");
  const feedbackNext = await finishWindow(page, "feedback_next");

  const result = {
    base,
    coldLoad,
    errors,
    paintedProcessing,
    snapshots,
    theme,
    viewport,
    transitions: {
      active_processing: {
        cls: activeProcessingEntries.reduce((sum, entry) => sum + entry.value, 0),
        entries: activeProcessingEntries,
      },
      feedback_next: feedbackNext,
      feedback_retry: feedbackRetry,
      prepare_active: prepareActive,
      processing_feedback: {
        cls: processingFeedbackEntries.reduce((sum, entry) => sum + entry.value, 0),
        entries: processingFeedbackEntries,
      },
    },
  };
  console.log(JSON.stringify(result, null, 2));
  assert.deepEqual(errors, [], "browser runtime errors");
  if (viewport.width > 860) {
    for (const [transition, measurement] of Object.entries(result.transitions)) {
      assert.ok(measurement.cls < 0.1, `${transition} CLS ${measurement.cls} must remain below 0.1`);
    }
  }
} finally {
  await page.close();
  await browser.close();
}
