import { group3AssetPath } from "../../../../config.js";

const SOURCE_FILE = "docs/references/hsk/sources/hsk1-2.pdf";

export function lesson13SourceRef(printedPages, pdfPages) {
  return `${SOURCE_FILE}#printed-pages=${printedPages}&pdf-pages=${pdfPages}`;
}

const sourceRef = lesson13SourceRef("95-102", "111-118");

const characters = {
  teacherWang: {
    hanzi: "王一飞",
    pinyin: "Wáng Yīfēi",
    nameTh: "อาจารย์หวังอี้เฟย",
    nameEn: "Ms. Wang",
    image: group3AssetPath("/assets/group3/lesson-13-classroom-v1.webp"),
    imageSrcSet: `${group3AssetPath("/assets/group3/lesson-13-classroom-720w-v1.webp")} 720w, ${group3AssetPath("/assets/group3/lesson-13-classroom-v1.webp")} 1400w`,
    imageFocus: "74% center",
  },
  bai: {
    hanzi: "白家月",
    pinyin: "Bái Jiāyuè",
    nameTh: "ไป๋เจียเยว่",
    nameEn: "Bai Jiayue",
    image: group3AssetPath("/assets/group3/lesson-13-classroom-v1.webp"),
    imageSrcSet: `${group3AssetPath("/assets/group3/lesson-13-classroom-720w-v1.webp")} 720w, ${group3AssetPath("/assets/group3/lesson-13-classroom-v1.webp")} 1400w`,
    imageFocus: "24% center",
  },
  cafeServer: {
    hanzi: "服务员",
    pinyin: "fúwùyuán",
    nameTh: "พนักงานหญิง",
    nameEn: "Waitress",
    image: group3AssetPath("/assets/group3/lesson-13-cafe-breakfast-v1.webp"),
    imageSrcSet: `${group3AssetPath("/assets/group3/lesson-13-cafe-breakfast-720w-v1.webp")} 720w, ${group3AssetPath("/assets/group3/lesson-13-cafe-breakfast-v1.webp")} 1400w`,
    imageFocus: "77% center",
  },
  wang: {
    hanzi: "王一雪",
    pinyin: "Wáng Yīxuě",
    nameTh: "หวังอี้เสวี่ย",
    nameEn: "Wang Yixue",
    image: group3AssetPath("/assets/group3/shared/characters/character-wang-yixue.webp"),
  },
  restaurantServer: {
    hanzi: "服务员",
    pinyin: "fúwùyuán",
    nameTh: "พนักงานชาย",
    nameEn: "Waiter",
    image: group3AssetPath("/assets/group3/lesson-13-dumpling-restaurant-v1.webp"),
    imageSrcSet: `${group3AssetPath("/assets/group3/lesson-13-dumpling-restaurant-720w-v1.webp")} 720w, ${group3AssetPath("/assets/group3/lesson-13-dumpling-restaurant-v1.webp")} 1400w`,
    imageFocus: "78% center",
  },
  liu: {
    hanzi: "刘明",
    pinyin: "Liú Míng",
    nameTh: "หลิวหมิง",
    nameEn: "Liu Ming",
    image: group3AssetPath("/assets/group3/shared/characters/character-liu-ming.webp"),
  },
};

