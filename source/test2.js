import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  // Test desktop
  await page.setViewport({ width: 1600, height: 900 });
  await page.goto('http://localhost:4173/group3/home/?theme=dark', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1000));
  
  let h1 = await page.$('.sign .title');
  let rect = await h1.boundingBox();
  let text = await page.evaluate(el => el.innerText, h1);
  console.log('Desktop 1600x900 H1 Box:', rect);
  console.log('Desktop 1600x900 H1 Text:', text.replace(/\n/g, '\\n'));
  
  // Test mobile
  await page.setViewport({ width: 390, height: 844 });
  await page.goto('http://localhost:4173/group3/home/?theme=dark', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1000));
  
  h1 = await page.$('.sign .title');
  rect = await h1.boundingBox();
  text = await page.evaluate(el => el.innerText, h1);
  let style = await page.evaluate(el => window.getComputedStyle(el).fontSize, h1);
  console.log('Mobile 390x844 H1 Box:', rect, 'fontSize:', style);
  console.log('Mobile 390x844 H1 Text:', text.replace(/\n/g, '\\n'));
  
  await browser.close();
})();
