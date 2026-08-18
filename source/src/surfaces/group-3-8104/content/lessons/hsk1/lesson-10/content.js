import { group3AssetPath } from "../../../../config.js";

const LESSON_10_SOURCE_FILE = "docs/references/hsk/sources/hsk1-2.pdf";

export function lesson10SourceRef(printedPages, pdfPages) {
  return `${LESSON_10_SOURCE_FILE}#printed-pages=${printedPages}&pdf-pages=${pdfPages}`;
}

export const SOURCE = {
  title: "新HSK教程 1 · New HSK Course 1",
  lesson: "Lesson 10 · 这儿的苹果真便宜！",
  printedPages: "70–77",
  pdfPages: "86–93",
  file: "hsk1-2.pdf",
  sourceRef: lesson10SourceRef("70-77", "86-93"),
};


export const LESSON_OBJECTIVES = [
  {
    zh: "能听懂、看懂并简单谈论商品价格。",
    th: "ฟังและอ่านเข้าใจบทสนทนาง่าย ๆ เกี่ยวกับราคาสินค้า และพูดถาม–ตอบราคาอย่างง่าย",
  },
  {
    zh: "掌握形容词谓语句的用法。",
    th: "เข้าใจการใช้ประโยคภาคแสดงที่เป็นคำคุณศัพท์",
  },
  {
    zh: "掌握疑问代词“怎么样”的用法。",
    th: "เข้าใจการใช้สรรพนามคำถาม “怎么样”",
  },
  {
    zh: "认识人民币。",
    th: "รู้จักเงินเหรินหมินปี้ (RMB)",
  },
].map((objective) => ({
  ...objective,
  sourceRef: lesson10SourceRef("70", "86"),
}));


export const LESSON_CONTENTS = [
  { number: "00", title: "目标与热身", titleTh: "เป้าหมายและภาพรวมบทเรียน", detail: "Objectives · Warm-Up", pages: "70", route: "/home/hsk1/lesson-10/preface/" },
  { number: "01", title: "在一家小店买杯子", titleTh: "ซื้อแก้วในร้านค้า (Text 1)", detail: "Text 1 · New Words 1–7", pages: "71", scene: 1 },
  { number: "02", title: "在菜市场买水果", titleTh: "ซื้อผลไม้ในตลาดสด (Text 2)", detail: "Text 2 · New Words 8–13", pages: "72–73", scene: 2 },
  { number: "03", title: "在商场买衣服", titleTh: "ซื้อเสื้อผ้าในห้าง (Text 3)", detail: "Text 3 · New Words 14–23", pages: "74–75", scene: 3 },
  { number: "04", title: "课堂练习与综合练习", titleTh: "แบบฝึกหัดท้ายบทเรียน", detail: "Classroom · Comprehensive Exercises", pages: "76–77" },
].map((item) => ({
  ...item,
  sourceRef: SOURCE.sourceRef,
}));