const vocabularyPages = [
  [1, "可以", "kěyǐ", "mod.", "can; may", "สามารถ / ขออนุญาต", 97, 113],
  [2, "再", "zài", "adv.", "once more; again", "อีกครั้ง / อีก", 97, 113],
  [3, "问题", "wèntí", "n.", "question; problem", "คำถาม / ปัญหา", 97, 113],
  [4, "卖", "mài", "v.", "sell", "ขาย", 97, 113],
  [5, "打电话", "dǎ diànhuà", "", "make a phone call; call", "โทรศัพท์ / โทรไป", 97, 113],
  [6, "一下", "yíxià", "num.-m.", "one time; once", "หนึ่งครั้ง / ลอง…ดู", 97, 113],
  [7, "服务员", "fúwùyuán", "n.", "attendant; waiter; waitress", "พนักงานบริการ / บริกร", 99, 115],
  [8, "女士", "nǚshì", "n.", "lady; madam", "คุณผู้หญิง", 99, 115],
  [9, "请", "qǐng", "v.", "please", "กรุณา / เชิญ", 99, 115],
  [10, "坐", "zuò", "v.", "sit", "นั่ง", 99, 115],
  [11, "给", "gěi", "v.", "give", "ให้", 99, 115],
  [12, "杯", "bēi", "n.", "cup; glass", "ถ้วย / แก้ว", 99, 115],
  [13, "要", "yào", "v.", "demand; ask for", "ต้องการ / เอา / สั่ง", 99, 115],
  [14, "早饭", "zǎofàn", "n.", "breakfast", "อาหารเช้า", 99, 115],
  [15, "这个", "zhège", "pron.", "this", "นี้ / อันนี้", 99, 115],
  [16, "面包", "miànbāo", "n.", "bread", "ขนมปัง", 99, 115],
  [17, "鸡蛋", "jīdàn", "n.", "(hen’s) egg", "ไข่ไก่", 99, 115],
  [18, "先生", "xiānsheng", "n.", "gentleman; sir", "คุณผู้ชาย / ท่าน", 100, 116],
  [19, "一半", "yíbàn", "num.", "one half; half", "ครึ่งหนึ่ง", 100, 116],
  [20, "茶", "chá", "n.", "tea", "ชา", 100, 116],
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
  sourceRef: lesson13SourceRef(String(page), String(pdfPage)),
}));

function line(source, value) {
  return { ...value, sourceRef: source };
}

const classroomRef = lesson13SourceRef("96", "112");
const cafeRef = lesson13SourceRef("98", "114");
const restaurantRef = lesson13SourceRef("99-100", "115-116");

