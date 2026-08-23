import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  await page.setViewport({ width: 1600, height: 900 });
  await page.goto('http://localhost:4173/group3/home/?theme=dark', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1000));
  
  let btn = await page.$('.g3-home-cta-primary');
  let rect = await btn.boundingBox();
  let text = await page.evaluate(el => el.innerText, btn);
  console.log('Desktop 1600x900 Button Box:', rect);
  console.log('Desktop 1600x900 Button Text:', text.replace(/\n/g, '\\n'));
  
  await browser.close();
})();
