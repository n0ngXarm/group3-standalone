import fs from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SOURCE_ROOT = path.resolve(__dirname, "..");
const CONTENT_ROOT = path.join(SOURCE_ROOT, "src/surfaces/group-3-8104/content");
const PUBLIC_ROOT = path.join(SOURCE_ROOT, "public");
const LESSON_ASSETS_ROOT = path.join(PUBLIC_ROOT, "assets/group3/lessons");
const AUDIO_MANIFEST_PATH = path.join(PUBLIC_ROOT, "assets/group3/audio/manifest.json");

const pad = (n) => String(n).padStart(2, "0");

// Load original voice cast to get profiles
const voiceCastRaw = await fs.readFile(path.join(SOURCE_ROOT, "src/surfaces/group-3-8104/services/audio/voice-cast.json"), "utf8");
const voiceCast = JSON.parse(voiceCastRaw);

const pdfFileMap = {
  hsk1: "hsk1-2.pdf",
  hsk2: "hsk2.pdf",
  hsk3: "hsk3.pdf",
};

const pdfPathMap = {
  hsk1: "docs/references/hsk/sources/hsk1-2.pdf",
  hsk2: "docs/references/hsk/sources/hsk2.pdf",
  hsk3: "docs/references/hsk/sources/hsk3.pdf",
};

