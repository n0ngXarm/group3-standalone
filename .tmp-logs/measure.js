const CDP = `http://127.0.0.1:${process.env.CDP_PORT || 9223}`;

async function main() {
  const url = process.argv[2] || "http://localhost:5174/group3/";
  const tabs = await (await fetch(`${CDP}/json/list`)).json();
  const tab = tabs.find((t) => t.type === "page") || tabs[0];
  if (!tab) throw new Error("no tab");
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

  await send("Page.navigate", { url });
  await new Promise((r) => setTimeout(r, 6000));

  const expr = `(() => {
    const q = (s) => document.querySelector(s);
    const rect = (s) => { const e = q(s); if (!e) return null; const r = e.getBoundingClientRect(); return { top: Math.round(r.top), left: Math.round(r.left), right: Math.round(r.right), bottom: Math.round(r.bottom), width: Math.round(r.width), height: Math.round(r.height) }; };
    const cs = (s, p) => { const e = q(s); return e ? getComputedStyle(e)[p] : null; };
    const vw = innerWidth, vh = innerHeight;
    const stage = rect(".g3-manga-viewport");
    const hero = rect(".g3-home-hero");
    const title = rect(".g3-home-title");
    const subtitle = rect(".g3-manga-subtitle-box");
    const copy = rect(".g3-hero-copy");
    const shell = rect(".g3-story-shell");
    const main = rect("#g3-main");
    const body = document.body;
    return {
      viewport: { vw, vh },
      scroll: { sw: body.scrollWidth, sh: body.scrollHeight, overflowY: getComputedStyle(body).overflowY, docScroll: document.documentElement.scrollHeight },
      shell,
      main,
      hero,
      title,
      titleFont: cs(".g3-home-title", "fontSize"),
      titleLineHeight: cs(".g3-home-title", "lineHeight"),
      copy,
      stage,
      stageMinHeight: cs(".g3-manga-viewport", "minHeight"),
      stageMaxHeight: cs(".g3-manga-viewport", "maxHeight"),
      stageHeightCss: cs(".g3-manga-viewport", "height"),
      subtitle,
      hanziFont: cs(".g3-manga-subtitle-box .g3-manga-hanzi", "fontSize"),
      hanziColor: cs(".g3-manga-subtitle-box .g3-manga-hanzi", "color"),
      subBg: cs(".g3-manga-subtitle-box", "backgroundColor"),
      actor: rect(".g3-manga-actor"),
      actorSprite: rect(".g3-manga-actor-sprite"),
      carousel: rect(".g3-home-carousel"),
      dots: rect(".g3-home-carousel-dots"),
      header: rect(".g3-header"),
      bodyFont: cs("html", "fontSize"),
    };
  })()`;

  const res = await send("Runtime.evaluate", { expression: expr, returnByValue: true });
  console.log(JSON.stringify(res.result.result.value, null, 2));
  ws.close();
  process.exit(0);
}

main().catch((e) => { console.error(e); process.exit(1); });