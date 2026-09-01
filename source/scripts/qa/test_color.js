import puppeteer from 'puppeteer';
(async () => {
  const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.goto('http://localhost:4173/group3/home/?theme=light', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1000));
  let vars = await page.evaluate(() => {
    let el = document.querySelector('.g3-home-meta');
    let s = window.getComputedStyle(el);
    return {
      color: s.color,
      g3Gold: s.getPropertyValue('--g3-gold'),
      accentGold: s.getPropertyValue('--color-accent-gold')
    };
  });
  console.log(vars);
  await browser.close();
})();
