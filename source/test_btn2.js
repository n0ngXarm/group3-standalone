import puppeteer from 'puppeteer';
(async () => {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 900 });
  await page.goto('http://localhost:4173/group3/home/?theme=dark', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1000));
  
  let styles = await page.evaluate(() => {
    let btn = document.querySelector('.g3-home-cta-primary');
    let s = window.getComputedStyle(btn);
    return { display: s.display, flexDirection: s.flexDirection, alignItems: s.alignItems, justifyContent: s.justifyContent, width: s.width };
  });
  console.log('Button Styles:', styles);
  await browser.close();
})();
