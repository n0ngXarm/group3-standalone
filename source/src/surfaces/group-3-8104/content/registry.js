import { group3SceneMedia } from "../config.js";

import { LESSON_HSK1_L1 } from "./lessons/hsk1/lesson-01/content.js";
import { LESSON_HSK1_L2 } from "./lessons/hsk1/lesson-02/content.js";
import { LESSON_HSK1_L3 } from "./lessons/hsk1/lesson-03/content.js";

export function withCanonicalLessonMedia(lesson) {
  if (!lesson?.scenes) return lesson;
  lesson.scenes.forEach((scene, sceneIndex) => {
    Object.assign(scene, group3SceneMedia(lesson, sceneIndex));
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
    title: {"zh":"新居生活与高铁之旅","pinyin":"Xīnjū shēnghuó yǔ gāotiě zhī lǚ","en":"New Home and High-Speed Train Journey","thAid":"ชีวิตในบ้านใหม่และทริปรถไฟความเร็วสูง"},
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
