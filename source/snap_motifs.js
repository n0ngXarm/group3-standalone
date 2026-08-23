import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const tasks = [
    { w: 1600, h: 900, theme: 'dark' },
    { w: 1600, h: 900, theme: 'light' },
    { w: 1366, h: 768, theme: 'dark' },
    { w: 1366, h: 768, theme: 'light' },
    { w: 768, h: 1024, theme: 'light' },
    { w: 390, h: 844, theme: 'light' }
  ];

  for (const t of tasks) {
    const page = await browser.newPage();
    await page.setViewport({ width: t.w, height: t.h, deviceScaleFactor: 1 });
    await page.goto(`http://localhost:4173/group3/home/hsk1/practice/?theme=${t.theme}`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1200));
    await page.screenshot({ path: `/home/pisitpong/.gemini/antigravity-cli/brain/1ea123d1-9a08-4be6-be1b-e54287f6b1e1/motif-${t.w}x${t.h}-${t.theme}.png` });
    console.log(`Captured motif-${t.w}x${t.h}-${t.theme}`);
    await page.close();
  }
  await browser.close();
})();
