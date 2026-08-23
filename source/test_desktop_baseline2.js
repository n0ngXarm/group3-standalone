import puppeteer from 'puppeteer';
(async () => {
  const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 900 });
  await page.goto('http://localhost:4173/group3/home/?theme=light', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1500));
  
  let layout = await page.evaluate(() => {
    let wrap = document.querySelector('.sign-wrap');
    let board = document.querySelector('.sign-board');
    let beam = document.querySelector('.sign-beam');
    let header = document.querySelector('.g3-header');
    
    return {
      wrapTop: wrap ? wrap.getBoundingClientRect().top : null,
      boardTop: board ? board.getBoundingClientRect().top : null,
      beamTop: beam ? beam.getBoundingClientRect().top : null,
      headerBottom: header ? header.getBoundingClientRect().bottom : null,
    };
  });
  console.log(layout);
  await browser.close();
})();
