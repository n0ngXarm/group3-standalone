import { group3AssetPath } from "../../../../config.js";

const SOURCE_FILE = "docs/references/hsk/sources/hsk2.pdf";
export const lessonHsk2L7SourceRef = (printedPages, pdfPages) => `${SOURCE_FILE}#printed-pages=${printedPages}&pdf-pages=${pdfPages}`;
const sourceRef = lessonHsk2L7SourceRef("56-63", "70-77");
const art = (scene) => ({
  image: group3AssetPath(`/assets/group3/lesson-hsk2-l7-${scene}-v1.webp`),
  imageSrcSet: `${group3AssetPath(`/assets/group3/lesson-hsk2-l7-${scene}-720w-v1.webp`)} 720w, ${group3AssetPath(`/assets/group3/lesson-hsk2-l7-${scene}-v1.webp`)} 1400w`,
});
const characters = {
  annie: { hanzi: "安妮", pinyin: "Ānnī", nameTh: "แอนนี่", nameEn: "Annie", ...art("basketball"), imageFocus: "30% center" },
  chen: { hanzi: "陈天中", pinyin: "Chén Tiānzhōng", nameTh: "เฉินเทียนจง", nameEn: "Chen Tianzhong", ...art("football"), imageFocus: "70% center" },
};
const vocabularyPages = [
  [1, "从", "cóng", "prep.", "from", "จาก / ตั้งแต่", 57, 71],
  [2, "往", "wǎng", "prep./v.", "towards; go", "ไปทาง / มุ่งไป", 57, 71],
  [3, "跑", "pǎo", "v.", "run; rush", "วิ่ง / รีบไป", 57, 71],
  [4, "打", "dǎ", "v.", "play (a ball game); hit", "เล่น (กีฬา) / ตี", 57, 71],
  [5, "篮球", "lánqiú", "n.", "basketball", "บาสเกตบอล", 57, 71],
  [6, "运动", "yùndòng", "n./v.", "sports; exercise", "กีฬา / ออกกำลังกาย", 59, 73],
  [7, "踢", "tī", "v.", "kick", "เตะ", 59, 73],
  [8, "足球", "zúqiú", "n.", "football; soccer", "ฟุตบอล", 59, 73],
  [9, "球", "qiú", "n.", "ball", "ลูกบอล", 59, 73],
  [10, "得", "de", "part.", "particle before a complement of state", "คำช่วยหน้าบทเสริมบอกสภาพ", 59, 73],
  [11, "跑步", "pǎobù", "v.", "run; jog", "วิ่งออกกำลังกาย", 61, 75],
  [12, "游泳", "yóuyǒng", "v.", "swim", "ว่ายน้ำ", 61, 75],
  [13, "爱好", "àihào", "n./v.", "hobby; be fond of", "งานอดิเรก / ชื่นชอบ", 62, 76],
  [14, "开始", "kāishǐ", "v./n.", "start; beginning", "เริ่ม / จุดเริ่มต้น", 62, 76],
  [15, "回来", "huílái", "v.", "come back", "กลับมา", 57, 71],
  [16, "下课", "xiàkè", "v.", "finish class", "เลิกเรียน", 57, 71],
  [17, "一起", "yìqǐ", "adv.", "together", "ด้วยกัน", 57, 71],
  [18, "喜欢", "xǐhuan", "v.", "like; enjoy", "ชอบ", 59, 73],
  [19, "不错", "búcuò", "adj.", "not bad; quite good", "ไม่เลว / ดีทีเดียว", 59, 73],
  [20, "快", "kuài", "adj.", "fast", "เร็ว", 61, 75],
];
const vocabulary = vocabularyPages.map(([index, hanzi, pinyin, type, en, thAid, page, pdfPage]) => ({
  index, hanzi, pinyin, type, en, th: thAid, thAid, page, translationKind: "editorial-aid", sourceRef: lessonHsk2L7SourceRef(String(page), String(pdfPage)),
}));
const line = (ref, role, speaker, pinyin, hanzi, en, th, focus) => ({ role, speaker, pinyin, reading: pinyin, hanzi, en, th, visual: { zh: hanzi, th, focus }, sourceRef: ref });
const basketballRef = lessonHsk2L7SourceRef("57", "71");
const footballRef = lessonHsk2L7SourceRef("59", "73");
const swimmingRef = lessonHsk2L7SourceRef("61", "75");

