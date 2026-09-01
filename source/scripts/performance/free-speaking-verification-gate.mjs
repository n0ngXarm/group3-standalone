import assert from "node:assert/strict";
import puppeteer from "puppeteer";

const base = (process.argv[2] ?? "http://127.0.0.1:4178/group3").replace(/\/$/, "");

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

async function clickByText(page, text) {
  const clicked = await page.evaluate((needle) => {
    const btn = [...document.querySelectorAll("button")].find(b => b.textContent.includes(needle));
    if (btn) { btn.click(); return true; }
    return false;
  }, text);
  assert.ok(clicked, `Button with text "${text}" not found`);
}

async function setupPage(viewport = { width: 1345, height: 848 }) {
  const page = await browser.newPage();
  await page.setViewport(viewport);
  
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
        text.includes("Rendered fewer hooks than expected") ||
        text.includes("Rules of Hooks")) {
      hookWarnings.push(text);
    }
  });

  await page.evaluateOnNewDocument(() => {
    sessionStorage.setItem("huayun_learner_name", "FreeSpeaking Tester");
    class DeterministicRecognition {
      start() { this.onstart?.(); }
      stop() {
        const alt = { confidence: 0.98, transcript: "你好这是测试" };
        const res = Object.assign([alt], { isFinal: true });
        this.onresult?.({ resultIndex: 0, results: [res] });
        this.onend?.();
      }
      abort() { this.onend?.(); }
    }
    Object.defineProperty(window, "SpeechRecognition", { configurable: true, value: DeterministicRecognition });
  });

  return { page, consoleErrors, hookWarnings };
}

console.log("============================================================");
console.log("1. STARTING FUNCTIONAL VERIFICATION GATE ON:", base);
console.log("============================================================");

// 2. IMAGE DESCRIPTION — REAL INTERACTION (HSK1)
{
  console.log("\n--- [2. IMAGE DESCRIPTION HSK1] ---");
  const { page, consoleErrors, hookWarnings } = await setupPage();
  try {
    await page.goto(`${base}/home/hsk1/practice/image-description/?theme=dark`, { waitUntil: "networkidle0" });
    await wait(600);

    // Verify elements
    const item1 = await page.evaluate(() => {
      const img = document.querySelector(".g3-free-speaking-image img");
      const hanzi = document.querySelector(".g3-free-speaking-prompt h2")?.textContent;
      const pinyin = document.querySelector(".g3-practice-pinyin")?.textContent;
      const thai = document.querySelector(".g3-free-speaking-prompt p:not(.g3-practice-pinyin)")?.textContent;
      const progress = document.querySelector(".g3-practice-progress")?.textContent;
      return {
        hasImage: Boolean(img && img.complete && img.naturalWidth > 0),
        imgSrc: img?.src,
        hanzi,
        pinyin,
        thai,
        progress
      };
    });

    console.log("Item 1 Details:", item1);
    assert.ok(item1.hasImage, "Image 1 must be decoded and have naturalWidth > 0");
    assert.ok(item1.hanzi, "Hanzi prompt required");
    assert.ok(item1.pinyin, "Pinyin prompt required");
    assert.ok(item1.thai, "Thai prompt required");

    // Start speaking
    await clickByText(page, "เริ่มพูด");
    await page.waitForSelector(".g3-practice-recording-state", { timeout: 5000 });
    console.log("Recording state active");

    // Stop speaking
    await page.click(".g3-practice-primary.is-stop");
    await page.waitForSelector(".g3-free-speaking-review", { timeout: 5000 });
    console.log("Review state active");

    // Submit answer
    await clickByText(page, "ส่งคำตอบ");
    await page.waitForSelector(".g3-free-speaking-result", { timeout: 5000 });
    console.log("Result state active");

    // Advance to Item 2
    await clickByText(page, "ข้อต่อไป");
    await wait(600);

    const item2 = await page.evaluate(() => {
      const img = document.querySelector(".g3-free-speaking-image img");
      const progress = document.querySelector(".g3-practice-progress")?.textContent;
      return {
        hasImage: Boolean(img && img.complete && img.naturalWidth > 0),
        progress
      };
    });
    console.log("Item 2 Details:", item2);
    assert.ok(item2.hasImage, "Image 2 must be decoded");
    assert.match(item2.progress, /2\s*\/\s*2|2/, "Progress should show item 2");

    // Complete item 2
    await clickByText(page, "เริ่มพูด");
    await page.waitForSelector(".g3-practice-recording-state", { timeout: 5000 });
    await wait(300);
    await page.click(".g3-practice-primary.is-stop");
    await page.waitForSelector(".g3-free-speaking-review", { timeout: 5000 });
    await wait(200);
    await clickByText(page, "ส่งคำตอบ");
    await page.waitForSelector(".g3-free-speaking-result", { timeout: 5000 });
    await wait(200);
    await clickByText(page, "ข้อต่อไป");

    // Summary handoff
    await page.waitForSelector(".g3-practice-summary", { timeout: 5000 });
    console.log("Completed! Reached summary handoff.");
    
    assert.equal(hookWarnings.length, 0, `Hook warnings encountered: ${hookWarnings.join(", ")}`);
    assert.equal(consoleErrors.length, 0, `Console errors encountered: ${consoleErrors.join(", ")}`);
    console.log("✅ IMAGE DESCRIPTION HSK1: PASS");
  } finally {
    await page.close();
  }
}

