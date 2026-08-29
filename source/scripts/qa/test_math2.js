import puppeteer from 'puppeteer';
(async () => {
  const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 900 });
  await page.goto('http://localhost:4173/group3/home/?theme=light', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1000));
  
  await page.addStyleTag({content: `
    .g3-home.is-single-screen .g3-home-copy-zone { top: 46% !important; }
    .g3-home.is-single-screen .g3-home-cta-row { top: 66% !important; }
  `});
  
  await new Promise(r => setTimeout(r, 300));

  let layout = await page.evaluate(() => {
    let sign = document.querySelector('.sign-wrap');
    let copy = document.querySelector('.g3-home-copy-zone');
    let cta = document.querySelector('.g3-home-cta-row');
    let panel = document.querySelector('.g3-hero-copy');
    
    let signRect = sign.getBoundingClientRect();
    let copyRect = copy.getBoundingClientRect();
    let ctaRect = cta.getBoundingClientRect();
    let panelRect = panel.getBoundingClientRect();
    
    return {
      left: {
        signBottomToCopyTop: copyRect.top - signRect.bottom,
        copyBottomToCtaTop: ctaRect.top - copyRect.bottom,
        ctaBottomToHeroBottom: panelRect.bottom - ctaRect.bottom,
      }
    };
  });
  console.log(JSON.stringify(layout, null, 2));
  await browser.close();
})();
