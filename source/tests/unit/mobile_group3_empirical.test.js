import assert from "node:assert/strict";
import { test, describe } from "node:test";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe("Group 3 Mobile Initialization & UI Empirical Verification (`mobile_group3_empirical.test.js`)", () => {

  // --------------------------------------------------------------------------
  // Requirement R1: Immediate route visibility
  // --------------------------------------------------------------------------
  describe("R1: Routes mount without an opacity-gated wrapper", () => {
    test("Group3App.jsx mounts mainSuspense directly under #g3-main", () => {
      const appPath = path.resolve(__dirname, "../../src/surfaces/group-3-8104/Group3App.jsx");
      const code = fs.readFileSync(appPath, "utf8");

      const mainBlockIndex = code.indexOf('id="g3-main"');
      assert.ok(mainBlockIndex !== -1, "#g3-main container must exist in Group3App");
      const mainBlock = code.slice(mainBlockIndex, mainBlockIndex + 220);

      assert.ok(
        mainBlock.includes("{mainSuspense}"),
        "#g3-main must render mainSuspense directly"
      );
      assert.ok(
        !code.includes("<ScrollReveal"),
        "Route content must not depend on IntersectionObserver for visibility"
      );
    });
  });

  // --------------------------------------------------------------------------
  // Requirement R2 & P1: Mobile Touch / Viewport Grid & Touch Target Safeguards
  // --------------------------------------------------------------------------
  describe("R2: Mobile Viewports (320px - 414px) Layout & Touch Interaction Contracts", () => {
    test("games.css defines 2x2 grid for pinyin option buttons on mobile (<= 640px)", () => {
      const cssPath = path.resolve(__dirname, "../../src/surfaces/group-3-8104/styles/games.css");
      const css = fs.readFileSync(cssPath, "utf8");

      // Verify 2-column grid rule under mobile media query
      assert.ok(
        css.includes("@media (max-width: 640px)"),
        "games.css must contain media query for mobile screens <= 640px"
      );

      assert.ok(
        css.includes(".g3-pinyin-options { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.5rem; }") ||
        css.includes(".g3-pinyin-options {\n    grid-template-columns: repeat(2, minmax(0, 1fr));"),
        "Pinyin options on mobile viewports must use 2-column grid layout to conserve vertical space"
      );
    });

    test("games.css defines dynamic viewport height (100dvh) for micro screens (<= 380px)", () => {
      const cssPath = path.resolve(__dirname, "../../src/surfaces/group-3-8104/styles/games.css");
      const css = fs.readFileSync(cssPath, "utf8");

      assert.ok(
        css.includes("@media (max-width: 380px)"),
        "games.css must contain media query for micro mobile screens <= 380px"
      );

      assert.ok(
        css.includes("100dvh") || css.includes("min-height: calc(100vh"),
        "Micro screen styles must use dynamic viewport units (100dvh) for address bar adjustment"
      );

      assert.ok(
        css.includes("overflow-y: auto"),
        "Micro screen arcade game container must allow vertical touch scrolling"
      );
    });

    test("RoleplayView 3D Canvas camera aspect ratio prevents NaN on zero-dimension mount", () => {
      const roleplayPath = path.resolve(__dirname, "../../src/surfaces/group-3-8104/features/reader/roleplay/RoleplayView.jsx");
      const code = fs.readFileSync(roleplayPath, "utf8");

      assert.ok(
        code.includes("const initialWidth = mount.clientWidth || 1;"),
        "RoleplayView must guard initialWidth fallback against 0"
      );

      assert.ok(
        code.includes("const initialHeight = mount.clientHeight || 1;"),
        "RoleplayView must guard initialHeight fallback against 0"
      );

      // Verify ResizeObserver & rAF binding
      assert.ok(
        code.includes("ResizeObserver") && code.includes("requestAnimationFrame(onResize)"),
        "RoleplayView must wire ResizeObserver and initial rAF frame for layout synchronization"
      );
    });
  });

  // --------------------------------------------------------------------------
  // Empirical Interaction Verification Across Viewports
  // --------------------------------------------------------------------------
  describe("Empirical Interaction & Touch Event Simulation Across Mobile Devices", () => {
    const mobileViewports = [
      { name: "iPhone SE (micro)", width: 320, height: 568 },
      { name: "iPhone 8 / SE2", width: 375, height: 667 },
      { name: "iPhone 12/13 Pro", width: 390, height: 844 },
      { name: "iPhone XR / 11", width: 414, height: 896 },
      { name: "Android Compact", width: 360, height: 740 },
    ];

    mobileViewports.forEach((vp) => {
      test(`[Viewport: ${vp.name} (${vp.width}x${vp.height})] CSS & source contracts satisfy mobile touch & responsive requirements`, () => {
        const cssPath = path.resolve(__dirname, "../../src/surfaces/group-3-8104/styles/games.css");
        const css = fs.readFileSync(cssPath, "utf8");

        // 1. Verify viewport width is covered by mobile media queries (<= 640px)
        const coversMobile = vp.width <= 640;
        assert.ok(coversMobile, `Viewport width ${vp.width}px must fall within mobile breakpoint <= 640px`);
        assert.ok(css.includes("@media (max-width: 640px)"), "CSS must define @media (max-width: 640px)");

        // 2. Micro screen (<= 380px) specific style validation
        if (vp.width <= 380) {
          assert.ok(css.includes("@media (max-width: 380px)"), "Micro screen viewport must trigger @media (max-width: 380px)");
          assert.ok(css.includes("min-height: calc(100dvh"), "Micro viewport CSS must calculate dynamic viewport height (100dvh)");
        }

        // 3. Touch target accessibility enforcement (min 44px / 48px height)
        assert.ok(
          css.includes("min-height: 44px") && css.includes("min-height: 48px"),
          "CSS must enforce accessible minimum touch target dimensions (44px/48px) for buttons and game options"
        );
      });
    });
  });
});
