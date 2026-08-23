const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const OUT_DIR = '/home/pisitpong/.gemini/antigravity-cli/brain/1ea123d1-9a08-4be6-be1b-e54287f6b1e1';

async function snap(url, filename, width, height) {
  const browser = await puppeteer.launch({ 
    args: ['--no-sandbox', '--disable-setuid-sandbox'] 
  });
  const page = await browser.newPage();
  await page.setViewport({ width, height });
  
  await page.goto(url.split('?')[0]);
  await page.evaluate(() => {
    localStorage.setItem("huayun_learner_name", "พิสิษฐ์พงษ์");
  });
  
  await page.goto(url, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1000));
  
  const dest = path.join(OUT_DIR, filename);
  await page.screenshot({ path: dest, fullPage: false });
  console.log(`Saved ${dest}`);
  
  await browser.close();
}

async function run() {
  const base = "http://localhost:4174/group3/home/hsk1/";
  
  await snap(`${base}?summary-dev=hsk1&theme=dark`, '1366x768-Dark-HSK1-Summary.png', 1366, 768);
  await snap(`${base}?summary-dev=hsk2&theme=dark`, '1366x768-Dark-HSK2-Summary.png', 1366, 768);
  await snap(`${base}?summary-dev=hsk3&theme=dark`, '1366x768-Dark-HSK3-Summary.png', 1366, 768);
  await snap(`${base}?summary-dev=hsk1&theme=light`, '1366x768-Light-HSK1-Summary.png', 1366, 768);
  await snap(`${base}?summary-dev=hsk1&theme=dark`, '390x844-Dark-HSK1-Summary.png', 390, 844);
}

run().catch(console.error);
