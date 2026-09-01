const puppeteer = require('puppeteer');
async function check() {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.goto('http://localhost:4173/group3/home/hsk1/?summary-dev=hsk1');
  await new Promise(r => setTimeout(r, 2000));
  const html = await page.content();
  console.log(html.substring(0, 1000));
  await browser.close();
}
check();