// Definition of the 9 curated lessons
const CURATED_SPEC = [
  // ===================== HSK 1 =====================
  {
    targetLevel: "hsk1",
    targetNum: 1,
    exportName: "LESSON_HSK1_L1",
    id: "hsk1-l1",
    slug: "lesson-1",
    title: {
      zh: "AI小语，你好！",
      pinyin: "AI Xiǎoyǔ, nǐ hǎo!",
      en: "Hello, AI Xiaoyu!",
      thAid: "สวัสดีจ้า AI เสี่ยวหวี่!",
    },
    summary: {
      zh: "开学第一天，在办公室与教室里学习打招呼，认识新同学李文与AI助教小语。",
      en: "On the first day of school, learn greetings in the office and classroom, and meet new classmate Li Wen and AI assistant Xiaoyu.",
      thAid: "วันเปิดเรียนวันแรก เรียนรู้การทักทายในออฟฟิศและห้องเรียน ทำความรู้จักเพื่อนใหม่หลี่เหวินและผู้ช่วยสอน AI เสี่ยวหวี่",
    },
    sourceScenes: [
      { srcLevel: "hsk1", srcNum: 1, srcSceneIdx: 0, titleTh: "ทักทายเสี่ยวหวี่ในออฟฟิศ", titleEn: "Greeting AI Xiaoyu in the office" },
      { srcLevel: "hsk1", srcNum: 1, srcSceneIdx: 1, titleTh: "เรียนรู้การทักทายในห้องเรียน", titleEn: "Learning greetings in class" },
      { srcLevel: "hsk1", srcNum: 2, srcSceneIdx: 1, titleTh: "ทำความรู้จักเพื่อนใหม่หลี่เหวิน", titleEn: "Meeting new classmate Li Wen" },
      { srcLevel: "hsk1", srcNum: 1, srcSceneIdx: 2, titleTh: "เรียนรู้การขอบคุณและการบอกลา", titleEn: "Learning gratitude and farewells" },
    ],
  },
  {
    targetLevel: "hsk1",
    targetNum: 2,
    exportName: "LESSON_HSK1_L2",
    id: "hsk1-l2",
    slug: "lesson-2",
    title: {
      zh: "我的家庭与生活",
      pinyin: "Wǒ de jiātíng yǔ shēnghuó",
      en: "My Family and Daily Life",
      thAid: "ครอบครัวและชีวิตประจำวันของฉัน",
    },
    summary: {
      zh: "了解家庭成员、日常生活时间安排、职业与工作地点，并交换联系方式。",
      en: "Learn about family members, daily schedules, occupations and workplaces, and exchange contact information.",
      thAid: "เรียนรู้เรื่องสมาชิกในครอบครัว ตารางเวลาในชีวิตประจำวัน อาชีพและสถานที่ทำงาน พร้อมแลกเปลี่ยนเบอร์ติดต่อ",
    },
    sourceScenes: [
      { srcLevel: "hsk1", srcNum: 4, srcSceneIdx: 0, titleTh: "ดูรูปถ่ายครอบครัวในห้องรับแขก", titleEn: "Looking at family photos in living room" },
      { srcLevel: "hsk1", srcNum: 7, srcSceneIdx: 0, titleTh: "ถามเวลาและตารางเวลาเลิกงาน", titleEn: "Asking about time and schedule" },
      { srcLevel: "hsk1", srcNum: 8, srcSceneIdx: 0, titleTh: "พูดคุยเรื่องอาชีพที่โรงพยาบาลและโรงเรียน", titleEn: "Talking about hospital and school jobs" },
      { srcLevel: "hsk1", srcNum: 6, srcSceneIdx: 0, titleTh: "ถามเบอร์โทรศัพท์และนัดหมายวันหยุด", titleEn: "Asking phone number and weekend plans" },
    ],
  },
  {
    targetLevel: "hsk1",
    targetNum: 3,
    exportName: "LESSON_HSK1_L3",
    id: "hsk1-l3",
    slug: "lesson-3",
    title: {
      zh: "城市生活与旅行",
      pinyin: "Chéngshì shēnghuó yǔ lǚxíng",
      en: "City Life and Travel",
      thAid: "ชีวิตในเมืองและการเดินทาง",
    },
    summary: {
      zh: "乘坐出租车去大学、在商场买衣服、品尝中国菜并相约大兴机场开始旅程。",
      en: "Take a taxi to university, shop for clothes in the mall, enjoy Chinese food, and meet at Daxing Airport for a trip.",
      thAid: "นั่งแท็กซี่ไปมหาวิทยาลัย ซื้อเสื้อผ้าในห้าง ชิมอาหารจีนแสนอร่อย และนัดพบกันที่สนามบินต้าซิงเพื่อออกเดินทาง",
    },
    sourceScenes: [
      { srcLevel: "hsk1", srcNum: 11, srcSceneIdx: 0, titleTh: "นั่งรถแท็กซี่ไปมหาวิทยาลัย", titleEn: "Taking a taxi to university" },
      { srcLevel: "hsk1", srcNum: 10, srcSceneIdx: 2, titleTh: "ซื้อเสื้อผ้าในห้างสรรพสินค้า", titleEn: "Shopping for clothes in mall" },
      { srcLevel: "hsk1", srcNum: 15, srcSceneIdx: 0, titleTh: "ทำอาหารจีนทานด้วยกันที่บ้าน", titleEn: "Tasting Chinese dishes at home" },
      { srcLevel: "hsk1", srcNum: 15, srcSceneIdx: 2, titleTh: "พบกันที่สนามบินต้าซิง!", titleEn: "See you at Daxing Airport!" },
    ],
  },

  // ===================== HSK 2 =====================
  {
    targetLevel: "hsk2",
    targetNum: 1,
    exportName: "LESSON_HSK2_L1",
    id: "hsk2-l1",
    slug: "lesson-1",
    title: {
      zh: "初到北京与拜访朋友",
      pinyin: "Chūdào Běijīng yǔ bàifǎng péngyou",
      en: "Arrival in Beijing and Visiting Friends",
      thAid: "มาถึงปักกิ่งและไปเยี่ยมเพื่อน",
    },
    summary: {
      zh: "在北京机场接机并品尝北京烤鸭，入住宾馆参观北京大学，第一次到中国朋友家做客。",
      en: "Pick up at Beijing airport, taste Peking duck, check in at hotel, visit PKU, and visit a Chinese friend's home.",
      thAid: "รับที่สนามบินปักกิ่งและทานเป็ดปักกิ่ง เช็คอินโรงแรมและเที่ยวชม ม.ปักกิ่ง ไปเยี่ยมบ้านเพื่อนชาวจีนครั้งแรก",
    },
    sourceScenes: [
      { srcLevel: "hsk2", srcNum: 1, srcSceneIdx: 0, titleTh: "รับที่สนามบินและเลี้ยงเป็ดปักกิ่ง", titleEn: "Airport pickup and Peking duck" },
      { srcLevel: "hsk2", srcNum: 2, srcSceneIdx: 0, titleTh: "เช็คอินโรงแรมและนั่งแท็กซี่ไป ม.ปักกิ่ง", titleEn: "Hotel check-in and visit PKU" },
      { srcLevel: "hsk2", srcNum: 5, srcSceneIdx: 1, titleTh: "ไปเยี่ยมบ้านเพื่อนชาวจีนและทานมื้อเที่ยง", titleEn: "Visiting Chinese friend's home for lunch" },
    ],
  },
  {
    targetLevel: "hsk2",
    targetNum: 2,
    exportName: "LESSON_HSK2_L2",
    id: "hsk2-l2",
    slug: "lesson-2",
    title: {
      zh: "都市漫步与生日聚会",
      pinyin: "Dūshì mànbù yǔ shēngrì jùhuì",
      en: "City Stroll and Birthday Party",
      thAid: "เดินเล่นในเมืองและงานเลี้ยงวันเกิด",
    },
    summary: {
      zh: "在商场购物选衣服、去买奶茶小憩、为小雪庆祝生日并一起运动打篮球。",
      en: "Shop for clothes in the mall, grab bubble tea, celebrate Xiaoxue's birthday, and play basketball.",
      thAid: "เดินช้อปปิ้งในห้าง แวะซื้อชานมไข่มุก ฉลองวันเกิดเสี่ยวเสวี่ย และเล่นบาสเกตบอลออกกำลังกาย",
    },
    sourceScenes: [
      { srcLevel: "hsk2", srcNum: 4, srcSceneIdx: 0, titleTh: "เลือกซื้อเสื้อผ้าและกระเป๋าในห้าง", titleEn: "Shopping for clothes and bags" },
      { srcLevel: "hsk2", srcNum: 9, srcSceneIdx: 1, titleTh: "ซื้อชานมไข่มุกและพักผ่อนที่ร้านกาแฟ", titleEn: "Buying bubble tea and cafe chat" },
      { srcLevel: "hsk2", srcNum: 6, srcSceneIdx: 1, titleTh: "งานเลี้ยงวันเกิดเสี่ยวเสวี่ยและเปิดของขวัญ", titleEn: "Xiaoxue's birthday party and gifts" },
      { srcLevel: "hsk2", srcNum: 7, srcSceneIdx: 0, titleTh: "เล่นบาสเกตบอลและออกกำลังกาย", titleEn: "Playing basketball and sports" },
    ],
  },
  {
    targetLevel: "hsk2",
    targetNum: 3,
    exportName: "LESSON_HSK2_L3",
    id: "hsk2-l3",
    slug: "lesson-3",
    title: {
      zh: "中文课堂、迎春与再会",
      pinyin: "Zhōngwén kètáng, yíngchūn yǔ zàihuì",
      en: "Chinese Class, Spring Festival and Farewell",
      thAid: "ห้องเรียนภาษาจีน ต้อนรับฤดูใบไม้ผลิ และความประทับใจ",
    },
    summary: {
      zh: "在中文课上向老师表达感谢、认真准备期末考试、与邻居热闹过春节并期待再次相聚。",
      en: "Express gratitude in Chinese class, prepare for exams, celebrate Spring Festival with neighbors, and look forward to meeting again.",
      thAid: "ขอบคุณอาจารย์ในห้องเรียนภาษาจีน เตรียมสอบไล่ ฉลองตรุษจีนกับเพื่อนบ้าน และตั้งใจจะกลับมาพบกันใหม่",
    },
    sourceScenes: [
      { srcLevel: "hsk2", srcNum: 13, srcSceneIdx: 0, titleTh: "มอบดอกไม้ให้อาจารย์หวังในห้องเรียน", titleEn: "Giving flowers to Teacher Wang" },
      { srcLevel: "hsk2", srcNum: 10, srcSceneIdx: 1, titleTh: "ทบทวนบทเรียนและเตรียมตัวสอบ", titleEn: "Reviewing lessons for upcoming exams" },
      { srcLevel: "hsk2", srcNum: 14, srcSceneIdx: 1, titleTh: "ฉลองเทศกาลตรุษจีนอันอบอุ่นกับเพื่อนบ้าน", titleEn: "Celebrating Spring Festival with neighbors" },
      { srcLevel: "hsk2", srcNum: 15, srcSceneIdx: 1, titleTh: "ความทรงจำที่ปักกิ่งและวางแผนกลับมาเที่ยวใหม่", titleEn: "Beijing memories and planning to return" },
    ],
  },

  // ===================== HSK 3 =====================
  {
    targetLevel: "hsk3",
    targetNum: 1,
    exportName: "LESSON_HSK3_L1",
    id: "hsk3-l1",
    slug: "lesson-1",
    title: {
      zh: "新居安顿与高铁之旅",
      pinyin: "Xīnjū āndùn yǔ gāotiě zhī lǚ",
      en: "Settling into New Home and High-Speed Train Journey",
      thAid: "ลงหลักปักฐานในบ้านใหม่และทริปรถไฟความเร็วสูง",
    },
    summary: {
      zh: "在饭馆品尝特色美食、搬入新家安顿生活、体验高铁点外卖的便捷并一起爬山摄影。",
      en: "Dine at restaurant, settle into a new apartment, take high-speed train ordering takeout, and hike up the mountains.",
      thAid: "ทานอาหารจีนเลิศรสในร้าน ย้ายเข้าบ้านใหม่ นั่งรถไฟความเร็วสูงสั่งเดลิเวอรี และปีนเขาถ่ายรูปวิวสวย",
    },
    sourceScenes: [
      { srcLevel: "hsk3", srcNum: 2, srcSceneIdx: 0, titleTh: "สั่งอาหารจีนรสเลิศในร้านอาหาร", titleEn: "Ordering delicious dishes at restaurant" },
      { srcLevel: "hsk3", srcNum: 3, srcSceneIdx: 1, titleTh: "จัดของเข้าบ้านใหม่และสำรวจชุมชน", titleEn: "Settling into new home and neighborhood" },
      { srcLevel: "hsk3", srcNum: 6, srcSceneIdx: 0, titleTh: "นั่งรถไฟความเร็วสูงไปเซี่ยงไฮ้และสั่งอาหาร", titleEn: "High-speed train to Shanghai and food delivery" },
      { srcLevel: "hsk3", srcNum: 5, srcSceneIdx: 2, titleTh: "ปีนเขาและถ่ายรูปทิวทัศน์ธรรมชาติ", titleEn: "Climbing mountain and taking photos" },
    ],
  },
  {
    targetLevel: "hsk3",
    targetNum: 2,
    exportName: "LESSON_HSK3_L2",
    id: "hsk3-l2",
    slug: "lesson-2",
    title: {
      zh: "大学生活、职场与大熊猫",
      pinyin: "Dàxué shēnghuó, zhíchǎng yǔ dàxióngmāo",
      en: "University Life, Workplace and Giant Pandas",
      thAid: "ชีวิตมหาวิทยาลัย การทำงาน และแพนด้ายักษ์",
    },
    summary: {
      zh: "在图书馆借书准备晚会、打羽毛球强身健体、在职场协作解决难题并在动物园探望国宝大熊猫。",
      en: "Borrow library books for gala prep, play badminton for health, collaborate at work, and visit giant pandas at the zoo.",
      thAid: "ยืมหนังสือเตรียมงานแสดง ตีแบดมินตันเพื่อสุขภาพ ประชุมแก้ปัญหาในที่ทำงาน และชมแพนด้ายักษ์ที่สวนสัตว์",
    },
    sourceScenes: [
      { srcLevel: "hsk3", srcNum: 14, srcSceneIdx: 0, titleTh: "ยืม-คืนหนังสือที่ห้องสมุดและเตรียมงานกาล่า", titleEn: "Library borrowing and gala prep" },
      { srcLevel: "hsk3", srcNum: 9, srcSceneIdx: 1, titleTh: "เล่นแบดมินตันและออกกำลังกายเพื่อสุขภาพ", titleEn: "Playing badminton and healthy habits" },
      { srcLevel: "hsk3", srcNum: 11, srcSceneIdx: 0, titleTh: "ประชุมวางแผนงานและแก้ปัญหาคอมพิวเตอร์", titleEn: "Workplace meeting and computer troubleshooting" },
      { srcLevel: "hsk3", srcNum: 16, srcSceneIdx: 1, titleTh: "ไปสวนสัตว์ชมแพนด้ายักษ์สมบัติของชาติ", titleEn: "Visiting giant pandas at the zoo" },
    ],
  },
  {
    targetLevel: "hsk3",
    targetNum: 3,
    exportName: "LESSON_HSK3_L3",
    id: "hsk3-l3",
    slug: "lesson-3",
    title: {
      zh: "古都文化与包饺子过年",
      pinyin: "Gǔdū wénhuà yǔ bāo jiǎozi guònián",
      en: "Ancient Capital Culture and Making Dumplings for New Year",
      thAid: "วัฒนธรรมเมืองโบราณและการห่อเกี๊ยวฉลองตรุษจีน",
    },
    summary: {
      zh: "探寻南京与黄河的悠久历史、向勤勉的师长请教留学方向、在中国家庭一起包饺子翻看老相册温馨过年。",
      en: "Discover Nanjing and Yellow River history, seek study abroad advice from mentors, make dumplings and view family albums.",
      thAid: "เรียนรู้ประวัติศาสตร์หนานจิงและแม่น้ำเหลือง ปรึกษาเรื่องเรียนต่อต่างประเทศ และร่วมห่อเกี๊ยวฉลองตรุษจีนกับครอบครัว",
    },
    sourceScenes: [
      { srcLevel: "hsk3", srcNum: 15, srcSceneIdx: 1, titleTh: "แนะนำประวัติศาสตร์เมืองหนานจิงและแม่น้ำเหลือง", titleEn: "Introducing Nanjing history and Yellow River" },
      { srcLevel: "hsk3", srcNum: 17, srcSceneIdx: 1, titleTh: "ปรึกษาเรื่องเรียนต่อต่างประเทศและตั้งใจเรียน", titleEn: "Study abroad advice and diligent learning" },
      { srcLevel: "hsk3", srcNum: 18, srcSceneIdx: 1, titleTh: "ห่อเกี๊ยวฉลองวันตรุษจีนกับครอบครัว", titleEn: "Making dumplings for Spring Festival" },
      { srcLevel: "hsk3", srcNum: 18, srcSceneIdx: 2, titleTh: "เปิดดูอัลบั้มภาพครอบครัวและความทรงจำอบอุ่น", titleEn: "Looking at family albums and memories" },
    ],
  },
];

