import puppeteer from "puppeteer";

const target = process.argv[2];
if (!target) throw new Error("Usage: node pagespeed-run.mjs <url>");

const browser = await puppeteer.launch({
  headless: true,
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});

try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 900 });
  const startUrl = `https://pagespeed.web.dev/analysis?url=${encodeURIComponent(target)}&form_factor=desktop`;
  await page.goto(startUrl, { waitUntil: "domcontentloaded", timeout: 60_000 });

  let result = null;
  for (let attempt = 0; attempt < 30; attempt += 1) {
    await new Promise((resolve) => setTimeout(resolve, 5_000));
    const state = await page.evaluate(() => ({ text: document.body.innerText, url: location.href }));
    if (state.text.includes("Largest Contentful Paint") && /\bPerformance\b/.test(state.text)) {
      result = state;
      break;
    }
    console.error(`POLL ${(attempt + 1) * 5}s ${state.url}`);
  }

  if (!result) throw new Error(`PageSpeed timed out at ${page.url()}`);
  console.log(JSON.stringify(result));
} finally {
  await browser.close();
}
