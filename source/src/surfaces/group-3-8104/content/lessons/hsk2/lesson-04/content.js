import { group3AssetPath } from "../../../../config.js";

const SOURCE_FILE = "docs/references/hsk/sources/hsk2.pdf";

export function lessonHsk2L4SourceRef(printedPages, pdfPages) {
  return `${SOURCE_FILE}#printed-pages=${printedPages}&pdf-pages=${pdfPages}`;
}

const sourceRef = lessonHsk2L4SourceRef("29-36", "43-50");

const characters = {
  wang: {
    hanzi: "王一雪",
    pinyin: "Wáng Yīxuě",
    nameTh: "หวังอี้เสวี่ย",
    nameEn: "Wang Yixue",
    image: group3AssetPath("/assets/group3/shared/characters/character-wang-yixue.webp"),
  },
  liuXiaoxue: {
    hanzi: "刘小雪",
    pinyin: "Liú Xiǎoxuě",
    nameTh: "หลิวเสี่ยวเสวี่ย",
    nameEn: "Liu Xiaoxue",
    image: group3AssetPath("/assets/group3/lesson-hsk2-l4-mall-v1.webp"),
    imageSrcSet: `${group3AssetPath("/assets/group3/lesson-hsk2-l4-mall-720w-v1.webp")} 720w, ${group3AssetPath("/assets/group3/lesson-hsk2-l4-mall-v1.webp")} 1400w`,
    imageFocus: "30% center",
  },
};

const vocabularyPages = [
  [1, "过", "guo", "part.", "after a verb: past action or state", "เคย (ใช้หลังกริยาแสดงอดีต)", 30, 44],
  [2, "商场", "shāngchǎng", "n.", "department store; mall", "ห้างสรรพสินค้า", 30, 44],
  [3, "进去", "jìnqù", "v.", "go in; get in", "เข้าไป", 30, 44],
  [4, "条", "tiáo", "m.", "for long, narrow, or thin things", "เส้น / ตัว (ลักษณนามของยาว)", 30, 44],
  [5, "裤子", "kùzi", "n.", "trousers; pants", "กางเกง", 30, 44],
  [6, "白色", "báisè", "n.", "white", "สีขาว", 32, 46],
  [7, "因为", "yīnwèi", "conj.", "because", "เพราะ / เพราะว่า", 32, 46],
  [8, "试", "shì", "v.", "try", "ลอง / ลองใส่", 32, 46],
  [9, "红色", "hóngsè", "n.", "red", "สีแดง", 32, 46],
  [10, "所以", "suǒyǐ", "conj.", "so; therefore", "ดังนั้น / เพราะฉะนั้น", 32, 46],
  [11, "好看", "hǎokàn", "adj.", "good-looking; pretty", "สวย / ดูดี", 32, 46],
  [12, "为什么", "wèishénme", "pron.", "why", "ทำไม", 32, 46],
  [13, "觉得", "juéde", "v.", "feel; think", "รู้สึกว่า / คิดว่า", 32, 46],
  [14, "穿", "chuān", "v.", "wear; put on", "สวม / ใส่", 32, 46],
  [15, "书包", "shūbāo", "n.", "schoolbag", "กระเป๋านักเรียน", 34, 48],
  [16, "过去", "guòqù", "v.", "pass (by); go over", "เดินข้ามไป / ไปทางนั้น", 34, 48],
  [17, "绿色", "lǜsè", "n.", "green", "สีเขียว", 34, 48],
  [18, "黑色", "hēisè", "n.", "black", "สีดำ", 34, 48],
  [19, "更", "gèng", "adv.", "more; still/even more", "ยิ่งกว่า / มากกว่า", 34, 48],
  [20, "颜色", "yánsè", "n.", "color", "สี", 35, 49],
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
  sourceRef: lessonHsk2L4SourceRef(String(page), String(pdfPage)),
}));

function line(source, value) {
  return { ...value, sourceRef: source };
}

const mallRef = lessonHsk2L4SourceRef("30", "44");
const pantsRef = lessonHsk2L4SourceRef("32", "46");
const schoolbagRef = lessonHsk2L4SourceRef("33", "47");

