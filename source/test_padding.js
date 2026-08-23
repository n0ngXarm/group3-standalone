import puppeteer from 'puppeteer';
(async () => {
  const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 900 });
  await page.goto('http://localhost:4173/group3/home/?theme=light', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1000));
  
  let layout = await page.evaluate(() => {
    let subtitle = document.querySelector('.g3-manga-subtitle-box');
    
    let actorSprite = document.querySelector('.g3-manga-actor.is-idle .g3-manga-actor-sprite') || document.querySelector('.g3-manga-actor.is-idle .g3-manga-actor-frames');
    let activeActorSprite = document.querySelector('.g3-manga-actor.is-talking .g3-manga-actor-sprite') || document.querySelector('.g3-manga-actor.is-talking .g3-manga-actor-frames');
    
    let maxActorBottom = Math.max(
      actorSprite ? actorSprite.getBoundingClientRect().bottom : 0,
      activeActorSprite ? activeActorSprite.getBoundingClientRect().bottom : 0
    );
    
    return {
      overlap: subtitle ? maxActorBottom - subtitle.getBoundingClientRect().top : null,
      dialogueTop: subtitle ? subtitle.getBoundingClientRect().top : null,
      maxActorBottom: maxActorBottom
    };
  });
  console.log(layout);
  await browser.close();
})();
