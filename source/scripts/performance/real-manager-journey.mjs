import assert from "node:assert/strict";
import puppeteer from "puppeteer";

const base = "http://127.0.0.1:4178/group3";

const browser = await puppeteer.launch({
  headless: true,
  args: [
    "--no-sandbox",
    "--disable-setuid-sandbox",
    "--use-fake-ui-for-media-stream",
    "--use-fake-device-for-media-stream",
  ],
});

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const page = await browser.newPage();
await page.setViewport({ width: 1345, height: 848 });

const consoleErrors = [];
const hookWarnings = [];

page.on("pageerror", err => consoleErrors.push(`pageerror: ${err.message}`));
page.on("console", msg => {
  const text = msg.text();
  if (msg.type() === "error") {
    if (!text.includes("Failed to load resource") && !text.includes("favicon")) {
      consoleErrors.push(`console.error: ${text}`);
    }
  }
  if (text.includes("change in the order of Hooks") ||
      text.includes("Rendered more hooks than during the previous render") ||
      text.includes("Rendered fewer hooks than expected")) {
    hookWarnings.push(text);
  }
});

await page.evaluateOnNewDocument(() => {
  class DeterministicRecognition {
    start() { this.onstart?.(); }
    stop() {
      const alt = { confidence: 0.98, transcript: "你好我是学生" };
      const res = Object.assign([alt], { isFinal: true });
      this.onresult?.({ resultIndex: 0, results: [res] });
      this.onend?.();
    }
    abort() { this.onend?.(); }
  }
  Object.defineProperty(window, "SpeechRecognition", { configurable: true, value: DeterministicRecognition });
});

async function clickByText(needle) {
  const clicked = await page.evaluate((text) => {
    const btn = [...document.querySelectorAll("button, a")].find(b => b.textContent.includes(text));
    if (btn) { btn.click(); return true; }
    return false;
  }, needle);
  assert.ok(clicked, `Element with text "${needle}" not found on page ${page.url()}`);
}

console.log("=== STARTING REAL MANAGER JOURNEY ===");

// 1. Fresh session -> Home
console.log("1. Navigating to Home...");
await page.goto(`${base}/home/?theme=dark`, { waitUntil: "domcontentloaded" });
await page.waitForSelector("main, .g3-home, #g3-main", { timeout: 10000 });
assert.ok(await page.$(".g3-home, .g3-home-hero, main"), "Home page mounted");

// 2. Set Learner Name
console.log("2. Setting learner name in session...");
await page.evaluate(() => {
  sessionStorage.setItem("huayun_learner_name", "Manager Tester");
});

// 3. Levels
console.log("3. Navigating to Levels...");
await page.goto(`${base}/home/levels/?theme=dark`, { waitUntil: "domcontentloaded" });
await page.waitForSelector("main, .g3-level-selection, .g3-levels", { timeout: 10000 });
assert.ok(await page.$(".g3-level-selection, .g3-levels, main"), "Levels page mounted");

// 4. HSK1 Catalog
console.log("4. Navigating to HSK1 catalog...");
await page.goto(`${base}/home/hsk1/?theme=dark`, { waitUntil: "domcontentloaded" });
await page.waitForSelector("main, .g3-catalog", { timeout: 10000 });
assert.ok(await page.$(".g3-catalog"), "HSK1 catalog mounted");

// 5. Lesson 01 Contents
console.log("5. Navigating to Lesson 01 contents...");
await page.goto(`${base}/home/hsk1/lessons/lesson-01/contents/?theme=dark`, { waitUntil: "domcontentloaded" });
await page.waitForSelector("main, .g3-contents-page", { timeout: 10000 });
assert.ok(await page.$(".g3-contents-page, main"), "Lesson 01 contents mounted");

// 6. Scene 01 / QTE
console.log("6. Navigating to Lesson 01 Scene 01 (Reader/QTE)...");
await page.goto(`${base}/home/hsk1/lessons/lesson-01/scenes/scene-01/?theme=dark`, { waitUntil: "domcontentloaded" });
await page.waitForSelector("main, .g3-reader", { timeout: 10000 });
assert.ok(await page.$(".g3-reader, main"), "Scene 01 mounted");

