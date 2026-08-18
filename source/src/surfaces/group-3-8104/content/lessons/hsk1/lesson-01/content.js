import { group3AssetPath } from "../../../../config.js";

const SOURCE_FILE = "docs/references/hsk/sources/hsk1-2.pdf";

export function lessonHsk1L1SourceRef(printedPages, pdfPages) {
  return `${SOURCE_FILE}#printed-pages=${printedPages}&pdf-pages=${pdfPages}`;
}

const sourceRef = lessonHsk1L1SourceRef("1-4", "17-20");

const characters = {
  teacherWang: {
    hanzi: "王一飞",
    pinyin: "Wáng Yīfēi",
    nameTh: "อาจารย์หวังอี้เฟย",
    nameEn: "Ms. Wang",
    image: group3AssetPath("/assets/group3/lesson-hsk1-l1-office-v1.webp"),
    imageSrcSet: `${group3AssetPath("/assets/group3/lesson-hsk1-l1-office-720w-v1.webp")} 720w, ${group3AssetPath("/assets/group3/lesson-hsk1-l1-office-v1.webp")} 1400w`,
    imageFocus: "26% center",
  },
  xiaoyu: {
    hanzi: "小语",
    pinyin: "Xiǎoyǔ",
    nameTh: "เสี่ยวหวี่ (AI)",
    nameEn: "AI Xiaoyu",
    image: group3AssetPath("/assets/group3/lesson-hsk1-l1-office-v1.webp"),
    imageSrcSet: `${group3AssetPath("/assets/group3/lesson-hsk1-l1-office-720w-v1.webp")} 720w, ${group3AssetPath("/assets/group3/lesson-hsk1-l1-office-v1.webp")} 1400w`,
    imageFocus: "74% center",
  },
  students: {
    hanzi: "学生们",
    pinyin: "xuéshengmen",
    nameTh: "นักเรียนทั้งชั้น",
    nameEn: "The students",
    image: group3AssetPath("/assets/group3/lesson-hsk1-l1-classroom-v1.webp"),
    imageSrcSet: `${group3AssetPath("/assets/group3/lesson-hsk1-l1-classroom-720w-v1.webp")} 720w, ${group3AssetPath("/assets/group3/lesson-hsk1-l1-classroom-v1.webp")} 1400w`,
    imageFocus: "50% center",
  },
};

const vocabularyPages = [
  [1, "你好", "nǐ hǎo", "interj.", "hello", "สวัสดี", 1, 17],
  [2, "王老师", "Wáng lǎoshī", "n.", "Teacher Wang (title)", "อาจารย์หวัง (คำเรียก)", 1, 17],
  [3, "大家", "dàjiā", "pron.", "everybody", "ทุกคน", 2, 18],
  [4, "好", "hǎo", "adj.", "good; fine", "ดี / สวัสดี", 2, 18],
  [5, "学生", "xuésheng", "n.", "student", "นักเรียน", 2, 18],
  [6, "们", "men", "suf.", "plural suffix", "คำต่อท้ายบอกพหูพจน์", 2, 18],
  [7, "老师", "lǎoshī", "n.", "teacher", "ครู / อาจารย์", 2, 18],
  [8, "您", "nín", "pron.", "you (polite)", "คุณ (คำสุภาพ)", 2, 18],
  [9, "你们", "nǐmen", "pron.", "you (plural)", "พวกคุณ", 2, 18],
  [10, "谢谢", "xièxie", "v.", "thank you", "ขอบคุณ", 3, 19],
  [11, "不客气", "bú kèqi", "idiom", "you're welcome", "ไม่เป็นไร / ด้วยความยินดี", 3, 19],
  [12, "同学", "tóngxué", "n.", "classmate", "เพื่อนร่วมชั้น", 3, 19],
  [13, "再见", "zàijiàn", "v.", "goodbye", "ลาก่อน", 3, 19],
];

