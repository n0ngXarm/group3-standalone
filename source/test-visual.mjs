import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const outDir = '/home/nong_ing/.gemini/antigravity-cli/brain/78ad5ab7-9fba-4d34-b0a8-9da80a30c978/scratch';
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

async function run() {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const pageDesk = await browser.newPage();
  
  // Go to home to set session
  await pageDesk.goto('http://127.0.0.1:4173/home/?theme=light');
  await pageDesk.evaluate(() => {
    window.sessionStorage.setItem("huayun_learner_name", "Tester");
  });
  
  await pageDesk.setViewport({ width: 1366, height: 768 });
  
  // HSK1 Lesson Selector (Light)
  await pageDesk.goto('http://127.0.0.1:4173/home/hsk1/?theme=light');
  await pageDesk.waitForSelector('.g3-lesson-selector', { timeout: 10000 });
  await pageDesk.screenshot({ path: path.join(outDir, 'hsk1-selector-1366-light.png') });

  // HSK2 Lesson Selector (Light)
  await pageDesk.goto('http://127.0.0.1:4173/home/hsk2/?theme=light');
  await pageDesk.waitForSelector('.g3-lesson-selector', { timeout: 5000 });
  await pageDesk.screenshot({ path: path.join(outDir, 'hsk2-selector-1366-light.png') });

  // HSK3 Lesson Selector (Light)
  await pageDesk.goto('http://127.0.0.1:4173/home/hsk3/?theme=light');
  await pageDesk.waitForSelector('.g3-lesson-selector', { timeout: 5000 });
  await pageDesk.screenshot({ path: path.join(outDir, 'hsk3-selector-1366-light.png') });

  // HSK1 Selector (Dark)
  await pageDesk.goto('http://127.0.0.1:4173/home/hsk1/?theme=dark');
  await pageDesk.waitForSelector('.g3-lesson-selector', { timeout: 5000 });
  await pageDesk.screenshot({ path: path.join(outDir, 'hsk1-selector-1366-dark.png') });

  // 390x844 Light
  await pageDesk.setViewport({ width: 390, height: 844 });
  await pageDesk.goto('http://127.0.0.1:4173/home/hsk1/?theme=light');
  await pageDesk.waitForSelector('.g3-lesson-selector', { timeout: 5000 });
  await pageDesk.screenshot({ path: path.join(outDir, 'hsk1-selector-390-light.png') });

  // Reader: Scene Start
  await pageDesk.setViewport({ width: 1366, height: 768 });
  await pageDesk.goto('http://127.0.0.1:4173/home/hsk1/lessons/lesson-01/scenes/scene-01/?theme=light');
  await pageDesk.waitForSelector('.g3-reading-stage', { timeout: 5000 });
  await pageDesk.screenshot({ path: path.join(outDir, 'reader-scene-start.png') });

  // Reader: Scene Completed
  await pageDesk.evaluate(() => {
    const stage = document.querySelector('.g3-reading-stage');
    if (stage) {
      const block = document.createElement('section');
      block.className = 'g3-scene-complete';
      block.setAttribute('aria-live', 'polite');
      block.innerHTML = `
        <span aria-hidden="true">✓</span>
        <div>
          <p>จบตอนที่ 1</p>
          <h2>ทักทายเสี่ยวหวี่ในออฟฟิศ</h2>
          <strong>คุณเรียนบทสนทนาในตอนนี้เสร็จแล้ว</strong>
        </div>
        <div>
          <button class="is-primary" type="button">เริ่มตอนที่ 2 →</button>
          <button type="button">กลับไปเลือกบทเรียน</button>
        </div>
      `;
      stage.appendChild(block);
      stage.setAttribute('data-status', 'complete');
      document.body.style.overflow = 'auto'; // ensure scroll
    }
  });
  await new Promise(r => setTimeout(r, 1000));
  await pageDesk.screenshot({ path: path.join(outDir, 'reader-scene-complete.png') });

  await browser.close();
  console.log('Screenshots saved');
}

run().catch(console.error);
