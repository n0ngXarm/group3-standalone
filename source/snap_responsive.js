import puppeteer from 'puppeteer';
import fs from 'fs';

async function snap(w, h, name) {
  const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: w, height: h });
  await page.goto('http://localhost:4173/group3/home/?theme=dark', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: `/home/pisitpong/.gemini/antigravity-cli/brain/1ea123d1-9a08-4be6-be1b-e54287f6b1e1/${name}-dark.png` });
  
  await page.goto('http://localhost:4173/group3/home/?theme=light', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: `/home/pisitpong/.gemini/antigravity-cli/brain/1ea123d1-9a08-4be6-be1b-e54287f6b1e1/${name}-light.png` });
  
  await browser.close();
  console.log(`Captured ${name}`);
}

(async () => {
  await snap(1600, 900, 'desktop-1600');
  await snap(1366, 768, 'laptop-1366');
  await snap(768, 1024, 'tablet-768');
  await snap(390, 844, 'phone-390');
  await snap(844, 390, 'phone-landscape-844');
})();
