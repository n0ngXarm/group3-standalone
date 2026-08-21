import assert from "node:assert/strict";

const port = Number(process.env.G3_CDP_PORT || 9223);
const pageUrl = process.env.G3_HARNESS_URL || "http://127.0.0.1:4179/group3/tests/browser/group-3.game-harness.html";
const targets = await fetch(`http://127.0.0.1:${port}/json/list`).then((response) => response.json());
const target = targets.find((item) => item.type === "page");
assert.ok(target?.webSocketDebuggerUrl, "Chromium page target is unavailable");

let nextId = 1;
const pending = new Map();
const browserEvents = [];
const socket = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  socket.addEventListener("open", resolve, { once: true });
  socket.addEventListener("error", reject, { once: true });
});
socket.addEventListener("message", (event) => {
  const message = JSON.parse(event.data);
  if (message.id) {
    const waiter = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) waiter.reject(new Error(message.error.message));
    else waiter.resolve(message.result);
    return;
  }
  if (["Runtime.exceptionThrown", "Log.entryAdded", "Network.loadingFailed"].includes(message.method)) browserEvents.push(message);
});

function send(method, params = {}) {
  const id = nextId;
  nextId += 1;
  socket.send(JSON.stringify({ id, method, params }));
  return new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
}

async function evaluate(expression) {
  const result = await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
  return result.result.value;
}

async function waitFor(selector, timeout = 8_000) {
  return evaluate(`new Promise((resolve, reject) => {
    const end = performance.now() + ${timeout};
    const check = () => {
      if (document.querySelector(${JSON.stringify(selector)})) resolve(true);
      else if (performance.now() >= end) reject(new Error("Missing selector: ${selector}"));
      else setTimeout(check, 25);
    };
    check();
  })`);
}

async function click(selector) {
  await evaluate(`(() => {
    const element = document.querySelector(${JSON.stringify(selector)});
    if (!element) throw new Error("Missing click target: ${selector}");
    element.click();
  })()`);
}

async function touch(selector) {
  const point = await evaluate(`(() => {
    const rect = document.querySelector(${JSON.stringify(selector)}).getBoundingClientRect();
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
  })()`);
  const touchPoint = { x: point.x, y: point.y, radiusX: 2, radiusY: 2, force: 1, id: 1 };
  await send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [touchPoint] });
  await send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
}

async function sleep(milliseconds) {
  await evaluate(`new Promise((resolve) => setTimeout(resolve, ${milliseconds}))`);
}

async function setGame(slug) {
  await evaluate(`window.__G3_TEST_API__.setActiveGame(${JSON.stringify(slug)})`);
  await waitFor(".g3-game-intro");
}

async function startGame() {
  await click(".g3-game-intro .g3-game-primary");
  try {
    await waitFor(".g3-game-hud");
  } catch (error) {
    const diagnostic = await evaluate("({ text: document.body.innerText, errors: window.__g3BrowserErrors })");
    throw new Error(`${error.message}\n${JSON.stringify(diagnostic)}`);
  }
}

async function exitGame() {
  await click(".g3-game-exit");
  await waitFor(".g3-arcade-grid");
  await sleep(30);
}

async function assertManualAndVisibilityPause() {
  await click(".g3-game-pause");
  await waitFor(".g3-game-hud-title strong");
  assert.equal(await evaluate("document.querySelector('.g3-game-pause').getAttribute('aria-pressed')"), "true");
  await evaluate("Object.defineProperty(document, 'hidden', { configurable: true, value: true }); document.dispatchEvent(new Event('visibilitychange'))");
  await evaluate("Object.defineProperty(document, 'hidden', { configurable: true, value: false }); document.dispatchEvent(new Event('visibilitychange'))");
  assert.equal(await evaluate("document.querySelector('.g3-game-pause').getAttribute('aria-pressed')"), "true", "visibility resume cleared manual pause");
  await click(".g3-game-pause");
  assert.equal(
    await evaluate("document.querySelector('.g3-game-pause').getAttribute('aria-pressed')"),
    "false",
    JSON.stringify(await evaluate("({ active: document.activeElement?.className, pressed: document.querySelector('.g3-game-pause').getAttribute('aria-pressed') })")),
  );
}

async function solveCardGame() {
  await evaluate(`(async () => {
    const cards = [...document.querySelectorAll('.g3-match-card')];
    const chinese = new Map();
    const thai = new Map();
    for (const card of cards) {
      const back = card.querySelector('.g3-match-card-back');
      const content = back.querySelector('span').childNodes[0].textContent.trim();
      if (back.classList.contains('type-zh')) chinese.set(content, card);
      else thai.set(content, card);
    }
    const words = window.__G3_TEST_API__.lesson.vocabulary;
    for (const word of words) {
      if (!chinese.has(word.hanzi) || !thai.has(word.th)) continue;
      chinese.get(word.hanzi).click();
      thai.get(word.th).click();
      await new Promise((resolve) => setTimeout(resolve, 575));
    }
  })()`);
  await waitFor(".g3-results");
}

