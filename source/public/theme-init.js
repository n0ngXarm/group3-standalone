(function initializeHuaYunTheme(window, document) {
  "use strict";

  var STORAGE_KEY = "huayun_theme";
  var EVENT_NAME = "huayun:themechange";
  var LIGHT_THEME = "light";
  var DARK_THEME = "dark";
  var THEME_COLORS = {
    light: "#FAF7F1",
    dark: "#161B22",
  };
  var subscribers = [];

  function isTheme(value) {
    return value === LIGHT_THEME || value === DARK_THEME;
  }

  function readStoredTheme() {
    try {
      var storedTheme = window.localStorage.getItem(STORAGE_KEY);
      if (storedTheme !== null && !isTheme(storedTheme)) {
        try {
          window.localStorage.removeItem(STORAGE_KEY);
        } catch (_) {
          // Storage cleanup is best-effort in restricted browser contexts.
        }
        return null;
      }
      return storedTheme;
    } catch (_) {
      return null;
    }
  }

  function persistTheme(theme) {
    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch (_) {
      // The in-memory theme remains usable when storage is unavailable.
    }
  }

  function queryTheme() {
    try {
      var value = new URLSearchParams(window.location.search).get("theme");
      return isTheme(value) ? value : null;
    } catch (_) {
      return null;
    }
  }

  function syncExistingThemeQuery(theme) {
    try {
      var url = new URL(window.location.href);
      if (!url.searchParams.has("theme")) return;
      url.searchParams.set("theme", theme);
      window.history.replaceState(
        window.history.state,
        "",
        url.pathname + url.search + url.hash,
      );
    } catch (_) {
      // Query synchronization must never block a theme change.
    }
  }

  function syncThemeSurface(theme) {
    var root = document.documentElement;
    root.setAttribute("data-theme", theme);
    root.style.backgroundColor = THEME_COLORS[theme];
    root.style.colorScheme = theme;

    var colorSchemeMeta = document.querySelector('meta[name="color-scheme"]');
    if (colorSchemeMeta) colorSchemeMeta.setAttribute("content", theme);

    var themeColorMeta = document.querySelector('meta[name="theme-color"]');
    if (themeColorMeta) themeColorMeta.setAttribute("content", THEME_COLORS[theme]);
  }

  var initialQueryTheme = queryTheme();
  var initialStoredTheme = readStoredTheme();
  var currentTheme = initialQueryTheme || initialStoredTheme || LIGHT_THEME;

  function notify() {
    subscribers.slice().forEach(function notifySubscriber(subscriber) {
      try {
        subscriber(currentTheme);
      } catch (_) {
        // One subscriber cannot prevent the other surfaces from updating.
      }
    });

    try {
      window.dispatchEvent(new CustomEvent(EVENT_NAME, {
        detail: { theme: currentTheme },
      }));
    } catch (_) {
      // The controller subscription remains available without CustomEvent.
    }
  }

  function applyTheme(theme) {
    if (!isTheme(theme)) return currentTheme;
    var changed = theme !== currentTheme;
    currentTheme = theme;
    syncThemeSurface(currentTheme);
    syncExistingThemeQuery(currentTheme);
    if (changed) notify();
    return currentTheme;
  }

  function setTheme(theme) {
    if (!isTheme(theme)) return currentTheme;
    persistTheme(theme);
    return applyTheme(theme);
  }

  function toggleTheme() {
    return setTheme(currentTheme === DARK_THEME ? LIGHT_THEME : DARK_THEME);
  }

  function subscribe(subscriber) {
    if (typeof subscriber !== "function") return function unsubscribeNoop() {};
    subscribers.push(subscriber);
    return function unsubscribe() {
      subscribers = subscribers.filter(function keep(candidate) {
        return candidate !== subscriber;
      });
    };
  }

  var controller = Object.freeze({
    apply: applyTheme,
    get: function getTheme() { return currentTheme; },
    set: setTheme,
    subscribe: subscribe,
    toggle: toggleTheme,
  });

  window.__HUAYUN_THEME__ = controller;
  syncThemeSurface(currentTheme);
  syncExistingThemeQuery(currentTheme);
  if (initialQueryTheme) persistTheme(initialQueryTheme);

  window.addEventListener("storage", function handleThemeStorage(event) {
    if (event.key !== STORAGE_KEY) return;
    if (isTheme(event.newValue)) {
      applyTheme(event.newValue);
      return;
    }
    if (event.newValue !== null) {
      try {
        window.localStorage.removeItem(STORAGE_KEY);
      } catch (_) {
        // Invalid cross-tab storage is ignored when cleanup is unavailable.
      }
    }
    applyTheme(LIGHT_THEME);
  });
})(window, document);
