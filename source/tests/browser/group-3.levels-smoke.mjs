import assert from "node:assert/strict";

const port = Number(process.env.G3_CDP_PORT || 9223);
const origin = process.env.G3_LEVELS_ORIGIN || "http://127.0.0.1:4179";
const routeTimeout = Number(process.env.G3_ROUTE_TIMEOUT || 15_000);
const levelsPath = "/group3/home/levels/";
const tolerance = 2;
const viewports = [
  [1600, 900],
  [1366, 768],
  [1280, 800],
  [1024, 768],
  [768, 1024],
  [390, 844],
];
const levels = ["hsk1", "hsk2", "hsk3"];

const targets = await fetch(`http://127.0.0.1:${port}/json/list`).then((response) => response.json());
const target = targets.find((item) => item.type === "page");
assert.ok(target?.webSocketDebuggerUrl, "Chromium page target is unavailable");

let nextId = 1;
const pending = new Map();
const browserEvents = [];
const assetResponses = new Map();
const assetRequests = new Set();
const failures = [];
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

  if ([
    "Runtime.consoleAPICalled",
    "Runtime.exceptionThrown",
    "Log.entryAdded",
    "Network.loadingFailed",
    "Network.requestWillBeSent",
    "Network.responseReceived",
  ].includes(message.method)) browserEvents.push(message);

  if (message.method === "Network.requestWillBeSent") {
    const url = message.params?.request?.url || "";
    if (/visual-novel-(?:backgrounds|characters-idle|character-poses-talk)\//.test(url)) assetRequests.add(url);
  }
  if (message.method === "Network.responseReceived") {
    const response = message.params?.response;
    if (response?.url && /visual-novel-(?:backgrounds|characters-idle|character-poses-talk)\//.test(response.url)) {
      assetResponses.set(response.url, response.status);
    }
  }
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

async function waitFor(selector, timeout = 15_000) {
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

async function sleep(milliseconds) {
  await evaluate(`new Promise((resolve) => setTimeout(resolve, ${milliseconds}))`);
}

async function setViewport(width, height) {
  await send("Emulation.setDeviceMetricsOverride", {
    width,
    height,
    deviceScaleFactor: 1,
    mobile: width <= 480,
  });
}

async function navigate(pathname, theme = "light") {
  await send("Page.navigate", { url: `${origin}${pathname}?theme=${theme}` });
  await waitFor(".g3-level-selection");
  await evaluate(`Promise.all([
    document.fonts?.ready || Promise.resolve(),
    ...[...document.querySelectorAll('.g3-level-card img')].map((image) => {
      if (image.complete) return Promise.resolve();
      return new Promise((resolve) => {
        image.addEventListener('load', resolve, { once: true });
        image.addEventListener('error', resolve, { once: true });
      });
    }),
  ])`);
  await sleep(650);
}

async function clickAt(selector) {
  const point = await evaluate(`(() => {
    const element = document.querySelector(${JSON.stringify(selector)});
    if (!element) throw new Error("Missing click target: ${selector}");
    const rect = element.getBoundingClientRect();
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
  })()`);
  await send("Input.dispatchMouseEvent", { type: "mouseMoved", x: point.x, y: point.y });
  await send("Input.dispatchMouseEvent", { type: "mousePressed", x: point.x, y: point.y, button: "left", clickCount: 1 });
  await send("Input.dispatchMouseEvent", { type: "mouseReleased", x: point.x, y: point.y, button: "left", clickCount: 1 });
}

async function activateCard(index, method = "hover") {
  const selector = `.g3-level-card:nth-child(${index + 1})`;
  if (method === "focus") {
    await evaluate(`(() => {
      const card = document.querySelector(${JSON.stringify(selector)});
      document.activeElement?.blur();
      card.focus();
    })()`);
  } else {
    await evaluate("document.activeElement?.blur()");
    const point = await evaluate(`(() => {
      const rect = document.querySelector(${JSON.stringify(selector)}).getBoundingClientRect();
      return { x: rect.left + rect.width / 2, y: rect.top + Math.min(60, rect.height / 2) };
    })()`);
    await send("Input.dispatchMouseEvent", { type: "mouseMoved", x: point.x, y: point.y });
  }
  await sleep(600);
  assert.equal(
    await evaluate(`document.querySelector(${JSON.stringify(selector)}).classList.contains('is-active')`),
    true,
    `${levels[index]} did not become active via ${method}`,
  );
}

async function noScrollSnapshot(theme, width, height) {
  await setViewport(width, height);
  await navigate(levelsPath, theme);
  const snapshot = await evaluate(`(() => ({
    theme: document.documentElement.dataset.theme,
    headerCount: document.querySelectorAll('.g3-header').length,
    scrollHeight: document.documentElement.scrollHeight,
    innerHeight: window.innerHeight,
    scrollWidth: document.documentElement.scrollWidth,
    innerWidth: window.innerWidth,
  }))()`);
  if (snapshot.theme !== theme) failures.push(`${width}x${height} ${theme}: theme query was not applied`);
  if (snapshot.headerCount !== 1) failures.push(`${width}x${height} ${theme}: expected 1 header, found ${snapshot.headerCount}`);
  if (snapshot.scrollHeight > snapshot.innerHeight + tolerance) {
    failures.push(`${width}x${height} ${theme}: vertical scroll ${snapshot.scrollHeight} > ${snapshot.innerHeight} + ${tolerance}`);
  }
  if (snapshot.scrollWidth > snapshot.innerWidth + tolerance) {
    failures.push(`${width}x${height} ${theme}: horizontal scroll ${snapshot.scrollWidth} > ${snapshot.innerWidth} + ${tolerance}`);
  }
  return { viewport: `${width}x${height}`, ...snapshot };
}

async function layoutSnapshot() {
  return evaluate(`(() => {
    const rect = (element) => {
      const value = element.getBoundingClientRect();
      return { x: value.x, y: value.y, width: value.width, height: value.height, right: value.right, bottom: value.bottom };
    };
    const visible = (element) => {
      const style = getComputedStyle(element);
      const bounds = element.getBoundingClientRect();
      return style.display !== 'none' && style.visibility !== 'hidden' && bounds.width > 0 && bounds.height > 0;
    };
    const cards = [...document.querySelectorAll('.g3-level-card')];
    return {
      header: rect(document.querySelector('.g3-header')),
      heading: rect(document.querySelector('.g3-level-selection-header')),
      grid: rect(document.querySelector('.g3-level-selection-grid')),
      cards: cards.map((card) => ({
        active: card.classList.contains('is-active'),
        visible: visible(card),
        rect: rect(card),
        overflow: getComputedStyle(card).overflow,
        primary: rect(card.querySelector('.g3-primary-action')),
        secondary: rect(card.querySelector('.g3-secondary-action')),
        idle: {
          opacity: Number(getComputedStyle(card.querySelector('.g3-actor-idle')).opacity),
          rect: rect(card.querySelector('.g3-actor-idle')),
        },
        talk: {
          opacity: Number(getComputedStyle(card.querySelector('.g3-actor-talk')).opacity),
          rect: rect(card.querySelector('.g3-actor-talk')),
        },
      })),
      activeCount: cards.filter((card) => card.classList.contains('is-active')).length,
      visibleCount: cards.filter(visible).length,
      viewport: { width: innerWidth, height: innerHeight },
      overflow: {
        x: document.documentElement.scrollWidth - innerWidth,
        y: document.documentElement.scrollHeight - innerHeight,
      },
    };
  })()`);
}

function assertContained(inner, outer, label) {
  assert.ok(inner.x >= outer.x - tolerance, `${label} crosses left edge`);
  assert.ok(inner.right <= outer.right + tolerance, `${label} crosses right edge`);
  assert.ok(inner.y >= outer.y - tolerance, `${label} crosses top edge`);
  assert.ok(inner.bottom <= outer.bottom + tolerance, `${label} crosses bottom edge`);
}

function assertVisibleIntersection(inner, outer, label) {
  const visibleWidth = Math.min(inner.right, outer.right) - Math.max(inner.x, outer.x);
  const visibleHeight = Math.min(inner.bottom, outer.bottom) - Math.max(inner.y, outer.y);
  assert.ok(inner.width > 0 && inner.height > 0, `${label} has zero rendered size`);
  assert.ok(visibleWidth > 0 && visibleHeight > 0, `${label} does not intersect its card`);
}

function assertGeometry(snapshot, mobile = false) {
  assert.equal(snapshot.activeCount, 1, "expected exactly one active level card");
  assert.equal(snapshot.visibleCount, mobile ? 1 : 3, mobile ? "mobile stacked multiple level cards" : "desktop compact card disappeared");
  assert.ok(snapshot.heading.bottom <= snapshot.grid.y + tolerance, "heading is not above card cluster");
  assert.ok(snapshot.grid.y >= snapshot.header.bottom - tolerance, "card cluster collides with Group 3 header");
  assert.ok(snapshot.grid.bottom <= snapshot.viewport.height + tolerance, "card cluster crosses viewport bottom");
  assert.ok(snapshot.grid.x >= -tolerance && snapshot.grid.right <= snapshot.viewport.width + tolerance, "card cluster crosses viewport width");
  assert.ok(snapshot.overflow.x <= tolerance && snapshot.overflow.y <= tolerance, "level interaction introduced page overflow");

  const active = snapshot.cards.find((card) => card.active);
  assert.ok(active, "active card missing");
  assert.equal(active.overflow, "hidden", "actor/card layers are not clipped to the card");
  assertContained(active.primary, active.rect, "primary CTA");
  assertContained(active.secondary, active.rect, "secondary CTA");
  assert.ok(active.talk.opacity >= 0.99 && active.idle.opacity <= 0.01, "active card does not show talk/gesture sprite");
  assertVisibleIntersection(active.talk.rect, active.rect, "active talk/gesture sprite");
  for (const card of snapshot.cards.filter((item) => !item.active && item.visible)) {
    assert.ok(card.idle.opacity >= 0.60 && card.idle.opacity <= 0.95, "inactive idle sprite is not visible but subdued");
    assert.ok(card.talk.opacity <= 0.01, "inactive card does not hide talk/gesture sprite");
    assertVisibleIntersection(card.idle.rect, card.rect, "inactive idle sprite");
  }
  if (!mobile) {
    for (const card of snapshot.cards.filter((item) => !item.active)) {
      assert.ok(active.rect.width > card.rect.width, "active desktop card did not expand beyond compact card");
    }
  }
}

async function assertImages() {
  const images = await evaluate(`[...document.querySelectorAll('.g3-level-card img')].map((image) => ({
    className: image.className,
    url: image.currentSrc || image.src,
    complete: image.complete,
    naturalWidth: image.naturalWidth,
    naturalHeight: image.naturalHeight,
  }))`);
  assert.equal(images.length, 9, "expected 3 backgrounds + 3 idle sprites + 3 talk sprites");
  assert.equal(new Set(images.map((image) => image.url)).size, 9, "level asset URLs are not unique");
  assert.ok(images.every((image) => image.complete && image.naturalWidth > 0 && image.naturalHeight > 0), "level image failed to load/decode");
  assert.equal(images.filter((image) => image.className === "g3-actor-idle").length, 3);
  assert.equal(images.filter((image) => image.className === "g3-actor-talk").length, 3);
  return images;
}

async function assertRoute(levelIndex, action, theme) {
  await setViewport(1366, 768);
  await navigate(levelsPath, theme);
  await activateCard(levelIndex, levelIndex === 2 ? "focus" : "hover");
  const actionClass = action === "primary" ? ".g3-primary-action" : ".g3-secondary-action";
  await clickAt(`.g3-level-card:nth-child(${levelIndex + 1}) ${actionClass}`);
  await waitFor(action === "primary" ? ".g3-catalog" : ".g3-practice-hub", routeTimeout);
  await sleep(150);
  const state = await evaluate(`({
    pathname: location.pathname,
    hash: location.hash,
    queryTheme: new URLSearchParams(location.search).get('theme'),
    appliedTheme: document.documentElement.dataset.theme,
    headerCount: document.querySelectorAll('.g3-header').length,
  })`);
  const level = levels[levelIndex];
  const expected = action === "primary"
    ? `/group3/home/${level}/`
    : `/group3/home/${level}/practice/`;
  assert.equal(state.pathname, expected, `${level} ${action} CTA did not navigate via the canonical route`);
  assert.equal(state.hash, "", `${level} ${action} CTA used a hash route`);
  assert.equal(state.queryTheme, theme, `${level} ${action} CTA dropped the theme query`);
  assert.equal(state.appliedTheme, theme, `${level} ${action} CTA reset the applied theme`);
  assert.equal(state.headerCount, 1, `${level} ${action} destination duplicated the header`);
  return { level, action, ...state };
}

async function assertPracticeExerciseRoute(levelIndex, exerciseIndex, exerciseType, theme) {
  await setViewport(1366, 768);
  await navigate(levelsPath, theme);
  await activateCard(levelIndex, "focus");
  await clickAt(`.g3-level-card:nth-child(${levelIndex + 1}) .g3-secondary-action`);
  await waitFor(".g3-practice-hub", routeTimeout);
  await clickAt(`.g3-practice-entry:nth-child(${exerciseIndex + 1})`);
  await waitFor(".g3-practice-placeholder", routeTimeout);
  const state = await evaluate(`({
    pathname: location.pathname,
    queryTheme: new URLSearchParams(location.search).get('theme'),
    placeholder: Boolean(document.querySelector('.g3-practice-placeholder')),
  })`);
  assert.equal(state.pathname, `/group3/home/${levels[levelIndex]}/practice/${exerciseType}/`);
  assert.equal(state.queryTheme, theme);
  assert.equal(state.placeholder, true);
  return { level: levels[levelIndex], exerciseType, ...state };
}

async function assertKeyboardAction(levelIndex, action, theme) {
  await setViewport(1366, 768);
  await navigate(levelsPath, theme);
  await activateCard(levelIndex, "focus");
  const selector = `.g3-level-card:nth-child(${levelIndex + 1}) .g3-${action}-action`;
  assert.equal(await evaluate(`(() => { const button = document.querySelector(${JSON.stringify(selector)}); button.focus(); return document.activeElement === button && button.tabIndex === 0; })()`), true);
  await send("Input.dispatchKeyEvent", { type: "rawKeyDown", key: "Enter", code: "Enter", nativeVirtualKeyCode: 13, windowsVirtualKeyCode: 13 });
  await send("Input.dispatchKeyEvent", { type: "char", key: "Enter", code: "Enter", text: "\r", unmodifiedText: "\r" });
  await send("Input.dispatchKeyEvent", { type: "keyUp", key: "Enter", code: "Enter", nativeVirtualKeyCode: 13, windowsVirtualKeyCode: 13 });
  await waitFor(action === "primary" ? ".g3-catalog" : ".g3-practice-hub", routeTimeout);
}

async function languageSnapshot(index, language) {
  await clickAt(`.g3-language-control button:nth-child(${index + 1})`);
  await sleep(250);
  const state = await evaluate(`(() => {
    const main = document.querySelector('.g3-level-selection');
    const invalidText = /undefined|\\[object Object\\]|missing (?:translation|key)/i;
    return {
      language: document.documentElement.lang,
      activeLanguage: [...document.querySelectorAll('.g3-language-control button')].findIndex((button) => button.getAttribute('aria-pressed') === 'true'),
      heading: document.querySelector('.g3-level-selection-header h1').textContent.trim(),
      titles: [...document.querySelectorAll('.g3-level-card-title')].map((item) => item.textContent.trim()),
      actions: [...document.querySelectorAll('.g3-level-card.is-active .g3-level-card-actions button')].map((item) => item.textContent.trim()),
      invalidText: invalidText.test(main.textContent),
      unexpectedThai: ${JSON.stringify(language !== "th")} && /[\u0E00-\u0E7F]/.test(main.textContent),
      overflowX: document.documentElement.scrollWidth - innerWidth,
      overflowY: document.documentElement.scrollHeight - innerHeight,
    };
  })()`);
  const expectedLanguage = { th: "th", zh: "zh-CN", en: "en" }[language];
  const expectedHeading = { th: "สามารถเลือกระดับที่ต้องการได้เลย", zh: "选择想学的等级", en: "Choose a learning level" }[language];
  const expectedActions = {
    th: ["เข้าสู่บทเรียน→", "บททำแบบฝึกหัด"],
    zh: ["进入课程→", "练习"],
    en: ["Enter lessons→", "Practice exercises"],
  }[language];
  if (state.language !== expectedLanguage) failures.push(`language ${language}: document lang is ${state.language}, expected ${expectedLanguage}`);
  if (state.activeLanguage !== index) failures.push(`language ${language}: control did not activate`);
  if (state.heading !== expectedHeading) failures.push(`language ${language}: heading did not use localized copy`);
  if (state.titles.length !== 3 || !state.titles.every(Boolean)) failures.push(`language ${language}: card text is incomplete`);
  if (JSON.stringify(state.actions) !== JSON.stringify(expectedActions)) failures.push(`language ${language}: action labels are incorrect`);
  if (state.invalidText) failures.push(`language ${language}: rendered undefined, object, or missing-key text`);
  if (state.unexpectedThai) failures.push(`language ${language}: retained Thai-only text in the Levels surface`);
  if (state.overflowX > tolerance || state.overflowY > tolerance) failures.push(`language ${language}: text introduced overflow`);
  return { language, ...state };
}

const report = {
  noScroll: [],
  desktopInteraction: [],
  mobileInteraction: [],
  assets: null,
  routes: [],
  languages: [],
  themes: [],
  headerCount: 1,
  runtimeErrors: 0,
  failures,
};

try {
  await Promise.all(["Page.enable", "Runtime.enable", "Log.enable", "Network.enable"].map((method) => send(method)));
  await send("Network.setCacheDisabled", { cacheDisabled: true });

  for (const theme of ["light", "dark"]) {
    for (const [width, height] of viewports) report.noScroll.push(await noScrollSnapshot(theme, width, height));
  }

  await setViewport(1366, 768);
  await navigate(levelsPath, "light");
  try {
    report.assets = await assertImages();
  } catch (error) {
    failures.push(`assets: ${error.message}`);
    report.assets = [];
  }
  for (let index = 0; index < levels.length; index += 1) {
    try {
      await activateCard(index, index === 2 ? "focus" : "hover");
      const snapshot = await layoutSnapshot();
      report.desktopInteraction.push({
        level: levels[index],
        activeWidth: snapshot.cards[index].rect.width,
        compactWidths: snapshot.cards.filter((_, cardIndex) => cardIndex !== index).map((card) => card.rect.width),
        activeTalkSize: { width: snapshot.cards[index].talk.rect.width, height: snapshot.cards[index].talk.rect.height },
      });
      assertGeometry(snapshot, false);
    } catch (error) {
      failures.push(`desktop ${levels[index]}: ${error.message}`);
    }
  }

  for (const action of ["primary", "secondary"]) {
    try {
      await assertKeyboardAction(0, action, "light");
    } catch (error) {
      failures.push(`keyboard hsk1 ${action}: ${error.message}`);
    }
  }

  for (const [exerciseIndex, exerciseType] of ["repeat-sentence", "image-description", "question-response"].entries()) {
    try {
      report.routes.push(await assertPracticeExerciseRoute(0, exerciseIndex, exerciseType, "dark"));
    } catch (error) {
      failures.push(`practice route hsk1 ${exerciseType}: ${error.message}`);
    }
  }

  await setViewport(390, 844);
  await navigate(levelsPath, "dark");
  if (await evaluate("getComputedStyle(document.querySelector('.g3-level-mobile-tabs')).display") !== "flex") failures.push("mobile level tabs are hidden");
  for (let index = 0; index < levels.length; index += 1) {
    try {
      await clickAt(`.g3-level-mobile-tabs button:nth-child(${index + 1})`);
      await sleep(350);
      const snapshot = await layoutSnapshot();
      report.mobileInteraction.push({
        level: levels[index],
        visibleCards: snapshot.visibleCount,
        active: snapshot.cards[index].active,
        activeTalkSize: { width: snapshot.cards[index].talk.rect.width, height: snapshot.cards[index].talk.rect.height },
      });
      assertGeometry(snapshot, true);
      assert.equal(snapshot.cards[index].active, true, `mobile tab did not activate ${levels[index]}`);
    } catch (error) {
      failures.push(`mobile ${levels[index]}: ${error.message}`);
    }
  }

  for (const theme of ["light", "dark"]) {
    await setViewport(1366, 768);
    await navigate(levelsPath, theme);
    report.themes.push(await evaluate(`({
      requested: ${JSON.stringify(theme)},
      applied: document.documentElement.dataset.theme,
      query: new URLSearchParams(location.search).get('theme'),
      headers: document.querySelectorAll('.g3-header').length,
    })`));
  }
  await clickAt(".g3-header-actions > button");
  await sleep(250);
  const toggledTheme = await evaluate("({ applied: document.documentElement.dataset.theme, query: new URLSearchParams(location.search).get('theme') })");
  try {
    assert.deepEqual(toggledTheme, { applied: "light", query: "light" }, "theme toggle did not update state and query");
  } catch (error) {
    failures.push(`theme toggle: ${error.message}`);
  }

  await setViewport(1366, 768);
  await navigate(levelsPath, "light");
  for (const [index, language] of ["th", "zh", "en"].entries()) {
    try {
      report.languages.push(await languageSnapshot(index, language));
    } catch (error) {
      failures.push(`language ${language}: ${error.message}`);
    }
  }

  for (let index = 0; index < levels.length; index += 1) {
    for (const action of ["primary", "secondary"]) {
      try {
        report.routes.push(await assertRoute(index, action, "dark"));
      } catch (error) {
        failures.push(`route ${levels[index]} ${action}: ${error.message}`);
      }
    }
  }

  if (assetRequests.size !== 9) failures.push(`expected 9 level asset requests, received ${assetRequests.size}`);
  if (![...assetRequests].every((url) => assetResponses.get(url) === 200)) failures.push("level asset request did not return HTTP 200");

  const relevantEvents = browserEvents.filter((event) => {
    if (event.method === "Network.loadingFailed") return !event.params?.canceled;
    if (event.method === "Network.responseReceived") return Number(event.params?.response?.status || 0) >= 400;
    if (event.method === "Runtime.consoleAPICalled") return event.params?.type === "error";
    if (event.method === "Log.entryAdded") {
      const entry = event.params?.entry || {};
      return entry.level === "error" || /(?:React|Warning:|CSS parser)/i.test(entry.text || "");
    }
    if (event.method === "Runtime.exceptionThrown") return true;
    return false;
  });
  if (relevantEvents.length > 0) failures.push(`console, React, CSS, runtime, or network errors observed: ${relevantEvents.length}`);
  report.runtimeErrors = relevantEvents.length;

  report.assets = {
    count: report.assets.length,
    backgrounds: report.assets.filter((image) => image.className === "g3-level-card-background").length,
    idle: report.assets.filter((image) => image.className === "g3-actor-idle").length,
    talk: report.assets.filter((image) => image.className === "g3-actor-talk").length,
    http200: [...assetRequests].filter((url) => assetResponses.get(url) === 200).length,
    decodeFailures: 0,
  };
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  assert.deepEqual(failures, [], "Levels QA gate failed");
} finally {
  socket.close();
}