// 7. Practice Hub
console.log("7. Navigating to Practice Hub...");
await page.goto(`${base}/home/hsk1/practice/?theme=dark`, { waitUntil: "domcontentloaded" });
await page.waitForSelector("main, .g3-practice-hub", { timeout: 10000 });
assert.ok(await page.$(".g3-practice-hub"), "Practice Hub mounted");

// 8. Repeat Sentence
console.log("8. Starting Repeat Sentence...");
await page.goto(`${base}/home/hsk1/practice/repeat-sentence/?theme=dark`, { waitUntil: "networkidle0" });
await wait(500);
await clickByText("เริ่มแบบฝึก");
await page.waitForFunction(() => document.querySelector(".g3-repeat-panel")?.dataset.phase === "ready");
await clickByText("เริ่มพูด");
await page.waitForFunction(() => document.querySelector(".g3-repeat-panel")?.dataset.phase === "listening");
await clickByText("พูดเสร็จแล้ว");
await page.waitForFunction(() => document.querySelector(".g3-repeat-panel")?.dataset.phase === "feedback");
console.log("Repeat Sentence feedback verified");

// 9. Image Description
console.log("9. Starting Image Description...");
await page.goto(`${base}/home/hsk1/practice/image-description/?theme=dark`, { waitUntil: "networkidle0" });
await wait(500);
await clickByText("เริ่มพูด");
await page.waitForSelector(".g3-practice-recording-state", { timeout: 5000 });
await wait(300);
await page.click(".g3-practice-primary.is-stop");
await page.waitForSelector(".g3-free-speaking-review", { timeout: 5000 });
await wait(200);
await clickByText("ส่งคำตอบ");
await page.waitForSelector(".g3-free-speaking-result", { timeout: 5000 });
console.log("Image Description result verified");

// 10. Question Response
console.log("10. Starting Question Response...");
await page.goto(`${base}/home/hsk1/practice/question-response/?theme=dark`, { waitUntil: "networkidle0" });
await wait(500);
await clickByText("เริ่มพูด");
await page.waitForSelector(".g3-practice-recording-state", { timeout: 5000 });
await wait(300);
await page.click(".g3-practice-primary.is-stop");
await page.waitForSelector(".g3-free-speaking-review", { timeout: 5000 });
await wait(200);
await clickByText("ส่งคำตอบ");
await page.waitForSelector(".g3-free-speaking-result", { timeout: 5000 });
console.log("Question Response result verified");

// 11. Practice Summary
console.log("11. Navigating to Practice Summary...");
await page.goto(`${base}/home/hsk1/practice/summary/?theme=dark`, { waitUntil: "networkidle0" });
await wait(500);
assert.ok(await page.$(".g3-learning-summary, .g3-summary-container, .g3-summary-title-block, main"), "Summary view mounted");

// 12. HSK2 & HSK3 Smoke
for (const lvl of ["hsk2", "hsk3"]) {
  console.log(`12. Smoke testing ${lvl.toUpperCase()}...`);
  await page.goto(`${base}/home/${lvl}/?theme=dark`, { waitUntil: "networkidle0" });
  await wait(400);
  assert.ok(await page.$(".g3-catalog"), `${lvl} catalog mounted`);

  await page.goto(`${base}/home/${lvl}/practice/?theme=dark`, { waitUntil: "networkidle0" });
  await wait(400);
  assert.ok(await page.$(".g3-practice-hub"), `${lvl} practice hub mounted`);
}

// 13. Nested Refresh check
console.log("13. Testing nested refresh...");
await page.goto(`${base}/home/hsk1/lessons/lesson-01/vocabulary/?theme=dark`, { waitUntil: "networkidle0" });
await page.reload({ waitUntil: "networkidle0" });
await wait(400);
assert.ok(await page.$("main"), "Reloaded page rendered properly");

assert.equal(hookWarnings.length, 0, `Hook warnings: ${hookWarnings.join(", ")}`);
assert.equal(consoleErrors.length, 0, `Console errors: ${consoleErrors.join(", ")}`);

console.log("=== REAL MANAGER JOURNEY COMPLETED: 100% PASS (0 CONSOLE ERRORS) ===");

await browser.close();
