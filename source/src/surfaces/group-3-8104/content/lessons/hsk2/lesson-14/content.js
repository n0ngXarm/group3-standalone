import { group3AssetPath } from "../../../../config.js";

const SOURCE_FILE = "docs/references/hsk/sources/hsk2.pdf";
export const lessonHsk2L14SourceRef = (printedPages, pdfPages) => `${SOURCE_FILE}#printed-pages=${printedPages}&pdf-pages=${pdfPages}`;
const sourceRef = lessonHsk2L14SourceRef("121-129", "135-143");
const art = (scene) => ({ image: group3AssetPath(`/assets/group3/lesson-hsk2-l14-${scene}-v1.webp`), imageSrcSet: `${group3AssetPath(`/assets/group3/lesson-hsk2-l14-${scene}-720w-v1.webp`)} 720w, ${group3AssetPath(`/assets/group3/lesson-hsk2-l14-${scene}-v1.webp`)} 1400w` });
const characters = {
  yifei: { hanzi: "王一飞", pinyin: "Wáng Yīfēi", nameTh: "หวังอี้เฟย", nameEn: "Wang Yifei", ...art("downstairs-visitor"), imageFocus: "70% center" },
  liWen: { hanzi: "李文", pinyin: "Lǐ Wén", nameTh: "หลี่เหวิน", nameEn: "Li Wen", ...art("downstairs-visitor"), imageFocus: "30% center" },
  yang: { hanzi: "杨同乐", pinyin: "Yáng Tónglè", nameTh: "หยางถงเล่อ", nameEn: "Yang Tongle", ...art("friends-reunion"), imageFocus: "70% center" },
};
const vocabularyPages = [
  [1, "站", "zhàn", "v.", "stand", "ยืน", 122, 136], [2, "包", "bāo", "n./m.", "bag; bundle", "กระเป๋า / ห่อ", 122, 136], [3, "过年", "guònián", "v.", "celebrate the Spring Festival", "ฉลองตรุษจีน", 124, 138], [4, "没意思", "méiyìsi", "adj.", "boring", "น่าเบื่อ", 124, 138], [5, "位", "wèi", "m.", "polite measure word for people", "ลักษณนามสุภาพสำหรับคน", 124, 138], [6, "前面", "qiánmiàn", "n.", "front", "ด้านหน้า", 124, 138],
  [7, "房子", "fángzi", "n.", "house", "บ้าน", 126, 140], [8, "小孩儿", "xiǎoháir", "n.", "child; kid", "เด็ก", 126, 140], [9, "女孩儿", "nǚháir", "n.", "girl", "เด็กผู้หญิง", 126, 140],
  [10, "楼下", "lóuxià", "n.", "downstairs", "ชั้นล่าง", 122, 136], [11, "穿", "chuān", "v.", "wear", "สวมใส่", 122, 136], [12, "男朋友", "nánpéngyou", "n.", "boyfriend", "แฟนชาย", 122, 136], [13, "旁边", "pángbiān", "n.", "beside", "ข้าง ๆ", 124, 138], [14, "医学院", "yīxuéyuàn", "n.", "medical school", "วิทยาลัยแพทย์", 124, 138], [15, "高兴", "gāoxìng", "adj.", "happy", "ดีใจ", 124, 138], [16, "认识", "rènshi", "v.", "know; meet", "รู้จัก", 124, 138], [17, "客厅", "kètīng", "n.", "living room", "ห้องรับแขก", 126, 140], [18, "帮忙", "bāngmáng", "v.", "help", "ช่วยเหลือ", 126, 140], [19, "楼", "lóu", "n.", "building", "อาคาร", 126, 140], [20, "请客", "qǐngkè", "v.", "treat someone", "เลี้ยงอาหาร", 126, 140],
];
const vocabulary = vocabularyPages.map(([index, hanzi, pinyin, type, en, thAid, page, pdfPage]) => ({ index, hanzi, pinyin, type, en, th: thAid, thAid, page, translationKind: "editorial-aid", sourceRef: lessonHsk2L14SourceRef(String(page), String(pdfPage)) }));
const line = (ref, role, speaker, pinyin, hanzi, en, th, focus) => ({ role, speaker, pinyin, reading: pinyin, hanzi, en, th, visual: { zh: hanzi, th, focus }, sourceRef: ref });
const visitorRef = lessonHsk2L14SourceRef("122", "136");
const reunionRef = lessonHsk2L14SourceRef("124", "138");
const apartmentRef = lessonHsk2L14SourceRef("126", "140");
const scenes = [
  {
    id: "h2l14-downstairs-visitor", number: "01", glyph: "站", title: "你家楼下站着一个人", titleTh: "มีคนหนึ่งยืนอยู่ใต้ตึกบ้านเธอ", titleEn: "Someone is standing downstairs", place: "回家路上", placeTh: "ระหว่างทางกลับบ้าน", ...art("downstairs-visitor"),
    imageAlt: { th: "ภาพชายยืนถือกระเป๋าใต้ตึก", zh: "男子站在楼下的场景", en: "A man standing downstairs" }, source: "Text 1 · หน้าเล่ม 122 · PDF หน้า 136", sourcePage: "122", sourceRef: visitorRef,
    context: "李文看见王一飞家楼下站着一个人，王一飞认出是男朋友。", contextTh: "หลี่เหวินเห็นคนยืนอยู่ใต้ตึกบ้านหวังอี้เฟย และหวังอี้เฟยจำได้ว่าเป็นแฟนของเธอ", contextEn: "Li Wen spots someone downstairs, and Wang Yifei recognizes her boyfriend.",
    characters: [{ role: "A", profile: "liWen", noteTh: "ผู้สังเกตเห็นชายใต้ตึก", noteZh: "看见楼下男子的人", noteEn: "The person who notices the man" }, { role: "B", profile: "teacherWang", noteTh: "ผู้จำแฟนของตนได้", noteZh: "认出男朋友的人", noteEn: "The person who recognizes her boyfriend" }],
    lines: [
      line(visitorRef, "A", "李文", "Wáng lǎoshī, nǐ jiā lóuxià zhànzhe yí ge rén.", "王老师，你家楼下站着一个人。", "Ms. Wang, there’s someone standing downstairs at your building.", "ครูหวัง มีคนหนึ่งยืนอยู่ใต้ตึกบ้านคุณ", "30% center"),
      line(visitorRef, "B", "王一飞", "Wǒ jiā lóuxià? Wǒ kànkan.", "我家楼下？我看看。", "Downstairs at my building? Let me take a look.", "ใต้ตึกบ้านฉันหรือ? ฉันขอดูหน่อย", "70% center"),
      line(visitorRef, "A", "李文", "Nàge rén chuānzhe hēisè de kùzi, shǒuli hái názhe yí ge hēisè de bāo.", "那个人穿着黑色的裤子，手里还拿着一个黑色的包。", "That person is wearing black pants and holding a black bag.", "คนนั้นใส่กางเกงสีดำ และในมือยังถือกระเป๋าสีดำหนึ่งใบ", "30% center"),
      line(visitorRef, "B", "王一飞", "Wǒ kànjian nàge rén le, tā shì wǒ nánpéngyou.", "我看见那个人了，他是我男朋友。", "I see him. He is my boyfriend.", "ฉันเห็นคนนั้นแล้ว เขาเป็นแฟนของฉัน", "70% center"),
      line(visitorRef, "A", "李文", "Nà wǒmen kuài guòqù ba.", "那我们快过去吧。", "Let’s go over quickly then.", "งั้นเรารีบไปกันเถอะ", "30% center"),
    ],
    qte: { after: 3, prompt: { th: "ชายใต้ตึกถืออะไร?", zh: "楼下的人拿着什么？", en: "What is the man downstairs holding?" }, options: [{ value: "黑色的包", zh: "黑色的包", pinyin: "hēisè de bāo", th: "กระเป๋าสีดำ" }, { value: "黑色的本子", zh: "黑色的本子", pinyin: "hēisè de běnzi", th: "สมุดสีดำ" }, { value: "一杯咖啡", zh: "一杯咖啡", pinyin: "yì bēi kāfēi", th: "กาแฟหนึ่งแก้ว" }], correct: "黑色的包", evidence: "手里还拿着一个黑色的包。", evidenceTh: "ในมือถือกระเป๋าสีดำหนึ่งใบ", sourceRef: visitorRef },
    builder: { prompt: { th: "เรียงประโยคบอกการมีอยู่", zh: "重组存现句", en: "Rebuild the existential sentence" }, answer: ["你家楼下", "站着", "一个人"], tiles: ["一个人", "你家楼下", "站着"], gloss: { 你家楼下: "ใต้ตึกบ้านเธอ", 站着: "ยืนอยู่", 一个人: "คนหนึ่ง" }, translationTh: "มีคนหนึ่งยืนอยู่ใต้ตึกบ้านเธอ", translationEn: "Someone is standing downstairs at your building.", evidence: "Text 1 · หน้าเล่ม 122", sourceRef: visitorRef },
  },
  {
    id: "h2l14-friends-reunion", number: "02", glyph: "年", title: "一个人过年多没意思啊", titleTh: "ฉลองตรุษจีนคนเดียวน่าเบื่อมาก", titleEn: "Spending Spring Festival alone is so boring", place: "楼下",
    placePy: "lóuxià", placeTh: "ใต้ตึก", ...art("friends-reunion"),
    imageAlt: { th: "ภาพหวังอี้เฟยแนะนำเพื่อนสองคน", zh: "王一飞介绍朋友的场景", en: "Wang Yifei introducing two friends" }, source: "Text 2 · หน้าเล่ม 124 · PDF หน้า 138", sourcePage: "124", sourceRef: reunionRef,
    context: "杨同乐提前来陪王一飞过年，王一飞把他介绍给李文。", contextTh: "หยางถงเล่อมาเร็วเพื่ออยู่เป็นเพื่อนหวังอี้เฟยช่วงตรุษจีน และหวังอี้เฟยแนะนำเขาให้หลี่เหวินรู้จัก", contextEn: "Yang arrives early for Spring Festival, and Wang Yifei introduces him to Li Wen.",
    characters: [{ role: "A", profile: "teacherWang", noteTh: "เจ้าบ้านผู้แนะนำเพื่อน", noteZh: "介绍朋友的主人", noteEn: "The host making introductions" }, { role: "B", profile: "yang", noteTh: "แฟนที่มาเยี่ยม", noteZh: "来拜访的男朋友", noteEn: "The visiting boyfriend" }, { role: "C", profile: "liWen", noteTh: "เพื่อนบ้าน", noteZh: "住在前面楼的朋友", noteEn: "The nearby friend" }],
    lines: [
      line(reunionRef, "A", "王一飞", "Tónglè, zhēn shì nǐ a! Shàng cì dǎ diànhuà, nǐ shuō yǒu shíjiān guòlai kàn wǒ, méi xiǎngdào zhème kuài jiù lái le!", "同乐，真是你啊！上次打电话，你说有时间过来看我，没想到这么快就来了！", "Tongle, it really is you! You said you’d visit when you had time; I didn’t expect you so soon!", "ถงเล่อ เป็นเธอจริง ๆ ครั้งก่อนเธอบอกทางโทรศัพท์ว่าจะมาหาเมื่อมีเวลา ไม่คิดว่าจะมาเร็วขนาดนี้!", "30% center"),
      line(reunionRef, "B", "杨同乐", "Jiù yào guònián le, nǐ yí ge rén zài zhèr duō méiyìsi a, suǒyǐ wǒ jiù zǎozǎo guòlai le.", "就要过年了，你一个人在这儿多没意思啊，所以我就早早过来了。", "Spring Festival is almost here. It’s no fun for you to be alone, so I came early.", "ใกล้ตรุษจีนแล้ว เธออยู่ที่นี่คนเดียวน่าเบื่อมาก ฉันจึงรีบมาเร็ว", "70% center"),
      line(reunionRef, "A", "王一飞", "Nǐ néng lái, wǒ tài gāoxìng le!", "你能来，我太高兴了！", "I’m so happy you could come!", "ฉันดีใจมากที่เธอมาได้!", "30% center"),
      line(reunionRef, "B", "杨同乐", "Yīfēi, nǐ pángbiān zhè wèi shì?", "一飞，你旁边这位是？", "Yifei, who’s this next to you?", "อี้เฟย คนที่อยู่ข้างเธอท่านนี้คือใคร?", "70% center"),
      line(reunionRef, "A", "王一飞", "Tónglè, zhè shì Lǐ Wén, tā zài wǒmen yīxuéyuàn xué yī. Lǐ Wén, zhè shì wǒ nánpéngyou Yáng Tónglè.", "同乐，这是李文，他在我们医学院学医。李文，这是我男朋友杨同乐。", "Tongle, this is Li Wen. He studies medicine at our school. Li Wen, this is my boyfriend, Yang Tongle.", "ถงเล่อ นี่คือหลี่เหวิน เขาเรียนแพทย์ที่วิทยาลัยของเรา หลี่เหวิน นี่คือหยางถงเล่อ แฟนของฉัน", "30% center"),
      line(reunionRef, "B", "杨同乐", "Lǐ Wén, hěn gāoxìng rènshi nǐ!", "李文，很高兴认识你！", "Li Wen, nice to meet you!", "หลี่เหวิน ยินดีที่ได้รู้จัก!", "70% center"),
      line(reunionRef, "C", "李文", "Rènshi nǐ wǒ yě hěn gāoxìng! Wǒ jiā jiù zài qiánmian nàge lóu, yǒu shíjiān lái wán.", "认识你我也很高兴！我家就在前面那个楼，有时间来玩。", "Nice to meet you too! My home is in that building ahead. Come over when you have time.", "ฉันก็ดีใจที่ได้รู้จัก บ้านฉันอยู่ตึกข้างหน้า มีเวลาก็มาเที่ยวได้", "30% center"),
    ],
    qte: { after: 4, prompt: { th: "หยางถงเล่อมาทำไม?", zh: "杨同乐为什么来找王一飞？", en: "Why did Yang Tongle come?" }, options: [{ value: "陪她过年", zh: "陪她过年", pinyin: "péi tā guònián", th: "อยู่เป็นเพื่อนเธอช่วงตรุษจีน" }, { value: "见她的朋友", zh: "见她的朋友", pinyin: "jiàn tā de péngyou", th: "พบเพื่อนของเธอ" }, { value: "送新年礼物", zh: "送新年礼物", pinyin: "sòng xīnnián lǐwù", th: "มอบของขวัญปีใหม่" }], correct: "陪她过年", evidence: "你一个人在这儿多没意思啊，所以我就早早过来了。", evidenceTh: "เธออยู่คนเดียวน่าเบื่อ เขาจึงรีบมา", sourceRef: reunionRef },
    builder: { prompt: { th: "เรียงประโยคอุทานแสดงระดับสูง", zh: "重组带程度副词“多”的感叹句", en: "Rebuild the exclamation with 多" }, answer: ["你一个人", "在这儿", "多", "没意思", "啊"], tiles: ["没意思", "啊", "在这儿", "多", "你一个人"], gloss: { 你一个人: "เธอคนเดียว", 在这儿: "อยู่ที่นี่", 多: "ช่าง...มาก", 没意思: "น่าเบื่อ", 啊: "จริง ๆ" }, translationTh: "เธออยู่ที่นี่คนเดียวช่างน่าเบื่อมาก", translationEn: "How boring it is for you to be here alone!", evidence: "Text 2 · หน้าเล่ม 124", sourceRef: reunionRef },
  },
  {
    id: "h2l14-apartment-neighbors", number: "03", glyph: "房", title: "楼下住着一家中国人", titleTh: "ชั้นล่างมีครอบครัวชาวจีนอาศัยอยู่", titleEn: "A Chinese family lives downstairs", place: "王一飞家", placeTh: "บ้านหวังอี้เฟย", ...art("apartment-neighbors"),
    imageAlt: { th: "ภาพหวังอี้เฟยกับหยางถงเล่อในห้องรับแขก", zh: "王一飞家客厅场景", en: "Wang Yifei and Yang Tongle in the living room" }, source: "Text 3 · หน้าเล่ม 126 · PDF หน้า 140", sourcePage: "126", sourceRef: apartmentRef,
    context: "王一飞介绍楼下的中国邻居，并说自己常帮他们的孩子学中文。", contextTh: "หวังอี้เฟยเล่าเรื่องเพื่อนบ้านชาวจีนชั้นล่าง และบอกว่าเธอมักช่วยลูกของพวกเขาเรียนภาษาจีน", contextEn: "Wang Yifei describes the Chinese neighbors downstairs and how she helps their child learn Chinese.",
    characters: [{ role: "A", profile: "yang", noteTh: "แขกผู้ถามเรื่องเพื่อนบ้าน", noteZh: "询问邻居的客人", noteEn: "The visitor asking about neighbors" }, { role: "B", profile: "teacherWang", noteTh: "เจ้าบ้านผู้ช่วยสอนภาษาจีน", noteZh: "帮孩子学中文的主人", noteEn: "The host who helps a child learn Chinese" }],
    lines: [
      line(apartmentRef, "A", "杨同乐", "Yīfēi, nǐ zhù de fángzi zhēn búcuò, hěn dà, lí xuéxiào yě bù yuǎn.", "一飞，你住的房子真不错，很大，离学校也不远。", "Yifei, your house is really nice, very big, and not far from school.", "อี้เฟย บ้านที่เธออยู่ดีจริง ๆ ใหญ่มากและไม่ไกลจากโรงเรียน", "30% center"),
      line(apartmentRef, "B", "王一飞", "Shì a! Wǒ lóuxià hái zhùzhe yì jiā Zhōngguórén, tāmen rén hěn hǎo.", "是啊！我楼下还住着一家中国人，他们人很好。", "Yes! There’s a Chinese family living downstairs, and they are very nice.", "ใช่ ชั้นล่างยังมีครอบครัวชาวจีนอาศัยอยู่ พวกเขาใจดีมาก", "70% center"),
      line(apartmentRef, "A", "杨同乐", "Zhèyàng nǐ yǒu shìqing jiù kěyǐ zhǎo tāmen bāngmáng.", "这样你有事情就可以找他们帮忙。", "Then you can ask them for help whenever you need it.", "แบบนี้ถ้ามีเรื่องอะไรก็ขอให้พวกเขาช่วยได้", "30% center"),
      line(apartmentRef, "B", "王一飞", "Duì, wǒ yě bāng tāmen jiā de xiǎoháir xué Zhōngwén.", "对，我也帮他们家的小孩儿学中文。", "Right, and I also help their child learn Chinese.", "ใช่ ฉันก็ช่วยลูกของพวกเขาเรียนภาษาจีน", "70% center"),
      line(apartmentRef, "A", "杨同乐", "Wǒ jìde nǐ gēn wǒ shuōguo, shì ge nǚháir, xué de yě hěn hǎo.", "我记得你跟我说过，是个女孩儿，学得也很好。", "I remember you said the child was a girl, and she learned very well.", "ฉันจำได้ว่าเธอเคยบอกว่าเป็นเด็กผู้หญิง และเรียนได้ดีมาก", "30% center"),
      line(apartmentRef, "B", "王一飞", "Méi cuò, tā jīngcháng pǎo shànglái zhǎo wǒ wán.", "没错，她经常跑上来找我玩。", "Exactly. She often comes running upstairs to play with me.", "ถูกต้อง เธอมักวิ่งขึ้นมาหาฉันเพื่อเล่นด้วย", "70% center"),
      line(apartmentRef, "A", "杨同乐", "Nǐ wènwen tāmen shénme shíhou yǒu shíjiān, wǒ qǐng tāmen chī ge fàn.", "你问问他们什么时候有时间，我请他们吃个饭。", "Ask when they are free, and I’ll treat them to a meal.", "ถามพวกเขาหน่อยว่าว่างเมื่อไร ฉันจะเลี้ยงอาหารสักมื้อ", "30% center"),
    ],
    qte: { after: 4, prompt: { th: "ใครอาศัยอยู่ชั้นล่าง?", zh: "王一飞家楼下住着什么人？", en: "Who lives downstairs from Wang Yifei?" }, options: [{ value: "一家中国人", zh: "一家中国人", pinyin: "yì jiā Zhōngguórén", th: "ครอบครัวชาวจีนหนึ่งครอบครัว" }, { value: "一个老师", zh: "一个老师", pinyin: "yí ge lǎoshī", th: "ครูหนึ่งคน" }, { value: "几个学生", zh: "几个学生", pinyin: "jǐ ge xuésheng", th: "นักเรียนหลายคน" }], correct: "一家中国人", evidence: "我楼下还住着一家中国人。", evidenceTh: "ชั้นล่างมีครอบครัวชาวจีนอาศัยอยู่", sourceRef: apartmentRef },
    builder: { prompt: { th: "เรียงประโยคทิศทางการขึ้นมา", zh: "重组复合趋向补语句", en: "Rebuild the directional-complement sentence" }, answer: ["她", "经常", "跑", "上来", "找我玩"], tiles: ["找我玩", "上来", "经常", "她", "跑"], gloss: { 她: "เธอ", 经常: "บ่อย ๆ", 跑: "วิ่ง", 上来: "ขึ้นมา", 找我玩: "มาหาฉันเล่น" }, translationTh: "เธอมักวิ่งขึ้นมาหาฉันเพื่อเล่นด้วย", translationEn: "She often runs upstairs to play with me.", evidence: "Text 3 · หน้าเล่ม 126", sourceRef: apartmentRef },
  },
];