async function smokeViewport(width, height) {
  await send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile: width <= 480 });
  for (const slug of ["vocab-blitz", "card-frenzy", "sound-sprint", "pinyin-dash"]) {
    process.stdout.write(`smoke ${width}x${height} ${slug}\n`);
    await setGame(slug);
    await startGame();
    await assertManualAndVisibilityPause();
    await exitGame();
  }
}

try {
  await Promise.all(["Page.enable", "Runtime.enable", "Log.enable", "Network.enable"].map((method) => send(method)));
  await send("Page.navigate", { url: pageUrl });
  await waitFor(".g3-arcade-grid", 15_000);
  await smokeViewport(1280, 800);
  await smokeViewport(360, 740);

  await send("Emulation.setDeviceMetricsOverride", { width: 1280, height: 800, deviceScaleFactor: 1, mobile: false });
  await setGame("pinyin-dash");
  await startGame();
  await evaluate("document.querySelector('.g3-game-pause').focus()");
  await send("Input.dispatchKeyEvent", { type: "keyDown", key: " ", code: "Space", windowsVirtualKeyCode: 32 });
  await send("Input.dispatchKeyEvent", { type: "keyUp", key: " ", code: "Space", windowsVirtualKeyCode: 32 });
  await waitFor(".g3-game-hud-title strong");
  await evaluate("window.__keyClicks = 0; document.querySelector('.g3-game-pause').addEventListener('click', () => { window.__keyClicks += 1; }, { once: true }); document.querySelector('.g3-game-pause').focus()");
  await send("Input.dispatchKeyEvent", { type: "keyDown", key: "Enter", code: "Enter", windowsVirtualKeyCode: 13, nativeVirtualKeyCode: 13, text: "\r", unmodifiedText: "\r" });
  await send("Input.dispatchKeyEvent", { type: "keyUp", key: "Enter", code: "Enter", windowsVirtualKeyCode: 13 });
  await sleep(30);
  assert.equal(await evaluate("document.querySelector('.g3-game-pause').getAttribute('aria-pressed')"), "false", `Enter clicks: ${await evaluate("window.__keyClicks")}`);
  await touch(".g3-game-pause");
  await sleep(30);
  await waitFor(".g3-game-hud-title strong");
  await touch(".g3-game-pause");
  assert.equal(await evaluate("document.querySelector('.g3-game-pause').getAttribute('aria-pressed')"), "false");
  await exitGame();

  await setGame("pinyin-dash");
  await startGame();
  const answer = await evaluate(`(() => {
    const hanzi = document.querySelector('.g3-game-hanzi').textContent.trim();
    return window.__G3_TEST_API__.lesson.vocabulary.find((word) => word.hanzi === hanzi).pinyin;
  })()`);
  await evaluate(`(() => { const button = [...document.querySelectorAll('.g3-game-option')].find((item) => item.textContent.trim() === ${JSON.stringify(answer)}); button.click(); button.click(); })()`);
  await sleep(800);
  assert.match(await evaluate("document.querySelector('.g3-game-hud-metrics').textContent"), /2\/15/, "rapid submit advanced more than one round");
  const timerBefore = await evaluate("Number(document.querySelector('[role=progressbar]').getAttribute('aria-valuenow'))");
  await sleep(1_200);
  const timerAfter = await evaluate("Number(document.querySelector('[role=progressbar]').getAttribute('aria-valuenow'))");
  assert.ok(timerAfter < timerBefore, `Pinyin timer did not continue after answer: ${timerBefore} -> ${timerAfter}`);

  await evaluate(`localStorage.setItem('huayun_g3_score_v2_hsk1_hsk1-l1_dash', JSON.stringify([{runId:'browser-score',name:'Learner',score:4321,stars:3,accuracy:100,date:'2026-08-21T00:00:00.000Z'}]))`);
  await exitGame();
  assert.match(await evaluate("document.querySelector('[data-game-id=pinyin-dash] .g3-arcade-card-score span:last-child').textContent"), /4,321/);

  await setGame("sound-sprint");
  await startGame();
  await evaluate("window.__g3Speech.speakCalls = 0; const speaker = document.querySelector('.g3-sprint-speaker'); speaker.click(); speaker.click()");
  await sleep(50);
  assert.equal(await evaluate("window.__g3Speech.speakCalls"), 1, "rapid Sound Sprint replay invoked duplicate speech");
  await click(".g3-game-option:not(:disabled)");
  await sleep(850);
  const soundTimerBefore = await evaluate("Number(document.querySelector('[role=progressbar]').getAttribute('aria-valuenow'))");
  await sleep(1_200);
  const soundTimerAfter = await evaluate("Number(document.querySelector('[role=progressbar]').getAttribute('aria-valuenow'))");
  assert.ok(soundTimerAfter < soundTimerBefore, `Sound timer did not continue after answer: ${soundTimerBefore} -> ${soundTimerAfter}`);
  await exitGame();

  await setGame("vocab-blitz");
  await startGame();
  await evaluate("Object.defineProperty(document, 'hidden', { configurable: true, value: true }); document.dispatchEvent(new Event('visibilitychange'))");
  const livesBefore = await evaluate("document.querySelector('.g3-game-hud-metrics').textContent");
  await sleep(5_300);
  assert.equal(await evaluate("document.querySelector('.g3-game-hud-metrics').textContent"), livesBefore, "Vocab Blitz expired while hidden");
  await evaluate("Object.defineProperty(document, 'hidden', { configurable: true, value: false }); document.dispatchEvent(new Event('visibilitychange'))");
  await exitGame();

  await setGame("card-frenzy");
  await startGame();
  for (let replay = 0; replay < 10; replay += 1) {
    await solveCardGame();
    if (replay < 9) {
      await click(".g3-results .g3-game-primary");
      await waitFor(".g3-game-intro");
      await startGame();
    }
  }
  await click(".g3-results .g3-game-secondary");
  await waitFor(".g3-arcade-grid");

  const baselineResources = await evaluate("window.__g3ResourceSnapshot()");
  await send("HeapProfiler.enable");
  await send("HeapProfiler.collectGarbage");
  const heapBaseline = (await send("Runtime.getHeapUsage")).usedSize;
  await send("Emulation.setCPUThrottlingRate", { rate: 4 });
  const slugs = ["vocab-blitz", "card-frenzy", "sound-sprint", "pinyin-dash"];
  for (const slug of slugs) {
    for (let cycle = 0; cycle < 25; cycle += 1) {
      await setGame(slug);
      await startGame();
      await exitGame();
    }
  }
  for (let cycle = 0; cycle < 50; cycle += 1) {
    await setGame(slugs[cycle % slugs.length]);
    await evaluate("window.__G3_TEST_API__.setActiveGame(null)");
    await waitFor(".g3-arcade-grid");
  }
  await setGame("pinyin-dash");
  await startGame();
  for (let cycle = 0; cycle < 20; cycle += 1) {
    await evaluate("Object.defineProperty(document, 'hidden', { configurable: true, value: true }); document.dispatchEvent(new Event('visibilitychange'))");
    await evaluate("Object.defineProperty(document, 'hidden', { configurable: true, value: false }); document.dispatchEvent(new Event('visibilitychange'))");
  }
  await exitGame();
  await send("Emulation.setCPUThrottlingRate", { rate: 1 });
  await sleep(100);
  const finalResources = await evaluate("window.__g3ResourceSnapshot()");
  assert.ok(finalResources.frames <= baselineResources.frames + 1, `rAF leak: ${baselineResources.frames} -> ${finalResources.frames}`);
  assert.ok(finalResources.timeouts <= baselineResources.timeouts + 2, `timer leak: ${baselineResources.timeouts} -> ${finalResources.timeouts}`);
  assert.equal(await evaluate("Boolean(speechSynthesis?.speaking || speechSynthesis?.pending)"), false);
  await send("HeapProfiler.collectGarbage");
  const heapFinal = (await send("Runtime.getHeapUsage")).usedSize;
  const heapLimit = Math.max(5 * 1024 * 1024, heapBaseline * 0.15);
  assert.ok(heapFinal - heapBaseline <= heapLimit, `heap grew ${heapFinal - heapBaseline} bytes (limit ${heapLimit})`);

  const pageErrors = await evaluate("window.__g3BrowserErrors");
  assert.deepEqual(pageErrors, []);
  const relevantEvents = browserEvents.filter((event) => {
    if (event.method === "Network.loadingFailed") return !event.params?.canceled;
    if (event.method === "Log.entryAdded") {
      const entry = event.params?.entry || {};
      return entry.level === "error" || /(?:React|Warning:)/.test(entry.text || "");
    }
    return true;
  });
  assert.deepEqual(relevantEvents, []);

  process.stdout.write(JSON.stringify({
    desktopAndMobileGames: 8,
    pinyinTimer: [timerBefore, timerAfter],
    soundTimer: [soundTimerBefore, soundTimerAfter],
    startExitCycles: 100,
    continuousSwitches: 50,
    completeReplayCycles: 10,
    keyboardAndTouch: true,
    visibilityCycles: 20,
    resources: { baseline: baselineResources, final: finalResources },
    heap: { baseline: heapBaseline, final: heapFinal, growth: heapFinal - heapBaseline },
  }, null, 2) + "\n");
} finally {
  socket.close();
}
