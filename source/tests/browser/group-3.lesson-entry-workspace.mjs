import assert from "node:assert/strict";
import puppeteer from "puppeteer";

const baseUrl = process.env.G3_BASE_URL || "http://127.0.0.1:4178/group3";
const browser = await puppeteer.launch({
  headless: true,
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});

const page = await browser.newPage();
page.setDefaultTimeout(5_000);
await page.evaluateOnNewDocument(() => {
  sessionStorage.setItem("huayun_learner_name", "Lesson Entry QA");
});
const browserErrors = [];
page.on("console", (message) => {
  if (message.type() === "error") browserErrors.push(message.text());
});
page.on("pageerror", (error) => browserErrors.push(error.message));

try {
  await page.setViewport({ width: 1366, height: 768, deviceScaleFactor: 1 });
  await page.goto(`${baseUrl}/home/hsk1/?theme=light`, { waitUntil: "domcontentloaded" });
  await page.waitForSelector(".g3-lesson-selector");

  assert.ok(await page.$(".g3-lesson-workspace"), "lesson entry does not render one unified workspace");
  assert.equal(await page.$$eval(".g3-lesson-toc", (nodes) => nodes.length), 1, "TOC region is not singular");
  assert.equal(await page.$$eval(".g3-lesson-preview", (nodes) => nodes.length), 1, "image preview region is not singular");
  assert.equal(await page.$$eval(".g3-lesson-detail", (nodes) => nodes.length), 1, "detail region is not singular");
  assert.equal(await page.$$eval(".g3-lesson-toc-group", (nodes) => nodes.length), 3, "HSK1 does not expose three canonical lessons");
  assert.equal(await page.$$eval(".g3-lesson-scene-option", (nodes) => nodes.length), 6, "HSK1 does not expose two scenes per lesson");

  const initialIdentity = await page.$eval(".g3-lesson-workspace", (node) => ({
    lessonId: node.dataset.lessonId,
    sceneId: node.dataset.sceneId,
  }));
  assert.deepEqual(initialIdentity, { lessonId: "hsk1-l1", sceneId: "hsk1-l1-s1" });

  const geometry = await page.evaluate(() => {
    const rect = (selector) => {
      const bounds = document.querySelector(selector).getBoundingClientRect();
      return {
        x: bounds.x,
        y: bounds.y,
        width: bounds.width,
        height: bounds.height,
        right: bounds.right,
        bottom: bounds.bottom,
      };
    };
    return {
      workspace: rect(".g3-lesson-workspace"),
      toc: rect(".g3-lesson-toc"),
      image: rect(".g3-lesson-preview"),
      detail: rect(".g3-lesson-detail"),
      viewportWidth: innerWidth,
      horizontalOverflow: document.documentElement.scrollWidth - innerWidth,
    };
  });
  assert.ok(geometry.workspace.width >= geometry.viewportWidth * 0.93, "workspace leaves oversized desktop gutters");
  assert.ok(geometry.image.width > geometry.toc.width * 2, "scene image is not the dominant region");
  assert.ok(geometry.detail.width > geometry.toc.width * 1.35, "detail region is too narrow");
  assert.ok(Math.abs(geometry.toc.y - geometry.image.y) <= 2, "TOC and image do not share a top edge");
  assert.ok(Math.abs(geometry.image.y - geometry.detail.y) <= 2, "image and detail do not share a top edge");
  assert.ok(Math.abs(geometry.toc.bottom - geometry.image.bottom) <= 2, "TOC and image do not share a bottom edge");
  assert.ok(Math.abs(geometry.image.bottom - geometry.detail.bottom) <= 2, "image and detail do not share a bottom edge");
  assert.ok(geometry.horizontalOverflow <= 2, "lesson entry creates horizontal page overflow");

  await page.click('[data-lesson-id="hsk1-l2"][data-scene-index="1"]');
  await page.waitForFunction(() => {
    const workspace = document.querySelector(".g3-lesson-workspace");
    return workspace?.dataset.lessonId === "hsk1-l2" && workspace?.dataset.sceneId === "hsk1-l2-s2";
  });

  const selectedIdentity = await page.$eval(".g3-lesson-workspace", (node) => ({
    lessonId: node.dataset.lessonId,
    sceneId: node.dataset.sceneId,
    image: node.querySelector(".g3-lesson-preview img")?.currentSrc,
  }));
  assert.equal(selectedIdentity.lessonId, "hsk1-l2");
  assert.equal(selectedIdentity.sceneId, "hsk1-l2-s2");
  assert.ok(selectedIdentity.image.includes("lesson-02/scenes/scene-02"), "selected scene image is stale");

  await page.click(".g3-lesson-details-trigger");
  assert.equal(await page.$eval(".g3-detail-modal", (dialog) => dialog.open), true, "Details does not open the shared modal");
  await page.click(".g3-detail-modal-close");
  assert.equal(await page.$eval(".g3-detail-modal", (dialog) => dialog.open), false, "Details modal does not close");

  const identityBeforeLanguageSwitch = await page.$eval(".g3-lesson-workspace", (node) => `${node.dataset.lessonId}:${node.dataset.sceneId}`);
  await page.click(".g3-topbar-lang-switcher button:last-child");
  const identityAfterLanguageSwitch = await page.$eval(".g3-lesson-workspace", (node) => `${node.dataset.lessonId}:${node.dataset.sceneId}`);
  assert.equal(identityAfterLanguageSwitch, identityBeforeLanguageSwitch, "language switch changes canonical content identity");

  await page.click(".g3-lesson-start");
  await page.waitForFunction(() => location.pathname.endsWith("/home/hsk1/lessons/lesson-02/scenes/scene-02/"));
  assert.equal(new URL(page.url()).pathname, "/group3/home/hsk1/lessons/lesson-02/scenes/scene-02/");
  assert.deepEqual(browserErrors, [], "browser emitted console or runtime errors");

  console.log("GROUP3_LESSON_ENTRY_WORKSPACE_PASS");
} finally {
  await browser.close();
}
