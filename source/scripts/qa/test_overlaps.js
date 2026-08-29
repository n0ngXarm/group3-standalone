import puppeteer from 'puppeteer';

async function testViewport(w, h, name) {
  const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: w, height: h });
  await page.goto('http://localhost:4173/group3/home/?theme=light', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1000));
  
  let overlap = await page.evaluate(() => {
    let subtitle = document.querySelector('.g3-manga-subtitle-box');
    let activeActorSprite = document.querySelector('.g3-manga-actor.is-talking .g3-manga-actor-sprite') || document.querySelector('.g3-manga-actor.is-talking .g3-manga-actor-frames');
    if (!subtitle || !activeActorSprite) return null;
    return subtitle.getBoundingClientRect().top - activeActorSprite.getBoundingClientRect().bottom;
  });
  console.log(`${name} (${w}x${h}) Clearance: ${overlap}px`);
  await browser.close();
}

(async () => {
  await testViewport(375, 667, 'Mobile Portrait');
  await testViewport(768, 1024, 'Tablet Portrait');
  await testViewport(844, 390, 'Mobile Landscape');
  await testViewport(1024, 768, 'Tablet Landscape');
})();