// 3. QUESTION RESPONSE — REAL INTERACTION (HSK1)
{
  console.log("\n--- [3. QUESTION RESPONSE HSK1] ---");
  const { page, consoleErrors, hookWarnings } = await setupPage();
  try {
    await page.goto(`${base}/home/hsk1/practice/question-response/?theme=dark`, { waitUntil: "networkidle0" });
    await wait(600);

    const q1 = await page.evaluate(() => {
      const hanzi = document.querySelector(".g3-free-speaking-prompt h2")?.textContent;
      const pinyin = document.querySelector(".g3-practice-pinyin")?.textContent;
      const thai = document.querySelector(".g3-free-speaking-prompt p:not(.g3-practice-pinyin)")?.textContent;
      return { hanzi, pinyin, thai };
    });
    console.log("Q1 Details:", q1);
    assert.ok(q1.hanzi, "Q1 Hanzi required");
    assert.ok(q1.pinyin, "Q1 Pinyin required");
    assert.ok(q1.thai, "Q1 Thai translation required");

    await clickByText(page, "เริ่มพูด");
    await page.waitForSelector(".g3-practice-recording-state", { timeout: 5000 });
    await wait(300);
    await page.click(".g3-practice-primary.is-stop");
    await page.waitForSelector(".g3-free-speaking-review", { timeout: 5000 });
    await wait(200);
    await clickByText(page, "ส่งคำตอบ");
    await page.waitForSelector(".g3-free-speaking-result", { timeout: 5000 });
    await wait(200);
    await clickByText(page, "ข้อต่อไป");
    await wait(600);

    const q2 = await page.evaluate(() => {
      const hanzi = document.querySelector(".g3-free-speaking-prompt h2")?.textContent;
      const pinyin = document.querySelector(".g3-practice-pinyin")?.textContent;
      const thai = document.querySelector(".g3-free-speaking-prompt p:not(.g3-practice-pinyin)")?.textContent;
      return { hanzi, pinyin, thai };
    });
    console.log("Q2 Details:", q2);
    assert.ok(q2.hanzi, "Q2 Hanzi required");
    assert.ok(q2.pinyin, "Q2 Pinyin required");
    assert.ok(q2.thai, "Q2 Thai translation required");

    await clickByText(page, "เริ่มพูด");
    await page.waitForSelector(".g3-practice-recording-state", { timeout: 5000 });
    await wait(300);
    await page.click(".g3-practice-primary.is-stop");
    await page.waitForSelector(".g3-free-speaking-review", { timeout: 5000 });
    await wait(200);
    await clickByText(page, "ส่งคำตอบ");
    await page.waitForSelector(".g3-free-speaking-result", { timeout: 5000 });
    await wait(200);
    await clickByText(page, "ข้อต่อไป");
    await page.waitForSelector(".g3-practice-summary", { timeout: 5000 });

    assert.equal(hookWarnings.length, 0, `Hook warnings encountered: ${hookWarnings.join(", ")}`);
    assert.equal(consoleErrors.length, 0, `Console errors encountered: ${consoleErrors.join(", ")}`);
    console.log("✅ QUESTION RESPONSE HSK1: PASS");
  } finally {
    await page.close();
  }
}

