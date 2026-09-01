import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import { JSDOM } from "jsdom";

test("font stylesheet exposes continuous weight ranges without duplicate face matrices", async () => {
  const html = await readFile(new URL("../../index.html", import.meta.url), "utf8");
  const document = new JSDOM(html).window.document;
  const stylesheet = document.querySelector('link[rel="stylesheet"][href*="fonts.googleapis.com"]');

  assert.ok(stylesheet, "Google Fonts stylesheet must remain available for multilingual identity");
  const href = stylesheet.getAttribute("href");
  assert.match(href, /Noto\+Sans\+SC:wght@400\.\.900/);
  assert.match(href, /Noto\+Sans\+Thai:wght@400\.\.800/);
  assert.match(href, /Noto\+Serif\+SC:wght@500\.\.900/);
  assert.match(href, /Noto\+Serif\+Thai:wght@500\.\.700/);
  assert.match(href, /Space\+Grotesk:wght@500\.\.800/);
  assert.match(href, /display=swap$/);
  assert.doesNotMatch(href, /wght@[0-9]+;/, "discrete weights duplicate large unicode-range CSS blocks");
});
