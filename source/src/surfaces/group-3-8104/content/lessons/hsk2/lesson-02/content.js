import { group3AssetPath } from "../../../../config.js";

const SOURCE_FILE = "docs/references/hsk/sources/hsk2.pdf";
export const lessonHsk2L2SourceRef = (printedPages, pdfPages) => `${SOURCE_FILE}#printed-pages=${printedPages}&pdf-pages=${pdfPages}`;
const sourceRef = lessonHsk2L2SourceRef("10-18", "24-32");

const art = (scene) => ({
  image: group3AssetPath(`/assets/group3/lesson-hsk2-l2-${scene}-v1.webp`),
  imageSrcSet: `${group3AssetPath(`/assets/group3/lesson-hsk2-l2-${scene}-720w-v1.webp`)} 720w, ${group3AssetPath(`/assets/group3/lesson-hsk2-l2-${scene}-v1.webp`)} 1400w`,
});

const characters = {
  bai: { hanzi: "白家月", pinyin: "Bái Jiāyuè", nameTh: "ไป๋เจียเยว่", nameEn: "Bai Jiayue", ...art("hotel"), imageFocus: "26% center" },
  annie: { hanzi: "安妮", pinyin: "Ānnī", nameTh: "แอนนี่", nameEn: "Annie", ...art("campus"), imageFocus: "30% center" },
  hotelReceptionist: { hanzi: "服务员", pinyin: "Fúwùyuán", nameTh: "พนักงานต้อนรับ", nameEn: "Receptionist", ...art("hotel"), imageFocus: "72% center" },
};

const vocabularyPages = [
  [1, "公交车", "gōngjiāochē", "n.", "bus", "รถประจำทาง", 11, 25],
  [2, "但", "dàn", "conj.", "but; yet", "แต่ / ทว่า", 11, 25],
  [3, "车站", "chēzhàn", "n.", "stop; station", "สถานี / ป้ายรถ", 11, 25],
  [4, "远", "yuǎn", "adj.", "far away", "ไกล", 11, 25],
  [5, "打车", "dǎchē", "v.", "take or hail a taxi", "เรียกแท็กซี่ / นั่งแท็กซี่", 11, 25],
  [6, "还是", "háishi", "adv.", "had better; instead", "เอาเป็น…ดีกว่า", 11, 25],
  [7, "啊", "a", "part.", "sentence-final particle for appreciation or agreement", "คำลงท้ายแสดงอารมณ์หรือเห็นด้วย", 13, 27],
  [8, "万", "wàn", "num.", "ten thousand", "หมื่น", 13, 27],
  [9, "名", "míng", "m.", "measure word for people", "คน (ลักษณนาม)", 13, 27],
  [10, "网上", "wǎngshang", "n.", "online", "บนอินเทอร์เน็ต", 13, 27],
  [11, "外国", "wàiguó", "n.", "foreign country", "ต่างประเทศ", 13, 27],
  [12, "间", "jiān", "m.", "measure word for rooms", "ห้อง (ลักษณนาม)", 13, 27],
  [13, "教室", "jiàoshì", "n.", "classroom", "ห้องเรียน", 13, 27],
  [14, "票", "piào", "n.", "ticket", "ตั๋ว", 15, 29],
  [15, "别", "bié", "adv.", "do not; had better not", "อย่า / ไม่ควร", 15, 29],
  [16, "过来", "guòlái", "v.", "come here", "มาทางนี้", 16, 30],
  [17, "北京大学", "Běijīng Dàxué", "proper n.", "Peking University", "มหาวิทยาลัยปักกิ่ง", 11, 25],
  [18, "电影院", "diànyǐngyuàn", "n.", "cinema", "โรงภาพยนตร์", 15, 29],
  [19, "电影票", "diànyǐngpiào", "n.", "movie ticket", "ตั๋วหนัง", 15, 29],
  [20, "学生", "xuéshēng", "n.", "student", "นักเรียน / นักศึกษา", 13, 27],
];

