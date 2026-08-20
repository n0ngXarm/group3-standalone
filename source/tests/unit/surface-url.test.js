import assert from "node:assert/strict";
import { test } from "node:test";

import {
  canonicalSurfaceLocation,
  removeLegacyLearningParams,
  surfaceAssetPath,
  surfaceHref,
  surfacePath,
} from "../../src/shared/lib/surface-url.js";

/*
Test cases:
1. Direct ports keep same-surface links local and cross-port links absolute.
2. Gateway paths retain their /central or /groupN mount.
3. Direct group subdomains keep assets local and navigate across subdomains.
4. Canonical locations preserve theme/scene/hash without retired learner state.
5. Live themes replace stale path queries and retired learning params are stripped.
6. Invalid group and asset inputs fail closed.
*/

function location(overrides = {}) {
  return {
    hash: "",
    hostname: "localhost",
    pathname: "/",
    port: "",
    protocol: "http:",
    search: "",
    ...overrides,
  };
}

test("direct ports use local paths for the current surface and absolute URLs across ports", () => {
  const directGroup1 = location({
    hostname: "127.0.0.1",
    pathname: "/home/",
    port: "8102",
  });

  assert.equal(
    surfaceHref(1, "/home/hsk1/", {
      location: directGroup1,
      sourceGroupId: 1,
      theme: "dark",
    }),
    "/home/hsk1/?theme=dark",
  );
  assert.equal(
    surfaceHref(3, "/home/", {
      location: directGroup1,
      sourceGroupId: 1,
      theme: "light",
    }),
    "http://127.0.0.1:8104/home/?theme=light",
  );
  assert.equal(
    surfaceAssetPath(1, "/assets/huayun-logo.webp", directGroup1),
    "/assets/huayun-logo.webp",
  );
});

test("gateway navigation and assets retain the target surface mount", () => {
  const gateway = location({
    hostname: "www.nongmodels.com",
    pathname: "/group3/home/",
    protocol: "https:",
  });

  assert.equal(surfacePath(3, "/home/", gateway), "/group3/home/");
  assert.equal(
    surfaceHref("central", "/", {
      location: gateway,
      sourceGroupId: 3,
      theme: "dark",
    }),
    "/central/?theme=dark",
  );
  assert.equal(
    surfaceAssetPath(3, "/covers/cover1.webp", gateway),
    "/group3/covers/cover1.webp",
  );
});

test("group subdomains keep own assets local and navigate to the requested peer subdomain", () => {
  const group3Subdomain = location({
    hostname: "group3.nongmodels.com",
    pathname: "/home/",
    protocol: "https:",
  });

  assert.equal(
    surfaceAssetPath(3, "/assets/group3/scene-cups.webp", group3Subdomain),
    "/assets/group3/scene-cups.webp",
  );
  assert.equal(
    surfaceHref(3, "/home/hsk1/", {
      location: group3Subdomain,
      sourceGroupId: 3,
      theme: "light",
    }),
    "/home/hsk1/?theme=light",
  );
  assert.equal(
    surfaceHref(4, "/home/", {
      location: group3Subdomain,
      sourceGroupId: 3,
      theme: "dark",
    }),
    "https://group4.nongmodels.com/home/?theme=dark",
  );
  assert.equal(
    surfaceHref("central", "/", {
      location: group3Subdomain,
      sourceGroupId: 3,
    }),
    "https://central.nongmodels.com/",
  );
});

test("canonical locations and legacy cleanup omit retired learner-level state", () => {
  const gateway = location({
    pathname: "/group3/home/",
    search: "?learner=abc&level=7&lesson=10&theme=light",
    hash: "#dialogue",
  });

  assert.equal(
    canonicalSurfaceLocation(3, "/home/hsk1/lesson-10/", {
      hash: "#line-2",
      location: gateway,
      scene: 2,
      theme: "dark",
    }),
    "/group3/home/hsk1/lesson-10/?theme=dark&scene=2#line-2",
  );
  assert.equal(
    removeLegacyLearningParams(gateway),
    "/group3/home/?theme=light#dialogue",
  );
});

test("live themes replace stale path queries while retired learning params are stripped", () => {
  const directGroup2 = location({
    hostname: "127.0.0.1",
    pathname: "/home/",
    port: "8103",
  });
  const gateway = location({
    hostname: "www.nongmodels.com",
    pathname: "/group2/home/",
    protocol: "https:",
  });

  const dirtyPath = "/home/hsk2/?theme=light&learner=abc&level=2&lesson=4#vocab";
  assert.equal(
    surfaceHref(2, dirtyPath, {
      location: directGroup2,
      sourceGroupId: 2,
      theme: "dark",
    }),
    "/home/hsk2/?theme=dark#vocab",
  );
  assert.equal(
    surfaceHref(5, dirtyPath, {
      location: gateway,
      sourceGroupId: 2,
      theme: "dark",
    }),
    "/group5/home/hsk2/?theme=dark#vocab",
  );
});

test("unknown surfaces and non-public asset roots are rejected", () => {
  assert.throws(() => surfacePath(6, "/"), RangeError);
  assert.throws(() => surfaceAssetPath(1, "/private/file.json"), TypeError);
});
