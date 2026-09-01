import puppeteer from 'puppeteer';
(async () => {
  const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 900 });
  await page.goto('http://localhost:4173/group3/home/?theme=light', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1500));
  
  let layout = await page.evaluate(() => {
    let activeActor = document.querySelector('.g3-manga-actor.is-talking');
    let inactiveActor = document.querySelector('.g3-manga-actor.is-idle');
    let scene = document.querySelector('.g3-manga-viewport');
    
    return {
      activeHeight: activeActor ? activeActor.getBoundingClientRect().height : null,
      inactiveHeight: inactiveActor ? inactiveActor.getBoundingClientRect().height : null,
      sceneHeight: scene ? scene.getBoundingClientRect().height : null,
      activeRatio: (activeActor && scene) ? activeActor.getBoundingClientRect().height / scene.getBoundingClientRect().height : null,
      inactiveRatio: (inactiveActor && scene) ? inactiveActor.getBoundingClientRect().height / scene.getBoundingClientRect().height : null,
    };
  });
  console.log(layout);
  await browser.close();
})();
