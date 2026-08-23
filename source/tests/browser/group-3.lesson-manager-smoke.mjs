import assert from "node:assert/strict";
import puppeteer from "puppeteer";

const origin = process.env.G3_LESSON_ORIGIN || "http://127.0.0.1:5174";
const levels = ["hsk1", "hsk2", "hsk3"];
const tolerance = 2;

const browser = await puppeteer.launch({
  headless: true,
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});

try {
  const page = await browser.newPage();
  const consoleErrors = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("pageerror", (error) => consoleErrors.push(error.message));

  await page.setViewport({ width: 1366, height: 768, deviceScaleFactor: 1 });

  for (const level of levels) {
    await page.goto(`${origin}/group3/home/${level}/?theme=light`, { waitUntil: "networkidle0" });
    await page.waitForSelector(".g3-catalog-feature-copy > button");
    await page.evaluate(() => document.fonts?.ready);

    const snapshot = await page.evaluate(() => {
      const bounds = (element) => {
        const rect = element.getBoundingClientRect();
        return {
          x: rect.x,
          y: rect.y,
          width: rect.width,
          height: rect.height,
          right: rect.right,
          bottom: rect.bottom,
        };
      };
      const introTitle = document.querySelector(".g3-catalog-intro h1");
      const detail = document.querySelector(".g3-catalog-feature-copy");
      const detailTitle = detail.querySelector("h2");
      const cta = detail.querySelector(":scope > button");
      const lessonTitles = [...document.querySelectorAll(".g3-lesson-index strong")];
      const lessonPinyin = document.querySelector(".g3-lesson-index .is-active > em");
      const placePinyin = document.querySelector(".g3-place-pinyin");
      const sceneTabs = [...document.querySelectorAll(".g3-catalog-tabs button")];
      return {
        introTitle: bounds(introTitle),
        introFontSize: parseFloat(getComputedStyle(introTitle).fontSize),
        detail: bounds(detail),
        detailTitle: bounds(detailTitle),
        detailFontSize: parseFloat(getComputedStyle(detailTitle).fontSize),
        cta: bounds(cta),
        lessonTitles: lessonTitles.map((title) => ({
          clientWidth: title.clientWidth,
          scrollWidth: title.scrollWidth,
          bounds: bounds(title),
        })),
        lessonPinyin: bounds(lessonPinyin),
        placePinyin: bounds(placePinyin),
        sceneTabs: sceneTabs.map((tab) => ({
          tab: bounds(tab),
          number: bounds(tab.querySelector("span")),
          glyph: bounds(tab.querySelector("i")),
          title: bounds(tab.querySelector("strong")),
        })),
        viewport: { width: innerWidth, height: innerHeight },
        document: {
          width: document.documentElement.scrollWidth,
          height: document.documentElement.scrollHeight,
        },
      };
    });

    assert.ok(snapshot.introTitle.height <= 205, `${level}: intro title consumes ${snapshot.introTitle.height}px`);
    assert.ok(snapshot.introFontSize <= 50, `${level}: intro title font is ${snapshot.introFontSize}px`);
    assert.ok(snapshot.detailTitle.height <= 165, `${level}: detail title consumes ${snapshot.detailTitle.height}px`);
    assert.ok(snapshot.detailFontSize <= 42, `${level}: detail title font is ${snapshot.detailFontSize}px`);
    assert.ok(snapshot.cta.bottom <= snapshot.detail.bottom + tolerance, `${level}: CTA crosses detail panel`);
    assert.ok(snapshot.cta.height >= 44, `${level}: CTA height is ${snapshot.cta.height}px`);
    assert.ok(snapshot.lessonPinyin.width > 0 && snapshot.lessonPinyin.height > 0, `${level}: lesson title Pinyin is hidden`);
    assert.ok(snapshot.placePinyin.width > 0 && snapshot.placePinyin.height > 0, `${level}: place Pinyin is hidden`);
    assert.ok(snapshot.document.width <= snapshot.viewport.width + tolerance, `${level}: horizontal page overflow`);
    assert.ok(snapshot.document.height <= snapshot.viewport.height + tolerance, `${level}: desktop page overflow`);
    for (const [index, title] of snapshot.lessonTitles.entries()) {
      assert.ok(title.scrollWidth <= title.clientWidth + tolerance, `${level}: lesson ${index + 1} title is clipped`);
    }
    for (const [index, scene] of snapshot.sceneTabs.entries()) {
      assert.ok(scene.number.y >= scene.tab.y - tolerance && scene.number.bottom <= scene.tab.bottom + tolerance, `${level}: scene ${index + 1} number is misaligned`);
      assert.ok(scene.glyph.y >= scene.tab.y - tolerance && scene.glyph.bottom <= scene.tab.bottom + tolerance, `${level}: scene ${index + 1} Hanzi is misaligned`);
      assert.ok(scene.title.y >= scene.tab.y - tolerance && scene.title.bottom <= scene.tab.bottom + tolerance, `${level}: scene ${index + 1} title is clipped`);
    }
  }

  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1, isMobile: true });
  await page.goto(`${origin}/group3/home/hsk1/?theme=light`, { waitUntil: "networkidle0" });
  await page.waitForSelector(".g3-catalog-feature-copy > button");
  const mobile = await page.evaluate(() => {
    const cta = document.querySelector(".g3-catalog-feature-copy > button").getBoundingClientRect();
    const introAction = document.querySelector(".g3-catalog-intro-actions .g3-primary-action");
    const introActionStyle = getComputedStyle(introAction);
    const introActionBounds = introAction.getBoundingClientRect();
    const lessonNavigation = document.querySelector(".g3-lesson-navigation").getBoundingClientRect();
    const sceneTitles = [...document.querySelectorAll(".g3-catalog-tabs strong")];
    return {
      pageWidth: document.documentElement.scrollWidth,
      viewportWidth: innerWidth,
      ctaHeight: cta.height,
      ctaRight: cta.right,
      introActionVisible: introActionStyle.display !== "none" && introActionBounds.width > 0 && introActionBounds.height > 0,
      introActionBottom: introActionBounds.bottom,
      lessonNavigationTop: lessonNavigation.top,
      sceneTitlesVisible: sceneTitles.every((title) => {
        const style = getComputedStyle(title);
        const rect = title.getBoundingClientRect();
        return style.display !== "none" && rect.width > 0 && rect.height > 0;
      }),
    };
  });
  assert.ok(mobile.pageWidth <= mobile.viewportWidth + tolerance, "mobile: horizontal page overflow");
  assert.ok(mobile.ctaHeight >= 44, `mobile: CTA height is ${mobile.ctaHeight}px`);
  assert.ok(mobile.ctaRight <= mobile.viewportWidth + tolerance, "mobile: CTA crosses viewport");
  assert.ok(!mobile.introActionVisible || mobile.introActionBottom <= mobile.lessonNavigationTop + tolerance, "mobile: intro CTA overlaps lesson navigation");
  assert.equal(mobile.sceneTitlesVisible, true, "mobile: scene labels are hidden");

  const mobileLessonRoutes = [
    {
      path: "/group3/home/hsk1/lessons/lesson-01/overview/?theme=light",
      root: ".g3-front-matter",
      action: ".g3-front-matter .g3-primary-action",
    },
    {
      path: "/group3/home/hsk1/lessons/lesson-01/scenes/scene-01/?theme=light",
      root: ".g3-reader",
      action: ".g3-briefing-actions .g3-primary-action",
    },
  ];

  for (const route of mobileLessonRoutes) {
    await page.goto(`${origin}${route.path}`, { waitUntil: "networkidle0" });
    await page.waitForSelector(route.action);
    const beforeScroll = await page.evaluate(({ root, action }) => {
      const content = document.querySelector(root).getBoundingClientRect();
      const cta = document.querySelector(action).getBoundingClientRect();
      return {
        contentBottom: content.bottom,
        ctaBottom: cta.bottom,
        documentHeight: document.documentElement.scrollHeight,
        viewportHeight: innerHeight,
      };
    }, route);
    assert.ok(beforeScroll.contentBottom > beforeScroll.viewportHeight, `${route.root}: fixture does not exercise overflow`);
    assert.ok(beforeScroll.documentHeight > beforeScroll.viewportHeight, `${route.root}: mobile lesson content cannot scroll`);

    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await new Promise((resolve) => setTimeout(resolve, 100));
    const afterScroll = await page.evaluate((action) => ({
      scrollY,
      actionBottom: document.querySelector(action).getBoundingClientRect().bottom,
      viewportHeight: innerHeight,
    }), route.action);
    assert.ok(afterScroll.scrollY > 0, `${route.root}: browser did not scroll`);
    assert.ok(afterScroll.actionBottom <= afterScroll.viewportHeight + tolerance, `${route.root}: primary action remains unreachable`);
  }

  assert.deepEqual(consoleErrors, [], `browser console errors:\n${consoleErrors.join("\n")}`);
  console.log("Group 3 lesson manager smoke passed: HSK1/2/3 desktop + mobile geometry");
} finally {
  await browser.close();
}
