import { group3AssetPath } from "../../../../config.js";

const SOURCE_FILE = "docs/references/hsk/sources/hsk1-2.pdf";

export function lessonHsk1L11SourceRef(printedPages, pdfPages) {
  return `${SOURCE_FILE}#printed-pages=${printedPages}&pdf-pages=${pdfPages}`;
}

const sourceRef = lessonHsk1L11SourceRef("78-85", "94-101");

const characters = {
  yifei: {
    hanzi: "王一飞",
    pinyin: "Wáng Yīfēi",
    nameTh: "หวังอี้เฟย",
    nameEn: "Wang Yifei",
    image: group3AssetPath("/assets/group3/lesson-hsk1-l11-taxi-v1.webp"),
    imageSrcSet: `${group3AssetPath("/assets/group3/lesson-hsk1-l11-taxi-720w-v1.webp")} 720w, ${group3AssetPath("/assets/group3/lesson-hsk1-l11-taxi-v1.webp")} 1400w`,
    imageFocus: "50% center",
  },
  liWen: {
    hanzi: "李文",
    pinyin: "Lǐ Wén",
    nameTh: "หลี่เหวิน",
    nameEn: "Li Wen",
    image: group3AssetPath("/assets/group3/lesson-hsk1-l11-taxi-v1.webp"),
    imageSrcSet: `${group3AssetPath("/assets/group3/lesson-hsk1-l11-taxi-720w-v1.webp")} 720w, ${group3AssetPath("/assets/group3/lesson-hsk1-l11-taxi-v1.webp")} 1400w`,
    imageFocus: "74% center",
  },
  liu: {
    hanzi: "刘明",
    pinyin: "Liú Míng",
    nameTh: "หลิวหมิง",
    nameEn: "Liu Ming",
    image: group3AssetPath("/assets/group3/shared/characters/character-liu-ming.webp"),
    imageFocus: "50% center",
  },
  liuXiaoxue: {
    hanzi: "刘小雪",
    pinyin: "Liú Xiǎoxuě",
    nameTh: "หลิวเสี่ยวเสวี่ย",
    nameEn: "Liu Xiaoxue",
    image: group3AssetPath("/assets/group3/lesson-hsk1-l11-brother-v1.webp"),
    imageSrcSet: `${group3AssetPath("/assets/group3/lesson-hsk1-l11-brother-720w-v1.webp")} 720w, ${group3AssetPath("/assets/group3/lesson-hsk1-l11-brother-v1.webp")} 1400w`,
    imageFocus: "74% center",
  },
};

const vocabularyPages = [
  [1, "时候", "shíhou", "n.", "time; moment", "เวลา / ตอน", 79, 95],
  [2, "知道", "zhīdào", "v.", "know; realize", "รู้ / ทราบ", 79, 95],
  [3, "正在", "zhèngzài", "adv.", "in the process of", "กำลัง", 79, 95],
  [4, "找", "zhǎo", "v.", "look for", "หา / ค้นหา", 79, 95],
  [5, "开车", "kāichē", "v.", "drive (a vehicle)", "ขับรถ", 79, 95],
  [6, "车", "chē", "n.", "vehicle; car", "รถ", 79, 95],
  [7, "在", "zài", "adv.", "in progress (在/正在+动词+呢)", "กำลัง (อยู่ระหว่าง)", 81, 97],
  [8, "读", "dú", "v.", "attend school; study", "เรียน / อ่าน", 81, 97],
  [9, "还", "hái", "adv.", "still; yet", "ยัง", 81, 97],
  [10, "大学", "dàxué", "n.", "university; college", "มหาวิทยาลัย", 81, 97],
  [11, "大学生", "dàxuéshēng", "n.", "college/university student", "นักศึกษา", 81, 97],
  [12, "学", "xué", "v.", "study; learn", "เรียน / ศึกษา", 81, 97],
  [13, "医", "yī", "n.", "medicine", "การแพทย์", 81, 97],
  [14, "弟弟", "dìdi", "n.", "younger brother", "น้องชาย", 83, 99],
  [15, "起床", "qǐchuáng", "v.", "get up; get out of bed", "ตื่นนอน / ลุกจากเตียง", 83, 99],
  [16, "睡觉", "shuìjiào", "v.", "sleep", "นอนหลับ", 83, 99],
  [17, "睡", "shuì", "v.", "sleep", "นอน", 83, 99],
  [18, "那里", "nàlǐ", "pron.", "there; that place", "ที่นั่น", 83, 99],
  [19, "哪里", "nǎlǐ", "pron.", "where", "ที่ไหน", 83, 99],
  [20, "昨天", "zuótiān", "n.", "yesterday", "เมื่อวาน", 83, 99],
  [21, "问", "wèn", "v.", "ask", "ถาม", 83, 99],
  [22, "对", "duì", "prep.", "to; towards", "ต่อ / แก่", 83, 99],
  [23, "说", "shuō", "v.", "speak; say", "พูด / บอก", 83, 99],
  [24, "要", "yào", "mod.", "want; wish", "อยาก / จะ", 83, 99],
  [25, "小朋友", "xiǎopéngyǒu", "n.", "child; kid", "เด็ก ๆ", 83, 99],
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
  sourceRef: lessonHsk1L11SourceRef(String(page), String(pdfPage)),
}));

