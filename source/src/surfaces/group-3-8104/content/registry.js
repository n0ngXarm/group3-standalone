import { group3SceneMedia } from "../config.js";
import {
  builderPinyin,
  LESSON_CONTENT_OVERRIDES,
  SCENE_CONTENT_OVERRIDES,
  SCENE_MEDIA_SOURCES,
  VOCABULARY_HANZI_BY_LESSON,
} from "./contentOwnership.js";

import { LESSON_HSK1_L1 } from "./lessons/hsk1/lesson-01/content.js";
import { LESSON_HSK1_L2 } from "./lessons/hsk1/lesson-02/content.js";
import { LESSON_HSK1_L3 } from "./lessons/hsk1/lesson-03/content.js";

export function withCanonicalLessonMedia(lesson) {
  if (!lesson?.scenes) return lesson;
  const lessonOverride = LESSON_CONTENT_OVERRIDES[lesson.id];
  if (lessonOverride?.title) lesson.title = { ...lesson.title, ...lessonOverride.title };

  const vocabularyOwnership = VOCABULARY_HANZI_BY_LESSON[lesson.id];
  if (vocabularyOwnership) {
    const ownedHanzi = new Set(vocabularyOwnership);
    lesson.vocabulary = lesson.vocabulary.filter((word) => ownedHanzi.has(word.hanzi));
  }
  lesson.vocabulary.forEach((word, wordIndex) => {
    word.id = `${lesson.id}-vocab-${String(wordIndex + 1).padStart(3, "0")}`;
    word.lessonId = lesson.id;
  });

  lesson.scenes.forEach((scene, sceneIndex) => {
    const sceneOverride = SCENE_CONTENT_OVERRIDES[scene.id];
    if (sceneOverride?.context) scene.context = sceneOverride.context;
    if (sceneOverride?.qtePromptTh) scene.qte.prompt.th = sceneOverride.qtePromptTh;
    scene.lessonId = lesson.id;
    scene.slug = scene.slug || `scene-${sceneIndex + 1}`;
    Object.assign(scene, group3SceneMedia(lesson, sceneIndex, SCENE_MEDIA_SOURCES[scene.id]));
    scene.characters.forEach((character) => {
      character.image = scene.image;
      character.imageSrcSet = scene.imageSrcSet;
    });

    scene.lines.forEach((line, lineIndex) => {
      line.id = `${scene.id}-line-${String(lineIndex + 1).padStart(2, "0")}`;
      line.lessonId = lesson.id;
      line.sceneId = scene.id;
    });
    scene.qte.id = `${scene.id}-qte`;
    scene.qte.lessonId = lesson.id;
    scene.qte.sceneId = scene.id;
    scene.builder.id = `${scene.id}-builder`;
    scene.builder.lessonId = lesson.id;
    scene.builder.sceneId = scene.id;
    scene.builder.pinyin = builderPinyin(scene.id);
  });
  return lesson;
}

export const GROUP3_LESSONS = [
  withCanonicalLessonMedia(LESSON_HSK1_L1),
  withCanonicalLessonMedia(LESSON_HSK1_L2),
  withCanonicalLessonMedia(LESSON_HSK1_L3),
  {
    id: "hsk2-l1",
    slug: "lesson-1",
    level: "hsk2",
    number: 1,
    title: {"zh":"北京之旅与朋友聚餐","pinyin":"Běijīng zhī lǚ yǔ péngyou jùcān","en":"Beijing Trip and Dining with Friends","thAid":"ทริปปักกิ่งและทานอาหารกับเพื่อน"},
    load: () => import("./lessons/hsk2/lesson-01/content.js").then(m => withCanonicalLessonMedia(m.LESSON_HSK2_L1))
  },
  {
    id: "hsk2-l2",
    slug: "lesson-2",
    level: "hsk2",
    number: 2,
    title: {"zh":"都市生活与生日聚会","pinyin":"Dūshì shēnghuó yǔ shēngrì jùhuì","en":"City Life and Birthday Celebration","thAid":"ชีวิตในเมืองและงานเลี้ยงวันเกิด"},
    load: () => import("./lessons/hsk2/lesson-02/content.js").then(m => withCanonicalLessonMedia(m.LESSON_HSK2_L2))
  },
  {
    id: "hsk3-l1",
    slug: "lesson-1",
    level: "hsk3",
    number: 1,
    title: {"zh":"饭馆美食与高铁之旅","pinyin":"Fànguǎn měishí yǔ gāotiě zhī lǚ","en":"Restaurant Food and High-Speed Train Journey","thAid":"อาหารในร้านและทริปรถไฟความเร็วสูง"},
    load: () => import("./lessons/hsk3/lesson-01/content.js").then(m => withCanonicalLessonMedia(m.LESSON_HSK3_L1))
  },
  {
    id: "hsk3-l2",
    slug: "lesson-2",
    level: "hsk3",
    number: 2,
    title: {"zh":"职场协作与包饺子过年","pinyin":"Zhíchǎng xiézuò yǔ bāo jiǎozi guònián","en":"Workplace Collaboration and New Year Dumplings","thAid":"การทำงานร่วมกันและการห่อเกี๊ยวฉลองตรุษจีน"},
    load: () => import("./lessons/hsk3/lesson-02/content.js").then(m => withCanonicalLessonMedia(m.LESSON_HSK3_L2))
  },
];

export const FEATURED_LESSON = withCanonicalLessonMedia(LESSON_HSK1_L1);
export const GROUP3_CATALOG_PATH = "/home/hsk1/";

export const FEATURED_SCENES = [
  ...LESSON_HSK1_L1.scenes.map((scene, sceneIndex) => ({ ...scene, lesson: LESSON_HSK1_L1, sceneIndex })),
];

export function findLesson(level, slug) {
  return GROUP3_LESSONS.find((lesson) => lesson.level === level && lesson.slug === slug) || null;
}