export const LESSON_VOCABULARY = [
  { index: 1, hanzi: "杯子", pinyin: "bēizi", type: "n.", en: "cup; glass", th: "แก้ว / ถ้วย", page: 71 },
  { index: 2, hanzi: "售货员", pinyin: "shòuhuòyuán", type: "n.", en: "shop assistant; salesperson; vendor", th: "พนักงานขาย", page: 71 },
  { index: 3, hanzi: "这边", pinyin: "zhèbiān", type: "pron.", en: "here; this side", th: "ทางนี้ / ด้านนี้", page: 71 },
  { index: 4, hanzi: "钱", pinyin: "qián", type: "n.", en: "money", th: "เงิน", page: 71 },
  { index: 5, hanzi: "这些", pinyin: "zhèxiē", type: "pron.", en: "these", th: "พวกนี้ / สิ่งเหล่านี้", page: 71 },
  { index: 6, hanzi: "块", pinyin: "kuài", type: "m.", en: "for silver dollars or paper money", th: "ไคว่ / หน่วยเรียกเงินหยวน", page: 71 },
  { index: 7, hanzi: "那些", pinyin: "nàxiē", type: "pron.", en: "those", th: "พวกนั้น", page: 71 },
  { index: 8, hanzi: "这儿", pinyin: "zhèr", type: "pron.", en: "here", th: "ที่นี่", page: 73 },
  { index: 9, hanzi: "水果", pinyin: "shuǐguǒ", type: "n.", en: "fruit", th: "ผลไม้", page: 73 },
  { index: 10, hanzi: "少", pinyin: "shǎo", type: "adj.", en: "few; little", th: "น้อย", page: 73 },
  { index: 11, hanzi: "斤", pinyin: "jīn", type: "m.", en: "jin", th: "จิน (500 กรัม)", page: 73 },
  { index: 12, hanzi: "苹果", pinyin: "píngguǒ", type: "n.", en: "apple", th: "แอปเปิล", page: 73 },
  { index: 13, hanzi: "便宜", pinyin: "piányi", type: "adj.", en: "cheap; affordable", th: "ราคาถูก", page: 73 },
  { index: 14, hanzi: "商店", pinyin: "shāngdiàn", type: "n.", en: "shop; store", th: "ร้านค้า", page: 75 },
  { index: 15, hanzi: "衣服", pinyin: "yīfu", type: "n.", en: "clothes", th: "เสื้อผ้า", page: 75 },
  { index: 16, hanzi: "件", pinyin: "jiàn", type: "m.", en: "piece", th: "ตัว / ชิ้น (ลักษณนาม)", page: 75 },
  { index: 17, hanzi: "元", pinyin: "yuán", type: "m.", en: "yuan", th: "หยวน", page: 75 },
  { index: 18, hanzi: "怎么样", pinyin: "zěnmeyàng", type: "pron.", en: "how; what about", th: "เป็นอย่างไร", page: 75 },
  { index: 19, hanzi: "贵", pinyin: "guì", type: "adj.", en: "expensive", th: "แพง", page: 75 },
  { index: 20, hanzi: "穿", pinyin: "chuān", type: "v.", en: "wear; put on", th: "สวม / ใส่", page: 75 },
  { index: 21, hanzi: "女", pinyin: "nǚ", type: "adj.", en: "female; woman", th: "หญิง", page: 75 },
  { index: 22, hanzi: "男", pinyin: "nán", type: "adj.", en: "male; man", th: "ชาย", page: 75 },
  { index: 23, hanzi: "那儿", pinyin: "nàr", type: "pron.", en: "there; that place", th: "ที่นั่น", page: 75 },
].map((word) => ({
  ...word,
  sourceRef: lesson10SourceRef(String(word.page), String(word.page + 16)),
}));


export const CHARACTER_PROFILES = {
  wang: {
    hanzi: "王一雪",
    pinyin: "Wáng Yīxuě",
    nameTh: "หวังอี้เสวี่ย",
    image: group3AssetPath("/assets/group3/shared/characters/character-wang-yixue.webp"),
  },
  shopAssistant: {
    hanzi: "售货员",
    pinyin: "shòuhuòyuán",
    nameTh: "พนักงานขาย",
    image: group3AssetPath("/assets/group3/shared/characters/character-shop-assistant.webp"),
  },
  fruitVendor: {
    hanzi: "售货员",
    pinyin: "shòuhuòyuán",
    nameTh: "พนักงานขายผลไม้",
    image: group3AssetPath("/assets/group3/shared/characters/character-fruit-vendor.webp"),
  },
  liu: {
    hanzi: "刘明",
    pinyin: "Liú Míng",
    nameTh: "หลิวหมิง",
    image: group3AssetPath("/assets/group3/shared/characters/character-liu-ming.webp"),
  },
};


