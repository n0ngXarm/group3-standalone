import { group3AssetPath } from "../../../../config.js";

const SOURCE_FILE = "docs/references/hsk/sources/hsk2.pdf";

export function lessonHsk2L9SourceRef(printedPages, pdfPages) {
  return `${SOURCE_FILE}#printed-pages=${printedPages}&pdf-pages=${pdfPages}`;
}

const sourceRef = lessonHsk2L9SourceRef("73-81", "87-95");

const characters = {
  wang: {
    hanzi: "王一雪",
    pinyin: "Wáng Yīxuě",
    nameTh: "หวังอี้เสวี่ย",
    nameEn: "Wang Yixue",
    image: group3AssetPath("/assets/group3/shared/characters/character-wang-yixue.webp"),
  },
  liu: {
    hanzi: "刘明",
    pinyin: "Liú Míng",
    nameTh: "หลิวหมิง",
    nameEn: "Liu Ming",
    image: group3AssetPath("/assets/group3/shared/characters/character-liu-ming.webp"),
  },
};

const vocabularyPages = [
  [1, "坏", "huài", "adj.", "bad; ruined", "เสีย / ขาด (กางเกง)", 74, 88],
  [2, "旁边", "pángbiān", "n.", "side; adjacent place", "ข้าง ๆ / ด้านข้าง", 74, 88],
  [3, "男孩儿", "nánháir", "n.", "boy", "เด็กผู้ชาย", 74, 88],
  [4, "这样", "zhèyàng", "pron.", "such; like this", "แบบนี้ / เช่นนี้", 74, 88],
  [5, "个子", "gèzi", "n.", "height (of a person)", "ส่วนสูง", 74, 88],
  [6, "那么", "nàme", "pron.", "like that; to that degree", "ขนาดนั้น / ถึงเพียงนั้น", 74, 88],
  [7, "高", "gāo", "adj.", "tall; high", "สูง", 74, 88],
  [8, "门口", "ménkǒu", "n.", "doorway; entrance", "หน้าประตู", 76, 90],
  [9, "咖啡", "kāfēi", "n.", "coffee", "กาแฟ", 76, 90],
  [10, "离", "lí", "v.", "be apart/away from", "ห่างจาก / ไกลจาก", 76, 90],
  [11, "近", "jìn", "adj.", "close; nearby", "ใกล้", 78, 92],
  [12, "走路", "zǒulù", "v.", "walk", "เดิน", 78, 92],
  [13, "周", "zhōu", "n.", "week", "สัปดาห์", 80, 94],
  [14, "儿子", "érzi", "n.", "son", "ลูกชาย", 74, 88],
  [15, "上次", "shàngcì", "n.", "last time", "ครั้งที่แล้ว", 74, 88],
  [16, "奶茶", "nǎichá", "n.", "bubble tea; milk tea", "ชานม", 76, 90],
  [17, "时间", "shíjiān", "n.", "time", "เวลา", 76, 90],
  [18, "打车", "dǎchē", "v.", "take a taxi", "นั่งแท็กซี่", 78, 92],
  [19, "运动", "yùndòng", "v./n.", "exercise; sport", "ออกกำลังกาย", 78, 92],
  [20, "睡觉", "shuìjiào", "v.", "sleep", "นอนหลับ", 76, 90],
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
  sourceRef: lessonHsk2L9SourceRef(String(page), String(pdfPage)),
}));

function line(source, value) {
  return { ...value, sourceRef: source };
}

const storeRef = lessonHsk2L9SourceRef("74", "88");
const entranceRef = lessonHsk2L9SourceRef("76", "90");
const coffeeRef = lessonHsk2L9SourceRef("77-78", "91-92");