const vocabulary = vocabularyPages.map(([index, hanzi, pinyin, type, en, thAid, page, pdfPage]) => ({
  index,
  hanzi,
  pinyin,
  type,
  en,
  th: thAid,
  thAid,
  page,
  translationKind: "editorial-aid",
  sourceRef: lessonHsk1L1SourceRef(String(page), String(pdfPage)),
}));

function line(source, value) {
  return { ...value, sourceRef: source };
}

const officeRef = lessonHsk1L1SourceRef("1", "17");
const classroomRef = lessonHsk1L1SourceRef("2", "18");
const farewellRef = lessonHsk1L1SourceRef("3", "19");

const scenes = [
  {
    id: "h1l1-office",
    number: "01",
    glyph: "好",
    title: "在办公室里",
    titleTh: "ทักทาย  เสี่ยวหวี่ในออฟฟิศ",
    titleEn: "Greeting AI Xiaoyu in the office",
    place: "办公室",
    placePy: "bàngōngshì",
    placeTh: "ออฟฟิศ",
    image: group3AssetPath("/assets/group3/lesson-hsk1-l1-office-v1.webp"),
    imageSrcSet: `${group3AssetPath("/assets/group3/lesson-hsk1-l1-office-720w-v1.webp")} 720w, ${group3AssetPath("/assets/group3/lesson-hsk1-l1-office-v1.webp")} 1400w`,
    imageAlt: {
      th: "อาจารย์หวังทักทายเสี่ยวหวี่ ผู้ช่วยสอน AI ในออฟฟิศ",
      zh: "王老师在办公室向AI助教小语问好",
      en: "Teacher Wang greets AI teaching assistant Xiaoyu in the office",
    },
    source: "Text 1 · หน้าเล่ม 1 · PDF หน้า 17",
    sourcePage: "1",
    sourceRef: officeRef,
    context: "开学第一天，在办公室里，王一飞和AI助教小语打招呼。",
    contextTh: "วันเปิดเรียนวันแรก ในออฟฟิศ อาจารย์หวังอี้เฟยทักทายผู้ช่วยสอน AI เสี่ยวหวี่",
    contextEn: "On the first day of school, in the office, Wang Yifei greeted AI Xiaoyu, the teaching assistant.",
    characters: [
      { role: "A", profile: "teacherWang", noteTh: "อาจารย์ผู้ทักทายผู้ช่วยสอน AI", noteZh: "与AI助教打招呼的老师", noteEn: "The teacher greeting the AI assistant" },
      { role: "B", profile: "xiaoyu", noteTh: "ผู้ช่วยสอน AI ที่ตอบกลับด้วยความสุภาพ", noteZh: "礼貌回应的AI助教", noteEn: "The AI teaching assistant replying politely" },
    ],
    lines: [
      line(officeRef, { role: "A", speaker: "王一飞", pinyin: "AI xiǎoyǔ, nǐ hǎo", hanzi: "AI小语，你好！", reading: "AI Xiǎoyǔ, nǐ hǎo!", en: "Hello, AI Xiaoyu!", th: "สวัสดีจ้า AI เสี่ยวหวี่!", visual: { zh: "你好", th: "สวัสดี", focus: "26% center" } }),
      line(officeRef, { role: "B", speaker: "小语", pinyin: "wáng lǎoshī, nǐ hǎo", hanzi: "王老师，你好！", reading: "Wáng lǎoshī, nǐ hǎo!", en: "Hello, Ms. Wang!", th: "สวัสดีค่ะ อาจารย์หวัง!", visual: { zh: "王老师", th: "อาจารย์หวัง", focus: "74% center" } }),
    ],
    qte: {
      after: 1,
      prompt: { th: "王一飞跟谁打招呼?", zh: "王一飞跟谁打招呼？", en: "Who does Wang Yifei greet?" },
      options: [
        { value: "小语", zh: "小语", pinyin: "Xiǎoyǔ", th: "เสี่ยวหวี่ (AI)" },
        { value: "陈天中", zh: "陈天中", pinyin: "Chén Tiānzhōng", th: "เฉินเทียนจง" },
        { value: "白家月", zh: "白家月", pinyin: "Bái Jiāyuè", th: "ไป๋เจียเยว่" },
      ],
      correct: "小语",
      evidence: "王一飞：AI小语，你好！",
      evidenceTh: "หวังอี้เฟย: สวัสดีจ้า AI เสี่ยวหวี่!",
      sourceRef: officeRef,
    },
    builder: {
      prompt: { th: "เรียงคำทักทายของเสี่ยวหวี่", zh: "重组小语的问候", en: "Rebuild Xiaoyu's greeting" },
      answer: ["王老师，", "你好！"],
      tiles: ["你好！", "王老师，"],
      gloss: { "王老师": "อาจารย์หวัง", "你好": "สวัสดี" },
      translationTh: "สวัสดีค่ะ อาจารย์หวัง!",
      translationEn: "Hello, Ms. Wang!",
      evidence: "Text 1 · หน้าเล่ม 1",
      sourceRef: officeRef,
    },
  },
  {
    id: "h1l1-classroom",
    number: "02",
    glyph: "问",
    title: "在课堂上学习问好",
    titleTh: "เรียนรู้การทักทายในห้องเรียน",
    titleEn: "Learning greetings in class",
    place: "课堂上",
    placeTh: "ในห้องเรียน",
    image: group3AssetPath("/assets/group3/lesson-hsk1-l1-classroom-v1.webp"),
    imageSrcSet: `${group3AssetPath("/assets/group3/lesson-hsk1-l1-classroom-720w-v1.webp")} 720w, ${group3AssetPath("/assets/group3/lesson-hsk1-l1-classroom-v1.webp")} 1400w`,
    imageAlt: {
      th: "อาจารย์หวังและเสี่ยวหวี่สอนคำทักทายให้นักเรียนในห้องเรียน",
      zh: "王老师和小语在课堂上教学生们问好",
      en: "Teacher Wang and Xiaoyu teach classroom greetings",
    },
    source: "Text 2 · หน้าเล่ม 2 · PDF หน้า 18",
    sourcePage: "2",
    sourceRef: classroomRef,
    context: "开学第一天，课堂上，学生们学习打招呼用语。",
    contextTh: "วันเปิดเรียนวันแรก ในห้องเรียน นักเรียนเรียนรู้คำทักทาย",
    contextEn: "On the first day of school, in class, the students were learning greeting expressions.",
    characters: [
      { role: "A", profile: "teacherWang", noteTh: "อาจารย์ที่ทักทายทั้งชั้นเรียน", noteZh: "向全班打招呼的老师", noteEn: "The teacher greeting the whole class" },
      { role: "B", profile: "students", noteTh: "นักเรียนที่ตอบคำทักทายและใช้ 您", noteZh: "回应问候并使用“您”的学生们", noteEn: "The students replying and using 您" },
      { role: "C", profile: "xiaoyu", noteTh: "ผู้ช่วยสอน AI ที่แทรกคำทักทาย", noteZh: "加入问候的AI助教", noteEn: "The AI assistant joining the greeting" },
    ],
    lines: [
      line(classroomRef, { role: "A", speaker: "王一飞", pinyin: "dàjiā hǎo", hanzi: "大家好！", reading: "Dàjiā hǎo!", en: "Hello, everyone!", th: "สวัสดีทุกคน!", visual: { zh: "大家好", th: "สวัสดีทุกคน", focus: "26% center" } }),
      line(classroomRef, { role: "B", speaker: "学生们", pinyin: "lǎoshī, nín hǎo", hanzi: "老师，您好！", reading: "Lǎoshī, nín hǎo!", en: "Hello, teacher!", th: "สวัสดีค่ะ/ครับ อาจารย์!", visual: { zh: "您好", th: "สวัสดี (สุภาพ)", focus: "74% center" } }),
      line(classroomRef, { role: "C", speaker: "小语", pinyin: "nǐmen hǎo", hanzi: "你们好！", reading: "Nǐmen hǎo!", en: "Hello, everyone!", th: "สวัสดีพวกคุณ!", visual: { zh: "你们好", th: "สวัสดีพวกคุณ", focus: "50% center" } }),
      line(classroomRef, { role: "B", speaker: "学生们", pinyin: "nǐ hǎo, xiǎoyǔ", hanzi: "你好，小语！", reading: "Nǐ hǎo, Xiǎoyǔ!", en: "Hello, Xiaoyu!", th: "สวัสดีจ้า เสี่ยวหวี่!", visual: { zh: "你好，小语", th: "สวัสดี เสี่ยวหวี่", focus: "74% center" } }),
    ],
    qte: {
      after: 2,
      prompt: { th: "学生们怎么跟老师打招呼?", zh: "学生们怎样跟老师打招呼？", en: "How do the students greet the teacher?" },
      options: [
        { value: "老师，您好！", zh: "老师，您好！", pinyin: "Lǎoshī, nín hǎo!", th: "สวัสดีค่ะ/ครับ อาจารย์!" },
        { value: "大家，你好！", zh: "大家，你好！", pinyin: "Dàjiā, nǐ hǎo!", th: "สวัสดีทุกคน!" },
        { value: "同学们，再见！", zh: "同学们，再见！", pinyin: "Tóngxuémen, zàijiàn!", th: "ลาก่อนเพื่อน ๆ!" },
      ],
      correct: "老师，您好！",
      evidence: "学生们：老师，您好！",
      evidenceTh: "นักเรียนทั้งชั้น: สวัสดีอาจารย์!",
      sourceRef: classroomRef,
    },
    builder: {
      prompt: { th: "เรียงคำทักทายของนักเรียน", zh: "重组学生们的问候", en: "Rebuild the students' greeting" },
      answer: ["老师，", "您好！"],
      tiles: ["您好！", "老师，"],
      gloss: { "老师": "อาจารย์", "您好": "สวัสดี (สุภาพ)" },
      translationTh: "สวัสดีค่ะ/ครับ อาจารย์!",
      translationEn: "Hello, teacher!",
      evidence: "Text 2 · หน้าเล่ม 2",
      sourceRef: classroomRef,
    },
  },
  {
    id: "h1l1-farewell",
    number: "03",
    glyph: "谢",
    title: "学习致谢与告别",
    titleTh: "เรียนรู้การขอบคุณและการลาจาก",
    titleEn: "Learning gratitude and farewells",
    place: "课堂上",
    placeTh: "ในห้องเรียน",
    image: group3AssetPath("/assets/group3/lesson-hsk1-l1-farewell-v1.webp"),
    imageSrcSet: `${group3AssetPath("/assets/group3/lesson-hsk1-l1-farewell-720w-v1.webp")} 720w, ${group3AssetPath("/assets/group3/lesson-hsk1-l1-farewell-v1.webp")} 1400w`,
    imageAlt: {
      th: "นักเรียนกล่าวขอบคุณและโบกมือลาอาจารย์หวังกับเสี่ยวหวี่",
      zh: "学生们向王老师和小语致谢并挥手道别",
      en: "Students thank and wave goodbye to Teacher Wang and Xiaoyu",
    },
    source: "Text 3 · หน้าเล่ม 3 · PDF หน้า 19",
    sourcePage: "3",
    sourceRef: farewellRef,
    context: "开学第一天，课堂上，学生们学习致谢语、告别语。",
    contextTh: "วันเปิดเรียนวันแรก ในห้องเรียน นักเรียนเรียนรู้คำขอบคุณและคำลาจาก",
    contextEn: "On the first day of school, in class, the students were learning expressions of gratitude and farewell.",
    characters: [
      { role: "A", profile: "students", noteTh: "นักเรียนที่ขอบคุณและบอกลาอาจารย์", noteZh: "致谢并向老师道别的学生们", noteEn: "The students giving thanks and saying goodbye" },
      { role: "B", profile: "xiaoyu", noteTh: "ผู้ช่วยสอน AI ที่ตอบรับคำขอบคุณ", noteZh: "回应感谢的AI助教", noteEn: "The AI assistant acknowledging the thanks" },
      { role: "C", profile: "teacherWang", noteTh: "อาจารย์ที่กล่าวลานักเรียน", noteZh: "向学生道别的老师", noteEn: "The teacher saying goodbye to the class" },
    ],
    lines: [
      line(farewellRef, { role: "A", speaker: "学生们", pinyin: "xièxie", hanzi: "谢谢！", reading: "Xièxie!", en: "Thank you!", th: "ขอบคุณค่ะ/ครับ!", visual: { zh: "谢谢", th: "ขอบคุณ", focus: "50% center" } }),
      line(farewellRef, { role: "B", speaker: "小语", pinyin: "bú kèqi", hanzi: "不客气！", reading: "Bú kèqi!", en: "You're welcome!", th: "ไม่เป็นไรค่ะ!", visual: { zh: "不客气", th: "ไม่เป็นไร", focus: "74% center" } }),
      line(farewellRef, { role: "C", speaker: "王一飞", pinyin: "tóngxuémen, zàijiàn", hanzi: "同学们，再见！", reading: "Tóngxuémen, zàijiàn!", en: "Goodbye, class!", th: "ลาก่อนครับ นักเรียนทุกคน!", visual: { zh: "再见", th: "ลาก่อน", focus: "26% center" } }),
      line(farewellRef, { role: "A", speaker: "学生们", pinyin: "lǎoshī, zàijiàn", hanzi: "老师，再见！", reading: "Lǎoshī, zàijiàn!", en: "Goodbye, teacher!", th: "ลาก่อนค่ะ/ครับ อาจารย์!", visual: { zh: "再见", th: "ลาก่อน", focus: "74% center" } }),
    ],
    qte: {
      after: 1,
      prompt: { th: "学生们说“谢谢”后，小语回答什么?", zh: "学生们说“谢谢”后，小语回答什么？", en: "After the students say “谢谢”, what does Xiaoyu reply?" },
      options: [
        { value: "不客气！", zh: "不客气！", pinyin: "Bú kèqi!", th: "ไม่เป็นไร!" },
        { value: "谢谢！", zh: "谢谢！", pinyin: "Xièxie!", th: "ขอบคุณ!" },
        { value: "再见！", zh: "再见！", pinyin: "Zàijiàn!", th: "ลาก่อน!" },
      ],
      correct: "不客气！",
      evidence: "小语：不客气！",
      evidenceTh: "เสี่ยวหวี่: ไม่เป็นไรค่ะ!",
      sourceRef: farewellRef,
    },
    builder: {
      prompt: { th: "เรียงประโยคบอกลาของอาจารย์", zh: "重组老师的道别", en: "Rebuild the teacher's farewell" },
      answer: ["同学们，", "再见！"],
      tiles: ["再见！", "同学们，"],
      gloss: { "同学们": "นักเรียนทุกคน", "再见": "ลาก่อน" },
      translationTh: "ลาก่อนครับ นักเรียนทุกคน!",
      translationEn: "Goodbye, class!",
      evidence: "Text 3 · หน้าเล่ม 3",
      sourceRef: farewellRef,
    },
  },
];

