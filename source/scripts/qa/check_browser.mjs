import puppeteer from 'puppeteer-core';
(async () => {
  const browser = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  page.on('response', response => {
    if (response.status() >= 400) {
      console.log('FAILED URL:', response.url(), response.status());
    }
  });
  await page.goto('http://localhost:4178/group3/home/hsk1/lessons/lesson-01/scenes/scene-01/?theme=dark');
  await page.waitForSelector('.g3-briefing-manual');
  console.log('Clicking briefing manual...');
  await page.click('.g3-briefing-manual');
  try {
    await page.waitForSelector('.g3-dialogue-line', { timeout: 5000 });
    console.log('Found dialogue line!');
  } catch (e) {
    console.log('Failed to find dialogue line:', e.message);
  }
  await new Promise(r => setTimeout(r, 2000));
  await browser.close();
})();
