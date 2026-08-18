import { group3AssetPath } from "../../../../config.js";

const SOURCE_FILE = "docs/references/hsk/sources/hsk3.pdf";

export function lessonHsk3L7SourceRef(printedPages, pdfPages) {
  return `${SOURCE_FILE}#printed-pages=${printedPages}&pdf-pages=${pdfPages}`;
}

const sourceRef = lessonHsk3L7SourceRef("57-65", "69-77");

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
  bikeShop: {
    hanzi: "自行车店老板",
    pinyin: "zìxíngchē diàn lǎobǎn",
    nameTh: "เจ้าของร้านจักรยาน",
    nameEn: "Bike shop owner",
    image: group3AssetPath("/assets/group3/lesson-hsk3-l7-bike-v1.webp"),
    imageSrcSet: `${group3AssetPath("/assets/group3/lesson-hsk3-l7-bike-720w-v1.webp")} 720w, ${group3AssetPath("/assets/group3/lesson-hsk3-l7-bike-v1.webp")} 1400w`,
    imageFocus: "68% center",
  },
  fruitVendor: {
    hanzi: "水果店老板",
    pinyin: "shuǐguǒ diàn lǎobǎn",
    nameTh: "เจ้าของร้านผลไม้",
    nameEn: "Fruit shop owner",
    image: group3AssetPath("/assets/group3/lesson-hsk3-l7-fruit-v1.webp"),
    imageSrcSet: `${group3AssetPath("/assets/group3/lesson-hsk3-l7-fruit-720w-v1.webp")} 720w, ${group3AssetPath("/assets/group3/lesson-hsk3-l7-fruit-v1.webp")} 1400w`,
    imageFocus: "66% center",
  },
};

const vocabularyPages = [
  [1, "卖", "mài", "v.", "sell", "ขาย", 58, 70],
  [2, "辆", "liàng", "m.", "measure word for vehicles", "ลักษณนามของยานพาหนะ (คัน)", 58, 70],
  [3, "店", "diàn", "n.", "shop; store", "ร้าน", 58, 70],
  [4, "顾客", "gùkè", "n.", "customer", "ลูกค้า", 58, 70],
  [5, "便宜", "piányi", "adj.", "cheap; inexpensive", "ถูก", 58, 70],
  [6, "挑", "tiāo", "v.", "choose; pick out", "เลือก (เลือกซื้อ)", 58, 70],
  [7, "当然", "dāngrán", "adv.", "of course", "แน่นอน / ยังไงล่ะ", 60, 72],
  [8, "裤子", "kùzi", "n.", "trousers", "กางเกงขายาว", 60, 72],
  [9, "裙子", "qúnzi", "n.", "skirt", "กระโปรง", 60, 72],
  [10, "短裤", "duǎnkù", "n.", "shorts", "กางเกงขาสั้น", 60, 72],
  [11, "条", "tiáo", "m.", "measure word for long, thin things", "ลักษณนามของสิ่งของยาว เช่น กางเกง กระโปรง เนคไท", 60, 72],
  [12, "颜色", "yánsè", "n.", "color", "สี", 60, 72],
  [13, "价钱", "jiàqian", "n.", "price", "ราคา", 60, 72],
  [14, "正好", "zhènghǎo", "adj./adv.", "just right; exactly", "พอดี", 62, 74],
  [15, "试", "shì", "v.", "try (on)", "ลองใส่ / ลอง", 62, 74],
  [16, "舒服", "shūfu", "adj.", "comfortable", "สบาย", 62, 74],
  [17, "合适", "héshì", "adj.", "suitable; fitting", "เหมาะ", 62, 74],
  [18, "特别", "tèbié", "adv.", "especially; very", "พิเศษ / มากเป็นพิเศษ", 64, 76],
  [19, "比", "bǐ", "prep.", "than (comparison)", "กว่า (เปรียบเทียบ)", 64, 76],
  [20, "穿", "chuān", "v.", "wear; put on", "ใส่", 61, 73],
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
  sourceRef: lessonHsk3L7SourceRef(String(page), String(pdfPage)),
}));

function line(source, value) {
  return { ...value, sourceRef: source };
}