export const STORY_SCENES = [
  {
    id: "cup",
    sourceRef: lesson10SourceRef("71", "87"),
    number: "01",
    glyph: "杯",
    title: "在小店买杯子",
    titleTh: "ซื้อแก้วในร้านเล็ก",
    place: "一家小店",
    placeTh: "ร้านเล็ก",
    image: group3AssetPath("/assets/group3/scene-cups.webp"),
    imageSrcSet: `${group3AssetPath("/assets/group3/scene-cups-720w.webp")} 720w, ${group3AssetPath("/assets/group3/scene-cups.webp")} 1400w`,
    imageAlt: { th: "แก้วหลากสีวางเรียงในร้านขายของใช้", zh: "小店里整齐陈列的彩色杯子", en: "Colorful cups arranged in a small household-goods shop" },
    source: "Text 1 · หน้าเล่ม 71 · PDF หน้า 87",
    sourcePage: "71",
    context: "在一家小店，王一雪在买杯子。",
    contextTh: "ในร้านเล็กแห่งหนึ่ง หวังอี้เสวี่ยกำลังซื้อแก้ว",
    roles: { A: "售货员", B: "王一雪" },
    characters: [
      { role: "A", profile: "shopAssistant", noteTh: "พนักงานขายผู้บอกตำแหน่งและราคาแก้ว", noteZh: "介绍杯子位置和价格的售货员" },
      { role: "B", profile: "wang", noteTh: "ลูกค้าที่เข้ามาถามหาแก้วและเลือกซื้อหนึ่งใบ", noteZh: "询问杯子并选择购买的顾客" },
    ],
    lines: [
      { role: "B", speaker: "王一雪", pinyin: "bēi zi", hanzi: "请问，有杯子吗？", reading: "Qǐngwèn, yǒu bēizi ma?", en: "Excuse me, do you have any cups?", th: "ขอถามหน่อยค่ะ มีแก้วไหมคะ?", visual: { zh: "杯子", th: "แก้ว", focus: "42% center" }, sourceRef: lesson10SourceRef("71", "87") },
      { role: "A", speaker: "售货员", pinyin: "zhè biān", hanzi: "有，杯子在这边。", reading: "Yǒu, bēizi zài zhèbiān.", en: "Yes, the cups are over here.", th: "มีค่ะ แก้วอยู่ทางนี้", visual: { zh: "这边", th: "ทางนี้", focus: "18% center" }, sourceRef: lesson10SourceRef("71", "87") },
      { role: "B", speaker: "王一雪", pinyin: "duō shǎo qián", hanzi: "多少钱一个？", reading: "Duōshao qián yí ge?", en: "How much is one?", th: "ใบละเท่าไหร่คะ?", visual: { zh: "多少钱", th: "ราคาเท่าไร", focus: "58% center" }, sourceRef: lesson10SourceRef("71", "87") },
      { role: "A", speaker: "售货员", pinyin: "wǔ kuài shí kuài", hanzi: "这些五块钱一个，那些十块钱一个。", reading: "Zhèxiē wǔ kuài qián yí ge, nàxiē shí kuài qián yí ge.", en: "These are five yuan each, and those are ten yuan each.", th: "พวกนี้ใบละห้าหยวน พวกนั้นใบละสิบหยวน", visual: { zh: "五块・十块", th: "5 และ 10 หยวน", focus: "78% center" }, sourceRef: lesson10SourceRef("71", "87") },
      { role: "B", speaker: "王一雪", pinyin: "zhè ge", hanzi: "我买这个吧。", reading: "Wǒ mǎi zhège ba.", en: "I'll take this one, please.", th: "ฉันซื้อใบนี้ค่ะ", visual: { zh: "这个", th: "ใบนี้", focus: "38% center" }, sourceRef: lesson10SourceRef("71", "87") },
    ],
    qte: {
      after: 4,
      prompt: { th: "เมื่อจบบทสนทนา หวังอี้เสวี่ย (B) เลือกซื้อแก้วใบไหน?", zh: "对话结束时，王一雪要买哪一个？", en: "At the end of the dialogue, which cup does Wang Yixue choose to buy?" },
      options: [
        { value: "这个", zh: "这个", pinyin: "zhè ge", th: "ใบนี้" },
        { value: "那些", zh: "那些", pinyin: "nà xiē", th: "พวกนั้น" },
        { value: "两斤苹果", zh: "两斤苹果", pinyin: "liǎng jīn píng guǒ", th: "แอปเปิลสองจิน" },
      ],
      correct: "这个",
      evidence: "王一雪：我买这个吧。",
      evidenceTh: "หวังอี้เสวี่ย: ฉันซื้อใบนี้ค่ะ",
      sourceRef: lesson10SourceRef("71", "87"),
    },
    builder: {
      prompt: { th: "เรียงประโยคที่หวังอี้เสวี่ยใช้ตัดสินใจซื้อแก้ว", zh: "重组王一雪决定购买的句子", en: "Rebuild Wang Yixue's sentence for deciding what to buy" },
      answer: ["我", "买", "这个", "吧"],
      tiles: ["这个", "吧", "我", "买"],
      gloss: { 我: "ฉัน", 买: "ซื้อ", 这个: "ใบนี้", 吧: "นะ / กันเถอะ" },
      translationTh: "ฉันซื้อใบนี้ค่ะ",
      translationEn: "I'll take this one, please.",
      evidence: "Text 1 · หน้าเล่ม 71",
      sourceRef: lesson10SourceRef("71", "87"),
    },
  },
  {
    id: "fruit",
    sourceRef: lesson10SourceRef("72-73", "88-89"),
    number: "02",
    glyph: "果",
    title: "在菜市场买水果",
    titleTh: "ซื้อผลไม้ในตลาด",
    place: "菜市场",
    placeTh: "ตลาดสด",
    image: group3AssetPath("/assets/group3/scene-fruit-market.webp"),
    imageSrcSet: `${group3AssetPath("/assets/group3/scene-fruit-market-720w.webp")} 720w, ${group3AssetPath("/assets/group3/scene-fruit-market.webp")} 1400w`,
    imageAlt: { th: "ผลไม้หลากชนิดจัดเรียงเต็มแผงในตลาดสด", zh: "菜市场摊位上整齐摆放的各种水果", en: "A market stall filled with neatly arranged fresh fruit" },
    source: "Text 2 · หน้าเล่ม 72–73 · PDF หน้า 88–89",
    sourcePage: "73",
    context: "在菜市场，王一雪在买水果。",
    contextTh: "ที่ตลาดสด หวังอี้เสวี่ยกำลังซื้อผลไม้",
    roles: { A: "售货员", B: "王一雪" },
    characters: [
      { role: "A", profile: "fruitVendor", noteTh: "พนักงานขายที่ถามความต้องการและคิดราคาแอปเปิล", noteZh: "询问需求并计算苹果价格的售货员" },
      { role: "B", profile: "wang", noteTh: "ลูกค้าที่ต้องการซื้อแอปเปิลสองจิน", noteZh: "想买两斤苹果的顾客" },
    ],
    lines: [
      { role: "B", speaker: "王一雪", pinyin: "shuǐ guǒ", hanzi: "这儿的水果真不少！", reading: "Zhèr de shuǐguǒ zhēn bù shǎo!", en: "There's so much fruit here!", th: "ผลไม้ที่นี่มีเยอะจริง ๆ!", visual: { zh: "水果", th: "ผลไม้", focus: "50% center" }, sourceRef: lesson10SourceRef("73", "89") },
      { role: "A", speaker: "售货员", pinyin: "mǎi shén me", hanzi: "您想买什么？", reading: "Nín xiǎng mǎi shénme?", en: "What would you like to buy?", th: "คุณต้องการซื้ออะไรครับ?", visual: { zh: "买什么", th: "ต้องการซื้ออะไร", focus: "32% center" }, sourceRef: lesson10SourceRef("73", "89") },
      { role: "B", speaker: "王一雪", pinyin: "liǎng jīn píng guǒ", hanzi: "我想买两斤苹果。", reading: "Wǒ xiǎng mǎi liǎng jīn píngguǒ.", en: "I'd like two jin of apples, please.", th: "ฉันอยากซื้อแอปเปิลสองจินค่ะ", visual: { zh: "两斤苹果", th: "แอปเปิล 2 จิน", focus: "68% center" }, sourceRef: lesson10SourceRef("73", "89") },
      { role: "A", speaker: "售货员", pinyin: "sān kuài wǔ yī jīn", hanzi: "苹果三块五一斤。这些七块二，七块钱吧。", reading: "Píngguǒ sān kuài wǔ yì jīn. Zhèxiē qī kuài èr, qī kuài qián ba.", en: "The apples are 3.5 yuan per jin. That's 7.2 yuan in total—let's round it down to 7 yuan.", th: "แอปเปิลจินละสามหยวนห้า พวกนี้รวมเจ็ดหยวนสอง คิดเจ็ดหยวนแล้วกัน", visual: { zh: "三块五一斤", th: "จินละ 3.5 หยวน", focus: "78% center" }, sourceRef: lesson10SourceRef("73", "89") },
      { role: "B", speaker: "王一雪", pinyin: "zhēn pián yi", hanzi: "好的，这儿的苹果真便宜！", reading: "Hǎo de, zhèr de píngguǒ zhēn piányi!", en: "Great! The apples here are really affordable!", th: "ตกลงค่ะ แอปเปิลที่นี่ถูกจริง ๆ!", visual: { zh: "真便宜", th: "ราคาถูกจริง ๆ", focus: "48% center" }, sourceRef: lesson10SourceRef("73", "89") },
    ],
    qte: {
      after: 2,
      prompt: { th: "หวังอี้เสวี่ย (B) ต้องการซื้ออะไรจากคนขาย (A)?", zh: "限时理解——王一雪想从售货员那里买什么？", en: "Quick Time — What does Wang Yixue want to buy from the vendor?" },
      options: [
        { value: "两斤苹果", zh: "两斤苹果", pinyin: "liǎng jīn píng guǒ", th: "แอปเปิลสองจิน" },
        { value: "一个杯子", zh: "一个杯子", pinyin: "yí gè bēi zi", th: "แก้วหนึ่งใบ" },
        { value: "一件衣服", zh: "一件衣服", pinyin: "yí jiàn yī fu", th: "เสื้อผ้าหนึ่งตัว" },
      ],
      correct: "两斤苹果",
      evidence: "王一雪：我想买两斤苹果。",
      evidenceTh: "หวังอี้เสวี่ย: ฉันอยากซื้อแอปเปิลสองจินค่ะ",
      sourceRef: lesson10SourceRef("73", "89"),
    },
    builder: {
      prompt: { th: "เรียงประโยคแสดงความต้องการซื้อของหวังอี้เสวี่ย", zh: "重组王一雪表达购买意愿的句子", en: "Rebuild Wang Yixue's sentence expressing what she wants to buy" },
      answer: ["我", "想", "买", "两斤", "苹果"],
      tiles: ["苹果", "想", "两斤", "我", "买"],
      gloss: { 我: "ฉัน", 想: "อยาก", 买: "ซื้อ", 两斤: "สองจิน", 苹果: "แอปเปิล" },
      translationTh: "ฉันอยากซื้อแอปเปิลสองจิน",
      translationEn: "I'd like two jin of apples, please.",
      evidence: "Text 2 · หน้าเล่ม 73",
      sourceRef: lesson10SourceRef("73", "89"),
    },
  },
  {
    id: "clothes",
    sourceRef: lesson10SourceRef("74-75", "90-91"),
    number: "03",
    glyph: "衣",
    title: "在商场买衣服",
    titleTh: "ซื้อเสื้อผ้าในห้าง",
    place: "商场",
    placePy: "shāngchǎng",
    placeTh: "ห้างสรรพสินค้า",
    image: group3AssetPath("/assets/group3/scene-clothes-shop.webp"),
    imageSrcSet: `${group3AssetPath("/assets/group3/scene-clothes-shop-720w.webp")} 720w, ${group3AssetPath("/assets/group3/scene-clothes-shop.webp")} 1400w`,
    imageAlt: { th: "ร้านเสื้อผ้าในห้างที่จัดเสื้อผ้าเด็กไว้เป็นหมวดหมู่", zh: "商场里陈列整齐的童装店", en: "A neatly arranged children's clothing shop in a mall" },
    source: "Text 3 · หน้าเล่ม 74–75 · PDF หน้า 90–91",
    sourcePage: "75",
    context: "在商场里，刘明和王一雪在给孩子买衣服。",
    contextTh: "ในห้าง หลิวหมิงและหวังอี้เสวี่ยกำลังซื้อเสื้อผ้าให้ลูก",
    roles: { A: "刘明", B: "王一雪" },
    characters: [
      { role: "A", profile: "liu", noteTh: "กำลังเลือกเสื้อผ้าให้ลูกกับหวังอี้เสวี่ย", noteZh: "和王一雪一起给孩子买衣服" },
      { role: "B", profile: "wang", noteTh: "กำลังเลือกเสื้อผ้าให้ลูกกับหลิวหมิง", noteZh: "和刘明一起给孩子买衣服" },
    ],
    lines: [
      { role: "B", speaker: "王一雪", pinyin: "yì bǎi yuán", hanzi: "这家商店衣服真多！这件一百元，怎么样？", reading: "Zhè jiā shāngdiàn yīfu zhēn duō! Zhè jiàn yìbǎi yuán, zěnmeyàng?", en: "There are so many clothes in this store! This one is 100 yuan. What do you think?", th: "ร้านนี้มีเสื้อผ้าเยอะจริง ๆ! ตัวนี้หนึ่งร้อยหยวน เป็นอย่างไรบ้าง?", visual: { zh: "一百元", th: "100 หยวน", focus: "38% center" }, sourceRef: lesson10SourceRef("75", "91") },
      { role: "A", speaker: "刘明", pinyin: "hǎo kàn bú guì", hanzi: "好看，也不贵。", reading: "Hǎokàn, yě bú guì.", en: "It looks great, and it's not expensive.", th: "สวย และไม่แพงด้วย", visual: { zh: "好看・不贵", th: "สวยและไม่แพง", focus: "52% center" }, sourceRef: lesson10SourceRef("75", "91") },
      { role: "B", speaker: "王一雪", pinyin: "mǎi yí jiàn", hanzi: "小雪能穿，买一件吧。", reading: "Xiǎoxuě néng chuān, mǎi yí jiàn ba.", en: "Xiaoxue can wear it. Let's get one.", th: "เสี่ยวเสวี่ยใส่ได้ ซื้อหนึ่งตัวกันเถอะ", visual: { zh: "买一件", th: "ซื้อหนึ่งตัว", focus: "66% center" }, sourceRef: lesson10SourceRef("75", "91") },
      { role: "A", speaker: "刘明", pinyin: "néng chuān ma", hanzi: "好的。小明能穿吗？", reading: "Hǎo de. Xiǎomíng néng chuān ma?", en: "Okay. Do you think Xiaoming can wear it too?", th: "ตกลง เสี่ยวหมิงใส่ได้ไหม?", visual: { zh: "能穿吗", th: "ใส่ได้ไหม", focus: "28% center" }, sourceRef: lesson10SourceRef("75", "91") },
      { role: "B", speaker: "王一雪", pinyin: "nǚ hái zi nán hái zi", hanzi: "不能。这些是女孩子穿的衣服，男孩子的衣服在那儿。", reading: "Bù néng. Zhèxiē shì nǚ háizi chuān de yīfu, nán háizi de yīfu zài nàr.", en: "No. These are girls' clothes. The boys' section is over there.", th: "ไม่ได้ พวกนี้เป็นเสื้อผ้าสำหรับเด็กผู้หญิง เสื้อผ้าเด็กผู้ชายอยู่ทางนั้น", visual: { zh: "女孩子・男孩子", th: "เด็กหญิง・เด็กชาย", focus: "82% center" }, sourceRef: lesson10SourceRef("75", "91") },
      { role: "A", speaker: "刘明", pinyin: "hǎo de", hanzi: "好的。", reading: "Hǎo de.", en: "Alright.", th: "ตกลง", visual: { zh: "好的", th: "ตกลง", focus: "45% center" }, sourceRef: lesson10SourceRef("75", "91") },
    ],
    qte: {
      after: 2,
      prompt: { th: "หวังอี้เสวี่ยต้องการซื้อเสื้อผ้ากี่ตัว?", zh: "王一雪想买几件衣服？", en: "How many pieces of clothing does Wang Yixue want to buy?" },
      options: [
        { value: "一件", zh: "一件", pinyin: "yí jiàn", th: "หนึ่งตัว" },
        { value: "两斤", zh: "两斤", pinyin: "liǎng jīn", th: "สองจิน" },
        { value: "一个", zh: "一个", pinyin: "yí gè", th: "หนึ่งชิ้น" },
      ],
      correct: "一件",
      evidence: "王一雪：小雪能穿，买一件吧。",
      evidenceTh: "หวังอี้เสวี่ย: เสี่ยวเสวี่ยใส่ได้ ซื้อหนึ่งตัวกันเถอะ",
      sourceRef: lesson10SourceRef("75", "91"),
    },
    builder: {
      prompt: { th: "เรียงประโยคที่บอกว่าเสื้อผ้านี้เป็นของใคร", zh: "重组说明衣服适合谁穿的句子", en: "Rebuild the sentence explaining who the clothes are for" },
      answer: ["这些", "是", "女孩子", "穿的", "衣服"],
      tiles: ["衣服", "女孩子", "这些", "穿的", "是"],
      gloss: { 这些: "สิ่งเหล่านี้", 是: "เป็น / คือ", 女孩子: "เด็กผู้หญิง", 穿的: "ที่สวมใส่", 衣服: "เสื้อผ้า" },
      translationTh: "สิ่งเหล่านี้เป็นเสื้อผ้าที่เด็กผู้หญิงใส่",
      translationEn: "These are girls' clothes.",
      evidence: "Text 3 · หน้าเล่ม 75",
      sourceRef: lesson10SourceRef("75", "91"),
    },
  },
];

