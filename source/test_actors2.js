import puppeteer from 'puppeteer';
(async () => {
  const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 900 });
  await page.goto('http://localhost:4173/group3/home/?theme=light', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1000));
  
  let layout = await page.evaluate(() => {
    let layer = document.querySelector('.g3-manga-actors-layer');
    let label = document.querySelector('.g3-manga-actor-label');
    let subtitle = document.querySelector('.g3-manga-subtitle-box');
    let copy = document.querySelector('.g3-home-copy-zone');
    let ctaWrapper = document.querySelector('.g3-home-cta-row');
    
    return {
      layerBottomPadding: layer ? window.getComputedStyle(layer).paddingBottom : null,
      labelTop: label ? window.getComputedStyle(label).top : null,
      subtitleTop: subtitle ? subtitle.getBoundingClientRect().top : null,
      layerBottom: layer ? layer.getBoundingClientRect().bottom : null,
      ctaWrapperCenter: ctaWrapper ? ctaWrapper.getBoundingClientRect().left + ctaWrapper.getBoundingClientRect().width / 2 : null,
      copyFont: copy ? window.getComputedStyle(copy.querySelector('.g3-home-lead')).fontFamily : null
    };
  });
  console.log(layout);
  await browser.close();
})();
