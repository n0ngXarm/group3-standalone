import assert from "node:assert/strict";
import puppeteer from "puppeteer";

const base = (process.argv[2] ?? "http://127.0.0.1:4178/group3").replace(/\/$/, "");
const fontStylesheetOverride = process.argv[3] ?? "";
const routeFilter = process.argv[4] ?? "";
const routes = [
  { name: "home", path: "/home/", root: ".g3-home", protected: false },
  { name: "levels", path: "/home/levels/", root: ".g3-level-selection", protected: true },
  { name: "catalog", path: "/home/hsk1/", root: ".g3-lesson-selector", protected: true },
  { name: "vocabulary", path: "/home/hsk1/lessons/lesson-01/vocabulary/", root: ".g3-vocabulary-page", protected: true },
  { name: "reader", path: "/home/hsk1/lessons/lesson-01/scenes/scene-01/", root: ".g3-reader-layout", protected: true },
  { name: "practice", path: "/home/hsk1/practice/", root: ".g3-practice-hub", protected: true },
  { name: "repeat", path: "/home/hsk1/practice/repeat-sentence/", root: ".g3-practice-exercise", protected: true },
];
const viewports = [
  { name: "desktop", width: 1366, height: 768 },
  { name: "mobile", width: 390, height: 844, isMobile: true },
];
const themes = ["light", "dark"];
const browser = await puppeteer.launch({
  headless: true,
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});
const results = [];
const failures = [];

try {
  for (const viewport of viewports) {
    for (const theme of themes) {
      for (const route of routes.filter((candidate) => !routeFilter || candidate.name === routeFilter)) {
        const page = await browser.newPage();
        const errors = [];
        await page.setViewport(viewport);
        if (fontStylesheetOverride) {
          await page.setRequestInterception(true);
          page.on("request", (request) => {
            if (request.url().startsWith("https://fonts.googleapis.com/css2?")) {
              request.continue({ url: fontStylesheetOverride });
            } else {
              request.continue();
            }
          });
        }
        await page.evaluateOnNewDocument((protectedRoute) => {
          if (protectedRoute) sessionStorage.setItem("huayun_learner_name", "P1 Font Tester");
          else sessionStorage.removeItem("huayun_learner_name");
          window.__g3Cls = 0;
          new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if (!entry.hadRecentInput) window.__g3Cls += entry.value;
            }
          }).observe({ type: "layout-shift", buffered: true });
          Object.defineProperty(window, "SpeechRecognition", { configurable: true, value: undefined });
          Object.defineProperty(window, "webkitSpeechRecognition", { configurable: true, value: undefined });
        }, route.protected);
        page.on("pageerror", (error) => errors.push(`page: ${error.message}`));
        page.on("console", (message) => {
          if (message.type() === "error") errors.push(`console: ${message.text()}`);
        });
        page.on("requestfailed", (request) => errors.push(`request: ${request.url()} ${request.failure()?.errorText ?? ""}`));

        try {
          await page.goto(`${base}${route.path}?theme=${theme}`, {
            waitUntil: "domcontentloaded",
            timeout: 45_000,
          });
          await page.waitForSelector(route.root, { visible: true, timeout: 20_000 });
          await page.waitForFunction(
            () => document.fonts.size > 0,
            { timeout: 30_000 },
          ).catch(() => undefined);
          await page.evaluate(() => Promise.race([
            document.fonts.ready,
            new Promise((resolve) => setTimeout(resolve, 30_000)),
          ]));
          await new Promise((resolve) => setTimeout(resolve, 800));

          const state = await page.evaluate((rootSelector) => {
            const root = document.querySelector(rootSelector);
            const brokenImages = [...document.images]
              .filter((image) => image.complete && image.naturalWidth === 0)
              .map((image) => image.currentSrc || image.src);
            const bodyText = document.body.textContent.replace(/\s+/g, " ").trim();
            return {
              brokenImages,
              cls: window.__g3Cls,
              documentWidth: document.documentElement.scrollWidth,
              fontStatus: document.fonts.status,
              loadedFontFaces: [...document.fonts].filter((font) => font.status === "loaded").length,
              hasHanzi: /[\u3400-\u9fff]/u.test(bodyText),
              hasPinyinTone: /[āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]/iu.test(bodyText),
              hasThai: /[\u0e01-\u0e5b]/u.test(bodyText),
              pathname: location.pathname,
              rootHeight: root.getBoundingClientRect().height,
              rootWidth: root.getBoundingClientRect().width,
              theme: document.documentElement.dataset.theme,
              viewportWidth: innerWidth,
            };
          }, route.root);

          assert.equal(state.theme, theme, `${route.name}/${viewport.name}: theme mismatch`);
          assert.equal(state.pathname, `/group3${route.path}`, `${route.name}/${viewport.name}: route mismatch`);
          assert.ok(state.rootWidth > 0 && state.rootHeight > 0, `${route.name}/${viewport.name}: unstyled root`);
          assert.ok(state.documentWidth <= state.viewportWidth + 2, `${route.name}/${viewport.name}: horizontal overflow`);
          if (route.name !== "repeat") {
            assert.ok(state.cls < 0.05, `${route.name}/${viewport.name}: CLS ${state.cls}`);
          }
          assert.deepEqual(state.brokenImages, [], `${route.name}/${viewport.name}: broken images`);
          assert.equal(state.hasThai, true, `${route.name}/${viewport.name}: Thai missing`);
          assert.equal(state.hasHanzi, true, `${route.name}/${viewport.name}: Hanzi missing`);
          assert.equal(state.hasPinyinTone, true, `${route.name}/${viewport.name}: Pinyin tone marks missing`);
          assert.equal(state.fontStatus, "loaded", `${route.name}/${viewport.name}: font set not ready`);
          assert.ok(state.loadedFontFaces > 0, `${route.name}/${viewport.name}: no web font loaded`);
          assert.deepEqual(errors, [], `${route.name}/${viewport.name}: runtime errors`);

          await page.screenshot({
            path: `/tmp/group3-p1-${route.name}-${viewport.name}-${theme}.png`,
            fullPage: false,
          });
          results.push({ route: route.name, viewport: viewport.name, theme, cls: state.cls });
        } catch (error) {
          failures.push({ route: route.name, viewport: viewport.name, theme, error: error.message, errors });
        } finally {
          await page.close();
        }
      }
    }
  }
} finally {
  await browser.close();
}

console.log(JSON.stringify({ failures, results }, null, 2));
if (failures.length) process.exitCode = 1;
