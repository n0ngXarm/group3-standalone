import puppeteer from 'puppeteer';
(async () => {
  const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 900 });
  await page.goto('http://localhost:4173/group3/home/?theme=light', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1500));
  
  let layout = await page.evaluate(() => {
    let dots = document.querySelector('.g3-home-carousel-dots');
    let viewport = document.querySelector('.g3-manga-viewport');
    
    return {
      dotsLeft: dots ? dots.getBoundingClientRect().left : null,
      dotsWidth: dots ? dots.getBoundingClientRect().width : null,
      viewportLeft: viewport ? viewport.getBoundingClientRect().left : null,
      viewportWidth: viewport ? viewport.getBoundingClientRect().width : null,
    };
  });
  console.log(layout);
  await browser.close();
})();
