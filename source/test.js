import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto('http://localhost:4173/group3/home/?theme=dark', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1500));
  
  const el = await page.$('.sign-wrap');
  if (el) {
    const box = await el.boundingBox();
    console.log('Bounding Box:', box);
    
    const style = await page.evaluate(e => {
        const s = window.getComputedStyle(e);
        return { display: s.display, visibility: s.visibility, opacity: s.opacity, zIndex: s.zIndex, width: s.width, height: s.height };
    }, el);
    console.log('Styles:', style);
  } else {
    console.log('Hanging sign not found in DOM!');
  }
  
  const h1 = await page.$('h1');
  if (h1) {
    const box2 = await h1.boundingBox();
    console.log('H1 Box:', box2);
    const style2 = await page.evaluate(e => {
        const s = window.getComputedStyle(e);
        return { display: s.display, visibility: s.visibility, opacity: s.opacity, text: e.innerText };
    }, h1);
    console.log('H1 Styles:', style2);
  } else {
    console.log('H1 not found!');
  }
  
  await browser.close();
})();