function line(source, value) {
  return { ...value, sourceRef: source };
}

const taxiRef = lessonHsk1L11SourceRef("79", "95");
const restaurantRef = lessonHsk1L11SourceRef("81", "97");
const brotherRef = lessonHsk1L11SourceRef("83", "99");

const scenes = [
  {
    id: "h1l11-taxi",
    number: "01",
    glyph: "在",
    title: "在路上找饭店",
    titleTh: "หารถ้านอาหารอยู่บนถนน",
    titleEn: "Looking for the restaurant on the road",
    place: "路上",
    placePy: "lùshang",
    placeTh: "บนถนน",
    image: group3AssetPath("/assets/group3/lesson-hsk1-l11-taxi-v1.webp"),
    imageSrcSet: `${group3AssetPath("/assets/group3/lesson-hsk1-l11-taxi-720w-v1.webp")} 720w, ${group3AssetPath("/assets/group3/lesson-hsk1-l11-taxi-v1.webp")} 1400w`,
    imageAlt: {
      th: "หลี่เหวินโทรถามทางขณะนั่งรถหาร้านอาหารในเมือง",
      zh: "李文坐车寻找饭店时打电话问路",
      en: "Li Wen calls for directions while riding through the city to find a restaurant",
    },
    source: "Text 1 · หน้าเล่ม 79 · PDF หน้า 95",
    sourcePage: "79",
    sourceRef: taxiRef,
    context: "在路上，李文在找饭店，王一飞给他打电话。",
    contextTh: "บนถนน หลี่เหวินกำลังหาร้านอาหาร หวังอี้เฟยโทรหาเขา",
    contextEn: "On the road, while Li Wen was looking for the restaurant, Wang Yifei called him.",
    characters: [
      { role: "A", profile: "teacherWang", noteTh: "เพื่อนที่โทรถามว่าไปถึงเมื่อไร", noteZh: "打电话问什么时候能到的朋友", noteEn: "The friend calling to ask when he'll arrive" },
      { role: "B", profile: "liWen", noteTh: "เพื่อนที่กำลังหาร้านอาหาร", noteZh: "正在找饭店的朋友", noteEn: "The friend looking for the restaurant" },
    ],
    lines: [
      line(taxiRef, { role: "A", speaker: "王一飞", pinyin: "wèi, lǐ wén, nǐ shénme shíhou néng dào fàndiàn", hanzi: "喂，李文，你什么时候能到饭店？", reading: "Wèi, Lǐ Wén, nǐ shénme shíhou néng dào fàndiàn?", en: "Hey, Li Wen, when will you arrive at the restaurant?", th: "ฮัลโหล หลี่เหวิน เมื่อไรเธอจะถึงร้านอาหาร?", visual: { zh: "什么时候能到", th: "เมื่อไรจะถึง", focus: "26% center" } }),
      line(taxiRef, { role: "B", speaker: "李文", pinyin: "hái bù zhīdào, zhèngzài zhǎo ne. tā shì bu shì zài chāoshì hòubian", hanzi: "还不知道，正在找呢。它是不是在超市后边？", reading: "Hái bù zhīdào, zhèngzài zhǎo ne. Tā shì bu shì zài chāoshì hòubian?", en: "Not sure yet. I'm looking for it now. Is it behind the supermarket?", th: "ยังไม่รู้เลย กำลังหาอยู่ มันอยู่หลังซูเปอร์มาร์เก็ตใช่ไหม?", visual: { zh: "正在找", th: "กำลังหา", focus: "74% center" } }),
      line(taxiRef, { role: "A", speaker: "王一飞", pinyin: "shì de. nǐ kāichē méi kāichē", hanzi: "是的。你开车没开车？", reading: "Shì de. Nǐ kāichē méi kāichē?", en: "Yes. Are you driving or not?", th: "ใช่ เธอขับรถมาหรือไม่ได้ขับ?", visual: { zh: "开车没开车", th: "ขับรถหรือเปล่า", focus: "26% center" } }),
      line(taxiRef, { role: "B", speaker: "李文", pinyin: "wǒ méi kāichē, zuò chē ne", hanzi: "我没开车，坐车呢。", reading: "Wǒ méi kāichē, zuò chē ne.", en: "I'm not driving. I'm taking a ride.", th: "ฉันไม่ได้ขับรถ นั่งรถมา", visual: { zh: "坐车呢", th: "นั่งรถมา", focus: "74% center" } }),
    ],
    qte: {
      after: 4,
      prompt: { th: "หลี่เหวินขับรถมาหรือเปล่า?", zh: "李文开车了吗？", en: "Is Li Wen driving?" },
      options: [
        { value: "没开车", zh: "没开车", pinyin: "Méi kāichē", th: "ไม่ได้ขับ" },
        { value: "开车了", zh: "开车了", pinyin: "Kāichē le", th: "ขับรถมา" },
        { value: "坐出租车", zh: "坐出租车", pinyin: "Zuò chūzūchē", th: "นั่งแท็กซี่" },
      ],
      correct: "没开车",
      evidence: "李文：我没开车，坐车呢。",
      evidenceTh: "หลี่เหวิน: ฉันไม่ได้ขับรถ นั่งรถมา",
      sourceRef: taxiRef,
    },
    builder: {
      prompt: { th: "เรียงคำถาม “เธอขับรถมาหรือไม่ได้ขับ”", zh: "重组“你开车没开车”", en: "Rebuild “Are you driving or not”" },
      answer: ["你", "开车", "没开车？"],
      tiles: ["开车", "你", "没开车？"],
      gloss: { 你: "คุณ", 开车: "ขับรถ", 没开车: "ไม่ได้ขับ" },
      translationTh: "คุณขับรถมาหรือไม่ได้ขับ?",
      translationEn: "Are you driving or not?",
      evidence: "Text 1 · หน้าเล่ม 79",
      sourceRef: taxiRef,
    },
  },
  {
    id: "h1l11-restaurant",
    number: "02",
    glyph: "读",
    title: "在饭店里聊大学生活",
    titleTh: "คุยเรื่องชีวิตมหา'ลัยในร้านอาหาร",
    titleEn: "Talking about university life at the restaurant",
    place: "饭店",
    placeTh: "ร้านอาหาร",
    image: group3AssetPath("/assets/group3/lesson-hsk1-l11-restaurant-v1.webp"),
    imageSrcSet: `${group3AssetPath("/assets/group3/lesson-hsk1-l11-restaurant-720w-v1.webp")} 720w, ${group3AssetPath("/assets/group3/lesson-hsk1-l11-restaurant-v1.webp")} 1400w`,
    imageAlt: {
      th: "หลี่เหวินเล่าเรื่องการเรียนแพทย์ที่ยุ่งให้หวังอี้เฟยฟังในร้านอาหาร",
      zh: "李文在饭店向王一飞讲述忙碌的医学学习生活",
      en: "Li Wen tells Wang Yifei about his busy medical studies at a restaurant",
    },
    source: "Text 2 · หน้าเล่ม 81 · PDF หน้า 97",
    sourcePage: "81",
    sourceRef: restaurantRef,
    context: "在饭店里，王一飞和李文见面后聊天儿。",
    contextTh: "ในร้านอาหาร หวังอี้เฟยและหลี่เหวินเจอกันแล้วคุยกัน",
    contextEn: "After meeting at the restaurant, Wang Yifei and Li Wen were chatting.",
    characters: [
      { role: "A", profile: "teacherWang", noteTh: "เพื่อนที่ถามเรื่องการเรียน", noteZh: "询问学习情况的朋友", noteEn: "The friend asking about studies" },
      { role: "B", profile: "liWen", noteTh: "นักศึกษาแพทย์ที่ตอบคำถาม", noteZh: "学医的大学生", noteEn: "The medical student answering" },
    ],
    lines: [
      line(restaurantRef, { role: "A", speaker: "王一飞", pinyin: "nǐ hái zài dú dàxué ma", hanzi: "你还在读大学吗？", reading: "Nǐ hái zài dú dàxué ma?", en: "Are you still studying at university?", th: "เธอยังเรียนมหาวิทยาลัยอยู่หรือ?", visual: { zh: "还在读大学吗", th: "ยังเรียนมหา'ลัยอยู่ไหม", focus: "26% center" } }),
      line(restaurantRef, { role: "B", speaker: "李文", pinyin: "duì, wǒ dú dàxué ne, hái shì dàxuéshēng", hanzi: "对，我读大学呢，还是大学生。", reading: "Duì, wǒ dú dàxué ne, hái shì dàxuéshēng.", en: "Yes. I'm studying at university; I'm still an undergraduate.", th: "ใช่ ฉันกำลังเรียนมหาวิทยาลัยอยู่ ยังเป็นนักศึกษาอยู่", visual: { zh: "还是大学生", th: "ยังเป็นนักศึกษา", focus: "74% center" } }),
      line(restaurantRef, { role: "A", speaker: "王一飞", pinyin: "nǐmen xuéxí máng bu máng", hanzi: "你们学习忙不忙？", reading: "Nǐmen xuéxí máng bu máng?", en: "Are you busy with your studies?", th: "พวกเธอเรียนยุ่งไหม?", visual: { zh: "忙不忙", th: "ยุ่งหรือเปล่า", focus: "26% center" } }),
      line(restaurantRef, { role: "B", speaker: "李文", pinyin: "fēicháng máng, wǒ xué yī, wǒmen de kè hěn duō", hanzi: "非常忙，我学医，我们的课很多。", reading: "Fēicháng máng, wǒ xué yī, wǒmen de kè hěn duō.", en: "Very busy. I major in medicine, and we have a lot of classes.", th: "ยุ่งมาก ฉันเรียนแพทย์ วิชาเราเยอะมาก", visual: { zh: "学医", th: "เรียนแพทย์", focus: "74% center" } }),
    ],
    qte: {
      after: 4,
      prompt: { th: "หลี่เหวินเรียนอะไร?", zh: "李文学什么？", en: "What does Li Wen study?" },
      options: [
        { value: "医", zh: "医", pinyin: "Yī", th: "แพทย์" },
        { value: "中文", zh: "中文", pinyin: "Zhōngwén", th: "ภาษาจีน" },
        { value: "电脑", zh: "电脑", pinyin: "Diànnǎo", th: "คอมพิวเตอร์" },
      ],
      correct: "医",
      evidence: "李文：非常忙，我学医，我们的课很多。",
      evidenceTh: "หลี่เหวิน: ยุ่งมาก ฉันเรียนแพทย์ วิชาเราเยอะมาก",
      sourceRef: restaurantRef,
    },
    builder: {
      prompt: { th: "เรียงคำถาม “เธอยังเรียนมหาวิทยาลัยอยู่หรือ”", zh: "重组“你还在读大学吗”", en: "Rebuild “Are you still studying at university”" },
      answer: ["你", "还在", "读大学", "吗？"],
      tiles: ["读大学", "你", "吗？", "还在"],
      gloss: { 你: "คุณ", 还在: "ยัง...อยู่", 读大学: "เรียนมหาวิทยาลัย", 吗: "ไหม" },
      translationTh: "คุณยังเรียนมหาวิทยาลัยอยู่หรือ?",
      translationEn: "Are you still studying at university?",
      evidence: "Text 2 · หน้าเล่ม 81",
      sourceRef: restaurantRef,
    },
  },
  {
    id: "h1l11-brother",
    number: "03",
    glyph: "要",
    title: "问弟弟起床了没有",
    titleTh: "ถามว่าน้องชายตื่นหรือยัง",
    titleEn: "Asking whether the little brother is up",
    place: "家里",
    placeTh: "ที่บ้าน",
    image: group3AssetPath("/assets/group3/lesson-hsk1-l11-brother-v1.webp"),
    imageSrcSet: `${group3AssetPath("/assets/group3/lesson-hsk1-l11-brother-720w-v1.webp")} 720w, ${group3AssetPath("/assets/group3/lesson-hsk1-l11-brother-v1.webp")} 1400w`,
    imageAlt: {
      th: "หลิวหมิงถามลูกสาวเรื่องน้องชายที่ยังหลับอยู่ก่อนออกไปทำงาน",
      zh: "刘明出门上班前问女儿还在睡觉的弟弟",
      en: "Liu Ming asks his daughter about her little brother, who is still asleep",
    },
    source: "Text 3 · หน้าเล่ม 82–83 · PDF หน้า 98–99",
    sourcePage: "83",
    sourceRef: brotherRef,
    context: "星期六早上，刘明要去医院加班，出门前和女儿对话。",
    contextTh: "เช้าวันเสาร์ หลิวหมิงจะไปทำงานล่วงเวลาที่โรงพยาบาล ก่อนออกจากบ้านคุยกับลูกสาว",
    contextEn: "On Saturday morning, Liu Ming was going to the hospital to work overtime. Before leaving, he talked with his daughter.",
    characters: [
      { role: "A", profile: "liu", noteTh: "พ่อที่ถามเรื่องน้องชาย", noteZh: "询问弟弟情况的爸爸", noteEn: "The father asking about the little brother" },
      { role: "B", profile: "liuXiaoxue", noteTh: "ลูกสาวที่ตอบเรื่องน้องชาย", noteZh: "回答弟弟情况的女儿", noteEn: "The daughter answering about her brother" },
    ],
    lines: [
      line(brotherRef, { role: "A", speaker: "刘明", pinyin: "dìdi qǐchuáng méi qǐchuáng ne", hanzi: "弟弟起床没起床呢？", reading: "Dìdi qǐchuáng méi qǐchuáng ne?", en: "Has your little brother gotten up?", th: "น้องชายตื่นยัง?", visual: { zh: "起床没起床", th: "ตื่นหรือยัง", focus: "26% center" } }),
      line(brotherRef, { role: "B", speaker: "刘小雪", pinyin: "méi qǐchuáng ne, hái zài shuìjiào", hanzi: "没起床呢，还在睡觉。", reading: "Méi qǐchuáng ne, hái zài shuìjiào.", en: "Not yet. He's still sleeping.", th: "ยังไม่ตื่น ยังนอนอยู่", visual: { zh: "还在睡觉", th: "ยังนอนอยู่", focus: "74% center" } }),
      line(brotherRef, { role: "A", speaker: "刘明", pinyin: "hái shuì ne? tā jīntiān qù bu qù nàlǐ", hanzi: "还睡呢？他今天去不去那里？", reading: "Hái shuì ne? Tā jīntiān qù bu qù nàlǐ?", en: "Still sleeping? Is he going there today or not?", th: "ยังนอนอยู่เหรอ? วันนี้เขาไปที่นั่นไหม?", visual: { zh: "去不去", th: "ไปหรือไม่ไป", focus: "26% center" } }),
      line(brotherRef, { role: "B", speaker: "刘小雪", pinyin: "qù nǎlǐ", hanzi: "去哪里？", reading: "Qù nǎlǐ?", en: "Going where?", th: "ไปที่ไหน?", visual: { zh: "去哪里", th: "ไปที่ไหน", focus: "74% center" } }),
      line(brotherRef, { role: "A", speaker: "刘明", pinyin: "qù chāoshì", hanzi: "去超市。", reading: "Qù chāoshì.", en: "To the supermarket.", th: "ไปซูเปอร์มาร์เก็ต", visual: { zh: "去超市", th: "ไปซูเปอร์มาร์เก็ต", focus: "26% center" } }),
      line(brotherRef, { role: "B", speaker: "刘小雪", pinyin: "wǒ zuótiān wèn tā, tā duì wǒ shuō, tā bù qù, tā jīntiān yào hé xiǎopéngyǒu wán", hanzi: "我昨天问他，他对我说，他不去，他今天要和小朋友玩。", reading: "Wǒ zuótiān wèn tā, tā duì wǒ shuō, tā bù qù, tā jīntiān yào hé xiǎopéngyǒu wán.", en: "I asked him yesterday. He told me he's not going; he wants to play with his friends today.", th: "เมื่อวานฉันถามเขา เขาบอกฉันว่าไม่ไป วันนี้เขาจะไปเล่นกับเพื่อน ๆ", visual: { zh: "要和小朋友玩", th: "จะไปเล่นกับเพื่อน", focus: "74% center" } }),
    ],
    qte: {
      after: 6,
      prompt: { th: "น้องชายวันนี้จะไปที่ไหน?", zh: "弟弟今天去不去超市？", en: "Will the little brother go to the supermarket today?" },
      options: [
        { value: "不去", zh: "不去", pinyin: "Bù qù", th: "ไม่ไป" },
        { value: "去", zh: "去", pinyin: "Qù", th: "ไป" },
        { value: "下午去", zh: "下午去", pinyin: "Xiàwǔ qù", th: "บ่ายไป" },
      ],
      correct: "不去",
      evidence: "刘小雪：我昨天问他，他对我说，他不去，他今天要和小朋友玩。",
      evidenceTh: "หลิวเสี่ยวเสวี่ย: เมื่อวานฉันถามเขา เขาบอกว่าไม่ไป วันนี้จะไปเล่นกับเพื่อน ๆ",
      sourceRef: brotherRef,
    },
    builder: {
      prompt: { th: "เรียงคำถาม “น้องชายตื่นหรือยัง”", zh: "重组“弟弟起床没起床”", en: "Rebuild “Has the little brother gotten up”" },
      answer: ["弟弟", "起床", "没起床？"],
      tiles: ["起床", "没起床？", "弟弟"],
      gloss: { 弟弟: "น้องชาย", 起床: "ตื่นนอน", 没起床: "ยังไม่ตื่น" },
      translationTh: "น้องชายตื่นหรือยัง?",
      translationEn: "Has the little brother gotten up?",
      evidence: "Text 3 · หน้าเล่ม 83",
      sourceRef: brotherRef,
    },
  },
];

