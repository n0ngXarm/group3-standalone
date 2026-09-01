import puppeteer from 'puppeteer';

async function testRoutes() {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  
  let errors = [];

  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });

  const routes = [
    { name: 'Home', path: '' },
    { name: 'Levels', path: 'home/levels' },
    { name: 'Level 1 Catalog', path: 'home/hsk1' },
    { name: 'Lesson Contents', path: 'home/hsk1/lessons/lesson-01/contents' },
    { name: 'Vocabulary', path: 'home/hsk1/lessons/lesson-01/vocabulary' },
    { name: 'Reader', path: 'home/hsk1/lessons/lesson-01/scenes/scene-01' },
    { name: 'Practice', path: 'home/hsk1/practice' },
    { name: 'Repeat Sentence', path: 'home/hsk1/practice/repeat-sentence' },
    { name: 'Summary', path: 'home/hsk1/practice/summary' }
  ];

  for (const route of routes) {
    console.log(`Checking ${route.name}...`);
    await page.goto(`http://127.0.0.1:4173/${route.path}`);
    await page.waitForSelector('body');
    
    // Check horizontal overflow
    const hasOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });

    if (hasOverflow) {
      console.log(`❌ ${route.name} has horizontal overflow!`);
    } else {
      console.log(`✅ ${route.name} layout OK.`);
    }
  }

  if (errors.length > 0) {
    console.log('Console Errors:', errors);
  } else {
    console.log('✅ No console errors.');
  }

  await browser.close();
}

testRoutes().catch(console.error);
