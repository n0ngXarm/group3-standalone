import puppeteer from 'puppeteer';
(async () => {
  const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 900 });
  await page.goto('http://localhost:4173/group3/home/?theme=light', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1500));
  
  let layout = await page.evaluate(() => {
    let cta = document.querySelector('.g3-home-cta-primary');
    let textNode = Array.from(cta.childNodes).find(n => n.nodeType === 3);
    let icon = cta.querySelector('i');
    
    // We can't directly measure textNode without a span, but we can measure the first child and last child bounding box
    let range = document.createRange();
    range.selectNodeContents(cta);
    let textRect = range.getBoundingClientRect();
    let ctaRect = cta.getBoundingClientRect();
    
    return {
      ctaCenterX: ctaRect.left + ctaRect.width/2,
      textCenterX: textRect.left + textRect.width/2,
      deltaX: Math.abs((ctaRect.left + ctaRect.width/2) - (textRect.left + textRect.width/2))
    };
  });
  console.log(layout);
  await browser.close();
})();
