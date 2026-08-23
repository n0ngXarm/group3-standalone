import puppeteer from 'puppeteer';
(async () => {
  const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 900 });
  await page.goto('http://localhost:4173/group3/home/?theme=light', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1000));
  
  let layout = await page.evaluate(() => {
    let panel = document.querySelector('.g3-hero-copy');
    let sign = document.querySelector('.sign-wrap');
    let cta = document.querySelector('.g3-home-cta-row');
    let copy = document.querySelector('.g3-home-copy-zone');
    
    if(!panel || !sign || !cta || !copy) return null;
    
    let pRect = panel.getBoundingClientRect();
    let sRect = sign.getBoundingClientRect();
    let cRect = cta.getBoundingClientRect();
    let copyRect = copy.getBoundingClientRect();
    
    return {
      Panel: { height: pRect.height },
      Copy: {
        cy: copyRect.top + copyRect.height / 2,
        centroidY: ((copyRect.top + copyRect.height / 2 - pRect.top) / pRect.height) * 100
      },
      CTA: {
        cy: cRect.top + cRect.height / 2,
        centroidY: ((cRect.top + cRect.height / 2 - pRect.top) / pRect.height) * 100
      }
    };
  });
  console.log(layout);
  await browser.close();
})();
