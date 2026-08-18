import { group3AssetPath } from "../../../../config.js";

const SOURCE_FILE = "docs/references/hsk/sources/hsk3.pdf";
export const lessonHsk3L3SourceRef = (printedPages, pdfPages) => `${SOURCE_FILE}#printed-pages=${printedPages}&pdf-pages=${pdfPages}`;
const sourceRef = lessonHsk3L3SourceRef("19-27", "31-39");
const art = (scene) => ({ image: group3AssetPath(`/assets/group3/lesson-hsk3-l3-${scene}-v1.webp`), imageSrcSet: `${group3AssetPath(`/assets/group3/lesson-hsk3-l3-${scene}-720w-v1.webp`)} 720w, ${group3AssetPath(`/assets/group3/lesson-hsk3-l3-${scene}-v1.webp`)} 1400w` });
const line = (source, value) => ({ ...value, reading: value.reading || value.pinyin, sourceRef: source });

const characters = {
  liu: { hanzi: "刘明", pinyin: "Liú Míng", nameTh: "หลิวหมิง", nameEn: "Liu Ming", ...art("neighborhood"), imageFocus: "35% center" },
  wang: { hanzi: "王一雪", pinyin: "Wáng Yīxuě", nameTh: "หวังอี้เสวี่ย", nameEn: "Wang Yixue", ...art("new-home"), imageFocus: "67% center" },
};

const vocabularyPages = [
  [1, "初中", "chūzhōng", "n.", "middle school", "มัธยมต้น", 20, 32], [2, "咱们", "zánmen", "pron.", "we; us", "พวกเรา (รวมผู้ฟัง)", 20, 32], [3, "换", "huàn", "v.", "change", "เปลี่ยน", 20, 32],
  [4, "房子", "fángzi", "n.", "house", "บ้าน", 20, 32], [5, "小区", "xiǎoqū", "n.", "residential complex", "หมู่บ้าน / ชุมชนที่พักอาศัย", 20, 32], [6, "环境", "huánjìng", "n.", "surroundings; environment", "สภาพแวดล้อม", 20, 32],
  [7, "挺", "tǐng", "adv.", "quite; very", "ค่อนข้าง / มากทีเดียว", 20, 32], [8, "空调", "kōngtiáo", "n.", "air conditioner", "เครื่องปรับอากาศ", 20, 32], [9, "洗衣机", "xǐyījī", "n.", "washing machine", "เครื่องซักผ้า", 20, 32],
  [10, "层", "céng", "m.", "floor; story", "ชั้น", 20, 32], [11, "花园", "huāyuán", "n.", "garden", "สวน", 20, 32], [12, "灯", "dēng", "n.", "light; lamp", "ไฟ / โคมไฟ", 22, 34],
  [13, "关", "guān", "v.", "turn off; close", "ปิด", 22, 34], [14, "冰箱", "bīngxiāng", "n.", "refrigerator", "ตู้เย็น", 22, 34], [15, "卫生间", "wèishēngjiān", "n.", "bathroom", "ห้องน้ำ", 22, 34],
  [16, "打扫", "dǎsǎo", "v.", "clean", "ทำความสะอาด", 22, 34], [17, "搬家", "bānjiā", "v.", "move house", "ย้ายบ้าน", 22, 34], [18, "办", "bàn", "v.", "do; handle", "จัดการ / ทำเรื่อง", 23, 35],
  [19, "信用卡", "xìnyòngkǎ", "n.", "credit card", "บัตรเครดิต", 23, 35], [20, "还", "huán", "v.", "return; repay", "คืน / ชำระคืน", 23, 35], [21, "听说", "tīngshuō", "v.", "hear about", "ได้ยินมาว่า", 23, 35],
  [22, "银行", "yínháng", "n.", "bank", "ธนาคาร", 23, 35], [23, "才", "cái", "adv.", "not until; only then", "กว่าจะ / เพิ่งจะ", 23, 35], [24, "纸", "zhǐ", "n.", "paper", "กระดาษ", 25, 37],
  [25, "搬", "bān", "v.", "move; carry", "ย้าย / ขน", 25, 37], [26, "需要", "xūyào", "v./n.", "need", "ต้องการ / จำเป็น", 25, 37],
];
const vocabulary = vocabularyPages.map(([index, hanzi, pinyin, type, en, thAid, page, pdfPage]) => ({ index, hanzi, pinyin, type, en, th: thAid, thAid, page, translationKind: "editorial-aid", sourceRef: lessonHsk3L3SourceRef(String(page), String(pdfPage)) }));