const scenes = [
  {
    id: "l4-mall",
    number: "01",
    glyph: "裤",
    title: "在商场门口",
    titleTh: "ที่หน้าร้านค้าในห้าง",
    titleEn: "At the entrance of the mall",
    place: "商场门口",
    placeTh: "หน้าร้านค้าในห้าง",
    image: group3AssetPath("/assets/group3/lesson-hsk2-l4-mall-v1.webp"),
    imageSrcSet: `${group3AssetPath("/assets/group3/lesson-hsk2-l4-mall-720w-v1.webp")} 720w, ${group3AssetPath("/assets/group3/lesson-hsk2-l4-mall-v1.webp")} 1400w`,
    imageAlt: {
      th: "แม่และลูกสาวที่หน้าร้าน",
      zh: "商场购物照片",
      en: "Mall entrance scene",
    },
    source: "Text 1 · หน้าเล่ม 30 · PDF หน้า 44",
    sourcePage: "30",
    sourceRef: mallRef,
    context: "在商场门口，王一雪和刘小雪在聊天儿。",
    contextTh: "ที่หน้าร้านในห้าง หวังอี้เสวี่ยและหลิวเสี่ยวเสวี่ยกำลังคุยกัน",
    contextEn: "At the entrance of the mall, Wang Yixue and Liu Xiaoxue were chatting.",
    characters: [
      { role: "A", profile: "wang", noteTh: "แม่ที่พาลูกมาเดินห้างและรับปากช่วยซื้อ", noteZh: "带女儿逛商场并答应帮忙的妈妈", noteEn: "The mother shopping with her daughter" },
      { role: "B", profile: "liuXiaoxue", noteTh: "ลูกสาวที่อยากซื้อกางเกงตัวใหม่", noteZh: "想买新裤子的女儿", noteEn: "The daughter who wants a new pair of pants" },
    ],
    lines: [
      line(mallRef, { role: "B", speaker: "刘小雪", pinyin: "wǒmen láiguò zhè jiā shāngchǎng ma", hanzi: "妈妈，我们来过这家商场吗？", reading: "Māma, wǒmen láiguò zhè jiā shāngchǎng ma?", en: "Mom, have we been to this mall before?", th: "แม่ เรามาเคยห้างนี้ไหม?", visual: { zh: "来过…吗", th: "เคยมา…ไหม", focus: "30% center" } }),
      line(mallRef, { role: "A", speaker: "王一雪", pinyin: "méi láiguò, zhè shì xīn kāi de", hanzi: "没来过，这是新开的。", reading: "Méi láiguò, zhè shì xīn kāi de.", en: "No, it just opened recently.", th: "ยังไม่เคยมา ห้างนี้เพิ่งเปิดใหม่", visual: { zh: "新开的", th: "เพิ่งเปิดใหม่", focus: "64% center" } }),
      line(mallRef, { role: "B", speaker: "刘小雪", pinyin: "wǒmen jìnqù kànkan ba", hanzi: "我们进去看看吧。", reading: "Wǒmen jìnqù kànkan ba.", en: "Let’s go inside and have a look.", th: "เราเข้าไปดูกันเถอะ", visual: { zh: "进去看看", th: "เข้าไปดู", focus: "38% center" } }),
      line(mallRef, { role: "A", speaker: "王一雪", pinyin: "nǐ xiǎng mǎi diǎnr shénme", hanzi: "好啊！你想买点儿什么？", reading: "Hǎo a! Nǐ xiǎng mǎi diǎnr shénme?", en: "Sure! What do you want to buy?", th: "ได้สิ! หนูอยากซื้ออะไร?", visual: { zh: "想买什么", th: "อยากซื้ออะไร", focus: "56% center" } }),
      line(mallRef, { role: "B", speaker: "刘小雪", pinyin: "wǒ xiǎng mǎi tiáo kùzi", hanzi: "我想买条裤子。", reading: "Wǒ xiǎng mǎi tiáo kùzi.", en: "I want to buy a pair of pants.", th: "หนูอยากซื้อกางเกงหนึ่งตัว", visual: { zh: "一条裤子", th: "กางเกงหนึ่งตัว", focus: "42% center" } }),
      line(mallRef, { role: "A", speaker: "王一雪", pinyin: "méi wèntí", hanzi: "没问题。", reading: "Méi wèntí.", en: "No problem.", th: "ไม่มีปัญหา", visual: { zh: "没问题", th: "ไม่มีปัญหา", focus: "60% center" } }),
    ],
    qte: {
      after: 4,
      prompt: { th: "หลิวเสี่ยวเสวี่ยอยากซื้ออะไร?", zh: "刘小雪想买什么？", en: "What does Liu Xiaoxue want to buy?" },
      options: [
        { value: "一条裤子", zh: "一条裤子", pinyin: "yì tiáo kùzi", th: "กางเกงหนึ่งตัว" },
        { value: "一个新书包", zh: "一个新书包", pinyin: "yí ge xīn shūbāo", th: "กระเป๋านักเรียนใหม่หนึ่งใบ" },
        { value: "一件衣服", zh: "一件衣服", pinyin: "yí jiàn yīfu", th: "เสื้อผ้าหนึ่งตัว" },
      ],
      correct: "一条裤子",
      evidence: "刘小雪：我想买条裤子。",
      evidenceTh: "หลิวเสี่ยวเสวี่ย: หนูอยากซื้อกางเกงหนึ่งตัว",
      sourceRef: mallRef,
    },
    builder: {
      prompt: { th: "เรียงประโยคชวนเข้าไปดูของหลิวเสี่ยวเสวี่ย", zh: "重组刘小雪提议进去看看的句子", en: "Rebuild Liu Xiaoxue’s suggestion" },
      answer: ["我们", "进去", "看看", "吧"],
      tiles: ["吧", "我们", "看看", "进去"],
      gloss: { 我们: "พวกเรา", 进去: "เข้าไป", 看看: "ดู ๆ", 吧: "เถอะ" },
      translationTh: "เราเข้าไปดูกันเถอะ",
      translationEn: "Let’s go inside and have a look.",
      evidence: "Text 1 · หน้าเล่ม 30",
      sourceRef: mallRef,
    },
  },
  {
    id: "l4-pants",
    number: "02",
    glyph: "红",
    title: "在商场看衣服",
    titleTh: "เลือกเสื้อผ้าในห้าง",
    titleEn: "Shopping for clothes in the mall",
    place: "商场",
    placePy: "shāngchǎng",
    placeTh: "ในห้างสรรพสินค้า",
    image: group3AssetPath("/assets/group3/lesson-hsk2-l4-pants-v1.webp"),
    imageSrcSet: `${group3AssetPath("/assets/group3/lesson-hsk2-l4-pants-720w-v1.webp")} 720w, ${group3AssetPath("/assets/group3/lesson-hsk2-l4-pants-v1.webp")} 1400w`,
    imageAlt: {
      th: "การเลือกเสื้อผ้าในห้าง",
      zh: "商场试衣照片",
      en: "Clothes shopping scene",
    },
    source: "Text 2 · หน้าเล่ม 32 · PDF หน้า 46",
    sourcePage: "32",
    sourceRef: pantsRef,
    context: "在商场，王一雪和刘小雪在看衣服。",
    contextTh: "ในห้าง หวังอี้เสวี่ยและหลิวเสี่ยวเสวี่ยกำลังดูเสื้อผ้า",
    contextEn: "In the mall, Wang Yixue and Liu Xiaoxue were shopping for clothes.",
    characters: [
      { role: "A", profile: "wang", noteTh: "แม่ที่แนะนำให้ลูกลองกางเกงสีแดง", noteZh: "建议女儿试红色裤子的妈妈", noteEn: "The mother suggesting the red pants" },
      { role: "B", profile: "liuXiaoxue", noteTh: "ลูกสาวที่ชอบสีขาวแต่ไม่เคยใส่สีแดง", noteZh: "喜欢白色却没穿过红色的女儿", noteEn: "The daughter who loves white but never wore red" },
    ],
    lines: [
      line(pantsRef, { role: "B", speaker: "刘小雪", pinyin: "wǒ xiǎng mǎi zhè tiáo báisè de kùzi", hanzi: "妈妈，我想买这条白色的裤子。", reading: "Māma, wǒ xiǎng mǎi zhè tiáo báisè de kùzi.", en: "Mom, I want to buy this pair of white pants.", th: "แม่ หนูอยากซื้อกางเกงขาวตัวนี้", visual: { zh: "白色的裤子", th: "กางเกงสีขาว", focus: "30% center" } }),
      line(pantsRef, { role: "A", speaker: "王一雪", pinyin: "nǐ yǒu hěn duō báisè de yīfu", hanzi: "你有很多白色的衣服，为什么还买白色的？", reading: "Nǐ yǒu hěn duō báisè de yīfu, wèishénme hái mǎi báisè de?", en: "You already have lots of white clothes. Why buy white again?", th: "หนูมีเสื้อผ้าสีขาวเยอะแล้ว ทำไมยังจะซื้อสีขาวอีก?", visual: { zh: "为什么还买", th: "ทำไมยังซื้ออีก", focus: "58% center" } }),
      line(pantsRef, { role: "B", speaker: "刘小雪", pinyin: "yīnwèi wǒ xǐhuan báisè a", hanzi: "因为我喜欢白色啊！", reading: "Yīnwèi wǒ xǐhuan báisè a!", en: "Because I like white!", th: "เพราะหนูชอบสีขาวไง!", visual: { zh: "因为…所以", th: "เพราะว่า…", focus: "36% center" } }),
      line(pantsRef, { role: "A", speaker: "王一雪", pinyin: "nǐ shìshi nà tiáo hóngsè de ba", hanzi: "我觉得这条白色的不太好看，你试试那条红色的吧。", reading: "Wǒ juéde zhè tiáo báisè de bú tài hǎokàn, nǐ shìshi nà tiáo hóngsè de ba.", en: "I don’t think this white one looks good. Why don’t you try that red one?", th: "แม่ว่ากางเกงขาวตัวนี้ไม่ค่อยสวย หนูลองตัวสีแดงนั้นดูสิ", visual: { zh: "试试红色的", th: "ลองสีแดง", focus: "62% center" } }),
      line(pantsRef, { role: "B", speaker: "刘小雪", pinyin: "wǒ méi chuānguò hóngsè de", hanzi: "我没穿过红色的，红色的好看吗？", reading: "Wǒ méi chuānguò hóngsè de, hóngsè de hǎokàn ma?", en: "I’ve never worn red before. Do you think red looks good on me?", th: "หนูไม่เคยใส่สีแดง สีแดงสวยไหม?", visual: { zh: "没穿过", th: "ไม่เคยใส่", focus: "40% center" } }),
      line(pantsRef, { role: "A", speaker: "王一雪", pinyin: "suǒyǐ yào shìshi a", hanzi: "就是因为没穿过，所以要试试啊！", reading: "Jiù shì yīnwèi méi chuānguò, suǒyǐ yào shìshi a!", en: "That’s exactly why you should give it a try!", th: "ก็เพราะไม่เคยใส่ไง ถึงต้องลองดูสิ!", visual: { zh: "所以要试试", th: "จึงต้องลอง", focus: "56% center" } }),
    ],
    qte: {
      after: 4,
      prompt: { th: "หลิวเสี่ยวเสวี่ยเคยใส่สีแดงมาก่อนไหม?", zh: "刘小雪以前穿过红色的吗？", en: "Has Liu Xiaoxue ever worn red before?" },
      options: [
        { value: "穿过", zh: "穿过", pinyin: "chuānguò", th: "เคยใส่" },
        { value: "没穿过", zh: "没穿过", pinyin: "méi chuānguò", th: "ไม่เคยใส่" },
        { value: "不知道", zh: "不知道", pinyin: "bù zhīdào", th: "ไม่รู้" },
      ],
      correct: "没穿过",
      evidence: "刘小雪：我没穿过红色的。",
      evidenceTh: "หลิวเสี่ยวเสวี่ย: หนูไม่เคยใส่สีแดง",
      sourceRef: pantsRef,
    },
    builder: {
      prompt: { th: "เรียงประโยคบอกประสบการณ์ของหลิวเสี่ยวเสวี่ย", zh: "重组刘小雪说明没穿过的句子", en: "Rebuild Liu Xiaoxue’s experience sentence" },
      answer: ["我", "没", "穿过", "红色", "的"],
      tiles: ["的", "红色", "没", "穿过", "我"],
      gloss: { 我: "ฉัน", 没: "ไม่", 穿过: "เคยใส่", 红色: "สีแดง", 的: "(ตัวชี้) อย่าง" },
      translationTh: "ฉันไม่เคยใส่สีแดง",
      translationEn: "I’ve never worn red before.",
      evidence: "Text 2 · หน้าเล่ม 32",
      sourceRef: pantsRef,
    },
  },
  {
    id: "l4-schoolbag",
    number: "03",
    glyph: "包",
    title: "买新书包",
    titleTh: "ซื้อกระเป๋านักเรียนใหม่",
    titleEn: "Buying a new schoolbag",
    place: "商场",
    placePy: "shāngchǎng",
    placeTh: "ในห้างสรรพสินค้า",
    image: group3AssetPath("/assets/group3/lesson-hsk2-l4-schoolbag-v1.webp"),
    imageSrcSet: `${group3AssetPath("/assets/group3/lesson-hsk2-l4-schoolbag-720w-v1.webp")} 720w, ${group3AssetPath("/assets/group3/lesson-hsk2-l4-schoolbag-v1.webp")} 1400w`,
    imageAlt: {
      th: "ร้านขายกระเป๋านักเรียน",
      zh: "书包照片",
      en: "Schoolbag shopping scene",
    },
    source: "Text 3 · หน้าเล่ม 33 · PDF หน้า 47",
    sourcePage: "33",
    sourceRef: schoolbagRef,
    context: "在商场，王一雪和刘小雪在看书包。",
    contextTh: "ในห้าง หวังอี้เสวี่ยและหลิวเสี่ยวเสวี่ยกำลังดูกระเป๋านักเรียน",
    contextEn: "In the mall, Wang Yixue and Liu Xiaoxue were shopping for schoolbags.",
    characters: [
      { role: "A", profile: "wang", noteTh: "แม่ที่ให้ลูกเลือกสีของกระเป๋านักเรียน", noteZh: "让女儿挑选书包颜色的妈妈", noteEn: "The mother letting her daughter pick a colour" },
      { role: "B", profile: "liuXiaoxue", noteTh: "ลูกสาวที่เลือกกระเป๋าสีเขียว", noteZh: "选择绿色书包的女儿", noteEn: "The daughter choosing the green bag" },
    ],
    lines: [
      line(schoolbagRef, { role: "B", speaker: "刘小雪", pinyin: "wǒ xiǎng mǎi ge xīn shūbāo", hanzi: "妈妈，我想买个新书包。", reading: "Māma, wǒ xiǎng mǎi ge xīn shūbāo.", en: "Mom, I want to buy a new schoolbag.", th: "แม่ หนูอยากซื้อกระเป๋านักเรียนใหม่", visual: { zh: "新书包", th: "กระเป๋าใหม่", focus: "32% center" } }),
      line(schoolbagRef, { role: "A", speaker: "王一雪", pinyin: "nàbiān mài shūbāo, wǒmen guòqù kànkan ba", hanzi: "好，那边卖书包，我们过去看看吧。", reading: "Hǎo, nàbiān mài shūbāo, wǒmen guòqù kànkan ba.", en: "Okay, they sell schoolbags over there. Let’s go and take a look.", th: "ได้ ทางนั้นขายกระเป๋านักเรียน เราไปดูกัน", visual: { zh: "过去看看", th: "ไปดูกัน", focus: "60% center" } }),
      line(schoolbagRef, { role: "B", speaker: "刘小雪", pinyin: "zhème duō piàoliang de shūbāo", hanzi: "这么多漂亮的书包！", reading: "Zhème duō piàoliang de shūbāo!", en: "There are so many beautiful ones!", th: "กระเป๋านักเรียนสวย ๆ เยอะมาก!", visual: { zh: "这么多", th: "เยอะขนาดนี้", focus: "38% center" } }),
      line(schoolbagRef, { role: "A", speaker: "王一雪", pinyin: "hóngsè de, lǜsè de, hēisè de, nǐ xiǎng mǎi nǎge", hanzi: "红色的、绿色的、黑色的，你想买哪个？", reading: "Hóngsè de, lǜsè de, hēisè de, nǐ xiǎng mǎi nǎge?", en: "Red, green, or black — which one do you like?", th: "สีแดง สีเขียว สีดำ หนูอยากซื้อใบไหน?", visual: { zh: "的·的·的", th: "สี…สี…สี…", focus: "52% center" } }),
      line(schoolbagRef, { role: "B", speaker: "刘小雪", pinyin: "lǜsè de ba", hanzi: "绿色的吧。", reading: "Lǜsè de ba.", en: "The green one.", th: "สีเขียวค่ะ", visual: { zh: "绿色的", th: "สีเขียว", focus: "36% center" } }),
      line(schoolbagRef, { role: "A", speaker: "王一雪", pinyin: "wǒ yě juéde lǜsè de gèng hǎokàn", hanzi: "不错，我也觉得绿色的更好看。", reading: "Búcuò, wǒ yě juéde lǜsè de gèng hǎokàn.", en: "Not bad. I think the green one looks better too.", th: "ดี ฉันก็ว่าสีเขียวสวยกว่า", visual: { zh: "更好看", th: "สวยกว่า", focus: "58% center" } }),
    ],
    qte: {
      after: 3,
      prompt: { th: "หลิวเสี่ยวเสวี่ยเลือกกระเป๋าสีอะไร?", zh: "刘小雪想买哪个书包？", en: "Which schoolbag does Liu Xiaoxue want?" },
      options: [
        { value: "红色的", zh: "红色的", pinyin: "hóngsè de", th: "สีแดง" },
        { value: "绿色的", zh: "绿色的", pinyin: "lǜsè de", th: "สีเขียว" },
        { value: "黑色的", zh: "黑色的", pinyin: "hēisè de", th: "สีดำ" },
      ],
      correct: "绿色的",
      evidence: "刘小雪：绿色的吧。",
      evidenceTh: "หลิวเสี่ยวเสวี่ย: สีเขียว",
      sourceRef: schoolbagRef,
    },
    builder: {
      prompt: { th: "เรียงประโยคที่แม่เห็นด้วยกับลูก", zh: "重组王一雪表示同意的句子", en: "Rebuild Wang Yixue’s agreement sentence" },
      answer: ["我", "也", "觉得", "绿色", "的", "更好看"],
      tiles: ["更好看", "绿色", "的", "觉得", "我", "也"],
      gloss: { 我: "ฉัน", 也: "ก็ด้วย", 觉得: "คิดว่า", 绿色: "สีเขียว", 的: "(ตัวชี้)", 更好看: "สวยกว่า" },
      translationTh: "ฉันก็ว่าสีเขียวสวยกว่า",
      translationEn: "I think the green one looks better too.",
      evidence: "Text 3 · หน้าเล่ม 33",
      sourceRef: schoolbagRef,
    },
  },
];

