import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 900 });
  await page.goto('http://localhost:4173/group3/home/?theme=light', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1000));
  
  async function report(selector, label) {
    let result = await page.evaluate((sel) => {
      let el = document.querySelector(sel);
      if (!el) return null;
      let s = window.getComputedStyle(el);
      let rect = el.getBoundingClientRect();
      let lines = el.innerText.split('\\n');
      return {
        fontFamily: s.fontFamily,
        fontSize: s.fontSize,
        fontWeight: s.fontWeight,
        lineHeight: s.lineHeight,
        color: s.color,
        width: rect.width,
        height: rect.height
      };
    }, selector);
    console.log(`--- ${label} ---`);
    console.log(result);
  }

  let box = await page.evaluate(() => {
    let el = document.querySelector('.g3-home-copy-zone');
    if (!el) return null;
    let r = el.getBoundingClientRect();
    return { width: r.width, height: r.height, x: r.x, y: r.y };
  });
  
  console.log("=== DESKTOP 1600x900 ===");
  console.log("Copy Box:", box);
  await report('.g3-home-lead', 'LEVEL A (Lead)');
  await report('.g3-home-expl', 'LEVEL B (Support)');
  await report('.g3-home-meta', 'LEVEL C (Meta)');
  
  await browser.close();
})();