// 4. REPEAT SENTENCE REGRESSION
{
  console.log("\n--- [4. REPEAT SENTENCE REGRESSION] ---");
  const { page, consoleErrors, hookWarnings } = await setupPage();
  try {
    await page.goto(`${base}/home/hsk1/practice/repeat-sentence/?theme=dark`, { waitUntil: "networkidle0" });
    await wait(600);

    await clickByText(page, "เริ่มแบบฝึก");
    await page.waitForFunction(() => document.querySelector(".g3-repeat-panel")?.dataset.phase === "ready");
    await clickByText(page, "เริ่มพูด");
    await page.waitForFunction(() => document.querySelector(".g3-repeat-panel")?.dataset.phase === "listening");
    await clickByText(page, "พูดเสร็จแล้ว");
    await page.waitForFunction(() => document.querySelector(".g3-repeat-panel")?.dataset.phase === "feedback");

    // Retry
    await clickByText(page, "ลองอีกครั้ง");
    await page.waitForFunction(() => document.querySelector(".g3-repeat-panel")?.dataset.phase === "ready");
    
    // Complete attempt & Next
    await clickByText(page, "เริ่มพูด");
    await page.waitForFunction(() => document.querySelector(".g3-repeat-panel")?.dataset.phase === "listening");
    await clickByText(page, "พูดเสร็จแล้ว");
    await page.waitForFunction(() => document.querySelector(".g3-repeat-panel")?.dataset.phase === "feedback");
    await clickByText(page, "ข้อต่อไป");
    await page.waitForFunction(() => document.querySelector(".g3-repeat-panel")?.dataset.phase === "ready");

    assert.equal(hookWarnings.length, 0, `Hook warnings: ${hookWarnings.join(", ")}`);
    assert.equal(consoleErrors.length, 0, `Console errors: ${consoleErrors.join(", ")}`);
    console.log("✅ REPEAT SENTENCE REGRESSION: PASS");
  } finally {
    await page.close();
  }
}

// 5. HSK MATRIX (HSK2, HSK3)
for (const lvl of ["hsk2", "hsk3"]) {
  for (const ex of ["image-description", "question-response"]) {
    console.log(`\n--- [5. HSK MATRIX: ${lvl.toUpperCase()} ${ex}] ---`);
    const { page, consoleErrors, hookWarnings } = await setupPage();
    try {
      await page.goto(`${base}/home/${lvl}/practice/${ex}/?theme=dark`, { waitUntil: "networkidle0" });
      await wait(600);

      await clickByText(page, "เริ่มพูด");
      await page.waitForSelector(".g3-practice-recording-state", { timeout: 5000 });
      await wait(300);
      await page.click(".g3-practice-primary.is-stop");
      await page.waitForSelector(".g3-free-speaking-review", { timeout: 5000 });
      await wait(200);
      await clickByText(page, "ส่งคำตอบ");
      await page.waitForSelector(".g3-free-speaking-result", { timeout: 5000 });
      await wait(200);
      await clickByText(page, "ข้อต่อไป");
      await wait(400);

      assert.equal(hookWarnings.length, 0, `Hook warnings: ${hookWarnings.join(", ")}`);
      assert.equal(consoleErrors.length, 0, `Console errors: ${consoleErrors.join(", ")}`);
      console.log(`✅ ${lvl.toUpperCase()} ${ex}: PASS`);
    } finally {
      await page.close();
    }
  }
}

