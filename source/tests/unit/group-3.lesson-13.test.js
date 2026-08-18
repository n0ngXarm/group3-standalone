import assert from "node:assert/strict";
import { access, lstat, readFile, readlink, stat } from "node:fs/promises";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

import { LESSON_13 } from "../../src/surfaces/group-3-8104/content/lessons/hsk1/lesson-13/content.js";
import {
  FEATURED_LESSON,
  GROUP3_LESSONS as GROUP3_LESSONS_META,
  findLesson,
} from "../../src/surfaces/group-3-8104/content/registry.js";
import {
  GROUP3_VOICE_CAST_REVISION,
  dialogueVoicePath,
} from "../../src/surfaces/group-3-8104/services/audio/voices.js";
import {
  GROUP3_WEBP_REVISION,
  group3AssetPath,
  group3LessonAssetPath,
  group3SceneMedia,
} from "../../src/surfaces/group-3-8104/config.js";

const GROUP3_LESSONS = await Promise.all(
  GROUP3_LESSONS_META.map((lesson) => (lesson.load ? lesson.load() : lesson)),
);
const FRONTEND_ROOT = fileURLToPath(new URL("../../", import.meta.url));
const PUBLIC_ROOT = path.join(FRONTEND_ROOT, "public");
const GROUP3_SOURCE_ROOT = new URL("../../src/surfaces/group-3-8104/", import.meta.url);

const LOCAL_PDF = /^docs\/references\/hsk\/sources\/hsk1-2\.pdf#printed-pages=.+&pdf-pages=.+$/;

