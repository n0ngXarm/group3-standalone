import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto(`http://localhost:4173/group3/home/?theme=dark`, { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: `/home/pisitpong/group3-standalone/.agents/report/home-01-market.png` });
  
  await page.click('.g3-manga-arrow.is-next');
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: `/home/pisitpong/group3-standalone/.agents/report/home-02-campus.png` });
  
  await page.click('.g3-manga-arrow.is-next');
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: `/home/pisitpong/group3-standalone/.agents/report/home-03-restaurant.png` });
  
  await page.click('.g3-manga-arrow.is-next');
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: `/home/pisitpong/group3-standalone/.agents/report/home-04-train.png` });
  
  await page.click('.g3-manga-arrow.is-next');
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: `/home/pisitpong/group3-standalone/.agents/report/home-05-dumplings.png` });

  await page.close();
  await browser.close();
})();
