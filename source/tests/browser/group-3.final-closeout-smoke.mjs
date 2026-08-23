import assert from "node:assert/strict";
import puppeteer from "puppeteer";

const base = process.env.G3_BASE_URL || "http://127.0.0.1:4178/group3";
const browser = await puppeteer.launch({
  args: ["--no-sandbox", "--use-fake-ui-for-media-stream", "--use-fake-device-for-media-stream"],
  headless: true,
});

async function runTests() {
  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 768 });
  const failures = [];

  try {
    // 1 & 2. Registration stores temporary learner and replaces history
    await page.goto(`${base}/home/`, { waitUntil: "networkidle0" });
    await page.click('.g3-home-cta-primary'); // open modal
    await page.waitForSelector('#g3-learner-name', { visible: true });
    await page.type('#g3-learner-name', 'Release Tester');
    await page.click('form.g3-register-modal button[type="submit"], form.g3-register-modal button:not(.g3-register-close)');
    await page.waitForNavigation({ waitUntil: "networkidle0" });

    let url = page.url();
    if (!url.includes('/home/levels/')) throw new Error(`Expected /home/levels/, got ${url}`);

    // Check learner in sessionStorage
    const learnerName = await page.evaluate(() => sessionStorage.getItem('huayun_learner_name'));
    if (learnerName !== 'Release Tester') throw new Error(`Session storage learner name is ${learnerName}`);

    // 6. Learner appears in Topbar
    let topbarName = await page.$eval('.g3-learner-identity b', el => el.textContent);
    if (topbarName !== 'Release Tester') throw new Error(`Topbar shows ${topbarName}`);

    // 3. HSK1 Back -> Levels
    await page.goto(`${base}/home/hsk1/`, { waitUntil: "networkidle0" });
    await page.click('.g3-back-link');
    await page.waitForNavigation({ waitUntil: "networkidle0" });
    if (!page.url().includes('/home/levels/')) throw new Error(`HSK1 Back went to ${page.url()}`);

    // 4. HSK2 Back -> Levels
    await page.goto(`${base}/home/hsk2/`, { waitUntil: "networkidle0" });
    await page.click('.g3-back-link');
    await page.waitForNavigation({ waitUntil: "networkidle0" });
    if (!page.url().includes('/home/levels/')) throw new Error(`HSK2 Back went to ${page.url()}`);

    // 5. HSK3 Back -> Levels
    await page.goto(`${base}/home/hsk3/`, { waitUntil: "networkidle0" });
    await page.click('.g3-back-link');
    await page.waitForNavigation({ waitUntil: "networkidle0" });
    if (!page.url().includes('/home/levels/')) throw new Error(`HSK3 Back went to ${page.url()}`);

    // 7. Learner appears in Summary
    await page.goto(`${base}/home/hsk1/practice/summary/`, { waitUntil: "networkidle0" });
    const summaryName = await page.$eval('.g3-learner-name-text strong', el => el.textContent);
    if (summaryName !== 'Release Tester') throw new Error(`Summary shows ${summaryName}`);

    // 8. Normal navigation preserves learner
    await page.goto(`${base}/home/hsk1/practice/repeat-sentence/`, { waitUntil: "networkidle0" });
    topbarName = await page.$eval('.g3-learner-identity b', el => el.textContent);
    if (topbarName !== 'Release Tester') throw new Error('Learner lost during navigation');

    // 12. Hanzi/Pinyin/Thai Practice contracts remain intact
    // In Repeat Sentence:
    const hanzi = await page.$eval('h2[lang="zh-CN"]', el => el.textContent);
    const pinyin = await page.$eval('.g3-practice-pinyin', el => el.textContent);
    if (!hanzi || !pinyin) throw new Error('Repeat Sentence missing Hanzi or Pinyin');

    // 9. Accidental Home navigation redirects Levels
    await page.goto(`${base}/home/`, { waitUntil: "networkidle0" });
    // Should immediately redirect back to levels since active session exists
    if (!page.url().includes('/home/levels/')) throw new Error(`Accidental home navigation ended up at ${page.url()}`);

    // 10. Explicit Logo Home is allowed
    await page.click('.g3-brand'); // Logo
    // No wait for navigation, single page app handles popstate
    await page.waitForFunction(() => window.location.pathname.endsWith('/home/'), { timeout: 2000 });
    if (!page.url().includes('/home/')) throw new Error('Logo click did not go to Home');
    
    const clearedSession = await page.evaluate(() => sessionStorage.getItem('huayun_learner_name'));
    if (clearedSession) throw new Error('Logo click did not clear session');

    // 11. New learner does not inherit old result identity
    await page.click('.g3-home-cta-primary'); // open modal
    await page.waitForSelector('#g3-learner-name', { visible: true });
    await page.type('#g3-learner-name', 'Manager Test');
    await page.click('form.g3-register-modal button[type="submit"]');
    await page.waitForNavigation({ waitUntil: "networkidle0" });

    await page.goto(`${base}/home/hsk1/practice/summary/`, { waitUntil: "networkidle0" });
    const newSummaryName = await page.$eval('.g3-learner-name-text strong', el => el.textContent);
    if (newSummaryName !== 'Manager Test') throw new Error(`Summary shows old/wrong identity: ${newSummaryName}`);

  } catch (err) {
    failures.push(err.message);
  } finally {
    await browser.close();
  }

  if (failures.length > 0) {
    console.error("Test failures:", failures);
    process.exit(1);
  } else {
    console.log("All tests passed.");
  }
}

runTests();
