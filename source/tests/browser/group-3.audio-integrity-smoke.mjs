import assert from "node:assert/strict";
import puppeteer from "puppeteer";

const base = process.argv[2] || process.env.G3_BASE_URL || "http://127.0.0.1:4178/group3";
const origin = new URL(base).origin;
const levels = ["hsk1", "hsk2", "hsk3"];

function expectedAudio(level, lesson, scene, line) {
  return `/group3/assets/group3/lessons/${level}/lesson-${String(lesson).padStart(2, "0")}/audio/scene-${String(scene).padStart(2, "0")}/line-${String(line).padStart(2, "0")}.mp3`;
}

async function installAudioHarness(page) {
  await page.evaluateOnNewDocument(() => {
    sessionStorage.setItem("huayun_learner_name", "Audio Integrity Smoke");
    Object.defineProperty(window, "SpeechRecognition", { configurable: true, value: undefined });
    Object.defineProperty(window, "webkitSpeechRecognition", { configurable: true, value: undefined });
    window.__g3AudioStarts = [];
    window.__g3AudioStops = 0;
    window.__g3AudioFetches = [];
    const bufferUrls = new WeakMap();
    const nativeFetch = window.fetch.bind(window);
    window.fetch = async (input, init) => {
      const response = await nativeFetch(input, init);
      const url = typeof input === "string" ? input : input.url;
      if (!String(url).includes(".mp3")) return response;
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
      return response;
    };

    class SmokeBufferSource {
      constructor() {
        this.buffer = null;
        this.onended = null;
        this.playbackRate = { value: 1 };
        this.timer = null;
      }
      connect() {}
      disconnect() {}
      start() {
        window.__g3AudioStarts.push(this.buffer?.sourceUrl || "unknown-buffer");
        this.timer = setTimeout(() => this.onended?.(), 40);
      }
      stop() {
        window.__g3AudioStops += 1;
        clearTimeout(this.timer);
      }
    }

    class SmokeAudioContext {
      constructor() {
        this.currentTime = 0;
        this.destination = {};
        this.state = "running";
      }
      createBufferSource() { return new SmokeBufferSource(); }
      decodeAudioData(buffer) { return Promise.resolve({ sourceUrl: bufferUrls.get(buffer) }); }
      resume() { this.state = "running"; return Promise.resolve(); }
      createGain() {
        return {
          connect() {},
          disconnect() {},
          gain: { setValueAtTime() {}, exponentialRampToValueAtTime() {} },
        };
      }
      createOscillator() {
        return {
          addEventListener(_event, callback) { this.callback = callback; },
          connect() {},
          disconnect() {},
          frequency: { setValueAtTime() {} },
          start() {},
          stop() { this.callback?.(); },
          type: "sine",
        };
      }
    }
    Object.defineProperty(window, "AudioContext", { configurable: true, value: SmokeAudioContext });
    Object.defineProperty(window, "webkitAudioContext", { configurable: true, value: SmokeAudioContext });
  });
}

async function waitForStarts(page, count) {
  await page.waitForFunction((minimum) => window.__g3AudioStarts.length >= minimum, { timeout: 10_000 }, count);
  return page.evaluate(() => [...window.__g3AudioStarts]);
}

async function openPage(browser, path) {
  const page = await browser.newPage();
  const errors = [];
  await installAudioHarness(page);
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.goto(`${base}${path}`, { waitUntil: "domcontentloaded" });
  return { errors, page };
}

async function revealNextReaderLine(page, count) {
  await page.click(".g3-playback-transport-side:first-child button:nth-child(2)");
  await new Promise((resolve) => setTimeout(resolve, 100));
  if (await page.$(".g3-qte")) {
    for (let attempt = 0; attempt < 8; attempt += 1) {
      const option = await page.$(".g3-qte.is-active .g3-qte-options button:not([disabled])");
      if (!option) break;
      await option.click();
      await new Promise((resolve) => setTimeout(resolve, 100));
      if (await page.$(".g3-qte.is-correct")) break;
    }
    await page.waitForSelector(".g3-qte", { hidden: true, timeout: 5_000 });
  }
  await page.waitForFunction((minimum) => document.querySelectorAll(".g3-dialogue-line").length >= minimum, { timeout: 5_000 }, count);
}