const vocabulary = vocabularyPages.map(([index, hanzi, pinyin, type, en, thAid, page, pdfPage]) => ({
  index, hanzi, pinyin, type, en, th: thAid, thAid, page, translationKind: "editorial-aid", sourceRef: lessonHsk2L2SourceRef(String(page), String(pdfPage)),
}));
const line = (source, value) => ({ ...value, sourceRef: source });
const hotelRef = lessonHsk2L2SourceRef("11", "25");
const campusRef = lessonHsk2L2SourceRef("12-13", "26-27");
const cinemaRef = lessonHsk2L2SourceRef("14-15", "28-29");

const scenes = [
  {
    id: "h2l2-hotel", number: "01", glyph: "车", title: "在宾馆前台", titleTh: "ที่เคาน์เตอร์โรงแรม", titleEn: "At the hotel reception", place: "宾馆前台", placeTh: "เคาน์เตอร์โรงแรม", ...art("hotel"),
    imageAlt: { th: "ไป๋เจียเยว่และแอนนี่ถามทางที่โรงแรม", zh: "宾馆前台问路场景", en: "Hotel reception scene" }, source: "Text 1 · หน้าเล่ม 11 · PDF หน้า 25", sourcePage: "11", sourceRef: hotelRef,
    context: "在宾馆前台，白家月和安妮向服务员咨询。", contextTh: "ที่เคาน์เตอร์โรงแรม ไป๋เจียเยว่และแอนนี่สอบถามพนักงาน", contextEn: "At the hotel reception, Bai Jiayue and Annie asked the receptionist for information.",
    characters: [
      { role: "A", profile: "bai", noteTh: "ผู้ถามทางไปมหาวิทยาลัยปักกิ่ง", noteZh: "询问去北京大学路线的学生", noteEn: "The student asking how to reach Peking University" },
      { role: "B", profile: "hotelReceptionist", noteTh: "พนักงานที่แนะนำวิธีเดินทาง", noteZh: "介绍交通方式的服务员", noteEn: "The receptionist explaining transport options" },
      { role: "C", profile: "annie", noteTh: "เพื่อนที่ตกลงนั่งแท็กซี่", noteZh: "同意打车的朋友", noteEn: "The friend agreeing to take a taxi" },
    ],
    lines: [
      line(hotelRef, { role: "A", speaker: "白家月", pinyin: "qǐngwèn, zhèr yǒu dào Běijīng Dàxué de gōngjiāochē ma", hanzi: "请问，这儿有到北京大学的公交车吗？", reading: "Qǐngwèn, zhèr yǒu dào Běijīng Dàxué de gōngjiāochē ma?", en: "Excuse me, is there a bus from here to Peking University?", th: "ขอโทษค่ะ ที่นี่มีรถประจำทางไปมหาวิทยาลัยปักกิ่งไหม?", visual: { zh: "到北京大学的公交车", th: "รถประจำทางไปมหาวิทยาลัยปักกิ่ง", focus: "28% center" } }),
      line(hotelRef, { role: "B", speaker: "服务员", pinyin: "yǒu, dàn chēzhàn yǒudiǎnr yuǎn", hanzi: "有，但车站有点儿远。", reading: "Yǒu, dàn chēzhàn yǒudiǎnr yuǎn.", en: "Yes, but the bus stop is a little far away.", th: "มีค่ะ แต่ป้ายรถอยู่ไกลนิดหน่อย", visual: { zh: "车站有点儿远", th: "ป้ายรถไกลนิดหน่อย", focus: "70% center" } }),
      line(hotelRef, { role: "A", speaker: "白家月", pinyin: "zhèr hǎo dǎchē ma", hanzi: "这儿好打车吗？", reading: "Zhèr hǎo dǎchē ma?", en: "Is it easy to get a taxi here?", th: "ที่นี่เรียกแท็กซี่ง่ายไหม?", visual: { zh: "好打车吗", th: "เรียกแท็กซี่ง่ายไหม", focus: "30% center" } }),
      line(hotelRef, { role: "B", speaker: "服务员", pinyin: "hǎo dǎchē", hanzi: "好打车。", reading: "Hǎo dǎchē.", en: "Yes, it is easy.", th: "เรียกง่ายค่ะ", visual: { zh: "好打车", th: "เรียกง่าย", focus: "68% center" } }),
      line(hotelRef, { role: "A", speaker: "白家月", pinyin: "xièxie. Ānnī, wǒmen háishi dǎchē qù ba", hanzi: "谢谢。安妮，我们还是打车去吧。", reading: "Xièxie. Ānnī, wǒmen háishi dǎchē qù ba.", en: "Thank you. Annie, let’s take a taxi instead.", th: "ขอบคุณค่ะ แอนนี่ เรานั่งแท็กซี่ไปดีกว่า", visual: { zh: "还是打车去吧", th: "นั่งแท็กซี่ไปดีกว่า", focus: "34% center" } }),
      line(hotelRef, { role: "C", speaker: "安妮", pinyin: "hǎo, méi wèntí", hanzi: "好，没问题。", reading: "Hǎo, méi wèntí.", en: "Okay, no problem.", th: "ได้ ไม่มีปัญหา", visual: { zh: "没问题", th: "ไม่มีปัญหา", focus: "32% center" } }),
    ],
    qte: { after: 4, prompt: { th: "สุดท้ายทั้งสองคนเลือกเดินทางอย่างไร?", zh: "她们最后选择怎么去？", en: "How do they decide to travel?" }, options: [{ value: "打车", zh: "打车", pinyin: "dǎchē", th: "นั่งแท็กซี่" }, { value: "坐公交车", zh: "坐公交车", pinyin: "zuò gōngjiāochē", th: "นั่งรถประจำทาง" }, { value: "走路", zh: "走路", pinyin: "zǒulù", th: "เดิน" }], correct: "打车", evidence: "白家月：我们还是打车去吧。", evidenceTh: "ไป๋เจียเยว่: เรานั่งแท็กซี่ไปดีกว่า", sourceRef: hotelRef },
    builder: { prompt: { th: "เรียงประโยคเสนอวิธีเดินทาง", zh: "重组白家月的建议", en: "Rebuild Bai Jiayue’s suggestion" }, answer: ["我们", "还是", "打车", "去", "吧"], tiles: ["打车", "吧", "还是", "我们", "去"], gloss: { 我们: "พวกเรา", 还是: "เอาเป็น…ดีกว่า", 打车: "นั่งแท็กซี่", 去: "ไป", 吧: "เถอะ" }, translationTh: "พวกเรานั่งแท็กซี่ไปดีกว่า", translationEn: "Let’s take a taxi instead.", evidence: "Text 1 · หน้าเล่ม 11", sourceRef: hotelRef },
  },
  {
    id: "h2l2-campus", number: "02", glyph: "万", title: "参观北京大学", titleTh: "เยี่ยมชมมหาวิทยาลัยปักกิ่ง", titleEn: "Touring Peking University", place: "北京大学",
    placePy: "Běijīng Dàxué", placeTh: "มหาวิทยาลัยปักกิ่ง", ...art("campus"),
    imageAlt: { th: "วิทยาเขตมหาวิทยาลัยปักกิ่ง", zh: "北京大学校园", en: "Peking University campus" }, source: "Text 2 · หน้าเล่ม 12–13 · PDF หน้า 26–27", sourcePage: "12–13", sourceRef: campusRef,
    context: "在北京大学，白家月和安妮在参观校园。", contextTh: "ไป๋เจียเยว่และแอนนี่กำลังชมวิทยาเขตมหาวิทยาลัยปักกิ่ง", contextEn: "At Peking University, Bai Jiayue and Annie were touring the campus.",
    characters: [{ role: "A", profile: "bai", noteTh: "ผู้สนใจจำนวนคนในมหาวิทยาลัย", noteZh: "对校园人数感兴趣的学生", noteEn: "The student curious about the campus" }, { role: "B", profile: "annie", noteTh: "ผู้ค้นข้อมูลมหาวิทยาลัยจากอินเทอร์เน็ต", noteZh: "从网上了解学校信息的学生", noteEn: "The student who read about the university online" }],
    lines: [
      line(campusRef, { role: "A", speaker: "白家月", pinyin: "xuéxiào li rén zhēn duō a", hanzi: "学校里人真多啊！", reading: "Xuéxiào li rén zhēn duō a!", en: "It is so crowded on campus!", th: "ในมหาวิทยาลัยคนเยอะจริง ๆ!", visual: { zh: "人真多", th: "คนเยอะจริง ๆ", focus: "28% center" } }),
      line(campusRef, { role: "B", speaker: "安妮", pinyin: "shì a, Běijīng Dàxué yǒu sì wàn duō míng xuéshēng ne", hanzi: "是啊，北京大学有四万多名学生呢！", reading: "Shì a, Běijīng Dàxué yǒu sì wàn duō míng xuéshēng ne!", en: "Yes. Peking University has more than forty thousand students!", th: "ใช่ มหาวิทยาลัยปักกิ่งมีนักศึกษากว่าสี่หมื่นคน!", visual: { zh: "四万多名学生", th: "นักศึกษากว่าสี่หมื่นคน", focus: "66% center" } }),
      line(campusRef, { role: "A", speaker: "白家月", pinyin: "nǐ shì zěnme zhīdào de", hanzi: "你是怎么知道的？", reading: "Nǐ shì zěnme zhīdào de?", en: "How do you know?", th: "เธอรู้ได้อย่างไร?", visual: { zh: "怎么知道的", th: "รู้ได้อย่างไร", focus: "32% center" } }),
      line(campusRef, { role: "B", speaker: "安妮", pinyin: "shì wǎngshang shuō de, wǎngshang hái shuō Běijīng Dàxué yǒu sān qiān duō míng wàiguó xuéshēng", hanzi: "是网上说的，网上还说北京大学有三千多名外国学生。", reading: "Shì wǎngshang shuō de, wǎngshang hái shuō Běijīng Dàxué yǒu sān qiān duō míng wàiguó xuéshēng.", en: "I read it online. It also says there are more than three thousand international students.", th: "อ่านจากอินเทอร์เน็ต และยังบอกว่ามีนักศึกษาต่างชาติกว่าสามพันคน", visual: { zh: "三千多名外国学生", th: "นักศึกษาต่างชาติกว่าสามพันคน", focus: "64% center" } }),
      line(campusRef, { role: "A", speaker: "白家月", pinyin: "wǒ yě xiǎng lái zhèr xuéxí", hanzi: "我也想来这儿学习。", reading: "Wǒ yě xiǎng lái zhèr xuéxí.", en: "I would like to study here too.", th: "ฉันก็อยากมาเรียนที่นี่", visual: { zh: "来这儿学习", th: "มาเรียนที่นี่", focus: "34% center" } }),
      line(campusRef, { role: "B", speaker: "安妮", pinyin: "nàbian jiù yǒu yì jiān jiàoshì, wǒmen qù kàn yíxià ba", hanzi: "那边就有一间教室，我们去看一下吧。", reading: "Nàbian jiù yǒu yì jiān jiàoshì, wǒmen qù kàn yíxià ba.", en: "There is a classroom over there. Let’s go and have a look.", th: "ตรงนั้นมีห้องเรียนหนึ่งห้อง เราไปดูกันหน่อยเถอะ", visual: { zh: "一间教室", th: "ห้องเรียนหนึ่งห้อง", focus: "62% center" } }),
    ],
    qte: { after: 3, prompt: { th: "มหาวิทยาลัยปักกิ่งมีนักศึกษาประมาณเท่าไร?", zh: "北京大学大约有多少名学生？", en: "Approximately how many students attend Peking University?" }, options: [{ value: "四万多名", zh: "四万多名", pinyin: "sì wàn duō míng", th: "กว่าสี่หมื่นคน" }, { value: "三千多名", zh: "三千多名", pinyin: "sān qiān duō míng", th: "กว่าสามพันคน" }, { value: "二十多名", zh: "二十多名", pinyin: "èrshí duō míng", th: "กว่ายี่สิบคน" }], correct: "四万多名", evidence: "安妮：北京大学有四万多名学生呢！", evidenceTh: "แอนนี่: มหาวิทยาลัยปักกิ่งมีนักศึกษากว่าสี่หมื่นคน", sourceRef: campusRef },
    builder: { prompt: { th: "เรียงประโยคบอกจำนวนโดยประมาณ", zh: "重组表示概数的句子", en: "Rebuild the approximate-number sentence" }, answer: ["北京大学", "有", "四万多名", "学生"], tiles: ["学生", "四万多名", "有", "北京大学"], gloss: { 北京大学: "มหาวิทยาลัยปักกิ่ง", 有: "มี", 四万多名: "กว่าสี่หมื่นคน", 学生: "นักศึกษา" }, translationTh: "มหาวิทยาลัยปักกิ่งมีนักศึกษากว่าสี่หมื่นคน", translationEn: "Peking University has more than forty thousand students.", evidence: "Text 2 · หน้าเล่ม 13", sourceRef: campusRef },
  },
  {
    id: "h2l2-cinema", number: "03", glyph: "票", title: "校园里的电影院", titleTh: "โรงภาพยนตร์ในมหาวิทยาลัย", titleEn: "The cinema on campus", place: "北京大学校园", placeTh: "วิทยาเขตมหาวิทยาลัยปักกิ่ง", ...art("cinema"),
    imageAlt: { th: "อาคารโรงภาพยนตร์ในมหาวิทยาลัย", zh: "北京大学百周年纪念讲堂", en: "Campus cinema building" }, source: "Text 3 · หน้าเล่ม 14–15 · PDF หน้า 28–29", sourcePage: "14–15", sourceRef: cinemaRef,
    context: "在北京大学，白家月和安妮继续参观校园。", contextTh: "ไป๋เจียเยว่และแอนนี่เดินชมวิทยาเขตต่อและเห็นโรงภาพยนตร์", contextEn: "Bai Jiayue and Annie continued their campus tour and found a cinema.",
    characters: [{ role: "A", profile: "annie", noteTh: "ผู้ชวนดูโรงภาพยนตร์", noteZh: "发现电影院并提议看电影的学生", noteEn: "The student who notices the cinema" }, { role: "B", profile: "bai", noteTh: "ผู้เลือกชมมหาวิทยาลัยต่อ", noteZh: "选择继续参观校园的学生", noteEn: "The student choosing to keep touring" }],
    lines: [
      line(cinemaRef, { role: "A", speaker: "安妮", pinyin: "Jiāyuè, nǐ kàn, xuéxiào li yǒu jiā diànyǐngyuàn", hanzi: "家月，你看，学校里有家电影院！", reading: "Jiāyuè, nǐ kàn, xuéxiào li yǒu jiā diànyǐngyuàn!", en: "Jiayue, look! There is a cinema on campus!", th: "เจียเยว่ ดูสิ ในมหาวิทยาลัยมีโรงภาพยนตร์ด้วย!", visual: { zh: "有家电影院", th: "มีโรงภาพยนตร์", focus: "34% center" } }),
      line(cinemaRef, { role: "B", speaker: "白家月", pinyin: "shì a, diànyǐngyuàn hái bù xiǎo", hanzi: "是啊，电影院还不小。", reading: "Shì a, diànyǐngyuàn hái bù xiǎo.", en: "Yes, and it is quite large.", th: "ใช่ โรงภาพยนตร์ก็ไม่เล็กเลย", visual: { zh: "还不小", th: "ไม่เล็กเลย", focus: "62% center" } }),
      line(cinemaRef, { role: "A", speaker: "安妮", pinyin: "tāmen mài de diànyǐngpiào yě hěn piányi", hanzi: "他们卖的电影票也很便宜。", reading: "Tāmen mài de diànyǐngpiào yě hěn piányi.", en: "The movie tickets they sell are also inexpensive.", th: "ตั๋วหนังที่เขาขายก็ราคาถูกมาก", visual: { zh: "卖的电影票", th: "ตั๋วหนังที่ขาย", focus: "38% center" } }),
      line(cinemaRef, { role: "B", speaker: "白家月", pinyin: "tiān a! yǒude hái bú dào èrshí kuài qián", hanzi: "天啊！有的还不到二十块钱。", reading: "Tiān a! Yǒude hái bú dào èrshí kuài qián.", en: "Goodness! Some cost less than twenty yuan.", th: "โอ้โห! บางใบราคาไม่ถึงยี่สิบหยวน", visual: { zh: "不到二十块钱", th: "ไม่ถึงยี่สิบหยวน", focus: "58% center" } }),
      line(cinemaRef, { role: "A", speaker: "安妮", pinyin: "nà nǐ xiǎng bu xiǎng qù kàn ge diànyǐng", hanzi: "那你想不想去看个电影？", reading: "Nà nǐ xiǎng bu xiǎng qù kàn ge diànyǐng?", en: "Then, do you want to watch a movie?", th: "งั้นเธออยากไปดูหนังสักเรื่องไหม?", visual: { zh: "看个电影", th: "ดูหนังสักเรื่อง", focus: "40% center" } }),
      line(cinemaRef, { role: "B", speaker: "白家月", pinyin: "háishi bié kàn diànyǐng le, Běijīng Dàxué jiù hěn hǎokàn", hanzi: "还是别看电影了，北京大学就很好看！", reading: "Háishi bié kàn diànyǐng le, Běijīng Dàxué jiù hěn hǎokàn!", en: "Let’s not watch a movie. Peking University itself is already fascinating!", th: "ไม่ดูหนังดีกว่า แค่มหาวิทยาลัยปักกิ่งก็สวยน่าชมมากแล้ว!", visual: { zh: "还是别看电影了", th: "ไม่ดูหนังดีกว่า", focus: "60% center" } }),
    ],
    qte: { after: 5, prompt: { th: "ทำไมไป๋เจียเยว่ไม่อยากดูหนัง?", zh: "白家月为什么不想看电影？", en: "Why does Bai Jiayue not want to watch a movie?" }, options: [{ value: "北京大学很好看", zh: "北京大学很好看", pinyin: "Běijīng Dàxué hěn hǎokàn", th: "มหาวิทยาลัยปักกิ่งน่าชมมาก" }, { value: "电影票太贵", zh: "电影票太贵", pinyin: "diànyǐngpiào tài guì", th: "ตั๋วหนังแพงเกินไป" }, { value: "电影院太小", zh: "电影院太小", pinyin: "diànyǐngyuàn tài xiǎo", th: "โรงหนังเล็กเกินไป" }], correct: "北京大学很好看", evidence: "白家月：北京大学就很好看！", evidenceTh: "ไป๋เจียเยว่: แค่มหาวิทยาลัยปักกิ่งก็น่าชมมากแล้ว", sourceRef: cinemaRef },
    builder: { prompt: { th: "เรียงประโยคเลือกไม่ดูหนัง", zh: "重组白家月的选择", en: "Rebuild Bai Jiayue’s choice" }, answer: ["还是", "别", "看电影", "了"], tiles: ["看电影", "还是", "了", "别"], gloss: { 还是: "เอาเป็น…ดีกว่า", 别: "อย่า", 看电影: "ดูหนัง", 了: "แล้ว" }, translationTh: "ไม่ดูหนังดีกว่า", translationEn: "Let’s not watch a movie.", evidence: "Text 3 · หน้าเล่ม 15", sourceRef: cinemaRef },
  },
];

