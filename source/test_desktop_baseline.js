import puppeteer from 'puppeteer';
(async () => {
  const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 900 });
  await page.goto('http://localhost:4173/group3/home/?theme=light', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1500));
  
  let layout = await page.evaluate(() => {
    let hanzi = document.querySelector('.g3-manga-hanzi');
    let pinyin = document.querySelector('.g3-manga-pinyin');
    let thai = document.querySelector('.g3-manga-thai');
    
    let dots = document.querySelector('.g3-home-carousel-dots');
    let sign = document.querySelector('.sign-anchor');
    let header = document.querySelector('.g3-header');
    
    let actor = document.querySelector('.g3-manga-actor.is-talking .g3-manga-actor-sprite') || document.querySelector('.g3-manga-actor.is-talking .g3-manga-actor-frames');
    let subtitle = document.querySelector('.g3-manga-subtitle-box');
    
    let docScroll = {
      h: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      v: document.documentElement.scrollHeight > document.documentElement.clientHeight
    };
    
    return {
      hanziSize: window.getComputedStyle(hanzi).fontSize,
      pinyinSize: window.getComputedStyle(pinyin).fontSize,
      thaiSize: window.getComputedStyle(thai).fontSize,
      dotsVisible: dots && dots.getBoundingClientRect().top > 0 && dots.getBoundingClientRect().bottom <= window.innerHeight,
      dotsBottom: dots ? dots.getBoundingClientRect().bottom : null,
      signTop: sign ? sign.getBoundingClientRect().top : null,
      headerBottom: header ? header.getBoundingClientRect().bottom : null,
      actorClearance: (subtitle && actor) ? subtitle.getBoundingClientRect().top - actor.getBoundingClientRect().bottom : null,
      scrollbars: docScroll
    };
  });
  console.log(layout);
  await browser.close();
})();
