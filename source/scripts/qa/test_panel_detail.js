import puppeteer from 'puppeteer';
(async () => {
  const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 900 });
  await page.goto('http://localhost:4173/group3/home/?theme=light', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1000));
  
  let layout = await page.evaluate(() => {
    let panel = document.querySelector('.g3-hero-copy');
    if (!panel) return null;
    let s = window.getComputedStyle(panel);
    return { 
      paddingTop: s.paddingTop,
      marginTop: s.marginTop,
      justifyContent: s.justifyContent,
      display: s.display
    };
  });
  console.log(layout);
  await browser.close();
})();
