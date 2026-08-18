import { group3AssetPath } from "../../../../config.js";

const SOURCE_FILE = "docs/references/hsk/sources/hsk2.pdf";
export const lessonHsk2L8SourceRef = (printedPages, pdfPages) => `${SOURCE_FILE}#printed-pages=${printedPages}&pdf-pages=${pdfPages}`;
const sourceRef = lessonHsk2L8SourceRef("64-72", "78-86");
const art = (scene) => ({ image: group3AssetPath(`/assets/group3/lesson-hsk2-l8-${scene}-v1.webp`), imageSrcSet: `${group3AssetPath(`/assets/group3/lesson-hsk2-l8-${scene}-720w-v1.webp`)} 720w, ${group3AssetPath(`/assets/group3/lesson-hsk2-l8-${scene}-v1.webp`)} 1400w` });
const characters = {
  wang: { hanzi: "王一雪", pinyin: "Wáng Yīxuě", nameTh: "หวังอี้เสวี่ย", nameEn: "Wang Yixue", ...art("watches"), imageFocus: "32% center" },
  liu: { hanzi: "刘明", pinyin: "Liú Míng", nameTh: "หลิวหมิง", nameEn: "Liu Ming", ...art("birthday"), imageFocus: "70% center" },
};
const vocabularyPages = [
  [1, "手表", "shǒubiǎo", "n.", "wristwatch", "นาฬิกาข้อมือ", 65, 79],
  [2, "左边", "zuǒbian", "n.", "left; left side", "ด้านซ้าย", 65, 79],
  [3, "左", "zuǒ", "n.", "left", "ซ้าย", 65, 79],
  [4, "比", "bǐ", "prep./v.", "than; compare", "กว่า / เปรียบเทียบ", 65, 79],
  [5, "右边", "yòubian", "n.", "right; right side", "ด้านขวา", 65, 79],
  [6, "右", "yòu", "n.", "right", "ขวา", 65, 79],
  [7, "记得", "jìde", "v.", "remember", "จำได้", 67, 81],
  [8, "爱情片", "àiqíngpiàn", "n.", "romantic movie", "ภาพยนตร์โรแมนติก", 67, 81],
  [9, "有意思", "yǒuyìsi", "adj.", "interesting", "น่าสนใจ", 67, 81],
  [10, "点", "diǎn", "v.", "select; order", "เลือก / สั่งอาหาร", 69, 83],
  [11, "虽然", "suīrán", "conj.", "although", "แม้ว่า", 69, 83],
  [12, "但是", "dànshì", "conj.", "but; yet", "แต่ / แต่ว่า", 69, 83],
  [13, "花", "huā", "v.", "spend", "ใช้ (เงิน/เวลา)", 69, 83],
  [14, "妻子", "qīzi", "n.", "wife", "ภรรยา", 70, 84],
  [15, "丈夫", "zhàngfu", "n.", "husband", "สามี", 70, 84],
  [16, "饭馆", "fànguǎn", "n.", "restaurant", "ร้านอาหาร", 70, 84],
  [17, "便宜", "piányi", "adj.", "cheap", "ราคาถูก", 65, 79],
  [18, "电影票", "diànyǐngpiào", "n.", "movie ticket", "ตั๋วภาพยนตร์", 67, 81],
  [19, "网上", "wǎngshàng", "n.", "online; on the internet", "ทางออนไลน์", 67, 81],
  [20, "快乐", "kuàilè", "adj.", "happy", "มีความสุข", 69, 83],
];
const vocabulary = vocabularyPages.map(([index, hanzi, pinyin, type, en, thAid, page, pdfPage]) => ({ index, hanzi, pinyin, type, en, th: thAid, thAid, page, translationKind: "editorial-aid", sourceRef: lessonHsk2L8SourceRef(String(page), String(pdfPage)) }));
const line = (ref, role, speaker, pinyin, hanzi, en, th, focus) => ({ role, speaker, pinyin, reading: pinyin, hanzi, en, th, visual: { zh: hanzi, th, focus }, sourceRef: ref });
const watchesRef = lessonHsk2L8SourceRef("65", "79");
const cinemaRef = lessonHsk2L8SourceRef("67", "81");
const birthdayRef = lessonHsk2L8SourceRef("69", "83");
const scenes = [
  {
    id: "h2l8-watches", number: "01", glyph: "表", title: "比较两块手表", titleTh: "เปรียบเทียบนาฬิกาสองเรือน", titleEn: "Comparing two watches", place: "商场",
    placePy: "shāngchǎng", placeTh: "ห้างสรรพสินค้า", ...art("watches"),
    imageAlt: { th: "หวังอี้เสวี่ยกับหลิวหมิงดูนาฬิกาในห้าง", zh: "商场看手表场景", en: "Looking at watches in a mall" }, source: "Text 1 · หน้าเล่ม 65 · PDF หน้า 79", sourcePage: "65", sourceRef: watchesRef,
    context: "在商场，王一雪和刘明比较两块手表的样子和价格。", contextTh: "ในห้างสรรพสินค้า หวังอี้เสวี่ยกับหลิวหมิงเปรียบเทียบรูปลักษณ์และราคาของนาฬิกาสองเรือน", contextEn: "At a mall, Wang Yixue and Liu Ming compare the appearance and price of two watches.",
    characters: [{ role: "A", profile: "wang", noteTh: "ภรรยาที่ชอบเรือนด้านซ้าย", noteZh: "喜欢左边手表的妻子", noteEn: "The wife who prefers the left watch" }, { role: "B", profile: "liu", noteTh: "สามีที่ดูราคา", noteZh: "查看价格的丈夫", noteEn: "The husband checking the price" }],
    lines: [
      line(watchesRef, "A", "王一雪", "Nǐ kàn, zhè liǎng kuài shǒubiǎo zěnmeyàng?", "你看，这两块手表怎么样？", "Look, what do you think of these two watches?", "ดูสิ นาฬิกาสองเรือนนี้เป็นอย่างไร?", "32% center"),
      line(watchesRef, "B", "刘明", "Dōu búcuò!", "都不错！", "They are both nice!", "ดีทั้งคู่เลย!", "70% center"),
      line(watchesRef, "A", "王一雪", "Wǒ xǐhuan zuǒbian zhège.", "我喜欢左边这个。", "I prefer the one on the left.", "ฉันชอบเรือนด้านซ้าย", "32% center"),
      line(watchesRef, "B", "刘明", "Wǒ yě juéde zuǒbian de bǐ yòubian de hǎokàn.", "我也觉得左边的比右边的好看。", "I also think the left one looks better than the right one.", "ผมก็คิดว่าเรือนด้านซ้ายสวยกว่าเรือนด้านขวา", "70% center"),
      line(watchesRef, "A", "王一雪", "Nǐ kànkan yào duōshao qián!", "你看看要多少钱！", "Check how much it costs!", "คุณดูสิว่าราคาเท่าไร!", "32% center"),
      line(watchesRef, "B", "刘明", "Zhēn bù piányi! Bā qiān bā!", "真不便宜！八千八！", "It is really not cheap—8,800 yuan!", "ไม่ถูกจริง ๆ แปดพันแปดร้อยหยวน!", "70% center"),
    ],
    qte: { after: 4, prompt: { th: "ทั้งคู่คิดว่านาฬิกาเรือนไหนสวยกว่า?", zh: "他们觉得哪块手表更好看？", en: "Which watch do they think looks better?" }, options: [{ value: "左边的", zh: "左边的", pinyin: "zuǒbian de", th: "เรือนด้านซ้าย" }, { value: "右边的", zh: "右边的", pinyin: "yòubian de", th: "เรือนด้านขวา" }, { value: "一样", zh: "一样", pinyin: "yíyàng", th: "เหมือนกัน" }], correct: "左边的", evidence: "左边的比右边的好看。", evidenceTh: "เรือนด้านซ้ายสวยกว่าเรือนด้านขวา", sourceRef: watchesRef },
    builder: { prompt: { th: "เรียงประโยคเปรียบเทียบนาฬิกา", zh: "重组比较两块手表的句子", en: "Rebuild the watch comparison" }, answer: ["左边的", "比", "右边的", "好看"], tiles: ["好看", "右边的", "比", "左边的"], gloss: { 左边的: "เรือนด้านซ้าย", 比: "กว่า", 右边的: "เรือนด้านขวา", 好看: "สวย" }, translationTh: "เรือนด้านซ้ายสวยกว่าเรือนด้านขวา", translationEn: "The left one looks better than the right one.", evidence: "Text 1 · หน้าเล่ม 65", sourceRef: watchesRef },
  },
  {
    id: "h2l8-cinema", number: "02", glyph: "影", title: "网上买电影票", titleTh: "ซื้อตั๋วหนังทางออนไลน์", titleEn: "Buying movie tickets online", place: "电影院外面", placeTh: "หน้าโรงภาพยนตร์", ...art("cinema"),
    imageAlt: { th: "หวังอี้เสวี่ยกับหลิวหมิงเลือกภาพยนตร์", zh: "电影院外选电影场景", en: "Choosing a film outside the cinema" }, source: "Text 2 · หน้าเล่ม 67 · PDF หน้า 81", sourcePage: "67", sourceRef: cinemaRef,
    context: "在电影院外面，两个人比较电影，也决定在网上买票。", contextTh: "หน้าโรงภาพยนตร์ ทั้งสองเปรียบเทียบภาพยนตร์และตัดสินใจซื้อตั๋วทางออนไลน์", contextEn: "Outside the cinema, they compare films and decide to buy tickets online.",
    characters: [{ role: "A", profile: "liu", noteTh: "สามีที่เสนอหนังโรแมนติก", noteZh: "提议看爱情片的丈夫", noteEn: "The husband suggesting a romantic film" }, { role: "B", profile: "wang", noteTh: "ภรรยาที่ดูรีวิวออนไลน์", noteZh: "参考网上介绍的妻子", noteEn: "The wife consulting online information" }],
    lines: [
      line(cinemaRef, "A", "刘明", "Jīntiān yǒu bù shǎo diànyǐng, wǒmen kàn ge diànyǐng ba.", "今天有不少电影，我们看个电影吧。", "There are quite a few films today. Let’s watch one.", "วันนี้มีหนังไม่น้อย เราดูหนังสักเรื่องกันเถอะ", "70% center"),
      line(cinemaRef, "B", "王一雪", "Hǎo a! Wǒmen kàn nǎge?", "好啊！我们看哪个？", "Great! Which one shall we watch?", "ดีสิ เราดูเรื่องไหนดี?", "32% center"),
      line(cinemaRef, "A", "刘明", "Wǒ jìde nǐ xǐhuan kàn àiqíngpiàn, wǒmen kàn nàge àiqíngpiàn, zěnmeyàng?", "我记得你喜欢看爱情片，我们看那个爱情片，怎么样？", "I remember you like romantic films. How about that one?", "ผมจำได้ว่าคุณชอบหนังรัก เราดูหนังรักเรื่องนั้นดีไหม?", "70% center"),
      line(cinemaRef, "B", "王一雪", "Háishi kàn zhège ba, wǒ kàn wǎngshàng shuō zhège diànyǐng bǐ nàge àiqíngpiàn gèng yǒuyìsi.", "还是看这个吧，我看网上说这个电影比那个爱情片更有意思。", "Let’s watch this one instead. Online reviews say it is more interesting than that romantic film.", "ดูเรื่องนี้ดีกว่า ฉันเห็นในอินเทอร์เน็ตว่าหนังเรื่องนี้น่าสนใจกว่าหนังรักเรื่องนั้น", "32% center"),
      line(cinemaRef, "A", "刘明", "Hǎo. Wǒ qù mǎi piào.", "好。我去买票。", "Okay. I will buy the tickets.", "ได้ ผมไปซื้อตั๋ว", "70% center"),
      line(cinemaRef, "B", "王一雪", "Dào wǎngshàng mǎi ba, wǎngshàng mǎi bǐ zài zhèlǐ mǎi piányi.", "到网上买吧，网上买比在这里买便宜。", "Buy them online; buying online is cheaper than buying here.", "ซื้อทางออนไลน์เถอะ ซื้อออนไลน์ถูกกว่าซื้อที่นี่", "32% center"),
    ],
    qte: { after: 4, prompt: { th: "ทำไมหวังอี้เสวี่ยจึงให้ซื้อตั๋วออนไลน์?", zh: "王一雪为什么建议在网上买票？", en: "Why does Wang Yixue suggest buying tickets online?" }, options: [{ value: "更便宜", zh: "更便宜", pinyin: "gèng piányi", th: "ถูกกว่า" }, { value: "更近", zh: "更近", pinyin: "gèng jìn", th: "ใกล้กว่า" }, { value: "电影更多", zh: "电影更多", pinyin: "diànyǐng gèng duō", th: "มีหนังมากกว่า" }], correct: "更便宜", evidence: "网上买比在这里买便宜。", evidenceTh: "ซื้อออนไลน์ถูกกว่าซื้อที่นี่", sourceRef: cinemaRef },
    builder: { prompt: { th: "เรียงประโยคเปรียบเทียบความน่าสนใจของหนัง", zh: "重组带“更”的比较句", en: "Rebuild the comparison with 更" }, answer: ["这个电影", "比", "那个爱情片", "更", "有意思"], tiles: ["有意思", "这个电影", "更", "比", "那个爱情片"], gloss: { 这个电影: "หนังเรื่องนี้", 比: "กว่า", 那个爱情片: "หนังรักเรื่องนั้น", 更: "ยิ่งกว่า", 有意思: "น่าสนใจ" }, translationTh: "หนังเรื่องนี้น่าสนใจกว่าหนังรักเรื่องนั้น", translationEn: "This film is more interesting than that romantic film.", evidence: "Text 2 · หน้าเล่ม 67", sourceRef: cinemaRef },
  },
  {
    id: "h2l8-birthday", number: "03", glyph: "忘", title: "虽然你忘了，但是我记得", titleTh: "แม้คุณลืม แต่ผมจำได้", titleEn: "Even though you forgot, I remembered", place: "饭馆",
    placePy: "fànguǎn", placeTh: "ร้านอาหาร", ...art("birthday"),
    imageAlt: { th: "หลิวหมิงฉลองวันเกิดให้หวังอี้เสวี่ย", zh: "饭馆生日庆祝场景", en: "Birthday celebration in a restaurant" }, source: "Text 3 · หน้าเล่ม 69 · PDF หน้า 83", sourcePage: "69", sourceRef: birthdayRef,
    context: "在饭馆，刘明提醒王一雪今天是她的生日，并送给她手表。", contextTh: "ในร้านอาหาร หลิวหมิงเตือนหวังอี้เสวี่ยว่าวันนี้เป็นวันเกิดของเธอและมอบนาฬิกาให้", contextEn: "At a restaurant, Liu reminds Wang that it is her birthday and gives her a watch.",
    characters: [{ role: "A", profile: "liu", noteTh: "สามีที่จำวันเกิดได้", noteZh: "记得妻子生日的丈夫", noteEn: "The husband who remembers the birthday" }, { role: "B", profile: "wang", noteTh: "ภรรยาที่ลืมวันเกิดตัวเอง", noteZh: "忘了自己生日的妻子", noteEn: "The wife who forgot her own birthday" }],
    lines: [
      line(birthdayRef, "A", "刘明", "Nín hǎo! Jiù yào zhè jǐ ge cài ba, xièxie!", "您好！就要这几个菜吧，谢谢！", "Hello! We will have these dishes, thank you!", "สวัสดีครับ เอาอาหารไม่กี่จานนี้ ขอบคุณครับ", "70% center"),
      line(birthdayRef, "B", "王一雪", "Zěnme diǎn zhème duō cài?", "怎么点这么多菜？", "Why did you order so many dishes?", "ทำไมสั่งอาหารมากขนาดนี้?", "32% center"),
      line(birthdayRef, "A", "刘明", "Nǐ xiǎngxiang, jīntiān shì jǐ yuè jǐ hào?", "你想想，今天是几月几号？", "Think about it. What is today’s date?", "ลองคิดดูสิ วันนี้วันที่เท่าไรเดือนอะไร?", "70% center"),
      line(birthdayRef, "B", "王一雪", "Bā yuè èrshíqī hào. A! Wǒ de shēngrì!", "8月27号。啊！我的生日！", "August 27th. Ah! My birthday!", "วันที่ 27 สิงหาคม อ๊ะ วันเกิดฉัน!", "32% center"),
      line(birthdayRef, "A", "刘明", "Shēngrì kuàilè! Suīrán nǐ wàng le, dànshì wǒ jìde. Kànkan zhè shì shénme?", "生日快乐！虽然你忘了，但是我记得。看看这是什么？", "Happy birthday! Even though you forgot, I remembered. Look—what is this?", "สุขสันต์วันเกิด! แม้คุณลืม แต่ผมจำได้ ดูสิว่านี่คืออะไร?", "70% center"),
      line(birthdayRef, "B", "王一雪", "Shǒubiǎo! Chīfàn, kàn diànyǐng, mǎi shǒubiǎo, jīntiān huā le bù shǎo qián ba?", "手表！吃饭、看电影、买手表，今天花了不少钱吧？", "A watch! Dinner, a film, and a watch—you spent quite a lot today, right?", "นาฬิกา! ทั้งกินข้าว ดูหนัง และซื้อนาฬิกา วันนี้ใช้เงินไปไม่น้อยใช่ไหม?", "32% center"),
      line(birthdayRef, "A", "刘明", "Suīrán huā le yìxiē qián, dànshì wǒmen guò le yí ge kuàilè de shēngrì.", "虽然花了一些钱，但是我们过了一个快乐的生日。", "Although we spent some money, we celebrated a happy birthday.", "แม้ใช้เงินไปบ้าง แต่เราได้ฉลองวันเกิดอย่างมีความสุข", "70% center"),
    ],
    qte: { after: 5, prompt: { th: "ใครจำวันเกิดของหวังอี้เสวี่ยได้?", zh: "谁记得王一雪的生日？", en: "Who remembered Wang Yixue’s birthday?" }, options: [{ value: "刘明", zh: "刘明", pinyin: "Liú Míng", th: "หลิวหมิง" }, { value: "王一雪", zh: "王一雪", pinyin: "Wáng Yīxuě", th: "หวังอี้เสวี่ย" }, { value: "刘小雪", zh: "刘小雪", pinyin: "Liú Xiǎoxuě", th: "หลิวเสี่ยวเสวี่ย" }], correct: "刘明", evidence: "虽然你忘了，但是我记得。", evidenceTh: "แม้คุณลืม แต่ผมจำได้", sourceRef: birthdayRef },
    builder: { prompt: { th: "เรียงประโยคแม้ว่า...แต่...", zh: "重组“虽然……但是……”句", en: "Rebuild the although-but sentence" }, answer: ["虽然", "你", "忘了", "但是", "我", "记得"], tiles: ["我", "虽然", "记得", "你", "但是", "忘了"], gloss: { 虽然: "แม้ว่า", 你: "คุณ", 忘了: "ลืมแล้ว", 但是: "แต่", 我: "ผม", 记得: "จำได้" }, translationTh: "แม้คุณลืม แต่ผมจำได้", translationEn: "Even though you forgot, I remembered.", evidence: "Text 3 · หน้าเล่ม 69", sourceRef: birthdayRef },
  },
];

