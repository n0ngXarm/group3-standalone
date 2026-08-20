const CDP = `http://127.0.0.1:${process.env.CDP_PORT || 9223}`;

async function main() {
  const url = process.argv[2] || "http://localhost:5174/group3/home/?theme=light";
  const tabs = await (await fetch(`${CDP}/json/list`)).json();
  const tab = tabs.find((t) => t.type === "page") || tabs[0];
  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  let id = 0;
  const pending = new Map();
  const send = (method, params = {}) =>
    new Promise((resolve) => {
      const msgId = ++id;
      pending.set(msgId, resolve);
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });
  ws.onmessage = (ev) => {
    const msg = JSON.parse(ev.data);
    if (msg.id && pending.has(msg.id)) {
      pending.get(msg.id)(msg);
      pending.delete(msg.id);
    }
  };
  await new Promise((r) => (ws.onopen = r));

  await send("Emulation.setDeviceMetricsOverride", { width: 1920, height: 1080, deviceScaleFactor: 1, mobile: false });
  await send("Page.navigate", { url });
  await new Promise((r) => setTimeout(r, 6000));

  const expr = `(() => {
    const q = (s) => document.querySelector(s);
    const cs = (s, p) => { const e = q(s); return e ? getComputedStyle(e)[p] : null; };
    const root = getComputedStyle(document.documentElement);
    const theme = document.documentElement.getAttribute("data-theme");
    return {
      theme,
      tokens: {
        accent: root.getPropertyValue("--color-accent").trim(),
        accentHover: root.getPropertyValue("--color-accent-hover").trim(),
        accentSubtle: root.getPropertyValue("--color-accent-subtle").trim(),
        bg: root.getPropertyValue("--color-bg-primary").trim(),
      },
      ctaPrimary: { bg: cs(".g3-home-cta-primary", "backgroundColor"), color: cs(".g3-home-cta-primary", "color"), shadow: cs(".g3-home-cta-primary", "boxShadow").slice(0, 60) },
      ctaSecondary: { bg: cs(".g3-home-cta-secondary", "backgroundColor"), color: cs(".g3-home-cta-secondary", "color") },
      vocabPill: { bg: cs(".g3-vocab-pill", "backgroundColor"), color: cs(".g3-vocab-pill", "color") },
      mangaTag: { bg: cs(".g3-manga-tag", "backgroundColor"), color: cs(".g3-manga-tag", "color") },
      speakerTag: { color: cs(".g3-manga-speaker-tag", "color") },
      activeDot: { bg: cs(".g3-home-carousel-dot.is-active", "backgroundColor"), shadow: cs(".g3-home-carousel-dot.is-active", "boxShadow").slice(0, 60) },
      redCount: document.querySelectorAll(".g3-home-cta-primary, .g3-vocab-pill, .g3-manga-tag").length,
    };
  })()`;

  const res = await send("Runtime.evaluate", { expression: expr, returnByValue: true });
  console.log(JSON.stringify(res.result.result.value, null, 2));
  ws.close();
  process.exit(0);
}

main().catch((e) => { console.error(e); process.exit(1); });