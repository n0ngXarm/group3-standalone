import puppeteer from 'puppeteer';
(async () => {
  const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 900 });
  await page.goto('http://localhost:4173/group3/home/?theme=light', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1500));
  
  let layout = await page.evaluate(() => {
    let copyZone = document.querySelector('.g3-home-copy-zone');
    let ctaRow = document.querySelector('.g3-home-cta-row');
    let heroCopy = document.querySelector('.g3-hero-copy');
    return {
      hasCopyZone: !!copyZone,
      hasCtaRow: !!ctaRow,
      heroCopyHeight: heroCopy ? heroCopy.getBoundingClientRect().height : null
    };
  });
  console.log(layout);
  await browser.close();
})();
