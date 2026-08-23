import puppeteer from 'puppeteer';
(async () => {
  const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 900 });
  await page.goto('http://localhost:4173/group3/home/?theme=light', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1500));
  
  let layout = await page.evaluate(() => {
    let cta = document.querySelector('.g3-home-cta-primary');
    return {
      top: cta ? cta.getBoundingClientRect().top : null,
      height: cta ? cta.getBoundingClientRect().height : null,
      width: cta ? cta.getBoundingClientRect().width : null,
      fontSize: cta ? window.getComputedStyle(cta).fontSize : null,
      display: cta ? window.getComputedStyle(cta).display : null,
      gap: cta ? window.getComputedStyle(cta).gap : null,
      ai: cta ? window.getComputedStyle(cta).alignItems : null,
      jc: cta ? window.getComputedStyle(cta).justifyContent : null,
    };
  });
  console.log(layout);
  await browser.close();
})();
