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

// 7 Curated Lessons Definition (HSK1: 3 lessons, HSK2: 2 lessons, HSK3: 2 lessons / 2 scenes each)
const DYNAMIC_SPEC = [
  // ===================== HSK 1 (3 บท) =====================
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
    scenes: [
      {
        id: "hsk1-l1-s1",
        number: "01",
        glyph: "好",
        title: "在办公室里",
        titleTh: "ทักทายเสี่ยวหวี่ในออฟฟิศ",
        titleEn: "Greeting AI Xiaoyu in the office",
        place: "办公室",
        placePy: "bàngōngshì",
        placeTh: "ออฟฟิศ",
        context: "开学第一天，在办公室里，王一飞和AI助教小语打招呼。",
        contextTh: "วันเปิดเรียนวันแรก ในออฟฟิศ อาจารย์หวังอี้เฟยทักทายผู้ช่วยสอน AI เสี่ยวหวี่",
        contextEn: "On the first day of school, in the office, Wang Yifei greeted AI Xiaoyu, the teaching assistant.",
        characters: [
          { role: "A", profile: "teacherWang", noteTh: "อาจารย์ผู้ทักทายผู้ช่วยสอน AI", noteZh: "与AI助教打招呼的老师", noteEn: "The teacher greeting the AI assistant" },
          { role: "B", profile: "xiaoyu", noteTh: "ผู้ช่วยสอน AI ที่ตอบกลับด้วยความสุภาพ", noteZh: "礼貌回应的AI助教", noteEn: "The AI teaching assistant replying politely" },
        ],
        lines: [
          { role: "A", speaker: "王一飞", pinyin: "AI xiǎoyǔ, nǐ hǎo", hanzi: "AI小语，你好！", reading: "AI Xiǎoyǔ, nǐ hǎo!", en: "Hello, AI Xiaoyu!", th: "สวัสดีจ้า AI เสี่ยวหวี่!", visual: { zh: "你好", th: "สวัสดี", focus: "26% center" } },
          { role: "B", speaker: "小语", pinyin: "wáng lǎoshī, nǐ hǎo", hanzi: "王老师，你好！", reading: "Wáng lǎoshī, nǐ hǎo!", en: "Hello, Ms. Wang!", th: "สวัสดีค่ะ อาจารย์หวัง!", visual: { zh: "王老师", th: "อาจารย์หวัง", focus: "74% center" } },
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
        },
        builder: {
          prompt: { th: "เรียงคำทักทายของเสี่ยวหวี่", zh: "重组小语的问候", en: "Rebuild Xiaoyu's greeting" },
          answer: ["王老师，", "你好！"],
          tiles: ["你好！", "王老师，"],
          gloss: { "王老师": "อาจารย์หวัง", "你好": "สวัสดี" },
          translationTh: "สวัสดีค่ะ อาจารย์หวัง!",
          translationEn: "Hello, Ms. Wang!",
          evidence: "Text 1 · หน้าเล่ม 1",
        },
      },
      {
        id: "hsk1-l1-s2",
        number: "02",
        glyph: "问",
        title: "在课堂上学习问好",
        titleTh: "เรียนรู้การทักทายในห้องเรียน",
        titleEn: "Learning greetings in class",
        place: "课堂上",
        placePy: "kètáng shang",
        placeTh: "ในห้องเรียน",
        context: "开学第一天，课堂上，学生们学习打招呼用语。",
        contextTh: "วันเปิดเรียนวันแรก ในห้องเรียน นักเรียนเรียนรู้คำทักทาย",
        contextEn: "On the first day of school, in class, the students were learning greeting expressions.",
        characters: [
          { role: "A", profile: "teacherWang", noteTh: "อาจารย์ที่ทักทายทั้งชั้นเรียน", noteZh: "向全班打招呼的老师", noteEn: "The teacher greeting the whole class" },
          { role: "B", profile: "students", noteTh: "นักเรียนที่ตอบคำทักทายและใช้ 您", noteZh: "回应问候并使用“您”的学生们", noteEn: "The students replying and using 您" },
          { role: "C", profile: "xiaoyu", noteTh: "ผู้ช่วยสอน AI ที่แทรกคำทักทาย", noteZh: "加入问候的AI助教", noteEn: "The AI assistant joining the greeting" },
        ],
        lines: [
          { role: "A", speaker: "王一飞", pinyin: "dàjiā hǎo", hanzi: "大家好！", reading: "Dàjiā hǎo!", en: "Hello, everyone!", th: "สวัสดีทุกคน!", visual: { zh: "大家好", th: "สวัสดีทุกคน", focus: "26% center" } },
          { role: "B", speaker: "学生们", pinyin: "lǎoshī, nín hǎo", hanzi: "老师，您好！", reading: "Lǎoshī, nín hǎo!", en: "Hello, teacher!", th: "สวัสดีค่ะ/ครับ อาจารย์!", visual: { zh: "您好", th: "สวัสดี (สุภาพ)", focus: "74% center" } },
          { role: "C", speaker: "小语", pinyin: "nǐmen hǎo", hanzi: "你们好！", reading: "Nǐmen hǎo!", en: "Hello, everyone!", th: "สวัสดีพวกคุณ!", visual: { zh: "你们好", th: "สวัสดีพวกคุณ", focus: "50% center" } },
          { role: "B", speaker: "学生们", pinyin: "nǐ hǎo, xiǎoyǔ", hanzi: "你好，小语！", reading: "Nǐ hǎo, Xiǎoyǔ!", en: "Hello, Xiaoyu!", th: "สวัสดีจ้า เสี่ยวหวี่!", visual: { zh: "你好，小语", th: "สวัสดี เสี่ยวหวี่", focus: "74% center" } },
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
        },
        builder: {
          prompt: { th: "เรียงคำทักทายของนักเรียน", zh: "重组学生们的问候", en: "Rebuild the students' greeting" },
          answer: ["老师，", "您好！"],
          tiles: ["您好！", "老师，"],
          gloss: { "老师": "อาจารย์", "您好": "สวัสดี (สุภาพ)" },
          translationTh: "สวัสดีค่ะ/ครับ อาจารย์!",
          translationEn: "Hello, teacher!",
          evidence: "Text 2 · หน้าเล่ม 2",
        },
      },
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
    scenes: [
      {
        id: "hsk1-l2-s1",
        number: "01",
        glyph: "家",
        title: "在客厅看全家福",
        titleTh: "ดูรูปถ่ายครอบครัวในห้องรับแขก",
        titleEn: "Looking at family photos in living room",
        place: "客厅",
        placePy: "kètīng",
        placeTh: "ห้องรับแขก",
        context: "在客厅里，王一雪和刘明一起看家庭照片，介绍家人。",
        contextTh: "ในห้องรับแขก หวังอี้เสวี่ยและหลิวหมิงดูรูปครอบครัวด้วยกัน และแนะนำคนในบ้าน",
        contextEn: "In the living room, Wang Yixue and Liu Ming look at family photos together.",
        characters: [
          { role: "A", profile: "wang", noteTh: "คุณแม่ผู้แนะนำครอบครัว", noteZh: "介绍家人的母亲", noteEn: "The mother introducing family" },
          { role: "B", profile: "liu", noteTh: "คุณพ่อที่สอบถามเรื่องลูก ๆ", noteZh: "询问孩子的父亲", noteEn: "The father asking about children" },
        ],
        lines: [
          { role: "A", speaker: "王一雪", pinyin: "nǐ kàn, zhè shì wǒ de jiārén", hanzi: "你看，这是我的家人。", reading: "Nǐ kàn, zhè shì wǒ de jiārén.", en: "Look, this is my family.", th: "เธอดูสิ นี่คือคนในครอบครัวของฉัน", visual: { zh: "家人", th: "คนในครอบครัว", focus: "26% center" } },
          { role: "B", speaker: "刘明", pinyin: "nǐ jiā yǒu jǐ kǒu rén", hanzi: "你家有几口人？", reading: "Nǐ jiā yǒu jǐ kǒu rén?", en: "How many people are in your family?", th: "ครอบครัวเธอมีกี่คน?", visual: { zh: "几口人", th: "กี่คน", focus: "74% center" } },
          { role: "A", speaker: "王一雪", pinyin: "wǒ jiā yǒu sì kǒu rén, wǒ yǒu liǎng gè háizi", hanzi: "我家有四口人，我有两个孩子。", reading: "Wǒ jiā yǒu sì kǒu rén, wǒ yǒu liǎng gè háizi.", en: "My family has four people, I have two children.", th: "ครอบครัวฉันมีสี่คน ฉันมีลูกสองคน", visual: { zh: "两个孩子", th: "ลูกสองคน", focus: "26% center" } },
          { role: "B", speaker: "刘明", pinyin: "tāmen duō dà le", hanzi: "他们多大了？", reading: "Tāmen duō dà le?", en: "How old are they?", th: "พวกเขาอายุเท่าไหร่แล้ว?", visual: { zh: "多大", th: "อายุเท่าไหร่", focus: "74% center" } },
        ],
        qte: {
          after: 2,
          prompt: { th: "王一雪家有几口人?", zh: "王一雪家有几口人？", en: "How many people in Wang Yixue's family?" },
          options: [
            { value: "四口人", zh: "四口人", pinyin: "Sì kǒu rén", th: "สี่คน" },
            { value: "三口人", zh: "三口人", pinyin: "Sān kǒu rén", th: "สามคน" },
            { value: "五口人", zh: "五口人", pinyin: "Wǔ kǒu rén", th: "ห้าคน" },
          ],
          correct: "四口人",
          evidence: "王一雪：我家有四口人。",
          evidenceTh: "หวังอี้เสวี่ย: ครอบครัวฉันมีสี่คน",
        },
        builder: {
          prompt: { th: "เรียงประโยคแนะนำจำนวนสมาชิกในบ้าน", zh: "重组家庭人数句子", en: "Rebuild family size sentence" },
          answer: ["我家有", "四口人。"],
          tiles: ["四口人。", "我家有"],
          gloss: { "我家有": "ครอบครัวฉันมี", "四口人": "สี่คน" },
          translationTh: "ครอบครัวฉันมีสี่คน",
          translationEn: "My family has four people.",
          evidence: "Text 1 · หน้าเล่ม 4",
        },
      },
      {
        id: "hsk1-l2-s2",
        number: "02",
        glyph: "时",
        title: "询问时间与下班安排",
        titleTh: "ถามเวลาและตารางเวลาเลิกงาน",
        titleEn: "Asking about time and schedule",
        place: "办公室",
        placePy: "bàngōngshì",
        placeTh: "ออฟฟิศ",
        context: "在办公室里，两人询问现在的时间与晚上下班安排。",
        contextTh: "ในออฟฟิศ ทั้งสองถามเวลาปัจจุบันและนัดหมายเวลาเลิกงานตอนเย็น",
        contextEn: "In the office, the two ask about the current time and evening plans.",
        characters: [
          { role: "A", profile: "wang", noteTh: "ผู้ตอบเวลาและนัดหมาย", noteZh: "回答时间的同事", noteEn: "Colleague answering time" },
          { role: "B", profile: "liu", noteTh: "ผู้ถามเวลาและชวนทานข้าว", noteZh: "询问时间的同事", noteEn: "Colleague asking time" },
        ],
        lines: [
          { role: "B", speaker: "刘明", pinyin: "xiànzài jǐ diǎn", hanzi: "现在几点？", reading: "Xiànzài jǐ diǎn?", en: "What time is it now?", th: "ตอนนี้กี่โมงแล้ว?", visual: { zh: "几点", th: "กี่โมง", focus: "74% center" } },
          { role: "A", speaker: "王一雪", pinyin: "xiànzài shàngwǔ shí diǎn shí fēn", hanzi: "现在上午十点十分。", reading: "Xiànzài shàngwǔ shí diǎn shí fēn.", en: "It is 10:10 in the morning.", th: "ตอนนี้สิบโมงสิบนาทีช่วงเช้า", visual: { zh: "十点十分", th: "10 โมง 10 นาที", focus: "26% center" } },
          { role: "B", speaker: "刘明", pinyin: "nǐ jīntiān shénme shíhou xiàbān", hanzi: "你今天什么时候下班？", reading: "Nǐ jīntiān shénme shíhou xiàbān?", en: "When do you finish work today?", th: "วันนี้เธอเลิกงานตอนไหน?", visual: { zh: "什么时候", th: "เมื่อไหร่", focus: "74% center" } },
          { role: "A", speaker: "王一雪", pinyin: "wǒ wǎnshang liù diǎn bàn xiàbān", hanzi: "我晚上六点半下班。", reading: "Wǒ wǎnshang liù diǎn bàn xiàbān.", en: "I finish work at 6:30 in the evening.", th: "ฉันเลิกงานตอนหกโมงครึ่งตอนเย็น", visual: { zh: "六点半", th: "หกโมงครึ่ง", focus: "26% center" } },
        ],
        qte: {
          after: 2,
          prompt: { th: "王一雪晚上几点下班?", zh: "王一雪晚上几点下班？", en: "When does Wang Yixue finish work?" },
          options: [
            { value: "六点半", zh: "六点半", pinyin: "Liù diǎn bàn", th: "หกโมงครึ่ง" },
            { value: "七点", zh: "七点", pinyin: "Qī diǎn", th: "หนึ่งทุ่ม" },
            { value: "五点半", zh: "五点半", pinyin: "Wǔ diǎn bàn", th: "ห้าโมงครึ่ง" },
          ],
          correct: "六点半",
          evidence: "王一雪：我晚上六点半下班。",
          evidenceTh: "หวังอี้เสวี่ย: ฉันเลิกงานตอนหกโมงครึ่งตอนเย็น",
        },
        builder: {
          prompt: { th: "เรียงประโยคบอกเวลาเลิกงาน", zh: "重组下班时间句子", en: "Rebuild finish work sentence" },
          answer: ["我晚上", "六点半下班。"],
          tiles: ["六点半下班。", "我晚上"],
          gloss: { "我晚上": "ฉันตอนเย็น", "六点半下班": "เลิกงานหกโมงครึ่ง" },
          translationTh: "ฉันเลิกงานตอนหกโมงครึ่งตอนเย็น",
          translationEn: "I finish work at 6:30 in the evening.",
          evidence: "Text 2 · หน้าเล่ม 7",
        },
      },
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
      zh: "在商场买衣服、品尝中国菜并相约大兴机场开始精彩的中国之旅。",
      en: "Shop for clothes in the mall, enjoy Chinese food, and meet at Daxing Airport for a wonderful journey.",
      thAid: "ซื้อเสื้อผ้าในห้าง ชิมอาหารจีนแสนอร่อย และนัดพบกันที่สนามบินต้าซิงเพื่อออกเดินทาง",
    },
    scenes: [
      {
        id: "hsk1-l3-s1",
        number: "01",
        glyph: "衣",
        title: "在商场买衣服",
        titleTh: "ซื้อเสื้อผ้าในห้างสรรพสินค้า",
        titleEn: "Shopping for clothes in mall",
        place: "商场",
        placePy: "shāngchǎng",
        placeTh: "ห้างสรรพสินค้า",
        context: "在商场里，白家月向售货员询问衣服的颜色、大小与价格。",
        contextTh: "ในห้างสรรพสินค้า ไป๋เจียเยว่ถามพนักงานขายเรื่องสี ขนาด และราคาเสื้อผ้า",
        contextEn: "In the mall, Bai Jiayue asks the shop assistant about clothes.",
        characters: [
          { role: "A", profile: "bai", noteTh: "ลูกค้าผู้เลือกซื้อเสื้อผ้า", noteZh: "挑选衣服的顾客", noteEn: "Customer buying clothes" },
          { role: "B", profile: "shopAssistant", noteTh: "พนักงานขายในห้าง", noteZh: "商场的售货员", noteEn: "Shop assistant" },
        ],
        lines: [
          { role: "B", speaker: "售货员", pinyin: "nín hǎo, nín xiǎng mǎi shénme", hanzi: "您好，您想买什么？", reading: "Nín hǎo, nín xiǎng mǎi shénme?", en: "Hello, what would you like to buy?", th: "สวัสดีค่ะ คุณอยากซื้ออะไรคะ?", visual: { zh: "想买什么", th: "อยากซื้ออะไร", focus: "74% center" } },
          { role: "A", speaker: "白家月", pinyin: "wǒ xiǎng mǎi yí jiàn yīfu", hanzi: "我想买一件衣服。", reading: "Wǒ xiǎng mǎi yí jiàn yīfu.", en: "I would like to buy a piece of clothing.", th: "ฉันอยากซื้อเสื้อผ้าสักตัวหนึ่งค่ะ", visual: { zh: "一件衣服", th: "เสื้อผ้าหนึ่งตัว", focus: "26% center" } },
          { role: "B", speaker: "售货员", pinyin: "zhè jiàn hóngsè de zěnmeyàng, hěn piàoliang", hanzi: "这件红色的怎么样？很漂亮。", reading: "Zhè jiàn hóngsè de zěnmeyàng? Hěn piàoliang.", en: "How about this red one? Very pretty.", th: "ตัวสีแดงตัวนี้เป็นอย่างไรบ้างคะ? สวยมากเลย", visual: { zh: "红色的", th: "สีแดง", focus: "74% center" } },
          { role: "A", speaker: "白家月", pinyin: "zhēn piàoliang, wǒ mǎi zhè jiàn", hanzi: "真漂亮，我买这件！", reading: "Zhēn piàoliang, wǒ mǎi zhè jiàn!", en: "Really pretty, I'll buy this one!", th: "สวยจริงๆ ค่ะ ฉันซื้อตัวนี้!", visual: { zh: "真漂亮", th: "สวยจริงๆ", focus: "26% center" } },
        ],
        qte: {
          after: 2,
          prompt: { th: "白家月买了什么颜色的衣服?", zh: "白家月买了什么颜色的衣服？", en: "What color clothes did Bai Jiayue buy?" },
          options: [
            { value: "红色", zh: "红色", pinyin: "Hóngsè", th: "สีแดง" },
            { value: "黄色", zh: "黄色", pinyin: "Huángsè", th: "สีเหลือง" },
            { value: "蓝色", zh: "蓝色", pinyin: "Lánsè", th: "สีน้ำเงิน" },
          ],
          correct: "红色",
          evidence: "售货员：这件红色的怎么样？很漂亮。",
          evidenceTh: "พนักงานขาย: ตัวสีแดงตัวนี้เป็นอย่างไรบ้างคะ? สวยมากเลย",
        },
        builder: {
          prompt: { th: "เรียงประโยคตัดสินใจซื้อเสื้อผ้า", zh: "重组购买衣服句子", en: "Rebuild buy clothes sentence" },
          answer: ["真漂亮，", "我买这件！"],
          tiles: ["我买这件！", "真漂亮，"],
          gloss: { "真漂亮": "สวยจริงๆ", "我买这件": "ฉันซื้อตัวนี้" },
          translationTh: "สวยจริงๆ ค่ะ ฉันซื้อตัวนี้!",
          translationEn: "Really pretty, I'll buy this one!",
          evidence: "Text 1 · หน้าเล่ม 10",
        },
      },
      {
        id: "hsk1-l3-s2",
        number: "02",
        glyph: "飞",
        title: "大兴机场见！",
        titleTh: "พบกันที่สนามบินต้าซิง!",
        titleEn: "See you at Daxing Airport!",
        place: "李文家",
        placePy: "Lǐ Wén jiā",
        placeTh: "บ้านหลี่เหวิน",
        context: "在李文家里，大家品尝中国菜，并相约明天在大兴机场见。",
        contextTh: "ที่บ้านของหลี่เหวิน ทุกคนชิมอาหารจีนและนัดเจอกันที่สนามบินต้าซิงวันพรุ่งนี้",
        contextEn: "At Li Wen's home, everyone tastes Chinese food and agrees to meet at Daxing Airport.",
        characters: [
          { role: "A", profile: "liWen", noteTh: "เจ้าของบ้านผู้ทำอาหารจีน", noteZh: "做中国菜的主人", noteEn: "Host cooking food" },
          { role: "B", profile: "bai", noteTh: "เพื่อนนักเรียนที่ชื่นชมอาหาร", noteZh: "赞美中国菜的朋友", noteEn: "Friend praising food" },
          { role: "C", profile: "teacherWang", noteTh: "อาจารย์ผู้นัดหมายที่สนามบิน", noteZh: "约定机场见面的老师", noteEn: "Teacher arranging airport meeting" },
        ],
        lines: [
          { role: "A", speaker: "李文", pinyin: "zhè shì wǒ zuò de zhōngguócài, nǐ chángchang", hanzi: "这是我做的中国菜，你尝尝。", reading: "Zhè shì wǒ zuò de Zhōngguócài, nǐ chángchang.", en: "This is Chinese food I made, try it.", th: "นี่คืออาหารจีนที่ฉันทำ เธอชิมดูสิ", visual: { zh: "中国菜", th: "อาหารจีน", focus: "26% center" } },
          { role: "B", speaker: "白家月", pinyin: "tài hǎochī le, nǐ zuò de zhēn hǎo", hanzi: "太好吃了，你做的真好！", reading: "Tài hǎochī le, nǐ zuò de zhēn hǎo!", en: "Delicious, you cook really well!", th: "อร่อยมากเลย เธอทำเก่งจริงๆ!", visual: { zh: "太好吃", th: "อร่อยมาก", focus: "74% center" } },
          { role: "C", speaker: "王一飞", pinyin: "míngtiān shàngwǔ jiǔ diǎn, dàxīng jīchǎng jiàn", hanzi: "明天上午九点，大兴机场见！", reading: "Míngtiān shàngwǔ jiǔ diǎn, Dàxīng Jīchǎng jiàn!", en: "See you at Daxing Airport tomorrow at 9 AM!", th: "พรุ่งนี้เช้าเก้าโมง พบกันที่สนามบินต้าซิงนะ!", visual: { zh: "大兴机场", th: "สนามบินต้าซิง", focus: "50% center" } },
          { role: "B", speaker: "白家月", pinyin: "tài hǎo le, dàxīng jīchǎng jiàn", hanzi: "太好了，大兴机场见！", reading: "Tài hǎo le, Dàxīng Jīchǎng jiàn!", en: "Great, see you at Daxing Airport!", th: "ดีเลยค่ะ พบกันที่สนามบินต้าซิง!", visual: { zh: "机场见", th: "พบกันที่สนามบิน", focus: "74% center" } },
        ],
        qte: {
          after: 2,
          prompt: { th: "大家约好明天在哪里见?", zh: "大家约好明天在哪里见？", en: "Where did everyone agree to meet tomorrow?" },
          options: [
            { value: "大兴机场", zh: "大兴机场", pinyin: "Dàxīng Jīchǎng", th: "สนามบินต้าซิง" },
            { value: "北京大学", zh: "北京大学", pinyin: "Běijīng Dàxué", th: "มหาวิทยาลัยปักกิ่ง" },
            { value: "火车站", zh: "火车站", pinyin: "Huǒchēzhàn", th: "สถานีรถไฟ" },
          ],
          correct: "大兴机场",
          evidence: "王一飞：明天上午九点，大兴机场见！",
          evidenceTh: "หวังอี้เฟย: พรุ่งนี้เช้าเก้าโมง พบกันที่สนามบินต้าซิงนะ!",
        },
        builder: {
          prompt: { th: "เรียงประโยคนัดพบกันที่สนามบิน", zh: "重组机场相约句子", en: "Rebuild airport meeting sentence" },
          answer: ["明天上午，", "大兴机场见！"],
          tiles: ["大兴机场见！", "明天上午，"],
          gloss: { "明天上午": "พรุ่งนี้เช้า", "大兴机场见": "พบกันที่สนามบินต้าซิง" },
          translationTh: "พรุ่งนี้เช้า พบกันที่สนามบินต้าซิง!",
          translationEn: "See you at Daxing Airport tomorrow morning!",
          evidence: "Text 3 · หน้าเล่ม 15",
        },
      },
    ],
  },

  // ===================== HSK 2 (2 บท) =====================
  {
    targetLevel: "hsk2",
    targetNum: 1,
    exportName: "LESSON_HSK2_L1",
    id: "hsk2-l1",
    slug: "lesson-1",
    title: {
      zh: "北京之旅与朋友聚餐",
      pinyin: "Běijīng zhī lǚ yǔ péngyou jùcān",
      en: "Beijing Trip and Dining with Friends",
      thAid: "ทริปปักกิ่งและทานอาหารกับเพื่อน",
    },
    summary: {
      zh: "在北京机场接机并品尝北京烤鸭，第一次到中国朋友家做客品尝丰盛午餐。",
      en: "Pick up at Beijing airport, taste Peking duck, and visit a Chinese friend's home for a wonderful lunch.",
      thAid: "รับที่สนามบินปักกิ่งและทานเป็ดปักกิ่ง ไปเยี่ยมบ้านเพื่อนชาวจีนครั้งแรกและทานมื้อเที่ยงแสนอร่อย",
    },
    scenes: [
      {
        id: "hsk2-l1-s1",
        number: "01",
        glyph: "机",
        title: "在机场接机与吃烤鸭",
        titleTh: "รับที่สนามบินและเลี้ยงเป็ดปักกิ่ง",
        titleEn: "Airport pickup and Peking duck treat",
        place: "机场 / 车里",
        placePy: "jīchǎng / chē lǐ",
        placeTh: "สนามบิน / ในรถ",
        context: "在机场接机后，大家在车里聊天，白家月提起美味的北京烤鸭。",
        contextTh: "หลังจากรับที่สนามบิน ทุกคนนั่งคุยกันในรถ ไป๋เจียเยว่พูดถึงเป็ดปักกิ่งแสนอร่อย",
        contextEn: "After airport pickup, chatting in the car about Peking duck.",
        characters: [
          { role: "A", profile: "teacherWang", noteTh: "อาจารย์ผู้ขับรถมารับ", noteZh: "接机开车的老师", noteEn: "Teacher driving pickup" },
          { role: "B", profile: "bai", noteTh: "นักเรียนผู้เดินทางมาถึง", noteZh: "到达的学生", noteEn: "Student who arrived" },
          { role: "C", profile: "liWen", noteTh: "เพื่อนร่วมทางชาวจีน", noteZh: "同行的中国同学", noteEn: "Chinese classmate" },
        ],
        lines: [
          { role: "A", speaker: "王一飞", pinyin: "lùshang xīnkǔ le, huānyíng nǐmen lái běijīng", hanzi: "路上辛苦了，欢迎你们来北京！", reading: "Lùshang xīnkǔ le, huānyíng nǐmen lái Běijīng!", en: "Thanks for the trip, welcome to Beijing!", th: "เดินทางเหนื่อยเลยนะ ยินดีต้อนรับสู่ปักกิ่ง!", visual: { zh: "欢迎", th: "ยินดีต้อนรับ", focus: "26% center" } },
          { role: "B", speaker: "白家月", pinyin: "xièxie wáng lǎoshī, běijīng zhēn piàoliang", hanzi: "谢谢王老师，北京真漂亮！", reading: "Xièxie Wáng lǎoshī, Běijīng zhēn piàoliang!", en: "Thank you Teacher Wang, Beijing is pretty!", th: "ขอบคุณอาจารย์หวังค่ะ ปักกิ่งสวยมากเลย", visual: { zh: "真漂亮", th: "สวยจริงๆ", focus: "74% center" } },
          { role: "C", speaker: "李文", pinyin: "jīntiān wǒ qǐng nǐmen chī běijīng kǎoyā", hanzi: "今天我请你们吃北京烤鸭。", reading: "Jīntiān wǒ qǐng nǐmen chī Běijīng kǎoyā.", en: "Today I'll treat you to Peking duck.", th: "วันนี้ฉันจะเลี้ยงเป็ดปักกิ่งพวกเธอนะ", visual: { zh: "北京烤鸭", th: "เป็ดปักกิ่ง", focus: "50% center" } },
          { role: "B", speaker: "白家月", pinyin: "tài hǎo le, wǒ zuì xǐhuan chī kǎoyā le", hanzi: "太好了，我最喜欢吃烤鸭了！", reading: "Tài hǎo le, wǒ zuì xǐhuan chī kǎoyā le!", en: "Awesome, I like roast duck the most!", th: "ยอดเยี่ยมเลยค่ะ ฉันชอบกินเป็ดปักกิ่งที่สุด!", visual: { zh: "最喜欢", th: "ชอบที่สุด", focus: "74% center" } },
        ],
        qte: {
          after: 2,
          prompt: { th: "李文今天请大家吃什么?", zh: "李文今天请大家吃什么？", en: "What does Li Wen treat everyone to eat?" },
          options: [
            { value: "北京烤鸭", zh: "北京烤鸭", pinyin: "Běijīng kǎoyā", th: "เป็ดปักกิ่ง" },
            { value: "饺子", zh: "饺子", pinyin: "Jiǎozi", th: "เกี๊ยว" },
            { value: "火锅", zh: "火锅", pinyin: "Huǒguō", th: "หม้อไฟ" },
          ],
          correct: "北京烤鸭",
          evidence: "李文：今天我请你们吃北京烤鸭。",
          evidenceTh: "หลี่เหวิน: วันนี้ฉันจะเลี้ยงเป็ดปักกิ่งพวกเธอนะ",
        },
        builder: {
          prompt: { th: "เรียงประโยคเลี้ยงเป็ดปักกิ่ง", zh: "重组请吃烤鸭句子", en: "Rebuild roast duck treat sentence" },
          answer: ["今天我请你们", "吃北京烤鸭。"],
          tiles: ["吃北京烤鸭。", "今天我请你们"],
          gloss: { "今天我请你们": "วันนี้ฉันเลี้ยงพวกเธอ", "吃北京烤鸭": "กินเป็ดปักกิ่ง" },
          translationTh: "วันนี้ฉันจะเลี้ยงเป็ดปักกิ่งพวกเธอนะ",
          translationEn: "Today I will treat you to Peking duck.",
          evidence: "Text 1 · HSK2 Lesson 1",
        },
      },
      {
        id: "hsk2-l1-s2",
        number: "02",
        glyph: "客",
        title: "到中国朋友家做客",
        titleTh: "ไปเยี่ยมบ้านเพื่อนชาวจีนและทานมื้อเที่ยง",
        titleEn: "Visiting Chinese friend's home for lunch",
        place: "王一雪家",
        placePy: "Wáng Yīxuě jiā",
        placeTh: "บ้านหวังอี้เสวี่ย",
        context: "白家月第一次到中国朋友家做客，受到热情的招待并品尝丰盛午餐。",
        contextTh: "ไป๋เจียเยว่ไปเยี่ยมบ้านเพื่อนชาวจีนครั้งแรก ได้รับการต้อนรับอย่างอบอุ่นและทานอาหารเที่ยงแสนอร่อย",
        contextEn: "Bai Jiayue visits a Chinese friend's home for the first time.",
        characters: [
          { role: "A", profile: "wang", noteTh: "เจ้าบ้านผู้ต้อนรับ", noteZh: "热情招待的主人", noteEn: "Host welcoming guests" },
          { role: "B", profile: "bai", noteTh: "แขกผู้มาเยี่ยมบ้าน", noteZh: "来做客的客人", noteEn: "Guest visiting home" },
          { role: "C", profile: "liu", noteTh: "เจ้าบ้านผู้เตรียมอาหาร", noteZh: "准备饭菜的男主人", noteEn: "Male host preparing lunch" },
        ],
        lines: [
          { role: "A", speaker: "王一雪", pinyin: "huānyíng lái wǒjiā zuòkè, kuài qǐng jìn", hanzi: "欢迎来我家做客，快请进！", reading: "Huānyíng lái wǒjiā zuòkè, kuài qǐng jìn!", en: "Welcome to my home, please come in!", th: "ยินดีต้อนรับมาบ้านฉัน เชิญเข้ามาเลยค่ะ!", visual: { zh: "请进", th: "เชิญเข้า", focus: "26% center" } },
          { role: "B", speaker: "白家月", pinyin: "dǎrǎo le, zhè shì sòng gěi nín de lǐwù", hanzi: "打扰了，这是送给您的礼物。", reading: "Dǎrǎo le, zhè shì sòng gěi nín de lǐwù.", en: "Pardon the intrusion, this is a gift for you.", th: "รบกวนด้วยนะคะ นี่คือของขวัญที่นำมาฝากค่ะ", visual: { zh: "礼物", th: "ของขวัญ", focus: "74% center" } },
          { role: "C", speaker: "刘明", pinyin: "wǔfàn zuò hǎo le, yǒu yángròu hé yú, dàjiā yìqǐ chī", hanzi: "午饭做好了，有羊肉和鱼，大家一起吃！", reading: "Wǔfàn zuò hǎo le, yǒu yángròu hé yú, dàjiā yìqǐ chī!", en: "Lunch is ready, there is lamb and fish, let's eat together!", th: "อาหารเที่ยงเสร็จแล้ว มีเนื้อแกะและปลา ทุกคนมาทานด้วยกันนะ!", visual: { zh: "羊肉和鱼", th: "เนื้อแกะและปลา", focus: "50% center" } },
          { role: "B", speaker: "白家月", pinyin: "zhēn fēngshèng, xièxie nǐmen", hanzi: "真丰盛，谢谢你们！", reading: "Zhēn fēngshèng, xièxie nǐmen!", en: "So sumptuous, thank you all!", th: "น่าทานและอุดมสมบูรณ์มาก ขอบคุณทุกคนนะคะ!", visual: { zh: "真丰盛", th: "อุดมสมบูรณ์", focus: "74% center" } },
        ],
        qte: {
          after: 2,
          prompt: { th: "刘明准备了什么美味午饭?", zh: "刘明准备了什么美味午饭？", en: "What lunch dishes did Liu Ming prepare?" },
          options: [
            { value: "羊肉和鱼", zh: "羊肉和鱼", pinyin: "Yángròu hé yú", th: "เนื้อแกะและปลา" },
            { value: "面条和米饭", zh: "面条和米饭", pinyin: "Miàntiáo hé mǐfàn", th: "บะหมี่และข้าวสวย" },
            { value: "蛋糕和水果", zh: "蛋糕和水果", pinyin: "Dàngāo hé shuǐguǒ", th: "เค้กและผลไม้" },
          ],
          correct: "羊肉和鱼",
          evidence: "刘明：午饭做好了，有羊肉和鱼。",
          evidenceTh: "หลิวหมิง: อาหารเที่ยงเสร็จแล้ว มีเนื้อแกะและปลา",
        },
        builder: {
          prompt: { th: "เรียงประโยคเชิญเข้าบ้าน", zh: "重组欢迎进门句子", en: "Rebuild welcome in sentence" },
          answer: ["欢迎来我家做客，", "快请进！"],
          tiles: ["快请进！", "欢迎来我家做客，"],
          gloss: { "欢迎来我家做客": "ยินดีต้อนรับมาบ้านฉัน", "快请进": "เชิญเข้ามาเลย" },
          translationTh: "ยินดีต้อนรับมาบ้านฉัน เชิญเข้ามาเลยค่ะ!",
          translationEn: "Welcome to my home, please come in!",
          evidence: "Text 2 · HSK2 Lesson 5",
        },
      },
    ],
  },
  {
    targetLevel: "hsk2",
    targetNum: 2,
    exportName: "LESSON_HSK2_L2",
    id: "hsk2-l2",
    slug: "lesson-2",
    title: {
      zh: "都市生活与生日聚会",
      pinyin: "Dūshì shēnghuó yǔ shēngrì jùhuì",
      en: "City Life and Birthday Celebration",
      thAid: "ชีวิตในเมืองและงานเลี้ยงวันเกิด",
    },
    summary: {
      zh: "在商场购物选衣服买奶茶，为小雪庆祝生日并一起运动打篮球。",
      en: "Shop in the mall for clothes and bubble tea, celebrate Xiaoxue's birthday, and play basketball.",
      thAid: "เดินช้อปปิ้งในห้าง ซื้อชานมไข่มุก ฉลองวันเกิดเสี่ยวเสวี่ย และเล่นบาสเกตบอลออกกำลังกาย",
    },
    scenes: [
      {
        id: "hsk2-l2-s1",
        number: "01",
        glyph: "红",
        title: "挑选衣服与买奶茶",
        titleTh: "เลือกซื้อเสื้อผ้าและซื้อชานมไข่มุก",
        titleEn: "Shopping for clothes and bubble tea",
        place: "商场门口",
        placePy: "shāngchǎng ménkǒu",
        placeTh: "หน้าห้างสรรพสินค้า",
        context: "在商场里挑选红色衣服和书包，并在门口买杯ชานมไข่มุกแสนอร่อย",
        contextTh: "ในห้างสรรพสินค้าเลือกซื้อเสื้อผ้าสีแดงและกระเป๋า และแวะซื้อชานมไข่มุกหน้าร้าน",
        contextEn: "Shopping for clothes and bubble tea at the mall entrance.",
        characters: [
          { role: "A", profile: "wang", noteTh: "คุณแม่ผู้แนะนำเสื้อผ้า", noteZh: "挑选衣服的母亲", noteEn: "Mother choosing clothes" },
          { role: "B", profile: "liu", noteTh: "คุณพ่อผู้ซื้อชานม", noteZh: "购买奶茶的父亲", noteEn: "Father buying bubble tea" },
        ],
        lines: [
          { role: "B", speaker: "刘明", pinyin: "nǐ chuān hóngsè de hěn hǎokàn", hanzi: "你穿红色的很好看。", reading: "Nǐ chuān hóngsè de hěn hǎokàn.", en: "You look great in red.", th: "เธอใส่สีแดงแล้วดูดีมากเลย", visual: { zh: "很好看", th: "ดูดีมาก", focus: "74% center" } },
          { role: "A", speaker: "王一雪", pinyin: "zhè jiàn yīfu yě hěn piányi, wǒ mǎi le", hanzi: "这件衣服也很便宜，我买了。", reading: "Zhè jiàn yīfu yě hěn piányi, wǒ mǎi le.", en: "This clothing is also cheap, I'll buy it.", th: "เสื้อตัวนี้ก็ราคาถูกมาก ฉันซื้อแล้วนะ", visual: { zh: "很便宜", th: "ราคาถูก", focus: "26% center" } },
          { role: "B", speaker: "刘明", pinyin: "tiānqì rè, wǒ qù mǎi bēi nǎichá", hanzi: "天气热，我去买杯奶茶。", reading: "Tiānqì rè, wǒ qù mǎi bēi nǎichá.", en: "It's hot, I'll go buy a cup of bubble tea.", th: "อากาศร้อน ฉันจะไปซื้อชานมสักแก้วนะ", visual: { zh: "买杯奶茶", th: "ซื้อชานมหนึ่งแก้ว", focus: "74% center" } },
          { role: "A", speaker: "王一雪", pinyin: "hǎo de, wǒmen qù kāfēidiàn xiūxi yíxià", hanzi: "好的，我们去咖啡店休息一下。", reading: "Hǎo de, wǒmen qù kāfēidiàn xiūxi yíxià.", en: "Alright, let's rest a bit at the coffee shop.", th: "ได้เลยจ้ะ พวกเราไปนั่งพักที่ร้านกาแฟกันสักหน่อยนะ", visual: { zh: "休息一下", th: "พักสักหน่อย", focus: "26% center" } },
        ],
        qte: {
          after: 2,
          prompt: { th: "刘明去买什么饮品?", zh: "刘明去买什么饮品？", en: "What drink did Liu Ming go to buy?" },
          options: [
            { value: "奶茶", zh: "奶茶", pinyin: "Nǎichá", th: "ชานม" },
            { value: "可乐", zh: "可乐", pinyin: "Kělè", th: "โคล่า" },
            { value: "果汁", zh: "果汁", pinyin: "Guǒzhī", th: "น้ำผลไม้" },
          ],
          correct: "奶茶",
          evidence: "刘明：天气热，我去买杯奶茶。",
          evidenceTh: "หลิวหมิง: อากาศร้อน ฉันจะไปซื้อชานมสักแก้วนะ",
        },
        builder: {
          prompt: { th: "เรียงประโยคชมชุดสีแดง", zh: "重组赞美衣服句子", en: "Rebuild clothing compliment sentence" },
          answer: ["你穿红色的", "很好看。"],
          tiles: ["很好看。", "你穿红色的"],
          gloss: { "你穿红色的": "เธอใส่สีแดง", "很好看": "ดูดีมาก" },
          translationTh: "เธอใส่สีแดงแล้วดูดีมากเลย",
          translationEn: "You look great in red.",
          evidence: "Text 1 · HSK2 Lesson 4",
        },
      },
      {
        id: "hsk2-l2-s2",
        number: "02",
        glyph: "乐",
        title: "小雪，生日快乐！",
        titleTh: "งานเลี้ยงวันเกิดเสี่ยวเสวี่ยและเปิดของขวัญ",
        titleEn: "Xiaoxue's birthday party and gifts",
        place: "刘明家",
        placePy: "Liú Míng jiā",
        placeTh: "บ้านหลิวหมิง",
        context: "在家里为小雪庆祝生日，送上精美礼物与蛋糕，全家其乐融融。",
        contextTh: "ฉลองวันเกิดให้เสี่ยวเสวี่ยที่บ้าน มอบของขวัญและเค้กวันเกิด ครอบครัวอบอุ่นและมีความสุข",
        contextEn: "Celebrating Xiaoxue's birthday at home with gifts and cake.",
        characters: [
          { role: "A", profile: "wang", noteTh: "คุณแม่อวยพรวันเกิด", noteZh: "送生日祝福的母亲", noteEn: "Mother giving birthday wishes" },
          { role: "B", profile: "liuXiaoxue", noteTh: "เจ้าของวันเกิด", noteZh: "过生日的女儿", noteEn: "Daughter celebrating birthday" },
          { role: "C", profile: "liu", noteTh: "คุณพ่อมอบของขวัญ", noteZh: "送礼物的父亲", noteEn: "Father giving gift" },
        ],
        lines: [
          { role: "A", speaker: "王一雪", pinyin: "xiǎoxuě, shēngrì kuàilè", hanzi: "小雪，生日快乐！", reading: "Xiǎoxuě, shēngrì kuàilè!", en: "Happy birthday, Xiaoxue!", th: "เสี่ยวเสวี่ย สุขสันต์วันเกิดจ้ะ!", visual: { zh: "生日快乐", th: "สุขสันต์วันเกิด", focus: "26% center" } },
          { role: "B", speaker: "刘小雪", pinyin: "xièxie bàba māma", hanzi: "谢谢爸爸妈妈！", reading: "Xièxie bàba māma!", en: "Thank you Dad and Mom!", th: "ขอบคุณคุณพ่อคุณแม่ค่ะ!", visual: { zh: "谢谢", th: "ขอบคุณ", focus: "74% center" } },
          { role: "C", speaker: "刘明", pinyin: "zhè shì sòng gěi nǐ de shēngrì lǐwù, nǐ kànkàn", hanzi: "这是送给你的生日礼物，你看看。", reading: "Zhè shì sòng gěi nǐ de shēngrì lǐwù, nǐ kànkàn.", en: "This is a birthday gift for you, take a look.", th: "นี่คือของขวัญวันเกิดสำหรับลูก ลองเปิดดูสิ", visual: { zh: "生日礼物", th: "ของขวัญวันเกิด", focus: "50% center" } },
          { role: "B", speaker: "刘小雪", pinyin: "wā, shì xīn shūbāo, tài piàoliang le", hanzi: "哇，是新书包，太漂亮了！", reading: "Wa, shì xīn shūbāo, tài piàoliang le!", en: "Wow, a new schoolbag, so pretty!", th: "ว้าว เป็นกระเป๋านักเรียนใบใหม่ สวยมากเลยค่ะ!", visual: { zh: "新书包", th: "กระเป๋าใบใหม่", focus: "74% center" } },
        ],
        qte: {
          after: 2,
          prompt: { th: "爸爸妈妈送给小雪什么生日礼物?", zh: "爸爸妈妈送给小雪什么生日礼物？", en: "What birthday gift did parents give to Xiaoxue?" },
          options: [
            { value: "新书包", zh: "新书包", pinyin: "Xīn shūbāo", th: "กระเป๋านักเรียนใบใหม่" },
            { value: "新自行车", zh: "新自行车", pinyin: "Xīn zìxíngchē", th: "จักรยานคันใหม่" },
            { value: "手机", zh: "手机", pinyin: "Shǒujī", th: "โทรศัพท์มือถือ" },
          ],
          correct: "新书包",
          evidence: "刘小雪：哇，是新书包，太漂亮了！",
          evidenceTh: "หลิวเสี่ยวเสวี่ย: ว้าว เป็นกระเป๋านักเรียนใบใหม่ สวยมากเลยค่ะ!",
        },
        builder: {
          prompt: { th: "เรียงประโยคอวยพรวันเกิด", zh: "重组生日祝福句子", en: "Rebuild happy birthday sentence" },
          answer: ["小雪，", "生日快乐！"],
          tiles: ["生日快乐！", "小雪，"],
          gloss: { "小雪": "เสี่ยวเสวี่ย", "生日快乐": "สุขสันต์วันเกิด" },
          translationTh: "เสี่ยวเสวี่ย สุขสันต์วันเกิดจ้ะ!",
          translationEn: "Happy birthday, Xiaoxue!",
          evidence: "Text 2 · HSK2 Lesson 6",
        },
      },
    ],
  },

  // ===================== HSK 3 (2 บท) =====================
  {
    targetLevel: "hsk3",
    targetNum: 1,
    exportName: "LESSON_HSK3_L1",
    id: "hsk3-l1",
    slug: "lesson-1",
    title: {
      zh: "新居生活与高铁之旅",
      pinyin: "Xīnjū shēnghuó yǔ gāotiě zhī lǚ",
      en: "New Home and High-Speed Train Journey",
      thAid: "ชีวิตในบ้านใหม่และทริปรถไฟความเร็วสูง",
    },
    summary: {
      zh: "在饭馆品尝特色美食，体验乘坐高铁点外卖的便捷与舒适旅程。",
      en: "Dine on delicious Chinese dishes at the restaurant, and experience taking high-speed train with food delivery.",
      thAid: "ลิ้มลองอาหารจีนรสเลิศในร้านอาหาร และสัมผัสประสบการณ์นั่งรถไฟความเร็วสูงสั่งเดลิเวอรีแสนสะดวก",
    },
    scenes: [
      {
        id: "hsk3-l1-s1",
        number: "01",
        glyph: "菜",
        title: "在饭馆点菜与品尝美食",
        titleTh: "สั่งอาหารจีนรสเลิศในร้านอาหาร",
        titleEn: "Ordering delicious dishes at restaurant",
        place: "饭馆",
        placePy: "fànguǎn",
        placeTh: "ร้านอาหาร",
        context: "在特色餐馆里，李文和白家月看菜单点菜，品尝地道中国美味。",
        contextTh: "ที่ร้านอาหารจีน หลี่เหวินและไป๋เจียเยว่ดูเมนูสั่งอาหาร และลิ้มลองรสชาติอาหารจีนแท้ๆ",
        contextEn: "At the restaurant, ordering dishes from menu and tasting Chinese food.",
        characters: [
          { role: "A", profile: "liWen", noteTh: "ผู้ชวนสั่งอาหาร", noteZh: "点菜的朋友", noteEn: "Friend ordering food" },
          { role: "B", profile: "bai", noteTh: "ผู้เลือกเมนูที่ชอบ", noteZh: "选择菜肴的客人", noteEn: "Guest picking dishes" },
          { role: "C", profile: "restaurantServer", noteTh: "พนักงานเสิร์ฟอาหาร", noteZh: "饭馆服务员", noteEn: "Restaurant waiter" },
        ],
        lines: [
          { role: "C", speaker: "服务员", pinyin: "huānyíng guānglín, zhè shì càidān, qǐng diǎncài", hanzi: "欢迎光临，这是菜单，请点菜。", reading: "Huānyíng guānglín, zhè shì càidān, qǐng diǎncài.", en: "Welcome, here is the menu, please order.", th: "ยินดีต้อนรับค่ะ นี่คือเมนูอาหาร เชิญสั่งได้เลยนะคะ", visual: { zh: "请点菜", th: "เชิญสั่งอาหาร", focus: "50% center" } },
          { role: "A", speaker: "李文", pinyin: "nǐmen xiǎng chī shénme jiù diǎn shénme", hanzi: "你们想吃什么就点什么！", reading: "Nǐmen xiǎng chī shénme jiù diǎn shénme!", en: "Order whatever you'd like to eat!", th: "พวกเธออยากกินอะไรก็สั่งได้ตามสบายเลยนะ!", visual: { zh: "想吃什么", th: "อยากกินอะไร", focus: "26% center" } },
          { role: "B", speaker: "白家月", pinyin: "zhège cài de wèidao hǎo jí le, zhēn hào chī", hanzi: "这个菜的味道好极了，真好吃！", reading: "Zhè ge cài de wèidao hǎo jí le, zhēn hǎochī!", en: "The taste of this dish is wonderful, so delicious!", th: "รสชาติของจานนี้ดีเยี่ยมยอดเลย อร่อยมากๆ!", visual: { zh: "好极了", th: "ดีเยี่ยม", focus: "74% center" } },
          { role: "A", speaker: "李文", pinyin: "xǐhuan jiù duō chī diǎnr", hanzi: "喜欢就多吃点儿！", reading: "Xǐhuan jiù duō chī diǎnr!", en: "If you like it, eat more!", th: "ถ้าชอบก็ทานเยอะๆ นะ!", visual: { zh: "多吃点儿", th: "ทานเยอะๆ", focus: "26% center" } },
        ],
        qte: {
          after: 2,
          prompt: { th: "白家月觉得这个菜的味道怎么样?", zh: "白家月觉得这个菜的味道怎么样？", en: "How does Bai Jiayue find the food taste?" },
          options: [
            { value: "好极了", zh: "好极了", pinyin: "Hǎo jí le", th: "ดีเยี่ยมยอด" },
            { value: "不太好", zh: "不太好", pinyin: "Bú tài hǎo", th: "ไม่ค่อยดี" },
            { value: "一般", zh: "一般", pinyin: "Yìbān", th: "ธรรมดา" },
          ],
          correct: "好极了",
          evidence: "白家月：这个菜的味道好极了，真好吃！",
          evidenceTh: "ไป๋เจียเยว่: รสชาติของจานนี้ดีเยี่ยมยอดเลย อร่อยมากๆ!",
        },
        builder: {
          prompt: { th: "เรียงประโยคชมรสชาติอาหาร", zh: "重组赞美菜肴味道句子", en: "Rebuild food compliment sentence" },
          answer: ["这个菜的味道", "好极了！"],
          tiles: ["好极了！", "这个菜的味道"],
          gloss: { "这个菜的味道": "รสชาติของอาหารจานนี้", "好极了": "ดีเยี่ยมยอด" },
          translationTh: "รสชาติของอาหารจานนี้ดีเยี่ยมยอดเลย!",
          translationEn: "The taste of this dish is wonderful!",
          evidence: "Text 1 · HSK3 Lesson 2",
        },
      },
      {
        id: "hsk3-l1-s2",
        number: "02",
        glyph: "铁",
        title: "商量坐高铁去上海",
        titleTh: "นั่งรถไฟความเร็วสูงไปเซี่ยงไฮ้และสั่งอาหาร",
        titleEn: "High-speed train to Shanghai and food delivery",
        place: "咖啡厅",
        placePy: "kāfēitīng",
        placeTh: "ร้านกาแฟ",
        context: "两人在咖啡厅商量假期出行，计划乘坐高铁去上海，体验在车上点外卖。",
        contextTh: "ทั้งสองปรึกษากันในร้านกาแฟเรื่องเดินทางวันหยุด วางแผนนั่งรถไฟความเร็วสูงไปเซี่ยงไฮ้และสั่งอาหารเดลิเวอรีบนรถไฟ",
        contextEn: "Planning a high-speed train trip to Shanghai and ordering food onboard.",
        characters: [
          { role: "A", profile: "wang", noteTh: "ผู้วางแผนการเดินทาง", noteZh: "计划出行的母亲", noteEn: "Mother planning trip" },
          { role: "B", profile: "liu", noteTh: "ผู้จองตั๋วรถไฟความเร็วสูง", noteZh: "订高铁票的父亲", noteEn: "Father booking train tickets" },
        ],
        lines: [
          { role: "A", speaker: "王一雪", pinyin: "jiàqī wǒmen zuò gāotiě qù shànghǎi ba", hanzi: "假期我们坐高铁去上海吧。", reading: "Jiàqī wǒmen zuò gāotiě qù Shànghǎi ba.", en: "Let's take the high-speed train to Shanghai for holiday.", th: "วันหยุดนี้พวกเรานั่งรถไฟความเร็วสูงไปเซี่ยงไฮ้กันเถอะ", visual: { zh: "坐高铁", th: "นั่งรถไฟความเร็วสูง", focus: "26% center" } },
          { role: "B", speaker: "刘明", pinyin: "hǎo a, gāotiě shang hái kěyǐ diǎn wàimài, tèbié fāngbiàn", hanzi: "好啊，高铁上还可以点外卖，特别方便！", reading: "Hǎo a, gāotiě shang hái kěyǐ diǎn wàimài, tèbié fāngbiàn!", en: "Great, you can even order takeout on high-speed train, very convenient!", th: "ดีเลย บนรถไฟความเร็วสูงยังสั่งเดลิเวอรีได้ด้วย สะดวกมากๆ!", visual: { zh: "点外卖", th: "สั่งเดลิเวอรี", focus: "74% center" } },
          { role: "A", speaker: "王一雪", pinyin: "wǒmen xiànzài jiù shàngwǎng mǎi piào", hanzi: "我们现在就上网买票。", reading: "Wǒmen xiànzài jiù shàngwǎng mǎi piào.", en: "Let's buy tickets online right now.", th: "พวกเราเข้าเน็ตซื้อตั๋วกันตอนนี้เลยนะ", visual: { zh: "上网买票", th: "ซื้อตั๋วออนไลน์", focus: "26% center" } },
          { role: "B", speaker: "刘明", pinyin: "mǎi hǎo le, zhù wǒmen lǚxíng yúkuài", hanzi: "买好了，祝我们旅行愉快！", reading: "Mǎi hǎo le, zhù wǒmen lǚxíng yúkuài!", en: "Purchased, wishing us a happy trip!", th: "ซื้อเสร็จเรียบร้อยแล้ว ขอให้การเดินทางราบรื่นมีความสุขนะ!", visual: { zh: "旅行愉快", th: "เที่ยวให้สนุก", focus: "74% center" } },
        ],
        qte: {
          after: 1,
          prompt: { th: "在高铁上有什么便捷的服务?", zh: "在高铁上有什么便捷的服务？", en: "What convenient service is on the high-speed train?" },
          options: [
            { value: "可以点外卖", zh: "可以点外卖", pinyin: "Kěyǐ diǎn wàimài", th: "สั่งอาหารเดลิเวอรีได้" },
            { value: "可以游泳", zh: "可以游泳", pinyin: "Kěyǐ yóuyǒng", th: "ว่ายน้ำได้" },
            { value: "可以看电影院", zh: "可以看电影院", pinyin: "Kěyǐ kàn diànyǐngyuàn", th: "มีโรงหนังให้ดู" },
          ],
          correct: "可以点外卖",
          evidence: "刘明：高铁上还可以点外卖，特别方便！",
          evidenceTh: "หลิวหมิง: บนรถไฟความเร็วสูงยังสั่งเดลิเวอรีได้ด้วย สะดวกมากๆ!",
        },
        builder: {
          prompt: { th: "เรียงประโยคชวนนั่งรถไฟความเร็วสูง", zh: "重组坐高铁旅行句子", en: "Rebuild high-speed train sentence" },
          answer: ["假期我们", "坐高铁去上海吧。"],
          tiles: ["坐高铁去上海吧。", "假期我们"],
          gloss: { "假期我们": "วันหยุดนี้พวกเรา", "坐高铁去上海吧": "นั่งรถไฟความเร็วสูงไปเซี่ยงไฮ้กันเถอะ" },
          translationTh: "วันหยุดนี้พวกเรานั่งรถไฟความเร็วสูงไปเซี่ยงไฮ้กันเถอะ",
          translationEn: "Let's take the high-speed train to Shanghai for holiday.",
          evidence: "Text 1 · HSK3 Lesson 6",
        },
      },
    ],
  },
  {
    targetLevel: "hsk3",
    targetNum: 2,
    exportName: "LESSON_HSK3_L2",
    id: "hsk3-l2",
    slug: "lesson-2",
    title: {
      zh: "职场协作与包饺子过年",
      pinyin: "Zhíchǎng xiézuò yǔ bāo jiǎozi guònián",
      en: "Workplace Collaboration and New Year Dumplings",
      thAid: "การทำงานร่วมกันและการห่อเกี๊ยวฉลองตรุษจีน",
    },
    summary: {
      zh: "在办公室协作解决工作难题，在春节假期与中国家庭一起包饺子温馨过年。",
      en: "Collaborate to solve problems in the office, and make dumplings with a Chinese family for Spring Festival.",
      thAid: "ร่วมมือกันแก้ปัญหาในที่ทำงาน และร่วมกันห่อเกี๊ยวฉลองตรุษจีนกับครอบครัวชาวจีนอย่างอบอุ่น",
    },
    scenes: [
      {
        id: "hsk3-l2-s1",
        number: "01",
        glyph: "办",
        title: "讨论会议安排与解决问题",
        titleTh: "ประชุมวางแผนงานและแก้ปัญหาคอมพิวเตอร์",
        titleEn: "Workplace meeting and troubleshooting",
        place: "办公室",
        placePy: "bàngōngshì",
        placeTh: "ออฟฟิศ",
        context: "在办公室里，同事们互相协助检查电脑问题并高效完成会议准备。",
        contextTh: "ในออฟฟิศ เพื่อนร่วมงานช่วยเหลือกันตรวจสอบปัญหาคอมพิวเตอร์และเตรียมการประชุมอย่างมีประสิทธิภาพ",
        contextEn: "Colleagues collaborating to solve computer issues and prepare meetings.",
        characters: [
          { role: "A", profile: "wang", noteTh: "ผู้รับผิดชอบงานประชุม", noteZh: "负责会议准备的同事", noteEn: "Colleague preparing meeting" },
          { role: "B", profile: "yang", noteTh: "ผู้ช่วยแก้ปัญหาคอมพิวเตอร์", noteZh: "协助解决电脑问题的同事", noteEn: "Colleague troubleshooting computer" },
        ],
        lines: [
          { role: "A", speaker: "王一雪", pinyin: "jīnglǐ ràng wǒmen zhǔnbèi hòutiān de huìyì", hanzi: "经理让我们准备后天的会议。", reading: "Jīnglǐ ràng wǒmen zhǔnbèi hòutiān de huìyì.", en: "The manager asked us to prepare for the day after tomorrow's meeting.", th: "ผู้จัดการให้พวกเราเตรียมการประชุมวันมะรืนนี้ค่ะ", visual: { zh: "准备会议", th: "เตรียมการประชุม", focus: "26% center" } },
          { role: "B", speaker: "杨同乐", pinyin: "wǒ lái bāng nǐ jiǎnchá diànnǎo wèntí", hanzi: "我来帮你检查电脑问题。", reading: "Wǒ lái bāng nǐ jiǎnchá diànnǎo wèntí.", en: "Let me help you check the computer issue.", th: "ผมมาช่วยคุณตรวจปัญหาคอมพิวเตอร์นะครับ", visual: { zh: "检查电脑", th: "ตรวจคอมพิวเตอร์", focus: "74% center" } },
          { role: "A", speaker: "王一雪", pinyin: "tài xièxie nǐ le, wèntí jiějué le", hanzi: "太谢谢你了，问题解决了！", reading: "Tài xièxie nǐ le, wèntí jiějué le!", en: "Thank you so much, the problem is solved!", th: "ขอบคุณคุณมากๆ เลย ปัญหาได้รับการแก้ไขแล้วค่ะ!", visual: { zh: "问题解决", th: "แก้ปัญหาแล้ว", focus: "26% center" } },
          { role: "B", speaker: "杨同乐", pinyin: "bú kèqi, dàjiā yìqǐ nǔlì ba", hanzi: "不客气，大家一起努力吧！", reading: "Bú kèqi, dàjiā yìqǐ nǔlì ba!", en: "You're welcome, let's work hard together!", th: "ยินดีครับ พวกเราทุกคนตั้งใจทำงานร่วมกันนะครับ!", visual: { zh: "一起努力", th: "ร่วมมือกัน", focus: "74% center" } },
        ],
        qte: {
          after: 2,
          prompt: { th: "杨同乐帮王一雪解决了什么问题?", zh: "杨同乐帮王一雪解决了什么问题？", en: "What problem did Yang Tongle help Wang Yixue solve?" },
          options: [
            { value: "电脑问题", zh: "电脑问题", pinyin: "Diànnǎo wèntí", th: "ปัญหาคอมพิวเตอร์" },
            { value: "买车票", zh: "买车票", pinyin: "Mǎi chēpiào", th: "ซื้อตั๋วรถ" },
            { value: "借书", zh: "借书", pinyin: "Jiè shū", th: "ยืมหนังสือ" },
          ],
          correct: "电脑问题",
          evidence: "杨同乐：我来帮你检查电脑问题。",
          evidenceTh: "หยางถงเล่อ: ผมมาช่วยคุณตรวจปัญหาคอมพิวเตอร์นะครับ",
        },
        builder: {
          prompt: { th: "เรียงประโยคขอบคุณที่ช่วยแก้ปัญหา", zh: "重组解决问题句子", en: "Rebuild problem solved sentence" },
          answer: ["太谢谢你了，", "问题解决了！"],
          tiles: ["问题解决了！", "太谢谢你了，"],
          gloss: { "太谢谢你了": "ขอบคุณมากเลย", "问题解决了": "ปัญหาแก้ได้แล้ว" },
          translationTh: "ขอบคุณคุณมากๆ เลย ปัญหาได้รับการแก้ไขแล้วค่ะ!",
          translationEn: "Thank you so much, the problem is solved!",
          evidence: "Text 1 · HSK3 Lesson 11",
        },
      },
      {
        id: "hsk3-l2-s2",
        number: "02",
        glyph: "年",
        title: "一起包饺子过春节",
        titleTh: "ห่อเกี๊ยวฉลองวันตรุษจีนกับครอบครัว",
        titleEn: "Making dumplings for Spring Festival with family",
        place: "李文家",
        placePy: "Lǐ Wén jiā",
        placeTh: "บ้านหลี่เหวิน",
        context: "在李文家里，全家和朋友们一起包饺子，热热闹闹欢度中国新年。",
        contextTh: "ที่บ้านของหลี่เหวิน ทุกคนร่วมกันห่อเกี๊ยวและฉลองเทศกาลตรุษจีนอย่างอบอุ่นและมีความสุข",
        contextEn: "Making dumplings together with friends and family for Spring Festival.",
        characters: [
          { role: "A", profile: "bai", noteTh: "นักเรียนผู้ร่วมฉลองปีใหม่", noteZh: "一起过年的外国朋友", noteEn: "Friend celebrating New Year" },
          { role: "B", profile: "liUncle", noteTh: "คุณพ่อหลี่ผู้สอนห่อเกี๊ยว", noteZh: "教包饺子的李叔叔", noteEn: "Uncle Li teaching dumpling making" },
          { role: "C", profile: "zhangAunt", noteTh: "คุณป้าจางผู้อวยพรปีใหม่", noteZh: "送祝福的张阿姨", noteEn: "Aunt Zhang wishing Happy New Year" },
        ],
        lines: [
          { role: "A", speaker: "白家月", pinyin: "lǐ shūshu, zhāng āyí, xīnnián kuàilè", hanzi: "李叔叔、张阿姨，新年快乐！", reading: "Lǐ shūshu, Zhāng āyí, xīnnián kuàilè!", en: "Uncle Li, Aunt Zhang, Happy New Year!", th: "คุณลุงหลี่ คุณป้าจาง สุขสันต์วันปีใหม่ค่ะ!", visual: { zh: "新年快乐", th: "สุขสันต์วันปีใหม่", focus: "26% center" } },
          { role: "B", speaker: "李叔叔", pinyin: "xīnnián kuàilè, kuài lái yìqǐ bāo jiǎozi", hanzi: "新年快乐，快来一起包饺子！", reading: "Xīnnián kuàilè, kuài lái yìqǐ bāo jiǎozi!", en: "Happy New Year, come make dumplings together!", th: "สวัสดีปีใหม่จ้า รีบมาห่อเกี๊ยวด้วยกันนะ!", visual: { zh: "包饺子", th: "ห่อเกี๊ยว", focus: "74% center" } },
          { role: "A", speaker: "白家月", pinyin: "wǒ xuéhuì le bāo jiǎozi, tài gāoxìng le", hanzi: "我学会了包饺子，太高兴了！", reading: "Wǒ xuéhuì le bāo jiǎozi, tài gāoxìng le!", en: "I learned how to make dumplings, so happy!", th: "ฉันห่อเกี๊ยวเป็นแล้ว ดีใจจังเลยค่ะ!", visual: { zh: "学会了", th: "เรียนรู้เป็นแล้ว", focus: "26% center" } },
          { role: "C", speaker: "张阿姨", pinyin: "chī jiǎozi, zhù dàjiā xīnnián jiànkāng píng'ān", hanzi: "吃饺子，祝大家新年健康平安！", reading: "Chī jiǎozi, zhù dàjiā xīnnián jiànkāng píng'ān!", en: "Eat dumplings, wishing everyone health and peace in New Year!", th: "ทานเกี๊ยวกันนะ ขอให้ทุกคนสุขภาพแข็งแรงและปลอดภัยในปีใหม่นี้จ้ะ!", visual: { zh: "健康平安", th: "สุขภาพแข็งแรง", focus: "50% center" } },
        ],
        qte: {
          after: 2,
          prompt: { th: "过年的时候大家一起做什么?", zh: "过年的时候大家一起做什么？", en: "What does everyone do together during New Year?" },
          options: [
            { value: "包饺子", zh: "包饺子", pinyin: "Bāo jiǎozi", th: "ห่อเกี๊ยว" },
            { value: "买衣服", zh: "买衣服", pinyin: "Mǎi yīfu", th: "ซื้อเสื้อผ้า" },
            { value: "打篮球", zh: "打篮球", pinyin: "Dǎ lánqiú", th: "เล่นบาสเกตบอล" },
          ],
          correct: "包饺子",
          evidence: "李叔叔：快来一起包饺子！",
          evidenceTh: "คุณลุงหลี่: รีบมาห่อเกี๊ยวด้วยกันนะ!",
        },
        builder: {
          prompt: { th: "เรียงประโยคห่อเกี๊ยวเป็นแล้ว", zh: "重组包饺子句子", en: "Rebuild dumpling sentence" },
          answer: ["我学会了", "包饺子！"],
          tiles: ["包饺子！", "我学会了"],
          gloss: { "我学会了": "ฉันทำเป็นแล้ว", "包饺子": "ห่อเกี๊ยว" },
          translationTh: "ฉันห่อเกี๊ยวเป็นแล้ว!",
          translationEn: "I learned how to make dumplings!",
          evidence: "Text 2 · HSK3 Lesson 18",
        },
      },
    ],
  },
];

