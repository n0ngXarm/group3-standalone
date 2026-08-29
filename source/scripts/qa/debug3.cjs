const puppeteer = require('puppeteer');
async function check() {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  page.on('console', msg => console.log('LOG:', msg.text()));
  page.on('pageerror', err => console.log('ERR:', err.message));
  await page.goto('http://localhost:4173/group3/home/hsk1/?summary-dev=hsk1');
  await new Promise(r => setTimeout(r, 2000));
  const html = await page.$eval('body', b => b.innerHTML);
  console.log(html);
  await browser.close();
}
check();
