import { group3AssetPath } from "../../../../config.js";

const SOURCE_FILE = "docs/references/hsk/sources/hsk3.pdf";
export const lessonHsk3L4SourceRef = (printedPages, pdfPages) => `${SOURCE_FILE}#printed-pages=${printedPages}&pdf-pages=${pdfPages}`;
const sourceRef = lessonHsk3L4SourceRef("29-37", "41-49");
const art = (scene) => ({ image: group3AssetPath(`/assets/group3/lesson-hsk3-l4-${scene}-v1.webp`), imageSrcSet: `${group3AssetPath(`/assets/group3/lesson-hsk3-l4-${scene}-720w-v1.webp`)} 720w, ${group3AssetPath(`/assets/group3/lesson-hsk3-l4-${scene}-v1.webp`)} 1400w` });
const line = (source, value) => ({ ...value, reading: value.reading || value.pinyin, sourceRef: source });

const characters = {
  yang: { hanzi: "杨同乐", pinyin: "Yáng Tónglè", nameTh: "หยางถงเล่อ", nameEn: "Yang Tongle", ...art("grassland"), imageFocus: "34% center" },
  yifei: { hanzi: "王一飞", pinyin: "Wáng Yīfēi", nameTh: "หวังอี้เฟย", nameEn: "Wang Yifei", ...art("hotel-plan"), imageFocus: "66% center" },
  driverLi: { hanzi: "小李", pinyin: "Xiǎo Lǐ", nameTh: "เสี่ยวหลี่", nameEn: "Xiao Li", ...art("airport-driver"), imageFocus: "34% center" },
};

const vocabularyPages = [
  [1, "假期", "jiàqī", "n.", "vacation; holiday", "วันหยุด", 30, 42], [2, "海", "hǎi", "n.", "sea", "ทะเล", 30, 42], [3, "草原", "cǎoyuán", "n.", "grassland", "ทุ่งหญ้า", 30, 42],
  [4, "主意", "zhǔyi", "n.", "idea", "ความคิด", 30, 42], [5, "骑", "qí", "v.", "ride", "ขี่", 30, 42], [6, "马", "mǎ", "n.", "horse", "ม้า", 30, 42],
  [7, "羊", "yáng", "n.", "sheep; goat", "แกะ / แพะ", 30, 42], [8, "月亮", "yuèliang", "n.", "moon", "พระจันทร์", 30, 42], [9, "一定", "yídìng", "adv.", "certainly", "แน่นอน", 30, 42],
  [10, "刻", "kè", "m.", "quarter of an hour", "หนึ่งในสี่ชั่วโมง", 32, 44], [11, "起飞", "qǐfēi", "v.", "take off", "เครื่องขึ้น", 32, 44], [12, "宾馆", "bīnguǎn", "n.", "hotel", "โรงแรม", 32, 44],
  [13, "特别", "tèbié", "adj./adv.", "special; especially", "พิเศษ / โดยเฉพาะ", 32, 44], [14, "别的", "biéde", "pron.", "other", "อย่างอื่น", 32, 44], [15, "一样", "yíyàng", "adj.", "the same", "เหมือนกัน", 32, 44],
  [16, "牛", "niú", "n.", "cattle", "วัว", 32, 44], [17, "相机", "xiàngjī", "n.", "camera", "กล้องถ่ายรูป", 32, 44], [18, "欢迎", "huānyíng", "v.", "welcome", "ยินดีต้อนรับ", 33, 45],
  [19, "司机", "sījī", "n.", "driver", "คนขับรถ", 33, 45], [20, "晚点", "wǎndiǎn", "v.", "be late; delayed", "ล่าช้า", 33, 45], [21, "久", "jiǔ", "adj.", "long (time)", "นาน", 33, 45],
  [22, "除了", "chúle", "prep.", "besides; except", "นอกจาก / ยกเว้น", 33, 45], [23, "以外", "yǐwài", "n.", "other than; except", "นอกเหนือจาก", 33, 45], [24, "先", "xiān", "adv.", "first", "ก่อน", 33, 45],
  [25, "一直", "yìzhí", "adv.", "all along", "ตลอดมา", 35, 47], [26, "干净", "gānjìng", "adj.", "clean", "สะอาด", 35, 47], [27, "满意", "mǎnyì", "v./adj.", "be satisfied", "พอใจ", 35, 47],
];
const vocabulary = vocabularyPages.map(([index, hanzi, pinyin, type, en, thAid, page, pdfPage]) => ({ index, hanzi, pinyin, type, en, th: thAid, thAid, page, translationKind: "editorial-aid", sourceRef: lessonHsk3L4SourceRef(String(page), String(pdfPage)) }));
const grasslandRef = lessonHsk3L4SourceRef("30", "42");
const hotelPlanRef = lessonHsk3L4SourceRef("31-32", "43-44");
const driverRef = lessonHsk3L4SourceRef("33", "45");

