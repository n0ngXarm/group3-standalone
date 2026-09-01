import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import { JSDOM } from "jsdom";

test("font stylesheet loads outside the render path with a no-script fallback", async () => {
  const html = await readFile(new URL("../../index.html", import.meta.url), "utf8");
  const document = new JSDOM(html).window.document;
  const stylesheet = document.querySelector('link[rel="preload"][as="style"][href*="fonts.googleapis.com"]');

  assert.ok(stylesheet, "Google Fonts must preload without blocking first render");
  assert.match(stylesheet.getAttribute("onload") || "", /this\.rel=['"]stylesheet['"]/);
  assert.equal(
    document.querySelector('head > link[rel="stylesheet"][href*="fonts.googleapis.com"]'),
    null,
    "Google Fonts must not remain a blocking stylesheet outside noscript",
  );

  assert.ok(
    document.querySelector('noscript link[rel="stylesheet"][href*="fonts.googleapis.com"]'),
    "Google Fonts must remain available when JavaScript is disabled",
  );

  const href = stylesheet.getAttribute("href");
  assert.match(href, /Noto\+Sans\+SC:wght@400\.\.900/);
  assert.match(href, /Noto\+Sans\+Thai:wght@400\.\.800/);
  assert.match(href, /Noto\+Serif\+SC:wght@500\.\.900/);
  assert.match(href, /Noto\+Serif\+Thai:wght@500\.\.700/);
  assert.match(href, /Space\+Grotesk:wght@500\.\.800/);
  assert.match(href, /display=swap$/);
  assert.doesNotMatch(href, /wght@[0-9]+;/, "discrete weights duplicate large unicode-range CSS blocks");
});