export const LESSON_HSK2_L4 = {
  id: "hsk2-l4",
  slug: "lesson-4",
  level: "hsk2",
  number: 4,
  featured: false,
  source: {
    title: "新HSK教程 2 · New HSK Course 2",
    lesson: "Lesson 4 · 你穿红色的很好看",
    printedPages: "29–36",
    pdfPages: "43–50",
    file: "hsk2.pdf",
    sourceRef,
  },
  sourceRef,
  title: {
    zh: "你穿红色的很好看",
    pinyin: "Nǐ chuān hóngsè de hěn hǎokàn",
    en: "You look pretty good in red",
    thAid: "คุณใส่สีแดงแล้วสวยมาก",
  },
  summary: {
    zh: "跟随王一雪和刘小雪逛商场，用“过”谈经历，用“因为…所以”讲原因。",
    en: "Follow Wang Yixue and Liu Xiaoxue around the mall, using 过 for experiences and 因为…所以 for reasons.",
    thAid: "เดินห้างกับหวังอี้เสวี่ยและหลิวเสี่ยวเสวี่ย ฝึกใช้ 过 เล่าประสบการณ์ และ 因为…所以 บอกเหตุผล",
  },
  translationPolicy: { kind: "editorial-aid", labelTh: "คำแปลไทยเพื่อช่วยเรียน เรียบเรียงจากต้นฉบับ" },
  objectives: [
    { zh: "能听懂并询问过去的经历。", en: "Be able to understand and ask about past experiences.", thAid: "ฟังและถามเกี่ยวกับประสบการณ์ในอดีต", sourceRef: lessonHsk2L4SourceRef("29", "43") },
    { zh: "能听懂并使用描述的方式指称事物。", en: "Be able to understand and refer to things through description.", thAid: "เข้าใจและเรียกสิ่งของโดยใช้คำอธิบาย (ของ+…)", sourceRef: lessonHsk2L4SourceRef("29", "43") },
    { zh: "掌握因果复句“因为…所以…”的用法。", en: "Master the causal complex sentence “因为…所以…” to express causes and results.", thAid: "เข้าใจประโยคเหตุผล 因为…所以…", sourceRef: lessonHsk2L4SourceRef("29", "43") },
  ],
  contents: [
    { number: "00", title: "目标与热身", titleTh: "เป้าหมายและการเตรียมบท", detail: "Objectives · Warm-Up", pages: "29", route: "/home/hsk2/lesson-4/preface/", sourceRef: lessonHsk2L4SourceRef("29", "43") },
    { number: "01", title: "在商场门口", titleTh: "ที่หน้าร้านค้าในห้าง", detail: "Text 1 · New Words 1–5", pages: "30–31", scene: 1, sourceRef: lessonHsk2L4SourceRef("30-31", "44-45") },
    { number: "02", title: "在商场看衣服", titleTh: "เลือกเสื้อผ้าในห้าง", detail: "Text 2 · New Words 6–14", pages: "32–33", scene: 2, sourceRef: lessonHsk2L4SourceRef("32-33", "46-47") },
    { number: "03", title: "买新书包", titleTh: "ซื้อกระเป๋านักเรียนใหม่", detail: "Text 3 · New Words 15–19", pages: "33–34", scene: 3, sourceRef: lessonHsk2L4SourceRef("33-34", "47-48") },
    { number: "04", title: "综合练习与活动", titleTh: "แบบฝึกรวมและกิจกรรม", detail: "Text 4 · Exercises · Activity (source trail)", pages: "35–36", sourceRef: lessonHsk2L4SourceRef("35-36", "49-50") },
  ],
  vocabulary,
  grammarFocus: [
    { title: "动态助词“过”", titleEn: "Aspect Particle “过”", explanationZh: "动态助词“过”用在动词后面，表示动作曾在过去发生，但未持续到现在。否定形式是在动词前面加“没（有）”。", explanationEn: "The aspect particle “过” is used after a verb to indicate an action that occurred in the past but has not continued to the present. The negative is formed with “没（有）” before the verb.", thAid: "คำช่วย 过 ใช้หลังกริยา หมายถึงเคยทำในอดีตแต่ไม่ต่อเนื่องถึงปัจจุบัน; ปฏิเสธโดยเติม 没(有) หน้าคำกริยา", examples: ["她去过中国。", "我吃过饺子，很好吃。", "她没去过中国。"], sourceRef: lessonHsk2L4SourceRef("31", "45") },
    { title: "因果复句“因为…所以…”", titleEn: "Causal Complex Sentence “因为…所以…”", explanationZh: "“因为…所以…”连接两个分句，表示因果关系。两个连词可以一起用，也可以只用其中一个。", explanationEn: "The “因为…所以…” pattern links a cause clause and a result clause; either conjunction may appear alone.", thAid: "เชื่อมสองประโยคเหตุ-ผล; ใช้ 因为…所以… คู่กัน หรือใช้ตัวใดตัวหนึ่งก็ได้", examples: ["就是因为没穿过，所以要试试啊！", "因为我生病了，今天没去上班。", "我没去过他家，所以让他来车站接我。"], sourceRef: lessonHsk2L4SourceRef("32", "46") },
    { title: "“的”字短语", titleEn: "The “的” Phrase", explanationZh: "结构助词“的”用在名词、代词、动词、形容词等后面，组成“的”字短语，相当于名词性短语。", explanationEn: "The structural particle “的” is used after nouns, pronouns, verbs, and adjectives to form a nominal “的” phrase.", thAid: "คำ 的 หลังคำนาม/สรรพนาม/กริยา/คุณศัพท์ ทำให้เป็นวลีแบบนาม (เช่น สีแดง ๆ นั้น)", examples: ["红色的、绿色的、黑色的，你想买哪个？", "这个面包是爸爸买的，妈妈买的在那儿。", "这件衣服太贵了，还是买那件便宜的吧。"], sourceRef: lessonHsk2L4SourceRef("34", "48") },
  ],
  characters,
  scenes,
};