function publicAssetFile(assetUrl) {
  const pathname = new URL(assetUrl, "http://group3.test").pathname
    .replace(/^\/group3(?=\/)/, "");
  assert.match(pathname, /^\/assets\/group3\//, `Group 3 public asset path: ${assetUrl}`);
  return path.join(PUBLIC_ROOT, pathname.slice(1));
}

function srcSetUrls(srcSet) {
  return String(srcSet || "")
    .split(",")
    .map((candidate) => candidate.trim().split(/\s+/)[0])
    .filter(Boolean);
}

async function group3Source(relativePath) {
  return readFile(new URL(relativePath, GROUP3_SOURCE_ROOT), "utf8");
}

test("Group 3 registry exposes all 48 lessons and preserves its featured legacy lessons", () => {
  const lessonCounts = { hsk1: 15, hsk2: 15, hsk3: 18 };

  assert.equal(GROUP3_LESSONS.length, 48);
  for (const [level, count] of Object.entries(lessonCounts)) {
    const lessons = GROUP3_LESSONS.filter((lesson) => lesson.level === level);
    assert.equal(lessons.length, count, `${level} lesson count`);
    assert.deepEqual(
      lessons.map((lesson) => lesson.number).sort((a, b) => a - b),
      Array.from({ length: count }, (_, index) => index + 1),
      `${level} lesson numbers`,
    );
    for (let number = 1; number <= count; number += 1) {
      assert.ok(findLesson(level, `lesson-${number}`), `${level} lesson-${number} registered`);
    }
  }

  assert.equal(FEATURED_LESSON, LESSON_13);
  assert.equal(findLesson("hsk1", "lesson-10")?.number, 10);
  assert.equal(findLesson("hsk1", "lesson-13"), LESSON_13);
});

const NEW_HSK1 = (item) => item.level === "hsk1" && ![10, 13].includes(item.number);

test("every new HSK1 lesson carries the HSK1 content contract", () => {
  for (const lesson of GROUP3_LESSONS.filter(NEW_HSK1)) {
    assert.ok(lesson.vocabulary.length >= 10, `${lesson.id} vocabulary count`);
    assert.ok(lesson.grammarFocus.length >= 2, `${lesson.id} grammar focus count`);
    assert.equal(lesson.scenes.length, 3, `${lesson.id} scene count`);
    assert.equal(lesson.translationPolicy.kind, "editorial-aid", `${lesson.id} translation policy`);
    assert.ok(lesson.vocabulary.every((word) => word.translationKind === "editorial-aid"), `${lesson.id} vocab translations`);
    for (const [index, scene] of lesson.scenes.entries()) {
      assert.ok(
        scene.lines.length >= 2 && scene.lines.length <= 8,
        `${lesson.id} scene ${index + 1} has ${scene.lines.length} lines (2–8)`,
      );
      assert.ok(scene.qte && scene.builder && scene.lines.length > 0, `${lesson.id} scene ${index + 1} activities`);
    }
    assert.ok(lesson.source.file, `${lesson.id} source file`);
  }
});

test("every Group 3 lesson carries the shared content contract", () => {
  const legacy = findLesson("hsk1", "lesson-10");
  assert.ok(legacy.vocabulary.length > 0 && legacy.scenes.length > 0, "legacy Lesson 10 stays readable");
  const hsk1New = GROUP3_LESSONS.filter(NEW_HSK1);
  for (const lesson of GROUP3_LESSONS.filter((item) => item.level !== "hsk1")) {
    assert.ok(lesson.vocabulary.length >= 20, `${lesson.id} vocabulary count`);
    assert.equal(lesson.grammarFocus.length, 3, `${lesson.id} grammar focus count`);
    assert.equal(lesson.scenes.length, 3, `${lesson.id} scene count`);
    assert.equal(lesson.translationPolicy.kind, "editorial-aid", `${lesson.id} translation policy`);
    for (const [index, scene] of lesson.scenes.entries()) {
      assert.ok(
        scene.lines.length >= 4 && scene.lines.length <= 9,
        `${lesson.id} scene ${index + 1} has ${scene.lines.length} lines (4–9)`,
      );
    }
    assert.ok(lesson.source.file, `${lesson.id} source file`);
  }
  for (const lesson of hsk1New) {
    assert.equal(lesson.source.file, "hsk1-2.pdf", `${lesson.id} source file`);
  }
});

test("every Group 3 learning row carries a local PDF source reference", () => {
  const pdfByLevel = {
    hsk1: /^docs\/references\/hsk\/sources\/hsk1-2\.pdf#printed-pages=.+&pdf-pages=.+$/,
    hsk2: /^docs\/references\/hsk\/sources\/hsk2\.pdf#printed-pages=.+&pdf-pages=.+$/,
    hsk3: /^docs\/references\/hsk\/sources\/hsk3\.pdf#printed-pages=.+&pdf-pages=.+$/,
  };
  for (const lesson of [
    ...GROUP3_LESSONS.filter((item) => item.level !== "hsk1"),
    ...GROUP3_LESSONS.filter(NEW_HSK1),
  ]) {
    const pattern = pdfByLevel[lesson.level];
    assert.ok(pattern, `${lesson.id} has a known level`);
    const rows = [
      lesson,
      ...lesson.objectives,
      ...lesson.contents,
      ...lesson.vocabulary,
      ...lesson.grammarFocus,
      ...lesson.scenes,
      ...lesson.scenes.flatMap((scene) => [scene.qte, scene.builder, ...scene.lines]),
    ];
    for (const row of rows) assert.match(row.sourceRef, pattern);
  }
});

test("all 48 lessons resolve every scene image and srcset candidate from public", async () => {
  for (const lesson of GROUP3_LESSONS) {
    for (const [sceneIndex, scene] of lesson.scenes.entries()) {
      assert.equal(typeof scene.image, "string", `${lesson.id}/${scene.id} image`);
      const sceneNumber = String(sceneIndex + 1).padStart(2, "0");
      const lessonNumber = String(lesson.number).padStart(2, "0");
      assert.match(
        new URL(scene.image, "http://group3.test").pathname,
        new RegExp(`/assets/group3/lessons/${lesson.level}/lesson-${lessonNumber}/scenes/scene-${sceneNumber}-1400w\\.webp$`),
      );
      const assets = [scene.image, ...srcSetUrls(scene.imageSrcSet)];
      assert.ok(assets.length >= 1, `${lesson.id}/${scene.id} image candidates`);
      for (const asset of assets) {
        await assert.doesNotReject(
          access(publicAssetFile(asset)),
          `${lesson.id}/${scene.id} missing ${asset}`,
        );
      }
    }
  }
});

test("Group 3 media uses independent WebP and dialogue voice cache revisions", () => {
  const lesson = { level: "hsk3", number: 18 };
  assert.equal(
    group3LessonAssetPath(lesson, "scenes/scene-03-1400w.webp"),
    `/assets/group3/lessons/hsk3/lesson-18/scenes/scene-03-1400w.webp?v=${GROUP3_WEBP_REVISION}`,
  );
  assert.equal(
    group3LessonAssetPath(lesson, "audio/scene-03/line-01.mp3"),
    "/assets/group3/lessons/hsk3/lesson-18/audio/scene-03/line-01.mp3",
  );
  assert.equal(
    dialogueVoicePath(lesson, 2, 0),
    `/assets/group3/lessons/hsk3/lesson-18/audio/scene-03/line-01.mp3?v=${GROUP3_VOICE_CAST_REVISION}`,
  );
  assert.deepEqual(group3SceneMedia(lesson, 2), {
    image: `/assets/group3/lessons/hsk3/lesson-18/scenes/scene-03-1400w.webp?v=${GROUP3_WEBP_REVISION}`,
    imageSrcSet: `/assets/group3/lessons/hsk3/lesson-18/scenes/scene-03-720w.webp?v=${GROUP3_WEBP_REVISION} 720w, /assets/group3/lessons/hsk3/lesson-18/scenes/scene-03-1400w.webp?v=${GROUP3_WEBP_REVISION} 1400w`,
  });
});

test("every dialogueVoicePath resolves to an MP3 and a consistent manifest entry", async () => {
  const manifestFile = path.join(PUBLIC_ROOT, "assets/group3/audio/manifest.json");
  const manifest = JSON.parse(await readFile(manifestFile, "utf8"));
  const manifestByFile = new Map(manifest.files.map((entry) => [entry.file, entry]));
  assert.equal(manifestByFile.size, manifest.files.length, "voice manifest filenames are unique");

  let expectedVoiceCount = 0;
  for (const lesson of GROUP3_LESSONS) {
    for (const [sceneIndex, scene] of lesson.scenes.entries()) {
      for (const [lineIndex, line] of scene.lines.entries()) {
        expectedVoiceCount += 1;
        const voicePath = dialogueVoicePath(lesson, sceneIndex, lineIndex);
        const voiceFile = publicAssetFile(voicePath);
        const filename = `${scene.id}-${String(lineIndex + 1).padStart(2, "0")}.mp3`;
        const entry = manifestByFile.get(filename);
        const fileStats = await stat(voiceFile);

        assert.match(filename, /\.mp3$/, `${lesson.id}/${scene.id} line ${lineIndex + 1}`);
        assert.ok(entry, `${filename} is mapped in the voice manifest`);
        const canonicalPath = new URL(voicePath, "http://group3.test").pathname
          .split("/assets/group3/")[1];
        assert.equal(entry.canonicalFile, canonicalPath, `${filename} canonical path`);
        assert.equal(entry.level, lesson.level, `${filename} level`);
        assert.equal(entry.lesson, lesson.number, `${filename} lesson`);
        assert.equal(entry.scene, sceneIndex + 1, `${filename} scene`);
        assert.equal(entry.line, lineIndex + 1, `${filename} line`);
        assert.equal(entry.text, line.hanzi, `${filename} dialogue text`);
        assert.ok(manifest.profiles[entry.profile], `${filename} profile ${entry.profile}`);
        assert.equal(entry.voice, manifest.profiles[entry.profile].voice, `${filename} profile voice`);
        assert.equal(entry.bytes, fileStats.size, `${filename} byte count`);
        assert.ok(fileStats.size > 0, `${filename} is non-empty`);
      }
    }
  }

  assert.equal(expectedVoiceCount, 868, "all Group 3 dialogue lines have local voice paths");
  assert.equal(manifest.files.length, expectedVoiceCount, "manifest has one entry per dialogue line");
});

test("Release A keeps working legacy media aliases beside canonical files", async () => {
  const aliases = [
    "assets/group3/lesson-hsk1-l1-office-v1.webp",
    "assets/group3/voices/h1l1-office-01.mp3",
    "assets/group3/voices/manifest.json",
    "assets/group3/games/vocab-blitz-960w.webp",
  ];
  for (const alias of aliases) {
    const file = path.join(PUBLIC_ROOT, alias);
    assert.equal((await lstat(file)).isSymbolicLink(), true, `${alias} is a compatibility alias`);
    assert.notEqual(await readlink(file), "", `${alias} has a relative target`);
    await assert.doesNotReject(access(file), `${alias} target resolves`);
  }
});

test("Group3App guards lazy lesson requests and keeps reader/title state keyed to the current lesson", async () => {
  const app = await group3Source("Group3App.jsx");

  assert.match(app, /const requestedLessonKey = `\$\{requestedLesson\.level\}:\$\{requestedLesson\.slug\}`/);
  assert.match(app, /setLessonRequest\(\{ data: requestedLesson, error: null, key: requestedLessonKey, status: "loading" \}\)/);
  assert.match(app, /if \(active\) setLessonRequest\(\{ data, error: null, key: requestedLessonKey, status: "ready" \}\)/);
  assert.match(app, /if \(active\) setLessonRequest\(\{ data: requestedLesson, error, key: requestedLessonKey, status: "error" \}\)/);
  assert.match(app, /const lessonRequestMatches = lessonRequest\.key === requestedLessonKey/);
  assert.match(app, /const lesson = lessonRequestMatches \? lessonRequest\.data : requestedLesson/);
  assert.match(app, /const loadedScene = lessonStatus === "ready" \? lesson\.scenes\?\.\[route\.scene\] : null/);
  assert.match(app, /\? `\$\{sceneTitle\} · \$\{text\.brand\}`/);
  assert.match(app, /`\$\{frontTitles\[route\.name\]\} · \$\{lessonTitle\} · \$\{text\.brand\}`/);
  assert.match(app, /<ReadingTheatre key=\{lesson\.id\} initialLessonId=\{lesson\.id\}/);
});

test("Group 3 lazy routes always render a non-null StoryCatalog fallback", async () => {
  const app = await group3Source("Group3App.jsx");
  const catchFallbacks = app.match(/\.catch\(\(\) => \(\{\s*default: StoryCatalog,\s*\}\)\)/g) || [];

  assert.equal(catchFallbacks.length, 2, "reader and game lazy imports catch chunk failures");
  assert.match(
    app,
    /<Suspense fallback=\{<StoryCatalog key=\{`chunk-fallback-\$\{requestedLessonKey\}`\}[\s\S]*?onRetry=\{retryLesson\} \/>\}>/,
  );
  assert.doesNotMatch(app, /<Suspense fallback=\{null\}>\{content\}<\/Suspense>/);
});

test("StoryCatalog catches stale loads and exposes retry plus loading semantics", async () => {
  const story = await group3Source("features/catalog/StoryExperience.jsx");

  assert.match(story, /\.catch\(\(error\) => \{\s*if \(active\) setActiveLessonRequest\(\{ data: meta, error, key: meta\.id, status: "error" \}\)/);
  assert.match(story, /const activeRequestMatches = activeLessonRequest\.key === activeLessonMeta\.id/);
  assert.match(story, /const lesson = activeRequestMatches \? activeLessonRequest\.data : activeLessonMeta/);
  assert.match(story, /setLoadAttempt\(\(attempt\) => attempt \+ 1\)/);
  assert.match(story, /onRetry\?\.\(\)/);
  assert.match(story, /aria-busy=\{activeLessonStatus === "loading" \? "true" : undefined\}/);
  assert.equal(
    (story.match(/activeLessonStatus === "error" \? text\.retry/g) || []).length,
    2,
    "both catalog entry actions expose retry copy",
  );
});

test("Lesson 13 matches the verified PDF content contract", () => {
  assert.equal(LESSON_13.title.zh, "请给我一杯茶");
  assert.equal(LESSON_13.source.printedPages, "95–102");
  assert.equal(LESSON_13.source.pdfPages, "111–118");
  assert.equal(LESSON_13.vocabulary.length, 20);
  assert.equal(LESSON_13.grammarFocus.length, 3);
  assert.deepEqual(LESSON_13.scenes.map((scene) => scene.lines.length), [4, 4, 6]);
  assert.deepEqual(LESSON_13.scenes.map((scene) => scene.qte.correct), ["那个小店卖不卖手机？", "牛奶", "茶"]);
  assert.deepEqual(LESSON_13.scenes.map((scene) => scene.builder.answer.join("")), [
    "你可以打电话问一下",
    "请给我一杯牛奶",
    "请给我一杯茶吧",
  ]);
});

test("every Lesson 13 learning row carries a local PDF source reference", () => {
  const rows = [
    LESSON_13,
    ...LESSON_13.objectives,
    ...LESSON_13.contents,
    ...LESSON_13.vocabulary,
    ...LESSON_13.grammarFocus,
    ...LESSON_13.scenes,
    ...LESSON_13.scenes.flatMap((scene) => [scene.qte, scene.builder, ...scene.lines]),
  ];
  for (const row of rows) assert.match(row.sourceRef, LOCAL_PDF);
});

test("Lesson 13 Thai content is explicitly editorial aid", () => {
  assert.equal(LESSON_13.translationPolicy.kind, "editorial-aid");
  assert.ok(LESSON_13.vocabulary.every((word) => word.translationKind === "editorial-aid"));
});