const scenes = [
  {
    id: "h3l4-grassland", number: "01", glyph: "原", title: "商量假期去哪儿", titleTh: "วางแผนเที่ยววันหยุด", titleEn: "Planning a holiday", place: "王一飞家", placeTh: "บ้านหวังอี้เฟย", ...art("grassland"),
    imageAlt: { th: "วางแผนไปเที่ยวทุ่งหญ้า", zh: "假期计划场景", en: "Holiday planning" }, source: "Text 1 · หน้าเล่ม 30 · PDF หน้า 42", sourcePage: "30", sourceRef: grasslandRef,
    context: "在王一飞家客厅，杨同乐和王一飞在聊天儿。", contextTh: "ในห้องรับแขกบ้านหวังอี้เฟย หยางถงเล่อกับหวังอี้เฟยกำลังวางแผนเที่ยว", contextEn: "In Wang Yifei’s living room, Yang Tongle and Wang Yifei were planning a trip.",
    characters: [{ role: "A", profile: "yang", noteTh: "ผู้เสนอไปทะเลแล้วเปลี่ยนเป็นทุ่งหญ้า", noteZh: "先提议海边再提议草原的人", noteEn: "The person suggesting the seaside and then the grassland" }, { role: "B", profile: "teacherWang", noteTh: "ผู้เลือกทุ่งหญ้าเพราะอากาศและกิจกรรม", noteZh: "因为天气和活动选择草原的人", noteEn: "The person choosing the grassland" }],
    lines: [
      line(grasslandRef, { role: "A", speaker: "杨同乐", hanzi: "这个假期咱们去哪儿玩玩吧。", pinyin: "Zhè ge jiàqī zánmen qù nǎr wánwan ba.", en: "Let’s go somewhere during this holiday.", th: "วันหยุดนี้เราไปเที่ยวที่ไหนสักแห่งกัน", visual: { zh: "假期去哪儿", th: "วันหยุดไปที่ไหน", focus: "34% center" } }),
      line(grasslandRef, { role: "B", speaker: "王一飞", hanzi: "好啊，你想去哪儿，咱们就去哪儿。", pinyin: "Hǎo a, nǐ xiǎng qù nǎr, zánmen jiù qù nǎr.", en: "Sure. Wherever you want to go, we’ll go.", th: "ได้ เธออยากไปไหน เราก็ไปที่นั่น", visual: { zh: "想去哪儿就去哪儿", th: "อยากไปไหนก็ไปที่นั่น", focus: "66% center" } }),
      line(grasslandRef, { role: "A", speaker: "杨同乐", hanzi: "你喜欢海，找个海边住几天，怎么样？", pinyin: "Nǐ xǐhuan hǎi, zhǎo ge hǎibiān zhù jǐ tiān, zěnmeyàng?", en: "You like the sea. How about staying by the coast for a few days?", th: "เธอชอบทะเล ไปพักริมทะเลสักหลายวันเป็นอย่างไร?", visual: { zh: "海边住几天", th: "พักริมทะเลหลายวัน", focus: "36% center" } }),
      line(grasslandRef, { role: "B", speaker: "王一飞", hanzi: "现在去海边有点儿冷。", pinyin: "Xiànzài qù hǎibiān yǒudiǎnr lěng.", en: "It’s a little cold to go to the seaside now.", th: "ตอนนี้ไปริมทะเลจะหนาวนิดหน่อย", visual: { zh: "有点儿冷", th: "หนาวนิดหน่อย", focus: "64% center" } }),
      line(grasslandRef, { role: "A", speaker: "杨同乐", hanzi: "那去草原吧？草原一点儿也不冷。", pinyin: "Nà qù cǎoyuán ba? Cǎoyuán yìdiǎnr yě bù lěng.", en: "Then how about the grassland? It isn’t cold at all there.", th: "งั้นไปทุ่งหญ้าไหม? ทุ่งหญ้าไม่หนาวเลยสักนิด", visual: { zh: "一点儿也不冷", th: "ไม่หนาวเลยสักนิด", focus: "38% center" } }),
      line(grasslandRef, { role: "B", speaker: "王一飞", hanzi: "这个主意好！我好久没骑马了。", pinyin: "Zhè ge zhǔyi hǎo! Wǒ hǎojiǔ méi qí mǎ le.", en: "That’s a good idea! I haven’t ridden a horse in a long time.", th: "ความคิดนี้ดี! ฉันไม่ได้ขี่ม้ามานานแล้ว", visual: { zh: "好久没骑马了", th: "ไม่ได้ขี่ม้ามานาน", focus: "62% center" } }),
      line(grasslandRef, { role: "A", speaker: "杨同乐", hanzi: "对，在草原上骑马、吃羊肉、看月亮，一定很有意思。", pinyin: "Duì, zài cǎoyuán shang qí mǎ, chī yángròu, kàn yuèliang, yídìng hěn yǒuyìsi.", en: "Right—riding horses, eating mutton, and watching the moon on the grassland will certainly be fun.", th: "ใช่ ขี่ม้า กินเนื้อแกะ ชมพระจันทร์บนทุ่งหญ้า ต้องสนุกแน่นอน", visual: { zh: "一定很有意思", th: "ต้องสนุกแน่นอน", focus: "40% center" } }),
    ],
    qte: { after: 4, prompt: { th: "ทุ่งหญ้าตอนนี้หนาวไหม?", zh: "草原现在冷吗？", en: "Is the grassland cold now?" }, options: [{ value: "一点儿也不冷", zh: "一点儿也不冷", pinyin: "yìdiǎnr yě bù lěng", th: "ไม่หนาวเลย" }, { value: "很冷", zh: "很冷", pinyin: "hěn lěng", th: "หนาวมาก" }, { value: "比海边冷", zh: "比海边冷", pinyin: "bǐ hǎibiān lěng", th: "หนาวกว่าริมทะเล" }], correct: "一点儿也不冷", evidence: "杨同乐：草原一点儿也不冷。", evidenceTh: "หยางถงเล่อ: ทุ่งหญ้าไม่หนาวเลย", sourceRef: grasslandRef },
    builder: { prompt: { th: "เรียงประโยคปฏิเสธทั้งหมด", zh: "重组完全否定句", en: "Rebuild the complete-negation sentence" }, answer: ["草原", "一点儿", "也", "不", "冷"], tiles: ["冷", "也", "草原", "不", "一点儿"], gloss: { 草原: "ทุ่งหญ้า", 一点儿: "สักนิด", 也: "ก็", 不: "ไม่", 冷: "หนาว" }, translationTh: "ทุ่งหญ้าไม่หนาวเลยสักนิด", translationEn: "The grassland isn’t cold at all.", evidence: "Text 1 · หน้าเล่ม 30", sourceRef: grasslandRef },
  },
  {
    id: "h3l4-hotel-plan", number: "02", glyph: "馆", title: "准备机票和宾馆", titleTh: "เตรียมตั๋วและโรงแรม", titleEn: "Preparing flights and hotel", place: "王一飞家", placeTh: "บ้านหวังอี้เฟย", ...art("hotel-plan"),
    imageAlt: { th: "เตรียมตั๋ว โรงแรม และสัมภาระ", zh: "旅行准备场景", en: "Travel preparation" }, source: "Text 2 · หน้าเล่ม 31–32 · PDF หน้า 43–44", sourcePage: "31–32", sourceRef: hotelPlanRef,
    context: "在王一飞家客厅，杨同乐和王一飞在聊天儿。", contextTh: "ที่บ้านหวังอี้เฟย ทั้งคู่กำลังตรวจแผนเดินทาง", contextEn: "At Wang Yifei’s home, they were checking their travel plans.",
    characters: [{ role: "A", profile: "yang", noteTh: "ผู้ตรวจเรื่องตั๋ว โรงแรม และเตรียมสัมภาระ", noteZh: "确认机票宾馆并准备行李的人", noteEn: "The person checking bookings and packing" }, { role: "B", profile: "teacherWang", noteTh: "ผู้ซื้อตั๋ว เลือกโรงแรม และเตือนกล้อง", noteZh: "买票选宾馆并提醒带相机的人", noteEn: "The person booking the trip and reminding about the camera" }],
    lines: [
      line(hotelPlanRef, { role: "A", speaker: "杨同乐", hanzi: "出去玩的机票买好了吗？", pinyin: "Chūqu wán de jīpiào mǎi hǎo le ma?", en: "Have the tickets for our trip been bought?", th: "ซื้อตั๋วสำหรับไปเที่ยวเรียบร้อยหรือยัง?", visual: { zh: "机票买好了吗", th: "ซื้อตั๋วเรียบร้อยหรือยัง", focus: "34% center" } }),
      line(hotelPlanRef, { role: "B", speaker: "王一飞", hanzi: "买好了。星期六上午十点一刻起飞。", pinyin: "Mǎi hǎo le. Xīngqīliù shàngwǔ shí diǎn yí kè qǐfēi.", en: "Yes. The flight takes off at 10:15 Saturday morning.", th: "ซื้อแล้ว เครื่องออกสิบโมงสิบห้านาทีเช้าวันเสาร์", visual: { zh: "十点一刻起飞", th: "เครื่องออกสิบโมงสิบห้า", focus: "66% center" } }),
      line(hotelPlanRef, { role: "A", speaker: "杨同乐", hanzi: "宾馆也选好了吗？", pinyin: "Bīnguǎn yě xuǎn hǎo le ma?", en: "Has the hotel been chosen too?", th: "เลือกโรงแรมเรียบร้อยด้วยหรือยัง?", visual: { zh: "宾馆也选好了吗", th: "เลือกโรงแรมแล้วหรือยัง", focus: "36% center" } }),
      line(hotelPlanRef, { role: "B", speaker: "王一飞", hanzi: "是的，这家宾馆很特别，跟别的都不一样，一出门就能看见牛和羊！", pinyin: "Shì de, zhè jiā bīnguǎn hěn tèbié, gēn biéde dōu bù yíyàng, yì chūmén jiù néng kànjiàn niú hé yáng!", en: "Yes. This hotel is special and unlike all the others—you can see cattle and sheep as soon as you step outside!", th: "เลือกแล้ว โรงแรมนี้พิเศษ ไม่เหมือนที่อื่นเลย ออกจากประตูก็เห็นวัวกับแกะ!", visual: { zh: "跟别的都不一样", th: "ไม่เหมือนที่อื่นเลย", focus: "64% center" } }),
      line(hotelPlanRef, { role: "A", speaker: "杨同乐", hanzi: "太好了！你看看要带什么东西？", pinyin: "Tài hǎo le! Nǐ kànkan yào dài shénme dōngxi?", en: "Great! What do we need to take?", th: "ดีมาก! ลองดูว่าต้องเอาอะไรไปบ้าง?", visual: { zh: "要带什么东西", th: "ต้องเอาอะไรไป", focus: "38% center" } }),
      line(hotelPlanRef, { role: "B", speaker: "王一飞", hanzi: "我们不用带太多东西，别忘了拿上新买的相机。", pinyin: "Wǒmen búyòng dài tài duō dōngxi, bié wàng le náshang xīn mǎi de xiàngjī.", en: "We don’t need much. Don’t forget the new camera.", th: "เราไม่ต้องเอาของมาก อย่าลืมหยิบกล้องที่เพิ่งซื้อ", visual: { zh: "别忘了拿相机", th: "อย่าลืมหยิบกล้อง", focus: "62% center" } }),
      line(hotelPlanRef, { role: "A", speaker: "杨同乐", hanzi: "一定不会忘带的。我现在就去准备行李。", pinyin: "Yídìng bú huì wàng dài de. Wǒ xiànzài jiù qù zhǔnbèi xíngli.", en: "I definitely won’t forget it. I’ll pack now.", th: "ไม่ลืมแน่นอน ตอนนี้ฉันจะไปเตรียมสัมภาระเลย", visual: { zh: "现在就去准备", th: "ไปเตรียมเดี๋ยวนี้", focus: "40% center" } }),
    ],
    qte: { after: 5, prompt: { th: "หวังอี้เฟยเตือนให้นำอะไรไป?", zh: "王一飞提醒带什么？", en: "What does Wang Yifei remind them to take?" }, options: [{ value: "相机", zh: "相机", pinyin: "xiàngjī", th: "กล้อง" }, { value: "雨伞", zh: "雨伞", pinyin: "yǔsǎn", th: "ร่ม" }, { value: "电脑", zh: "电脑", pinyin: "diànnǎo", th: "คอมพิวเตอร์" }], correct: "相机", evidence: "王一飞：别忘了拿上新买的相机。", evidenceTh: "หวังอี้เฟย: อย่าลืมหยิบกล้องที่เพิ่งซื้อ", sourceRef: hotelPlanRef },
    builder: { prompt: { th: "เรียงประโยคเปรียบเทียบโรงแรม", zh: "重组“不一样”比较句", en: "Rebuild the 不一样 comparison" }, answer: ["这家宾馆", "跟", "别的", "都", "不一样"], tiles: ["都", "不一样", "别的", "这家宾馆", "跟"], gloss: { 这家宾馆: "โรงแรมนี้", 跟: "กับ", 别的: "ที่อื่น", 都: "ทั้งหมด", 不一样: "ไม่เหมือน" }, translationTh: "โรงแรมนี้ไม่เหมือนที่อื่นเลย", translationEn: "This hotel is unlike all the others.", evidence: "Text 2 · หน้าเล่ม 32", sourceRef: hotelPlanRef },
  },
  {
    id: "h3l4-airport-driver", number: "03", glyph: "司", title: "在机场见司机", titleTh: "พบคนขับรถที่สนามบิน", titleEn: "Meeting the driver at the airport", place: "机场",
    placePy: "jīchǎng", placeTh: "สนามบิน", ...art("airport-driver"),
    imageAlt: { th: "นักเดินทางพบคนขับรถที่สนามบิน", zh: "机场见司机场景", en: "Meeting the driver at the airport" }, source: "Text 3 · หน้าเล่ม 33 · PDF หน้า 45", sourcePage: "33", sourceRef: driverRef,
    context: "在机场，杨同乐和王一飞走出来，跟预约的司机兼导游见面。", contextTh: "ที่สนามบิน หยางถงเล่อกับหวังอี้เฟยออกมาพบคนขับรถและไกด์ที่จองไว้", contextEn: "At the airport, Yang Tongle and Wang Yifei met their pre-booked driver-guide.",
    characters: [{ role: "A", profile: "driverLi", noteTh: "คนขับรถและไกด์ที่มาต้อนรับ", noteZh: "来机场欢迎客人的司机兼导游", noteEn: "The driver-guide welcoming the guests" }, { role: "B", profile: "yang", noteTh: "ผู้โดยสารที่ขอโทษเรื่องเที่ยวบินล่าช้า", noteZh: "为飞机晚点道歉的旅客", noteEn: "The traveler apologizing for the delayed flight" }],
    lines: [
      line(driverRef, { role: "A", speaker: "小李", hanzi: "欢迎你们！我是你们的司机，我姓李，叫我小李就可以。", pinyin: "Huānyíng nǐmen! Wǒ shì nǐmen de sījī, wǒ xìng Lǐ, jiào wǒ Xiǎo Lǐ jiù kěyǐ.", en: "Welcome! I’m your driver. My surname is Li—just call me Xiao Li.", th: "ยินดีต้อนรับ! ผมเป็นคนขับรถของพวกคุณ แซ่หลี่ เรียกผมว่าเสี่ยวหลี่ก็ได้", visual: { zh: "叫我小李", th: "เรียกผมว่าเสี่ยวหลี่", focus: "34% center" } }),
      line(driverRef, { role: "B", speaker: "杨同乐", hanzi: "您好！不好意思，飞机晚点了，让您久等了。", pinyin: "Nín hǎo! Bù hǎoyìsi, fēijī wǎndiǎn le, ràng nín jiǔ děng le.", en: "Hello! Sorry—the flight was delayed and kept you waiting.", th: "สวัสดีครับ ขอโทษ เครื่องบินล่าช้าทำให้คุณรอนาน", visual: { zh: "飞机晚点了", th: "เครื่องบินล่าช้า", focus: "66% center" } }),
      line(driverRef, { role: "A", speaker: "小李", hanzi: "没关系。除了这个行李箱以外，还有别的东西吗？", pinyin: "Méi guānxi. Chúle zhè ge xínglixiāng yǐwài, hái yǒu biéde dōngxi ma?", en: "No problem. Besides this suitcase, is there anything else?", th: "ไม่เป็นไร นอกจากกระเป๋าใบนี้ ยังมีของอย่างอื่นไหม?", visual: { zh: "除了这个行李箱以外", th: "นอกจากกระเป๋าใบนี้", focus: "36% center" } }),
      line(driverRef, { role: "B", speaker: "杨同乐", hanzi: "还有一个包，我自己拿就可以。", pinyin: "Hái yǒu yí ge bāo, wǒ zìjǐ ná jiù kěyǐ.", en: "There’s one more bag. I can carry it myself.", th: "ยังมีกระเป๋าอีกหนึ่งใบ ผมถือเองได้", visual: { zh: "我自己拿", th: "ผมถือเอง", focus: "64% center" } }),
      line(driverRef, { role: "A", speaker: "小李", hanzi: "车在一层，请跟我来。", pinyin: "Chē zài yì céng, qǐng gēn wǒ lái.", en: "The car is on the first floor. Please follow me.", th: "รถอยู่ชั้นหนึ่ง เชิญตามผมมา", visual: { zh: "请跟我来", th: "เชิญตามผมมา", focus: "38% center" } }),
      line(driverRef, { role: "B", speaker: "杨同乐", hanzi: "我们住的宾馆离机场远吗？", pinyin: "Wǒmen zhù de bīnguǎn lí jīchǎng yuǎn ma?", en: "Is our hotel far from the airport?", th: "โรงแรมที่เราพักอยู่ไกลจากสนามบินไหม?", visual: { zh: "离机场远吗", th: "ไกลจากสนามบินไหม", focus: "62% center" } }),
      line(driverRef, { role: "A", speaker: "小李", hanzi: "不远，三十分钟就能到。两位到了可以先休息休息，晚饭的时候我叫你们。", pinyin: "Bù yuǎn, sānshí fēnzhōng jiù néng dào. Liǎng wèi dào le kěyǐ xiān xiūxixiūxi, wǎnfàn de shíhou wǒ jiào nǐmen.", en: "Not far—thirty minutes. You can rest first after arriving; I’ll call you at dinner time.", th: "ไม่ไกล สามสิบนาทีก็ถึง ถึงแล้วทั้งสองท่านพักก่อน พอถึงเวลาอาหารเย็นผมจะเรียก", visual: { zh: "三十分钟就能到", th: "สามสิบนาทีก็ถึง", focus: "40% center" } }),
    ],
    qte: { after: 2, prompt: { th: "นอกจากกระเป๋าเดินทาง ยังมีอะไรอีก?", zh: "除了行李箱以外，还有什么？", en: "Besides the suitcase, what else is there?" }, options: [{ value: "一个包", zh: "一个包", pinyin: "yí ge bāo", th: "กระเป๋าหนึ่งใบ" }, { value: "一台相机", zh: "一台相机", pinyin: "yì tái xiàngjī", th: "กล้องหนึ่งตัว" }, { value: "一匹马", zh: "一匹马", pinyin: "yì pǐ mǎ", th: "ม้าหนึ่งตัว" }], correct: "一个包", evidence: "杨同乐：还有一个包。", evidenceTh: "หยางถงเล่อ: ยังมีกระเป๋าอีกหนึ่งใบ", sourceRef: driverRef },
    builder: { prompt: { th: "เรียงประโยคถามของเพิ่มเติม", zh: "重组“除了”句", en: "Rebuild the 除了 sentence" }, answer: ["除了", "这个行李箱", "以外", "还有", "别的东西", "吗"], tiles: ["别的东西", "吗", "以外", "除了", "还有", "这个行李箱"], gloss: { 除了: "นอกจาก", 这个行李箱: "กระเป๋าใบนี้", 以外: "นอกเหนือจาก", 还有: "ยังมี", 别的东西: "ของอื่น", 吗: "ไหม" }, translationTh: "นอกจากกระเป๋าใบนี้ ยังมีของอื่นไหม?", translationEn: "Besides this suitcase, is there anything else?", evidence: "Text 3 · หน้าเล่ม 33", sourceRef: driverRef },
  },
];

