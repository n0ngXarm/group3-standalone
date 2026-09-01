import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const snap = async (w, h, theme, label) => {
    const page = await browser.newPage();
    await page.setViewport({ width: w, height: h });
    await page.goto(`http://localhost:4173/group3/home/?theme=${theme}`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: `/home/pisitpong/group3-standalone/.agents/report/home-${label}.png` });
    await page.close();
  };
  
  await snap(1920, 1080, 'dark', 'desktop-dark');
  await snap(1920, 1080, 'light', 'desktop-light');
  await snap(390, 844, 'dark', 'mobile-dark');
  
  await browser.close();
})();
