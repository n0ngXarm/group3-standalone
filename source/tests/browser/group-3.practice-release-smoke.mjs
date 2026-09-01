import assert from "node:assert/strict";
import puppeteer from "puppeteer";

const base = process.argv[2] || process.env.G3_BASE_URL || "http://127.0.0.1:4178/group3";
const browser = await puppeteer.launch({
  args: ["--no-sandbox", "--use-fake-ui-for-media-stream", "--use-fake-device-for-media-stream"],
  headless: true,
});

const failures = [];
const routes = ["repeat-sentence", "image-description", "question-response"];

async function pageAt(path, viewport = { width: 1366, height: 768 }, { disableAsr = false } = {}) {
  const page = await browser.newPage();
  await page.setViewport(viewport);
  await page.evaluateOnNewDocument(() => {
    sessionStorage.setItem("huayun_learner_name", "Practice Smoke Tester");
  });
  if (disableAsr) {
    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(window, "SpeechRecognition", { configurable: true, value: undefined });
      Object.defineProperty(window, "webkitSpeechRecognition", { configurable: true, value: undefined });
    });
  }
  const runtime = [];
  page.on("pageerror", (error) => runtime.push(error.message));
  await page.goto(`${base}${path}?theme=dark`, { waitUntil: "networkidle0" });
  await page.waitForSelector(".g3-practice-exercise", { timeout: 10_000 });
  return { page, runtime };
}

try {
  for (const level of ["hsk1", "hsk2", "hsk3"]) {
    for (const type of routes) {
      const { page, runtime } = await pageAt(`/home/${level}/practice/${type}/`);
      try {
        await page.waitForFunction(() => !document.querySelector(".g3-practice-message"), { timeout: 10_000 });
        const state = await page.evaluate(() => ({
          bodyHeight: document.body.scrollHeight,
          bodyWidth: document.body.scrollWidth,
          hasPlaceholder: document.body.textContent.includes("กำลังเตรียมแบบฝึกหัดนี้"),
          innerHeight,
          innerWidth,
          nestedScrollers: [...document.querySelectorAll(".g3-practice-exercise *")]
            .filter((element) => /(auto|scroll)/.test(getComputedStyle(element).overflowY)
              && element.scrollHeight > element.clientHeight + 2)
            .map((element) => element.className),
          root: document.querySelector(".g3-practice-exercise")?.getBoundingClientRect().toJSON(),
          title: document.querySelector(".g3-practice-exercise h1")?.textContent,
        }));
        assert.equal(state.hasPlaceholder, false, `${level}/${type} placeholder`);
        assert.ok(state.title, `${level}/${type} title`);
        assert.ok(state.bodyWidth <= state.innerWidth, `${level}/${type} horizontal scroll`);
        assert.ok(state.root.right <= state.innerWidth + 1, `${level}/${type} root horizontal bounds`);
        assert.deepEqual(state.nestedScrollers, [], `${level}/${type} nested vertical scroll`);
        assert.deepEqual(runtime, [], `${level}/${type} runtime errors`);
      } finally {
        await page.close();
      }
    }
  }

  {
    const { page } = await pageAt("/home/hsk1/practice/repeat-sentence/", { width: 1366, height: 768 }, { disableAsr: true });
    await page.waitForFunction(() => !document.querySelector(".g3-practice-message"));
    await page.click(".g3-practice-primary");
    await page.waitForFunction(() => [...document.querySelectorAll("button")].some((button) => button.textContent.includes("เริ่มพูด")), { timeout: 15_000 });
    const start = await page.$$("button.g3-practice-primary");
    await start.at(-1).click();
    await page.waitForFunction(() => [...document.querySelectorAll("button")].some((button) => button.textContent.includes("พูดเสร็จแล้ว")), { timeout: 5_000 });
    await page.evaluate(() => [...document.querySelectorAll("button")].filter((button) => button.textContent.includes("พูดเสร็จแล้ว")).at(-1)?.click());
    await page.waitForFunction(() => document.body.textContent.includes("ฝึกแบบทบทวนตนเอง"), { timeout: 5_000 });
    await page.close();
  }

  for (const type of ["image-description", "question-response"]) {
    const { page } = await pageAt(`/home/hsk1/practice/${type}/`, { width: 1366, height: 768 }, { disableAsr: true });
    await page.waitForFunction(() => !document.querySelector(".g3-practice-message"));
    await page.click("button.g3-practice-primary");
    await page.waitForFunction(() => document.body.textContent.includes("กำลังบันทึกเสียง"), { timeout: 8_000 });
    await page.click("button.is-stop");
    await page.waitForSelector("audio", { timeout: 8_000 });
    await page.evaluate(() => [...document.querySelectorAll("button")].find((button) => button.textContent.includes("ส่งคำตอบ"))?.click());
    await page.waitForFunction(() => document.body.textContent.includes("ผลการฝึกเบื้องต้น"), { timeout: 5_000 });
    assert.match(await page.evaluate(() => document.body.textContent), /ทบทวนตนเอง/);
    await page.close();
  }

  {
    const { page } = await pageAt("/home/hsk1/practice/question-response/");
    for (const label of ["🇨🇳 中", "🇬🇧 EN", "🇹🇭 TH"]) {
      await page.evaluate((value) => [...document.querySelectorAll(".g3-language-control button")].find((button) => button.textContent.trim() === value)?.click(), label);
      await page.waitForFunction((value) => [...document.querySelectorAll(".g3-language-control button")].some((button) => button.textContent.trim() === value && button.getAttribute("aria-pressed") === "true"), {}, label);
    }
    await page.close();
  }

  for (const viewport of [{ width: 1600, height: 900 }, { width: 1366, height: 768 }, { width: 390, height: 844 }]) {
    for (const theme of ["dark", "light"]) {
      const page = await browser.newPage();
      await page.setViewport(viewport);
      await page.evaluateOnNewDocument(() => {
        sessionStorage.setItem("huayun_learner_name", "Practice Smoke Tester");
      });
      await page.goto(`${base}/home/hsk1/practice/image-description/?theme=${theme}`, { waitUntil: "networkidle0" });
      await page.waitForFunction(() => !document.querySelector(".g3-practice-message"));
      const metrics = await page.evaluate(() => ({
        back: document.querySelector(".g3-practice-exercise-header .g3-back-link")?.getBoundingClientRect().toJSON(),
        bodyHeight: document.body.scrollHeight,
        bodyWidth: document.body.scrollWidth,
        innerHeight,
        innerWidth,
      }));
      assert.ok(metrics.bodyWidth <= metrics.innerWidth, `${viewport.width}x${viewport.height}/${theme} horizontal scroll`);
      assert.ok(metrics.back.width >= 44 && metrics.back.height >= 44, `${viewport.width}x${viewport.height}/${theme} Back touch target`);
      assert.ok(metrics.back.left >= 0 && metrics.back.right <= metrics.innerWidth, `${viewport.width}x${viewport.height}/${theme} Back bounds`);
      await page.screenshot({ path: `/tmp/g3-practice-${viewport.width}x${viewport.height}-${theme}.png`, fullPage: false });
      await page.close();
    }
  }
} catch (error) {
  failures.push(error);
} finally {
  await browser.close();
}

if (failures.length) throw failures[0];
console.log("GROUP3_PRACTICE_RELEASE_BROWSER_SMOKE_PASS");