// 8. REFRESH & NAVIGATION
{
  console.log("\n--- [8. REFRESH & NAVIGATION] ---");
  const { page, consoleErrors, hookWarnings } = await setupPage();
  try {
    // Direct refresh on image-description
    await page.goto(`${base}/home/hsk1/practice/image-description/?theme=dark`, { waitUntil: "networkidle0" });
    await wait(400);
    await page.reload({ waitUntil: "networkidle0" });
    await wait(400);
    assert.ok(await page.$(".g3-free-speaking-panel"), "Panel visible after reload");

    // Back to Practice Hub
    await page.click(".g3-back-link");
    await wait(500);
    assert.ok(await page.$(".g3-practice-hub"), "Practice Hub visible");

    // Reopen exercise
    await page.click(".g3-practice-card.type-image-description .g3-practice-card-cta");
    await wait(500);
    assert.ok(await page.$(".g3-free-speaking-panel"), "Panel visible after re-entry");

    assert.equal(hookWarnings.length, 0, `Hook warnings: ${hookWarnings.join(", ")}`);
    assert.equal(consoleErrors.length, 0, `Console errors: ${consoleErrors.join(", ")}`);
    console.log("✅ REFRESH & NAVIGATION: PASS");
  } finally {
    await page.close();
  }
}

// 9. LIGHT / DARK THEME SWITCH
{
  console.log("\n--- [9. LIGHT / DARK SWITCH] ---");
  const { page, consoleErrors, hookWarnings } = await setupPage();
  try {
    await page.goto(`${base}/home/hsk1/practice/image-description/?theme=dark`, { waitUntil: "networkidle0" });
    await wait(400);
    
    // Toggle theme button
    const themeBtn = await page.$(".g3-header-actions button");
    if (themeBtn) {
      await themeBtn.click();
      await wait(300);
      const themeVal = await page.evaluate(() => document.documentElement.dataset.theme);
      console.log("Theme switched to:", themeVal);
      await themeBtn.click();
      await wait(300);
    }

    assert.equal(hookWarnings.length, 0, `Hook warnings: ${hookWarnings.join(", ")}`);
    assert.equal(consoleErrors.length, 0, `Console errors: ${consoleErrors.join(", ")}`);
    console.log("✅ LIGHT / DARK SWITCH: PASS");
  } finally {
    await page.close();
  }
}

// 10. MOBILE 390x844
{
  console.log("\n--- [10. MOBILE 390x844] ---");
  const { page, consoleErrors, hookWarnings } = await setupPage({ width: 390, height: 844 });
  try {
    for (const ex of ["image-description", "question-response"]) {
      await page.goto(`${base}/home/hsk1/practice/${ex}/?theme=dark`, { waitUntil: "networkidle0" });
      await wait(400);

      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
      assert.equal(overflow, false, `${ex} has horizontal overflow on mobile`);

      await clickByText(page, "เริ่มพูด");
      await page.waitForSelector(".g3-practice-recording-state", { timeout: 5000 });
      await wait(300);
      await page.click(".g3-practice-primary.is-stop");
      await page.waitForSelector(".g3-free-speaking-review", { timeout: 5000 });
      await wait(200);
      await clickByText(page, "ส่งคำตอบ");
      await page.waitForSelector(".g3-free-speaking-result", { timeout: 5000 });
      await wait(200);
      console.log(`Mobile ${ex} controls reachable and functioning`);
    }

    assert.equal(hookWarnings.length, 0, `Hook warnings: ${hookWarnings.join(", ")}`);
    assert.equal(consoleErrors.length, 0, `Console errors: ${consoleErrors.join(", ")}`);
    console.log("✅ MOBILE 390x844: PASS");
  } finally {
    await page.close();
  }
}

await browser.close();
console.log("\n============================================================");
console.log("ALL FUNCTIONAL GATE CHECKS PASSED WITH 0 CONSOLE/HOOK ERRORS!");
console.log("============================================================");