const bikeRef = lessonHsk3L7SourceRef("57-58", "69-70");
const skirtRef = lessonHsk3L7SourceRef("59-61", "71-73");
const fruitRef = lessonHsk3L7SourceRef("61-63", "73-75");

const scenes = [
  {
    id: "l7-bike",
    number: "01",
    glyph: "车",
    title: "去自行车店",
    titleTh: "ไปร้านจักรยาน",
    titleEn: "At the bicycle shop",
    place: "自行车店",
    placeTh: "ร้านจักรยาน",
    image: group3AssetPath("/assets/group3/lesson-hsk3-l7-bike-v1.webp"),
    imageSrcSet: `${group3AssetPath("/assets/group3/lesson-hsk3-l7-bike-720w-v1.webp")} 720w, ${group3AssetPath("/assets/group3/lesson-hsk3-l7-bike-v1.webp")} 1400w`,
    imageAlt: {
      th: "การเลือกซื้อจักรยาน",
      zh: "自行车店照片",
      en: "Choosing a bicycle",
    },
    source: "Text 1 · หน้าเล่ม 57–58 · PDF หน้า 69–70",
    sourcePage: "57",
    sourceRef: bikeRef,
    context: "在自行车店，王一雪和刘明在挑选自行车。",
    contextTh: "ที่ร้านจักรยาน หวังอี้เสวี่ยและหลิวหมิงกำลังเลือกจักรยาน",
    contextEn: "At the bicycle shop, Wang Yixue and Liu Ming were choosing a bike.",
    characters: [
      { role: "A", profile: "liu", noteTh: "อาจารย์ที่มาด้วยและช่วยดูให้", noteZh: "一起来看车、帮忙挑选的老师", noteEn: "The teacher helping choose a bike" },
      { role: "B", profile: "wang", noteTh: "แม่ที่อยากซื้อจักรยานให้ลูก", noteZh: "想给孩子买自行车的妈妈", noteEn: "The mom buying a bike for her son" },
      { role: "C", profile: "bikeShop", noteTh: "เจ้าของร้านที่แนะนำและบอกว่าราคาถูก", noteZh: "介绍车子、说价钱便宜的老版", noteEn: "The shop owner advertising cheap prices" },
    ],
    lines: [
      line(bikeRef, { role: "A", speaker: "刘明", pinyin: "nǐ lái zhèr gàn shénme", hanzi: "一雪，你来这儿干什么？", reading: "Yīxuě, nǐ lái zhèr gàn shénme?", en: "Yixue, what are you here for?", th: "อี้เสวี่ย มานี่ทำอะไร?", visual: { zh: "来这儿干什么", th: "มานี่ทำอะไร", focus: "52% center" } }),
      line(bikeRef, { role: "B", speaker: "王一雪", pinyin: "háizi gāng xuéhuì qí zìxíngchē", hanzi: "我来看自行车。孩子刚学会骑自行车，想给他买一辆。", reading: "Wǒ lái kàn zìxíngchē. Háizi gāng xuéhuì qí zìxíngchē, xiǎng gěi tā mǎi yí liàng.", en: "I came to look at bicycles. My son just learned to ride, so I want to buy him one.", th: "มาดูจักรยาน ลูกเพิ่งหัดขี่ได้ อยากซื้อให้สักคัน", visual: { zh: "刚学会骑自行车", th: "เพิ่งหัดขี่ได้", focus: "34% center" } }),
      line(bikeRef, { role: "A", speaker: "刘明", pinyin: "wǒ kàn zhèlǐ dōu shì diàndòngchē", hanzi: "这家店卖自行车吗？我看这里都是电动车。", reading: "Zhè jiā diàn mài zìxíngchē ma? Wǒ kàn zhèlǐ dōu shì diàndòngchē.", en: "Does this shop sell bicycles? All I see here are e-bikes.", th: "ร้านนี้ขายจักรยานเหรอ? เห็นแต่รถไฟฟ้า", visual: { zh: "卖自行车吗", th: "ขายจักรยานไหม", focus: "44% center" } }),
      line(bikeRef, { role: "B", speaker: "王一雪", pinyin: "wǒmen qù nàbiān kànkan ba", hanzi: "老师，那边有自行车，我们去那边看看吧。", reading: "Lǎoshī, nàbiān yǒu zìxíngchē, wǒmen qù nàbiān kànkan ba.", en: "Teacher, there are bicycles over there. Let’s go look.", th: "อาจารย์คะ ด้านนั้นมีจักรยาน ไปดูด้านนั้นกัน", visual: { zh: "那边有自行车", th: "ด้านนั้นมีจักรยาน", focus: "58% center" } }),
      line(bikeRef, { role: "C", speaker: "自行车店老板", pinyin: "huānyíng kànkan wǒmen de chē, jiàqian piányi", hanzi: "您好，两位顾客，您要买自行车吗？欢迎看看我们的车，价钱便宜。", reading: "Nín hǎo, liǎng wèi gùkè, nín yào mǎi zìxíngchē ma? Huānyíng kànkan wǒmen de chē, jiàqian piányi.", en: "Hello, customers. Looking for a bike? Welcome to browse ours — the prices are low.", th: "สวัสดีค่ะ คุณลูกค้าทั้งสองท่าน อยากซื้อจักรยานไหมคะ? ยินดีต้อนรับลองดูรถของเรา ราคาถูกนะคะ", visual: { zh: "价钱便宜", th: "ราคาถูก", focus: "68% center" } }),
      line(bikeRef, { role: "B", speaker: "王一雪", pinyin: "nín bāng wǒ kànkan, tiāo yí liàng ba", hanzi: "那辆黄色的自行车不错。老师，您帮我看看，挑一辆吧。", reading: "Nà liàng huángsè de zìxíngchē búcuò. Lǎoshī, nín bāng wǒ kànkan, tiāo yí liàng ba.", en: "That yellow bike looks good. Teacher, help me look and pick one out.", th: "จักรยานสีเหลืองคันนั้นไม่เลว อาจารย์ช่วยดูให้หน่อย เลือกสักคันเถอะ", visual: { zh: "那辆黄色的", th: "คันสีเหลือง", focus: "36% center" } }),
    ],
    qte: {
      after: 2,
      prompt: { th: "หวังอี้เสวี่ยมาร้านนี้ทำไม?", zh: "王一雪来这儿干什么？", en: "Why does Wang Yixue come here?" },
      options: [
        { value: "给儿子买自行车", zh: "给儿子买自行车", pinyin: "gěi érzi mǎi zìxíngchē", th: "ซื้อจักรยานให้ลูกชาย" },
        { value: "买电动车", zh: "买电动车", pinyin: "mǎi diàndòngchē", th: "ซื้อรถไฟฟ้า" },
        { value: "找刘老师", zh: "找刘老师", pinyin: "zhǎo Liú lǎoshī", th: "หาอาจารย์หลิว" },
      ],
      correct: "给儿子买自行车",
      evidence: "王一雪：孩子刚学会骑自行车，想给他买一辆。",
      evidenceTh: "หวังอี้เสวี่ย: ลูกเพิ่งหัดขี่ได้ อยากซื้อให้สักคัน",
      sourceRef: bikeRef,
    },
    builder: {
      prompt: { th: "เรียงประโยคซื้อจักรยานของหวังอี้เสวี่ย", zh: "重组王一雪买自行车的句子", en: "Rebuild Wang Yixue’s sentence" },
      answer: ["给", "他", "买", "一辆", "自行车"],
      tiles: ["一辆", "自行车", "给", "买", "他"],
      gloss: { 给: "ให้", 他: "เขา", 买: "ซื้อ", 一辆: "หนึ่งคัน", 自行车: "จักรยาน" },
      translationTh: "ซื้อจักรยานให้เขาสักคัน",
      translationEn: "Buy him a bicycle.",
      evidence: "Text 1 · หน้าเล่ม 57",
      sourceRef: bikeRef,
    },
  },
  {
    id: "l7-skirt",
    number: "02",
    glyph: "裙",
    title: "在服装店买裙子",
    titleTh: "ซื้อกระโปรงที่ร้านเสื้อผ้า",
    titleEn: "Buying a skirt at the clothing store",
    place: "服装店",
    placeTh: "ร้านเสื้อผ้า",
    image: group3AssetPath("/assets/group3/lesson-hsk3-l7-skirt-v1.webp"),
    imageSrcSet: `${group3AssetPath("/assets/group3/lesson-hsk3-l7-skirt-720w-v1.webp")} 720w, ${group3AssetPath("/assets/group3/lesson-hsk3-l7-skirt-v1.webp")} 1400w`,
    imageAlt: {
      th: "การเลือกซื้อกระโปรง",
      zh: "服装店照片",
      en: "Choosing a skirt",
    },
    source: "Text 2 · หน้าเล่ม 59–61 · PDF หน้า 71–73",
    sourcePage: "59",
    sourceRef: skirtRef,
    context: "在服装店，王一雪和刘明在挑选裙子。",
    contextTh: "ที่ร้านเสื้อผ้า หวังอี้เสวี่ยและหลิวหมิงกำลังเลือกกระโปรง",
    contextEn: "At the clothing store, Wang Yixue and Liu Ming were choosing a skirt.",
    characters: [
      { role: "A", profile: "liu", noteTh: "อาจารย์ที่ช่วยเปรียบเทียบสีและราคา", noteZh: "帮忙比较颜色和价钱的人", noteEn: "The teacher comparing colors and prices" },
      { role: "B", profile: "wang", noteTh: "ลูกค้าที่ลองกระโปรงแล้วชอบ", noteZh: "试穿裙子的顾客", noteEn: "The customer trying on a skirt" },
    ],
    lines: [
      line(skirtRef, { role: "A", speaker: "刘明", pinyin: "wǒmen jìnqù kànkan ba", hanzi: "这家衣服店很大，我们进去看看吧。", reading: "Zhè jiā yīfu diàn hěn dà, wǒmen jìnqù kànkan ba.", en: "This clothing store is big — let’s go in and look.", th: "ร้านเสื้อผ้าร้านนี้ใหญ่ เราเข้าไปดูกันเถอะ", visual: { zh: "衣服店很大", th: "ร้านเสื้อผ้าใหญ่", focus: "44% center" } }),
      line(skirtRef, { role: "A", speaker: "刘明", pinyin: "nà tiáo hóngsè de qúnzi hěn hǎokàn", hanzi: "那条红色的裙子很好看，你穿上也一定好看。", reading: "Nà tiáo hóngsè de qúnzi hěn hǎokàn, nǐ chuānshang yě yídìng hǎokàn.", en: "That red skirt is lovely — it’s sure to look great on you.", th: "กระโปรงสีแดงตัวนั้นสวยมาก เธอใส่ก็ต้องสวยแน่นอน", visual: { zh: "红色的裙子", th: "กระโปรงสีแดง", focus: "30% center" } }),
      line(skirtRef, { role: "B", speaker: "王一雪", pinyin: "nà tiáo hóng qúnzi bǐ nà tiáo bái de hǎokàn, yě bǐ nà tiáo lán de piányi", hanzi: "那条红裙子比那条白的好看，也比那条蓝的便宜。", reading: "Nà tiáo hóng qúnzi bǐ nà tiáo bái de hǎokàn, yě bǐ nà tiáo lán de piányi.", en: "The red skirt is prettier than the white one and cheaper than the blue one.", th: "กระโปรงแดงตัวนั้นสวยกว่าตัวขาว และถูกกว่าตัวน้ำเงินด้วย", visual: { zh: "比那条白的好看", th: "สวยกว่าตัวขาว", focus: "40% center" } }),
      line(skirtRef, { role: "A", speaker: "刘明", pinyin: "yánsè hé jiàqian dōu hěn héshì", hanzi: "颜色和价钱都很合适。你试试吧。", reading: "Yánsè hé jiàqian dōu hěn héshì. Nǐ shìshi ba.", en: "Both the color and the price are right. Try it on.", th: "ทั้งสีทั้งราคาเหมาะเลย ลองใส่ดูสิ", visual: { zh: "很合适", th: "เหมาะเลย", focus: "52% center" } }),
      line(skirtRef, { role: "B", speaker: "王一雪", pinyin: "wǒ chuānzhe zhè tiáo qúnzi zhènghǎo, yě hěn shūfu", hanzi: "好的。…我穿着这条裙子正好，也很舒服。", reading: "Hǎo de. … Wǒ chuānzhe zhè tiáo qúnzi zhènghǎo, yě hěn shūfu.", en: "Okay… This skirt fits me perfectly, and it’s comfortable too.", th: "ได้ … ฉันใส่กระโปรงตัวนี้ได้พอดี และก็สบายด้วย", visual: { zh: "穿着…正好", th: "ใส่…พอดี", focus: "36% center" } }),
      line(skirtRef, { role: "A", speaker: "刘明", pinyin: "nà jiù mǎi zhè tiáo ba", hanzi: "你穿着这条裙子也很好看，那就买这条吧。", reading: "Nǐ chuānzhe zhè tiáo qúnzi yě hěn hǎokàn, nà jiù mǎi zhè tiáo ba.", en: "You look great in it too — let’s buy this one, then.", th: "เธอใส่ตัวนี้ก็สวยดี งั้นซื้อตัวนี้เลย", visual: { zh: "买这条", th: "ซื้อตัวนี้", focus: "48% center" } }),
    ],
    qte: {
      after: 2,
      prompt: { th: "หวังอี้เสวี่ยว่ากระโปรงตัวไหนสวยที่สุด?", zh: "王一雪认为哪条裙子最好看？", en: "Which skirt does Wang Yixue think is prettiest?" },
      options: [
        { value: "红色的", zh: "红色的", pinyin: "hóngsè de", th: "สีแดง" },
        { value: "白色的", zh: "白色的", pinyin: "báisè de", th: "สีขาว" },
        { value: "蓝色的", zh: "蓝色的", pinyin: "lánsè de", th: "สีน้ำเงิน" },
      ],
      correct: "红色的",
      evidence: "王一雪：那条红裙子比那条白的好看，也比那条蓝的便宜。",
      evidenceTh: "หวังอี้เสวี่ย: กระโปรงแดงสวยกว่าขาว และถูกกว่าน้ำเงิน",
      sourceRef: skirtRef,
    },
    builder: {
      prompt: { th: "เรียงประโยคเปรียบเทียบกระโปรงแดงกับขาว", zh: "重组比较句的句子", en: "Rebuild the comparison sentence" },
      answer: ["那条", "红", "裙子", "比", "那条", "白", "的", "好看"],
      tiles: ["的", "比", "红", "那条", "好看", "白", "裙子", "那条"],
      gloss: { 那条: "ตัวนั้น", 红: "แดง", 裙子: "กระโปรง", 比: "กว่า", 白: "ขาว", 的: "ตัว", 好看: "สวย" },
      translationTh: "กระโปรงแดงตัวนั้นสวยกว่าตัวขาว",
      translationEn: "That red skirt is prettier than that white one.",
      evidence: "Text 2 · หน้าเล่ม 59",
      sourceRef: skirtRef,
    },
  },
  {
    id: "l7-fruit",
    number: "03",
    glyph: "果",
    title: "在水果店买葡萄",
    titleTh: "ซื้อองุ่นที่ร้านผลไม้",
    titleEn: "Buying grapes at the fruit shop",
    place: "水果店",
    placeTh: "ร้านผลไม้",
    image: group3AssetPath("/assets/group3/lesson-hsk3-l7-fruit-v1.webp"),
    imageSrcSet: `${group3AssetPath("/assets/group3/lesson-hsk3-l7-fruit-720w-v1.webp")} 720w, ${group3AssetPath("/assets/group3/lesson-hsk3-l7-fruit-v1.webp")} 1400w`,
    imageAlt: {
      th: "การซื้อผลไม้",
      zh: "水果店照片",
      en: "Buying fruit",
    },
    source: "Text 3 · หน้าเล่ม 61–63 · PDF หน้า 73–75",
    sourcePage: "61",
    sourceRef: fruitRef,
    context: "在水果店，王一雪和刘明在买葡萄。",
    contextTh: "ที่ร้านผลไม้ หวังอี้เสวี่ยและหลิวหมิงกำลังซื้อองุ่น",
    contextEn: "At the fruit shop, Wang Yixue and Liu Ming were buying grapes.",
    characters: [
      { role: "A", profile: "fruitVendor", noteTh: "เจ้าของร้านที่แนะนำองุ่นซินเจียง", noteZh: "介绍新疆葡萄的老版", noteEn: "The shop owner introducing Xinjiang grapes" },
      { role: "B", profile: "liu", noteTh: "อาจารย์ผู้สงสัยว่าผลไม้นี้คืออะไร", noteZh: "好奇葡萄是什么的人", noteEn: "The teacher wondering what the fruit is" },
      { role: "C", profile: "wang", noteTh: "ลูกค้าที่ชมว่าองุ่นอร่อยและราคาไม่แพง", noteZh: "称赞葡萄好吃不贵的顾客", noteEn: "The customer praising the grapes" },
    ],
    lines: [
      line(fruitRef, { role: "A", speaker: "水果店老板", pinyin: "wǒmen diàn de shuǐguǒ tèbié hǎo, jiàqian yě hěn piányi", hanzi: "您们好，买水果吗？我们店的水果特别好，价钱也很便宜。", reading: "Nínmen hǎo, mǎi shuǐguǒ ma? Wǒmen diàn de shuǐguǒ tèbié hǎo, jiàqian yě hěn piányi.", en: "Hello, buying fruit? Our shop’s fruit is especially good and very cheap.", th: "สวัสดีค่ะ ซื้อผลไม้ไหมคะ? ผลไม้ร้านเราดีเป็นพิเศษ ราคาก็ถูกมาก", visual: { zh: "水果特别好", th: "ผลไม้ดีพิเศษ", focus: "66% center" } }),
      line(fruitRef, { role: "B", speaker: "刘明", pinyin: "zěnme yǐqián méi jiànguo", hanzi: "这种水果叫什么名字？怎么以前没见过？", reading: "Zhè zhǒng shuǐguǒ jiào shénme míngzi? Zěnme yǐqián méi jiànguo?", en: "What’s this fruit called? How come I’ve never seen it before?", th: "ผลไม้ชนิดนี้ชื่ออะไร? ทำไมไม่เคยเห็นมาก่อน?", visual: { zh: "叫什么名字", th: "ชื่ออะไร", focus: "40% center" } }),
      line(fruitRef, { role: "A", speaker: "水果店老板", pinyin: "zhè jiào pútao, shì Xīnjiāng de tèchǎn", hanzi: "这叫葡萄，是新疆的特产。你看，这里的葡萄又大又甜。", reading: "Zhè jiào pútao, shì Xīnjiāng de tèchǎn. Nǐ kàn, zhèlǐ de pútao yòu dà yòu tián.", en: "These are grapes, a specialty of Xinjiang. Look — the grapes here are big and sweet.", th: "นี่คือองุ่น พิเศษของซินเจียง ดูสิ องุ่นที่นี่ทั้งใหญ่ทั้งหวาน", visual: { zh: "新疆的特产", th: "พิเศษของซินเจียง", focus: "64% center" } }),
      line(fruitRef, { role: "C", speaker: "王一雪", pinyin: "zhè zhǒng pútao búdàn hǎochī, érqiě jiàqian bú guì", hanzi: "真的很大很甜！这种葡萄不但好吃，而且价钱不贵。", reading: "Zhēn de hěn dà hěn tián! Zhè zhǒng pútao búdàn hǎochī, érqiě jiàqian bú guì.", en: "They really are big and sweet! These grapes are not only tasty but also not expensive.", th: "ใหญ่และหวานจริง ๆ! องุ่นชนิดนี้ไม่อร่อยอย่างเดียว ราคายังไม่แพงอีกด้วย", visual: { zh: "不但…而且…", th: "ไม่เพียง…ยัง…", focus: "36% center" } }),
      line(fruitRef, { role: "B", speaker: "刘明", pinyin: "érqiě hěn xīnxiān, wǒmen mǎi yìxiē ba", hanzi: "而且很新鲜，我们买一些吧。", reading: "Érqiě hěn xīnxiān, wǒmen mǎi yìxiē ba.", en: "And they’re very fresh — let’s buy some.", th: "และก็สดใหม่ด้วย ซื้อสักหน่อยเถอะ", visual: { zh: "很新鲜", th: "สดใหม่", focus: "44% center" } }),
      line(fruitRef, { role: "C", speaker: "王一雪", pinyin: "hǎo, jiù mǎi zhège le", hanzi: "好，就买这个了。", reading: "Hǎo, jiù mǎi zhège le.", en: "Okay, we’ll take these.", th: "ดี เอาอันนี้เลย", visual: { zh: "就买这个", th: "เอาอันนี้", focus: "38% center" } }),
    ],
    qte: {
      after: 2,
      prompt: { th: "องุ่นของร้านนี้เป็นอย่างไร?", zh: "这里的葡萄怎么样？", en: "How are the grapes here?" },
      options: [
        { value: "又大又甜", zh: "又大又甜", pinyin: "yòu dà yòu tián", th: "ทั้งใหญ่ทั้งหวาน" },
        { value: "又小又酸", zh: "又小又酸", pinyin: "yòu xiǎo yòu suān", th: "ทั้งเล็กทั้งเปรี้ยว" },
        { value: "颜色不好看", zh: "颜色不好看", pinyin: "yánsè bù hǎokàn", th: "สีไม่สวย" },
      ],
      correct: "又大又甜",
      evidence: "水果店老板：这里的葡萄又大又甜。",
      evidenceTh: "เจ้าของร้าน: องุ่นที่นี่ทั้งใหญ่ทั้งหวาน",
      sourceRef: fruitRef,
    },
    builder: {
      prompt: { th: "เรียงประโยคชมองุ่นของหวังอี้เสวี่ย", zh: "重组王一雪称赞葡萄的句子", en: "Rebuild Wang Yixue’s praise sentence" },
      answer: ["这种", "葡萄", "不但", "好吃", "而且", "价钱不贵"],
      tiles: ["好吃", "葡萄", "不但", "价钱不贵", "而且", "这种"],
      gloss: { 这种: "ชนิดนี้", 葡萄: "องุ่น", 不但: "ไม่เพียงแต่", 好吃: "อร่อย", 而且: "ยัง", 价钱不贵: "ราคาไม่แพง" },
      translationTh: "องุ่นชนิดนี้ไม่อร่อยอย่างเดียว ราคายังไม่แพง",
      translationEn: "These grapes are not only tasty but also cheap.",
      evidence: "Text 3 · หน้าเล่ม 62",
      sourceRef: fruitRef,
    },
  },
];

