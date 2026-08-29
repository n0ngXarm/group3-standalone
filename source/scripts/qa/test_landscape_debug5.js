import puppeteer from 'puppeteer';
(async () => {
  const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 844, height: 390 });
  await page.goto('http://localhost:4173/group3/home/?theme=light', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1000));
  
  let layout = await page.evaluate(() => {
    let stage = document.querySelector('.g3-manga-stage');
    return {
      stageParentClass: stage ? stage.parentElement.className : null,
      stageTop: stage ? stage.getBoundingClientRect().top : null
    };
  });
  console.log(layout);
  await browser.close();
})();
