import { group3AssetPath } from "../../../../config.js";

const SOURCE_FILE = "docs/references/hsk/sources/hsk2.pdf";
export const lessonHsk2L5SourceRef = (printedPages, pdfPages) => `${SOURCE_FILE}#printed-pages=${printedPages}&pdf-pages=${pdfPages}`;
const sourceRef = lessonHsk2L5SourceRef("37-45", "51-59");
const art = (scene) => ({ image: group3AssetPath(`/assets/group3/lesson-hsk2-l5-${scene}-v1.webp`), imageSrcSet: `${group3AssetPath(`/assets/group3/lesson-hsk2-l5-${scene}-720w-v1.webp`)} 720w, ${group3AssetPath(`/assets/group3/lesson-hsk2-l5-${scene}-v1.webp`)} 1400w` });

const characters = {
  annie: { hanzi: "安妮", pinyin: "Ānnī", nameTh: "แอนนี่", nameEn: "Annie", ...art("hotel-call"), imageFocus: "70% center" },
  bai: { hanzi: "白家月", pinyin: "Bái Jiāyuè", nameTh: "ไป๋เจียเยว่", nameEn: "Bai Jiayue", ...art("family-greeting"), imageFocus: "68% center" },
  wang: { hanzi: "王一雪", pinyin: "Wáng Yīxuě", nameTh: "หวังอี้เสวี่ย", nameEn: "Wang Yixue", ...art("family-meal"), imageFocus: "72% center" },
  grandpaLiu: { hanzi: "刘爷爷", pinyin: "Liú yéye", nameTh: "คุณปู่หลิว", nameEn: "Grandpa Liu", ...art("family-greeting"), imageFocus: "30% center" },
};

const vocabularyPages = [
  [1, "快", "kuài", "adv./adj.", "hurry up; fast", "เร็ว / รีบ", 38, 52],
  [2, "下来", "xiàlái", "v.", "come down", "ลงมา", 38, 52],
  [3, "上来", "shànglái", "v.", "come up", "ขึ้นมา", 38, 52],
  [4, "上去", "shàngqù", "v.", "go up", "ขึ้นไป", 38, 52],
  [5, "面", "miàn", "suffix", "suffix forming a noun of locality", "คำต่อท้ายสร้างคำนามบอกตำแหน่ง", 38, 52],
  [6, "等", "děng", "v.", "wait for", "รอ", 38, 52],
  [7, "一会儿", "yíhuìr", "num.-m.", "a short while; soon", "สักครู่ / เดี๋ยว", 38, 52],
  [8, "下去", "xiàqù", "v.", "go down", "ลงไป", 38, 52],
  [9, "进来", "jìnlái", "v.", "come or get in", "เข้ามา", 40, 54],
  [10, "爷爷", "yéye", "n.", "grandfather", "คุณปู่ / คุณตา", 40, 54],
  [11, "奶奶", "nǎinai", "n.", "grandmother", "คุณย่า / คุณยาย", 40, 54],
  [12, "礼物", "lǐwù", "n.", "gift; present", "ของขวัญ", 40, 54],
  [13, "准备", "zhǔnbèi", "v.", "prepare", "เตรียม", 40, 54],
  [14, "奶茶", "nǎichá", "n.", "bubble tea; milk tea", "ชานม", 42, 56],
  [15, "跟", "gēn", "prep./conj.", "with; and", "กับ / และ", 42, 56],
  [16, "走", "zǒu", "v.", "walk; go", "เดิน / ไป", 43, 57],
  [17, "酒店", "jiǔdiàn", "n.", "hotel", "โรงแรม", 43, 57],
  [18, "下面", "xiàmian", "n.", "downstairs; below", "ข้างล่าง", 38, 52],
  [19, "客气", "kèqi", "adj.", "polite; courteous", "เกรงใจ / สุภาพ", 40, 54],
  [20, "前边", "qiánbian", "n.", "in front; ahead", "ข้างหน้า", 42, 56],
];
const vocabulary = vocabularyPages.map(([index, hanzi, pinyin, type, en, thAid, page, pdfPage]) => ({ index, hanzi, pinyin, type, en, th: thAid, thAid, page, translationKind: "editorial-aid", sourceRef: lessonHsk2L5SourceRef(String(page), String(pdfPage)) }));
const line = (source, value) => ({ ...value, sourceRef: source });
const callRef = lessonHsk2L5SourceRef("38", "52");
const greetingRef = lessonHsk2L5SourceRef("40-41", "54-55");
const mealRef = lessonHsk2L5SourceRef("42-43", "56-57");