const scenes = [
  {
    id: "l9-store",
    number: "01",
    glyph: "裤",
    title: "在商店看裤子",
    titleTh: "ดูกางเกงในร้าน",
    titleEn: "Looking at pants in the store",
    place: "商店",
    placeTh: "ร้านขายเสื้อผ้า",
    image: group3AssetPath("/assets/group3/lesson-hsk2-l9-store-v1.webp"),
    imageSrcSet: `${group3AssetPath("/assets/group3/lesson-hsk2-l9-store-720w-v1.webp")} 720w, ${group3AssetPath("/assets/group3/lesson-hsk2-l9-store-v1.webp")} 1400w`,
    imageAlt: {
      th: "การดูกางเกงในร้าน",
      zh: "商店买裤照片",
      en: "Pants shopping scene",
    },
    source: "Text 1 · หน้าเล่ม 74 · PDF หน้า 88",
    sourcePage: "74",
    sourceRef: storeRef,
    context: "在商店，王一雪和刘明在看裤子。",
    contextTh: "ในร้าน หวังอี้เสวี่ยและหลิวหมิงกำลังดูกางเกง",
    contextEn: "In the store, Wang Yixue and Liu Ming were looking at pants.",
    characters: [
      { role: "A", profile: "wang", noteTh: "แม่ที่อยากซื้อกางเกงใหม่ให้ลูกชาย", noteZh: "想给儿子买新裤子的妈妈", noteEn: "The mother buying new pants for her son" },
      { role: "B", profile: "liu", noteTh: "พ่อที่ให้ความเห็นเรื่องขนาดและความสูง", noteZh: "对裤子和身高给意见的爸爸", noteEn: "The father giving his opinion" },
    ],
    lines: [
      line(storeRef, { role: "A", speaker: "王一雪", pinyin: "wǒmen gěi tā mǎi tiáo xīn de ba", hanzi: "儿子的裤子坏了，我们给他买条新的吧。", reading: "Érzi de kùzi huài le, wǒmen gěi tā mǎi tiáo xīn de ba.", en: "Our son’s pants are torn. Let’s buy him a new pair.", th: "กางเกงของลูกชายขาดแล้ว เราซื้อตัวใหม่ให้เขากันเถอะ", visual: { zh: "买条新的", th: "ซื้อตัวใหม่", focus: "42% center" } }),
      line(storeRef, { role: "B", speaker: "刘明", pinyin: "hǎo a", hanzi: "好啊。", reading: "Hǎo a.", en: "Okay.", th: "ได้", visual: { zh: "好啊", th: "ได้", focus: "58% center" } }),
      line(storeRef, { role: "A", speaker: "王一雪", pinyin: "nǐ kàn zhè tiáo hēisè de zěnmeyàng", hanzi: "你看这条黑色的怎么样？", reading: "Nǐ kàn zhè tiáo hēisè de zěnmeyàng?", en: "How about this pair of black ones?", th: "ดูตัวสีดำนี้เป็นอย่างไร?", visual: { zh: "黑色的", th: "สีดำ", focus: "36% center" } }),
      line(storeRef, { role: "B", speaker: "刘明", pinyin: "méiyǒu nǐ shàngcì mǎi de nà tiáo hǎokàn", hanzi: "没有你上次买的那条好看。", reading: "Méiyǒu nǐ shàngcì mǎi de nà tiáo hǎokàn.", en: "They’re not as nice as the ones you bought last time.", th: "ไม่สวยเท่าตัวที่ซื้อครั้งก่อน", visual: { zh: "没有…好看", th: "ไม่สวยเท่า…", focus: "60% center" } }),
      line(storeRef, { role: "A", speaker: "王一雪", pinyin: "pángbiān nàge nánháir jiù chuān le zhèyàng de kùzi", hanzi: "旁边那个男孩儿就穿了这样的裤子，我觉得很好看啊！", reading: "Pángbiān nàge nánháir jiù chuān le zhèyàng de kùzi, wǒ juéde hěn hǎokàn a!", en: "The boy next to us is wearing pants like these, and I think they look great!", th: "เด็กผู้ชายคนข้าง ๆ ก็ใส่กางเกงแบบนี้ ฉันว่าสวยมากเลย!", visual: { zh: "这样的裤子", th: "กางเกงแบบนี้", focus: "40% center" } }),
      line(storeRef, { role: "B", speaker: "刘明", pinyin: "érzi de gèzi méiyǒu tā nàme gāo", hanzi: "儿子的个子没有他那么高，穿上就不会太好看了。", reading: "Érzi de gèzi méiyǒu tā nàme gāo, chuānshang jiù bú huì tài hǎokàn le.", en: "Our son isn’t as tall as him, so they wouldn’t look so good on him.", th: "ลูกชายสูงไม่เท่าเขา ใส่แล้วคงไม่ค่อยสวย", visual: { zh: "没有…那么高", th: "ไม่สูงเท่า…", focus: "56% center" } }),
      line(storeRef, { role: "A", speaker: "王一雪", pinyin: "wǒmen zài qù nàbiān kànkan ba", hanzi: "好吧，我们再去那边看看吧。", reading: "Hǎo ba, wǒmen zài qù nàbiān kànkan ba.", en: "Alright, let’s go over there and take another look.", th: "เอาล่ะ เราไปดูทางนั้นอีกทีเถอะ", visual: { zh: "去那边看看", th: "ไปดูทางนั้น", focus: "44% center" } }),
    ],
    qte: {
      after: 3,
      prompt: { th: "หลิวหมิงคิดว่ากางเกงดำตัวนี้เป็นอย่างไร?", zh: "刘明觉得这条黑色的裤子怎么样？", en: "What does Liu Ming think of the black pants?" },
      options: [
        { value: "很好看", zh: "很好看", pinyin: "hěn hǎokàn", th: "สวยมาก" },
        { value: "没有上次买的那条好看", zh: "没有上次买的那条好看", pinyin: "méiyǒu shàngcì mǎi de nà tiáo hǎokàn", th: "ไม่สวยเท่าตัวที่ซื้อครั้งก่อน" },
        { value: "太贵了", zh: "太贵了", pinyin: "tài guì le", th: "แพงเกินไป" },
      ],
      correct: "没有上次买的那条好看",
      evidence: "刘明：没有你上次买的那条好看。",
      evidenceTh: "หลิวหมิง: ไม่สวยเท่าตัวที่ซื้อครั้งก่อน",
      sourceRef: storeRef,
    },
    builder: {
      prompt: { th: "เรียงประโยคเปรียบเทียบความสูงของหลิวหมิง", zh: "重组刘明比较身高的句子", en: "Rebuild Liu Ming’s comparison sentence" },
      answer: ["儿子", "的", "个子", "没有", "他", "那么", "高"],
      tiles: ["那么", "高", "个子", "他", "没有", "儿子", "的"],
      gloss: { 儿子: "ลูกชาย", 的: "ของ", 个子: "ส่วนสูง", 没有: "ไม่เท่า", 他: "เขา", 那么: "ขนาดนั้น", 高: "สูง" },
      translationTh: "ลูกชายสูงไม่เท่าเขา",
      translationEn: "Our son isn’t as tall as him.",
      evidence: "Text 1 · หน้าเล่ม 74",
      sourceRef: storeRef,
    },
  },
  {
    id: "l9-entrance",
    number: "02",
    glyph: "奶",
    title: "在商店门口买奶茶",
    titleTh: "ซื้อชานมหน้าร้าน",
    titleEn: "Buying bubble tea at the entrance",
    place: "商店门口",
    placeTh: "หน้าร้าน",
    image: group3AssetPath("/assets/group3/lesson-hsk2-l9-entrance-v1.webp"),
    imageSrcSet: `${group3AssetPath("/assets/group3/lesson-hsk2-l9-entrance-720w-v1.webp")} 720w, ${group3AssetPath("/assets/group3/lesson-hsk2-l9-entrance-v1.webp")} 1400w`,
    imageAlt: {
      th: "หน้าร้านมีร้านชานม",
      zh: "商店门口照片",
      en: "Store entrance scene",
    },
    source: "Text 2 · หน้าเล่ม 76 · PDF หน้า 90",
    sourcePage: "76",
    sourceRef: entranceRef,
    context: "在商店门口，王一雪和刘明往外走。",
    contextTh: "ที่หน้าร้าน หวังอี้เสวี่ยและหลิวหมิงกำลังจะเดินออกมา",
    contextEn: "At the entrance of the store, Wang Yixue and Liu Ming were walking out.",
    characters: [
      { role: "A", profile: "wang", noteTh: "ผู้เสนอซื้อชานมแต่ไม่ดื่มกาแฟ", noteZh: "提议喝奶茶却不喝咖啡的人", noteEn: "The one suggesting bubble tea, avoiding coffee" },
      { role: "B", profile: "liu", noteTh: "ผู้ที่อยากดื่มกาแฟจากร้านเดิม", noteZh: "想喝咖啡的人", noteEn: "The one who prefers coffee" },
    ],
    lines: [
      line(entranceRef, { role: "A", speaker: "王一雪", pinyin: "ménkǒu yǒu jiā nǎichá diàn", hanzi: "门口有家奶茶店。你想喝杯奶茶吗？", reading: "Ménkǒu yǒu jiā nǎichá diàn. Nǐ xiǎng hē bēi nǎichá ma?", en: "There’s a bubble tea shop at the entrance. Do you want a cup?", th: "ที่หน้าประตูมีร้านชานม อยากดื่มชานมสักแก้วไหม?", visual: { zh: "奶茶店", th: "ร้านชานม", focus: "40% center" } }),
      line(entranceRef, { role: "B", speaker: "刘明", pinyin: "wǒ xiǎng hē kāfēi, háishì qù kāfēi diàn ba", hanzi: "我想喝咖啡，还是去咖啡店吧。", reading: "Wǒ xiǎng hē kāfēi, háishì qù kāfēi diàn ba.", en: "I’d prefer coffee. Let’s go to a coffee shop.", th: "ฉันอยากดื่มกาแฟ ไปร้านกาแฟดีกว่า", visual: { zh: "咖啡店", th: "ร้านกาแฟ", focus: "58% center" } }),
      line(entranceRef, { role: "A", speaker: "王一雪", pinyin: "kāfēi diàn lí zhèr yǒudiǎnr yuǎn", hanzi: "咖啡店离这儿有点儿远。", reading: "Kāfēi diàn lí zhèr yǒudiǎnr yuǎn.", en: "The coffee shop is a bit far from here.", th: "ร้านกาแฟไกลจากที่นี่หน่อย", visual: { zh: "离…远", th: "ไกลจาก…", focus: "36% center" } }),
      line(entranceRef, { role: "B", speaker: "刘明", pinyin: "méi guānxi, nà jiā diàn de kāfēi hěn hǎo hē", hanzi: "没关系，那家店的咖啡很好喝。", reading: "Méi guānxi, nà jiā diàn de kāfēi hěn hǎo hē.", en: "That’s fine. The coffee in that shop is very good.", th: "ไม่เป็นไร กาแฟร้านนั้นอร่อยมาก", visual: { zh: "很好喝", th: "อร่อยมาก", focus: "56% center" } }),
      line(entranceRef, { role: "A", speaker: "王一雪", pinyin: "nà nǐ děng yíxià, wǒ qù mǎi bēi nǎichá", hanzi: "那你等一下，我去买杯奶茶。", reading: "Nà nǐ děng yíxià, wǒ qù mǎi bēi nǎichá.", en: "Then wait here a moment while I go buy a cup of bubble tea.", th: "งั้นเธอรอแป๊บหนึ่ง ฉันไปซื้อชานม", visual: { zh: "买杯奶茶", th: "ซื้อชานม", focus: "42% center" } }),
      line(entranceRef, { role: "B", speaker: "刘明", pinyin: "nǐ bù xiǎng hē kāfēi ma", hanzi: "你不想喝咖啡吗？", reading: "Nǐ bù xiǎng hē kāfēi ma?", en: "Don’t you want to drink coffee?", th: "เธอไม่อยากดื่มกาแฟเหรอ?", visual: { zh: "不想喝吗", th: "ไม่อยากดื่มเหรอ", focus: "52% center" } }),
      line(entranceRef, { role: "A", speaker: "王一雪", pinyin: "hē le kāfēi, wǎnshang jiù bié xiǎng shuìjiào le", hanzi: "喝了咖啡，晚上就别想睡觉了。", reading: "Hē le kāfēi, wǎnshang jiù bié xiǎng shuìjiào le.", en: "If I drink coffee, I won’t be able to sleep tonight.", th: "ดื่มกาแฟแล้วตอนกลางคืนก็อย่าหวังนอนหลับ", visual: { zh: "别想睡觉", th: "อย่าหวังนอน", focus: "44% center" } }),
    ],
    qte: {
      after: 1,
      prompt: { th: "หวังอี้เสวี่ยอยากดื่มอะไร?", zh: "王一雪想喝什么？", en: "What does Wang Yixue want to drink?" },
      options: [
        { value: "奶茶", zh: "奶茶", pinyin: "nǎichá", th: "ชานม" },
        { value: "咖啡", zh: "咖啡", pinyin: "kāfēi", th: "กาแฟ" },
        { value: "牛奶", zh: "牛奶", pinyin: "niúnǎi", th: "นม" },
      ],
      correct: "奶茶",
      evidence: "王一雪：你去买杯奶茶…我去买杯奶茶。",
      evidenceTh: "หวังอี้เสวี่ย: ฉันไปซื้อชานม",
      sourceRef: entranceRef,
    },
    builder: {
      prompt: { th: "เรียงประโยคบอกระยะทางของหวังอี้เสวี่ย", zh: "重组王一雪说明距离的句子", en: "Rebuild Wang Yixue’s distance sentence" },
      answer: ["咖啡店", "离", "这儿", "有点儿", "远"],
      tiles: ["远", "这儿", "咖啡店", "有点儿", "离"],
      gloss: { 咖啡店: "ร้านกาแฟ", 离: "ห่างจาก", 这儿: "ที่นี่", 有点儿: "ค่อนข้าง", 远: "ไกล" },
      translationTh: "ร้านกาแฟไกลจากที่นี่หน่อย",
      translationEn: "The coffee shop is a bit far from here.",
      evidence: "Text 2 · หน้าเล่ม 76",
      sourceRef: entranceRef,
    },
  },
  {
    id: "l9-coffee",
    number: "03",
    glyph: "走",
    title: "在咖啡店门口",
    titleTh: "ที่หน้าร้านกาแฟ",
    titleEn: "At the entrance of the coffee shop",
    place: "咖啡店门口",
    placeTh: "หน้าร้านกาแฟ",
    image: group3AssetPath("/assets/group3/lesson-hsk2-l9-coffee-v1.webp"),
    imageSrcSet: `${group3AssetPath("/assets/group3/lesson-hsk2-l9-coffee-720w-v1.webp")} 720w, ${group3AssetPath("/assets/group3/lesson-hsk2-l9-coffee-v1.webp")} 1400w`,
    imageAlt: {
      th: "หน้าร้านกาแฟ",
      zh: "咖啡店门口照片",
      en: "Coffee shop entrance scene",
    },
    source: "Text 3 · หน้าเล่ม 77–78 · PDF หน้า 91–92",
    sourcePage: "78",
    sourceRef: coffeeRef,
    context: "在咖啡店门口，王一雪和刘明在聊天儿。",
    contextTh: "ที่หน้าร้านกาแฟ หวังอี้เสวี่ยและหลิวหมิงกำลังคุยกัน",
    contextEn: "At the entrance of a coffee shop, Wang Yixue and Liu Ming were chatting.",
    characters: [
      { role: "A", profile: "wang", noteTh: "ผู้เสนอเดินกลับบ้านเพราะใกล้", noteZh: "提议走路回家的人", noteEn: "The one suggesting to walk home" },
      { role: "B", profile: "liu", noteTh: "ผู้ที่อยากนั่งแท็กซี่แต่ตกลงเดิน", noteZh: "想打车但同意走路的人", noteEn: "The one agreeing to walk for exercise" },
    ],
    lines: [
      line(coffeeRef, { role: "B", speaker: "刘明", pinyin: "wǒmen dǎchē huíqu ba", hanzi: "我们打车回去吧。", reading: "Wǒmen dǎchē huíqu ba.", en: "Let’s take a taxi home.", th: "เรานั่งแท็กซี่กลับกันเถอะ", visual: { zh: "打车", th: "นั่งแท็กซี่", focus: "48% center" } }),
      line(coffeeRef, { role: "A", speaker: "王一雪", pinyin: "zhèlǐ lí jiā hěn jìn, háishì zǒulù ba", hanzi: "这里离家很近，还是走路吧。", reading: "Zhèlǐ lí jiā hěn jìn, háishì zǒulù ba.", en: "It’s close to home. Let’s walk.", th: "ที่นี่ใกล้บ้าน ยังไงก็เดินกลับดีกว่า", visual: { zh: "离…很近", th: "ใกล้…", focus: "40% center" } }),
      line(coffeeRef, { role: "B", speaker: "刘明", pinyin: "yào zǒu duō cháng shíjiān", hanzi: "要走多长时间？", reading: "Yào zǒu duō cháng shíjiān?", en: "How long will it take to walk?", th: "เดินนานแค่ไหน?", visual: { zh: "多长时间", th: "นานเท่าไร", focus: "56% center" } }),
      line(coffeeRef, { role: "A", speaker: "王一雪", pinyin: "zǒu bàn ge duō xiǎoshí jiù dào le", hanzi: "走半个多小时就到了。", reading: "Zǒu bàn ge duō xiǎoshí jiù dào le.", en: "Walking will take a little over half an hour.", th: "เดินแค่ครึ่งชั่วโมงกว่า ๆ ก็ถึง", visual: { zh: "半个多小时", th: "ครึ่งชั่วโมงกว่า", focus: "44% center" } }),
      line(coffeeRef, { role: "B", speaker: "刘明", pinyin: "jīntiān yùndòng yùndòng ba", hanzi: "好的。每天上下班都坐车，今天运动运动吧。", reading: "Hǎo de. Měi tiān shàngxiàbān dōu zuò chē, jīntiān yùndòng yùndòng ba.", en: "Alright. I ride the car to and from work every day, so I’ll get some exercise today.", th: "ได้ ทุกวันไปทำงานก็แต่นั่งรถ วันนี้ได้ออกกำลังกายหน่อย", visual: { zh: "运动运动", th: "ออกกำลังกาย", focus: "60% center" } }),
    ],
    qte: {
      after: 3,
      prompt: { th: "เดินกลับบ้านใช้เวลานานแค่ไหน?", zh: "走路回家要多长时间？", en: "How long does it take to walk home?" },
      options: [
        { value: "半个多小时", zh: "半个多小时", pinyin: "bàn ge duō xiǎoshí", th: "ครึ่งชั่วโมงกว่า ๆ" },
        { value: "一个多小时", zh: "一个多小时", pinyin: "yí ge duō xiǎoshí", th: "หนึ่งชั่วโมงกว่า" },
        { value: "十分钟", zh: "十分钟", pinyin: "shí fēnzhōng", th: "สิบนาที" },
      ],
      correct: "半个多小时",
      evidence: "王一雪：走半个多小时就到了。",
      evidenceTh: "หวังอี้เสวี่ย: เดินแค่ครึ่งชั่วโมงกว่า ๆ ก็ถึง",
      sourceRef: coffeeRef,
    },
    builder: {
      prompt: { th: "เรียงประโยคบอกเวลาของหวังอี้เสวี่ย", zh: "重组王一雪说明步行时长的句子", en: "Rebuild Wang Yixue’s duration sentence" },
      answer: ["走", "半个多小时", "就", "到", "了"],
      tiles: ["了", "就", "到", "半个多小时", "走"],
      gloss: { 走: "เดิน", 半个多小时: "ครึ่งชั่วโมงกว่า", 就: "ก็", 到: "ถึง", 了: "แล้ว" },
      translationTh: "เดินครึ่งชั่วโมงกว่า ๆ ก็ถึง",
      translationEn: "Walking will take a little over half an hour.",
      evidence: "Text 3 · หน้าเล่ม 78",
      sourceRef: coffeeRef,
    },
  },
];

