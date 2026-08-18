import { group3AssetPath } from "../../../../config.js";

const SOURCE_FILE = "docs/references/hsk/sources/hsk3.pdf";
export const lessonHsk3L9SourceRef = (printedPages, pdfPages) => `${SOURCE_FILE}#printed-pages=${printedPages}&pdf-pages=${pdfPages}`;
const sourceRef = lessonHsk3L9SourceRef("76-85", "88-97");
const art = (scene) => ({ image: group3AssetPath(`/assets/group3/lesson-hsk3-l9-${scene}-v1.webp`), imageSrcSet: `${group3AssetPath(`/assets/group3/lesson-hsk3-l9-${scene}-720w-v1.webp`)} 720w, ${group3AssetPath(`/assets/group3/lesson-hsk3-l9-${scene}-v1.webp`)} 1400w` });
const line = (source, value) => ({ ...value, reading: value.pinyin, sourceRef: source });
const visual = (zh, th, focus) => ({ zh, th, focus });

const characters = {
  liWen: { hanzi: "李文", pinyin: "Lǐ Wén", nameTh: "หลี่เหวิน", nameEn: "Li Wen", ...art("card"), imageFocus: "34% center" },
  bai: { hanzi: "白家月", pinyin: "Bái Jiāyuè", nameTh: "ไป๋เจียเยว่", nameEn: "Bai Jiayue", ...art("card"), imageFocus: "66% center" },
  chen: { hanzi: "陈天中", pinyin: "Chén Tiānzhōng", nameTh: "เฉินเทียนจง", nameEn: "Chen Tianzhong", ...art("football"), imageFocus: "34% center" },
};

const vocabularyPages = [
  [1, "校园", "xiàoyuán", "n.", "campus", "วิทยาเขต", 77, 89], [2, "卡", "kǎ", "n.", "card", "บัตร", 77, 89], [3, "球场", "qiúchǎng", "n.", "sports court", "สนามกีฬา", 77, 89], [4, "为了", "wèile", "prep.", "for; in order to", "เพื่อ", 77, 89], [5, "运动会", "yùndònghuì", "n.", "sports meet", "กีฬาสี / การแข่งขันกีฬา", 77, 89], [6, "男生", "nánshēng", "n.", "male student", "นักเรียนชาย", 77, 89], [7, "练", "liàn", "v.", "practice; train", "ฝึก", 77, 89], [8, "参加", "cānjiā", "v.", "take part in", "เข้าร่วม", 77, 89], [9, "网球", "wǎngqiú", "n.", "tennis", "เทนนิส", 77, 89], [10, "比赛", "bǐsài", "n./v.", "match; compete", "การแข่งขัน / แข่งขัน", 77, 89], [11, "练习", "liànxí", "n./v.", "practice; exercise", "ฝึกฝน / แบบฝึก", 77, 89],
  [12, "好多", "hǎoduō", "num.", "a great many", "มากมาย", 79, 91], [13, "几乎", "jīhū", "adv.", "almost", "เกือบจะ", 79, 91], [14, "只是", "zhǐshì", "adv./conj.", "only; merely", "เพียงแต่", 79, 91],
  [15, "啤酒", "píjiǔ", "n.", "beer", "เบียร์", 81, 93], [16, "回", "huí", "m.", "time; occurrence", "ครั้ง (ลักษณนาม)", 81, 93], [17, "紧张", "jǐnzhāng", "adj.", "nervous; tense", "ประหม่า / ตึงเครียด", 81, 93], [18, "主要", "zhǔyào", "adj.", "main; principal", "สำคัญ / หลัก", 81, 93], [19, "受到", "shòudào", "v.", "receive; be subjected to", "ได้รับ", 81, 93], [20, "影响", "yǐngxiǎng", "n./v.", "influence; affect", "อิทธิพล / ส่งผล", 81, 93], [21, "得分", "défēn", "v./n.", "score; points", "ทำคะแนน / คะแนน", 81, 93],
  [22, "体育", "tǐyù", "n.", "physical education; sports", "พลศึกษา / กีฬา", 82, 94], [23, "世界", "shìjiè", "n.", "world", "โลก", 82, 94], [24, "运动员", "yùndòngyuán", "n.", "athlete", "นักกีฬา", 82, 94], [25, "得到", "dédào", "v.", "obtain; receive", "ได้รับ", 82, 94], [26, "成绩", "chéngjì", "n.", "result; achievement", "ผลการเรียน / ผลงาน", 82, 94],
];
const vocabulary = vocabularyPages.map(([index, hanzi, pinyin, type, en, thAid, page, pdfPage]) => ({ index, hanzi, pinyin, type, en, th: thAid, thAid, page, translationKind: "editorial-aid", sourceRef: lessonHsk3L9SourceRef(String(page), String(pdfPage)) }));
const cardRef = lessonHsk3L9SourceRef("77", "89");
const badmintonRef = lessonHsk3L9SourceRef("78-79", "90-91");
const footballRef = lessonHsk3L9SourceRef("80", "92");

