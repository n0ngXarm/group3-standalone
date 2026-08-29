import assert from "node:assert/strict";
import { lstat, readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => {
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(target) : [target];
  }));
  return nested.flat();
}

test("standalone source contains only the Group 3 surface", async () => {
  const surfaceRoot = path.join(root, "src/surfaces");
  assert.deepEqual(await readdir(surfaceRoot), ["group-3-8104"]);
  const loader = await readFile(path.join(root, "src/app/SurfaceLoader.jsx"), "utf8");
  assert.match(loader, /group-3-8104/);
  assert.doesNotMatch(loader, /surface-registry|central|group-[1245]-/);
  const files = await walk(path.join(root, "src"));
  for (const file of files.filter((item) => /\.(?:js|jsx)$/.test(item))) {
    const source = await readFile(file, "utf8");
    assert.doesNotMatch(source, /surfaces\/(?:central|group-[1245])-/, file);
  }
});

test("standalone package contains all lessons and local media", async () => {
  const lessons = (await walk(path.join(root, "src/surfaces/group-3-8104/content/lessons")))
    .filter((file) => file.endsWith("/content.js"));
  assert.equal(lessons.length, 7);
  const media = await walk(path.join(root, "public/assets/group3"));
  const mediaStats = await Promise.all(media.map(async (file) => ({ file, info: await lstat(file) })));
  assert.ok(mediaStats.filter(({ file, info }) => file.endsWith(".mp3") && (info.isFile() || info.isSymbolicLink())).length >= 54);
  assert.ok(mediaStats.filter(({ file, info }) => file.endsWith(".webp") && (info.isFile() || info.isSymbolicLink())).length >= 28);
});

test("standalone package excludes secrets and unrelated public trees", async () => {
  for (const relative of [".env", ".git", "public/covers"]) {
    await assert.rejects(stat(path.join(root, relative)));
  }
  assert.deepEqual((await readdir(path.join(root, "public"))).sort(), [
    "assets", "favicon.png", "favicon.svg", "icons.svg", "theme-init.js",
  ]);
  assert.deepEqual(await readdir(path.join(root, "public/assets")), ["group3"]);
});

test("standalone metadata and navigation expose Group 3 only", async () => {
  const html = await readFile(path.join(root, "index.html"), "utf8");
  const app = await readFile(path.join(root, "src/surfaces/group-3-8104/Group3App.jsx"), "utf8");
  const layout = await readFile(
    path.join(root, "src/surfaces/group-3-8104/shared/components/StoryLayout.jsx"),
    "utf8",
  );
  assert.match(html, /Group 3/);
  assert.doesNotMatch(html, /5 groups|5 กลุ่ม/);
  assert.doesNotMatch(app, /surfaceHref\("central"|onCentral=/);
  assert.doesNotMatch(layout, /surfaceHref\("central"|GROUP_MENU\.map/);
});

test("home hero renders independent background and character pose layers", async () => {
  const layout = await readFile(
    path.join(root, "src/surfaces/group-3-8104/shared/components/StoryLayout.jsx"),
    "utf8",
  );
  const styles = await readFile(
    path.join(root, "src/surfaces/group-3-8104/styles/ui-polish.css"),
    "utf8",
  );
  assert.doesNotMatch(layout, /onPointerMove|onPointerLeave|moveScene|resetScene/);
  assert.match(styles, /@keyframes g3-seller-action-frame/);
  assert.match(styles, /@keyframes g3-male-action-frame/);
  assert.match(styles, /@keyframes g3-female-action-frame/);
  assert.match(styles, /\.g3-anime-dialogue \{[^}]*bottom: 0;[^}]*right: 0;[^}]*left: 0;[^}]*width: auto;[^}]*max-width: none;[^}]*text-align: center;/s);
  assert.match(styles, /\.g3-anime-scene-mark \{[^}]*left: 1rem;/s);
  assert.doesNotMatch(layout, /g3-anime-voice-pulse/);
  assert.doesNotMatch(styles, /g3-anime-(?:camera|light-pass|scene-beat|voice-wave)/);
});

test("home uses one ability-led HSK selector without lesson previews", async () => {
  const experience = await readFile(
    path.join(root, "src/surfaces/group-3-8104/features/catalog/StoryExperience.jsx"),
    "utf8",
  );
  const carousel = await readFile(
    path.join(root, "src/surfaces/group-3-8104/features/catalog/HomeCarousel.jsx"),
    "utf8",
  );
  const styles = await readFile(
    path.join(root, "src/surfaces/group-3-8104/styles/ui-polish.css"),
    "utf8",
  );
  // Home has exactly one ability-led CTA and no guide/catalog extras.
  assert.doesNotMatch(experience, /className="g3-level-gate"/);
  assert.match(experience, /g3-home-cta-primary/);
  assert.doesNotMatch(experience, /g3-wow-button-secondary|GuideModal|setGuideOpen/);
  assert.doesNotMatch(experience, /g3-home-text-link/);
  assert.match(experience, /scenePath\(featured, 1\)/);
  assert.doesNotMatch(experience, /g3-home-feature-bar|FeatureDemoModal|g3-feature-showcase/);
  for (const level of ["hsk1", "hsk2", "hsk3"]) {
    for (const width of [720, 1440]) {
      const asset = await stat(path.join(root, `public/assets/group3/shared/level-paths/${level}-path-v2-${width}w.webp`));
      assert.ok(asset.size > 40_000, `${level} ${width}w cover should be a real optimized image`);
    }
  }
  // 5-slide animated manga carousel with dots and a vocab jump pill.
  assert.match(carousel, /SCENARIOS\.map/);
  assert.match(carousel, /ScenarioMangaStage/);
  assert.match(carousel, /className="g3-vocab-pill"/);
  assert.match(carousel, /lessonPath\(lesson, "vocabulary"\)/);
  assert.match(experience, /import \{ HomeCarousel \}/);
  assert.doesNotMatch(experience, /FEATURED_SCENES|StoryPreview|g3-scene-preview/);
  assert.match(styles, /\.g3-level-option\.is-hsk1 \{[^}]*grid-row: 1 \/ 3;/s);
  assert.match(styles, /\.g3-level-option\.is-hsk2 \{[^}]*grid-template-areas: "copy visual";/s);
  assert.match(styles, /\.g3-level-option\.is-hsk3 \{[^}]*grid-template-areas: "visual copy";/s);
  assert.match(styles, /\.g3-level-visual \{[^}]*position: relative;/s);
  assert.match(styles, /\.g3-level-copy \{[^}]*color: var\(--g3-ink\);[^}]*background:/s);
  assert.doesNotMatch(styles, /\.g3-story-shell \.g3-level-option \{[^}]*color: #fff8e8;/s);
  assert.match(styles, /\.g3-level-difficulty-steps > i\.is-active/);
});

test("standalone dev server uses the Group 3 mount path", async () => {
  const packageJson = JSON.parse(await readFile(path.join(root, "package.json"), "utf8"));
  assert.match(packageJson.scripts.dev, /--base \/group3\//);
});

test("React entrypoint reuses one root during Vite hot updates", async () => {
  const main = await readFile(path.join(root, "src/main.jsx"), "utf8");
  assert.match(main, /window\.__HUAYUN_REACT_ROOT__ \|\| createRoot\(rootElement\)/);
  assert.match(main, /window\.__HUAYUN_REACT_ROOT__ = appRoot/);
  assert.match(main, /appRoot\.render\(/);
});
