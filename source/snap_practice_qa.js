import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  
  const viewports = [
    { w: 1920, h: 1080 },
    { w: 1600, h: 900 },
    { w: 1440, h: 900 },
    { w: 1366, h: 768 },
    { w: 1280, h: 800 },
    { w: 1024, h: 768 },
    { w: 768, h: 1024 },
    { w: 390, h: 844 },
    { w: 844, h: 390 },
  ];
  
  const themes = ['light', 'dark'];
  const languages = ['th', 'zh', 'en'];
  
  let results = [];

  for (const vp of viewports) {
    for (const theme of themes) {
      // For all resolutions, do TH. For 1600 and 390, do all languages.
      let langsToTest = ['th'];
      if (vp.w === 1600 || vp.w === 390) {
        langsToTest = languages;
      }
      
      for (const lang of langsToTest) {
        const page = await browser.newPage();
        await page.setViewport({ width: vp.w, height: vp.h, deviceScaleFactor: 1 });
        // The language might need to be set via localStorage or query param depending on Group3 architecture.
        // Usually, `?lang=en` or `&language=en` or `&hl=en`. Let's just use `?theme=${theme}&hl=${lang}&language=${lang}&lang=${lang}` to be safe.
        await page.goto(`http://localhost:4173/group3/home/hsk1/practice/?theme=${theme}&lang=${lang}`, { waitUntil: 'networkidle0' });
        
        // Ensure fonts are loaded and animations settled
        await new Promise(r => setTimeout(r, 1200));

        let metrics = await page.evaluate(() => {
           let cards = document.querySelectorAll('.g3-practice-card');
           let grid = document.querySelector('.g3-practice-grid');
           let cols = 1;
           if (grid) {
             let style = window.getComputedStyle(grid);
             cols = style.gridTemplateColumns.split(' ').length;
           }
           return {
             innerWidth: window.innerWidth,
             innerHeight: window.innerHeight,
             devicePixelRatio: window.devicePixelRatio,
             scrollWidth: document.documentElement.scrollWidth,
             scrollHeight: document.documentElement.scrollHeight,
             columns: cols,
           };
        });
        
        const shotName = `qa-${vp.w}x${vp.h}-${theme}-${lang}`;
        await page.screenshot({ path: `/home/pisitpong/.gemini/antigravity-cli/brain/1ea123d1-9a08-4be6-be1b-e54287f6b1e1/${shotName}.png`, fullPage: false });
        
        results.push({
          name: shotName,
          ...metrics
        });
        
        console.log(`Captured ${shotName} -> cols: ${metrics.columns}, overflowX: ${metrics.scrollWidth > metrics.innerWidth}`);
        await page.close();
      }
    }
  }
  
  console.log("FINAL_METRICS=" + JSON.stringify(results));
  await browser.close();
})();
