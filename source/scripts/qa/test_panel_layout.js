import puppeteer from 'puppeteer';
(async () => {
  const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 900 });
  await page.goto('http://localhost:4173/group3/home/?theme=light', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1000));
  
  let layout = await page.evaluate(() => {
    let p = document.querySelector('.g3-hero-copy');
    if(!p) return null;
    let s = window.getComputedStyle(p);
    return {
      rect: p.getBoundingClientRect(),
      height: s.height,
      parentHeight: window.getComputedStyle(p.parentElement).height,
      display: window.getComputedStyle(p.parentElement).display,
      parentDisplay: window.getComputedStyle(p.parentElement).display,
    };
  });
  console.log(layout);
  await browser.close();
})();