export const LESSON_10 = {
  id: "hsk1-l10",
  slug: "lesson-10",
  level: "hsk1",
  number: 10,
  featured: false,
  source: SOURCE,
  sourceRef: SOURCE.sourceRef,
  title: {
    zh: "这儿的苹果真便宜！",
    pinyin: "Zhèr de píngguǒ zhēn piányi!",
    en: "The apples here are really cheap!",
    thAid: "แอปเปิลที่นี่ถูกจริง ๆ!",
  },
  summary: {
    zh: "跟随王一雪走进小店、菜市场和商场，练习购物与询价。",
    en: "Follow Wang Yixue through a small shop, market, and mall to practise shopping and asking prices.",
    thAid: "ติดตามหวังอี้เสวี่ยไปยังร้านเล็ก ตลาดสด และห้าง เพื่อฝึกซื้อของและถามราคา",
  },
  translationPolicy: { kind: "editorial-aid", labelTh: "คำแปลไทยเพื่อช่วยเรียน เรียบเรียงจากต้นฉบับ" },
  objectives: LESSON_OBJECTIVES.map((item) => ({ ...item, thAid: item.th })),
  contents: LESSON_CONTENTS,
  vocabulary: LESSON_VOCABULARY.map((item) => ({ ...item, thAid: item.th })),
  grammarFocus: [
    {
      title: "钱数的表达",
      titleEn: "Expression of Amount of Money",
      explanationZh: "人民币的单位由大到小是“元、角、分”，口语中也分别说“块、毛、分”，表达顺序是元/块→角/毛→分。",
      explanationEn: "The units of Renminbi, from largest to smallest, are 元, 角 and 分; in speech, 元 and 角 are also called 块 and 毛. Amounts are stated from the largest unit to the smallest.",
      thAid: "หน่วยเงินจีนเรียงจากใหญ่ไปเล็กเป็น 元/块 → 角/毛 → 分 เช่น 三块二 (3.2 หยวน)",
      examples: ["两分", "三块二", "六块零两分"],
      sourceRef: lesson10SourceRef("72", "88"),
    },
    {
      title: "形容词谓语句",
      titleEn: "Adjectival-Predicate Sentences",
      explanationZh: "形容词可以直接作谓语，前面可以使用程度副词或否定副词。例如：这儿的水果真不少！",
      explanationEn: "An adjective can function directly as the predicate, optionally preceded by an adverb of degree or negation. For example: 这儿的水果真不少！",
      thAid: "คำคุณศัพท์เป็นภาคแสดงได้โดยตรง และอาจมีคำบอกระดับหรือปฏิเสธอยู่หน้า เช่น 真不少 หรือ 不大",
      examples: ["这儿的水果真不少！", "我的房间不大。", "那个苹果好吃。"],
      sourceRef: lesson10SourceRef("74", "90"),
    },
    {
      title: "疑问代词“怎么样”",
      titleEn: "The Interrogative Pronoun 怎么样",
      explanationZh: "疑问代词“怎么样”用于征求意见、询问状况等，基本结构是“……怎么样？”。",
      explanationEn: "The interrogative pronoun 怎么样 is used to ask for an opinion or inquire about a situation. Its basic structure is “……怎么样？”.",
      thAid: "怎么样 ใช้ขอความคิดเห็นหรือถามสภาพการณ์ โดยใช้รูป …怎么样？ เช่น 这个杯子怎么样？",
      examples: ["这个杯子怎么样？", "这本书怎么样？", "这个菜怎么样？"],
      sourceRef: lesson10SourceRef("76", "92"),
    },
  ],
  characters: CHARACTER_PROFILES,
  scenes: STORY_SCENES,
};
