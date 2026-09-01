const puppeteer = require('puppeteer');
async function check() {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.goto('http://localhost:4173/group3/home/hsk1/?summary-dev=hsk1');
  await new Promise(r => setTimeout(r, 2000));
  const el = await page.$('.g3-learning-summary');
  if (el) console.log("FOUND LEARNING SUMMARY");
  else {
    const el2 = await page.$('.g3-home-hero');
    if (el2) console.log("FOUND HOME");
    else {
      const el3 = await page.$('.g3-catalog');
      if (el3) console.log("FOUND CATALOG");
      else console.log("FOUND NOTHING KNOWN");
    }
  }
  await browser.close();
}
check();
