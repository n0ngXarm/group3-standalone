import puppeteer from 'puppeteer';
(async () => {
  const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 844, height: 390 });
  await page.goto('http://localhost:4173/group3/home/?theme=light', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1000));
  
  let layout = await page.evaluate(() => {
    let subtitle = document.querySelector('.g3-manga-subtitle-box');
    let actorSprite = document.querySelector('.g3-manga-actor.is-talking .g3-manga-actor-sprite') || document.querySelector('.g3-manga-actor.is-talking .g3-manga-actor-frames');
    
    return {
      subtitleTop: subtitle.getBoundingClientRect().top,
      subtitleHeight: subtitle.getBoundingClientRect().height,
      actorBottom: actorSprite.getBoundingClientRect().bottom,
      actorHeight: actorSprite.getBoundingClientRect().height,
      actorTop: actorSprite.getBoundingClientRect().top,
    };
  });
  console.log(layout);
  await browser.close();
})();
