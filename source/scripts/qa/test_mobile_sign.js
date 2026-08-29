import puppeteer from 'puppeteer';
(async () => {
  const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 375, height: 667 });
  await page.goto('http://localhost:4173/group3/home/?theme=light', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1000));
  
  let sign = await page.evaluate(() => {
    let el = document.querySelector('.sign-wrap');
    return el ? el.getBoundingClientRect().width : null;
  });
  console.log(sign);
  await browser.close();
})();
