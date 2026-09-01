import puppeteer from 'puppeteer-core';
(async () => {
  const browser = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  await page.goto('http://localhost:4178/group3/');
  const result = await page.evaluate(async () => {
    const mod = await import('/group3/src/surfaces/group-3-8104/routing/routes.js');
    return mod.routeFromLocation({ pathname: '/group3/home/hsk1/lessons/lesson-01/scenes/scene-01/' });
  });
  console.log("ROUTE:", result);
  await browser.close();
})();
