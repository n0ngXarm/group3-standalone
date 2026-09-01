import puppeteer from 'puppeteer';
(async () => {
  const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 900 });
  await page.goto('http://localhost:4173/group3/home/?theme=light', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1000));
  
  await page.addStyleTag({content: `
    .g3-home.is-single-screen .g3-home-copy-zone { top: 46.5% !important; }
    .g3-home.is-single-screen .g3-home-cta-row { top: 71.5% !important; }
    .g3-home.is-single-screen .g3-manga-actors-layer { padding-bottom: 240px !important; }
    .g3-home.is-single-screen .g3-manga-actor-label { top: -3.5rem !important; }
    
    .g3-manga-actor.is-idle { opacity: 1 !important; filter: none !important; }
    .g3-manga-actor.is-idle .g3-manga-actor-sprite,
    .g3-manga-actor.is-idle .g3-manga-actor-frames {
      opacity: 0.75 !important;
      filter: brightness(0.85) saturate(0.85) blur(0) !important;
    }
    .g3-home.is-single-screen .g3-manga-actor.is-idle .g3-manga-actor-label {
      background: rgba(20, 20, 20, 0.85) !important;
      color: #ffffff !important;
      border-color: rgba(255,255,255,0.15) !important;
      opacity: 0.9 !important;
    }
  `});
  
  await new Promise(r => setTimeout(r, 300));

  let layout = await page.evaluate(() => {
    let sign = document.querySelector('.sign-wrap');
    let copy = document.querySelector('.g3-home-copy-zone');
    let cta = document.querySelector('.g3-home-cta-row');
    let panel = document.querySelector('.g3-hero-copy');
    
    let layer = document.querySelector('.g3-manga-actors-layer');
    let subtitle = document.querySelector('.g3-manga-subtitle-box');
    
    let actorSprite = document.querySelector('.g3-manga-actor.is-idle .g3-manga-actor-sprite') || document.querySelector('.g3-manga-actor.is-idle .g3-manga-actor-frames');
    let activeActorSprite = document.querySelector('.g3-manga-actor.is-talking .g3-manga-actor-sprite') || document.querySelector('.g3-manga-actor.is-talking .g3-manga-actor-frames');
    
    let signRect = sign.getBoundingClientRect();
    let copyRect = copy.getBoundingClientRect();
    let ctaRect = cta.getBoundingClientRect();
    let panelRect = panel.getBoundingClientRect();
    
    let subtitleRect = subtitle.getBoundingClientRect();
    let actorRect = actorSprite ? actorSprite.getBoundingClientRect() : null;
    let activeActorRect = activeActorSprite ? activeActorSprite.getBoundingClientRect() : null;

    let maxActorBottom = Math.max(
      actorRect ? actorRect.bottom : 0,
      activeActorRect ? activeActorRect.bottom : 0
    );
    
    return {
      left: {
        signBottomToCopyTop: copyRect.top - signRect.bottom,
        copyBottomToCtaTop: ctaRect.top - copyRect.bottom,
        ctaBottomToHeroBottom: panelRect.bottom - ctaRect.bottom,
      },
      right: {
        actorVisibleBottom: maxActorBottom,
        dialogueTop: subtitleRect.top,
        overlap: maxActorBottom - subtitleRect.top
      }
    };
  });
  console.log(JSON.stringify(layout, null, 2));
  await browser.close();
})();
