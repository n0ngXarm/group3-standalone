import puppeteer from 'puppeteer-core';
(async () => {
  const browser = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  await page.goto('http://localhost:4178/group3/home/hsk1/lessons/lesson-01/scenes/scene-01/?theme=dark');
  await new Promise(r => setTimeout(r, 2000));
  let url = page.url();
  let content = await page.content();
  console.log("FINAL URL:", url);
  console.log("RENDERED HOME?", content.includes("g3-home"));
  
  await browser.close();
})();