export const LESSON_HSK1_L11 = {
  id: "hsk1-l11",
  slug: "lesson-11",
  level: "hsk1",
  number: 11,
  featured: false,
  source: {
    title: "新HSK教程 1 · New HSK Course 1",
    lesson: "Lesson 11 · 我读大学呢",
    printedPages: "78–85",
    pdfPages: "94–101",
    file: "hsk1-2.pdf",
    sourceRef,
  },
  sourceRef,
  title: {
    zh: "我读大学呢",
    pinyin: "Wǒ dú dàxué ne",
    en: "I'm studying at university",
    thAid: "ฉันกำลังเรียนมหาวิทยาลัยอยู่",
  },
  summary: {
    zh: "学会用三种结构表达正在做的事情，掌握正反问格式，以及能愿动词“要”表达想做、打算做的用法。",
    en: "Learn three structures to express actions in progress, master the affirmative-negative question pattern, and the modal verb 要 to express desire or intention.",
    thAid: "ใช้โครงสร้าง 在/正在+กริยา และ กริยา+呢 บอกเหตุการณ์ที่กำลังเกิดขึ้น ใช้คำถามแบบยืนยัน-ปฏิเสธ (X不/没X) และใช้ 要 บอกความตั้งใจ",
  },
  translationPolicy: { kind: "editorial-aid", labelTh: "คำแปลไทยเพื่อช่วยเรียน เรียบเรียงจากต้นฉบับ" },
  objectives: [
    { zh: "能听懂并使用三种结构表达正在做的事情。", en: "Be able to understand and use three structures to express actions in progress.", thAid: "ใช้ 在/正在+กริยา+呢 หรือ กริยา+呢 บอกสิ่งที่กำลังทำ", sourceRef: lessonHsk1L11SourceRef("78", "94") },
    { zh: "能听懂并使用正反问格式进行提问。", en: "Be able to understand and form questions using the affirmative-negative question pattern.", thAid: "ใช้คำถามแบบ X+不/没+X เช่น 去不去 忙不忙", sourceRef: lessonHsk1L11SourceRef("78", "94") },
    { zh: "掌握能愿动词“要”表达想做、打算做的用法。", en: "Master the use of the modal verb 要 to express the desire or intention to do something.", thAid: "ใช้ 要 บอกความอยากทำ/ตั้งใจทำ", sourceRef: lessonHsk1L11SourceRef("78", "94") },
  ],
  contents: [
    { number: "00", title: "目标与热身", titleTh: "เป้าหมายและการเตรียมบท", detail: "Objectives · Warm-Up", pages: "78", route: "/home/hsk1/lesson-11/preface/", sourceRef: lessonHsk1L11SourceRef("78", "94") },
    { number: "01", title: "在路上找饭店", titleTh: "หารถ้านอาหารอยู่บนถนน", detail: "Text 1 · New Words 1–6", pages: "79", scene: 1, sourceRef: lessonHsk1L11SourceRef("79", "95") },
    { number: "02", title: "在饭店里聊大学生活", titleTh: "คุยเรื่องชีวิตมหา'ลัยในร้านอาหาร", detail: "Text 2 · New Words 7–13", pages: "81", scene: 2, sourceRef: lessonHsk1L11SourceRef("81", "97") },
    { number: "03", title: "问弟弟起床了没有", titleTh: "ถามว่าน้องชายตื่นหรือยัง", detail: "Text 3 · New Words 14–25", pages: "83", scene: 3, sourceRef: lessonHsk1L11SourceRef("83", "99") },
    { number: "04", title: "综合练习与活动", titleTh: "แบบฝึกรวมและกิจกรรม", detail: "Comprehensive Exercises (source trail)", pages: "84–85", sourceRef: lessonHsk1L11SourceRef("84-85", "100-101") },
  ],
  vocabulary,
  grammarFocus: [
    { title: "正反问", titleEn: "Affirmative-Negative Questions", explanationZh: "正反问格式是“X+不/没+X”，“X”是动词或形容词。动词正反问使用“不/没”，形容词正反问使用“不”。例如：它是不是在超市后边？", explanationEn: "Affirmative-negative questions follow the pattern X+不/没+X, where X is a verb or an adjective; 不/没 is used with verbs and 不 with adjectives. For example: 它是不是在超市后边？", thAid: "คำถามแบบ X+不/没+X เช่น 是不是, 去没去, 忙不忙", examples: ["它是不是在超市后边？", "你去没去学校？", "这件衣服好看不好看？"], sourceRef: lessonHsk1L11SourceRef("80", "96") },
    { title: "时间副词“在/正在”", titleEn: "Temporal Adverbs 在/正在", explanationZh: "时间副词“在/正在”位于动词前，表示动作正在进行。本课有三种形式：在/正在+动词；在/正在+动词+呢；动词+呢。", explanationEn: "The temporal adverbs 在/正在 are placed before a verb to express an ongoing action. This lesson introduces three forms: 在/正在+Verb, 在/正在+Verb+呢, and Verb+呢.", thAid: "ใน/กำลัง+กริยา, ใน/กำลัง+กริยา+呢, หรือ กริยา+呢 เช่น 我正在找呢 (กำลังหา)", examples: ["你还在读大学吗？", "学生们在/正在上课呢。", "我们读书呢。"], sourceRef: lessonHsk1L11SourceRef("82", "98") },
    { title: "能愿动词“要”", titleEn: "The Modal Verb 要", explanationZh: "“要”位于动词前，表示想做、打算做某事。例如：他今天要和小朋友玩。", explanationEn: "The modal verb 要 is placed before the verb to express the desire or intention to do something. For example: 他今天要和小朋友玩。", thAid: "要+กริยา บอกความตั้งใจ เช่น 他今天要和小朋友玩 (วันนี้เขาจะไปเล่นกับเพื่อน ๆ)", examples: ["他今天要和小朋友玩。", "我要去医院上班。", "你要去哪儿？"], sourceRef: lessonHsk1L11SourceRef("83", "99") },
  ],
  characters,
  scenes,
};
