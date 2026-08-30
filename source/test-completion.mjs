import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const outDir = '/home/nong_ing/.gemini/antigravity-cli/brain/78ad5ab7-9fba-4d34-b0a8-9da80a30c978/scratch';

async function run() {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 768 });
  
  await page.goto('http://127.0.0.1:4173/');
  await page.evaluate(() => sessionStorage.setItem("huayun_learner_name", "Tester"));
  
  await page.goto('http://127.0.0.1:4173/home/hsk1/lessons/lesson-01/scenes/scene-01/?theme=light');
  await page.waitForSelector('.g3-reader-intro', { timeout: 10000 });
  
  // start autoplay
  await page.click('.g3-intro-btn-primary');
  
  // wait for completion
  console.log("Waiting for completion...");
  try {
    await page.waitForSelector('.g3-reader-completion', { timeout: 45000 });
    await page.screenshot({ path: path.join(outDir, 'reader-04-completion.png') });
    console.log("Captured completion!");
  } catch(e) {
    console.log("Timeout waiting for completion.");
  }
  await browser.close();
}
run().catch(console.error);
