import puppeteer from 'puppeteer';
(async () => {
  const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 768 });
  await page.goto('http://localhost:4173/group3/home/?theme=light', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1000));
  
  let layout = await page.evaluate(() => {
    let lead = document.querySelector('.g3-home-lead');
    let copyZone = document.querySelector('.g3-home-copy-zone');
    let sign = document.querySelector('.sign-wrap');
    
    return {
      leadWidth: lead.getBoundingClientRect().width,
      copyZoneWidth: copyZone.getBoundingClientRect().width,
      leadOverflow: lead.getBoundingClientRect().width > copyZone.getBoundingClientRect().width
    };
  });
  console.log(layout);
  await browser.close();
})();
