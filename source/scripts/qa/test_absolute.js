import puppeteer from 'puppeteer';
(async () => {
  const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 900 });
  await page.goto('http://localhost:4173/group3/home/?theme=light', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1500));

  await page.addStyleTag({ content: `
    .g3-home.is-single-screen .g3-hero-copy {
      position: relative !important;
    }
    @media (min-width: 900px) {
      .g3-home.is-single-screen .g3-home-copy-zone {
        position: absolute !important;
        top: 47.5% !important;
        left: 50% !important;
        transform: translate(-50%, -50%) !important;
        width: 100% !important;
      }
      .g3-home.is-single-screen .g3-home-cta-row {
        position: absolute !important;
        top: 67.5% !important;
        left: 50% !important;
        transform: translate(-50%, -50%) !important;
        width: 100% !important;
      }
    }
  `});
  await new Promise(r => setTimeout(r, 500));

  let layout = await page.evaluate(() => {
    let hero = document.querySelector('.g3-hero-copy');
    let copy = document.querySelector('.g3-home-copy-zone');
    let cta = document.querySelector('.g3-home-cta-row');
    let heroRect = hero.getBoundingClientRect();
    let copyRect = copy.getBoundingClientRect();
    let ctaRect = cta.getBoundingClientRect();
    
    return {
      heroHeight: heroRect.height,
      copyCentroidRatio: ((copyRect.top + copyRect.height / 2) - heroRect.top) / heroRect.height,
      ctaCentroidRatio: ((ctaRect.top + ctaRect.height / 2) - heroRect.top) / heroRect.height,
      copyCenterX: (copyRect.left + copyRect.width / 2),
      heroCenterX: (heroRect.left + heroRect.width / 2),
      ctaCenterX: (ctaRect.left + ctaRect.width / 2)
    };
  });
  console.log(layout);
  await page.screenshot({ path: '/home/pisitpong/.gemini/antigravity-cli/brain/1ea123d1-9a08-4be6-be1b-e54287f6b1e1/test_abs_desktop.png' });
  await browser.close();
})();