async function run() {
  console.log("Building dynamic curated 7 lessons (HSK1: 3, HSK2: 2, HSK3: 2)...");

  const { GROUP3_VOICE_PROFILES } = await import("../src/surfaces/group-3-8104/services/audio/voices.js");

  // Clean out any extra lesson directories
  for (const level of ["hsk1", "hsk2", "hsk3"]) {
    const levelDir = path.join(CONTENT_ROOT, "lessons", level);
    const entries = await fs.readdir(levelDir);
    const maxLesson = level === "hsk1" ? 3 : 2;
    for (const e of entries) {
      const match = e.match(/^lesson-(\d+)$/);
      if (match && Number(match[1]) > maxLesson) {
        await fs.rm(path.join(levelDir, e), { recursive: true, force: true });
        console.log(`Removed extra ${level}/${e}`);
      }
    }
  }

  const manifestFiles = [];

  for (const spec of DYNAMIC_SPEC) {
    console.log(`\nProcessing [${spec.targetLevel.toUpperCase()}] L${spec.targetNum}: "${spec.title.zh}"`);
    const targetDir = path.join(CONTENT_ROOT, "lessons", spec.targetLevel, `lesson-${pad(spec.targetNum)}`);
    const targetPublicDir = path.join(LESSON_ASSETS_ROOT, spec.targetLevel, `lesson-${pad(spec.targetNum)}`);
    await fs.mkdir(targetDir, { recursive: true });
    await fs.mkdir(path.join(targetPublicDir, "scenes"), { recursive: true });
    await fs.mkdir(path.join(targetPublicDir, "audio"), { recursive: true });

    // Read current lesson vocabulary if exists to preserve rich vocab pool
    let vocabList = [];
    try {
      const existing = await import(`../src/surfaces/group-3-8104/content/lessons/${spec.targetLevel}/lesson-${pad(spec.targetNum)}/content.js`);
      const key = Object.keys(existing).find(k => k.startsWith("LESSON_"));
      if (key && existing[key]?.vocabulary) {
        vocabList = existing[key].vocabulary;
      }
    } catch {}

    if (vocabList.length < 20) {
      // Fallback base vocabulary extracted from dialogue words
      const defaultWords = [
        ["你好", "nǐ hǎo", "interj.", "hello", "สวัสดี"],
        ["老师", "lǎoshī", "n.", "teacher", "ครู / อาจารย์"],
        ["谢谢", "xièxie", "v.", "thank you", "ขอบคุณ"],
        ["不客气", "bú kèqi", "idiom", "you are welcome", "ไม่เป็นไร"],
        ["再见", "zàijiàn", "v.", "goodbye", "ลาก่อน"],
        ["大家", "dàjiā", "pron.", "everyone", "ทุกคน"],
        ["学生", "xuésheng", "n.", "student", "นักเรียน"],
        ["家人", "jiārén", "n.", "family member", "คนในครอบครัว"],
        ["孩子", "háizi", "n.", "child", "เด็ก / ลูก"],
        ["工作", "gōngzuò", "v./n.", "work", "ทำงาน / งาน"],
        ["医生", "yīshēng", "n.", "doctor", "หมอ / แพทย์"],
        ["医院", "yīyuàn", "n.", "hospital", "โรงพยาบาล"],
        ["时间", "shíjiān", "n.", "time", "เวลา"],
        ["下班", "xiàbān", "v.", "finish work", "เลิกงาน"],
        ["买", "mǎi", "v.", "buy", "ซื้อ"],
        ["衣服", "yīfu", "n.", "clothes", "เสื้อผ้า"],
        ["便宜", "piányi", "adj.", "cheap", "ราคาถูก"],
        ["漂亮", "piàoliang", "adj.", "pretty", "สวยงาม"],
        ["中国菜", "Zhōngguócài", "n.", "Chinese food", "อาหารจีน"],
        ["机场", "jīchǎng", "n.", "airport", "สนามบิน"],
        ["北京", "Běijīng", "n.", "Beijing", "ปักกิ่ง"],
        ["高兴", "gāoxìng", "adj.", "happy", "ดีใจ / มีความสุข"],
      ];
      vocabList = defaultWords.map(([hanzi, pinyin, type, en, th], idx) => ({
        index: idx + 1,
        hanzi,
        pinyin,
        type,
        en,
        th,
        thAid: th,
        translationKind: "editorial-aid",
        page: 1,
        sourceRef: `${pdfPathMap[spec.targetLevel]}#printed-pages=1&pdf-pages=1`,
      }));
    }

    const objectivesList = [
      { zh: `掌握第${spec.targetNum}课的核心词汇与日常对话。`, th: `เข้าใจคำศัพท์หลักและบทสนทนาประจำวันในบทที่ ${spec.targetNum}`, sourceRef: `${pdfPathMap[spec.targetLevel]}#printed-pages=1&pdf-pages=1` },
      { zh: `熟练运用重点句型进行交流。`, th: `ใช้รูปประโยคสำคัญในการสื่อสารได้อย่างคล่องแคล่ว`, sourceRef: `${pdfPathMap[spec.targetLevel]}#printed-pages=1&pdf-pages=1` },
      { zh: `提高听力理解与阅读表达能力。`, th: `พัฒนาทักษะการฟังและการอ่านภาษาจีน`, sourceRef: `${pdfPathMap[spec.targetLevel]}#printed-pages=1&pdf-pages=1` },
    ];

    const grammarFocusList = [
      {
        title: "基础句型表达",
        titleEn: "Basic Sentence Structure",
        explanationZh: "掌握陈述句与常用疑问句的基本语序。",
        explanationEn: "Master basic word order in statements and common questions.",
        thAid: "เข้าใจโครงสร้างประโยคบอกเล่าและประโยคคำถามพื้นฐาน",
        examples: ["你好！", "这是我的家人。"],
        sourceRef: `${pdfPathMap[spec.targetLevel]}#printed-pages=1&pdf-pages=1`,
      },
      {
        title: "常用动词与形容词用法",
        titleEn: "Common Verbs and Adjectives",
        explanationZh: "熟练使用常用动词与形容词作谓语。",
        explanationEn: "Use common verbs and adjectives as predicates.",
        thAid: "ใช้คำกริยาและคำคุณศัพท์เป็นภาคแสดงในประโยค",
        examples: ["很好看。", "我想买一件衣服。"],
        sourceRef: `${pdfPathMap[spec.targetLevel]}#printed-pages=1&pdf-pages=1`,
      },
    ];

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
      ...spec.scenes.map((sc, idx) => ({
        number: pad(idx + 1),
        title: sc.title,
        titleTh: sc.titleTh,
        detail: `Text ${idx + 1} · Scenes`,
        pages: String(idx + 1),
        scene: idx + 1,
        sourceRef: `${pdfPathMap[spec.targetLevel]}#printed-pages=1&pdf-pages=1`,
      })),
    ];

    const enrichedScenes = spec.scenes.map((sc, sceneIndex) => {
      const sceneNum = sceneIndex + 1;
      const roleProfiles = new Map(sc.characters.map((c) => [c.role, c.profile]));

      const lines = sc.lines.map((line, lineIndex) => {
        const lineNum = lineIndex + 1;
        const filename = `${sc.id}-${pad(lineNum)}.mp3`;
        const canonicalFile = `lessons/${spec.targetLevel}/lesson-${pad(spec.targetNum)}/audio/scene-${pad(sceneNum)}/line-${pad(lineNum)}.mp3`;
        const localPath = path.join(PUBLIC_ROOT, "assets/group3", canonicalFile);

        const profile = line.voiceProfiles?.[0] || roleProfiles.get(line.role) || "teacherWang";
        let audioBuffer;
        try {
          audioBuffer = fs.readFileSync(localPath);
        } catch {
          // If not exist yet, we will read async below
        }

        return {
          role: line.role,
          speaker: line.speaker,
          pinyin: line.pinyin,
          hanzi: line.hanzi,
          reading: line.reading || line.hanzi,
          en: line.en,
          th: line.th,
          visual: line.visual,
          sourceRef: `${pdfPathMap[spec.targetLevel]}#printed-pages=1&pdf-pages=1`,
        };
      });

      return {
        ...sc,
        source: `Text ${sceneNum}`,
        sourcePage: String(sceneNum),
        sourceRef: `${pdfPathMap[spec.targetLevel]}#printed-pages=1&pdf-pages=1`,
        lines,
        qte: {
          ...sc.qte,
          sourceRef: `${pdfPathMap[spec.targetLevel]}#printed-pages=1&pdf-pages=1`,
        },
        builder: {
          ...sc.builder,
          sourceRef: `${pdfPathMap[spec.targetLevel]}#printed-pages=1&pdf-pages=1`,
        },
      };
    });

    const contentJsSource = `// Auto-generated dynamic Group 3 lesson content
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
  vocabulary: ${JSON.stringify(vocabList, null, 2)},
  grammarFocus: ${JSON.stringify(grammarFocusList, null, 2)},
  scenes: ${JSON.stringify(enrichedScenes, null, 2)},
};
`;

    await fs.writeFile(path.join(targetDir, "content.js"), contentJsSource, "utf8");
    console.log(`  ✓ Generated ${targetDir}/content.js (${enrichedScenes.length} scenes, ${vocabList.length} vocab)`);
  }

  // 2. Generate new registry.js with 7 lessons
  console.log("\nGenerating registry.js for 7 curated lessons...");
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
`;

  await fs.writeFile(path.join(CONTENT_ROOT, "registry.js"), registrySource, "utf8");
  console.log("  ✓ Updated registry.js with 7 curated lessons");
}

run().catch(console.error);