export const LESSON_HSK2_L14 = {
  id: "hsk2-l14", slug: "lesson-14", level: "hsk2", number: 14, featured: false, sourceRef,
  source: { title: "新HSK教程 2 · New HSK Course 2", lesson: "Lesson 14 · 一个人过年多没意思啊", printedPages: "121–129", pdfPages: "135–143", file: "hsk2.pdf", sourceRef },
  title: { zh: "一个人过年多没意思啊", pinyin: "Yí ge rén guònián duō méiyìsi a", en: "Spending Spring Festival alone is so boring", thAid: "ฉลองตรุษจีนคนเดียวน่าเบื่อมาก" },
  summary: { zh: "朋友见面、介绍邻居并谈春节安排，学习存现句、程度副词“多”和复合趋向补语。", en: "Friends reunite, discuss neighbors and Spring Festival, and study existential sentences, 多, and directional complements.", thAid: "เพื่อนพบกัน แนะนำเพื่อนบ้านและคุยแผนตรุษจีน พร้อมเรียนประโยคบอกการมีอยู่ คำวิเศษณ์ 多 และบทเสริมทิศทาง" },
  translationPolicy: { kind: "editorial-aid", labelTh: "คำแปลไทยเพื่อช่วยเรียน เรียบเรียงจากต้นฉบับ" },
  objectives: [
    { zh: "能听懂并描述某处存在某人或某物。", en: "Be able to understand and describe the presence of a person or object in a certain place.", thAid: "เข้าใจและบรรยายว่ามีบุคคลหรือสิ่งของอยู่ ณ สถานที่หนึ่ง", sourceRef: lessonHsk2L14SourceRef("121", "135") },
    { zh: "能听懂并使用复合趋向补语表达动作的方向。", en: "Be able to understand and use compound directional complements to express the direction of an action.", thAid: "เข้าใจและใช้บทเสริมทิศทางแบบผสมเพื่อบอกทิศทางของการกระทำ", sourceRef: lessonHsk2L14SourceRef("121", "135") },
    { zh: "掌握程度副词“多”的用法，能表达程度很高的意思。", en: "Master the degree adverb 多 to express a high degree.", thAid: "ใช้คำวิเศษณ์บอกระดับ 多 เพื่อสื่อว่ามีระดับสูงมาก", sourceRef: lessonHsk2L14SourceRef("121", "135") },
  ],
  contents: [
    { number: "00", title: "目标与热身", titleTh: "เป้าหมายและการเตรียมบท", detail: "Objectives · Warm-Up", pages: "121", route: "/home/hsk2/lesson-14/preface/", sourceRef: lessonHsk2L14SourceRef("121", "135") },
    { number: "01", title: "你家楼下站着一个人", titleTh: "มีคนยืนอยู่ใต้ตึกบ้านเธอ", detail: "Text 1 · Existential Sentences", pages: "122–123", scene: 1, sourceRef: lessonHsk2L14SourceRef("122-123", "136-137") },
    { number: "02", title: "一个人过年多没意思啊", titleTh: "ฉลองตรุษจีนคนเดียวน่าเบื่อมาก", detail: "Text 2 · Adverb 多", pages: "124–125", scene: 2, sourceRef: lessonHsk2L14SourceRef("124-125", "138-139") },
    { number: "03", title: "楼下住着一家中国人", titleTh: "ชั้นล่างมีครอบครัวชาวจีนอยู่", detail: "Text 3 · Directional Complements", pages: "126–127", scene: 3, sourceRef: lessonHsk2L14SourceRef("126-127", "140-141") },
    { number: "04", title: "日记与综合练习", titleTh: "บันทึกและแบบฝึกรวม", detail: "Text 4 · Exercises", pages: "128–129", sourceRef: lessonHsk2L14SourceRef("128-129", "142-143") },
  ],
  vocabulary,
  grammarFocus: [
    { title: "存现句（2）", titleEn: "Existential Sentences (2)", explanationZh: "动态助词“着”用在动词后构成存现句，结构是“处所+动词+着+人/事物”。", explanationEn: "着 after a verb forms an existential sentence: location + verb + 着 + person/thing.", thAid: "ใช้ 着 หลังคำกริยาในโครงสร้าง สถานที่ + กริยา + 着 + คน/สิ่งของ เพื่อบอกการมีอยู่", examples: ["你家楼下站着一个人。", "爸爸手里拿着一杯咖啡。", "那间教室里坐着不少学生。"], sourceRef: lessonHsk2L14SourceRef("123", "137") },
    { title: "程度副词“多”", titleEn: "Adverb of Degree 多", explanationZh: "“多”用在感叹句中，表示程度很高。", explanationEn: "多 is used in exclamatory sentences to express a high degree.", thAid: "ใช้ 多 ในประโยคอุทานเพื่อเน้นระดับที่สูงมาก", examples: ["你一个人在这儿多没意思啊！", "我们一起去多好啊！", "多好看啊！"], sourceRef: lessonHsk2L14SourceRef("125", "139") },
    { title: "复合趋向补语", titleEn: "Compound Complements of Direction", explanationZh: "“上、下、进、出、回、过”加“来/去”以及“起来”用在动词后，表示动作方向。", explanationEn: "上, 下, 进, 出, 回, or 过 plus 来/去, as well as 起来, follows a verb to indicate direction.", thAid: "นำ 上、下、进、出、回、过 รวมกับ 来/去 หรือใช้ 起来 หลังคำกริยาเพื่อบอกทิศทาง", examples: ["她经常跑上来找我玩。", "我们走上去吧。", "同学们都走出教室去了。"], sourceRef: lessonHsk2L14SourceRef("127", "141") },
  ],
  characters,
  scenes,
};
