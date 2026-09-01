import assert from "node:assert/strict";
import { access, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const modulePath = "../../src/surfaces/group-3-8104/features/home/homeMedia.js";
const publicRoot = fileURLToPath(new URL("../../public/", import.meta.url));
const distRoot = fileURLToPath(new URL("../../dist/", import.meta.url));

async function loadHomeMedia() {
  try {
    return await import(modulePath);
  } catch {
    return {};
  }
}

test("initial Home backdrop is the only high-priority image", async () => {
  const { homeActorMedia, homeBackdropMedia, homeLogoMedia } = await loadHomeMedia();
  assert.equal(typeof homeBackdropMedia, "function", "Home responsive media contract must exist");

  const backdrop = homeBackdropMedia("scene-01-market-tea", { critical: true });
  const actor = homeActorMedia("visual-novel-characters-idle", "01-wang-laoshi-idle");
  const logo = homeLogoMedia();

  assert.equal(backdrop.fetchPriority, "high");
  assert.equal(backdrop.loading, "eager");
  assert.equal(actor.fetchPriority, "auto");
  assert.equal(logo.fetchPriority, "auto");
});

test("Home responsive media selects WebP variants sized for its rendered slots", async () => {
  const { homeActorMedia, homeBackdropMedia, homeLogoMedia } = await loadHomeMedia();
  assert.equal(typeof homeBackdropMedia, "function", "Home responsive media contract must exist");

  assert.deepEqual(homeBackdropMedia("scene-01-market-tea", { critical: true }), {
    decoding: "async",
    fetchPriority: "high",
    height: 900,
    loading: "eager",
    sizes: "(max-width: 720px) 100vw, 55vw",
    src: "/assets/group3/shared/characters/visual-novel-backgrounds/scene-01-market-tea-1200w.webp",
    srcSet: [
      "/assets/group3/shared/characters/visual-novel-backgrounds/scene-01-market-tea-480w.webp 480w",
      "/assets/group3/shared/characters/visual-novel-backgrounds/scene-01-market-tea-768w.webp 768w",
      "/assets/group3/shared/characters/visual-novel-backgrounds/scene-01-market-tea-1200w.webp 1200w",
      "/assets/group3/shared/characters/visual-novel-backgrounds/scene-01-market-tea-1600w.webp 1600w",
    ].join(", "),
    width: 1600,
  });

  assert.deepEqual(homeActorMedia("visual-novel-characters-idle", "01-wang-laoshi-idle"), {
    decoding: "async",
    fetchPriority: "auto",
    height: 540,
    loading: "eager",
    sizes: "(max-width: 720px) 42vw, 20vw",
    src: "/assets/group3/shared/characters/visual-novel-characters-idle/01-wang-laoshi-idle-480w.webp",
    srcSet: [
      "/assets/group3/shared/characters/visual-novel-characters-idle/01-wang-laoshi-idle-480w.webp 480w",
      "/assets/group3/shared/characters/visual-novel-characters-idle/01-wang-laoshi-idle-768w.webp 768w",
    ].join(", "),
    width: 360,
  });

  assert.deepEqual(homeLogoMedia(), {
    decoding: "async",
    fetchPriority: "auto",
    height: 128,
    loading: "eager",
    sizes: "58px",
    src: "/assets/group3/shared/home/brand-logo-64w.webp",
    srcSet: "/assets/group3/shared/home/brand-logo-64w.webp 64w, /assets/group3/shared/home/brand-logo-128w.webp 128w",
    width: 128,
  });
});

test("initial Home image variants stay below a 1 MiB source payload budget", async () => {
  const files = [
    "assets/group3/shared/home/brand-logo-64w.webp",
    "assets/group3/shared/characters/visual-novel-backgrounds/scene-01-market-tea-768w.webp",
    "assets/group3/shared/characters/visual-novel-characters-idle/01-wang-laoshi-idle-480w.webp",
    "assets/group3/shared/characters/visual-novel-characters-idle/02-david-idle-480w.webp",
    "assets/group3/shared/characters/visual-novel-character-poses-talk/01-wang-laoshi-talk-480w.webp",
    "assets/group3/shared/characters/visual-novel-character-poses-talk/02-david-talk-480w.webp",
  ];

  let total = 0;
  for (const relative of files) {
    const file = path.join(publicRoot, relative);
    await assert.doesNotReject(access(file), `${relative} must exist`);
    total += (await stat(file)).size;
  }
  assert.ok(total < 1024 * 1024, `initial Home image source payload is ${total} bytes`);
});

test("initial Home 768px backdrop stays within the PageSpeed transfer budget", async () => {
  const file = path.join(
    publicRoot,
    "assets/group3/shared/characters/visual-novel-backgrounds/scene-01-market-tea-768w.webp",
  );
  const bytes = (await stat(file)).size;

  assert.ok(bytes <= 50 * 1024, `initial Home 768px backdrop is ${bytes} bytes`);
});

test("route media policy keeps the Reader background off Home", async () => {
  let policy = {};
  try {
    policy = await import("../../src/surfaces/group-3-8104/shared/routeMediaPolicy.js");
  } catch {
    // RED until the route-specific policy exists.
  }

  assert.equal(typeof policy.shouldLoadReadingBackground, "function");
  assert.equal(policy.shouldLoadReadingBackground({ routeName: "home", lowData: false }), false);
  assert.equal(policy.shouldLoadReadingBackground({ routeName: "reader", lowData: false }), true);
  assert.equal(policy.shouldLoadReadingBackground({ routeName: "reader", lowData: true }), false);
});

test("production Home entry excludes route-only JavaScript and CSS payloads", async () => {
  const html = await readFile(path.join(distRoot, "index.html"), "utf8");
  const scriptPath = html.match(/<script[^>]+src="([^"]+\/index-[^"]+\.js)"/)?.[1];
  const stylesheetPath = html.match(/<link[^>]+href="([^"]+\/index-[^"]+\.css)"/)?.[1];

  assert.ok(scriptPath, "production entry script must be discoverable");
  assert.ok(stylesheetPath, "production entry stylesheet must be discoverable");

  const scriptBytes = (await stat(path.join(distRoot, scriptPath.replace(/^\//, "")))).size;
  const stylesheetBytes = (await stat(path.join(distRoot, stylesheetPath.replace(/^\//, "")))).size;

  assert.ok(scriptBytes <= 460 * 1024, `initial Home JavaScript is ${scriptBytes} bytes`);
  assert.ok(stylesheetBytes <= 250 * 1024, `initial Home CSS is ${stylesheetBytes} bytes`);
});
