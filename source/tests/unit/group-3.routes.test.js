import assert from "node:assert/strict";
import { test } from "node:test";

import { GROUP3_LESSONS, findLesson } from "../../src/surfaces/group-3-8104/content/registry.js";
import * as routes from "../../src/surfaces/group-3-8104/routing/routes.js";
import {
  GROUP3_LEVELS,
  GROUP3_PRACTICE_TYPES,
  canonicalPathForRoute,
  frontMatterRoutes,
  homePath,
  levelsPath,
  levelPath,
  lessonBasePath,
  lessonContentsPath,
  lessonVocabularyPath,
  lessonScenePath,
  lessonPath,
  locationForRoute,
  normalizeSceneIndex,
  practiceExercisePath,
  practicePath,
  practiceSummaryPath,
  routeFromLocation,
  scenePath,
} from "../../src/surfaces/group-3-8104/routing/routes.js";

test("legacy scene query normalization stays bounded", () => {
  assert.equal(normalizeSceneIndex("?scene=1"), 0);
  assert.equal(normalizeSceneIndex("?scene=2"), 1);
  assert.equal(normalizeSceneIndex("?scene=3"), 2);
  for (const search of ["", "?scene=", "?scene=foo", "?scene=1.5", "?scene=Infinity", "?scene=-4"]) {
    assert.equal(normalizeSceneIndex(search), 0);
  }
  assert.equal(normalizeSceneIndex("?scene=999"), 2);
});

test("canonical route builders generate exact hierarchical paths", () => {
  assert.equal(homePath(), "/home/");
  assert.equal(levelsPath(), "/home/levels/");

  for (const level of ["hsk1", "hsk2", "hsk3"]) {
    assert.equal(levelPath(level), `/home/${level}/`);
    assert.equal(practicePath(level), `/home/${level}/practice/`);
    assert.equal(practiceSummaryPath(level), `/home/${level}/practice/summary/`);

    for (const type of GROUP3_PRACTICE_TYPES) {
      assert.equal(practiceExercisePath(level, type), `/home/${level}/practice/${type}/`);
    }

    assert.equal(lessonContentsPath(level, "lesson-01"), `/home/${level}/lessons/lesson-01/contents/`);
    assert.equal(lessonVocabularyPath(level, "lesson-01"), `/home/${level}/lessons/lesson-01/vocabulary/`);
    assert.equal(lessonScenePath(level, "lesson-01", "scene-01"), `/home/${level}/lessons/lesson-01/scenes/scene-01/`);
    assert.equal(lessonScenePath(level, "lesson-01", "scene-02"), `/home/${level}/lessons/lesson-01/scenes/scene-02/`);
  }
});

test("all curated lessons expose canonical contents, vocabulary, and scene routes", () => {
  assert.equal(GROUP3_LESSONS.length, 7);
  for (const lesson of GROUP3_LESSONS) {
    const lessonNumber = String(lesson.number).padStart(2, "0");
    const base = `/home/${lesson.level}/lessons/lesson-${lessonNumber}/`;
    assert.equal(lessonContentsPath(lesson), `${base}contents/`);
    assert.equal(lessonVocabularyPath(lesson), `${base}vocabulary/`);
    assert.deepEqual(frontMatterRoutes(lesson).map((item) => item.path), [
      `${base}contents/`,
      `${base}vocabulary/`,
    ]);

    for (let scene = 1; scene <= (lesson.scenes?.length || 3); scene += 1) {
      const sceneSeg = `scene-0${scene}`;
      const path = lessonScenePath(lesson, scene);
      assert.equal(path, `${base}scenes/${sceneSeg}/`);
      assert.deepEqual(routeFromLocation({ pathname: path, search: "" }), {
        level: lesson.level,
        lessonSlug: lesson.slug,
        name: "reader",
        scene: scene - 1,
      });
      assert.equal(canonicalPathForRoute({ level: lesson.level, lessonSlug: lesson.slug, name: "reader", scene: scene - 1 }), path);
    }
  }
});

test("canonical parser supports gateway mounts and lesson sections", () => {
  assert.deepEqual(
    routeFromLocation({ pathname: "/home/hsk3/lessons/lesson-02/contents/", search: "" }),
    { level: "hsk3", lessonSlug: "lesson-2", name: "contents" },
  );
  assert.deepEqual(
    routeFromLocation({ pathname: "/group3/home/hsk3/lessons/lesson-02/contents/", search: "" }),
    { level: "hsk3", lessonSlug: "lesson-2", name: "contents" },
  );
  assert.deepEqual(
    routeFromLocation({ pathname: "/home/hsk3/lessons/lesson-02/vocabulary/", search: "" }),
    { level: "hsk3", lessonSlug: "lesson-2", name: "vocabulary" },
  );
  assert.deepEqual(
    routeFromLocation({ pathname: "/group3/home/hsk3/lessons/lesson-02/vocabulary/", search: "" }),
    { level: "hsk3", lessonSlug: "lesson-2", name: "vocabulary" },
  );
});