export const LESSON_HSK1_L1 = {
  id: "hsk1-l1",
  slug: "lesson-1",
  level: "hsk1",
  number: 1,
  featured: false,
  source: {
    title: "新HSK教程 1 · New HSK Course 1",
    lesson: "Lesson 1 · AI小语，你好！",
    printedPages: "1–4",
    pdfPages: "17–20",
    file: "hsk1-2.pdf",
    sourceRef,
  },
  sourceRef,
  title: {
    zh: "AI小语，你好！",
    pinyin: "AI Xiǎoyǔ, nǐ hǎo!",
    en: "Hello, AI Xiaoyu!",
    thAid: "สวัสดีจ้า AI เสี่ยวหวี่!",
  },
  summary: {
    zh: "开学第一天，从办公室里到课堂上，学习打招呼、致谢和告别用语。",
    en: "On the first day of school, learn how to greet, thank, and say goodbye.",
    thAid: "วันเปิดเรียนวันแรก ตั้งแต่ออฟฟิศถึงห้องเรียน เรียนรู้คำทักทาย ขอบคุณ และลาจาก",
  },
  translationPolicy: { kind: "editorial-aid", labelTh: "คำแปลไทยเพื่อช่วยเรียน เรียบเรียงจากต้นฉบับ" },
  objectives: [
    { zh: "能听懂并使用礼貌用语打招呼、致谢、告别。", en: "Be able to understand and use polite expressions for greetings, thanks, and farewells.", thAid: "เข้าใจและใช้คำสุภาพในการทักทาย ขอบคุณ และลาจาก", sourceRef: lessonHsk1L1SourceRef("1", "17") },
    { zh: "了解中文交际礼仪，能听懂并使用第二人称代词敬称“您”。", en: "Understand Chinese communication etiquette, and be able to use the honorific second-person pronoun “您”.", thAid: "เข้าใจมารยาทการสื่อสารจีน และใช้สรรพนามสุภาพ 您", sourceRef: lessonHsk1L1SourceRef("1", "17") },
  ],
  contents: [
    { number: "00", title: "目标与热身", titleTh: "เป้าหมายและการเตรียมบท", detail: "Objectives · Warm-Up", pages: "1", route: "/home/hsk1/lesson-1/preface/", sourceRef: lessonHsk1L1SourceRef("1", "17") },
    { number: "01", title: "在办公室里", titleTh: "ทักทาย  เสี่ยวหวี่ในออฟฟิศ", detail: "Text 1 · New Words 1–2", pages: "1", scene: 1, sourceRef: lessonHsk1L1SourceRef("1", "17") },
    { number: "02", title: "在课堂上学习问好", titleTh: "เรียนรู้การทักทายในห้องเรียน", detail: "Text 2 · New Words 3–9", pages: "2", scene: 2, sourceRef: lessonHsk1L1SourceRef("2", "18") },
    { number: "03", title: "学习致谢与告别", titleTh: "เรียนรู้การขอบคุณและการลาจาก", detail: "Text 3 · New Words 10–13", pages: "3", scene: 3, sourceRef: lessonHsk1L1SourceRef("3", "19") },
    { number: "04", title: "综合练习与活动", titleTh: "แบบฝึกรวมและกิจกรรม", detail: "Tongue Twister · Exercises (source trail)", pages: "4", sourceRef: lessonHsk1L1SourceRef("4", "20") },
  ],
  vocabulary,
  grammarFocus: [
    { title: "敬称“您”", titleEn: "The Honorific “您”", explanationZh: "“您”是“你”的敬称，对年长者或尊敬的人使用。", explanationEn: "“您” is the honorific form of “你”, used to address elders or people you respect.", thAid: "您 เป็นคำสุภาพของ 你 ใช้กับผู้ใหญ่หรือผู้ที่น่าเคารพ", examples: ["老师，您好！", "您请坐！", "谢谢您！"], sourceRef: lessonHsk1L1SourceRef("2", "18") },
    { title: "礼貌用语：打招呼、致谢与告别", titleEn: "Polite Expressions: Greetings, Thanks, and Farewells", explanationZh: "本课学习三类礼貌用语：打招呼（你好、大家好）、致谢（谢谢、不客气）和告别（再见）。", explanationEn: "This lesson covers three kinds of polite expressions: greetings (你好, 大家好), thanks (谢谢, 不客气), and farewells (再见).", thAid: "บทนี้เรียนคำสุภาพสามกลุ่ม: ทักทาย (你好/大家好), ขอบคุณ (谢谢/不客气), ลาจาก (再见)", examples: ["AI小语，你好！", "谢谢！不客气！", "同学们，再见！"], sourceRef: lessonHsk1L1SourceRef("3", "19") },
  ],
  characters,
  scenes,
};
