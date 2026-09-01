import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import vm from "node:vm";

const themeScriptUrl = new URL("../../public/theme-init.js", import.meta.url);
const indexUrl = new URL("../../index.html", import.meta.url);
const themeScript = await readFile(themeScriptUrl, "utf8");

/*
Test cases:
1. A fresh visitor gets light synchronously even when the OS reports dark.
2. A valid query overrides storage and becomes the persisted reload preference.
3. A saved dark choice applies synchronously and survives reload.
4. Invalid query/storage values are repaired safely to the light fallback.
5. Restricted localStorage never blocks applying or toggling the in-memory theme.
6. Toggling persists, repairs an existing stale query, updates browser chrome, and notifies subscribers.
7. Cross-tab storage changes update the active surface and reject invalid values.
8. The pre-paint script and light metadata precede the React module in source HTML.
*/

function createStorage(initial = {}, { blocked = false } = {}) {
  const values = new Map(Object.entries(initial));
  return {
    getItem(key) {
      if (blocked) throw new Error("storage blocked");
      return values.has(key) ? values.get(key) : null;
    },
    removeItem(key) {
      if (blocked) throw new Error("storage blocked");
      values.delete(key);
    },
    setItem(key, value) {
      if (blocked) throw new Error("storage blocked");
      values.set(key, String(value));
    },
    snapshot() {
      return Object.fromEntries(values);
    },
  };
}

function createThemeHarness({
  href = "https://www.nongmodels.com/central/",
  osDark = false,
  script = themeScript,
  storage = createStorage(),
} = {}) {
  const attributes = new Map();
  const listeners = new Map();
  const dispatchedEvents = [];
  const rootStyle = {};
  const metas = {
    "color-scheme": { content: "light" },
    "theme-color": { content: "#FAF7F1" },
  };
  let currentUrl = new URL(href);
  let matchMediaCalls = 0;

  const location = {};
  function syncLocation() {
    for (const key of ["hash", "hostname", "href", "pathname", "port", "protocol", "search"]) {
      location[key] = currentUrl[key];
    }
  }
  syncLocation();

  const document = {
    documentElement: {
      setAttribute(name, value) {
        attributes.set(name, String(value));
      },
      style: rootStyle,
    },
    querySelector(selector) {
      const match = selector.match(/^meta\[name="([^"]+)"\]$/);
      if (!match || !metas[match[1]]) return null;
      return {
        setAttribute(name, value) {
          if (name === "content") metas[match[1]].content = String(value);
        },
      };
    },
  };

  const window = {
    addEventListener(name, listener) {
      const registered = listeners.get(name) || [];
      registered.push(listener);
      listeners.set(name, registered);
    },
    dispatchEvent(event) {
      dispatchedEvents.push(event);
      return true;
    },
    history: {
      state: null,
      replaceState(state, _title, nextHref) {
        this.state = state;
        currentUrl = new URL(nextHref, currentUrl);
        syncLocation();
      },
    },
    localStorage: storage,
    location,
    matchMedia() {
      matchMediaCalls += 1;
      return { matches: osDark };
    },
  };

  class FakeCustomEvent {
    constructor(type, init = {}) {
      this.detail = init.detail;
      this.type = type;
    }
  }

  vm.runInNewContext(script, {
    CustomEvent: FakeCustomEvent,
    URL,
    URLSearchParams,
    document,
    window,
  });

  return {
    attributes,
    controller: window.__HUAYUN_THEME__,
    dispatchedEvents,
    dispatchStorage(newValue) {
      for (const listener of listeners.get("storage") || []) {
        listener({ key: "huayun_theme", newValue });
      }
    },
    get matchMediaCalls() {
      return matchMediaCalls;
    },
    location,
    metas,
    rootStyle,
    storage,
  };
}

function assertThemeSurface(harness, theme) {
  const expectedColor = theme === "dark" ? "#161B22" : "#FAF7F1";
  assert.equal(harness.controller.get(), theme);
  assert.equal(harness.attributes.get("data-theme"), theme);
  assert.equal(harness.rootStyle.backgroundColor, expectedColor);
  assert.equal(harness.rootStyle.colorScheme, theme);
  assert.equal(harness.metas["color-scheme"].content, theme);
  assert.equal(harness.metas["theme-color"].content, expectedColor);
}

test("fresh visitors start light synchronously and ignore a dark OS preference", () => {
  const harness = createThemeHarness({ osDark: true });

  assertThemeSurface(harness, "light");
  assert.equal(harness.matchMediaCalls, 0);
  assert.deepEqual(harness.storage.snapshot(), {});
});

