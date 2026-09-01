import puppeteer from 'puppeteer';
(async () => {
  const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 900 });
  await page.goto('http://localhost:4173/group3/home/?theme=light', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1000));
  
  let p = await page.evaluate(() => {
    let vn = document.querySelector('.g3-home-carousel');
    let vnDisplay = vn ? window.getComputedStyle(vn).display : null;
    return {
      vnExists: !!vn,
      vnWidth: vn ? vn.getBoundingClientRect().width : null,
      vnDisplay
    }
  });
  console.log(p);
  await browser.close();
})();
