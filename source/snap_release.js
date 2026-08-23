import puppeteer from 'puppeteer';
import fs from 'fs';

(async () => {
  const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const viewports = [
    { name: '1366x768', width: 1366, height: 768 },
    { name: '1600x900', width: 1600, height: 900 },
    { name: '1024x768', width: 1024, height: 768 },
    { name: '390x844', width: 390, height: 844 },
  ];
  
  const levels = ['hsk1', 'hsk2', 'hsk3'];

  if (!fs.existsSync('release_qa')) fs.mkdirSync('release_qa');

  for (const vp of viewports) {
    const page = await browser.newPage();
    await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: 1 });
    
    // Visit each HSK level's catalog
    for (const level of levels) {
      await page.goto(`http://localhost:4173/group3/home/${level}/`, { waitUntil: 'networkidle0' });
      await new Promise(r => setTimeout(r, 1000));
      await page.screenshot({ path: `release_qa/${vp.name}-${level}-catalog.png` });
      
      // Click the primary action to enter lesson (overview)
      const primaryAction = await page.$('.g3-primary-action');
      if (primaryAction) {
        await primaryAction.click();
        await new Promise(r => setTimeout(r, 1500));
        await page.screenshot({ path: `release_qa/${vp.name}-${level}-overview.png` });
        
        // Let's also grab the contents and vocabulary pages for 1366
        if (vp.name === '1366x768' && level === 'hsk1') {
            const tabs = await page.$$('.g3-reader-tabs a');
            for (let i=0; i<tabs.length; i++) {
                await tabs[i].click();
                await new Promise(r => setTimeout(r, 1000));
                await page.screenshot({ path: `release_qa/${vp.name}-${level}-tab-${i}.png` });
            }
        }

      }
    }
    await page.close();
  }
  
  await browser.close();
})();
