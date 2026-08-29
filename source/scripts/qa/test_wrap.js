import puppeteer from 'puppeteer';
(async () => {
  const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 900 });
  await page.goto('http://localhost:4173/group3/home/?theme=light', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1000));
  
  let layout = await page.evaluate(() => {
    let lead = document.querySelector('.g3-home-lead');
    let height = lead.getBoundingClientRect().height;
    let computed = window.getComputedStyle(lead);
    return {
      height: height,
      lineHeight: computed.lineHeight,
      whiteSpace: computed.whiteSpace
    };
  });
  console.log(layout);
  await browser.close();
})();
