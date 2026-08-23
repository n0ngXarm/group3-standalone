import puppeteer from 'puppeteer';
(async () => {
  const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 900 });
  await page.goto('http://localhost:4173/group3/home/?theme=light', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1000));
  
  await page.addStyleTag({content: `
    .g3-home.is-single-screen .g3-hero-copy .g3-home-lead {
      font-size: clamp(1.4rem, 2vw, 1.75rem) !important;
      font-weight: 600 !important;
      line-height: 1.3 !important;
      letter-spacing: -0.01em !important;
    }
    .g3-home.is-single-screen .g3-hero-copy .g3-home-expl {
      font-size: clamp(1.15rem, 1.5vw, 1.25rem) !important;
      font-weight: 400 !important;
      line-height: 1.5 !important;
      letter-spacing: 0.01em !important;
      opacity: 0.85 !important;
    }
    .g3-home.is-single-screen .g3-hero-copy .g3-home-meta {
      font-size: clamp(0.95rem, 1.2vw, 1.05rem) !important;
      font-weight: 600 !important;
      letter-spacing: 0.03em !important;
    }
    
    .g3-home-cta-primary {
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      gap: 0.5rem !important;
      text-align: center !important;
      padding-top: 0 !important;
      padding-bottom: 0 !important;
    }
    .g3-home-cta-primary i {
      transform: translateY(1px);
    }
  `});
  
  await new Promise(r => setTimeout(r, 300));

  let layout = await page.evaluate(() => {
    let lead = window.getComputedStyle(document.querySelector('.g3-home-lead'));
    let expl = window.getComputedStyle(document.querySelector('.g3-home-expl'));
    let btn = window.getComputedStyle(document.querySelector('.g3-home-cta-primary'));
    return {
      leadSize: lead.fontSize,
      explSize: expl.fontSize,
      btnDisplay: btn.display
    };
  });
  console.log(layout);
  await browser.close();
})();