export const LESSON_HSK2_L9 = {
  id: "hsk2-l9",
  slug: "lesson-9",
  level: "hsk2",
  number: 9,
  featured: false,
  source: {
    title: "新HSK教程 2 · New HSK Course 2",
    lesson: "Lesson 9 · 我去买杯奶茶",
    printedPages: "73–81",
    pdfPages: "87–95",
    file: "hsk2.pdf",
    sourceRef,
  },
  sourceRef,
  title: {
    zh: "我去买杯奶茶",
    pinyin: "Wǒ qù mǎi bēi nǎichá",
    en: "I’m going to buy a cup of bubble tea",
    thAid: "ฉันจะไปซื้อชานมสักแก้ว",
  },
  summary: {
    zh: "和朋友们逛街买裤子，用“没有”比较、用“离”说距离、用时量补语说时长。",
    en: "Shop for pants with your friends, comparing with 没有, talking distance with 离, and duration with complements.",
    thAid: "ช็อปปิ้งกางเกงกับเพื่อน ฝึกเปรียบเทียบด้วย 没有, ระยะทางด้วย 离 และช่วงเวลาด้วย 时量补语",
  },
  translationPolicy: { kind: "editorial-aid", labelTh: "คำแปลไทยเพื่อช่วยเรียน เรียบเรียงจากต้นฉบับ" },
  objectives: [
    { zh: "能听懂并使用“没有”描述事物之间的差别。", en: "Be able to understand and use “没有” to describe differences between things.", thAid: "เข้าใจและใช้ 没有 อธิบายความแตกต่างของสิ่งต่าง ๆ", sourceRef: lessonHsk2L9SourceRef("73", "87") },
    { zh: "掌握动词“离”的用法，能表达处所或时间的距离。", en: "Master the verb “离” to express spatial or temporal distance.", thAid: "เข้าใจคำกริยา 离 ใช้บอกระยะทางหรือระยะเวลา", sourceRef: lessonHsk2L9SourceRef("73", "87") },
    { zh: "掌握时量补语（1）的用法，能描述动作持续的时间。", en: "Master the complement of duration (1) to describe how long an action lasts.", thAid: "เข้าใจส่วนขยายบอกระยะเวลา (时量补语) เพื่อบอกความยาวนานของเหตุการณ์", sourceRef: lessonHsk2L9SourceRef("73", "87") },
  ],
  contents: [
    { number: "00", title: "目标与热身", titleTh: "เป้าหมายและการเตรียมบท", detail: "Objectives · Warm-Up", pages: "73", route: "/home/hsk2/lesson-9/preface/", sourceRef: lessonHsk2L9SourceRef("73", "87") },
    { number: "01", title: "在商店看裤子", titleTh: "ดูกางเกงในร้าน", detail: "Text 1 · New Words 1–7", pages: "74–75", scene: 1, sourceRef: lessonHsk2L9SourceRef("74-75", "88-89") },
    { number: "02", title: "在商店门口买奶茶", titleTh: "ซื้อชานมหน้าร้าน", detail: "Text 2 · New Words 8–10", pages: "76–77", scene: 2, sourceRef: lessonHsk2L9SourceRef("76-77", "90-91") },
    { number: "03", title: "在咖啡店门口", titleTh: "ที่หน้าร้านกาแฟ", detail: "Text 3 · New Words 11–12", pages: "77–78", scene: 3, sourceRef: lessonHsk2L9SourceRef("77-78", "91-92") },
    { number: "04", title: "综合练习与活动", titleTh: "แบบฝึกรวมและกิจกรรม", detail: "Text 4 · Exercises (source trail)", pages: "79–81", sourceRef: lessonHsk2L9SourceRef("79-81", "93-95") },
  ],
  vocabulary,
  grammarFocus: [
    { title: "比较句（3）“A没有B+形容词”", titleEn: "Comparative Sentence (3): “A没有B+Adjective”", explanationZh: "“A没有B+形容词”表示“A不如B”，形容词前面可以加“这么”或“那么”表示B的程度更高。", explanationEn: "“A没有B+Adjective” means A is not as…as B; the adjective may be preceded by 这么 or 那么 to raise B’s degree.", thAid: "A 没有 B + คุณศัพท์ แปลว่า A ไม่เท่า B; ใส่ 这么/那么 หน้านี้คุณศัพท์เพื่อเน้นว่า B มากกว่า", examples: ["儿子的个子没有他那么高。", "昨天没有今天这么冷。", "这块手表没有那块好看。"], sourceRef: lessonHsk2L9SourceRef("75", "89") },
    { title: "动词“离”", titleEn: "The Verb “离”", explanationZh: "动词“离”表示处所或时间的距离，基本结构：A离B…。", explanationEn: "The verb “离” indicates spatial or temporal distance: A离B…", thAid: "คำกริยา 离 บอกระยะห่างของสถานที่หรือเวลา: A 离 B + คุณศัพท์", examples: ["咖啡店离这儿有点儿远。", "学校离医院不远。", "现在离我的生日还有三天。"], sourceRef: lessonHsk2L9SourceRef("77", "91") },
    { title: "时量补语（1）", titleEn: "Complement of Duration (1)", explanationZh: "表示时间段的词语用在动词后面构成时量补语，说明动作或状态持续的时间。", explanationEn: "Time expressions are used after verbs to form complements of duration, indicating how long an action or state lasts.", thAid: "นำเวลามาไว้หลังคำกริยาเพื่อบอกช่วงเวลาที่การกระทำดำเนินอยู่ เช่น 走半个多小时就到了", examples: ["走半个多小时就到了。", "他们学了两年。", "我们休息十分钟。"], sourceRef: lessonHsk2L9SourceRef("78", "92") },
  ],
  characters,
  scenes,
};