const scenes = [
  {
    id: "h2l7-basketball", number: "01", glyph: "篮", title: "一下课就去打篮球", titleTh: "เลิกเรียนแล้วไปเล่นบาสทันที", titleEn: "Basketball right after class", place: "教室",
    placePy: "jiàoshì", placeTh: "ห้องเรียน", ...art("basketball"),
    imageAlt: { th: "แอนนี่กับเฉินเทียนจงคุยกันเรื่องไปเล่นบาสเกตบอล", zh: "安妮和陈天中谈打篮球场景", en: "Annie and Chen Tianzhong discussing basketball" }, source: "Text 1 · หน้าเล่ม 57 · PDF หน้า 71", sourcePage: "57", sourceRef: basketballRef,
    context: "在教室，安妮和陈天中聊天儿，下课后一起去打篮球。", contextTh: "ในห้องเรียน แอนนี่คุยกับเฉินเทียนจง แล้วตกลงไปเล่นบาสเกตบอลหลังเลิกเรียน", contextEn: "In the classroom, Annie and Chen Tianzhong chat and agree to play basketball after class.",
    characters: [
      { role: "A", profile: "chen", noteTh: "นักเรียนที่นัดเพื่อนไปเล่นบาส", noteZh: "约同学打篮球的学生", noteEn: "The student meeting classmates for basketball" },
      { role: "B", profile: "annie", noteTh: "เพื่อนที่ขอไปเล่นด้วย", noteZh: "想一起去玩的朋友", noteEn: "The friend asking to join" },
    ],
    lines: [
      line(basketballRef, "A", "陈天中", "Ānnī, nǐ shì shénme shíhou cóng Běijīng huílái de?", "安妮，你是什么时候从北京回来的？", "Annie, when did you come back from Beijing?", "แอนนี่ เธอกลับมาจากปักกิ่งเมื่อไร?", "70% center"),
      line(basketballRef, "B", "安妮", "Zuótiān xiàwǔ. Tiānzhōng, nǐ zěnme yí xiàkè jiù wǎng wài pǎo?", "昨天下午。天中，你怎么一下课就往外跑？", "Yesterday afternoon. Tianzhong, why do you rush outside as soon as class ends?", "เมื่อวานช่วงบ่าย เทียนจง ทำไมพอเลิกเรียนก็รีบวิ่งออกไปข้างนอก?", "30% center"),
      line(basketballRef, "A", "陈天中", "Wǒ gēn tóngxué shuō hǎo le, yìqǐ qù dǎ lánqiú.", "我跟同学说好了，一起去打篮球。", "I arranged with my classmates to play basketball together.", "ฉันนัดกับเพื่อนร่วมชั้นไว้แล้วว่าจะไปเล่นบาสเกตบอลด้วยกัน", "70% center"),
      line(basketballRef, "B", "安妮", "Wǒ yě xiǎng gēn nǐmen yìqǐ wán.", "我也想跟你们一起玩。", "I want to join you too.", "ฉันก็อยากไปเล่นกับพวกเธอด้วย", "30% center"),
      line(basketballRef, "A", "陈天中", "Méi wèntí, zǒu ba!", "没问题，走吧！", "No problem. Let’s go!", "ไม่มีปัญหา ไปกันเถอะ!", "70% center"),
    ],
    qte: { after: 3, prompt: { th: "เฉินเทียนจงรีบออกไปทำอะไรหลังเลิกเรียน?", zh: "陈天中一下课就去做什么？", en: "What does Chen Tianzhong do as soon as class ends?" }, options: [{ value: "打篮球", zh: "打篮球", pinyin: "dǎ lánqiú", th: "เล่นบาสเกตบอล" }, { value: "去游泳", zh: "去游泳", pinyin: "qù yóuyǒng", th: "ไปว่ายน้ำ" }, { value: "回家", zh: "回家", pinyin: "huí jiā", th: "กลับบ้าน" }], correct: "打篮球", evidence: "一起去打篮球。", evidenceTh: "ไปเล่นบาสเกตบอลด้วยกัน", sourceRef: basketballRef },
    builder: { prompt: { th: "เรียงประโยคบอกว่าพอเลิกเรียนก็รีบออกไป", zh: "重组一下课就往外跑的句子", en: "Rebuild the as-soon-as sentence" }, answer: ["你", "怎么", "一下课", "就", "往外跑"], tiles: ["就", "往外跑", "你", "一下课", "怎么"], gloss: { 你: "เธอ", 怎么: "ทำไม", 一下课: "พอเลิกเรียน", 就: "ก็...ทันที", 往外跑: "วิ่งออกไปข้างนอก" }, translationTh: "ทำไมพอเลิกเรียนเธอก็วิ่งออกไปข้างนอกทันที", translationEn: "Why do you rush outside as soon as class ends?", evidence: "Text 1 · หน้าเล่ม 57", sourceRef: basketballRef },
  },
  {
    id: "h2l7-football", number: "02", glyph: "足", title: "喜欢踢足球", titleTh: "ชอบเล่นฟุตบอล", titleEn: "Enjoying football", place: "校园",
    placePy: "xiàoyuán", placeTh: "ในมหาวิทยาลัย", ...art("football"),
    imageAlt: { th: "แอนนี่กับเฉินเทียนจงคุยเรื่องกีฬาระหว่างเดิน", zh: "校园足球对话场景", en: "Campus conversation about football" }, source: "Text 2 · หน้าเล่ม 59 · PDF หน้า 73", sourcePage: "59", sourceRef: footballRef,
    context: "在校园，安妮问陈天中喜欢哪些运动，也问他足球踢得怎么样。", contextTh: "ในมหาวิทยาลัย แอนนี่ถามเฉินเทียนจงว่าชอบกีฬาอะไรและเล่นฟุตบอลได้ดีแค่ไหน", contextEn: "On campus, Annie asks which sports Chen enjoys and how well he plays football.",
    characters: [{ role: "A", profile: "annie", noteTh: "เพื่อนที่ถามเรื่องกีฬา", noteZh: "询问运动爱好的朋友", noteEn: "The friend asking about sports" }, { role: "B", profile: "chen", noteTh: "นักเรียนที่ชอบบาสและฟุตบอล", noteZh: "喜欢篮球和足球的学生", noteEn: "The student who enjoys basketball and football" }],
    lines: [
      line(footballRef, "A", "安妮", "Tiānzhōng, nǐ shì bu shì hěn xǐhuan dǎ lánqiú?", "天中，你是不是很喜欢打篮球？", "Tianzhong, do you really like playing basketball?", "เทียนจง เธอชอบเล่นบาสเกตบอลมากใช่ไหม?", "30% center"),
      line(footballRef, "B", "陈天中", "Méi cuò.", "没错。", "That’s right.", "ถูกต้อง", "70% center"),
      line(footballRef, "A", "安妮", "Nǐ hái xǐhuan shénme yùndòng?", "你还喜欢什么运动？", "What other sports do you like?", "เธอยังชอบกีฬาอะไรอีก?", "30% center"),
      line(footballRef, "B", "陈天中", "Wǒ hái xǐhuan tī zúqiú, yí dào Xīngqītiān jiù gēn péngyoumen qù tī qiú.", "我还喜欢踢足球，一到星期天就跟朋友们去踢球。", "I also like football. Every Sunday I go play with my friends.", "ฉันยังชอบเล่นฟุตบอล พอถึงวันอาทิตย์ก็ไปเตะบอลกับเพื่อน ๆ", "70% center"),
      line(footballRef, "A", "安妮", "Nǐ tī de zěnmeyàng?", "你踢得怎么样？", "How well do you play?", "เธอเล่นได้เป็นอย่างไร?", "30% center"),
      line(footballRef, "B", "陈天中", "Wǒ tī de hái kěyǐ.", "我踢得还可以。", "I play fairly well.", "ฉันเล่นได้พอใช้", "70% center"),
    ],
    qte: { after: 4, prompt: { th: "เฉินเทียนจงไปเล่นฟุตบอลเมื่อไร?", zh: "陈天中什么时候去踢足球？", en: "When does Chen Tianzhong play football?" }, options: [{ value: "星期天", zh: "星期天", pinyin: "Xīngqītiān", th: "วันอาทิตย์" }, { value: "星期一", zh: "星期一", pinyin: "Xīngqīyī", th: "วันจันทร์" }, { value: "每天早上", zh: "每天早上", pinyin: "měitiān zǎoshang", th: "ทุกเช้า" }], correct: "星期天", evidence: "一到星期天就跟朋友们去踢球。", evidenceTh: "พอถึงวันอาทิตย์ก็ไปเตะบอลกับเพื่อน", sourceRef: footballRef },
    builder: { prompt: { th: "เรียงประโยคถามระดับการเล่นฟุตบอล", zh: "重组询问足球水平的句子", en: "Rebuild the question about football ability" }, answer: ["你", "踢", "得", "怎么样"], tiles: ["怎么样", "得", "你", "踢"], gloss: { 你: "เธอ", 踢: "เตะ / เล่นฟุตบอล", 得: "คำช่วยบทเสริม", 怎么样: "เป็นอย่างไร" }, translationTh: "เธอเล่นฟุตบอลได้เป็นอย่างไร", translationEn: "How well do you play?", evidence: "Text 2 · หน้าเล่ม 59", sourceRef: footballRef },
  },
  {
    id: "h2l7-swimming", number: "03", glyph: "泳", title: "跑步和游泳", titleTh: "วิ่งและว่ายน้ำ", titleEn: "Running and swimming", place: "校园",
    placePy: "xiàoyuán", placeTh: "ในมหาวิทยาลัย", ...art("swimming"),
    imageAlt: { th: "นักเรียนคุยกันเรื่องทักษะการวิ่งและว่ายน้ำ", zh: "跑步和游泳对话场景", en: "Conversation about running and swimming" }, source: "Text 3 · หน้าเล่ม 61 · PDF หน้า 75", sourcePage: "61", sourceRef: swimmingRef,
    context: "陈天中问安妮篮球、跑步和游泳做得怎么样。", contextTh: "เฉินเทียนจงถามแอนนี่ว่าเล่นบาส วิ่ง และว่ายน้ำได้เป็นอย่างไร", contextEn: "Chen asks Annie how well she plays basketball, runs, and swims.",
    characters: [{ role: "A", profile: "chen", noteTh: "เพื่อนที่ถามทักษะกีฬา", noteZh: "询问运动水平的朋友", noteEn: "The friend asking about sports ability" }, { role: "B", profile: "annie", noteTh: "นักเรียนที่บอกระดับของตน", noteZh: "说明自己运动水平的学生", noteEn: "The student describing her ability" }],
    lines: [
      line(swimmingRef, "A", "陈天中", "Nǐ lánqiú dǎ de zěnmeyàng?", "你篮球打得怎么样？", "How are your basketball skills?", "เธอเล่นบาสเกตบอลได้เป็นอย่างไร?", "70% center"),
      line(swimmingRef, "B", "安妮", "Dǎ de hái kěyǐ.", "打得还可以。", "Not bad.", "เล่นได้พอใช้", "30% center"),
      line(swimmingRef, "A", "陈天中", "Pǎobù ne? Nǐ pǎo de kuài bu kuài?", "跑步呢？你跑得快不快？", "What about running? Do you run fast?", "แล้วการวิ่งล่ะ เธอวิ่งเร็วไหม?", "70% center"),
      line(swimmingRef, "B", "安妮", "Wǒ pǎo de bú kuài, yě bú tài xǐhuan pǎobù.", "我跑得不快，也不太喜欢跑步。", "I do not run fast and do not really like running.", "ฉันวิ่งไม่เร็ว และไม่ค่อยชอบวิ่งด้วย", "30% center"),
      line(swimmingRef, "A", "陈天中", "Nà nǐ xǐhuan yóuyǒng ma?", "那你喜欢游泳吗？", "Then do you like swimming?", "แล้วเธอชอบว่ายน้ำไหม?", "70% center"),
      line(swimmingRef, "B", "安妮", "Xǐhuan, dàn wǒ yóuyǒng yóu de bú kuài.", "喜欢，但我游泳游得不快。", "Yes, but I do not swim very fast.", "ชอบ แต่ฉันว่ายน้ำได้ไม่เร็ว", "30% center"),
    ],
    qte: { after: 4, prompt: { th: "แอนนี่วิ่งได้เร็วไหม?", zh: "安妮跑得快吗？", en: "Does Annie run fast?" }, options: [{ value: "不快", zh: "不快", pinyin: "bú kuài", th: "ไม่เร็ว" }, { value: "很快", zh: "很快", pinyin: "hěn kuài", th: "เร็วมาก" }, { value: "不知道", zh: "不知道", pinyin: "bù zhīdào", th: "ไม่ทราบ" }], correct: "不快", evidence: "我跑得不快。", evidenceTh: "ฉันวิ่งไม่เร็ว", sourceRef: swimmingRef },
    builder: { prompt: { th: "เรียงประโยคบอกทักษะว่ายน้ำ", zh: "重组带状态补语的游泳句", en: "Rebuild the swimming sentence with a complement" }, answer: ["我", "游泳", "游", "得", "不快"], tiles: ["得", "我", "不快", "游", "游泳"], gloss: { 我: "ฉัน", 游泳: "ว่ายน้ำ", 游: "ว่าย", 得: "คำช่วยบทเสริม", 不快: "ไม่เร็ว" }, translationTh: "ฉันว่ายน้ำได้ไม่เร็ว", translationEn: "I do not swim very fast.", evidence: "Text 3 · หน้าเล่ม 61", sourceRef: swimmingRef },
  },
];