const scenes = [
  {
    id: "h3l9-card", number: "01", glyph: "卡", title: "归还校园卡", titleTh: "คืนบัตรมหาวิทยาลัย", titleEn: "Returning a campus card", place: "图书馆门口", placeTh: "หน้าห้องสมุด", ...art("card"),
    imageAlt: { th: "หลี่เหวินนำบัตรมหาวิทยาลัยมาคืนไป๋เจียเยว่", zh: "图书馆门口还卡场景", en: "Returning a campus card outside the library" }, source: "Text 1 · หน้าเล่ม 77 · PDF หน้า 89", sourcePage: "77", sourceRef: cardRef,
    context: "在图书馆门口，李文向白家月跑过去。", contextTh: "หน้าห้องสมุด หลี่เหวินวิ่งไปหาไป๋เจียเยว่", contextEn: "Outside the library, Li Wen ran toward Bai Jiayue.",
    characters: [{ role: "A", profile: "liWen", noteTh: "ผู้ที่รีบนำบัตรมาคืน", noteZh: "跑来还校园卡的人", noteEn: "The person rushing over to return the card" }, { role: "B", profile: "bai", noteTh: "ผู้ที่มารับบัตรและคุยเรื่องกีฬา", noteZh: "来拿卡并谈运动会的人", noteEn: "The card owner discussing the sports meet" }],
    lines: [
      line(cardRef, { role: "A", speaker: "李文", hanzi: "家月，对不起，我昨天忘了还你校园卡了。", pinyin: "Jiāyuè, duìbuqǐ, wǒ zuótiān wàng le huán nǐ xiàoyuánkǎ le.", en: "Jiayue, sorry. I forgot to return your campus card yesterday.", th: "เจียเยว่ ขอโทษนะ เมื่อวานฉันลืมคืนบัตรมหาวิทยาลัยให้เธอ", visual: visual("忘了还校园卡", "ลืมคืนบัตรมหาวิทยาลัย", "34% center") }),
      line(cardRef, { role: "B", speaker: "白家月", hanzi: "没关系。你怎么这么快就过来了？", pinyin: "Méi guānxi. Nǐ zěnme zhème kuài jiù guòlai le?", en: "It’s all right. How did you get here so quickly?", th: "ไม่เป็นไร ทำไมเธอถึงมาเร็วขนาดนี้?", visual: visual("这么快就过来了", "มาเร็วขนาดนี้", "66% center") }),
      line(cardRef, { role: "A", speaker: "李文", hanzi: "我正在球场打球呢，接了你的电话就跑过来了。", pinyin: "Wǒ zhèngzài qiúchǎng dǎqiú ne, jiē le nǐ de diànhuà jiù pǎo guòlai le.", en: "I was playing ball on the court. As soon as I took your call, I ran over.", th: "ฉันกำลังเล่นบอลอยู่ที่สนาม พอรับโทรศัพท์เธอก็วิ่งมาเลย", visual: visual("接了电话就跑过来", "รับสายแล้ววิ่งมา", "36% center") }),
      line(cardRef, { role: "B", speaker: "白家月", hanzi: "听说为了准备运动会，你们几个男生每天都练球。", pinyin: "Tīngshuō wèile zhǔnbèi yùndònghuì, nǐmen jǐ ge nánshēng měitiān dōu liàn qiú.", en: "I hear that to prepare for the sports meet, you boys practice every day.", th: "ได้ยินว่าเพื่อเตรียมแข่งกีฬา พวกนักเรียนชายหลายคนฝึกบอลทุกวัน", visual: visual("为了准备运动会", "เพื่อเตรียมแข่งกีฬา", "64% center") }),
      line(cardRef, { role: "A", speaker: "李文", hanzi: "是啊！你打算参加运动会吗？", pinyin: "Shì a! Nǐ dǎsuàn cānjiā yùndònghuì ma?", en: "Yes! Are you planning to take part in the sports meet?", th: "ใช่! เธอวางแผนจะเข้าร่วมการแข่งขันกีฬาไหม?", visual: visual("参加运动会吗", "เข้าร่วมการแข่งขันไหม", "38% center") }),
      line(cardRef, { role: "B", speaker: "白家月", hanzi: "我想参加网球比赛，最近一直在练习。", pinyin: "Wǒ xiǎng cānjiā wǎngqiú bǐsài, zuìjìn yìzhí zài liànxí.", en: "I want to enter the tennis match. I’ve been practicing lately.", th: "ฉันอยากแข่งเทนนิส ช่วงนี้ฝึกอยู่ตลอด", visual: visual("参加网球比赛", "แข่งเทนนิส", "62% center") }),
      line(cardRef, { role: "A", speaker: "李文", hanzi: "好，到时候我去看你的比赛。", pinyin: "Hǎo, dào shíhou wǒ qù kàn nǐ de bǐsài.", en: "Great. I’ll go watch your match when the time comes.", th: "ดี ถึงตอนนั้นฉันจะไปดูการแข่งขันของเธอ", visual: visual("去看你的比赛", "ไปดูการแข่งขันของเธอ", "40% center") }),
    ],
    qte: { after: 3, prompt: { th: "พวกนักเรียนชายฝึกบอลทุกวันเพื่ออะไร?", zh: "几个男生为什么每天练球？", en: "Why do the boys practice every day?" }, options: [{ value: "准备运动会", zh: "准备运动会", pinyin: "zhǔnbèi yùndònghuì", th: "เตรียมการแข่งขันกีฬา" }, { value: "归还校园卡", zh: "归还校园卡", pinyin: "guīhuán xiàoyuánkǎ", th: "คืนบัตรมหาวิทยาลัย" }, { value: "参加考试", zh: "参加考试", pinyin: "cānjiā kǎoshì", th: "เข้าสอบ" }], correct: "准备运动会", evidence: "白家月：听说为了准备运动会，你们几个男生每天都练球。", evidenceTh: "ไป๋เจียเยว่: ได้ยินว่าพวกเธอฝึกบอลทุกวันเพื่อเตรียมการแข่งขันกีฬา", sourceRef: cardRef },
    builder: { prompt: { th: "เรียงประโยคบอกจุดประสงค์", zh: "重组“为了……”句", en: "Rebuild the purpose sentence" }, answer: ["为了", "准备运动会", "你们几个男生", "每天都", "练球"], tiles: ["每天都", "练球", "为了", "你们几个男生", "准备运动会"], gloss: { 为了: "เพื่อ", 准备运动会: "เตรียมการแข่งขันกีฬา", 你们几个男生: "พวกนักเรียนชายหลายคน", 每天都: "ทุกวัน", 练球: "ฝึกบอล" }, translationTh: "เพื่อเตรียมการแข่งขันกีฬา พวกนักเรียนชายหลายคนฝึกบอลทุกวัน", translationEn: "To prepare for the sports meet, you boys practice every day.", evidence: "Text 1 · หน้าเล่ม 77", sourceRef: cardRef },
  },
  {
    id: "h3l9-badminton", number: "02", glyph: "球", title: "一起打羽毛球", titleTh: "ชวนกันเล่นแบดมินตัน", titleEn: "Playing badminton together", place: "校园",
    placePy: "xiàoyuán", placeTh: "ในมหาวิทยาลัย", ...art("badminton"),
    imageAlt: { th: "หลี่เหวินชวนไป๋เจียเยว่เล่นแบดมินตัน", zh: "校园羽毛球场景", en: "A badminton invitation on campus" }, source: "Text 2 · หน้าเล่ม 78–79 · PDF หน้า 90–91", sourcePage: "78–79", sourceRef: badmintonRef,
    context: "在校园里，李文和白家月在聊天儿。", contextTh: "ในมหาวิทยาลัย หลี่เหวินกับไป๋เจียเยว่กำลังคุยกัน", contextEn: "On campus, Li Wen and Bai Jiayue were chatting.",
    characters: [{ role: "A", profile: "liWen", noteTh: "ผู้ชวนเล่นแบดมินตันเพื่อออกกำลัง", noteZh: "邀请同学打羽毛球锻炼的人", noteEn: "The classmate inviting someone to exercise" }, { role: "B", profile: "bai", noteTh: "ผู้ที่กังวลว่าจะรับลูกไม่ได้", noteZh: "担心接不住球的人", noteEn: "The person worried about missing the shuttle" }],
    lines: [
      line(badmintonRef, { role: "A", speaker: "李文", hanzi: "家月，你跟我们一起打羽毛球吧？", pinyin: "Jiāyuè, nǐ gēn wǒmen yìqǐ dǎ yǔmáoqiú ba?", en: "Jiayue, why don’t you play badminton with us?", th: "เจียเยว่ มาเล่นแบดมินตันกับพวกเราสิ?", visual: visual("一起打羽毛球", "เล่นแบดมินตันด้วยกัน", "34% center") }),
      line(badmintonRef, { role: "B", speaker: "白家月", hanzi: "我好多年没打羽毛球了，几乎忘了怎么打了。", pinyin: "Wǒ hǎoduō nián méi dǎ yǔmáoqiú le, jīhū wàng le zěnme dǎ le.", en: "I haven’t played badminton for many years. I’ve almost forgotten how.", th: "ฉันไม่ได้เล่นแบดมินตันมาหลายปี เกือบลืมแล้วว่าเล่นอย่างไร", visual: visual("几乎忘了怎么打", "เกือบลืมวิธีเล่น", "66% center") }),
      line(badmintonRef, { role: "A", speaker: "李文", hanzi: "不是比赛，打不好没关系。", pinyin: "Bú shì bǐsài, dǎ bù hǎo méi guānxi.", en: "It isn’t a competition. It doesn’t matter if you can’t play well.", th: "ไม่ใช่การแข่งขัน เล่นไม่ดีก็ไม่เป็นไร", visual: visual("打不好没关系", "เล่นไม่ดีก็ไม่เป็นไร", "36% center") }),
      line(badmintonRef, { role: "B", speaker: "白家月", hanzi: "这么多同学一起打，如果总是接不住球，就太不好意思了。", pinyin: "Zhème duō tóngxué yìqǐ dǎ, rúguǒ zǒngshì jiēbuzhù qiú, jiù tài bù hǎoyìsi le.", en: "With so many classmates playing, I’d be embarrassed if I kept failing to return the shuttle.", th: "เพื่อนมากมายเล่นด้วยกัน ถ้ารับลูกไม่ได้ตลอดก็น่าอายเกินไป", visual: visual("接不住球", "รับลูกไม่ได้", "64% center") }),
      line(badmintonRef, { role: "A", speaker: "李文", hanzi: "你想得太多了！大家打球只是为了锻炼身体。", pinyin: "Nǐ xiǎng de tài duō le! Dàjiā dǎqiú zhǐshì wèile duànliàn shēntǐ.", en: "You’re overthinking it! Everyone plays only to exercise.", th: "เธอคิดมากเกินไป! ทุกคนเล่นบอลก็เพียงเพื่อออกกำลังกาย", visual: visual("只是为了锻炼身体", "เพียงเพื่อออกกำลังกาย", "38% center") }),
      line(badmintonRef, { role: "B", speaker: "白家月", hanzi: "我先自己练练吧，下周再跟你们一起打。", pinyin: "Wǒ xiān zìjǐ liànlian ba, xià zhōu zài gēn nǐmen yìqǐ dǎ.", en: "I’ll practice by myself first, then play with you next week.", th: "ฉันขอฝึกเองก่อน สัปดาห์หน้าค่อยเล่นกับพวกเธอ", visual: visual("先自己练练", "ฝึกเองก่อน", "62% center") }),
      line(badmintonRef, { role: "A", speaker: "李文", hanzi: "我在教天中打羽毛球，你可以过来跟我们一起练。", pinyin: "Wǒ zài jiāo Tiānzhōng dǎ yǔmáoqiú, nǐ kěyǐ guòlai gēn wǒmen yìqǐ liàn.", en: "I’m teaching Tianzhong badminton. You can come practice with us.", th: "ฉันกำลังสอนเทียนจงเล่นแบดมินตัน เธอมาฝึกกับเราได้", visual: visual("跟我们一起练", "มาฝึกกับพวกเรา", "40% center") }),
    ],
    qte: { after: 4, prompt: { th: "ทุกคนเล่นบอลด้วยจุดประสงค์อะไร?", zh: "大家打球只是为了什么？", en: "What is everyone’s purpose in playing?" }, options: [{ value: "锻炼身体", zh: "锻炼身体", pinyin: "duànliàn shēntǐ", th: "ออกกำลังกาย" }, { value: "参加考试", zh: "参加考试", pinyin: "cānjiā kǎoshì", th: "เข้าสอบ" }, { value: "得到礼物", zh: "得到礼物", pinyin: "dédào lǐwù", th: "ได้รับของขวัญ" }], correct: "锻炼身体", evidence: "李文：大家打球只是为了锻炼身体。", evidenceTh: "หลี่เหวิน: ทุกคนเล่นบอลก็เพียงเพื่อออกกำลังกาย", sourceRef: badmintonRef },
    builder: { prompt: { th: "เรียงประโยคที่มีบทเสริมความเป็นไปได้", zh: "重组可能补语句", en: "Rebuild the potential-complement sentence" }, answer: ["打不好", "没关系"], tiles: ["没关系", "打不好"], gloss: { 打不好: "เล่นได้ไม่ดี", 没关系: "ไม่เป็นไร" }, translationTh: "เล่นไม่ดีก็ไม่เป็นไร", translationEn: "It does not matter if you cannot play well.", evidence: "Text 2 · หน้าเล่ม 78", sourceRef: badmintonRef },
  },
  {
    id: "h3l9-football", number: "03", glyph: "赛", title: "看足球比赛", titleTh: "ดูการแข่งขันฟุตบอล", titleEn: "Watching a football match", place: "李文家", placeTh: "บ้านหลี่เหวิน", ...art("football"),
    imageAlt: { th: "เพื่อนสามคนดูการแข่งขันฟุตบอล", zh: "看足球比赛场景", en: "Friends watching a football match" }, source: "Text 3 · หน้าเล่ม 80 · PDF หน้า 92", sourcePage: "80", sourceRef: footballRef,
    context: "在李文家，李文、白家月和陈天中一起看电视。", contextTh: "ที่บ้านหลี่เหวิน หลี่เหวิน ไป๋เจียเยว่ และเฉินเทียนจงดูโทรทัศน์ด้วยกัน", contextEn: "At Li Wen’s home, Li Wen, Bai Jiayue, and Chen Tianzhong watched television together.",
    characters: [{ role: "A", profile: "chen", noteTh: "ผู้ชวนดูฟุตบอลและอธิบายสถานการณ์", noteZh: "招呼看球并说明情况的人", noteEn: "The viewer explaining the match" }, { role: "B", profile: "liWen", noteTh: "เจ้าบ้านที่ไปหยิบเครื่องดื่ม", noteZh: "去拿饮料的主人", noteEn: "The host getting drinks" }, { role: "C", profile: "bai", noteTh: "ผู้ชมที่ยิ่งดูก็ยิ่งกังวล", noteZh: "越看越着急的观众", noteEn: "The increasingly anxious viewer" }],
    lines: [
      line(footballRef, { role: "A", speaker: "陈天中", hanzi: "足球比赛已经开始了，快过来看吧！", pinyin: "Zúqiú bǐsài yǐjīng kāishǐ le, kuài guòlai kàn ba!", en: "The football match has started. Come watch!", th: "การแข่งขันฟุตบอลเริ่มแล้ว รีบมาดูสิ!", visual: visual("比赛已经开始了", "การแข่งขันเริ่มแล้ว", "34% center") }),
      line(footballRef, { role: "B", speaker: "李文", hanzi: "你们先看，冰箱里有啤酒和饮料，我去拿一下。", pinyin: "Nǐmen xiān kàn, bīngxiāng li yǒu píjiǔ hé yǐnliào, wǒ qù ná yíxià.", en: "You watch first. There’s beer and other drinks in the fridge; I’ll get them.", th: "พวกเธอดูก่อน ในตู้เย็นมีเบียร์กับเครื่องดื่ม ฉันไปหยิบมา", visual: visual("我去拿一下", "ฉันไปหยิบมา", "66% center") }),
      line(footballRef, { role: "C", speaker: "白家月", hanzi: "今天怎么回事？总是踢不进去！", pinyin: "Jīntiān zěnme huí shì? Zǒngshì tī bu jìnqu!", en: "What’s happening today? They just can’t score!", th: "วันนี้เกิดอะไรขึ้น? เตะไม่เข้าอยู่เรื่อย!", visual: visual("总是踢不进去", "เตะไม่เข้าอยู่เรื่อย", "36% center") }),
      line(footballRef, { role: "A", speaker: "陈天中", hanzi: "几个老球员生病了，新球员第一次参加这么重要的比赛，太紧张了。", pinyin: "Jǐ ge lǎo qiúyuán shēngbìng le, xīn qiúyuán dì-yī cì cānjiā zhème zhòngyào de bǐsài, tài jǐnzhāng le.", en: "Several veteran players are ill, and the new players are too nervous in their first major match.", th: "ผู้เล่นเก่าหลายคนป่วย ผู้เล่นใหม่ลงแข่งนัดสำคัญแบบนี้ครั้งแรก จึงประหม่าเกินไป", visual: visual("新球员太紧张", "ผู้เล่นใหม่ประหม่า", "64% center") }),
      line(footballRef, { role: "B", speaker: "李文", hanzi: "是啊，主要的球员没参加比赛，所以大家也都受到影响了。", pinyin: "Shì a, zhǔyào de qiúyuán méi cānjiā bǐsài, suǒyǐ dàjiā yě dōu shòudào yǐngxiǎng le.", en: "Right. The main players didn’t take part, so everyone was affected.", th: "ใช่ ผู้เล่นหลักไม่ได้ลงแข่ง ทุกคนจึงได้รับผลกระทบ", visual: visual("受到影响了", "ได้รับผลกระทบ", "38% center") }),
      line(footballRef, { role: "C", speaker: "白家月", hanzi: "越看越着急。我不看了，你们告诉我得分吧。", pinyin: "Yuè kàn yuè zháojí. Wǒ bú kàn le, nǐmen gàosu wǒ défēn ba.", en: "The more I watch, the more anxious I get. I’ll stop watching; tell me the score.", th: "ยิ่งดูก็ยิ่งร้อนใจ ฉันไม่ดูแล้ว พวกเธอบอกคะแนนฉันก็พอ", visual: visual("越看越着急", "ยิ่งดูก็ยิ่งร้อนใจ", "62% center") }),
    ],
    qte: { after: 4, prompt: { th: "ทำไมทีมจึงได้รับผลกระทบ?", zh: "球队为什么受到影响？", en: "Why was the team affected?" }, options: [{ value: "主要球员没参加", zh: "主要球员没参加", pinyin: "zhǔyào qiúyuán méi cānjiā", th: "ผู้เล่นหลักไม่ได้ลงแข่ง" }, { value: "比赛还没开始", zh: "比赛还没开始", pinyin: "bǐsài hái méi kāishǐ", th: "การแข่งขันยังไม่เริ่ม" }, { value: "没有饮料", zh: "没有饮料", pinyin: "méiyǒu yǐnliào", th: "ไม่มีเครื่องดื่ม" }], correct: "主要球员没参加", evidence: "李文：主要的球员没参加比赛，所以大家也都受到影响了。", evidenceTh: "หลี่เหวิน: ผู้เล่นหลักไม่ได้ลงแข่ง ทุกคนจึงได้รับผลกระทบ", sourceRef: footballRef },
    builder: { prompt: { th: "เรียงประโยคแสดงการเปลี่ยนแปลงสัมพันธ์กัน", zh: "重组“越A越B”句", en: "Rebuild the 越A越B sentence" }, answer: ["越看", "越着急"], tiles: ["越着急", "越看"], gloss: { 越看: "ยิ่งดู", 越着急: "ยิ่งร้อนใจ" }, translationTh: "ยิ่งดูก็ยิ่งร้อนใจ", translationEn: "The more I watch, the more anxious I get.", evidence: "Text 3 · หน้าเล่ม 80", sourceRef: footballRef },
  },
];