test("practice routes match summary before generic exercise and reject unknown types", () => {
  for (const level of GROUP3_LEVELS) {
    assert.equal(practicePath(level), `/home/${level}/practice/`);
    assert.deepEqual(routeFromLocation({ pathname: `/group3/home/${level}/practice/`, search: "" }), {
      level,
      name: "practice",
    });

    // Summary matches first
    assert.equal(practiceSummaryPath(level), `/home/${level}/practice/summary/`);
    assert.deepEqual(routeFromLocation({ pathname: `/home/${level}/practice/summary/`, search: "" }), {
      level,
      name: "practice-summary",
    });
    assert.equal(canonicalPathForRoute({ level, name: "practice-summary" }), `/home/${level}/practice/summary/`);

    for (const exerciseType of GROUP3_PRACTICE_TYPES) {
      const path = `/home/${level}/practice/${exerciseType}/`;
      assert.equal(practiceExercisePath(level, exerciseType), path);
      assert.deepEqual(routeFromLocation({ pathname: `/group3${path}`, search: "" }), {
        exerciseType,
        level,
        name: "practice-exercise",
      });
      assert.equal(canonicalPathForRoute({ exerciseType, level, name: "practice-exercise" }), path);
    }

    assert.equal(practiceExercisePath(level, "unknown"), `/home/${level}/practice/`);
    assert.deepEqual(routeFromLocation({ pathname: `/home/${level}/practice/unknown/`, search: "" }), {
      level,
      name: "practice",
      redirect: true,
    });
  }

  // Invalid level for practice falls back to levels
  assert.equal(practicePath("hsk9"), "/home/levels/");
  assert.deepEqual(routeFromLocation({ pathname: "/home/hsk9/practice/", search: "" }), {
    name: "levels",
    redirect: true,
  });
});

test("legacy routes and overview/games redirect cleanly to canonical targets", () => {
  // Lesson root redirect to /contents/
  assert.deepEqual(
    routeFromLocation({ pathname: "/home/hsk1/lessons/lesson-01/", search: "" }),
    { level: "hsk1", lessonSlug: "lesson-1", name: "contents", redirect: true },
  );

  // Overview & Preface redirect to /contents/
  assert.deepEqual(
    routeFromLocation({ pathname: "/home/hsk1/lessons/lesson-01/overview/", search: "" }),
    { level: "hsk1", lessonSlug: "lesson-1", name: "contents", redirect: true },
  );
  assert.deepEqual(
    routeFromLocation({ pathname: "/home/hsk2/lessons/lesson-02/preface/", search: "" }),
    { level: "hsk2", lessonSlug: "lesson-2", name: "contents", redirect: true },
  );

  // Games redirect to /contents/
  assert.deepEqual(
    routeFromLocation({ pathname: "/home/hsk1/lessons/lesson-01/games/", search: "" }),
    { level: "hsk1", lessonSlug: "lesson-1", name: "contents", redirect: true },
  );
  assert.deepEqual(
    routeFromLocation({ pathname: "/home/hsk1/lessons/lesson-01/games/card-frenzy/", search: "" }),
    { level: "hsk1", lessonSlug: "lesson-1", name: "contents", redirect: true },
  );

  // Legacy flat paths redirect
  const legacyReader = routeFromLocation({
    pathname: "/group3/home/hsk1/lesson-2/",
    search: "?scene=2&theme=dark",
  });
  assert.deepEqual(legacyReader, {
    level: "hsk1",
    lessonSlug: "lesson-2",
    name: "contents",
    redirect: true,
  });
});

