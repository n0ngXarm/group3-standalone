import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 900 });
  await page.goto('http://localhost:4173/group3/home/levels/?theme=light', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1500));
  
  let metrics = await page.evaluate(() => {
    let card = document.querySelector('.g3-level-card.is-compact');
    if (!card) return null;
    let actor = card.querySelector('.g3-actor-idle');
    let title = card.querySelector('.g3-level-card-title');
    let code = card.querySelector('.g3-level-card-code');
    
    return {
      actorOpacity: window.getComputedStyle(actor).opacity,
      titleColor: window.getComputedStyle(title).color,
      codeColor: window.getComputedStyle(code).color
    };
  });
  console.log(metrics);
  await browser.close();
})();
