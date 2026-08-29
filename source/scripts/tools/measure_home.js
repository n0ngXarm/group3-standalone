import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const measure = async (w, h, theme) => {
    const page = await browser.newPage();
    await page.setViewport({ width: w, height: h });
    await page.goto(`http://localhost:4173/group3/home/?theme=${theme}`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1000));
    
    const scrollHeight = await page.evaluate(() => document.documentElement.scrollHeight);
    const innerHeight = await page.evaluate(() => window.innerHeight);
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const innerWidth = await page.evaluate(() => window.innerWidth);
    
    console.log(`Viewport: ${w}x${h} | Theme: ${theme}`);
    console.log(`Scroll Height: ${scrollHeight} | Inner Height: ${innerHeight} -> ${scrollHeight <= innerHeight + 2 ? 'PASS' : 'FAIL'}`);
    console.log(`Scroll Width: ${scrollWidth} | Inner Width: ${innerWidth} -> ${scrollWidth <= innerWidth + 2 ? 'PASS' : 'FAIL'}`);
    await page.close();
  };
  
  await measure(1920, 1080, 'dark');
  await measure(390, 844, 'light');
  await browser.close();
})();
