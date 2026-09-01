import assert from "node:assert/strict";
import puppeteer from "puppeteer";

const base = process.argv[2] || process.env.G3_BASE_URL || "http://127.0.0.1:4178/group3";
const viewports = [
  { name: "desktop", width: 1366, height: 768 },
  { name: "tablet-landscape", width: 1024, height: 768 },
  { name: "tablet-portrait", width: 768, height: 1024 },
  { name: "mobile", width: 412, height: 915 },
  { name: "mobile-compact", width: 360, height: 800 },
];

function homeUrl(theme) {
  return `${base.replace(/\/$/, "")}/home/?theme=${theme}`;
}

const browser = await puppeteer.launch({
  headless: true,
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});

const violations = [];
const measurements = [];

try {
  const networkPage = await browser.newPage();
  const initialRequests = [];
  networkPage.on("request", (request) => initialRequests.push(request.url()));
  await networkPage.setViewport(viewports[0]);
  await networkPage.goto(homeUrl("light"), { waitUntil: "networkidle2", timeout: 60_000 });
  await new Promise((resolve) => setTimeout(resolve, 4_500));

  const earlyWebGlRequests = initialRequests.filter((url) => /three(?:\.module|-)|ThreeBackdrop/i.test(url));
  if (earlyWebGlRequests.length > 0) {
    violations.push(`decorative WebGL loaded before interaction: ${earlyWebGlRequests.join(", ")}`);
  }
  await networkPage.close();

  for (const viewport of viewports) {
    const page = await browser.newPage();
    await page.setViewport({
      width: viewport.width,
      height: viewport.height,
      deviceScaleFactor: 1,
      hasTouch: viewport.width <= 768,
      isMobile: viewport.width <= 480,
    });
    await page.goto(homeUrl("light"), { waitUntil: "networkidle2", timeout: 60_000 });
    await page.waitForSelector(".g3-home-carousel-dot", { visible: true, timeout: 20_000 });

    const result = await page.evaluate(() => {
      function channelToLinear(channel) {
        const normalized = channel / 255;
        return normalized <= 0.04045
          ? normalized / 12.92
          : ((normalized + 0.055) / 1.055) ** 2.4;
      }

      function parseRgb(value) {
        const channels = value.match(/[\d.]+/g)?.map(Number) || [];
        return channels.slice(0, 3);
      }

      function luminance(value) {
        const [red, green, blue] = parseRgb(value).map(channelToLinear);
        return (0.2126 * red) + (0.7152 * green) + (0.0722 * blue);
      }

      function contrast(foreground, background) {
        const high = Math.max(luminance(foreground), luminance(background));
        const low = Math.min(luminance(foreground), luminance(background));
        return (high + 0.05) / (low + 0.05);
      }

      const dots = [...document.querySelectorAll(".g3-home-carousel-dot")].map((dot) => {
        const bounds = dot.getBoundingClientRect();
        return { height: bounds.height, width: bounds.width };
      });
      const activeLanguage = document.querySelector(".g3-topbar-lang-switcher button.active");
      const languageStyle = getComputedStyle(activeLanguage);

      return {
        contrast: contrast(languageStyle.color, languageStyle.backgroundColor),
        dots,
        horizontalOverflow: document.documentElement.scrollWidth - window.innerWidth,
      };
    });

    measurements.push({ ...viewport, theme: "light", ...result });
    result.dots.forEach((dot, index) => {
      if (dot.width < 44 || dot.height < 44) {
        violations.push(`${viewport.name} carousel tab ${index + 1} is ${dot.width}x${dot.height}`);
      }
    });
    if (result.contrast < 4.5) {
      violations.push(`${viewport.name} light selected-language contrast is ${result.contrast.toFixed(2)}:1`);
    }
    if (result.horizontalOverflow > 1) {
      violations.push(`${viewport.name} overflows horizontally by ${result.horizontalOverflow}px`);
    }

    if (viewport.name === "desktop" || viewport.name === "mobile") {
      await page.goto(homeUrl("dark"), { waitUntil: "networkidle2", timeout: 60_000 });
      const darkContrast = await page.$eval(".g3-topbar-lang-switcher button.active", (activeLanguage) => {
        const parse = (value) => value.match(/[\d.]+/g).slice(0, 3).map(Number);
        const linear = (channel) => {
          const normalized = channel / 255;
          return normalized <= 0.04045 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
        };
        const luminance = (value) => {
          const [red, green, blue] = parse(value).map(linear);
          return (0.2126 * red) + (0.7152 * green) + (0.0722 * blue);
        };
        const style = getComputedStyle(activeLanguage);
        const foreground = luminance(style.color);
        const background = luminance(style.backgroundColor);
        return (Math.max(foreground, background) + 0.05) / (Math.min(foreground, background) + 0.05);
      });
      measurements.push({ ...viewport, contrast: darkContrast, theme: "dark" });
      if (darkContrast < 4.5) {
        violations.push(`${viewport.name} dark selected-language contrast is ${darkContrast.toFixed(2)}:1`);
      }
    }

    await page.close();
  }
} finally {
  await browser.close();
}

console.log(JSON.stringify({ measurements, violations }, null, 2));
assert.deepEqual(violations, []);
console.log("GROUP3_HOME_PAGESPEED_CONTRACT_PASS");
