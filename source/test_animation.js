import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 900 });
  
  // We want to capture a trace or just evaluate styles rapidly during load
  await page.goto('http://localhost:4173/group3/home/levels/', { waitUntil: 'domcontentloaded' });
  
  // Wait 100ms and check opacity
  await new Promise(r => setTimeout(r, 100));
  let opacities1 = await page.evaluate(() => {
    let cards = document.querySelectorAll('.g3-level-card');
    return Array.from(cards).map(c => window.getComputedStyle(c).opacity);
  });
  
  // Wait 1000ms (animation should be done)
  await new Promise(r => setTimeout(r, 1000));
  let opacities2 = await page.evaluate(() => {
    let cards = document.querySelectorAll('.g3-level-card');
    return Array.from(cards).map(c => window.getComputedStyle(c).opacity);
  });

  // Click a card and check if opacity resets
  await page.evaluate(() => {
    document.querySelectorAll('.g3-level-card')[1].dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
  });
  
  await new Promise(r => setTimeout(r, 50));
  let opacities3 = await page.evaluate(() => {
    let cards = document.querySelectorAll('.g3-level-card');
    return Array.from(cards).map(c => window.getComputedStyle(c).opacity);
  });

  console.log({ opacities1, opacities2, opacities3 });
  await browser.close();
})();
