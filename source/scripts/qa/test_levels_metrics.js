import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 900 });
  await page.goto('http://localhost:4173/group3/home/levels/?theme=light', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1500));
  
  let metrics = await page.evaluate(() => {
    let card = document.querySelector('.g3-level-card.is-active');
    if (!card) return null;
    let bg = card.querySelector('.g3-level-card-background');
    let actor = card.querySelector('.g3-actor-talk');
    let content = card.querySelector('.g3-level-card-content');
    let cta = card.querySelector('.g3-primary-action');
    let title = card.querySelector('.g3-level-card-title');
    let desc = card.querySelector('.g3-level-card-desc');
    let scrim = card.querySelector('.g3-level-card-scrim');
    
    const serializeRect = (rect) => rect ? { x: rect.x, y: rect.y, width: rect.width, height: rect.height } : null;
    
    return {
      cardRect: serializeRect(card.getBoundingClientRect()),
      actorRect: serializeRect(actor ? actor.getBoundingClientRect() : null),
      contentRect: serializeRect(content ? content.getBoundingClientRect() : null),
      ctaRect: serializeRect(cta ? cta.getBoundingClientRect() : null),
      titleColor: window.getComputedStyle(title).color,
      titleFontSize: window.getComputedStyle(title).fontSize,
      descColor: window.getComputedStyle(desc).color,
      descFontSize: window.getComputedStyle(desc).fontSize,
      bgFilter: window.getComputedStyle(bg).filter,
      scrimBg: window.getComputedStyle(scrim).backgroundImage,
      isOverflowing: card.scrollHeight > card.clientHeight,
      cardScrollHeight: card.scrollHeight,
      cardClientHeight: card.clientHeight
    };
  });
  console.log(JSON.stringify(metrics, null, 2));
  await browser.close();
})();
