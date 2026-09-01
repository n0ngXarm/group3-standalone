import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const outDir = '/home/pisitpong/.gemini/antigravity-cli/brain/1ea123d1-9a08-4be6-be1b-e54287f6b1e1';

const targets = [
  { name: '1280-dark', w: 1280, h: 800, t: 'dark' },
  { name: '390-dark', w: 390, h: 844, t: 'dark' },
  { name: '844-dark', w: 844, h: 390, t: 'dark' },
];

(async () => {
  const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'] });
  const page = await browser.newPage();

  for (const t of targets) {
    await page.setViewport({ width: t.w, height: t.h });
    await page.goto(`http://localhost:4173/group3/home/?theme=${t.t}`, { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 1500));
    await page.screenshot({ path: path.join(outDir, `${t.name}.png`) });
    console.log(`Captured ${t.name}`);
  }

  await browser.close();
})();