async function auditReader(browser, level, lesson, scene) {
  const { errors, page } = await openPage(
    browser,
    `/home/${level}/lessons/lesson-${String(lesson).padStart(2, "0")}/scenes/scene-${String(scene).padStart(2, "0")}/?theme=dark`,
  );
  try {
    await page.waitForSelector(".g3-briefing-manual", { timeout: 10_000 });
    await page.click(".g3-briefing-manual");
    await page.waitForSelector(".g3-dialogue-line");

    const evidence = [];
    const lineLimit = Math.min(3, await page.$eval(".g3-playback-progress", (node) => Number(node.getAttribute("aria-valuemax"))));
    for (let line = 1; line <= lineLimit; line += 1) {
      console.log(`reader ${level} lesson-${lesson} scene-${scene} line-${line}`);
      if (line > 1) {
        await revealNextReaderLine(page, line);
      }
      const selector = `.g3-dialogue-line:nth-child(${line}) .g3-line-copy > button`;
      const hanzi = await page.$eval(`.g3-dialogue-line:nth-child(${line}) .g3-line-copy > strong`, (node) => node.textContent.trim());
      const before = await page.evaluate(() => window.__g3AudioStarts.length);
      const beforeFetch = await page.evaluate(() => window.__g3AudioFetches.length);
      await page.$eval(selector, (button) => button.click());
      await page.waitForFunction(
        ({ fetches, starts }) => window.__g3AudioFetches.length > fetches || window.__g3AudioStarts.length > starts,
        { timeout: 10_000 },
        { fetches: beforeFetch, starts: before },
      );
      const playbackEvidence = await page.evaluate(() => ({
        fetches: [...window.__g3AudioFetches],
        starts: [...window.__g3AudioStarts],
      }));
      const resource = playbackEvidence.fetches.length > beforeFetch
        ? playbackEvidence.fetches.at(-1)
        : playbackEvidence.starts.at(-1);
      const url = new URL(resource, origin).pathname;
      assert.equal(url, expectedAudio(level, lesson, scene, line), `${level}/lesson-${lesson}/scene-${scene}/line-${line}`);
      evidence.push({ hanzi, line, url });
      if (line === 1) {
        const starts = playbackEvidence.starts.length > before
          ? playbackEvidence.starts
          : await waitForStarts(page, before + 1);
        await page.click(".g3-header-actions > button:first-child");
        await new Promise((resolve) => setTimeout(resolve, 80));
        assert.equal(
          await page.evaluate(() => window.__g3AudioStarts.length),
          starts.length,
          "theme switch restarted or substituted active audio",
        );
      }
    }

    const currentHanzi = evidence.at(-1).hanzi;
    const startsBeforeLanguage = await page.evaluate(() => window.__g3AudioStarts.length);
    for (const position of [2, 3, 1]) {
      await page.click(`.g3-language-control button:nth-child(${position})`);
    }
    assert.equal(
      await page.$eval(".g3-dialogue-line.is-current .g3-line-copy > strong", (node) => node.textContent.trim()),
      currentHanzi,
      "language switching changed canonical Hanzi",
    );
    assert.equal(
      await page.evaluate(() => window.__g3AudioStarts.length),
      startsBeforeLanguage,
      "language switching restarted or substituted audio",
    );
    if (level === "hsk1" && lesson === 1 && scene === 1) {
      await page.$eval(".g3-rail-scenes button:nth-child(2)", (button) => button.click());
      await page.waitForFunction(() => location.pathname.includes("/scenes/scene-02/"));
      await page.waitForSelector(".g3-briefing-manual");
      await page.$eval(".g3-rail-scenes button:nth-child(1)", (button) => button.click());
      await page.waitForFunction(() => location.pathname.includes("/scenes/scene-01/"));
      await page.waitForSelector(".g3-briefing-manual");
    }
    assert.deepEqual(errors, [], `${level}/lesson-${lesson}/scene-${scene} browser errors`);
    return evidence;
  } finally {
    await page.close();
  }
}

async function auditRepeat(browser, level) {
  const { errors, page } = await openPage(browser, `/home/${level}/practice/repeat-sentence/?theme=dark`);
  try {
    await page.waitForSelector(".g3-repeat-prompt h2", { timeout: 10_000 });
    const firstHanzi = await page.$eval(".g3-repeat-prompt h2", (node) => node.textContent.trim());
    await page.click(".g3-repeat-prepare-copy .g3-practice-primary");
    let starts = await waitForStarts(page, 1);
    assert.equal(new URL(starts[0], origin).pathname, expectedAudio(level, 1, 1, 1));

    await page.waitForSelector(".g3-repeat-interaction .g3-practice-actions .is-secondary:not([disabled])");
    await page.click(".g3-repeat-interaction .g3-practice-actions .is-secondary");
    starts = await waitForStarts(page, 2);
    assert.equal(new URL(starts[1], origin).pathname, expectedAudio(level, 1, 1, 1), "Repeat replay changed resource");

    for (const position of [2, 3, 1]) await page.click(`.g3-language-control button:nth-child(${position})`);
    assert.equal(await page.$eval(".g3-repeat-prompt h2", (node) => node.textContent.trim()), firstHanzi);

    await page.waitForSelector(".g3-repeat-interaction .g3-practice-primary");
    await page.click(".g3-repeat-interaction .g3-practice-primary");
    await page.waitForFunction(() => document.querySelectorAll(".g3-repeat-interaction .g3-practice-primary").length > 0);
    await page.click(".g3-repeat-interaction .g3-practice-primary");
    await page.waitForSelector(".g3-repeat-feedback");
    await page.click(".g3-repeat-feedback .g3-practice-primary");
    starts = await waitForStarts(page, 3);
    assert.equal(new URL(starts.at(-1), origin).pathname, expectedAudio(level, 1, 1, 2), "Repeat Next did not follow sourceRef");
    assert.deepEqual(errors, [], `${level}/Repeat browser errors`);
    return { firstHanzi, starts };
  } finally {
    await page.close();
  }
}

const browser = await puppeteer.launch({
  args: ["--no-sandbox", "--disable-setuid-sandbox", "--use-fake-ui-for-media-stream", "--use-fake-device-for-media-stream"],
  headless: true,
});

try {
  const reader = [];
  for (const level of levels) {
    for (const lesson of [1, 2]) {
      for (const scene of [1, 2]) reader.push(await auditReader(browser, level, lesson, scene));
    }
  }
  const repeat = [];
  for (const level of levels) repeat.push(await auditRepeat(browser, level));
  console.log(JSON.stringify({ readerRoutes: reader.length, readerLinesPlayed: reader.flat().length, repeatLevels: repeat.length }));
  console.log("GROUP3_AUDIO_INTEGRITY_BROWSER_SMOKE_PASS");
} finally {
  await browser.close();
}
