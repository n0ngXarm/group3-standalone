import { group3AssetPath } from "../../../../config.js";

const SOURCE_FILE = "docs/references/hsk/sources/hsk2.pdf";
export const lessonHsk2L10SourceRef = (printedPages, pdfPages) => `${SOURCE_FILE}#printed-pages=${printedPages}&pdf-pages=${pdfPages}`;
const sourceRef = lessonHsk2L10SourceRef("84-92", "98-106");
const art = (scene) => ({ image: group3AssetPath(`/assets/group3/lesson-hsk2-l10-${scene}-v1.webp`), imageSrcSet: `${group3AssetPath(`/assets/group3/lesson-hsk2-l10-${scene}-720w-v1.webp`)} 720w, ${group3AssetPath(`/assets/group3/lesson-hsk2-l10-${scene}-v1.webp`)} 1400w` });
const characters = {
  liu: { hanzi: "刘明", pinyin: "Liú Míng", nameTh: "หลิวหมิง", nameEn: "Liu Ming", ...art("school-prep"), imageFocus: "68% center" },
  liuXiaoming: { hanzi: "刘小明", pinyin: "Liú Xiǎomíng", nameTh: "หลิวเสี่ยวหมิง", nameEn: "Liu Xiaoming", ...art("school-prep"), imageFocus: "32% center" },
  wang: { hanzi: "王一雪", pinyin: "Wáng Yīxuě", nameTh: "หวังอี้เสวี่ย", nameEn: "Wang Yixue", ...art("exam-review"), imageFocus: "32% center" },
  liuXiaoxue: { hanzi: "刘小雪", pinyin: "Liú Xiǎoxuě", nameTh: "หลิวเสี่ยวเสวี่ย", nameEn: "Liu Xiaoxue", ...art("homecoming"), imageFocus: "70% center" },
};
const vocabularyPages = [
  [1, "开学", "kāixué", "v.", "school begins", "เปิดภาคเรียน", 85, 99], [2, "门", "mén", "n.", "door", "ประตู", 85, 99], [3, "后面", "hòumian", "n.", "behind; back", "ด้านหลัง", 85, 99], [4, "笔", "bǐ", "n.", "pen; pencil", "ปากกา / ดินสอ", 85, 99], [5, "帮", "bāng", "v.", "help", "ช่วย", 85, 99],
  [6, "考试", "kǎoshì", "v./n.", "take an exam; examination", "สอบ / การสอบ", 87, 101], [7, "词", "cí", "n.", "word", "คำศัพท์", 87, 101], [8, "本子", "běnzi", "n.", "notebook", "สมุด", 87, 101], [9, "错", "cuò", "adj.", "wrong; mistaken", "ผิด", 87, 101], [10, "题", "tí", "n.", "question; problem", "โจทย์ / คำถาม", 87, 101], [11, "还是", "háishi", "conj.", "or (in a question)", "หรือ (ในคำถาม)", 87, 101],
  [12, "考", "kǎo", "v.", "take an examination", "เข้าสอบ", 89, 103], [13, "快要", "kuàiyào", "adv.", "be about to", "ใกล้จะ", 89, 103], [14, "书包", "shūbāo", "n.", "schoolbag", "กระเป๋านักเรียน", 85, 99], [15, "准备", "zhǔnbèi", "v.", "prepare", "เตรียม", 85, 99], [16, "自己", "zìjǐ", "pron.", "oneself", "ตนเอง", 85, 99], [17, "意思", "yìsi", "n.", "meaning", "ความหมาย", 87, 101], [18, "懂", "dǒng", "v.", "understand", "เข้าใจ", 87, 101], [19, "上次", "shàng cì", "n.", "last time", "ครั้งที่แล้ว", 89, 103], [20, "洗手", "xǐshǒu", "v.", "wash one’s hands", "ล้างมือ", 89, 103],
];
const vocabulary = vocabularyPages.map(([index, hanzi, pinyin, type, en, thAid, page, pdfPage]) => ({ index, hanzi, pinyin, type, en, th: thAid, thAid, page, translationKind: "editorial-aid", sourceRef: lessonHsk2L10SourceRef(String(page), String(pdfPage)) }));
const line = (ref, role, speaker, pinyin, hanzi, en, th, focus) => ({ role, speaker, pinyin, reading: pinyin, hanzi, en, th, visual: { zh: hanzi, th, focus }, sourceRef: ref });
const prepRef = lessonHsk2L10SourceRef("85", "99");
const reviewRef = lessonHsk2L10SourceRef("87", "101");
const homeRef = lessonHsk2L10SourceRef("89", "103");
const scenes = [
  {
    id: "h2l10-school-prep", number: "01", glyph: "学", title: "明天就开学", titleTh: "พรุ่งนี้ก็เปิดเทอมแล้ว", titleEn: "School starts tomorrow", place: "刘小明的房间", placeTh: "ห้องของหลิวเสี่ยวหมิง", ...art("school-prep"),
    imageAlt: { th: "หลิวหมิงช่วยลูกชายเตรียมของเปิดเทอม", zh: "父子准备开学用品场景", en: "Father and son preparing school items" }, source: "Text 1 · หน้าเล่ม 85 · PDF หน้า 99", sourcePage: "85", sourceRef: prepRef,
    context: "在房间，刘明帮刘小明找书包、书和笔，准备明天开学。", contextTh: "ในห้อง หลิวหมิงช่วยหลิวเสี่ยวหมิงหากระเป๋า หนังสือ และปากกาเพื่อเตรียมเปิดเทอมวันพรุ่งนี้", contextEn: "In the room, Liu Ming helps Xiaoming find his schoolbag, books, and pens for school tomorrow.",
    characters: [{ role: "A", profile: "liu", noteTh: "พ่อที่ช่วยเตรียมของ", noteZh: "帮儿子准备东西的爸爸", noteEn: "The father helping prepare" }, { role: "B", profile: "liuXiaoming", noteTh: "ลูกชายที่กำลังหาของ", noteZh: "寻找学习用品的儿子", noteEn: "The son looking for school items" }],
    lines: [
      line(prepRef, "A", "刘明", "Xiǎomíng, nǐmen míngtiān kāixué, nǐ zhǔnbèi hǎo le ma?", "小明，你们明天开学，你准备好了吗？", "Xiaoming, school starts tomorrow. Are you ready?", "เสี่ยวหมิง พรุ่งนี้โรงเรียนเปิด ลูกเตรียมพร้อมแล้วหรือยัง?", "68% center"),
      line(prepRef, "B", "刘小明", "Míngtiān jiù kāixué a? Bàba, wǒ de shūbāo nǐ kànjiàn le ma?", "明天就开学啊？爸爸，我的书包你看见了吗？", "School starts tomorrow? Dad, have you seen my schoolbag?", "พรุ่งนี้ก็เปิดเทอมแล้วหรือ? พ่อเห็นกระเป๋านักเรียนของผมไหม?", "32% center"),
      line(prepRef, "A", "刘明", "Shūbāo zài mén hòumian.", "书包在门后面。", "The schoolbag is behind the door.", "กระเป๋าอยู่หลังประตู", "68% center"),
      line(prepRef, "B", "刘小明", "Shū zài nǎr ne? Bǐ ne?", "书在哪儿呢？笔呢？", "Where are the books? And the pens?", "หนังสืออยู่ไหน แล้วปากกาล่ะ?", "32% center"),
      line(prepRef, "A", "刘明", "Shū zài chuáng shàng, bǐ zài zhuōzi shàng.", "书在床上，笔在桌子上。", "The books are on the bed and the pens are on the table.", "หนังสืออยู่บนเตียง ปากกาอยู่บนโต๊ะ", "68% center"),
      line(prepRef, "B", "刘小明", "Tài hǎo le! Xiànzài dōu zhǔnbèi hǎo le.", "太好了！现在都准备好了。", "Great! Everything is ready now.", "ดีจัง ตอนนี้เตรียมพร้อมหมดแล้ว", "32% center"),
      line(prepRef, "A", "刘明", "Zhè cì bàba bāng nǐ, xià cì nǐ zìjǐ zhǔnbèi, hǎo bu hǎo?", "这次爸爸帮你，下次你自己准备，好不好？", "Dad helped you this time; next time prepare by yourself, okay?", "ครั้งนี้พ่อช่วย ครั้งหน้าลูกเตรียมเอง ดีไหม?", "68% center"),
      line(prepRef, "B", "刘小明", "Hǎo!", "好！", "Okay!", "ได้ครับ!", "32% center"),
    ],
    qte: { after: 4, prompt: { th: "กระเป๋านักเรียนอยู่ที่ไหน?", zh: "书包在哪儿？", en: "Where is the schoolbag?" }, options: [{ value: "门后面", zh: "门后面", pinyin: "mén hòumian", th: "หลังประตู" }, { value: "床上", zh: "床上", pinyin: "chuáng shàng", th: "บนเตียง" }, { value: "桌子上", zh: "桌子上", pinyin: "zhuōzi shàng", th: "บนโต๊ะ" }], correct: "门后面", evidence: "书包在门后面。", evidenceTh: "กระเป๋าอยู่หลังประตู", sourceRef: prepRef },
    builder: { prompt: { th: "เรียงประโยคถามถึงกระเป๋า", zh: "重组主谓谓语句", en: "Rebuild the subject-predicate-predicate sentence" }, answer: ["我的书包", "你", "看见", "了吗"], tiles: ["看见", "我的书包", "了吗", "你"], gloss: { 我的书包: "กระเป๋าของฉัน", 你: "คุณ", 看见: "เห็น", 了吗: "แล้วหรือยัง" }, translationTh: "คุณเห็นกระเป๋านักเรียนของฉันแล้วหรือยัง", translationEn: "Have you seen my schoolbag?", evidence: "Text 1 · หน้าเล่ม 85", sourceRef: prepRef },
  },
  {
    id: "h2l10-exam-review", number: "02", glyph: "考", title: "准备明天的考试", titleTh: "เตรียมสอบวันพรุ่งนี้", titleEn: "Preparing for tomorrow’s exam", place: "刘小雪的房间", placeTh: "ห้องของหลิวเสี่ยวเสวี่ย", ...art("exam-review"),
    imageAlt: { th: "หวังอี้เสวี่ยช่วยลูกสาวทบทวนสอบ", zh: "母女复习考试场景", en: "Mother and daughter reviewing for an exam" }, source: "Text 2 · หน้าเล่ม 87 · PDF หน้า 101", sourcePage: "87", sourceRef: reviewRef,
    context: "王一雪提醒刘小雪复习词语和本子上做错的题。", contextTh: "หวังอี้เสวี่ยเตือนหลิวเสี่ยวเสวี่ยให้ทบทวนคำศัพท์และโจทย์ที่ทำผิดในสมุด", contextEn: "Wang reminds Xiaoxue to review vocabulary and the questions she answered incorrectly.",
    characters: [{ role: "A", profile: "wang", noteTh: "แม่ที่ช่วยเตือนการทบทวน", noteZh: "提醒女儿复习的妈妈", noteEn: "The mother prompting revision" }, { role: "B", profile: "liuXiaoxue", noteTh: "ลูกสาวที่เตรียมสอบ", noteZh: "准备考试的女儿", noteEn: "The daughter preparing for an exam" }],
    lines: [
      line(reviewRef, "A", "王一雪", "Xiǎoxuě, nǐ zài zuò shénme ne?", "小雪，你在做什么呢？", "Xiaoxue, what are you doing?", "เสี่ยวเสวี่ย ลูกกำลังทำอะไรอยู่?", "32% center"),
      line(reviewRef, "B", "刘小雪", "Míngtiān kǎoshì, wǒ zài kàn shū ne.", "明天考试，我在看书呢。", "I have an exam tomorrow, so I am studying.", "พรุ่งนี้สอบ หนูกำลังอ่านหนังสืออยู่", "70% center"),
      line(reviewRef, "A", "王一雪", "Zhèxiē cí yào hǎohāo kànkan.", "这些词要好好看看。", "You should review these words carefully.", "คำศัพท์เหล่านี้ต้องทบทวนให้ดี", "32% center"),
      line(reviewRef, "B", "刘小雪", "Wǒ kànguo le, yìsi yě dōu dǒng le.", "我看过了，意思也都懂了。", "I have reviewed them and understand all the meanings.", "หนูอ่านแล้วและเข้าใจความหมายทั้งหมดแล้ว", "70% center"),
      line(reviewRef, "A", "王一雪", "Nǐ de běnzi ne? Běnzi shàng zuòcuò de tí yě yào kàn yi kàn.", "你的本子呢？本子上做错的题也要看一看。", "Where is your notebook? Review the questions you got wrong in it too.", "แล้วสมุดล่ะ โจทย์ที่ทำผิดในสมุดก็ต้องทบทวนด้วย", "32% center"),
      line(reviewRef, "B", "刘小雪", "Māma, shì nín zhǔnbèi kǎoshì háishi wǒ zhǔnbèi kǎoshì?", "妈妈，是您准备考试还是我准备考试？", "Mom, are you preparing for the exam or am I?", "แม่คะ แม่เป็นคนเตรียมสอบหรือหนูเป็นคนเตรียมสอบกันแน่?", "70% center"),
    ],
    qte: { after: 4, prompt: { th: "หลิวเสี่ยวเสวี่ยจะทำอะไรวันพรุ่งนี้?", zh: "刘小雪明天要做什么？", en: "What will Liu Xiaoxue do tomorrow?" }, options: [{ value: "考试", zh: "考试", pinyin: "kǎoshì", th: "สอบ" }, { value: "开学", zh: "开学", pinyin: "kāixué", th: "เปิดเทอม" }, { value: "看电影", zh: "看电影", pinyin: "kàn diànyǐng", th: "ดูหนัง" }], correct: "考试", evidence: "明天考试，我在看书呢。", evidenceTh: "พรุ่งนี้สอบ หนูกำลังอ่านหนังสือ", sourceRef: reviewRef },
    builder: { prompt: { th: "เรียงคำถามแบบเลือก", zh: "重组选择问句", en: "Rebuild the alternative question" }, answer: ["是", "您", "准备考试", "还是", "我", "准备考试"], tiles: ["我", "还是", "准备考试", "是", "您", "准备考试"], gloss: { 是: "เป็น", 您: "คุณ/แม่", 准备考试: "เตรียมสอบ", 还是: "หรือ", 我: "ฉัน" }, translationTh: "แม่เป็นคนเตรียมสอบหรือฉันเป็นคนเตรียมสอบ", translationEn: "Are you preparing for the exam or am I?", evidence: "Text 2 · หน้าเล่ม 87", sourceRef: reviewRef },
  },
  {
    id: "h2l10-homecoming", number: "03", glyph: "快", title: "饭菜快要做好了", titleTh: "อาหารใกล้เสร็จแล้ว", titleEn: "The meal is almost ready", place: "客厅",
    placePy: "kètīng", placeTh: "ห้องรับแขก", ...art("homecoming"),
    imageAlt: { th: "หวังอี้เสวี่ยคุยกับลูก ๆ หลังสอบ", zh: "母亲和孩子们谈考试场景", en: "Mother talking with the children after the exam" }, source: "Text 3 · หน้าเล่ม 89 · PDF หน้า 103", sourcePage: "89", sourceRef: homeRef,
    context: "孩子们回家后谈考试，王一雪说饭菜快要做好了，让他们去洗手。", contextTh: "ลูก ๆ กลับบ้านและคุยเรื่องสอบ หวังอี้เสวี่ยบอกว่าอาหารใกล้เสร็จแล้วและให้ไปล้างมือ", contextEn: "After the children return home and discuss their exams, Wang says the meal is almost ready and asks them to wash up.",
    characters: [{ role: "A", profile: "liuXiaoxue", noteTh: "พี่สาวที่เพิ่งสอบเสร็จ", noteZh: "刚考完试的姐姐", noteEn: "The older sister after her exam" }, { role: "B", profile: "wang", noteTh: "แม่ที่เตรียมอาหาร", noteZh: "正在准备饭菜的妈妈", noteEn: "The mother preparing the meal" }, { role: "C", profile: "liuXiaoming", noteTh: "น้องชายที่ล้างมือเสร็จก่อน", noteZh: "先洗完手的弟弟", noteEn: "The younger brother who washes first" }],
    lines: [
      line(homeRef, "A", "刘小雪", "Māma, wǒ huílái le!", "妈妈，我回来了！", "Mom, I’m back!", "แม่คะ หนูกลับมาแล้ว!", "70% center"),
      line(homeRef, "B", "王一雪", "Wǒ mǎi le nǎichá, jiù zài zhuōzi shàng, zìjǐ qù ná ba.", "我买了奶茶，就在桌子上，自己去拿吧。", "I bought bubble tea. It is on the table; get it yourself.", "แม่ซื้อชานมไว้ อยู่บนโต๊ะ ไปหยิบเองนะ", "32% center"),
      line(homeRef, "A", "刘小雪", "Xièxie māma!", "谢谢妈妈！", "Thank you, Mom!", "ขอบคุณค่ะแม่!", "70% center"),
      line(homeRef, "B", "王一雪", "Jīntiān kǎoshì kǎo de zěnmeyàng?", "今天考试考得怎么样？", "How did today’s exam go?", "วันนี้สอบเป็นอย่างไรบ้าง?", "32% center"),
      line(homeRef, "A", "刘小雪", "Wǒ juéde bǐ shàng cì hǎo.", "我觉得比上次好。", "I think I did better than last time.", "หนูคิดว่าดีกว่าครั้งที่แล้ว", "70% center"),
      line(homeRef, "B", "王一雪", "Zhēn búcuò! Fàncài kuàiyào zuò hǎo le, nǐ jiào dìdi yìqǐ qù xǐshǒu ba.", "真不错！饭菜快要做好了，你叫弟弟一起去洗手吧。", "Great! The meal is almost ready. Ask your brother to wash his hands with you.", "ดีมาก! อาหารใกล้เสร็จแล้ว เรียกน้องชายไปล้างมือด้วยกันนะ", "32% center"),
      line(homeRef, "C", "刘小明", "Māma, wǒ shì dì-yī míng, jiějie hái méi xǐwán ne.", "妈妈，我是第一名，姐姐还没洗完呢。", "Mom, I finished first; my sister has not finished yet.", "แม่ครับ ผมเป็นที่หนึ่ง พี่ยังล้างไม่เสร็จเลย", "68% center"),
      line(homeRef, "B", "王一雪", "Nǐ xǐ de zhēn kuài a!", "你洗得真快啊！", "You washed your hands so quickly!", "ลูกล้างมือเร็วจริง ๆ!", "32% center"),
    ],
    qte: { after: 5, prompt: { th: "อะไรใกล้จะเสร็จแล้ว?", zh: "什么快要做好了？", en: "What is almost ready?" }, options: [{ value: "饭菜", zh: "饭菜", pinyin: "fàncài", th: "อาหาร" }, { value: "考试", zh: "考试", pinyin: "kǎoshì", th: "การสอบ" }, { value: "奶茶", zh: "奶茶", pinyin: "nǎichá", th: "ชานม" }], correct: "饭菜", evidence: "饭菜快要做好了。", evidenceTh: "อาหารใกล้เสร็จแล้ว", sourceRef: homeRef },
    builder: { prompt: { th: "เรียงประโยคบอกเหตุการณ์ที่ใกล้เกิด", zh: "重组“快要……了”句", en: "Rebuild the about-to sentence" }, answer: ["饭菜", "快要", "做好", "了"], tiles: ["做好", "饭菜", "了", "快要"], gloss: { 饭菜: "อาหาร", 快要: "ใกล้จะ", 做好: "ทำเสร็จ", 了: "แล้ว" }, translationTh: "อาหารใกล้ทำเสร็จแล้ว", translationEn: "The meal is almost ready.", evidence: "Text 3 · หน้าเล่ม 89", sourceRef: homeRef },
  },
];

