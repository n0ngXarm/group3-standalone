import puppeteer from 'puppeteer';
import fs from 'fs';

(async () => {
  const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const resolutions = [
    { name: '1600-light', width: 1600, height: 900, theme: 'light' },
    { name: '1600-dark', width: 1600, height: 900, theme: 'dark' },
    { name: '768-light', width: 768, height: 1024, theme: 'light' },
    { name: '390-dark', width: 390, height: 844, theme: 'dark' },
  ];

  for (const res of resolutions) {
    const page = await browser.newPage();
    await page.setViewport({ width: res.width, height: res.height, deviceScaleFactor: 1 });
    await page.goto(`http://localhost:4173/group3/home/hsk1/practice/?theme=${res.theme}`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: `/home/pisitpong/.gemini/antigravity-cli/brain/1ea123d1-9a08-4be6-be1b-e54287f6b1e1/practice-hub-${res.name}.png` });
    console.log(`Captured practice-hub-${res.name}`);
    await page.close();
  }
  await browser.close();
})();