export const LESSON_HSK3_L4 = {
  id: "hsk3-l4", slug: "lesson-4", level: "hsk3", number: 4, featured: false, sourceRef,
  source: { title: "新HSK教程 3 · New HSK Course 3", lesson: "Lesson 4 · 这家宾馆跟别的都不一样", printedPages: "29–37", pdfPages: "41–49", file: "hsk3.pdf", sourceRef },
  title: { zh: "这家宾馆跟别的都不一样", pinyin: "Zhè jiā bīnguǎn gēn biéde dōu bù yíyàng", en: "This hotel is unlike any other", thAid: "โรงแรมนี้ไม่เหมือนที่อื่นเลย" },
  summary: { zh: "商量假期、准备旅行并在机场见司机，学习完全否定、“跟……一样”和“除了”。", en: "Plan a holiday, prepare the trip, and meet a driver while learning complete negation, 跟……一样, and 除了.", thAid: "วางแผนวันหยุด เตรียมการเดินทาง และพบคนขับรถ พร้อมฝึกการปฏิเสธทั้งหมด 跟……一样 และ 除了" },
  translationPolicy: { kind: "editorial-aid", labelTh: "คำแปลไทยเพื่อช่วยเรียน เรียบเรียงจากต้นฉบับ" },
  objectives: [
    { zh: "能听懂并谈论假期计划，能表达旅游过程中的感受。", en: "Understand and discuss holiday plans and express feelings during travel.", thAid: "ฟังและคุยเรื่องแผนวันหยุด รวมทั้งบอกความรู้สึกระหว่างเดินทาง", sourceRef: lessonHsk3L4SourceRef("29", "41") },
    { zh: "能听懂并表达完全否定的意义。", en: "Understand and express complete negation.", thAid: "ฟังเข้าใจและใช้รูปปฏิเสธทั้งหมด", sourceRef: lessonHsk3L4SourceRef("29", "41") },
    { zh: "掌握“除了”的用法，能表达排除或补充的意义。", en: "Use 除了 to express exclusion or addition.", thAid: "ใช้ 除了 เพื่อยกเว้นหรือเพิ่มข้อมูล", sourceRef: lessonHsk3L4SourceRef("29", "41") },
  ],
  contents: [
    { number: "00", title: "目标与热身", titleTh: "เป้าหมายและการเตรียมบท", detail: "Objectives · Warm-Up", pages: "29", route: "/home/hsk3/lesson-4/preface/", sourceRef: lessonHsk3L4SourceRef("29", "41") },
    { number: "01", title: "商量假期去哪儿", titleTh: "วางแผนเที่ยววันหยุด", detail: "Text 1 · New Words 1–9", pages: "30–31", scene: 1, sourceRef: lessonHsk3L4SourceRef("30-31", "42-43") },
    { number: "02", title: "准备机票和宾馆", titleTh: "เตรียมตั๋วและโรงแรม", detail: "Text 2 · New Words 10–17", pages: "31–32", scene: 2, sourceRef: lessonHsk3L4SourceRef("31-32", "43-44") },
    { number: "03", title: "在机场见司机", titleTh: "พบคนขับรถที่สนามบิน", detail: "Text 3 · New Words 18–24", pages: "33–34", scene: 3, sourceRef: lessonHsk3L4SourceRef("33-34", "45-46") },
    { number: "04", title: "旅行日记、练习与活动", titleTh: "บันทึกการเดินทาง แบบฝึก และกิจกรรม", detail: "Text 4 · Exercises · Activity", pages: "35–36", sourceRef: lessonHsk3L4SourceRef("35-36", "47-48") },
  ],
  vocabulary,
  grammarFocus: [
    { title: "固定格式“一……也/都+不/没……”", titleEn: "Complete Negation", explanationZh: "“一+量词+也/都+不/没”或“一点儿也/都+不/没”表示完全否定。", explanationEn: "一 + measure word + 也/都 + 不/没 and 一点儿也/都 + 不/没 express complete negation.", thAid: "ใช้ 一+ลักษณนาม+也/都+不/没 หรือ 一点儿也不/没 เพื่อปฏิเสธทั้งหมดว่าไม่เลยแม้แต่น้อย", examples: ["草原一点儿也不冷。", "她一件衣服都不想买。", "我一个中国电影也没看过。"], sourceRef: lessonHsk3L4SourceRef("31", "43") },
    { title: "比较句“A跟B一样”", titleEn: "Comparative Sentence A跟B一样", explanationZh: "“A跟B一样”表示比较结果相同；否定形式在“一样”前加“不”。", explanationEn: "A跟B一样 states that A and B are the same; add 不 before 一样 for the negative form.", thAid: "A跟B一样 ใช้บอกว่า A เหมือน B และวาง 不 หน้า 一样 เพื่อบอกว่าไม่เหมือน", examples: ["这个房间跟那个房间一样大。", "他买的新手机跟我的一样。", "这家宾馆跟别的都不一样。"], sourceRef: lessonHsk3L4SourceRef("32-33", "44-45") },
    { title: "固定格式“除了（以外），……都/还/也……”", titleEn: "Pattern 除了……（以外）", explanationZh: "“除了……都……”表示排除后其余相同；“除了……还/也……”表示在已有内容上补充。", explanationEn: "除了……都…… excludes one part while the rest share a condition; 除了……还/也…… adds another item.", thAid: "除了……都…… ใช้ยกเว้น ส่วน 除了……还/也…… ใช้เพิ่มข้อมูลอีกอย่าง", examples: ["除了我以外，大家都在玩手机。", "除了这个行李箱以外，还有别的东西吗？", "除了唱歌以外，他也喜欢跳舞。"], sourceRef: lessonHsk3L4SourceRef("34", "46") },
  ],
  characters,
  scenes,
};