test("a valid query overrides storage and becomes the reload preference", () => {
  const storage = createStorage({ huayun_theme: "light" });
  const firstLoad = createThemeHarness({
    href: "https://group3.nongmodels.com/home/?theme=dark",
    storage,
  });

  assertThemeSurface(firstLoad, "dark");
  assert.equal(storage.snapshot().huayun_theme, "dark");
  assert.equal(firstLoad.location.search, "?theme=dark");

  const reload = createThemeHarness({
    href: "https://group3.nongmodels.com/home/",
    storage,
  });
  assertThemeSurface(reload, "dark");
});

test("a deliberate saved dark choice applies synchronously and survives reload", () => {
  const storage = createStorage({ huayun_theme: "dark" });
  const firstLoad = createThemeHarness({ storage });
  const reload = createThemeHarness({ storage });

  assertThemeSurface(firstLoad, "dark");
  assertThemeSurface(reload, "dark");
});

test("invalid query and storage values are repaired to the safe light fallback", () => {
  const storage = createStorage({ huayun_theme: "sepia" });
  const harness = createThemeHarness({
    href: "https://www.nongmodels.com/central/?theme=system",
    storage,
  });

  assertThemeSurface(harness, "light");
  assert.equal(harness.location.search, "?theme=light");
  assert.deepEqual(storage.snapshot(), {});
});

test("blocked localStorage cannot prevent in-memory theme use", () => {
  const harness = createThemeHarness({
    href: "https://www.nongmodels.com/central/?theme=dark",
    storage: createStorage({}, { blocked: true }),
  });

  assertThemeSurface(harness, "dark");
  assert.doesNotThrow(() => harness.controller.toggle());
  assertThemeSurface(harness, "light");
  assert.equal(harness.location.search, "?theme=light");
});

test("toggle persists, repairs a stale query, updates metadata, and notifies", () => {
  const storage = createStorage({ huayun_theme: "dark" });
  const harness = createThemeHarness({
    href: "https://www.nongmodels.com/group1/home/?theme=dark#books",
    storage,
  });
  const notifications = [];
  const unsubscribe = harness.controller.subscribe((theme) => notifications.push(theme));

  assert.equal(harness.controller.toggle(), "light");
  assertThemeSurface(harness, "light");
  assert.equal(storage.snapshot().huayun_theme, "light");
  assert.equal(harness.location.search, "?theme=light");
  assert.equal(harness.location.hash, "#books");
  assert.deepEqual(notifications, ["light"]);
  assert.equal(harness.dispatchedEvents.at(-1)?.type, "huayun:themechange");
  assert.equal(harness.dispatchedEvents.at(-1)?.detail?.theme, "light");

  unsubscribe();
  harness.controller.toggle();
  assert.deepEqual(notifications, ["light"]);
});

test("cross-tab storage events update valid themes and reject invalid values", () => {
  const harness = createThemeHarness();

  harness.dispatchStorage("dark");
  assertThemeSurface(harness, "dark");

  harness.dispatchStorage("sepia");
  assertThemeSurface(harness, "light");
});

test("source HTML establishes light before loading the synchronous controller and React", async () => {
  const html = await readFile(indexUrl, "utf8");
  const inlineThemeMatch = html.match(/<script data-huayun-theme-init>([\s\S]*?)<\/script>/);
  const themeScriptIndex = inlineThemeMatch ? html.indexOf(inlineThemeMatch[0]) : -1;
  const reactModuleIndex = html.indexOf('<script type="module" src="/src/main.jsx"></script>');

  assert.match(html, /<html[^>]*data-theme="light"[^>]*color-scheme: light/);
  assert.match(html, /<meta name="color-scheme" content="light" \/>/);
  assert.match(html, /<meta name="theme-color" content="#FAF7F1" \/>/);
  assert.ok(themeScriptIndex > -1, "theme controller is inlined into the initial document");
  assert.ok(themeScriptIndex < reactModuleIndex, "theme controller executes before the React module");
  assert.doesNotMatch(html, /<script[^>]+src=["'][^"']*theme-init\.js/i);

  const inlineHarness = createThemeHarness({
    href: "https://group3.nongmodels.com/home/?theme=dark",
    script: inlineThemeMatch?.[1] || "",
  });
  assertThemeSurface(inlineHarness, "dark");
});
