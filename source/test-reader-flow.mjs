import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const outDir = '/home/nong_ing/.gemini/antigravity-cli/brain/78ad5ab7-9fba-4d34-b0a8-9da80a30c978/scratch';
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

async function run() {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 768 });
  
  // Set session so we don't get redirected
  await page.goto('http://127.0.0.1:4173/');
  await page.evaluate(() => sessionStorage.setItem("huayun_learner_name", "Tester"));
  
  console.log("Navigating to reader...");
  await page.goto('http://127.0.0.1:4173/home/hsk1/lessons/lesson-01/scenes/scene-01/?theme=light');
  await page.waitForSelector('.g3-reader-intro', { timeout: 10000 });
  await page.screenshot({ path: path.join(outDir, 'reader-01-intro-desktop.png') });
  console.log("Captured Intro (Desktop)");

  // Mobile Intro
  await page.setViewport({ width: 390, height: 844 });
  await page.screenshot({ path: path.join(outDir, 'reader-01-intro-mobile.png') });
  console.log("Captured Intro (Mobile)");

  // Click start (Read Manually so it doesn't auto-scroll)
  await page.setViewport({ width: 1366, height: 768 });
  await page.click('.g3-intro-btn-secondary');
  await page.waitForSelector('.g3-dialogue-stage', { timeout: 10000 });
  await page.screenshot({ path: path.join(outDir, 'reader-02-dialogue.png') });
  console.log("Captured Dialogue View");

  // To reach completion, we need to click next multiple times.
  // We can just evaluate a script to fast-forward the state if we wanted to,
  // but clicking "Next" button in the dock is easier.
  console.log("Clicking through dialogue...");
  let maxClicks = 20;
  while(maxClicks-- > 0) {
    const nextBtn = await page.$('.g3-playback-next');
    if (!nextBtn) break;
    
    // Check if challenge is visible
    const hasChallenge = await page.$('.g3-qte-challenge') || await page.$('.g3-sentence-builder');
    if (hasChallenge) {
      await page.screenshot({ path: path.join(outDir, 'reader-03-challenge.png') });
      console.log("Captured Challenge State");
      // Skip challenge by evaluating state override if possible? 
      // QTE has .g3-qte-option buttons, we can click the correct one.
      // For simplicity, we can just click all options until it resolves.
      const qteOptions = await page.$$('.g3-qte-option');
      if (qteOptions.length) {
          for (const opt of qteOptions) {
             await opt.click().catch(()=>null);
          }
      }
      // Give it a second to animate
      await new Promise(r => setTimeout(r, 1000));
    } else {
      const isComplete = await page.$('.g3-reader-completion');
      if (isComplete) {
        await page.screenshot({ path: path.join(outDir, 'reader-04-completion.png') });
        console.log("Captured Completion State");
        break;
      }
      
      const isDisabled = await page.evaluate(el => el.disabled, nextBtn);
      if (isDisabled) {
        // Might be complete or blocked
        break;
      }
      await nextBtn.click();
      await new Promise(r => setTimeout(r, 200));
    }
  }

  // Double check if completion is rendered
  const isComplete = await page.$('.g3-reader-completion');
  if (isComplete) {
    await page.screenshot({ path: path.join(outDir, 'reader-04-completion.png') });
    console.log("Captured Completion State");
  }

  await browser.close();
  console.log("Screenshots done.");
}

run().catch(console.error);