test("invalid route normalization redirects safely", () => {
  // Invalid HSK level
  assert.deepEqual(
    routeFromLocation({ pathname: "/home/hsk4/", search: "" }),
    { name: "levels", redirect: true },
  );
  assert.deepEqual(
    routeFromLocation({ pathname: "/home/random/", search: "" }),
    { name: "levels", redirect: true },
  );

  // Invalid lesson
  assert.deepEqual(
    routeFromLocation({ pathname: "/home/hsk1/lessons/not-real/contents/", search: "" }),
    { level: "hsk1", name: "catalog", redirect: true },
  );

  // Invalid scene index redirects to contents
  assert.deepEqual(
    routeFromLocation({ pathname: "/home/hsk1/lessons/lesson-01/scenes/scene-99/", search: "" }),
    { level: "hsk1", lessonSlug: "lesson-1", name: "contents", redirect: true },
  );
  assert.deepEqual(
    routeFromLocation({ pathname: "/home/hsk1/lessons/lesson-01/scenes/invalid/", search: "" }),
    { level: "hsk1", lessonSlug: "lesson-1", name: "contents", redirect: true },
  );
});

test("centralized route relationship table (Section 27)", () => {
  const routeTable = [
    // Catalog back -> Levels
    { from: "/home/hsk1/", action: "back", expected: "/home/levels/" },
    { from: "/home/hsk2/", action: "back", expected: "/home/levels/" },
    { from: "/home/hsk3/", action: "back", expected: "/home/levels/" },

    // Contents back -> Catalog
    { from: "/home/hsk1/lessons/lesson-01/contents/", action: "back", expected: "/home/hsk1/" },
    { from: "/home/hsk2/lessons/lesson-01/contents/", action: "back", expected: "/home/hsk2/" },
    { from: "/home/hsk3/lessons/lesson-01/contents/", action: "back", expected: "/home/hsk3/" },

    // Vocabulary back -> Contents
    { from: "/home/hsk1/lessons/lesson-01/vocabulary/", action: "back", expected: "/home/hsk1/lessons/lesson-01/contents/" },

    // Scene back -> Contents
    { from: "/home/hsk1/lessons/lesson-01/scenes/scene-01/", action: "back", expected: "/home/hsk1/lessons/lesson-01/contents/" },

    // Practice Hub back -> Catalog
    { from: "/home/hsk1/practice/", action: "back", expected: "/home/hsk1/" },
    { from: "/home/hsk2/practice/", action: "back", expected: "/home/hsk2/" },
    { from: "/home/hsk3/practice/", action: "back", expected: "/home/hsk3/" },

    // Practice Exercises back -> Practice Hub
    { from: "/home/hsk1/practice/repeat-sentence/", action: "back", expected: "/home/hsk1/practice/" },
    { from: "/home/hsk1/practice/image-description/", action: "back", expected: "/home/hsk1/practice/" },
    { from: "/home/hsk1/practice/question-response/", action: "back", expected: "/home/hsk1/practice/" },

    // Practice Summary actions
    { from: "/home/hsk1/practice/summary/", action: "retry", expected: "/home/hsk1/practice/" },
    { from: "/home/hsk1/practice/summary/", action: "levels", expected: "/home/levels/" },
  ];

  for (const row of routeTable) {
    if (row.action === "back") {
      if (row.from === "/home/hsk1/") assert.equal(levelsPath(), row.expected);
      if (row.from === "/home/hsk1/lessons/lesson-01/contents/") assert.equal(levelPath("hsk1"), row.expected);
      if (row.from === "/home/hsk1/lessons/lesson-01/vocabulary/") assert.equal(lessonContentsPath("hsk1", "lesson-01"), row.expected);
      if (row.from === "/home/hsk1/lessons/lesson-01/scenes/scene-01/") assert.equal(lessonContentsPath("hsk1", "lesson-01"), row.expected);
      if (row.from === "/home/hsk1/practice/") assert.equal(levelPath("hsk1"), row.expected);
      if (row.from.includes("/practice/repeat-sentence/")) assert.equal(practicePath("hsk1"), row.expected);
    }
    if (row.action === "retry") assert.equal(practicePath("hsk1"), row.expected);
    if (row.action === "levels") assert.equal(levelsPath(), row.expected);
  }
});

test("locationForRoute preserves the validated theme with the gateway mount", () => {
  const location = {
    hash: "#old",
    hostname: "www.nongmodels.com",
    pathname: "/group3/home/hsk1/lessons/lesson-02/contents/",
    port: "",
    protocol: "https:",
    search: "?theme=light&learner=abc&level=1&lesson=2",
  };
  const lesson = findLesson("hsk1", "lesson-2");
  assert.equal(
    locationForRoute(lessonScenePath(lesson, 2), {
      hash: "#dialogue",
      location,
      theme: "dark",
    }),
    "/group3/home/hsk1/lessons/lesson-02/scenes/scene-02/?theme=dark#dialogue",
  );
});