export const LESSON_HSK2_L2 = {
  id: "hsk2-l2", slug: "lesson-2", level: "hsk2", number: 2, featured: false, sourceRef,
  source: { title: "新HSK教程 2 · New HSK Course 2", lesson: "Lesson 2 · 还是打车去北大吧", printedPages: "10–18", pdfPages: "24–32", file: "hsk2.pdf", sourceRef },
  title: { zh: "还是打车去北大吧", pinyin: "Háishi dǎchē qù Běidà ba", en: "Let’s take a taxi to Peking University instead", thAid: "นั่งแท็กซี่ไปมหาวิทยาลัยปักกิ่งดีกว่า" },
  summary: { zh: "白家月和安妮参观北京大学，学习交通选择、概数和定语。", en: "Bai Jiayue and Annie tour Peking University while practising transport choices, approximate numbers, and attributives.", thAid: "ตามไป๋เจียเยว่และแอนนี่ชมมหาวิทยาลัยปักกิ่ง ฝึกเลือกวิธีเดินทาง จำนวนโดยประมาณ และคำขยายคำนาม" },
  translationPolicy: { kind: "editorial-aid", labelTh: "คำแปลไทยเพื่อช่วยเรียน เรียบเรียงจากต้นฉบับ" },
  objectives: [
    { zh: "能听懂并介绍学校的基本情况。", en: "Be able to understand and talk about basic information about a school.", thAid: "ฟังและแนะนำข้อมูลพื้นฐานของสถานศึกษา", sourceRef: lessonHsk2L2SourceRef("10", "24") },
    { zh: "能听懂并使用“多”表达大概的数量。", en: "Be able to understand and use 多 to express approximate quantities.", thAid: "เข้าใจและใช้ 多 บอกจำนวนโดยประมาณ", sourceRef: lessonHsk2L2SourceRef("10", "24") },
    { zh: "掌握固定格式“还是……吧”的用法，能表达选择。", en: "Master the fixed pattern 还是……吧 to express a choice.", thAid: "ใช้รูป 还是……吧 เพื่อเสนอทางเลือกที่เหมาะกว่า", sourceRef: lessonHsk2L2SourceRef("10", "24") },
    { zh: "了解中国著名学府——北京大学。", en: "Learn about Peking University, a prestigious university in China.", thAid: "เรียนรู้เกี่ยวกับมหาวิทยาลัยปักกิ่ง มหาวิทยาลัยชั้นนำของจีน", sourceRef: lessonHsk2L2SourceRef("10", "24") },
  ],
  contents: [
    { number: "00", title: "目标与热身", titleTh: "เป้าหมายและการเตรียมบท", detail: "Objectives · Warm-Up", pages: "10", route: "/home/hsk2/lesson-2/preface/", sourceRef: lessonHsk2L2SourceRef("10", "24") },
    { number: "01", title: "在宾馆前台", titleTh: "ที่เคาน์เตอร์โรงแรม", detail: "Text 1 · New Words 1–6", pages: "11–12", scene: 1, sourceRef: lessonHsk2L2SourceRef("11-12", "25-26") },
    { number: "02", title: "参观北京大学", titleTh: "เยี่ยมชมมหาวิทยาลัยปักกิ่ง", detail: "Text 2 · New Words 7–13", pages: "12–14", scene: 2, sourceRef: lessonHsk2L2SourceRef("12-14", "26-28") },
    { number: "03", title: "校园里的电影院", titleTh: "โรงภาพยนตร์ในมหาวิทยาลัย", detail: "Text 3 · New Words 14–15", pages: "14–16", scene: 3, sourceRef: lessonHsk2L2SourceRef("14-16", "28-30") },
    { number: "04", title: "综合练习与活动", titleTh: "แบบฝึกรวมและกิจกรรม", detail: "Text 4 · Exercises · Activity", pages: "16–18", sourceRef: lessonHsk2L2SourceRef("16-18", "30-32") },
  ],
  vocabulary,
  grammarFocus: [
    { title: "固定格式“还是……吧”", titleEn: "Fixed Pattern 还是……吧", explanationZh: "“还是……吧”表示倾向性选择，有“这么办比较好”的意思。", explanationEn: "The fixed pattern 还是……吧 expresses a preferred choice, suggesting that one option is better.", thAid: "ใช้เสนอว่าทางเลือกหนึ่งน่าจะดีกว่า", examples: ["我们还是打车去吧。", "那件衣服很好看，还是买那件吧。", "你第一次去北京，还是找个人接你吧。"], sourceRef: lessonHsk2L2SourceRef("12", "26") },
    { title: "用“多”表达概数", titleEn: "Expressing Approximate Numbers with 多", explanationZh: "“多”用在数词或数量词后表示有零头；整十倍数时一般放在数词后，非整十倍数时一般放在量词后。", explanationEn: "多 after a number or numeral phrase indicates a quantity slightly greater than the stated number.", thAid: "เติม 多 เพื่อบอกว่ามากกว่าตัวเลขที่ระบุเล็กน้อย ตำแหน่งเปลี่ยนตามชนิดของจำนวน", examples: ["北京大学有四万多名学生呢！", "教室里有二十多个学生。", "这两个苹果五块多钱。"], sourceRef: lessonHsk2L2SourceRef("14", "28") },
    { title: "动词、动词性短语和主谓短语作定语", titleEn: "Verbs and Clauses as Attributives", explanationZh: "动词、动词性短语或主谓短语可以放在名词前面，表示名词的特征或状态。", explanationEn: "A verb, verbal phrase, or subject-predicate phrase can precede a noun to describe its characteristics or state.", thAid: "นำกริยา วลีกริยา หรือประโยคย่อยไว้หน้าคำนามเพื่อขยายลักษณะหรือสภาพ", examples: ["他们卖的电影票也很便宜。", "现在学中文的学生很多。", "这是朋友给我的杯子。"], sourceRef: lessonHsk2L2SourceRef("15-16", "29-30") },
  ],
  characters,
  scenes,
};
