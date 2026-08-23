import puppeteer from 'puppeteer';
(async () => {
  const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 900 });
  await page.goto('http://localhost:4173/group3/home/?theme=light', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1000));
  
  let p = await page.evaluate(() => {
    let hero = document.querySelector('.g3-home-hero');
    let copy = document.querySelector('.g3-hero-copy');
    let vn = document.querySelector('.g3-manga-stage');
    return {
      heroDisplay: window.getComputedStyle(hero).display,
      heroWidth: hero.getBoundingClientRect().width,
      copyWidth: copy.getBoundingClientRect().width,
      vnExists: !!vn,
      vnWidth: vn ? vn.getBoundingClientRect().width : null,
      heroColumns: window.getComputedStyle(hero).gridTemplateColumns,
    }
  });
  console.log(p);
  await browser.close();
})();