export const LESSON_HSK3_L7 = {
  id: "hsk3-l7",
  slug: "lesson-7",
  level: "hsk3",
  number: 7,
  featured: false,
  source: {
    title: "新HSK教程 3 · New HSK Course 3",
    lesson: "Lesson 7 · 那条裙子比短裤更好看",
    printedPages: "57–65",
    pdfPages: "69–77",
    file: "hsk3.pdf",
    sourceRef,
  },
  sourceRef,
  title: {
    zh: "那条裙子比短裤更好看",
    pinyin: "Nà tiáo qúnzi bǐ duǎnkù gèng hǎokàn",
    en: "That skirt looks even better than the shorts",
    thAid: "กระโปรงตัวนั้นสวยกว่ากางเกงขาสั้นด้วยซ้ำ",
  },
  summary: {
    zh: "买自行车、裙子和水果，学习“A不比B+形容词”比较句和“…极了”。",
    en: "Buying a bike, a skirt, and fruit, learn the 不比 comparison sentence and …极了.",
    thAid: "ซื้อจักรยาน กระโปรง และผลไม้ ฝึกประโยคเปรียบเทียบ 不比 และ …极了",
  },
  translationPolicy: { kind: "editorial-aid", labelTh: "คำแปลไทยเพื่อช่วยเรียน เรียบเรียงจากต้นฉบับ" },
  objectives: [
    { zh: "能听懂并谈论买东西时的价格、颜色和大小。", en: "Be able to understand and talk about the price, color, and size when shopping.", thAid: "ฟังและพูดคุยเรื่องราคา สี และขนาดตอนซื้อของ", sourceRef: lessonHsk3L7SourceRef("57", "69") },
    { zh: "能听懂并使用“A不比B+形容词”的比较句。", en: "Be able to understand and use the “A 不比 B + adjective” comparison sentence.", thAid: "เข้าใจและใช้ประโยคเปรียบเทียบแบบ A不比B+คุณศัพท์", sourceRef: lessonHsk3L7SourceRef("57", "69") },
    { zh: "能听懂并用“…极了”表达程度高。", en: "Be able to understand and use …极了 to express a high degree.", thAid: "เข้าใจและใช้ …极了 เพื่อบอกระดับสูง (มากที่สุด)", sourceRef: lessonHsk3L7SourceRef("57", "69") },
  ],
  contents: [
    { number: "00", title: "目标与热身", titleTh: "เป้าหมายและการเตรียมบท", detail: "Objectives · Warm-Up", pages: "57", route: "/home/hsk3/lesson-7/preface/", sourceRef: lessonHsk3L7SourceRef("57", "69") },
    { number: "01", title: "去自行车店", titleTh: "ไปร้านจักรยาน", detail: "Text 1 · New Words 1–6", pages: "57–58", scene: 1, sourceRef: lessonHsk3L7SourceRef("57-58", "69-70") },
    { number: "02", title: "在服装店买裙子", titleTh: "ซื้อกระโปรงที่ร้านเสื้อผ้า", detail: "Text 2 · New Words 7–13", pages: "59–61", scene: 2, sourceRef: lessonHsk3L7SourceRef("59-61", "71-73") },
    { number: "03", title: "在水果店买葡萄", titleTh: "ซื้อองุ่นที่ร้านผลไม้", detail: "Text 3 · New Words 14–19", pages: "61–63", scene: 3, sourceRef: lessonHsk3L7SourceRef("61-63", "73-75") },
    { number: "04", title: "综合练习与活动", titleTh: "แบบฝึกรวมและกิจกรรม", detail: "Text 4 · Exercises · Activity (source trail)", pages: "64–65", sourceRef: lessonHsk3L7SourceRef("64-65", "76-77") },
  ],
  vocabulary,
  grammarFocus: [
    { title: "比较句（10）“A不比B+形容词”", titleEn: "Comparison Sentence (10) “A 不比 B + adjective”", explanationZh: "“A不比B+形容词”是对“A比B+形容词”的否定，意思是“A和B差不多，A不一定比B怎么样”。", explanationEn: "“A 不比 B + adjective” is the negative form of “A 比 B + adjective”, meaning A is not necessarily more (adjective) than B.", thAid: "A不比B+คุณศัพท์ = ปฏิเสธว่า A ไม่ได้…กว่า B (หมายถึงพอ ๆ กัน ไม่ได้ต่างกัน)", examples: ["这条裙子不比那条好看。", "今天不比昨天冷。", "这件衣服不比那件贵。"], sourceRef: lessonHsk3L7SourceRef("63", "75") },
    { title: "“…极了”表示程度高", titleEn: "…极了 Expressing a High Degree", explanationZh: "“极了”用在形容词或动词后面，表示程度很高，达到极点。", explanationEn: "…极了 follows an adjective or verb to indicate an extremely high degree.", thAid: "…极了 วางหลังคุณศัพท์/กริยา แปลว่า “ที่สุด” บอกระดับสูงมาก", examples: ["这条裙子好极了。", "这件衣服舒服极了。", "这种水果甜极了。"], sourceRef: lessonHsk3L7SourceRef("64", "76") },
    { title: "递进复句“不但…而且…”", titleEn: "Progressive Complex Sentence “不但…而且…”", explanationZh: "“不但…而且…”连接两个分句，表示后一分句的意思比前一分句更进一步。", explanationEn: "“不但…而且…” links two clauses, with the second going a step further than the first.", thAid: "ไม่เพียงแต่…ยัง…อีกด้วย ใช้เชื่อมให้ความหมายลึกขึ้นไปอีกขั้น", examples: ["这种葡萄不但好吃，而且价钱不贵。", "她不但长得漂亮，而且学习很好。", "他不但会说英语，而且会说汉语。"], sourceRef: lessonHsk3L7SourceRef("65", "77") },
  ],
  characters,
  scenes,
};
