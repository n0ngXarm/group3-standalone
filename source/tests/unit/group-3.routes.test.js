import assert from "node:assert/strict";
import { test } from "node:test";

import { GROUP3_LESSONS, findLesson } from "../../src/surfaces/group-3-8104/content/registry.js";
import {
  GROUP3_GAME_SLUGS,
  canonicalPathForRoute,
  frontMatterRoutes,
  gamePath,
  gamesPath,
  lessonPath,
  locationForRoute,
  normalizeSceneIndex,
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

test("all 7 curated lessons expose canonical overview, section, scene, and game routes", () => {
  assert.equal(GROUP3_LESSONS.length, 7);
  for (const lesson of GROUP3_LESSONS) {
    const lessonNumber = String(lesson.number).padStart(2, "0");
    const base = `/home/${lesson.level}/lessons/lesson-${lessonNumber}/`;
    assert.equal(lessonPath(lesson), `${base}overview/`);
    assert.equal(gamesPath(lesson), `${base}games/`);
    assert.deepEqual(frontMatterRoutes(lesson).map((item) => item.path), [
      `${base}overview/`,
      `${base}contents/`,
      `${base}vocabulary/`,
    ]);

    for (let scene = 1; scene <= (lesson.scenes?.length || 2); scene += 1) {
      const path = scenePath(lesson, scene);
      assert.equal(path, `${base}scenes/scene-0${scene}/`);
      assert.deepEqual(routeFromLocation({ pathname: path, search: "" }), {
        level: lesson.level,
        lessonSlug: lesson.slug,
        name: "reader",
        scene: scene - 1,
      });
    }

    for (const gameSlug of GROUP3_GAME_SLUGS) {
      const path = gamePath(lesson, gameSlug);
      assert.equal(path, `${base}games/${gameSlug}/`);
      assert.deepEqual(routeFromLocation({ pathname: path, search: "" }), {
        gameSlug,
        level: lesson.level,
        lessonSlug: lesson.slug,
        name: "game",
      });
    }
  }
});

test("canonical parser supports gateway mounts and lesson sections", () => {
  assert.deepEqual(
    routeFromLocation({ pathname: "/group3/home/hsk3/lessons/lesson-02/overview/", search: "" }),
    { level: "hsk3", lessonSlug: "lesson-2", name: "preface" },
  );
  assert.deepEqual(
    routeFromLocation({ pathname: "/home/hsk3/lessons/lesson-02/contents/", search: "" }),
    { level: "hsk3", lessonSlug: "lesson-2", name: "contents" },
  );
  assert.deepEqual(
    routeFromLocation({ pathname: "/home/hsk3/lessons/lesson-02/vocabulary/", search: "" }),
    { level: "hsk3", lessonSlug: "lesson-2", name: "vocabulary" },
  );
  assert.deepEqual(
    routeFromLocation({ pathname: "/home/hsk3/lessons/lesson-02/games/", search: "" }),
    { level: "hsk3", lessonSlug: "lesson-2", name: "games" },
  );
});

test("legacy lesson URLs map to canonical resources without losing lesson identity", () => {
  const legacyReader = routeFromLocation({
    pathname: "/group3/home/hsk1/lesson-2/",
    search: "?scene=2&theme=dark",
  });
  assert.deepEqual(legacyReader, {
    level: "hsk1",
    lessonSlug: "lesson-2",
    name: "reader",
    scene: 1,
  });
  assert.equal(
    canonicalPathForRoute(legacyReader),
    "/home/hsk1/lessons/lesson-02/scenes/scene-02/",
  );

  const legacyPreface = routeFromLocation({ pathname: "/home/hsk2/lesson-2/preface/", search: "" });
  assert.equal(canonicalPathForRoute(legacyPreface), "/home/hsk2/lessons/lesson-02/overview/");
  const legacyGames = routeFromLocation({ pathname: "/home/hsk3/lesson-2/games/", search: "" });
  assert.equal(canonicalPathForRoute(legacyGames), "/home/hsk3/lessons/lesson-02/games/");
});

test("unknown lessons fall back to their level catalog", () => {
  assert.deepEqual(
    routeFromLocation({ pathname: "/home/hsk1/lessons/lesson-99/scenes/scene-01/", search: "" }),
    { level: "hsk1", name: "catalog" },
  );
  assert.deepEqual(
    routeFromLocation({ pathname: "/home/hsk1/lesson-999/", search: "" }),
    { name: "catalog" },
  );
});

test("locationForRoute preserves live theme, hash, and gateway mount", () => {
  const location = {
    hash: "#old",
    hostname: "www.nongmodels.com",
    pathname: "/group3/home/hsk1/lesson-2/",
    port: "",
    protocol: "https:",
    search: "?theme=light&learner=abc&level=1&lesson=2",
  };
  const lesson = findLesson("hsk1", "lesson-2");
  assert.equal(
    locationForRoute(scenePath(lesson, 2), {
      hash: "#dialogue",
      location,
      theme: "dark",
    }),
    "/group3/home/hsk1/lessons/lesson-02/scenes/scene-02/?theme=dark#dialogue",
  );
});
