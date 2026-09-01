import assert from "node:assert/strict";
import { writeFile } from "node:fs/promises";

const port = Number(process.env.G3_CDP_PORT || 9224);
const origin = process.env.G3_HOME_ORIGIN || "http://127.0.0.1:4179";
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
  if (["Runtime.consoleAPICalled", "Runtime.exceptionThrown", "Log.entryAdded", "Network.loadingFailed"].includes(message.method)) {
    browserEvents.push(message);
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

async function sleep(milliseconds) {
  await evaluate(`new Promise((resolve) => setTimeout(resolve, ${milliseconds}))`);
}

async function waitFor(selector, timeout = 12_000) {
  await evaluate(`new Promise((resolve, reject) => {
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
  await sleep(160);
}

async function capture(path) {
  const { data } = await send("Page.captureScreenshot", { format: "png", fromSurface: true });
  await writeFile(path, Buffer.from(data, "base64"));
}

async function snapshot() {
  return evaluate(`(() => {
    const normalize = (value) => value?.replace(/\\s+/g, " ").trim();
    const visible = (element) => {
      const rect = element?.getBoundingClientRect();
      const style = element ? getComputedStyle(element) : null;
      return Boolean(rect && rect.width > 0 && rect.height > 0 && style.visibility === "visible" && Number(style.opacity) > 0);
    };
    const labels = [...document.querySelectorAll(".g3-manga-actor-label")].map((label) => {
      const actor = label.closest(".g3-manga-actor");
      const style = getComputedStyle(label);
      return {
        text: normalize(label.textContent),
        active: label.classList.contains("is-active-speaker"),
        talking: actor.classList.contains("is-talking"),
        indicator: visible(label.querySelector(".g3-manga-actor-label-indicator")),
        visible: visible(label),
        opacity: Number(getComputedStyle(actor).opacity),
        backgroundColor: style.backgroundColor,
        borderColor: style.borderColor,
        boxShadow: style.boxShadow,
      };
    });
    const speaker = document.querySelector(".g3-manga-speaker-tag");
    const h1 = document.querySelector("#g3-home-title");
    const h1Style = getComputedStyle(h1);
    const backdropMask = getComputedStyle(document.querySelector(".g3-manga-backdrop")).maskImage;
    return {
      labels,
      bottomSpeaker: normalize(speaker.textContent),
      activeDot: [...document.querySelectorAll(".g3-home-carousel-dot")].findIndex((dot) => dot.getAttribute("aria-selected") === "true"),
      palette: {
        hanzi: getComputedStyle(document.querySelector(".g3-manga-hanzi")).color,
        pinyin: getComputedStyle(document.querySelector(".g3-manga-pinyin")).color,
        translation: getComputedStyle(document.querySelector(".g3-manga-thai")).color,
        speakerText: getComputedStyle(speaker).color,
        speakerBackground: getComputedStyle(speaker).backgroundColor,
      },
      h1: { color: h1Style.color, backgroundImage: h1Style.backgroundImage },
      backdropMask,
      scrollHeight: document.documentElement.scrollHeight,
      innerHeight,
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth,
    };
  })()`);
}

function assertSpeakerState(state, label) {
  const active = state.labels.filter((actorLabel) => actorLabel.active);
  const inactive = state.labels.filter((actorLabel) => !actorLabel.active);
  assert.equal(active.length, 1, `${label}: expected exactly one active actor label`);
  assert.equal(active[0].text, state.bottomSpeaker, `${label}: actor label and bottom speaker disagree`);
  assert.equal(active[0].talking, true, `${label}: active label is not attached to talking actor`);
  assert.equal(active[0].indicator, true, `${label}: active label has no non-color indicator`);
  assert.ok(inactive.every((actorLabel) => actorLabel.visible && actorLabel.opacity >= 0.82), `${label}: inactive actor is not identifiable`);
  assert.notEqual(active[0].backgroundColor, inactive[0].backgroundColor, `${label}: active background does not differ from inactive`);
  assert.notEqual(active[0].borderColor, inactive[0].borderColor, `${label}: active border does not differ from inactive`);
  assert.notEqual(active[0].boxShadow, inactive[0].boxShadow, `${label}: active elevation does not differ from inactive`);
  assert.ok(state.scrollHeight <= state.innerHeight + 2 && state.scrollWidth <= state.innerWidth + 2, `${label}: page overflow`);
  assert.match(state.backdropMask, /144px/, `${label}: scene-edge fade drifted`);
}

await send("Runtime.enable");
await send("Log.enable");
await send("Network.enable");
await send("Page.enable");
await send("Emulation.setDeviceMetricsOverride", { width: 1600, height: 900, deviceScaleFactor: 1, mobile: false });

const evidence = [];
const palettes = new Map();
for (const theme of ["dark", "light"]) {
  await send("Page.navigate", { url: `${origin}/group3/home/?theme=${theme}` });
  await waitFor(".g3-manga-actor-label");
  await sleep(900);

  for (let scenario = 0; scenario < 5; scenario += 1) {
    await click(`.g3-home-carousel-dot:nth-child(${scenario + 1})`);
    const state = await snapshot();
    assert.equal(state.activeDot, scenario, `${theme}/pagination-${scenario}: stale scenario selection`);
    assertSpeakerState(state, `${theme}/pagination-${scenario}`);
    evidence.push({ theme, action: `pagination-${scenario}`, ...state });
  }

  await click(".g3-manga-arrow.is-next");
  let state = await snapshot();
  assert.equal(state.activeDot, 0, `${theme}/next: unexpected scene`);
  assertSpeakerState(state, `${theme}/next`);

  await click(".g3-manga-arrow.is-prev");
  state = await snapshot();
  assert.equal(state.activeDot, 4, `${theme}/previous: unexpected scene`);
  assertSpeakerState(state, `${theme}/previous`);

  await click(".g3-home-carousel-dot:nth-child(1)");
  state = await snapshot();
  assertSpeakerState(state, `${theme}/left-speaker`);
  await capture(`/tmp/home-${theme}-speaker-left.png`);
  palettes.set(theme, state.palette);
  assert.equal(state.h1.color, "rgba(0, 0, 0, 0)", `${theme}: H1 is not using clipped brand accent`);
  assert.notEqual(state.h1.backgroundImage, "none", `${theme}: H1 has no brand accent gradient`);

  await sleep(4300);
  state = await snapshot();
  assertSpeakerState(state, `${theme}/right-speaker`);
  await capture(`/tmp/home-${theme}-speaker-right.png`);
}

assert.deepEqual(palettes.get("light"), palettes.get("dark"), "VN-local typography palette differs between themes");
const runtimeFailures = browserEvents.filter((event) => {
  if (event.method === "Runtime.consoleAPICalled") return event.params?.type === "error";
  if (event.method === "Network.loadingFailed") return !event.params?.canceled;
  if (event.method === "Log.entryAdded") return event.params?.entry?.level === "error";
  return true;
});
assert.deepEqual(runtimeFailures, [], "Console, runtime, or network failures were recorded");

socket.close();
console.log(JSON.stringify({ evidence, runtimeFailures }, null, 2));
console.log("HOME_SPEAKER_AFFORDANCE_GATE_PASS");