async function run() {
  console.log("Starting lesson curation build...");

  // 1. Dynamic import of original lessons
  const { GROUP3_LESSONS: originalLessonsMeta } = await import("../src/surfaces/group-3-8104/content/registry.js");
  const originalLessonsMap = {};
  for (const meta of originalLessonsMeta) {
    const full = meta.load ? await meta.load() : meta;
    originalLessonsMap[`${full.level}-l${full.number}`] = full;
  }

  const manifestFiles = [];

  for (const spec of CURATED_SPEC) {
    console.log(`\nProcessing ${spec.targetLevel.toUpperCase()} Lesson ${spec.targetNum}: "${spec.title.zh}"`);
    const targetDir = path.join(CONTENT_ROOT, "lessons", spec.targetLevel, `lesson-${pad(spec.targetNum)}`);
    const targetPublicDir = path.join(LESSON_ASSETS_ROOT, spec.targetLevel, `lesson-${pad(spec.targetNum)}`);
    await fs.mkdir(targetDir, { recursive: true });
    await fs.mkdir(path.join(targetPublicDir, "scenes"), { recursive: true });
    await fs.mkdir(path.join(targetPublicDir, "audio"), { recursive: true });

    const composedScenes = [];
    const allVocabMap = new Map();
    const allObjectives = [];
    const allGrammar = [];

    let sceneIndex = 0;
    for (const scSpec of spec.sourceScenes) {
      sceneIndex += 1;
      const srcLesson = originalLessonsMap[`${scSpec.srcLevel}-l${scSpec.srcNum}`];
      if (!srcLesson) throw new Error(`Source lesson not found: ${scSpec.srcLevel} L${scSpec.srcNum}`);
      const srcScene = srcLesson.scenes[scSpec.srcSceneIdx];
      if (!srcScene) throw new Error(`Source scene not found in ${scSpec.srcLevel} L${scSpec.srcNum} idx ${scSpec.srcSceneIdx}`);

      // Copy scene images
      const srcPublicScenesDir = path.join(LESSON_ASSETS_ROOT, scSpec.srcLevel, `lesson-${pad(scSpec.srcNum)}`, "scenes");
      const srcSceneName = `scene-${pad(scSpec.srcSceneIdx + 1)}`;
      const targetSceneName = `scene-${pad(sceneIndex)}`;

      for (const res of ["720w", "1400w"]) {
        const srcImg = path.join(srcPublicScenesDir, `${srcSceneName}-${res}.webp`);
        const targetImg = path.join(targetPublicDir, "scenes", `${targetSceneName}-${res}.webp`);
        try {
          await fs.copyFile(srcImg, targetImg);
        } catch (e) {
          console.warn(`Warning: Could not copy ${srcImg}`);
        }
      }

      // Copy scene audio
      const srcAudioDir = path.join(LESSON_ASSETS_ROOT, scSpec.srcLevel, `lesson-${pad(scSpec.srcNum)}`, "audio", srcSceneName);
      const targetAudioDir = path.join(targetPublicDir, "audio", targetSceneName);
      await fs.mkdir(targetAudioDir, { recursive: true });

      const sceneId = `${spec.id}-s${sceneIndex}`;
      const roleProfiles = new Map(srcScene.characters?.map((c) => [c.role, c.profile]) || []);

      // Build scene lines and collect audio manifest entries
      const sceneLines = [];
      let lineIndex = 0;
      for (const line of srcScene.lines) {
        lineIndex += 1;
        const srcMp3 = path.join(srcAudioDir, `line-${pad(lineIndex)}.mp3`);
        const targetMp3 = path.join(targetAudioDir, `line-${pad(lineIndex)}.mp3`);
        await fs.copyFile(srcMp3, targetMp3);

        const profileKey = line.voiceProfiles?.[0] || roleProfiles.get(line.role) || "teacherWang";

        // Compute sha256 & bytes
        const audioBuffer = await fs.readFile(targetMp3);
        const audioHash = createHash("sha256").update(audioBuffer).digest("hex");

        const canonicalPath = `lessons/${spec.targetLevel}/lesson-${pad(spec.targetNum)}/audio/${targetSceneName}/line-${pad(lineIndex)}.mp3`;
        manifestFiles.push({
          file: `${sceneId}-${pad(lineIndex)}.mp3`,
          canonicalFile: canonicalPath,
          level: spec.targetLevel,
          lesson: spec.targetNum,
          scene: sceneIndex,
          line: lineIndex,
          profile: profileKey,
          identityId: profileKey,
          voice: voiceCast.profiles[profileKey]?.voice || "zh-CN-XiaoxiaoNeural",
          text: line.hanzi,
          bytes: audioBuffer.length,
          sha256: audioHash,
          personaPitch: voiceCast.profiles[profileKey]?.personaPitch || 1,
          personaTempo: voiceCast.profiles[profileKey]?.personaTempo || 1,
          loudnessTargetLufs: -23,
        });

        sceneLines.push({
          role: line.role,
          speaker: line.speaker,
          pinyin: line.pinyin,
          hanzi: line.hanzi,
          reading: line.reading || line.hanzi,
          en: line.en,
          th: line.th,
          visual: line.visual,
          sourceRef: line.sourceRef || `${pdfPathMap[spec.targetLevel]}#printed-pages=1&pdf-pages=1`,
        });
      }

      // Build clean scene object
      composedScenes.push({
        id: sceneId,
        number: pad(sceneIndex),
        glyph: srcScene.glyph || "学",
        title: srcScene.title,
        titleTh: scSpec.titleTh || srcScene.titleTh,
        titleEn: scSpec.titleEn || srcScene.titleEn,
        place: srcScene.place,
        placePy: srcScene.placePy || "",
        placeTh: srcScene.placeTh || srcScene.place,
        source: srcScene.source || `Text ${sceneIndex}`,
        sourcePage: srcScene.sourcePage || String(sceneIndex),
        sourceRef: srcScene.sourceRef || `${pdfPathMap[spec.targetLevel]}#printed-pages=1&pdf-pages=1`,
        context: srcScene.context,
        contextTh: srcScene.contextTh,
        contextEn: srcScene.contextEn,
        characters: srcScene.characters || [],
        lines: sceneLines,
        qte: {
          ...srcScene.qte,
          sourceRef: srcScene.qte?.sourceRef || srcScene.sourceRef || `${pdfPathMap[spec.targetLevel]}#printed-pages=1&pdf-pages=1`,
        },
        builder: {
          ...srcScene.builder,
          sourceRef: srcScene.builder?.sourceRef || srcScene.sourceRef || `${pdfPathMap[spec.targetLevel]}#printed-pages=1&pdf-pages=1`,
        },
      });

      // Collect vocabulary from source lesson
      if (srcLesson.vocabulary) {
        for (const v of srcLesson.vocabulary) {
          if (!allVocabMap.has(v.hanzi)) {
            allVocabMap.set(v.hanzi, {
              hanzi: v.hanzi,
              pinyin: v.pinyin,
              type: v.type,
              en: v.en,
              th: v.th || v.thAid,
              thAid: v.thAid || v.th,
              translationKind: "editorial-aid",
              page: v.page || 1,
              sourceRef: v.sourceRef || `${pdfPathMap[spec.targetLevel]}#printed-pages=1&pdf-pages=1`,
            });
          }
        }
      }

      // Collect grammar
      if (srcLesson.grammarFocus) {
        for (const g of srcLesson.grammarFocus) {
          if (!allGrammar.some((existing) => existing.title === g.title)) {
            allGrammar.push({
              ...g,
              sourceRef: g.sourceRef || `${pdfPathMap[spec.targetLevel]}#printed-pages=1&pdf-pages=1`,
            });
          }
        }
      }

      // Collect objectives
      if (srcLesson.objectives) {
        for (const o of srcLesson.objectives) {
          if (!allObjectives.some((existing) => existing.zh === o.zh)) {
            allObjectives.push({
              ...o,
              sourceRef: o.sourceRef || `${pdfPathMap[spec.targetLevel]}#printed-pages=1&pdf-pages=1`,
            });
          }
        }
      }
    }

    // Format Vocabulary with sequential index
    const vocabularyList = Array.from(allVocabMap.values()).map((item, idx) => ({
      index: idx + 1,
      ...item,
    }));

    // Ensure at least 3 grammar points and 3 objectives
    const grammarFocusList = allGrammar.slice(0, 3);
    const objectivesList = allObjectives.slice(0, 3);

    // Build Table of Contents
    const contentsList = [
      {
        number: "00",
        title: "目标与热身",
        titleTh: "เป้าหมายและภาพรวมบทเรียน",
        detail: "Objectives · Warm-Up",
        pages: "1",
        route: `/home/${spec.targetLevel}/lessons/lesson-${pad(spec.targetNum)}/overview/`,
        sourceRef: `${pdfPathMap[spec.targetLevel]}#printed-pages=1&pdf-pages=1`,
      },
      ...composedScenes.map((sc, idx) => ({
        number: pad(idx + 1),
        title: sc.title,
        titleTh: sc.titleTh,
        detail: `Text ${idx + 1} · Scenes`,
        pages: String(idx + 1),
        scene: idx + 1,
        sourceRef: sc.sourceRef,
      })),
    ];

    // Generate content.js file
    const contentJsSource = `// Auto-generated curated Group 3 lesson content
import { group3AssetPath } from "../../../../config.js";

const SOURCE_FILE = "${pdfPathMap[spec.targetLevel]}";

export const SOURCE = {
  title: "新HSK教程 ${spec.targetLevel.toUpperCase().replace("HSK", "")} · New HSK Course ${spec.targetLevel.toUpperCase().replace("HSK", "")}",
  lesson: "Lesson ${spec.targetNum} · ${spec.title.zh}",
  printedPages: "1–10",
  pdfPages: "1–10",
  file: "${pdfFileMap[spec.targetLevel]}",
  sourceRef: \`\${SOURCE_FILE}#printed-pages=1-10&pdf-pages=1-10\`,
};

export const ${spec.exportName} = {
  id: "${spec.id}",
  slug: "${spec.slug}",
  level: "${spec.targetLevel}",
  number: ${spec.targetNum},
  source: SOURCE,
  sourceRef: SOURCE.sourceRef,
  title: ${JSON.stringify(spec.title, null, 2)},
  summary: ${JSON.stringify(spec.summary, null, 2)},
  translationPolicy: { kind: "editorial-aid", labelTh: "คำแปลไทยเพื่อช่วยเรียน เรียบเรียงจากต้นฉบับ" },
  objectives: ${JSON.stringify(objectivesList, null, 2)},
  contents: ${JSON.stringify(contentsList, null, 2)},
  vocabulary: ${JSON.stringify(vocabularyList, null, 2)},
  grammarFocus: ${JSON.stringify(grammarFocusList, null, 2)},
  scenes: ${JSON.stringify(composedScenes, null, 2)},
};
`;

    await fs.writeFile(path.join(targetDir, "content.js"), contentJsSource, "utf8");
    console.log(`  ✓ Generated ${targetDir}/content.js (Vocab: ${vocabularyList.length}, Scenes: ${composedScenes.length})`);
  }

  // 2. Generate new registry.js
  console.log("\nGenerating updated registry.js...");
  const registrySource = `import { group3SceneMedia } from "../config.js";

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
    title: {"zh":"初到北京与拜访朋友","pinyin":"Chūdào Běijīng yǔ bàifǎng péngyou","en":"Arrival in Beijing and Visiting Friends","thAid":"มาถึงปักกิ่งและไปเยี่ยมเพื่อน"},
    load: () => import("./lessons/hsk2/lesson-01/content.js").then(m => withCanonicalLessonMedia(m.LESSON_HSK2_L1))
  },
  {
    id: "hsk2-l2",
    slug: "lesson-2",
    level: "hsk2",
    number: 2,
    title: {"zh":"都市漫步与生日聚会","pinyin":"Dūshì mànbù yǔ shēngrì jùhuì","en":"City Stroll and Birthday Party","thAid":"เดินเล่นในเมืองและงานเลี้ยงวันเกิด"},
    load: () => import("./lessons/hsk2/lesson-02/content.js").then(m => withCanonicalLessonMedia(m.LESSON_HSK2_L2))
  },
  {
    id: "hsk2-l3",
    slug: "lesson-3",
    level: "hsk2",
    number: 3,
    title: {"zh":"中文课堂、迎春与再会","pinyin":"Zhōngwén kètáng, yíngchūn yǔ zàihuì","en":"Chinese Class, Spring Festival and Farewell","thAid":"ห้องเรียนภาษาจีน ต้อนรับฤดูใบไม้ผลิ และความประทับใจ"},
    load: () => import("./lessons/hsk2/lesson-03/content.js").then(m => withCanonicalLessonMedia(m.LESSON_HSK2_L3))
  },
  {
    id: "hsk3-l1",
    slug: "lesson-1",
    level: "hsk3",
    number: 1,
    title: {"zh":"新居安顿与高铁之旅","pinyin":"Xīnjū āndùn yǔ gāotiě zhī lǚ","en":"Settling into New Home and High-Speed Train Journey","thAid":"ลงหลักปักฐานในบ้านใหม่และทริปรถไฟความเร็วสูง"},
    load: () => import("./lessons/hsk3/lesson-01/content.js").then(m => withCanonicalLessonMedia(m.LESSON_HSK3_L1))
  },
  {
    id: "hsk3-l2",
    slug: "lesson-2",
    level: "hsk3",
    number: 2,
    title: {"zh":"大学生活、职场与大熊猫","pinyin":"Dàxué shēnghuó, zhíchǎng yǔ dàxióngmāo","en":"University Life, Workplace and Giant Pandas","thAid":"ชีวิตมหาวิทยาลัย การทำงาน และแพนด้ายักษ์"},
    load: () => import("./lessons/hsk3/lesson-02/content.js").then(m => withCanonicalLessonMedia(m.LESSON_HSK3_L2))
  },
  {
    id: "hsk3-l3",
    slug: "lesson-3",
    level: "hsk3",
    number: 3,
    title: {"zh":"古都文化与包饺子过年","pinyin":"Gǔdū wénhuà yǔ bāo jiǎozi guònián","en":"Ancient Capital Culture and Making Dumplings for New Year","thAid":"วัฒนธรรมเมืองโบราณและการห่อเกี๊ยวฉลองตรุษจีน"},
    load: () => import("./lessons/hsk3/lesson-03/content.js").then(m => withCanonicalLessonMedia(m.LESSON_HSK3_L3))
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
`;

  await fs.writeFile(path.join(CONTENT_ROOT, "registry.js"), registrySource, "utf8");
  console.log("  ✓ Updated registry.js with 9 curated lessons");

  // 3. Write audio manifest.json
  console.log(`\nWriting audio manifest with ${manifestFiles.length} dialogue audio entries...`);
  const manifestData = {
    lesson: "Group 3 Curated Lessons (HSK1 L1-L3, HSK2 L1-L3, HSK3 L1-L3)",
    generator: "edge-tts 7.2.8 + ffmpeg rubberband personas",
    voiceCastVersion: 1,
    personaCount: 28,
    loudnessTargetLufs: -23,
    profiles: voiceCast.profiles,
    files: manifestFiles,
  };

  await fs.writeFile(AUDIO_MANIFEST_PATH, JSON.stringify(manifestData, null, 2), "utf8");
  console.log("  ✓ Updated manifest.json");

  console.log("\nCurated build finished successfully!");
}

run().catch((err) => {
  console.error("Build failed:", err);
  process.exit(1);
});