const scenes = [
  {
    id: "l13-classroom",
    number: "01",
    glyph: "问",
    title: "下课后问老师",
    titleTh: "ถามครูหลังเลิกเรียน",
    titleEn: "Asking the teacher after class",
    place: "教室里，下课后",
    placeTh: "ในห้องเรียน หลังเลิกเรียน",
    image: group3AssetPath("/assets/group3/lesson-13-classroom-v1.webp"),
    imageSrcSet: `${group3AssetPath("/assets/group3/lesson-13-classroom-720w-v1.webp")} 720w, ${group3AssetPath("/assets/group3/lesson-13-classroom-v1.webp")} 1400w`,
    imageAlt: {
      th: "ภาพประกอบสร้างใหม่เพื่อช่วยจำ: ผู้เรียนถามอาจารย์หลังเลิกเรียน",
      zh: "帮助记忆的新创插图：学生下课后向老师提问",
      en: "Original memory-aid illustration of a learner asking a teacher after class",
    },
    source: "Text 1 · หน้าเล่ม 96 · PDF หน้า 112",
    sourcePage: "96",
    sourceRef: classroomRef,
    context: "在教室里，下课后，白家月问王老师问题。",
    contextTh: "ในห้องเรียนหลังเลิกเรียน ไป๋เจียเยว่ถามคำถามอาจารย์หวัง",
    contextEn: "In the classroom, after class, Bai Jiayue asked Ms. Wang a question.",
    characters: [
      { role: "A", profile: "teacherWang", noteTh: "อาจารย์ผู้ตอบคำถามและแนะนำให้โทรไปถาม", noteZh: "回答问题并建议打电话询问的老师", noteEn: "The teacher who suggests calling to ask" },
      { role: "B", profile: "bai", noteTh: "ผู้เรียนที่ขอถามเพิ่มอีกหนึ่งคำถาม", noteZh: "想再问一个问题的学生", noteEn: "The learner asking one more question" },
    ],
    lines: [
      line(classroomRef, { role: "B", speaker: "白家月", pinyin: "wèn yí ge wèntí", hanzi: "王老师，我可以再问您一个问题吗？", reading: "Wáng lǎoshī, wǒ kěyǐ zài wèn nín yí ge wèntí ma?", en: "Ms. Wang, may I ask you one more question?", th: "อาจารย์หวัง ฉันขอถามคุณอีกหนึ่งคำถามได้ไหม?", visual: { zh: "再问一个问题", th: "ถามเพิ่มอีกหนึ่งคำถาม", focus: "24% center" } }),
      line(classroomRef, { role: "A", speaker: "王一飞", pinyin: "yǒu shénme wèntí", hanzi: "可以。你有什么问题？", reading: "Kěyǐ. Nǐ yǒu shénme wèntí?", en: "Yes, of course. What’s your question?", th: "ได้ คุณมีคำถามอะไร?", visual: { zh: "可以", th: "ได้ / สามารถ", focus: "74% center" } }),
      line(classroomRef, { role: "B", speaker: "白家月", pinyin: "mài bu mài shǒujī", hanzi: "那个小店卖不卖手机？", reading: "Nàge xiǎodiàn mài bu mài shǒujī?", en: "Does that small shop sell cell phones?", th: "ร้านเล็ก ๆ แห่งนั้นขายโทรศัพท์มือถือไหม?", visual: { zh: "卖不卖手机", th: "ขายโทรศัพท์ไหม", focus: "28% center" } }),
      line(classroomRef, { role: "A", speaker: "王一飞", pinyin: "dǎ diànhuà wèn yíxià", hanzi: "我不知道。你可以打电话问一下。", reading: "Wǒ bù zhīdào. Nǐ kěyǐ dǎ diànhuà wèn yíxià.", en: "I’m not sure. You can call to ask.", th: "ฉันไม่ทราบ คุณลองโทรไปถามดูได้", visual: { zh: "打电话问一下", th: "ลองโทรไปถาม", focus: "72% center" } }),
    ],
    qte: {
      after: 2,
      prompt: { th: "B ถาม A เรื่องอะไร?", zh: "B 向 A 问什么？", en: "What does B ask A about?" },
      options: [
        { value: "那个小店卖不卖手机？", zh: "那个小店卖不卖手机？", pinyin: "Nàge xiǎodiàn mài bu mài shǒujī?", th: "ร้านเล็กนั้นขายโทรศัพท์ไหม?" },
        { value: "您喝什么？", zh: "您喝什么？", pinyin: "Nín hē shénme?", th: "คุณจะดื่มอะไร?" },
        { value: "您要什么？", zh: "您要什么？", pinyin: "Nín yào shénme?", th: "คุณต้องการอะไร?" },
      ],
      correct: "那个小店卖不卖手机？",
      evidence: "白家月：那个小店卖不卖手机？",
      evidenceTh: "ไป๋เจียเยว่: ร้านเล็ก ๆ แห่งนั้นขายโทรศัพท์มือถือไหม?",
      sourceRef: classroomRef,
    },
    builder: {
      prompt: { th: "เรียงประโยคคำแนะนำของอาจารย์", zh: "重组老师的建议", en: "Rebuild the teacher’s suggestion" },
      answer: ["你", "可以", "打电话", "问", "一下"],
      tiles: ["问", "一下", "你", "打电话", "可以"],
      gloss: { 你: "คุณ", 可以: "สามารถ", 打电话: "โทรศัพท์", 问: "ถาม", 一下: "สักหน่อย" },
      translationTh: "คุณลองโทรไปถามดูได้",
      translationEn: "You can call to ask.",
      evidence: "Text 1 · หน้าเล่ม 96",
      sourceRef: classroomRef,
    },
  },
  {
    id: "l13-cafe",
    number: "02",
    glyph: "奶",
    title: "在咖啡馆吃早饭",
    titleTh: "สั่งอาหารเช้าในคาเฟ่",
    titleEn: "Ordering breakfast in a café",
    place: "咖啡馆",
    placeTh: "คาเฟ่",
    image: group3AssetPath("/assets/group3/lesson-13-cafe-breakfast-v1.webp"),
    imageSrcSet: `${group3AssetPath("/assets/group3/lesson-13-cafe-breakfast-720w-v1.webp")} 720w, ${group3AssetPath("/assets/group3/lesson-13-cafe-breakfast-v1.webp")} 1400w`,
    imageAlt: {
      th: "ภาพประกอบสร้างใหม่เพื่อช่วยจำ: ลูกค้าสั่งนม ขนมปัง และไข่ในคาเฟ่",
      zh: "帮助记忆的新创插图：顾客在咖啡馆点牛奶、面包和鸡蛋",
      en: "Original memory-aid illustration of a customer ordering milk, bread, and egg in a café",
    },
    source: "Text 2 · หน้าเล่ม 98 · PDF หน้า 114",
    sourcePage: "98",
    sourceRef: cafeRef,
    context: "在咖啡馆里，王一雪想吃早餐。",
    contextTh: "ในคาเฟ่ หวังอี้เสวี่ยต้องการกินอาหารเช้า",
    contextEn: "In the café, Wang Yixue wanted to have breakfast.",
    characters: [
      { role: "A", profile: "cafeServer", noteTh: "พนักงานหญิงผู้รับรายการอาหารเช้า", noteZh: "接待并记录早餐订单的服务员", noteEn: "The waitress taking the breakfast order" },
      { role: "B", profile: "wang", noteTh: "ลูกค้าที่สั่งนม ขนมปัง และไข่", noteZh: "点牛奶、面包和鸡蛋的顾客", noteEn: "The customer ordering milk, bread, and egg" },
    ],
    lines: [
      line(cafeRef, { role: "A", speaker: "服务员", pinyin: "nín hē shénme", hanzi: "女士，请坐！您喝什么？", reading: "Nǚshì, qǐng zuò! Nín hē shénme?", en: "Madam, have a seat, please! What would you like to drink?", th: "คุณผู้หญิง เชิญนั่งค่ะ! คุณจะดื่มอะไร?", visual: { zh: "请坐", th: "เชิญนั่ง", focus: "77% center" } }),
      line(cafeRef, { role: "B", speaker: "王一雪", pinyin: "yì bēi niúnǎi", hanzi: "我看一下。请给我一杯牛奶。", reading: "Wǒ kàn yíxià. Qǐng gěi wǒ yì bēi niúnǎi.", en: "Let me have a look. I’ll have a glass of milk, please.", th: "ขอดูหน่อยค่ะ ขอนมหนึ่งแก้ว", visual: { zh: "一杯牛奶", th: "นมหนึ่งแก้ว", focus: "38% center" } }),
      line(cafeRef, { role: "A", speaker: "服务员", pinyin: "hái yào shénme", hanzi: "好的。您还要什么？", reading: "Hǎo de. Nín hái yào shénme?", en: "Alright. Would you like anything else?", th: "ได้ค่ะ คุณต้องการอะไรอีกไหม?", visual: { zh: "还要什么", th: "ต้องการอะไรอีก", focus: "74% center" } }),
      line(cafeRef, { role: "B", speaker: "王一雪", pinyin: "miànbāo hé jīdàn", hanzi: "我还没吃早饭，再要这个面包和鸡蛋吧。", reading: "Wǒ hái méi chī zǎofàn, zài yào zhège miànbāo hé jīdàn ba.", en: "I haven’t had breakfast yet, so I’ll have a fried egg on bread.", th: "ฉันยังไม่ได้กินอาหารเช้า งั้นเอาขนมปังกับไข่นี้เพิ่มด้วยค่ะ", visual: { zh: "面包和鸡蛋", th: "ขนมปังและไข่", focus: "48% center" } }),
    ],
    qte: {
      after: 1,
      prompt: { th: "หวังอี้เสวี่ยต้องการดื่มอะไร?", zh: "王一雪想喝什么？", en: "What does Wang Yixue want to drink?" },
      options: [
        { value: "水", zh: "水", pinyin: "shuǐ", th: "น้ำ" },
        { value: "茶", zh: "茶", pinyin: "chá", th: "ชา" },
        { value: "牛奶", zh: "牛奶", pinyin: "niúnǎi", th: "นม" },
      ],
      correct: "牛奶",
      evidence: "王一雪：请给我一杯牛奶。",
      evidenceTh: "หวังอี้เสวี่ย: ขอนมหนึ่งแก้ว",
      sourceRef: cafeRef,
    },
    builder: {
      prompt: { th: "เรียงประโยคสั่งนมของหวังอี้เสวี่ย", zh: "重组王一雪点牛奶的句子", en: "Rebuild Wang Yixue’s milk order" },
      answer: ["请", "给", "我", "一杯", "牛奶"],
      tiles: ["牛奶", "我", "请", "一杯", "给"],
      gloss: { 请: "กรุณา", 给: "ให้", 我: "ฉัน", 一杯: "หนึ่งแก้ว", 牛奶: "นม" },
      translationTh: "ขอนมหนึ่งแก้ว",
      translationEn: "I’ll have a glass of milk, please.",
      evidence: "Text 2 · หน้าเล่ม 98",
      sourceRef: cafeRef,
    },
  },
  {
    id: "l13-dumplings",
    number: "03",
    glyph: "茶",
    title: "在餐馆点饺子和茶",
    titleTh: "สั่งเกี๊ยวและชาในร้านอาหาร",
    titleEn: "Ordering jiaozi and tea in a restaurant",
    place: "餐馆",
    placeTh: "ร้านอาหาร",
    image: group3AssetPath("/assets/group3/lesson-13-dumpling-restaurant-v1.webp"),
    imageSrcSet: `${group3AssetPath("/assets/group3/lesson-13-dumpling-restaurant-720w-v1.webp")} 720w, ${group3AssetPath("/assets/group3/lesson-13-dumpling-restaurant-v1.webp")} 1400w`,
    imageAlt: {
      th: "ภาพประกอบสร้างใหม่เพื่อช่วยจำ: ลูกค้าสั่งเกี๊ยวครึ่งจินและชาหนึ่งถ้วย",
      zh: "帮助记忆的新创插图：顾客点半斤饺子和一杯茶",
      en: "Original memory-aid illustration of a customer ordering half a jin of jiaozi and a cup of tea",
    },
    source: "Text 3 · หน้าเล่ม 99–100 · PDF หน้า 115–116",
    sourcePage: "99–100",
    sourceRef: restaurantRef,
    context: "在餐馆里，刘明在点餐。",
    contextTh: "ในร้านอาหาร หลิวหมิงกำลังสั่งอาหาร",
    contextEn: "In the restaurant, Liu Ming was ordering food.",
    characters: [
      { role: "A", profile: "restaurantServer", noteTh: "พนักงานชายผู้รับรายการเกี๊ยวและเครื่องดื่ม", noteZh: "接待并确认饺子数量和饮料的服务员", noteEn: "The waiter confirming the dumpling amount and drink" },
      { role: "B", profile: "liu", noteTh: "ลูกค้าที่ลดเกี๊ยวเหลือครึ่งจินและสั่งชา", noteZh: "把饺子改成半斤并点茶的顾客", noteEn: "The customer changing to half a jin and ordering tea" },
    ],
    lines: [
      line(restaurantRef, { role: "A", speaker: "服务员", pinyin: "nín yào shénme", hanzi: "先生，请坐！您要什么？", reading: "Xiānsheng, qǐng zuò! Nín yào shénme?", en: "Sir, have a seat, please! What would you like to order?", th: "คุณผู้ชาย เชิญนั่งครับ! คุณจะสั่งอะไร?", visual: { zh: "您要什么", th: "คุณจะสั่งอะไร", focus: "77% center" } }),
      line(restaurantRef, { role: "B", speaker: "刘明", pinyin: "yì jīn jiǎozi", hanzi: "我要一斤饺子。", reading: "Wǒ yào yì jīn jiǎozi.", en: "I’d like one jin of jiaozi.", th: "ผมเอาเกี๊ยวหนึ่งจิน", visual: { zh: "一斤饺子", th: "เกี๊ยวหนึ่งจิน", focus: "30% center" } }),
      line(restaurantRef, { role: "A", speaker: "服务员", pinyin: "sìshí ge", hanzi: "好的。一斤饺子40个。", reading: "Hǎo de. Yì jīn jiǎozi sìshí ge.", en: "Alright. One jin of jiaozi has forty pieces.", th: "ได้ครับ เกี๊ยวหนึ่งจินมี 40 ตัว", visual: { zh: "40个", th: "40 ตัว", focus: "66% center" } }),
      line(restaurantRef, { role: "B", speaker: "刘明", pinyin: "wǒ yào yíbàn", hanzi: "40个太多了，我要一半吧。", reading: "Sìshí ge tài duō le, wǒ yào yíbàn ba.", en: "Forty is too many. I’ll have half of that.", th: "40 ตัวมากเกินไป ผมเอาครึ่งหนึ่งแล้วกัน", visual: { zh: "一半", th: "ครึ่งหนึ่ง", focus: "32% center" } }),
      line(restaurantRef, { role: "A", speaker: "服务员", pinyin: "bàn jīn èrshí ge", hanzi: "半斤20个。您想喝什么？", reading: "Bàn jīn èrshí ge. Nín xiǎng hē shénme?", en: "Half is twenty. What would you like to drink?", th: "ครึ่งจินมี 20 ตัว คุณอยากดื่มอะไร?", visual: { zh: "半斤20个", th: "ครึ่งจิน 20 ตัว", focus: "72% center" } }),
      line(restaurantRef, { role: "B", speaker: "刘明", pinyin: "yì bēi chá", hanzi: "请给我一杯茶吧。", reading: "Qǐng gěi wǒ yì bēi chá ba.", en: "I’ll have a cup of tea, please.", th: "ขอชาหนึ่งถ้วยครับ", visual: { zh: "一杯茶", th: "ชาหนึ่งถ้วย", focus: "45% center" } }),
    ],
    qte: {
      after: 5,
      prompt: { th: "หลิวหมิงต้องการดื่มอะไร?", zh: "刘明想喝什么？", en: "What does Liu Ming want to drink?" },
      options: [
        { value: "水", zh: "水", pinyin: "shuǐ", th: "น้ำ" },
        { value: "茶", zh: "茶", pinyin: "chá", th: "ชา" },
        { value: "牛奶", zh: "牛奶", pinyin: "niúnǎi", th: "นม" },
      ],
      correct: "茶",
      evidence: "刘明：请给我一杯茶吧。",
      evidenceTh: "หลิวหมิง: ขอชาหนึ่งถ้วยครับ",
      sourceRef: restaurantRef,
    },
    builder: {
      prompt: { th: "เรียงประโยคสั่งชาของหลิวหมิง", zh: "重组刘明点茶的句子", en: "Rebuild Liu Ming’s tea order" },
      answer: ["请", "给", "我", "一杯", "茶", "吧"],
      tiles: ["茶", "我", "吧", "请", "一杯", "给"],
      gloss: { 请: "กรุณา", 给: "ให้", 我: "ฉัน", 一杯: "หนึ่งถ้วย", 茶: "ชา", 吧: "นะ / ครับ" },
      translationTh: "ขอชาหนึ่งถ้วยครับ",
      translationEn: "I’ll have a cup of tea, please.",
      evidence: "Text 3 · หน้าเล่ม 100",
      sourceRef: lesson13SourceRef("100", "116"),
    },
  },
];