const neighborhoodRef = lessonHsk3L3SourceRef("20", "32");
const newHomeRef = lessonHsk3L3SourceRef("21-22", "33-34");
const bankRef = lessonHsk3L3SourceRef("23", "35");

const scenes = [
  {
    id: "h3l3-neighborhood", number: "01", glyph: "房", title: "上网看新房", titleTh: "ดูบ้านใหม่ทางออนไลน์", titleEn: "Looking for a new home online", place: "家里", placeTh: "บ้าน", ...art("neighborhood"),
    imageAlt: { th: "หลิวหมิงกับหวังอี้เสวี่ยดูข้อมูลบ้านใหม่", zh: "上网看房场景", en: "Looking for a new home" }, source: "Text 1 · หน้าเล่ม 20 · PDF หน้า 32", sourcePage: "20", sourceRef: neighborhoodRef,
    context: "在家里，刘明和王一雪在聊天儿。", contextTh: "ที่บ้าน หลิวหมิงกับหวังอี้เสวี่ยกำลังคุยเรื่องย้ายบ้าน", contextEn: "At home, Liu Ming and Wang Yixue were discussing a move.",
    characters: [{ role: "A", profile: "wang", noteTh: "ผู้เสนอให้ย้ายไปอยู่ใกล้โรงเรียน", noteZh: "建议搬到学校附近的人", noteEn: "The person suggesting a move closer to school" }, { role: "B", profile: "liu", noteTh: "ผู้ค้นหาบ้านและสนใจสวนชั้นล่าง", noteZh: "上网找房并喜欢小花园的人", noteEn: "The person searching online and liking the garden" }],
    lines: [
      line(neighborhoodRef, { role: "A", speaker: "王一雪", hanzi: "小雪的初中离家有点儿远，咱们换一个近点儿的房子吧。", pinyin: "Xiǎoxuě de chūzhōng lí jiā yǒudiǎnr yuǎn, zánmen huàn yí ge jìn diǎnr de fángzi ba.", en: "Xiaoxue’s middle school is a little far from home. Let’s move to a closer place.", th: "โรงเรียนมัธยมต้นของเสี่ยวเสวี่ยไกลบ้านนิดหน่อย เราเปลี่ยนเป็นบ้านที่ใกล้กว่านี้กัน", visual: { zh: "换一个近点儿的房子", th: "เปลี่ยนเป็นบ้านที่ใกล้กว่า", focus: "66% center" } }),
      line(neighborhoodRef, { role: "B", speaker: "刘明", hanzi: "好啊，我上网看看。你觉得这个小区怎么样？", pinyin: "Hǎo a, wǒ shàngwǎng kànkan. Nǐ juéde zhè ge xiǎoqū zěnmeyàng?", en: "Okay, I’ll look online. What do you think of this neighborhood?", th: "ได้ ฉันลองดูทางอินเทอร์เน็ต เธอคิดว่าชุมชนนี้เป็นอย่างไร?", visual: { zh: "这个小区怎么样", th: "ชุมชนนี้เป็นอย่างไร", focus: "34% center" } }),
      line(neighborhoodRef, { role: "A", speaker: "王一雪", hanzi: "环境挺好的，离地铁站还不远。", pinyin: "Huánjìng tǐng hǎo de, lí dìtiězhàn hái bù yuǎn.", en: "The environment is quite good, and it isn’t far from the subway.", th: "สภาพแวดล้อมดีทีเดียว และไม่ไกลจากสถานีรถไฟใต้ดิน", visual: { zh: "环境挺好的", th: "สภาพแวดล้อมดีทีเดียว", focus: "64% center" } }),
      line(neighborhoodRef, { role: "B", speaker: "刘明", hanzi: "房子里面也不错，空调和洗衣机都是新的。", pinyin: "Fángzi lǐmian yě búcuò, kōngtiáo hé xǐyījī dōu shì xīn de.", en: "The inside is nice too. The air conditioner and washing machine are both new.", th: "ข้างในบ้านก็ไม่เลว เครื่องปรับอากาศกับเครื่องซักผ้าใหม่ทั้งคู่", visual: { zh: "都是新的", th: "ใหม่ทั้งคู่", focus: "36% center" } }),
      line(neighborhoodRef, { role: "A", speaker: "王一雪", hanzi: "是不错，但是我不喜欢住一层。", pinyin: "Shì búcuò, dànshì wǒ bù xǐhuan zhù yì céng.", en: "It is nice, but I don’t like living on the first floor.", th: "ก็ดีอยู่ แต่ฉันไม่ชอบอยู่ชั้นหนึ่ง", visual: { zh: "不喜欢住一层", th: "ไม่ชอบอยู่ชั้นหนึ่ง", focus: "62% center" } }),
      line(neighborhoodRef, { role: "B", speaker: "刘明", hanzi: "这个一层带一个小花园，我觉得咱们可以去看看。", pinyin: "Zhè ge yì céng dài yí ge xiǎo huāyuán, wǒ juéde zánmen kěyǐ qù kànkan.", en: "This first-floor unit has a small garden. I think we can go see it.", th: "ห้องชั้นหนึ่งนี้มีสวนเล็ก ๆ ฉันว่าเราไปดูได้", visual: { zh: "带一个小花园", th: "มีสวนเล็ก ๆ", focus: "38% center" } }),
    ],
    qte: { after: 2, prompt: { th: "สภาพแวดล้อมของชุมชนใหม่เป็นอย่างไร?", zh: "新小区的环境怎么样？", en: "How is the new neighborhood?" }, options: [{ value: "挺好的", zh: "挺好的", pinyin: "tǐng hǎo de", th: "ดีทีเดียว" }, { value: "很差", zh: "很差", pinyin: "hěn chà", th: "แย่มาก" }, { value: "太远了", zh: "太远了", pinyin: "tài yuǎn le", th: "ไกลเกินไป" }], correct: "挺好的", evidence: "王一雪：环境挺好的。", evidenceTh: "หวังอี้เสวี่ย: สภาพแวดล้อมดีทีเดียว", sourceRef: neighborhoodRef },
    builder: { prompt: { th: "เรียงประโยคบรรยายสภาพแวดล้อม", zh: "重组“挺……的”句", en: "Rebuild the 挺……的 sentence" }, answer: ["环境", "挺", "好", "的"], tiles: ["好", "环境", "的", "挺"], gloss: { 环境: "สภาพแวดล้อม", 挺: "ค่อนข้าง", 好: "ดี", 的: "คำลงท้าย" }, translationTh: "สภาพแวดล้อมดีทีเดียว", translationEn: "The environment is quite good.", evidence: "Text 1 · หน้าเล่ม 20", sourceRef: neighborhoodRef },
  },
  {
    id: "h3l3-new-home", number: "02", glyph: "搬", title: "收拾新家", titleTh: "จัดบ้านใหม่", titleEn: "Tidying the new home", place: "新家", placeTh: "บ้านใหม่", ...art("new-home"),
    imageAlt: { th: "การเก็บกวาดบ้านใหม่", zh: "收拾新家场景", en: "Tidying the new home" }, source: "Text 2 · หน้าเล่ม 21–22 · PDF หน้า 33–34", sourcePage: "21–22", sourceRef: newHomeRef,
    context: "在新家，王一雪在收拾房间，刘明进来了。", contextTh: "ที่บ้านใหม่ หวังอี้เสวี่ยกำลังจัดห้องและหลิวหมิงเดินเข้ามา", contextEn: "At the new home, Wang Yixue was tidying the room when Liu Ming came in.",
    characters: [{ role: "A", profile: "wang", noteTh: "ผู้ตรวจงานบ้านและถามเรื่องเครื่องใช้", noteZh: "检查房间和家电的人", noteEn: "The person checking the rooms and appliances" }, { role: "B", profile: "liu", noteTh: "ผู้ยุ่งจนลืมปิดไฟและเตรียมย้ายบ้าน", noteZh: "忙得忘关灯并准备搬家的人", noteEn: "The person busy preparing the move" }],
    lines: [
      line(newHomeRef, { role: "A", speaker: "王一雪", hanzi: "我今天早上来的时候，灯还开着。", pinyin: "Wǒ jīntiān zǎoshang lái de shíhou, dēng hái kāizhe.", en: "When I came this morning, the light was still on.", th: "ตอนฉันมาเมื่อเช้า ไฟยังเปิดอยู่", visual: { zh: "灯还开着", th: "ไฟยังเปิดอยู่", focus: "66% center" } }),
      line(newHomeRef, { role: "B", speaker: "刘明", hanzi: "我这几天忙坏了，可能走的时候忘关了。", pinyin: "Wǒ zhè jǐ tiān máng huài le, kěnéng zǒu de shíhou wàng guān le.", en: "I’ve been terribly busy these days. I may have forgotten to turn it off when I left.", th: "หลายวันนี้ฉันยุ่งมาก อาจลืมปิดตอนออกไป", visual: { zh: "忙坏了", th: "ยุ่งมากจนแย่", focus: "34% center" } }),
      line(newHomeRef, { role: "A", speaker: "王一雪", hanzi: "冰箱不能用，这些吃的东西放在哪儿？", pinyin: "Bīngxiāng bù néng yòng, zhèxiē chī de dōngxi fàng zài nǎr?", en: "The refrigerator doesn’t work. Where should we put this food?", th: "ตู้เย็นใช้ไม่ได้ ของกินเหล่านี้จะวางไว้ที่ไหน?", visual: { zh: "冰箱不能用", th: "ตู้เย็นใช้ไม่ได้", focus: "64% center" } }),
      line(newHomeRef, { role: "B", speaker: "刘明", hanzi: "不可能吧？冰箱是新买的，我来看看。", pinyin: "Bù kěnéng ba? Bīngxiāng shì xīn mǎi de, wǒ lái kànkan.", en: "That can’t be right. The fridge is new—let me check.", th: "เป็นไปไม่ได้มั้ง? ตู้เย็นเพิ่งซื้อใหม่ ฉันลองดู", visual: { zh: "我来看看", th: "ฉันลองดู", focus: "36% center" } }),
      line(newHomeRef, { role: "A", speaker: "王一雪", hanzi: "洗衣机也坏了吗？", pinyin: "Xǐyījī yě huài le ma?", en: "Is the washing machine broken too?", th: "เครื่องซักผ้าก็เสียด้วยหรือ?", visual: { zh: "洗衣机也坏了吗", th: "เครื่องซักผ้าก็เสียหรือ", focus: "62% center" } }),
      line(newHomeRef, { role: "B", speaker: "刘明", hanzi: "没坏，但是卫生间没打扫好，还不能洗衣服。", pinyin: "Méi huài, dànshì wèishēngjiān méi dǎsǎo hǎo, hái bù néng xǐ yīfu.", en: "It isn’t broken, but the bathroom hasn’t been cleaned, so we can’t wash clothes yet.", th: "ไม่เสีย แต่ห้องน้ำยังทำความสะอาดไม่เสร็จ จึงยังซักผ้าไม่ได้", visual: { zh: "卫生间没打扫好", th: "ห้องน้ำยังทำความสะอาดไม่เสร็จ", focus: "38% center" } }),
      line(newHomeRef, { role: "A", speaker: "王一雪", hanzi: "星期天我们真的能搬家吗？", pinyin: "Xīngqītiān wǒmen zhēn de néng bānjiā ma?", en: "Can we really move on Sunday?", th: "วันอาทิตย์เราจะย้ายบ้านได้จริงหรือ?", visual: { zh: "能搬家吗", th: "ย้ายบ้านได้ไหม", focus: "60% center" } }),
    ],
    qte: { after: 5, prompt: { th: "ทำไมตอนนี้ยังซักผ้าไม่ได้?", zh: "为什么现在还不能洗衣服？", en: "Why can’t they wash clothes yet?" }, options: [{ value: "卫生间没打扫好", zh: "卫生间没打扫好", pinyin: "wèishēngjiān méi dǎsǎo hǎo", th: "ห้องน้ำยังทำความสะอาดไม่เสร็จ" }, { value: "洗衣机坏了", zh: "洗衣机坏了", pinyin: "xǐyījī huài le", th: "เครื่องซักผ้าเสีย" }, { value: "没有水", zh: "没有水", pinyin: "méiyǒu shuǐ", th: "ไม่มีน้ำ" }], correct: "卫生间没打扫好", evidence: "刘明：卫生间没打扫好，还不能洗衣服。", evidenceTh: "หลิวหมิง: ห้องน้ำยังทำความสะอาดไม่เสร็จ จึงยังซักผ้าไม่ได้", sourceRef: newHomeRef },
    builder: { prompt: { th: "เรียงประโยคบอกว่ายุ่งมาก", zh: "重组程度补语句", en: "Rebuild the degree-complement sentence" }, answer: ["我", "这几天", "忙", "坏了"], tiles: ["坏了", "这几天", "我", "忙"], gloss: { 我: "ฉัน", 这几天: "หลายวันนี้", 忙: "ยุ่ง", 坏了: "มากจนแย่" }, translationTh: "หลายวันนี้ฉันยุ่งมาก", translationEn: "I’ve been terribly busy these days.", evidence: "Text 2 · หน้าเล่ม 22", sourceRef: newHomeRef },
  },
  {
    id: "h3l3-bank", number: "03", glyph: "卡", title: "商量办信用卡", titleTh: "ปรึกษาเรื่องทำบัตรเครดิต", titleEn: "Discussing a credit card", place: "家里", placeTh: "บ้าน", ...art("bank"),
    imageAlt: { th: "ทั้งคู่คุยเรื่องค่าใช้จ่ายและธนาคาร", zh: "商量办信用卡场景", en: "Discussing a credit card" }, source: "Text 3 · หน้าเล่ม 23 · PDF หน้า 35", sourcePage: "23", sourceRef: bankRef,
    context: "在家里，刘明和王一雪在客厅聊天儿。", contextTh: "ที่บ้าน หลิวหมิงกับหวังอี้เสวี่ยกำลังคุยกันในห้องรับแขก", contextEn: "At home, Liu Ming and Wang Yixue were chatting in the living room.",
    characters: [{ role: "A", profile: "wang", noteTh: "ผู้เสนอทำบัตรเครดิตและจะไปธนาคาร", noteZh: "建议办信用卡并准备去银行的人", noteEn: "The person proposing a credit card" }, { role: "B", profile: "liu", noteTh: "ผู้บอกระยะทางและติดนัดโรงพยาบาล", noteZh: "说明银行很近但要去医院的人", noteEn: "The person noting the bank is nearby but visiting hospital" }],
    lines: [
      line(bankRef, { role: "A", speaker: "王一雪", hanzi: "这个月花了不少钱。", pinyin: "Zhè ge yuè huā le bù shǎo qián.", en: "We spent quite a lot of money this month.", th: "เดือนนี้ใช้เงินไปไม่น้อย", visual: { zh: "花了不少钱", th: "ใช้เงินไปไม่น้อย", focus: "66% center" } }),
      line(bankRef, { role: "B", speaker: "刘明", hanzi: "是的，我们买了很多搬家时要用的东西。", pinyin: "Shì de, wǒmen mǎi le hěn duō bānjiā shí yào yòng de dōngxi.", en: "Yes, we bought many things needed for the move.", th: "ใช่ เราซื้อของที่ต้องใช้ตอนย้ายบ้านมากมาย", visual: { zh: "搬家时要用的东西", th: "ของที่ต้องใช้ตอนย้ายบ้าน", focus: "34% center" } }),
      line(bankRef, { role: "A", speaker: "王一雪", hanzi: "咱们办张信用卡吧，花的钱可以慢慢还。听说中国银行的服务不错，办了信用卡买东西还能便宜。", pinyin: "Zánmen bàn zhāng xìnyòngkǎ ba, huā de qián kěyǐ mànmàn huán. Tīngshuō Zhōngguó Yínháng de fúwù búcuò, bàn le xìnyòngkǎ mǎi dōngxi hái néng piányi.", en: "Let’s get a credit card and repay gradually. I hear Bank of China has good service and card purchases can be cheaper.", th: "เราทำบัตรเครดิตกัน เงินที่ใช้ค่อย ๆ คืนได้ ได้ยินว่าธนาคารจีนบริการดี และซื้อของด้วยบัตรยังถูกลงได้", visual: { zh: "办张信用卡", th: "ทำบัตรเครดิต", focus: "64% center" } }),
      line(bankRef, { role: "B", speaker: "刘明", hanzi: "好啊！中国银行很近，走路几分钟就能到。咱们什么时候去？", pinyin: "Hǎo a! Zhōngguó Yínháng hěn jìn, zǒulù jǐ fēnzhōng jiù néng dào. Zánmen shénme shíhou qù?", en: "Sure! Bank of China is close—only a few minutes on foot. When shall we go?", th: "ได้! ธนาคารจีนอยู่ใกล้ เดินไม่กี่นาทีก็ถึง เราจะไปเมื่อไร?", visual: { zh: "几分钟就能到", th: "ไม่กี่นาทีก็ถึง", focus: "36% center" } }),
      line(bankRef, { role: "A", speaker: "王一雪", hanzi: "今天下午？", pinyin: "Jīntiān xiàwǔ?", en: "This afternoon?", th: "บ่ายวันนี้ไหม?", visual: { zh: "今天下午", th: "บ่ายวันนี้", focus: "62% center" } }),
      line(bankRef, { role: "B", speaker: "刘明", hanzi: "我下午要去医院，很晚才能回来。", pinyin: "Wǒ xiàwǔ yào qù yīyuàn, hěn wǎn cái néng huílai.", en: "I have to go to the hospital this afternoon and won’t return until late.", th: "บ่ายนี้ฉันต้องไปโรงพยาบาล กว่าจะกลับได้ก็ดึก", visual: { zh: "很晚才能回来", th: "กว่าจะกลับได้ก็ดึก", focus: "38% center" } }),
      line(bankRef, { role: "A", speaker: "王一雪", hanzi: "那我下午自己去吧。", pinyin: "Nà wǒ xiàwǔ zìjǐ qù ba.", en: "Then I’ll go by myself this afternoon.", th: "งั้นบ่ายนี้ฉันไปเอง", visual: { zh: "自己去", th: "ไปเอง", focus: "60% center" } }),
    ],
    qte: { after: 3, prompt: { th: "เดินไปธนาคารใช้เวลานานไหม?", zh: "走路去银行要很久吗？", en: "Does it take long to walk to the bank?" }, options: [{ value: "几分钟就能到", zh: "几分钟就能到", pinyin: "jǐ fēnzhōng jiù néng dào", th: "ไม่กี่นาทีก็ถึง" }, { value: "一个小时", zh: "一个小时", pinyin: "yí ge xiǎoshí", th: "หนึ่งชั่วโมง" }, { value: "很晚才到", zh: "很晚才到", pinyin: "hěn wǎn cái dào", th: "กว่าจะถึงก็ดึก" }], correct: "几分钟就能到", evidence: "刘明：中国银行很近，走路几分钟就能到。", evidenceTh: "หลิวหมิง: ธนาคารจีนอยู่ใกล้ เดินไม่กี่นาทีก็ถึง", sourceRef: bankRef },
    builder: { prompt: { th: "เรียงประโยคบอกว่ากว่าจะกลับได้ก็ดึก", zh: "重组“才”字句", en: "Rebuild the 才 sentence" }, answer: ["很晚", "才", "能", "回来"], tiles: ["回来", "很晚", "能", "才"], gloss: { 很晚: "ดึกมาก", 才: "กว่าจะ", 能: "สามารถ", 回来: "กลับมา" }, translationTh: "กว่าจะกลับได้ก็ดึก", translationEn: "I won’t be able to return until late.", evidence: "Text 3 · หน้าเล่ม 23", sourceRef: bankRef },
  },
];