export const LESSON_HSK2_L8 = {
  id: "hsk2-l8", slug: "lesson-8", level: "hsk2", number: 8, featured: false, sourceRef,
  source: { title: "新HSK教程 2 · New HSK Course 2", lesson: "Lesson 8 · 虽然你忘了，但是我记得", printedPages: "64–72", pdfPages: "78–86", file: "hsk2.pdf", sourceRef },
  title: { zh: "虽然你忘了，但是我记得", pinyin: "Suīrán nǐ wàng le, dànshì wǒ jìde", en: "Even though you forgot, I remembered", thAid: "แม้คุณลืม แต่ผมจำได้" },
  summary: { zh: "王一雪和刘明比较手表、电影和购票方式，并庆祝生日，学习比较句和“虽然……但是……”。", en: "Wang and Liu compare watches, films, and ticket-buying options, then celebrate a birthday while practising comparisons and 虽然…但是….", thAid: "หวังอี้เสวี่ยกับหลิวหมิงเปรียบเทียบนาฬิกา หนัง และวิธีซื้อตั๋ว ก่อนฉลองวันเกิดและฝึก 虽然…但是…" },
  translationPolicy: { kind: "editorial-aid", labelTh: "คำแปลไทยเพื่อช่วยเรียน เรียบเรียงจากต้นฉบับ" },
  objectives: [
    { zh: "能听懂并谈论生日的庆祝活动。", en: "Understand and discuss birthday celebrations.", thAid: "เข้าใจและสนทนาเรื่องกิจกรรมฉลองวันเกิด", sourceRef: lessonHsk2L8SourceRef("64", "78") },
    { zh: "能听懂并使用“比”描述事物之间的差别。", en: "Use 比 to describe differences between things.", thAid: "ใช้ 比 เพื่อบอกความแตกต่างระหว่างสิ่งต่าง ๆ", sourceRef: lessonHsk2L8SourceRef("64", "78") },
    { zh: "掌握转折复句“虽然……，但是……”的用法，能表达语义的转折。", en: "Master the adversative complex sentence 虽然……，但是…… to express semantic contrast.", thAid: "ใช้ประโยค 虽然……，但是…… เพื่อแสดงความหมายที่หักมุมหรือขัดแย้ง", sourceRef: lessonHsk2L8SourceRef("64", "78") },
    { zh: "了解中国人对一些数字的喜好。", en: "Understand Chinese people’s preferences for certain numbers.", thAid: "เรียนรู้ความนิยมของชาวจีนที่มีต่อตัวเลขบางตัว", sourceRef: lessonHsk2L8SourceRef("64", "78") },
  ],
  contents: [
    { number: "00", title: "目标与热身", titleTh: "เป้าหมายและการเตรียมบท", detail: "Objectives · Warm-Up", pages: "64", route: "/home/hsk2/lesson-8/preface/", sourceRef: lessonHsk2L8SourceRef("64", "78") },
    { number: "01", title: "比较两块手表", titleTh: "เปรียบเทียบนาฬิกาสองเรือน", detail: "Text 1 · New Words 1–6", pages: "65–66", scene: 1, sourceRef: lessonHsk2L8SourceRef("65-66", "79-80") },
    { number: "02", title: "网上买电影票", titleTh: "ซื้อตั๋วหนังทางออนไลน์", detail: "Text 2 · New Words 7–9", pages: "66–68", scene: 2, sourceRef: lessonHsk2L8SourceRef("66-68", "80-82") },
    { number: "03", title: "生日惊喜", titleTh: "เซอร์ไพรส์วันเกิด", detail: "Text 3 · New Words 10–13", pages: "68–70", scene: 3, sourceRef: lessonHsk2L8SourceRef("68-70", "82-84") },
    { number: "04", title: "一天与综合练习", titleTh: "หนึ่งวันและแบบฝึกรวม", detail: "Text 4 · Exercises", pages: "70–72", sourceRef: lessonHsk2L8SourceRef("70-72", "84-86") },
  ],
  vocabulary,
  grammarFocus: [
    { title: "比较句（1）", titleEn: "Comparative Sentences (1)", explanationZh: "用介词“比”比较性质和状态，基本结构是“A比B+形容词或形容词性短语”。", explanationEn: "Use 比 to compare qualities or states in the pattern A + 比 + B + adjective.", thAid: "ใช้ 比 เปรียบเทียบคุณสมบัติหรือสภาพในรูป A + 比 + B + คำคุณศัพท์", examples: ["左边的比右边的好看。", "今天比昨天冷。", "踢足球比打篮球有意思。"], sourceRef: lessonHsk2L8SourceRef("66", "80") },
    { title: "比较句（2）", titleEn: "Comparative Sentences (2)", explanationZh: "“比”字句的形容词前不用“很”“非常”，可以用“还”或“更”加强程度。", explanationEn: "Do not place 很 or 非常 before the adjective in a 比 sentence; use 还 or 更 to intensify the difference.", thAid: "หน้าคำคุณศัพท์ในประโยค 比 ไม่ใช้ 很 หรือ 非常 แต่ใช้ 还 หรือ 更 เพื่อเน้นความต่างได้", examples: ["这个电影比那个爱情片更有意思。", "今天比昨天更热。", "奶茶比牛奶还好喝。"], sourceRef: lessonHsk2L8SourceRef("68", "82") },
    { title: "转折复句“虽然……但是……”", titleEn: "Adversative Sentence 虽然…但是…", explanationZh: "“虽然……但是……”表示语义转折，两个关联词可以成对使用，也可以只用其中一个。", explanationEn: "虽然…但是… expresses contrast; the two connectors may appear together or one may be omitted.", thAid: "虽然…但是… ใช้แสดงความขัดแย้ง โดยอาจใช้คู่กันหรือใช้เพียงคำหนึ่ง", examples: ["虽然你忘了，但是我记得。", "外边下雪了，但是不太冷。", "虽然觉得有点儿累，我还是走回家了。"], sourceRef: lessonHsk2L8SourceRef("69-70", "83-84") },
  ],
  characters,
  scenes,
};