export const LESSON_13 = {
  id: "hsk1-l13",
  slug: "lesson-13",
  level: "hsk1",
  number: 13,
  featured: true,
  source: {
    title: "新HSK教程 1 · New HSK Course 1",
    lesson: "Lesson 13 · 请给我一杯茶",
    printedPages: "95–102",
    pdfPages: "111–118",
    file: "hsk1-2.pdf",
    sourceRef,
  },
  sourceRef,
  title: {
    zh: "请给我一杯茶",
    pinyin: "Qǐng gěi wǒ yì bēi chá",
    en: "I’ll have a cup of tea, please",
    thAid: "ขอชาหนึ่งถ้วยครับ/ค่ะ",
  },
  summary: {
    zh: "从课后提问到在咖啡馆和餐馆点餐，学习“可以”“一下”和双宾语句。",
    en: "Move from asking a question after class to ordering breakfast, jiaozi, and tea.",
    thAid: "จากการถามครูหลังเลิกเรียน ไปสู่การสั่งอาหารเช้า เกี๊ยว และชา พร้อมฝึก 可以, 一下 และประโยคกรรมคู่",
  },
  translationPolicy: { kind: "editorial-aid", labelTh: "คำแปลไทยเพื่อช่วยเรียน เรียบเรียงจากต้นฉบับ" },
  objectives: [
    { zh: "能听懂并使用双宾语句（1）表示向别人提问或给予别人东西等。", en: "Be able to understand and use double-object sentences (1) to express asking someone questions or giving someone things, and so on.", thAid: "เข้าใจและใช้ประโยคกรรมคู่เพื่อถามคำถามหรือมอบสิ่งของให้ผู้อื่น", sourceRef: lesson13SourceRef("95", "111") },
    { zh: "掌握能愿动词“可以”的用法。", en: "Master the use of the modal verb “可以”.", thAid: "เข้าใจการใช้คำกริยาช่วย 可以", sourceRef: lesson13SourceRef("95", "111") },
    { zh: "掌握“动词+一下”结构的用法。", en: "Master the use of the “Verb+一下” structure.", thAid: "เข้าใจการใช้โครงสร้าง กริยา + 一下", sourceRef: lesson13SourceRef("95", "111") },
    { zh: "了解点餐常用语。", en: "Understand common expressions for ordering food.", thAid: "เข้าใจสำนวนทั่วไปในการสั่งอาหาร", sourceRef: lesson13SourceRef("95", "111") },
  ],
  contents: [
    { number: "00", title: "目标与热身", titleTh: "เป้าหมายและภาพรวมบทเรียน", detail: "Objectives · Warm-Up", pages: "95", route: "/home/hsk1/lesson-13/preface/", sourceRef: lesson13SourceRef("95", "111") },
    { number: "01", title: "在教室里，下课后", titleTh: "ถามครูหลังเลิกเรียน", detail: "Text 1 · New Words 1–6", pages: "96–97", scene: 1, sourceRef: lesson13SourceRef("96-97", "112-113") },
    { number: "02", title: "在咖啡馆里", titleTh: "สั่งอาหารเช้าในคาเฟ่", detail: "Text 2 · New Words 7–17", pages: "98–99", scene: 2, sourceRef: lesson13SourceRef("98-99", "114-115") },
    { number: "03", title: "在餐馆里", titleTh: "สั่งเกี๊ยวและชาในร้านอาหาร", detail: "Text 3 · New Words 18–20", pages: "99–100", scene: 3, sourceRef: lesson13SourceRef("99-100", "115-116") },
    { number: "04", title: "综合练习与活动", titleTh: "แบบฝึกหัดและกิจกรรมท้ายบท", detail: "Exercises · Activity (source trail)", pages: "101–102", sourceRef: lesson13SourceRef("101-102", "117-118") },
  ],
  vocabulary,
  grammarFocus: [
    { title: "能愿动词“可以”", titleEn: "Modal Verb “可以”", explanationZh: "能愿动词“可以”位于动词前，表示可能、能够或许可。", explanationEn: "The modal verb “可以” is placed before a verb to indicate possibility, capability, or permission.", thAid: "可以 วางหน้าคำกริยา เพื่อแสดงความเป็นไปได้ ความสามารถ หรือการอนุญาต", examples: ["我可以再问您一个问题吗？", "你们可以看这本书。", "我可以坐吗？ / 可以，请坐！"], sourceRef: lesson13SourceRef("97", "113") },
    { title: "“动词+一下”结构", titleEn: "“Verb+一下” Structure", explanationZh: "本课“动词+一下”结构表示做一次或试着做，动作时间短。", explanationEn: "In this lesson, the “Verb+一下” structure indicates that an action is performed as a quick attempt or it is brief.", thAid: "กริยา + 一下 ใช้บอกว่าทำหนึ่งครั้ง ลองทำ หรือทำชั่วครู่", examples: ["你可以打电话问一下。", "请休息一下。", "你看一下吧。"], sourceRef: lesson13SourceRef("97", "113") },
    { title: "双宾语句（1）", titleEn: "Double-Object Sentences (1)", explanationZh: "双宾语句是一个动词带两个宾语的句子。本册学习“给、问”构成的双宾语句。", explanationEn: "A double-object sentence is one where a verb takes two objects. In this volume, we focus on double-object sentences formed by “给” and “问”.", thAid: "ประโยคกรรมคู่มีคำกริยาที่รับกรรมสองตัว บทนี้เน้น 给 และ 问", examples: ["请给我一杯牛奶。", "白家月给安妮一个苹果。", "我问老师两个问题。"], sourceRef: lesson13SourceRef("99", "115") },
  ],
  characters,
  scenes,
};
