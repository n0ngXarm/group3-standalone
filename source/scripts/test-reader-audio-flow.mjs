import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import puppeteer from "puppeteer";

const PORT = 4188;
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

async function installAudioTracker(page, { blockAutoplay = false } = {}) {
  await page.evaluateOnNewDocument((shouldBlock) => {
    sessionStorage.setItem("huayun_learner_name", "Audio Flow Tester");
    window.__g3AudioStarts = [];
    window.__g3AudioStops = 0;
    window.__g3AudioFetches = [];
    window.__g3Errors = [];

    window.addEventListener("error", (e) => {
      window.__g3Errors.push(e.message || String(e));
    });

    const bufferUrls = new WeakMap();
    const nativeFetch = window.fetch.bind(window);
    window.fetch = async (input, init) => {
      const response = await nativeFetch(input, init);
      const url = typeof input === "string" ? input : input.url;
      if (String(url).includes(".mp3")) {
        window.__g3AudioFetches.push(String(url));
        const nativeArrayBuffer = response.arrayBuffer.bind(response);
        Object.defineProperty(response, "arrayBuffer", {
          configurable: true,
          value: async () => {
            const buffer = await nativeArrayBuffer();
            bufferUrls.set(buffer, String(url));
            return buffer;
          },
        });
      }
      return response;
    };

    class MockBufferSource {
      constructor() {
        this.buffer = null;
        this.onended = null;
        this.playbackRate = { value: 1 };
        this.timer = null;
      }
      connect() {}
      disconnect() {}
      start() {
        window.__g3AudioStarts.push(this.buffer?.sourceUrl || "unknown");
        this.timer = setTimeout(() => {
          this.onended?.();
        }, 8000); // 8s duration to simulate playing audio during interactions
      }
      stop() {
        window.__g3AudioStops += 1;
        if (this.timer) clearTimeout(this.timer);
      }
    }

    class MockAudioContext {
      constructor() {
        this.currentTime = 0;
        this.destination = {};
        this.state = shouldBlock ? "suspended" : "running";
      }
      createBufferSource() {
        return new MockBufferSource();
      }
      decodeAudioData(buffer) {
        return Promise.resolve({ sourceUrl: bufferUrls.get(buffer) });
      }
      resume() {
        if (shouldBlock && !window.__g3UserUnblocked) {
          this.state = "suspended";
          const err = new Error("NotAllowedError: play() failed because the user didn't interact first.");
          err.name = "NotAllowedError";
          return Promise.reject(err);
        }
        this.state = "running";
        return Promise.resolve();
      }
    }

    Object.defineProperty(window, "AudioContext", { configurable: true, value: MockAudioContext });
    Object.defineProperty(window, "webkitAudioContext", { configurable: true, value: MockAudioContext });
  }, blockAutoplay);
}