export const LESSON_HSK3_L3 = {
  id: "hsk3-l3", slug: "lesson-3", level: "hsk3", number: 3, featured: false, sourceRef,
  source: { title: "新HSK教程 3 · New HSK Course 3", lesson: "Lesson 3 · 这个小区挺好的", printedPages: "19–27", pdfPages: "31–39", file: "hsk3.pdf", sourceRef },
  title: { zh: "这个小区挺好的", pinyin: "Zhè ge xiǎoqū tǐng hǎo de", en: "This neighborhood is pretty nice", thAid: "ชุมชนนี้ดีทีเดียว" },
  summary: { zh: "谈论居住环境、收拾新家和办理信用卡，学习“挺”“坏了”以及“就”和“才”。", en: "Discuss a neighborhood, prepare a new home, and arrange a credit card while learning 挺, 坏了, and 就 versus 才.", thAid: "คุยเรื่องสภาพแวดล้อม จัดบ้านใหม่ และทำบัตรเครดิต พร้อมฝึก 挺, 坏了 และความต่างของ 就 กับ 才" },
  translationPolicy: { kind: "editorial-aid", labelTh: "คำแปลไทยเพื่อช่วยเรียน เรียบเรียงจากต้นฉบับ" },
  objectives: [
    { zh: "能听懂并谈论居住环境和居家情况。", en: "Understand and talk about living environments and home life.", thAid: "ฟังเข้าใจและพูดคุยเรื่องสภาพแวดล้อมที่อยู่อาศัยและสภาพในบ้าน", sourceRef: lessonHsk3L3SourceRef("19", "31") },
    { zh: "能听懂并使用“挺”“坏了”表达程度。", en: "Understand and use 挺 and 坏了 to express degree or intensity.", thAid: "ใช้ 挺 และ 坏了 บอกระดับความมาก", sourceRef: lessonHsk3L3SourceRef("19", "31") },
    { zh: "掌握“就”和“才”的用法，能表达动作发生的早晚、快慢等信息。", en: "Use 就 and 才 to express whether actions happen early, late, quickly, or slowly.", thAid: "ใช้ 就 กับ 才 บอกการเกิดเร็ว ช้า ง่าย หรือยาก", sourceRef: lessonHsk3L3SourceRef("19", "31") },
  ],
  contents: [
    { number: "00", title: "目标与热身", titleTh: "เป้าหมายและการเตรียมบท", detail: "Objectives · Warm-Up", pages: "19", route: "/home/hsk3/lesson-3/preface/", sourceRef: lessonHsk3L3SourceRef("19", "31") },
    { number: "01", title: "上网看新房", titleTh: "ดูบ้านใหม่ทางออนไลน์", detail: "Text 1 · New Words 1–11", pages: "20–21", scene: 1, sourceRef: lessonHsk3L3SourceRef("20-21", "32-33") },
    { number: "02", title: "收拾新家", titleTh: "จัดบ้านใหม่", detail: "Text 2 · New Words 12–17", pages: "21–22", scene: 2, sourceRef: lessonHsk3L3SourceRef("21-22", "33-34") },
    { number: "03", title: "商量办信用卡", titleTh: "ปรึกษาเรื่องทำบัตรเครดิต", detail: "Text 3 · New Words 18–23", pages: "23–24", scene: 3, sourceRef: lessonHsk3L3SourceRef("23-24", "35-36") },
    { number: "04", title: "搬家计划、练习与活动", titleTh: "แผนย้ายบ้าน แบบฝึก และกิจกรรม", detail: "Text 4 · Exercises · Activity", pages: "24–27", sourceRef: lessonHsk3L3SourceRef("24-27", "36-39") },
  ],
  vocabulary,
  grammarFocus: [
    { title: "程度副词“挺”", titleEn: "Adverb of Degree 挺", explanationZh: "“挺”用在形容词或心理动词前，表示程度较高，口语中常用“挺+形容词/心理动词+的”。", explanationEn: "挺 precedes an adjective or psychological verb to indicate a fairly high degree, often with 的 in speech.", thAid: "รูป 挺 + คุณศัพท์/กริยาความรู้สึก + 的 ใช้บอกว่าค่อนข้างมากในภาษาพูด", examples: ["这个小区环境挺好的。", "这家饭馆的菜挺好吃的。", "我挺喜欢这个颜色的。"], sourceRef: lessonHsk3L3SourceRef("21", "33") },
    { title: "程度补语“坏了”", titleEn: "Complement of Degree 坏了", explanationZh: "“坏了”用在形容词后面，表示程度非常高，带有夸张语气，常用于负面情况。", explanationEn: "坏了 follows an adjective to express an extremely high degree, usually with negative or exaggerated force.", thAid: "坏了 ตามหลังคุณศัพท์เพื่อเน้นว่ามากจนแย่ มักใช้กับสถานการณ์เชิงลบ", examples: ["我这几天忙坏了。", "我渴坏了。", "大家都累坏了。"], sourceRef: lessonHsk3L3SourceRef("22", "34") },
    { title: "“就”和“才”", titleEn: "Comparison of 就 and 才", explanationZh: "“就”表示动作发生得早、快或顺利；“才”表示动作发生得晚、慢或不顺利。", explanationEn: "就 presents an action as early, quick, or smooth, while 才 presents it as late, slow, or difficult.", thAid: "就 สื่อว่าเร็ว/ง่ายกว่าคาด ส่วน 才 สื่อว่าช้า/ยากกว่าคาด", examples: ["走路几分钟就能到。", "很晚才能回来。", "坐火车五个小时才能到。"], sourceRef: lessonHsk3L3SourceRef("24", "36") },
  ],
  characters,
  scenes,
};
