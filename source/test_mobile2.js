import puppeteer from 'puppeteer';
(async () => {
  const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 375, height: 812 });
  await page.goto('http://localhost:4173/group3/home/?theme=light', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1000));
  
  let layout = await page.evaluate(() => {
    let sign = document.querySelector('.sign-wrap');
    let copy = document.querySelector('.g3-home-copy-zone');
    let cta = document.querySelector('.g3-home-cta-row');
    
    if(!sign || !copy || !cta) return null;
    
    return {
      signBottom: sign.getBoundingClientRect().bottom,
      copyTop: copy.getBoundingClientRect().top,
      copyBottom: copy.getBoundingClientRect().bottom,
      ctaTop: cta.getBoundingClientRect().top,
      ctaBottom: cta.getBoundingClientRect().bottom
    };
  });
  console.log(layout);
  await browser.close();
})();