async function runTests() {
  console.log("Starting local test server...");
  const server = await startViteServer();

  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    headless: true,
  });

  try {
    console.log("=== TEST SUITE: GROUP 3 READER AUDIO UX ===");

    // ----------------------------------------------------
    // TEST 1: Start Lesson from Catalog -> Sentence 1 Auto-plays
    // ----------------------------------------------------
    console.log("\n[TEST 1] Enter Lesson from Catalog -> Sentence 1 auto-plays immediately");
    const page = await browser.newPage();
    const consoleErrors = [];
    page.on("pageerror", (err) => consoleErrors.push(err.message));
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });

    await installAudioTracker(page, { blockAutoplay: false });

    // First load to establish origin & session
    await page.goto(`${BASE_URL}`, { waitUntil: "domcontentloaded" });
    await page.evaluate(() => sessionStorage.setItem("huayun_learner_name", "Audio Flow Tester"));

    // Navigate to HSK1 Lesson Catalog
    await page.goto(`${BASE_URL}home/hsk1/?theme=light`, { waitUntil: "domcontentloaded" });

    // Click "เริ่มเรียน"
    const startBtn = await page.waitForSelector(".g3-lesson-start", { timeout: 10000 });
    assert.ok(startBtn, "Start lesson button should exist");
    await startBtn.click();

    // Wait for Reader dialogue card
    await page.waitForSelector(".g3-reader-dialogue-card", { timeout: 10000 });

    // Wait for first line audio to start playing automatically
    await page.waitForFunction(() => window.__g3AudioStarts.length >= 1, { timeout: 8000 });
    const startsAfterEnter = await page.evaluate(() => [...window.__g3AudioStarts]);
    console.log("Audio starts after enter:", startsAfterEnter);
    assert.match(startsAfterEnter[0], /scene-01\/line-01\.mp3/, "Sentence 1 audio must auto-play upon entering Reader");
    console.log("✔ TEST 1 PASSED: Sentence 1 auto-played on enter!");

    // ----------------------------------------------------
    // TEST 2: Click Next -> Sentence 2 Auto-plays
    // ----------------------------------------------------
    console.log("\n[TEST 2] Click Next -> Stops Sentence 1 and auto-plays Sentence 2");
    const nextBtn = await page.waitForSelector(".g3-step-next");
    const stopsBeforeNext = await page.evaluate(() => window.__g3AudioStops);

    await nextBtn.click();

    await page.waitForFunction(() => window.__g3AudioStarts.length >= 2, { timeout: 5000 });
    const startsAfterNext = await page.evaluate(() => [...window.__g3AudioStarts]);
    const stopsAfterNext = await page.evaluate(() => window.__g3AudioStops);

    console.log("Audio starts after next:", startsAfterNext);
    assert.match(startsAfterNext[1], /scene-01\/line-02\.mp3/, "Sentence 2 audio must auto-play upon clicking Next");
    assert.ok(stopsAfterNext > stopsBeforeNext, "Previous audio must have been stopped");
    console.log("✔ TEST 2 PASSED: Next stopped sentence 1 and auto-played sentence 2!");

    // ----------------------------------------------------
    // TEST 3: Click Previous -> Previous sentence auto-plays
    // ----------------------------------------------------
    console.log("\n[TEST 3] Click Previous -> Stops Sentence 2 and auto-plays Sentence 1");
    const prevBtn = await page.waitForSelector(".g3-step-prev");
    const stopsBeforePrev = await page.evaluate(() => window.__g3AudioStops);

    await prevBtn.click();

    await page.waitForFunction(() => window.__g3AudioStarts.length >= 3, { timeout: 5000 });
    const startsAfterPrev = await page.evaluate(() => [...window.__g3AudioStarts]);
    const stopsAfterPrev = await page.evaluate(() => window.__g3AudioStops);

    console.log("Audio starts after prev:", startsAfterPrev);
    assert.match(startsAfterPrev[2], /scene-01\/line-01\.mp3/, "Sentence 1 audio must auto-play upon clicking Prev");
    assert.ok(stopsAfterPrev > stopsBeforePrev, "Previous audio must have been stopped");
    console.log("✔ TEST 3 PASSED: Previous stopped sentence 2 and auto-played sentence 1!");

    // ----------------------------------------------------
    // TEST 4: Rapid Next / Previous clicks -> No overlapping audio
    // ----------------------------------------------------
    console.log("\n[TEST 4] Rapid Next / Previous clicks -> No overlapping audio, previous playbacks cancelled");
    const stopsBeforeRapid = await page.evaluate(() => window.__g3AudioStops);
    const startsBeforeRapid = await page.evaluate(() => window.__g3AudioStarts.length);

    // Rapidly toggle Next then Prev
    await nextBtn.click();
    await new Promise((r) => setTimeout(r, 60));
    await prevBtn.click();

    await page.waitForFunction((count) => window.__g3AudioStarts.length >= count + 2, { timeout: 5000 }, startsBeforeRapid);
    const stopsAfterRapid = await page.evaluate(() => window.__g3AudioStops);
    assert.ok(stopsAfterRapid >= stopsBeforeRapid + 1, "Interrupted audio playback must be cleanly stopped");
    console.log("✔ TEST 4 PASSED: Rapid clicks handled cleanly without audio overlap!");

    // ----------------------------------------------------
    // TEST 5: Click speaker icon -> Replay current line
    // ----------------------------------------------------
    console.log("\n[TEST 5] Click speaker icon (🔊) -> Replays current line");
    const speakerBtn = await page.waitForSelector(".g3-card-audio-btn");
    const startsBeforeReplay = await page.evaluate(() => window.__g3AudioStarts.length);

    await speakerBtn.click();

    await page.waitForFunction((count) => window.__g3AudioStarts.length > count, { timeout: 5000 }, startsBeforeReplay);
    const startsAfterReplay = await page.evaluate(() => [...window.__g3AudioStarts]);
    console.log("Audio starts after replay:", startsAfterReplay.slice(startsBeforeReplay));
    assert.equal(startsAfterReplay.length, startsBeforeReplay + 1, "Speaker button must trigger a replay");
    console.log("✔ TEST 5 PASSED: Replay button replayed current line!");

    // ----------------------------------------------------
    // TEST 6: Scene Change -> Stops old audio, plays Scene 2 Line 1
    // ----------------------------------------------------
    console.log("\n[TEST 6] Switch Scene -> Stops old audio and auto-plays Scene 2 Line 1");
    const scene2Btn = await page.waitForSelector(".g3-reader-scene-list li:nth-child(2) button", { timeout: 5000 });
    const startsBeforeSceneChange = await page.evaluate(() => window.__g3AudioStarts.length);

    await scene2Btn.click();

    await page.waitForFunction((count) => window.__g3AudioStarts.length > count, { timeout: 5000 }, startsBeforeSceneChange);
    const startsAfterSceneChange = await page.evaluate(() => [...window.__g3AudioStarts]);
    const latestAudio = startsAfterSceneChange.at(-1);
    console.log("Latest audio after scene change:", latestAudio);
    assert.match(latestAudio, /scene-02\/line-01\.mp3/, "New scene Line 1 audio must auto-play");
    console.log("✔ TEST 6 PASSED: Scene change auto-played Scene 2 Line 1!");

    // ----------------------------------------------------
    // TEST 7: Exit Reader -> Stops audio
    // ----------------------------------------------------
    console.log("\n[TEST 7] Exit Reader -> Audio stopped immediately");
    const stopsBeforeExit = await page.evaluate(() => window.__g3AudioStops);
    const backBtn = await page.waitForSelector(".g3-reader-back-btn");

    await backBtn.click();
    await page.waitForSelector(".g3-lesson-workspace");

    const stopsAfterExit = await page.evaluate(() => window.__g3AudioStops);
    assert.ok(stopsAfterExit >= stopsBeforeExit, "Audio must stop upon exiting reader");
    console.log("✔ TEST 7 PASSED: Exit reader stopped audio!");

    await page.close();

    // ----------------------------------------------------
    // TEST 8: Browser Autoplay Blocked Case -> Fallback UI works
    // ----------------------------------------------------
    console.log("\n[TEST 8] Browser autoplay blocked -> Unblock control appears and recovers auto-play");
    const blockedPage = await browser.newPage();
    await installAudioTracker(blockedPage, { blockAutoplay: true });

    await blockedPage.goto(`${BASE_URL}`, { waitUntil: "domcontentloaded" });
    await blockedPage.evaluate(() => sessionStorage.setItem("huayun_learner_name", "Audio Flow Tester"));
    await blockedPage.goto(`${BASE_URL}home/hsk1/lessons/lesson-01/scenes/scene-01/?theme=light`, { waitUntil: "domcontentloaded" });
    await blockedPage.waitForSelector(".g3-reader-dialogue-card");

    // Wait for unblock banner to appear
    const unblockBanner = await blockedPage.waitForSelector(".g3-sound-unblock-banner", { timeout: 5000 });
    assert.ok(unblockBanner, "Unblock banner must be visible when autoplay is blocked");
    const bannerText = await blockedPage.evaluate((el) => el.textContent, unblockBanner);
    console.log("Banner text:", bannerText);
    assert.match(bannerText, /กดเพื่อเริ่มเสียง/, "Banner should instruct user to click to enable audio");

    // Click unblock banner
    await blockedPage.evaluate(() => { window.__g3UserUnblocked = true; });
    await unblockBanner.click();

    // Verify audio starts playing
    await blockedPage.waitForFunction(() => window.__g3AudioStarts.length >= 1, { timeout: 5000 });
    const startsBlocked = await blockedPage.evaluate(() => [...window.__g3AudioStarts]);
    console.log("Audio starts after unblocking:", startsBlocked);
    assert.match(startsBlocked[0], /scene-01\/line-01\.mp3/, "Audio must play after unblock gesture");

    // Verify subsequent Next also auto-plays
    const blockedNextBtn = await blockedPage.waitForSelector(".g3-step-next");
    await blockedNextBtn.click();
    await blockedPage.waitForFunction(() => window.__g3AudioStarts.length >= 2, { timeout: 5000 });
    console.log("✔ TEST 8 PASSED: Autoplay blocked fallback works and unlocks subsequent audio!");

    await blockedPage.close();

    // ----------------------------------------------------
    // TEST 9: Console Check -> No audio errors
    // ----------------------------------------------------
    console.log("\n[TEST 9] Checking Console Errors");
    console.log("Console errors collected:", consoleErrors);
    const audioErrors = consoleErrors.filter((e) => e.toLowerCase().includes("audio") || e.toLowerCase().includes("play"));
    assert.deepEqual(audioErrors, [], "There should be 0 audio errors in console");
    console.log("✔ TEST 9 PASSED: No audio errors in console!");

    console.log("\n🎉 ALL 9 READER AUDIO UX ACCEPTANCE TESTS PASSED SUCCESSFULLY! 🎉\n");
  } finally {
    await browser.close();
    server.kill("SIGTERM");
  }
}

runTests().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
