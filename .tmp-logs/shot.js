const CDP = `http://127.0.0.1:${process.env.CDP_PORT || 9223}`;

async function main() {
  const url = process.argv[2] || "http://localhost:5174/group3/";
  const mode = process.argv[3] || "desktop";
  const metrics = mode === "mobile" ? { width: 390, height: 844, deviceScaleFactor: 1, mobile: true } : { width: 1920, height: 1080, deviceScaleFactor: 1, mobile: false };
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

  await send("Emulation.setDeviceMetricsOverride", { width: metrics.width, height: metrics.height, deviceScaleFactor: 1, mobile: metrics.mobile });
  await send("Page.navigate", { url });
  await new Promise((r) => setTimeout(r, 6000));

  const expr = `(() => {
    const q = (s) => document.querySelector(s);
    const rect = (s) => { const e = q(s); if (!e) return null; const r = e.getBoundingClientRect(); return { top: Math.round(r.top), left: Math.round(r.left), right: Math.round(r.right), bottom: Math.round(r.bottom), width: Math.round(r.width), height: Math.round(r.height) }; };
    const cs = (s, p) => { const e = q(s); return e ? getComputedStyle(e)[p] : null; };
    return {
      viewport: { vw: innerWidth, vh: innerHeight },
      scroll: { sw: document.body.scrollWidth, sh: document.body.scrollHeight, doc: document.documentElement.scrollHeight },
      hero: rect(".g3-home-hero"),
      stage: rect(".g3-manga-viewport"),
      hanziColor: cs(".g3-manga-subtitle-box .g3-manga-hanzi", "color"),
      actorH: rect(".g3-manga-actor-sprite") && rect(".g3-manga-actor-sprite").height,
      copyCols: getComputedStyle(q(".g3-home-hero")).gridTemplateColumns,
    };
  })()`;

  const res = await send("Runtime.evaluate", { expression: expr, returnByValue: true });
  console.log(`== ${mode} ==`);
  console.log(JSON.stringify(res.result.result.value, null, 2));

  const shot = await send("Page.captureScreenshot", { format: "png", captureBeyondViewport: false });
  const fs = await import("node:fs");
  fs.writeFileSync(process.argv[4] || `/tmp/opencode/${mode}.png`, Buffer.from(shot.result.data, "base64"));
  console.log(`saved ${process.argv[4] || `/tmp/opencode/${mode}.png`}`);
  ws.close();
  process.exit(0);
}

main().catch((e) => { console.error(e); process.exit(1); });