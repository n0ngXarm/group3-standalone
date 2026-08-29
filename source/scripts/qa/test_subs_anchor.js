import puppeteer from 'puppeteer';
(async () => {
  const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 900 });
  await page.goto('http://localhost:4173/group3/home/?theme=light', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1500));
  
  let layout = await page.evaluate(() => {
    let subBox = document.querySelector('.g3-manga-subtitle-box');
    let viewport = document.querySelector('.g3-manga-viewport');
    let dots = document.querySelector('.g3-home-carousel-dots');
    if (!subBox || !viewport) return null;
    return {
      subPosition: window.getComputedStyle(subBox).position,
      subBottom: window.getComputedStyle(subBox).bottom,
      subLeft: window.getComputedStyle(subBox).left,
      subTransform: window.getComputedStyle(subBox).transform,
      subRectBottom: subBox.getBoundingClientRect().bottom,
      viewportRectBottom: viewport.getBoundingClientRect().bottom,
      dotsRectTop: dots ? dots.getBoundingClientRect().top : null
    };
  });
  console.log(layout);
  await browser.close();
})();
