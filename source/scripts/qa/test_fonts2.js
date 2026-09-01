import puppeteer from 'puppeteer';
(async () => {
  const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 900 });
  await page.goto('http://localhost:4173/group3/home/?theme=light', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1000));
  
  let layout = await page.evaluate(() => {
    let hanzi = document.querySelector('.g3-manga-hanzi');
    let pinyin = document.querySelector('.g3-manga-pinyin');
    let thai = document.querySelector('.g3-manga-thai');
    return {
      hanzi: window.getComputedStyle(hanzi).fontSize,
      pinyin: window.getComputedStyle(pinyin).fontSize,
      thai: window.getComputedStyle(thai).fontSize
    };
  });
  console.log(layout);
  await browser.close();
})();