export const LESSON_HSK3_L9 = {
  id: "hsk3-l9", slug: "lesson-9", level: "hsk3", number: 9, featured: false, sourceRef,
  source: { title: "新HSK教程 3 · New HSK Course 3", lesson: "Lesson 9 · 打不好没关系", printedPages: "76–85", pdfPages: "88–97", file: "hsk3.pdf", sourceRef },
  title: { zh: "打不好没关系", pinyin: "Dǎ bù hǎo méi guānxi", en: "It doesn’t matter if you can’t play well", thAid: "เล่นไม่ดีก็ไม่เป็นไร" },
  summary: { zh: "谈校园体育活动和比赛，学习目的表达、可能补语和“越A越B”。", en: "Discuss campus sports and matches while learning purpose expressions, potential complements, and 越A越B.", thAid: "คุยเรื่องกีฬาในมหาวิทยาลัยและการแข่งขัน พร้อมฝึกการบอกจุดประสงค์ บทเสริมความเป็นไปได้ และ 越A越B" },
  translationPolicy: { kind: "editorial-aid", labelTh: "คำแปลไทยเพื่อช่วยเรียน เรียบเรียงจากต้นฉบับ" },
  objectives: [
    { zh: "能听懂并介绍体育比赛的名称、运动员、影响等信息。", en: "Understand and introduce sports names, athletes, influences, and related information.", thAid: "ฟังเข้าใจและแนะนำชื่อการแข่งขัน นักกีฬา ผลกระทบ และข้อมูลที่เกี่ยวข้อง", sourceRef: lessonHsk3L9SourceRef("76", "88") },
    { zh: "能听懂并使用可能补语说明情况的可能性。", en: "Understand and use potential complements to explain possibility.", thAid: "ฟังเข้าใจและใช้บทเสริมความเป็นไปได้อธิบายความเป็นไปได้ของสถานการณ์", sourceRef: lessonHsk3L9SourceRef("76", "88") },
    { zh: "掌握“越A越B”格式的用法，能说明事物或情况的变化。", en: "Use 越A越B to explain changes in things or situations.", thAid: "ใช้รูปแบบ 越A越B เพื่ออธิบายการเปลี่ยนแปลงของสิ่งของหรือสถานการณ์", sourceRef: lessonHsk3L9SourceRef("76", "88") },
  ],
  contents: [
    { number: "00", title: "目标与热身", titleTh: "เป้าหมายและการเตรียมบท", detail: "Objectives · Warm-Up", pages: "76", route: "/home/hsk3/lesson-9/preface/", sourceRef: lessonHsk3L9SourceRef("76", "88") },
    { number: "01", title: "归还校园卡并谈运动会", titleTh: "คืนบัตรและคุยเรื่องการแข่งขันกีฬา", detail: "Text 1 · New Words 1–11", pages: "77–78", scene: 1, sourceRef: lessonHsk3L9SourceRef("77-78", "89-90") },
    { number: "02", title: "一起打羽毛球", titleTh: "ชวนกันเล่นแบดมินตัน", detail: "Text 2 · New Words 12–14", pages: "78–79", scene: 2, sourceRef: badmintonRef },
    { number: "03", title: "看足球比赛", titleTh: "ดูการแข่งขันฟุตบอล", detail: "Text 3 · New Words 15–21", pages: "80–81", scene: 3, sourceRef: lessonHsk3L9SourceRef("80-81", "92-93") },
    { number: "04", title: "体育人物、练习与活动", titleTh: "บุคคลในวงการกีฬา แบบฝึก และกิจกรรม", detail: "Text 4 · Exercises · Activity", pages: "81–85", sourceRef: lessonHsk3L9SourceRef("81-85", "93-97") },
  ],
  vocabulary,
  grammarFocus: [
    { title: "介词“为了”", titleEn: "Purpose with 为了", explanationZh: "“为了”引出动作或行为的目的，常用格式是“为了……，……”。", explanationEn: "为了 introduces the purpose of an action, commonly in the pattern 为了……，…….", thAid: "为了 นำหน้าจุดประสงค์ของการกระทำ มักใช้รูปแบบ 为了……，……", examples: ["听说为了准备运动会，你们几个男生每天都练球。", "为了考上大学，她每天努力学习。", "为了早点儿到家，我打算坐飞机回去。"], sourceRef: lessonHsk3L9SourceRef("78", "90") },
    { title: "可能补语", titleEn: "Potential Complement", explanationZh: "动词后用“得/不+补语”表示动作结果实现的可能或不可能。", explanationEn: "Verb + 得/不 + complement expresses whether a result can or cannot be achieved.", thAid: "กริยา + 得/不 + บทเสริม ใช้บอกว่าผลของการกระทำนั้นเป็นไปได้หรือไม่", examples: ["打不好没关系。", "这本书你看得懂看不懂？", "你只有一个星期的时间，学得会游泳吗？"], sourceRef: lessonHsk3L9SourceRef("79", "91") },
    { title: "“越A越B”格式", titleEn: "The 越A越B Pattern", explanationZh: "“越A越B”表示B随着A的变化而变化。", explanationEn: "越A越B indicates that B changes along with A.", thAid: "越A越B บอกว่า B เปลี่ยนแปลงตาม A", examples: ["今天的足球比赛我越看越着急。", "妈妈越说，他越不高兴。", "我想认识中国朋友，越多越好。"], sourceRef: lessonHsk3L9SourceRef("81", "93") },
  ],
  characters,
  scenes,
};
