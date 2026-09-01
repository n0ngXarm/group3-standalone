import puppeteer from 'puppeteer';
(async () => {
  const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 900 });
  await page.goto('http://localhost:4173/group3/home/?theme=light', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1000));
  
  let layout = await page.evaluate(() => {
    let header = document.querySelector('.g3-header');
    let anchor = document.querySelector('.sign-anchor');
    if (!header || !anchor) return null;
    let hRect = header.getBoundingClientRect();
    let aRect = anchor.getBoundingClientRect();
    return {
      headerBottom: hRect.bottom,
      anchorTop: aRect.top,
      anchorHeight: aRect.height,
      anchorCenterY: aRect.top + aRect.height / 2,
      delta: Math.abs((aRect.top + aRect.height / 2) - hRect.bottom)
    };
  });
  console.log("Desktop 1600x900:");
  console.log(layout);
  await browser.close();
})();
