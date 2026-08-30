import puppeteer from 'puppeteer';

async function testRoutes() {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();

  const routes = [
    { name: 'Image Description', path: 'home/hsk1/practice/image-description' },
    { name: 'Question Response', path: 'home/hsk1/practice/question-response' }
  ];

  for (const route of routes) {
    console.log(`Checking ${route.name}...`);
    await page.goto(`http://127.0.0.1:4173/${route.path}`);
    await page.waitForSelector('body');
    const hasOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    console.log(hasOverflow ? `❌ Overflow in ${route.name}` : `✅ ${route.name} OK`);
  }

  await browser.close();
}

testRoutes().catch(console.error);