export const LESSON_HSK2_L10 = {
  id: "hsk2-l10", slug: "lesson-10", level: "hsk2", number: 10, featured: false, sourceRef,
  source: { title: "新HSK教程 2 · New HSK Course 2", lesson: "Lesson 10 · 就要考试了", printedPages: "84–92", pdfPages: "98–106", file: "hsk2.pdf", sourceRef },
  title: { zh: "就要考试了", pinyin: "Jiù yào kǎoshì le", en: "The exam is coming", thAid: "ใกล้จะสอบแล้ว" },
  summary: { zh: "刘家准备开学和考试，学习主谓谓语句、选择问句和“要/快/快要/就要……了”。", en: "The Liu family prepares for school and exams while learning subject-predicate predicates, alternative questions, and the about-to pattern.", thAid: "ครอบครัวหลิวเตรียมเปิดเทอมและสอบ พร้อมฝึกประโยคภาคแสดงแบบประธาน-ภาคแสดง คำถามแบบเลือก และรูปใกล้จะเกิด" },
  translationPolicy: { kind: "editorial-aid", labelTh: "คำแปลไทยเพื่อช่วยเรียน เรียบเรียงจากต้นฉบับ" },
  objectives: [
    { zh: "能听懂并使用主谓谓语句对人、事物或情况进行说明。", en: "Use subject-predicate phrases as predicates to describe people, things, or situations.", thAid: "ใช้วลีประธาน-ภาคแสดงเป็นภาคแสดงเพื่ออธิบายบุคคล สิ่งของ หรือสถานการณ์", sourceRef: lessonHsk2L10SourceRef("84", "98") },
    { zh: "能听懂并使用选择问句表示疑问。", en: "Understand and use alternative questions.", thAid: "เข้าใจและใช้คำถามแบบให้เลือก", sourceRef: lessonHsk2L10SourceRef("84", "98") },
    { zh: "掌握固定格式“要/快/快要/就要……了”的用法，能表达某事即将发生。", en: "Master the fixed pattern 要/快/快要/就要……了 to express that something is about to happen.", thAid: "ใช้รูปแบบ 要/快/快要/就要……了 เพื่อบอกว่าเหตุการณ์กำลังจะเกิดขึ้น", sourceRef: lessonHsk2L10SourceRef("84", "98") },
  ],
  contents: [
    { number: "00", title: "目标与热身", titleTh: "เป้าหมายและการเตรียมบท", detail: "Objectives · Warm-Up", pages: "84", route: "/home/hsk2/lesson-10/preface/", sourceRef: lessonHsk2L10SourceRef("84", "98") },
    { number: "01", title: "明天就开学", titleTh: "พรุ่งนี้เปิดเทอม", detail: "Text 1 · New Words 1–5", pages: "85–86", scene: 1, sourceRef: lessonHsk2L10SourceRef("85-86", "99-100") },
    { number: "02", title: "准备明天的考试", titleTh: "เตรียมสอบวันพรุ่งนี้", detail: "Text 2 · New Words 6–11", pages: "87–88", scene: 2, sourceRef: lessonHsk2L10SourceRef("87-88", "101-102") },
    { number: "03", title: "饭菜快要做好了", titleTh: "อาหารใกล้เสร็จแล้ว", detail: "Text 3 · New Words 12–13", pages: "88–90", scene: 3, sourceRef: lessonHsk2L10SourceRef("88-90", "102-104") },
    { number: "04", title: "日记与综合练习", titleTh: "บันทึกและแบบฝึกรวม", detail: "Text 4 · Exercises", pages: "90–92", sourceRef: lessonHsk2L10SourceRef("90-92", "104-106") },
  ],
  vocabulary,
  grammarFocus: [
    { title: "主谓谓语句", titleEn: "Subject-Predicate Phrase as Predicate", explanationZh: "主谓短语可以作谓语来说明全句主语，基本结构是“主语+主谓短语”。", explanationEn: "A subject-predicate phrase can serve as the predicate describing the topic, in the pattern topic + subject-predicate phrase.", thAid: "วลีประธาน-ภาคแสดงทำหน้าที่เป็นภาคแสดงเพื่ออธิบายหัวข้อของประโยค ในรูป หัวข้อ + วลีประธาน-ภาคแสดง", examples: ["我的书包你看见了吗？", "弟弟手很小。", "这件事他知道。"], sourceRef: lessonHsk2L10SourceRef("86", "100") },
    { title: "选择问句", titleEn: "Alternative Questions", explanationZh: "连词“还是”用在疑问句中表示选择，基本结构是“（是）A还是B”。", explanationEn: "The conjunction 还是 marks alternatives in a question, typically (是) A 还是 B.", thAid: "ใช้ 还是 ในคำถามเพื่อให้เลือก รูปพื้นฐานคือ (是) A 还是 B", examples: ["是您准备考试还是我准备考试？", "你更喜欢打篮球、踢足球还是游泳？", "今天还是明天？"], sourceRef: lessonHsk2L10SourceRef("88", "102") },
    { title: "“要/快/快要/就要……了”", titleEn: "The About-to Pattern", explanationZh: "“要/快/快要/就要……了”表示某事将要发生；句中有时间状语时一般用“就要……了”。", explanationEn: "要/快/快要/就要…了 indicates that something is about to happen; with a time expression, 就要…了 is generally used.", thAid: "รูป 要/快/快要/就要…了 บอกว่าสิ่งหนึ่งใกล้จะเกิด และเมื่อมีคำบอกเวลามักใช้ 就要…了", examples: ["饭菜快要做好了。", "火车快开了。", "我们下星期就要考试了。"], sourceRef: lessonHsk2L10SourceRef("90", "104") },
  ],
  characters,
  scenes,
};
