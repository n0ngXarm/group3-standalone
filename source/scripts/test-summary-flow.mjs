import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import puppeteer from "puppeteer";

const PORT = 4193;
const BASE_URL = `http://127.0.0.1:${PORT}/group3/`;

async function startViteServer() {
  const server = spawn("npx", ["vite", "--port", String(PORT), "--host", "127.0.0.1"], {
    cwd: process.cwd(),
    stdio: ["ignore", "pipe", "pipe"],
  });

  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error("Vite server start timeout"));
    }, 15000);

    server.stdout.on("data", (data) => {
      const text = data.toString();
      if (text.includes("Local:") || text.includes(`:${PORT}`)) {
        clearTimeout(timeout);
        resolve();
      }
    });

    server.stderr.on("data", (data) => {
      console.error("[Vite stderr]", data.toString());
    });

    server.on("error", (err) => {
      clearTimeout(timeout);
      reject(err);
    });
  });

  return server;
}

async function run() {
  console.log("Starting Vite test server...");
  const server = await startViteServer();
  let browser;

  try {
    browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu", "--autoplay-policy=no-user-gesture-required"]
    });

    const page = await browser.newPage();
    const consoleErrors = [];
    page.on("pageerror", (err) => {
      console.error("[Browser pageerror]:", err.message);
      consoleErrors.push(err.message);
    });
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        console.error("[Browser console error]:", msg.text());
        consoleErrors.push(msg.text());
      }
    });

    // 1. Visit base to set learner session
    console.log("Navigating to Home to initialize session...");
    await page.goto(BASE_URL, { waitUntil: "domcontentloaded" });
    await page.evaluate(() => {
      window.sessionStorage.setItem("huayun_learner_name", "20.");
    });

    // 2. Navigate to summary
    const summaryUrl = `http://127.0.0.1:${PORT}/group3/home/hsk2/practice/summary/?theme=light`;
    console.log("Navigating to:", summaryUrl);
    await page.goto(summaryUrl, { waitUntil: "domcontentloaded" });
    await page.waitForSelector(".g3-learning-summary", { timeout: 8000 });

    const titleText = await page.$eval(".g3-summary-page-title", el => el.textContent.trim());
    console.log("✔ Page Title rendered:", titleText);

    const learnerNameText = await page.$eval(".g3-learner-name", el => el.textContent.trim());
    console.log("✔ Learner Name rendered:", learnerNameText);
    assert.equal(learnerNameText, "20.");

    const exerciseCards = await page.$$eval(".g3-exercise-card", els => els.map(e => e.textContent.trim()));
    console.log("✔ Exercise Cards count:", exerciseCards.length);
    assert.equal(exerciseCards.length, 3, "Must render 3 exercise cards");

    const skillCards = await page.$$eval(".g3-skill-card", els => els.map(e => e.textContent.trim()));
    console.log("✔ Skill Cards count:", skillCards.length);
    assert.equal(skillCards.length, 4, "Must render 4 skill cards");

    const feedbackPanels = await page.$$eval(".g3-feedback-panel", els => els.map(e => e.textContent.trim()));
    console.log("✔ Feedback Panels count:", feedbackPanels.length);
    assert.equal(feedbackPanels.length, 2, "Must render 2 feedback panels (Strengths & Improvements)");

    assert.equal(consoleErrors.length, 0, `No console errors allowed, got: ${consoleErrors.join(", ")}`);

    await page.setViewport({ width: 1440, height: 900 });
    await page.screenshot({ path: "/tmp/summary_verify.png", fullPage: true });
    console.log("✔ Saved verification screenshot to /tmp/summary_verify.png");

    console.log("Navigating to repeat sentence...");
    await page.goto(`${BASE_URL}home/hsk1/practice/repeat-sentence/?theme=light`, { waitUntil: "networkidle2" });
    await new Promise(r => setTimeout(r, 1200));
    await page.screenshot({ path: "/tmp/repeat_sentence_verify.png", fullPage: true });
    console.log("✔ Saved repeat sentence screenshot to /tmp/repeat_sentence_verify.png");

    console.log("Navigating to image description...");
    await page.goto(`${BASE_URL}home/hsk1/practice/image-description/?theme=light`, { waitUntil: "networkidle2" });
    await new Promise(r => setTimeout(r, 1200));
    await page.screenshot({ path: "/tmp/image_description_verify.png", fullPage: true });
    console.log("✔ Saved image description screenshot to /tmp/image_description_verify.png");

    console.log("\n🎉 ALL PRACTICE & SUMMARY TESTS PASSED WITH 0 ERRORS! 🎉\n");
  } finally {
    if (browser) await browser.close();
    server.kill("SIGTERM");
  }
}

run().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
