import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  
  page.on('console', msg => {
    if (msg.type() === 'error' && !msg.text().includes('favicon')) console.log('PAGE ERROR:', msg.text());
  });
  page.on('pageerror', error => {
    console.log('PAGE EXCEPTION:', error.message);
  });
  page.on('response', response => {
    if (!response.ok() && response.status() !== 204 && !response.url().includes('favicon')) {
      console.log('NETWORK ERROR:', response.status(), response.url());
    }
  });

  const levels = ['hsk1', 'hsk2', 'hsk3'];
  for (const level of levels) {
    await page.goto(`http://localhost:4173/group3/home/${level}/`, { waitUntil: 'networkidle0' });
    const primaryAction = await page.$('.g3-primary-action');
    if (primaryAction) {
      await primaryAction.click();
      await new Promise(r => setTimeout(r, 1500));
      
      const tabs = await page.$$('.g3-reader-tabs a');
      if (tabs.length > 2) {
          // Go to vocabulary
          await tabs[1].click();
          await new Promise(r => setTimeout(r, 1000));
          // click all play buttons in vocab
          const vocabBtns = await page.$$('.g3-vocabulary-ledger button');
          if (vocabBtns.length > 0) {
              await vocabBtns[0].click(); // click first vocab play
              await new Promise(r => setTimeout(r, 500));
          }
          
          // Go to scene
          await tabs[2].click();
          await new Promise(r => setTimeout(r, 1500));
          
          const playBtns = await page.$$('.g3-reader-controls button');
          for (const btn of playBtns) {
            const text = await page.evaluate(el => el.innerText, btn);
            if (text.includes('Play') || text.includes('เล่น') || text.includes('▶')) {
                await btn.click();
                await new Promise(r => setTimeout(r, 500));
            }
          }
      }
    }
  }
  
  await browser.close();
})();
