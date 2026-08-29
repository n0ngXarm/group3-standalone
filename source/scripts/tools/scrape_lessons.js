import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  
  const levels = ['hsk1', 'hsk2', 'hsk3'];

  for (const level of levels) {
    await page.goto(`http://localhost:4173/group3/home/${level}/`, { waitUntil: 'networkidle0' });
    
    // Check for broken images in catalog
    const catalogImages = await page.evaluate(() => {
      const imgs = Array.from(document.querySelectorAll('img'));
      return imgs.map(i => ({ src: i.src, complete: i.complete, naturalWidth: i.naturalWidth }));
    });
    console.log(`[${level}] Catalog Images:`, catalogImages.filter(i => i.naturalWidth === 0));

    // Get text content to check for placeholders
    const textContent = await page.evaluate(() => document.body.innerText);
    if (textContent.includes('TODO') || textContent.includes('Lorem') || textContent.includes('placeholder')) {
      console.log(`[${level}] Found placeholder in catalog:`, textContent.substring(0, 100));
    }
    
    // Enter first lesson
    const primaryAction = await page.$('.g3-primary-action');
    if (primaryAction) {
      await primaryAction.click();
      await new Promise(r => setTimeout(r, 1500));
      
      const lessonText = await page.evaluate(() => document.body.innerText);
      const brokenImages = await page.evaluate(() => {
        const imgs = Array.from(document.querySelectorAll('img'));
        return imgs.map(i => ({ src: i.src, complete: i.complete, naturalWidth: i.naturalWidth })).filter(i => i.naturalWidth === 0);
      });
      
      console.log(`[${level}] Lesson Broken Images:`, brokenImages);
      
      // Look for specific issues
      const overlaps = await page.evaluate(() => {
        const elements = Array.from(document.querySelectorAll('*'));
        let overlapping = [];
        // simple heuristic: check if text elements are out of bounds or overlapping heavily
        for (let el of elements) {
          if (el.scrollHeight > el.clientHeight && getComputedStyle(el).overflow !== 'hidden') {
            overlapping.push({ tag: el.tagName, class: el.className, text: el.innerText.substring(0,20), issue: 'overflow' });
          }
        }
        return overlapping;
      });
      console.log(`[${level}] Overflow/Overlap heuristics:`, overlaps);
      
      // Go to vocabulary
      const tabs = await page.$$('.g3-catalog-tabs button');
      if (tabs.length > 1) {
          await tabs[1].click(); // Vocabulary tab
          await new Promise(r => setTimeout(r, 1000));
          const vocabText = await page.evaluate(() => document.body.innerText);
          if (vocabText.includes('undefined') || vocabText.includes('null')) {
              console.log(`[${level}] Found undefined/null in vocab!`);
          }
      }
    }
  }
  
  await browser.close();
})();
