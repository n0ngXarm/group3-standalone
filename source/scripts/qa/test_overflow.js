import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 900 });
  await page.goto('http://localhost:4173/group3/home/levels/?theme=light', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1500));
  
  let overflowDetails = await page.evaluate(() => {
    let card = document.querySelector('.g3-level-card.is-active');
    let children = Array.from(card.querySelectorAll('*'));
    let overflowingChildren = children.filter(c => {
      let rect = c.getBoundingClientRect();
      let cardRect = card.getBoundingClientRect();
      return rect.bottom > cardRect.bottom || rect.top < cardRect.top;
    }).map(c => ({
      class: c.className,
      bottom: c.getBoundingClientRect().bottom,
      cardBottom: card.getBoundingClientRect().bottom
    }));
    return overflowingChildren;
  });
  console.log(overflowDetails);
  await browser.close();
})();