const scenes = [
  {
    id: "h2l5-hotel-call", number: "01", glyph: "下", title: "在宾馆楼下", titleTh: "ชั้นล่างของโรงแรม", titleEn: "Downstairs at the hotel", place: "宾馆楼下", placeTh: "ชั้นล่างของโรงแรม", ...art("hotel-call"),
    imageAlt: { th: "แอนนี่โทรหาไป๋เจียเยว่ที่โรงแรม", zh: "宾馆楼下打电话场景", en: "Hotel phone-call scene" }, source: "Text 1 · หน้าเล่ม 38 · PDF หน้า 52", sourcePage: "38", sourceRef: callRef,
    context: "在宾馆楼下，安妮给白家月打电话。", contextTh: "ชั้นล่างของโรงแรม แอนนี่โทรหาไป๋เจียเยว่", contextEn: "Downstairs in the hotel, Annie called Bai Jiayue.",
    characters: [{ role: "A", profile: "annie", noteTh: "ผู้รออยู่ข้างล่างและเร่งให้เพื่อนลงมา", noteZh: "在楼下等并催朋友下来的人", noteEn: "The friend waiting downstairs" }, { role: "B", profile: "bai", noteTh: "ผู้กำลังจะลงจากห้อง", noteZh: "准备从房间下楼的人", noteEn: "The friend about to come downstairs" }],
    lines: [
      line(callRef, { role: "A", speaker: "安妮", pinyin: "Jiāyuè, kuài xiàlái ba, dì-yī cì qù Zhōngguó péngyou jiā, bié wǎn le", hanzi: "家月，快下来吧，第一次去中国朋友家，别晚了。", reading: "Jiāyuè, kuài xiàlái ba, dì-yī cì qù Zhōngguó péngyou jiā, bié wǎn le.", en: "Jiayue, come down quickly. It is our first visit to a Chinese friend’s home; do not be late.", th: "เจียเยว่ รีบลงมาเถอะ ไปบ้านเพื่อนชาวจีนครั้งแรก อย่าสาย", visual: { zh: "快下来吧", th: "รีบลงมา", focus: "68% center" } }),
      line(callRef, { role: "B", speaker: "白家月", pinyin: "hái yǒu shíjiān, nǐ shànglái ba", hanzi: "还有时间，你上来吧。", reading: "Hái yǒu shíjiān, nǐ shànglái ba.", en: "There is still time. Come up.", th: "ยังมีเวลา เธอขึ้นมาสิ", visual: { zh: "你上来吧", th: "เธอขึ้นมา", focus: "30% center" } }),
      line(callRef, { role: "A", speaker: "安妮", pinyin: "wǒ bù shàngqù le, jiù zài xiàmian děng nǐ", hanzi: "我不上去了，就在下面等你。", reading: "Wǒ bù shàngqù le, jiù zài xiàmian děng nǐ.", en: "I am not going up. I will wait for you downstairs.", th: "ฉันไม่ขึ้นไปแล้ว จะรอเธอข้างล่าง", visual: { zh: "在下面等你", th: "รอเธอข้างล่าง", focus: "66% center" } }),
      line(callRef, { role: "B", speaker: "白家月", pinyin: "nà wǒ yíhuìr jiù xiàqù", hanzi: "那我一会儿就下去。", reading: "Nà wǒ yíhuìr jiù xiàqù.", en: "Then I will go down in a moment.", th: "งั้นเดี๋ยวฉันจะลงไป", visual: { zh: "一会儿就下去", th: "เดี๋ยวจะลงไป", focus: "32% center" } }),
      line(callRef, { role: "A", speaker: "安妮", pinyin: "nǐ kuài diǎnr ba", hanzi: "你快点儿吧。", reading: "Nǐ kuài diǎnr ba.", en: "Hurry up.", th: "เธอเร็วหน่อยนะ", visual: { zh: "快点儿", th: "เร็วหน่อย", focus: "64% center" } }),
      line(callRef, { role: "B", speaker: "白家月", pinyin: "méishì, Yīxuě jiě shuō shíyī diǎn qián dào jiù kěyǐ", hanzi: "没事，一雪姐说11点前到就可以。", reading: "Méishì, Yīxuě jiě shuō shíyī diǎn qián dào jiù kěyǐ.", en: "It is fine. Sister Yixue said arriving before eleven is enough.", th: "ไม่เป็นไร พี่อี้เสวี่ยบอกว่าถึงก่อนสิบเอ็ดโมงก็พอ", visual: { zh: "11点前到", th: "ถึงก่อนสิบเอ็ดโมง", focus: "34% center" } }),
    ],
    qte: { after: 2, prompt: { th: "แอนนี่รอไป๋เจียเยว่อยู่ที่ไหน?", zh: "安妮在哪儿等白家月？", en: "Where is Annie waiting for Bai Jiayue?" }, options: [{ value: "宾馆楼下", zh: "宾馆楼下", pinyin: "bīnguǎn lóuxià", th: "ชั้นล่างโรงแรม" }, { value: "房间里", zh: "房间里", pinyin: "fángjiān li", th: "ในห้อง" }, { value: "朋友家", zh: "朋友家", pinyin: "péngyou jiā", th: "บ้านเพื่อน" }], correct: "宾馆楼下", evidence: "安妮：就在下面等你。", evidenceTh: "แอนนี่: จะรอเธออยู่ข้างล่าง", sourceRef: callRef },
    builder: { prompt: { th: "เรียงประโยคบอกว่าจะลงไป", zh: "重组趋向补语句", en: "Rebuild the directional-complement sentence" }, answer: ["我", "一会儿", "就", "下去"], tiles: ["下去", "就", "我", "一会儿"], gloss: { 我: "ฉัน", 一会儿: "เดี๋ยว", 就: "ก็จะ", 下去: "ลงไป" }, translationTh: "เดี๋ยวฉันก็จะลงไป", translationEn: "I will go down in a moment.", evidence: "Text 1 · หน้าเล่ม 38", sourceRef: callRef },
  },
  {
    id: "h2l5-family-greeting", number: "02", glyph: "礼", title: "到中国朋友家", titleTh: "มาถึงบ้านเพื่อนชาวจีน", titleEn: "Arriving at a Chinese friend’s home", place: "王一雪家", placeTh: "บ้านหวังอี้เสวี่ย", ...art("family-greeting"),
    imageAlt: { th: "ครอบครัวหวังอี้เสวี่ยต้อนรับแขก", zh: "中国家庭迎客场景", en: "Chinese family welcoming guests" }, source: "Text 2 · หน้าเล่ม 40–41 · PDF หน้า 54–55", sourcePage: "40–41", sourceRef: greetingRef,
    context: "在王一雪家，白家月和安妮来做客。", contextTh: "ไป๋เจียเยว่และแอนนี่มาเยี่ยมบ้านหวังอี้เสวี่ย", contextEn: "Bai Jiayue and Annie were visiting Wang Yixue’s home.",
    characters: [{ role: "A", profile: "wang", noteTh: "เจ้าบ้านที่แนะนำสมาชิกครอบครัว", noteZh: "介绍家人的主人", noteEn: "The host introducing her family" }, { role: "B", profile: "bai", noteTh: "แขกที่นำของขวัญมาให้", noteZh: "带来礼物的客人", noteEn: "The guest bringing presents" }, { role: "C", profile: "grandpaLiu", noteTh: "คุณปู่ที่ต้อนรับแขก", noteZh: "热情招呼客人的爷爷", noteEn: "The grandfather welcoming the guests" }],
    lines: [
      line(greetingRef, { role: "A", speaker: "王一雪", pinyin: "Jiāyuè, Ānnī, kuài jìnlái! wǒ gěi nǐmen jièshào yíxià, zhè shì háizimen de yéye, nǎinai", hanzi: "家月，安妮，快进来！我给你们介绍一下，这是孩子们的爷爷、奶奶。", reading: "Jiāyuè, Ānnī, kuài jìnlái! Wǒ gěi nǐmen jièshào yíxià, zhè shì háizimen de yéye, nǎinai.", en: "Jiayue, Annie, come in! Let me introduce you: these are the children’s grandfather and grandmother.", th: "เจียเยว่ แอนนี่ รีบเข้ามา! ขอแนะนำ นี่คือคุณปู่และคุณย่าของเด็ก ๆ", visual: { zh: "快进来", th: "รีบเข้ามา", focus: "68% center" } }),
      line(greetingRef, { role: "B", speaker: "白家月、安妮", voiceProfiles: ["bai", "annie"], pinyin: "nǐmen hǎo", hanzi: "你们好！", reading: "Nǐmen hǎo!", en: "Hello!", th: "สวัสดีค่ะ!", visual: { zh: "你们好", th: "สวัสดี", focus: "32% center" } }),
      line(greetingRef, { role: "A", speaker: "王一雪", pinyin: "bà, mā, zhè shì Bái Jiāyuè, zhè shì Ānnī. tāmen dōu shì Yīfēi de xuéshēng", hanzi: "爸、妈，这是白家月，这是安妮。她们都是一飞的学生。", reading: "Bà, mā, zhè shì Bái Jiāyuè, zhè shì Ānnī. Tāmen dōu shì Yīfēi de xuéshēng.", en: "Dad, Mom, this is Bai Jiayue, and this is Annie. They are both Yifei’s students.", th: "พ่อ แม่ นี่ไป๋เจียเยว่ นี่แอนนี่ ทั้งคู่เป็นลูกศิษย์ของอี้เฟย", visual: { zh: "她们都是一飞的学生", th: "ทั้งคู่เป็นนักเรียนของอี้เฟย", focus: "66% center" } }),
      line(greetingRef, { role: "C", speaker: "刘爷爷", pinyin: "Jiāyuè, Ānnī, nǐmen hǎo", hanzi: "家月、安妮，你们好！", reading: "Jiāyuè, Ānnī, nǐmen hǎo!", en: "Hello, Jiayue and Annie!", th: "เจียเยว่ แอนนี่ สวัสดี!", visual: { zh: "你们好", th: "สวัสดี", focus: "30% center" } }),
      line(greetingRef, { role: "B", speaker: "白家月", pinyin: "zhè shì sòng nǐmen de lǐwù", hanzi: "这是送你们的礼物。", reading: "Zhè shì sòng nǐmen de lǐwù.", en: "These gifts are for you.", th: "นี่คือของขวัญที่เอามาให้พวกคุณ", visual: { zh: "送你们的礼物", th: "ของขวัญสำหรับพวกคุณ", focus: "36% center" } }),
      line(greetingRef, { role: "C", speaker: "刘爷爷", pinyin: "nǐmen tài kèqi le, hái ná zhème duō lǐwù lái", hanzi: "你们太客气了，还拿这么多礼物来！", reading: "Nǐmen tài kèqi le, hái ná zhème duō lǐwù lái!", en: "You are too kind, bringing so many gifts!", th: "เกรงใจเกินไปแล้ว ยังเอาของขวัญมาเยอะขนาดนี้!", visual: { zh: "太客气了", th: "เกรงใจเกินไป", focus: "28% center" } }),
      line(greetingRef, { role: "B", speaker: "白家月", pinyin: "Yīxuě jiě, zhè shì gěi háizimen zhǔnbèi de lǐwù", hanzi: "一雪姐，这是给孩子们准备的礼物。", reading: "Yīxuě jiě, zhè shì gěi háizimen zhǔnbèi de lǐwù.", en: "Sister Yixue, this is the gift we prepared for the children.", th: "พี่อี้เสวี่ย นี่คือของขวัญที่เตรียมให้เด็ก ๆ", visual: { zh: "给孩子们准备的礼物", th: "ของขวัญที่เตรียมให้เด็ก ๆ", focus: "38% center" } }),
      line(greetingRef, { role: "A", speaker: "王一雪", pinyin: "xièxie! nǐmen bié kèqi, kuài zuò ba", hanzi: "谢谢！你们别客气，快坐吧！", reading: "Xièxie! Nǐmen bié kèqi, kuài zuò ba!", en: "Thank you! Please make yourselves at home and sit down.", th: "ขอบคุณ! ไม่ต้องเกรงใจ รีบนั่งเถอะ", visual: { zh: "别客气，快坐吧", th: "ไม่ต้องเกรงใจ นั่งเถอะ", focus: "64% center" } }),
    ],
    qte: { after: 6, prompt: { th: "ไป๋เจียเยว่และแอนนี่เตรียมอะไรมา?", zh: "白家月和安妮准备了什么？", en: "What did Bai Jiayue and Annie prepare?" }, options: [{ value: "礼物", zh: "礼物", pinyin: "lǐwù", th: "ของขวัญ" }, { value: "奶茶", zh: "奶茶", pinyin: "nǎichá", th: "ชานม" }, { value: "电影票", zh: "电影票", pinyin: "diànyǐngpiào", th: "ตั๋วหนัง" }], correct: "礼物", evidence: "白家月：这是给孩子们准备的礼物。", evidenceTh: "ไป๋เจียเยว่: นี่คือของขวัญที่เตรียมให้เด็ก ๆ", sourceRef: greetingRef },
    builder: { prompt: { th: "เรียงประโยคเชิญเข้าบ้าน", zh: "重组主人邀请客人的句子", en: "Rebuild the host’s invitation" }, answer: ["家月", "安妮", "快", "进来"], tiles: ["进来", "安妮", "快", "家月"], gloss: { 家月: "เจียเยว่", 安妮: "แอนนี่", 快: "รีบ", 进来: "เข้ามา" }, translationTh: "เจียเยว่ แอนนี่ รีบเข้ามา", translationEn: "Jiayue, Annie, come in!", evidence: "Text 2 · หน้าเล่ม 40", sourceRef: greetingRef },
  },
  {
    id: "h2l5-family-meal", number: "03", glyph: "茶", title: "一起吃午饭", titleTh: "รับประทานอาหารกลางวันด้วยกัน", titleEn: "Having lunch together", place: "王一雪家", placeTh: "บ้านหวังอี้เสวี่ย", ...art("family-meal"),
    imageAlt: { th: "ครอบครัวและแขกรับประทานอาหาร", zh: "家庭聚餐场景", en: "Family meal scene" }, source: "Text 3 · หน้าเล่ม 42–43 · PDF หน้า 56–57", sourcePage: "42–43", sourceRef: mealRef,
    context: "在王一雪家，白家月和安妮在吃饭。", contextTh: "ที่บ้านหวังอี้เสวี่ย ไป๋เจียเยว่และแอนนี่กำลังกินข้าว", contextEn: "At Wang Yixue’s home, Bai Jiayue and Annie were having a meal.",
    characters: [{ role: "A", profile: "wang", noteTh: "เจ้าบ้านที่ทำอาหารและชวนไปดูร้านชานม", noteZh: "做饭并邀请客人去商场的主人", noteEn: "The host who cooked and suggests visiting the mall" }, { role: "B", profile: "bai", noteTh: "แขกที่ชอบอาหารและชานม", noteZh: "喜欢饭菜和奶茶的客人", noteEn: "The guest enjoying the food and milk tea" }],
    lines: [
      line(mealRef, { role: "A", speaker: "王一雪", pinyin: "dōu shí'èr diǎn le, wǒmen chīfàn ba", hanzi: "都12点了，我们吃饭吧。", reading: "Dōu shí'èr diǎn le, wǒmen chīfàn ba.", en: "It is already twelve o’clock. Let’s eat.", th: "เที่ยงแล้ว เรากินข้าวกันเถอะ", visual: { zh: "都12点了", th: "เที่ยงแล้ว", focus: "66% center" } }),
      line(mealRef, { role: "B", speaker: "白家月", pinyin: "zhème duō hǎochī de, nín tài kèqi le", hanzi: "这么多好吃的，您太客气了！", reading: "Zhème duō hǎochī de, nín tài kèqi le!", en: "So many delicious dishes—you are too kind!", th: "ของอร่อยเยอะขนาดนี้ คุณเกรงใจเกินไปแล้ว!", visual: { zh: "这么多好吃的", th: "ของอร่อยเยอะมาก", focus: "34% center" } }),
      line(mealRef, { role: "A", speaker: "王一雪", pinyin: "dōu shì wǒ zìjǐ zuò de, nǐmen duō chī diǎnr", hanzi: "都是我自己做的，你们多吃点儿。", reading: "Dōu shì wǒ zìjǐ zuò de, nǐmen duō chī diǎnr.", en: "I made all of these myself. Please eat more.", th: "ฉันทำเองทั้งหมด พวกเธอกินเยอะ ๆ นะ", visual: { zh: "我自己做的", th: "ฉันทำเอง", focus: "64% center" } }),
      line(mealRef, { role: "B", speaker: "白家月", pinyin: "nǎichá yě hěn hǎohē, shì nín zìjǐ zuò de ma", hanzi: "奶茶也很好喝，是您自己做的吗？", reading: "Nǎichá yě hěn hǎohē, shì nín zìjǐ zuò de ma?", en: "The milk tea is delicious too. Did you make it yourself?", th: "ชานมก็อร่อย คุณทำเองหรือคะ?", visual: { zh: "奶茶也很好喝", th: "ชานมก็อร่อย", focus: "36% center" } }),
      line(mealRef, { role: "A", speaker: "王一雪", pinyin: "bú shì, nǎichá shì yéye mǎi de", hanzi: "不是，奶茶是爷爷买的。", reading: "Bú shì, nǎichá shì yéye mǎi de.", en: "No, Grandpa bought the milk tea.", th: "ไม่ใช่ คุณปู่ซื้อชานมมา", visual: { zh: "爷爷买的", th: "คุณปู่ซื้อ", focus: "62% center" } }),
      line(mealRef, { role: "B", speaker: "白家月", pinyin: "zài nǎr mǎi de? wǒ hái méi hēguo zhème hǎohē de nǎichá", hanzi: "在哪儿买的？我还没喝过这么好喝的奶茶。", reading: "Zài nǎr mǎi de? Wǒ hái méi hēguo zhème hǎohē de nǎichá.", en: "Where did he buy it? I have never had milk tea this good.", th: "ซื้อที่ไหนคะ? ฉันยังไม่เคยดื่มชานมอร่อยขนาดนี้", visual: { zh: "还没喝过", th: "ยังไม่เคยดื่ม", focus: "38% center" } }),
      line(mealRef, { role: "A", speaker: "王一雪", pinyin: "jiù zài qiánbian de shāngchǎng, chīwán fàn nǐmen kěyǐ gēn wǒ qù kànkan", hanzi: "就在前边的商场，吃完饭你们可以跟我去看看。", reading: "Jiù zài qiánbian de shāngchǎng, chīwán fàn nǐmen kěyǐ gēn wǒ qù kànkan.", en: "At the mall just ahead. After eating, you can come with me to have a look.", th: "อยู่ที่ห้างข้างหน้านี่เอง กินเสร็จแล้วพวกเธอไปดูกับฉันได้", visual: { zh: "跟我去看看", th: "ไปดูกับฉัน", focus: "60% center" } }),
    ],
    qte: { after: 5, prompt: { th: "ใครเป็นคนซื้อชานม?", zh: "奶茶是谁买的？", en: "Who bought the milk tea?" }, options: [{ value: "爷爷", zh: "爷爷", pinyin: "yéye", th: "คุณปู่" }, { value: "王一雪", zh: "王一雪", pinyin: "Wáng Yīxuě", th: "หวังอี้เสวี่ย" }, { value: "白家月", zh: "白家月", pinyin: "Bái Jiāyuè", th: "ไป๋เจียเยว่" }], correct: "爷爷", evidence: "王一雪：奶茶是爷爷买的。", evidenceTh: "หวังอี้เสวี่ย: คุณปู่เป็นคนซื้อชานม", sourceRef: mealRef },
    builder: { prompt: { th: "เรียงประโยคบอกว่าเที่ยงแล้ว", zh: "重组“都……了”句", en: "Rebuild the 都……了 sentence" }, answer: ["都", "12点", "了"], tiles: ["12点", "了", "都"], gloss: { 都: "ถึง / แล้ว", "12点": "สิบสองโมง", 了: "แล้ว" }, translationTh: "เที่ยงแล้ว", translationEn: "It is already twelve o’clock.", evidence: "Text 3 · หน้าเล่ม 42", sourceRef: mealRef },
  },
];