export const LESSON_HSK2_L7 = {
  id: "hsk2-l7", slug: "lesson-7", level: "hsk2", number: 7, featured: false, sourceRef,
  source: { title: "新HSK教程 2 · New HSK Course 2", lesson: "Lesson 7 · 他篮球打得很好", printedPages: "56–63", pdfPages: "70–77", file: "hsk2.pdf", sourceRef },
  title: { zh: "他篮球打得很好", pinyin: "Tā lánqiú dǎ de hěn hǎo", en: "He plays basketball very well", thAid: "เขาเล่นบาสเกตบอลได้ดีมาก" },
  summary: { zh: "安妮和陈天中谈论篮球、足球、跑步和游泳，学习“一……就……”和状态补语。", en: "Annie and Chen discuss basketball, football, running, and swimming while learning 一…就… and complements of state.", thAid: "แอนนี่กับเฉินเทียนจงคุยเรื่องกีฬา พร้อมฝึก 一…就… และบทเสริมบอกสภาพ" },
  translationPolicy: { kind: "editorial-aid", labelTh: "คำแปลไทยเพื่อช่วยเรียน เรียบเรียงจากต้นฉบับ" },
  objectives: [
    { zh: "能听懂并描述动作进行的状态。", en: "Understand and describe the state of an action.", thAid: "เข้าใจและบรรยายลักษณะของการกระทำ", sourceRef: lessonHsk2L7SourceRef("56", "70") },
    { zh: "掌握紧缩复句“一……就……”的用法，能表达动作接连发生的意思。", en: "Master the contracted complex sentence 一……就…… to express actions occurring in succession.", thAid: "ใช้โครงสร้าง 一……就…… เพื่อบอกว่าการกระทำเกิดต่อเนื่องกัน", sourceRef: lessonHsk2L7SourceRef("56", "70") },
    { zh: "能谈论常做的运动。", en: "Talk about regular physical activities.", thAid: "สนทนาเกี่ยวกับกีฬาที่ทำเป็นประจำ", sourceRef: lessonHsk2L7SourceRef("56", "70") },
  ],
  contents: [
    { number: "00", title: "目标与热身", titleTh: "เป้าหมายและการเตรียมบท", detail: "Objectives · Warm-Up", pages: "56", route: "/home/hsk2/lesson-7/preface/", sourceRef: lessonHsk2L7SourceRef("56", "70") },
    { number: "01", title: "一下课就去打篮球", titleTh: "เลิกเรียนแล้วไปเล่นบาสทันที", detail: "Text 1 · New Words 1–5", pages: "57–58", scene: 1, sourceRef: lessonHsk2L7SourceRef("57-58", "71-72") },
    { number: "02", title: "喜欢踢足球", titleTh: "ชอบเล่นฟุตบอล", detail: "Text 2 · New Words 6–10", pages: "58–60", scene: 2, sourceRef: lessonHsk2L7SourceRef("58-60", "72-74") },
    { number: "03", title: "跑步和游泳", titleTh: "วิ่งและว่ายน้ำ", detail: "Text 3 · New Words 11–12", pages: "60–61", scene: 3, sourceRef: lessonHsk2L7SourceRef("60-61", "74-75") },
    { number: "04", title: "日记与综合练习", titleTh: "บันทึกและแบบฝึกรวม", detail: "Text 4 · Exercises", pages: "62–63", sourceRef: lessonHsk2L7SourceRef("62-63", "76-77") },
  ],
  vocabulary,
  grammarFocus: [
    { title: "紧缩复句“一……就……”", titleEn: "Contracted Complex Sentence 一…就…", explanationZh: "“一……就……”表示后一动作紧跟前一动作发生，前一动作也可以是后一动作的条件或原因。", explanationEn: "一…就… indicates that the second action follows the first immediately, or that the first is the condition for the second.", thAid: "一…就… บอกว่าเหตุการณ์ที่สองเกิดตามเหตุการณ์แรกทันที หรือเหตุการณ์แรกเป็นเงื่อนไข", examples: ["你怎么一下课就往外跑？", "一到星期天就跟朋友们去踢球。", "我一有时间就去运动。"], sourceRef: lessonHsk2L7SourceRef("58", "72") },
    { title: "状态补语（1）", titleEn: "Complement of State (1)", explanationZh: "状态补语放在动词后说明动作状态，基本结构是“动词+得+形容词性短语”，否定词“不”放在形容词前。", explanationEn: "A complement of state follows a verb in the pattern verb + 得 + adjectival phrase; 不 negates the adjective.", thAid: "บทเสริมบอกสภาพใช้รูป กริยา + 得 + วลีคุณศัพท์ และวาง 不 หน้าคำคุณศัพท์เมื่อต้องการปฏิเสธ", examples: ["我踢得还可以。", "他们玩得很高兴。", "白家月跑得不快。"], sourceRef: lessonHsk2L7SourceRef("59-60", "73-74") },
    { title: "状态补语（2）", titleEn: "Complement of State (2)", explanationZh: "动词带宾语时，可以把宾语提前或重复动词；离合词需要重复动词性语素。", explanationEn: "When a verb has an object, move the object forward or repeat the verb; separable verbs repeat their verbal element.", thAid: "เมื่อกริยามีกรรม ให้ย้ายกรรมมาข้างหน้าหรือซ้ำกริยา และคำกริยาแยกส่วนต้องซ้ำส่วนกริยา", examples: ["我游泳游得不快。", "你篮球打得怎么样？", "白家月写汉字写得很好看。"], sourceRef: lessonHsk2L7SourceRef("61", "75") },
  ],
  characters,
  scenes,
};