export const LESSON_HSK2_L5 = {
  id: "hsk2-l5", slug: "lesson-5", level: "hsk2", number: 5, featured: false, sourceRef,
  source: { title: "新HSK教程 2 · New HSK Course 2", lesson: "Lesson 5 · 第一次去中国朋友家", printedPages: "37–45", pdfPages: "51–59", file: "hsk2.pdf", sourceRef },
  title: { zh: "第一次去中国朋友家", pinyin: "Dì-yī cì qù Zhōngguó péngyou jiā", en: "Visiting a Chinese friend’s home for the first time", thAid: "ไปบ้านเพื่อนชาวจีนครั้งแรก" },
  summary: { zh: "白家月和安妮第一次到中国朋友家做客，练习趋向补语和“都……了”。", en: "Bai Jiayue and Annie visit a Chinese friend’s home for the first time, practising directional complements and 都……了.", thAid: "ไป๋เจียเยว่และแอนนี่ไปเยี่ยมบ้านเพื่อนชาวจีนครั้งแรก ฝึกบทเสริมทิศทางและรูป 都……了" },
  translationPolicy: { kind: "editorial-aid", labelTh: "คำแปลไทยเพื่อช่วยเรียน เรียบเรียงจากต้นฉบับ" },
  objectives: [
    { zh: "能听懂并使用趋向补语表达动作的方向。", en: "Use complements of direction to express the direction of an action.", thAid: "ใช้บทเสริมทิศทางบอกทิศของการเคลื่อนไหว", sourceRef: lessonHsk2L5SourceRef("37", "51") },
    { zh: "掌握固定格式“都……了”，能表达已经或者达到的意思。", en: "Use 都……了 to express already or reaching a point.", thAid: "ใช้ 都……了 บอกว่าเกิดขึ้นแล้วหรือถึงจุดหนึ่งแล้ว", sourceRef: lessonHsk2L5SourceRef("37", "51") },
    { zh: "了解中国人见面时的称呼方式。", en: "Understand how Chinese people address one another when they meet.", thAid: "เข้าใจวิธีเรียกขานเมื่อพบกันในวัฒนธรรมจีน", sourceRef: lessonHsk2L5SourceRef("37", "51") },
  ],
  contents: [
    { number: "00", title: "目标与热身", titleTh: "เป้าหมายและการเตรียมบท", detail: "Objectives · Warm-Up", pages: "37", route: "/home/hsk2/lesson-5/preface/", sourceRef: lessonHsk2L5SourceRef("37", "51") },
    { number: "01", title: "在宾馆楼下", titleTh: "ชั้นล่างของโรงแรม", detail: "Text 1 · New Words 1–8", pages: "38–39", scene: 1, sourceRef: lessonHsk2L5SourceRef("38-39", "52-53") },
    { number: "02", title: "到中国朋友家", titleTh: "มาถึงบ้านเพื่อนชาวจีน", detail: "Text 2 · New Words 9–13", pages: "40–41", scene: 2, sourceRef: lessonHsk2L5SourceRef("40-41", "54-55") },
    { number: "03", title: "一起吃午饭", titleTh: "รับประทานอาหารกลางวันด้วยกัน", detail: "Text 3 · New Words 14–15", pages: "42–43", scene: 3, sourceRef: lessonHsk2L5SourceRef("42-43", "56-57") },
    { number: "04", title: "综合练习与活动", titleTh: "แบบฝึกรวมและกิจกรรม", detail: "Text 4 · Exercises · Activity", pages: "43–45", sourceRef: lessonHsk2L5SourceRef("43-45", "57-59") },
  ],
  vocabulary,
  grammarFocus: [
    { title: "简单趋向补语（1）", titleEn: "Simple Complement of Direction (1)", explanationZh: "基本结构是“动词+来/去”；“来”表示动作朝说话人，“去”表示动作背离说话人，常与上、下、进、出、回、过等连用。", explanationEn: "Verb + 来/去 indicates movement toward or away from the speaker and commonly combines with 上, 下, 进, 出, 回, or 过.", thAid: "กริยา + 来/去 บอกการเคลื่อนเข้าหาหรือออกจากผู้พูด เช่น 上来、下去、进来", examples: ["我不上去了，就在下面等你。", "家月到下边了，你下去接她吧。", "我在外边呢，你出来吧。"], sourceRef: lessonHsk2L5SourceRef("39", "53") },
    { title: "简单趋向补语（2）", titleEn: "Simple Complement of Direction (2)", explanationZh: "带宾语时，地点名词放在“来/去”前；事物名词可放在“来/去”前后。其他带宾语的动词可把宾语放在趋向补语后。", explanationEn: "With an object, location nouns precede 来/去, while thing nouns may appear before or after them; other verb-object combinations place the object after the directional complement.", thAid: "เมื่อมีกรรม คำนามสถานที่อยู่หน้า 来/去 ส่วนสิ่งของวางก่อนหรือหลังก็ได้", examples: ["你们太客气了，还拿这么多礼物来！", "家月给我送来了一本书。", "爸爸今天买回了很多水果。"], sourceRef: lessonHsk2L5SourceRef("41", "55") },
    { title: "固定格式“都……了”", titleEn: "Fixed Pattern 都……了", explanationZh: "“都……了”表示已经或达到某个程度，一般带强调或不满的语气。", explanationEn: "The pattern 都……了 means already or up to a certain point and often adds emphasis or dissatisfaction.", thAid: "ใช้บอกว่าเลยมาถึงจุดหนึ่งแล้ว มักมีน้ำเสียงเน้นหรือไม่พอใจ", examples: ["都12点了，我们吃饭吧。", "都8点半了，你还不起床吗？", "我都去过北京了，不想再去了。"], sourceRef: lessonHsk2L5SourceRef("43", "57") },
  ],
  characters,
  scenes,
};
