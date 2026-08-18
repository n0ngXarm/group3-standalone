import { group3AssetPath } from "../../../../config.js";

const SOURCE_FILE = "docs/references/hsk/sources/hsk2.pdf";

export function lessonHsk2L11SourceRef(printedPages, pdfPages) {
  return `${SOURCE_FILE}#printed-pages=${printedPages}&pdf-pages=${pdfPages}`;
}

const sourceRef = lessonHsk2L11SourceRef("93-101", "107-115");

const characters = {
  teacherWang: {
    hanzi: "王一飞",
    pinyin: "Wáng Yīfēi",
    nameTh: "อาจารย์หวังอี้เฟย",
    nameEn: "Ms. Wang",
    image: group3AssetPath("/assets/group3/lesson-hsk2-l11-classroom-v1.webp"),
    imageSrcSet: `${group3AssetPath("/assets/group3/lesson-hsk2-l11-classroom-720w-v1.webp")} 720w, ${group3AssetPath("/assets/group3/lesson-hsk2-l11-classroom-v1.webp")} 1400w`,
    imageFocus: "72% center",
  },
  bai: {
    hanzi: "白家月",
    pinyin: "Bái Jiāyuè",
    nameTh: "ไป๋เจียเยว่",
    nameEn: "Bai Jiayue",
    image: group3AssetPath("/assets/group3/lesson-hsk2-l11-classroom-v1.webp"),
    imageSrcSet: `${group3AssetPath("/assets/group3/lesson-hsk2-l11-classroom-720w-v1.webp")} 720w, ${group3AssetPath("/assets/group3/lesson-hsk2-l11-classroom-v1.webp")} 1400w`,
    imageFocus: "26% center",
  },
  liWen: {
    hanzi: "李文",
    pinyin: "Lǐ Wén",
    nameTh: "หลี่เหวิน",
    nameEn: "Li Wen",
    image: group3AssetPath("/assets/group3/lesson-hsk2-l11-room-v1.webp"),
    imageSrcSet: `${group3AssetPath("/assets/group3/lesson-hsk2-l11-room-720w-v1.webp")} 720w, ${group3AssetPath("/assets/group3/lesson-hsk2-l11-room-v1.webp")} 1400w`,
    imageFocus: "68% center",
  },
};

const vocabularyPages = [
  [1, "头", "tóu", "n.", "head", "หัว", 94, 108],
  [2, "疼", "téng", "adj.", "hurt; painful", "ปวด / เจ็บ", 94, 108],
  [3, "动", "dòng", "v.", "move", "ขยับ / เคลื่อนไหว", 94, 108],
  [4, "着", "zhe", "part.", "after a verb: continuation of an action or state", "กำลัง…อยู่ (คำช่วยบอกการดำเนินอยู่)", 94, 108],
  [5, "经常", "jīngcháng", "adv.", "frequently; often", "บ่อย ๆ", 94, 108],
  [6, "路上", "lùshang", "n.", "road; trip", "บนถนน / ระหว่างทาง", 96, 110],
  [7, "慢", "màn", "adj.", "slow", "ช้า", 96, 110],
  [8, "进", "jìn", "v.", "come into", "เข้ามา", 98, 112],
  [9, "药", "yào", "n.", "medicine", "ยา", 98, 112],
  [10, "身体", "shēntǐ", "n.", "body; health", "ร่างกาย / สุขภาพ", 98, 112],
  [11, "时", "shí", "n.", "a period of time", "เวลา / ตอนที่", 98, 112],
  [12, "最", "zuì", "adv.", "most", "ที่สุด", 98, 112],
  [13, "药店", "yàodiàn", "n.", "pharmacy", "ร้านขายยา", 99, 113],
  [14, "医生", "yīshēng", "n.", "doctor", "หมอ", 98, 112],
  [15, "医院", "yīyuàn", "n.", "hospital", "โรงพยาบาล", 94, 108],
  [16, "开车", "kāichē", "v.", "drive", "ขับรถ", 96, 110],
  [17, "下雪", "xiàxuě", "v.", "snow", "หิมะตก", 96, 110],
  [18, "一会儿", "yíhuìr", "n.", "a short while", "สักครู่ / เดี๋ยว", 96, 110],
  [19, "打电话", "dǎ diànhuà", "v.", "make a phone call", "โทรศัพท์", 96, 110],
  [20, "舒服", "shūfu", "adj.", "comfortable; well", "สบาย / สบายดี", 94, 108],
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
  sourceRef: lessonHsk2L11SourceRef(String(page), String(pdfPage)),
}));

function line(source, value) {
  return { ...value, sourceRef: source };
}

const classroomRef = lessonHsk2L11SourceRef("94", "108");
const carRef = lessonHsk2L11SourceRef("96", "110");
const roomRef = lessonHsk2L11SourceRef("98", "112");

const scenes = [
  {
    id: "l11-classroom",
    number: "01",
    glyph: "头",
    title: "在教室",
    titleTh: "ในห้องเรียน",
    titleEn: "In the classroom",
    place: "教室",
    placePy: "jiàoshì",
    placeTh: "ห้องเรียน",
    image: group3AssetPath("/assets/group3/lesson-hsk2-l11-classroom-v1.webp"),
    imageSrcSet: `${group3AssetPath("/assets/group3/lesson-hsk2-l11-classroom-720w-v1.webp")} 720w, ${group3AssetPath("/assets/group3/lesson-hsk2-l11-classroom-v1.webp")} 1400w`,
    imageAlt: {
      th: "ห้องเรียน",
      zh: "教室照片",
      en: "Classroom scene",
    },
    source: "Text 1 · หน้าเล่ม 94 · PDF หน้า 108",
    sourcePage: "94",
    sourceRef: classroomRef,
    context: "在教室，王一飞和白家月在聊天儿。",
    contextTh: "ในห้องเรียน อาจารย์หวังอี้เฟยและไป๋เจียเยว่กำลังคุยกัน",
    contextEn: "In the classroom, Wang Yifei and Bai Jiayue were chatting.",
    characters: [
      { role: "A", profile: "teacherWang", noteTh: "อาจารย์ที่เห็นลูกศิษย์ไม่สบายจึงเสนอพาไปโรงพยาบาล", noteZh: "发现学生不舒服、提议去医院的老师", noteEn: "The teacher who notices her student is unwell" },
      { role: "B", profile: "bai", noteTh: "นักเรียนที่ปวดหัวและขยับไม่ได้", noteZh: "头疼不能动的学生", noteEn: "The student with a headache" },
    ],
    lines: [
      line(classroomRef, { role: "A", speaker: "王一飞", pinyin: "dōu xiàkè le, nǐ zěnme hái bù huíjiā", hanzi: "家月，都下课了，你怎么还不回家？", reading: "Jiāyuè, dōu xiàkè le, nǐ zěnme hái bù huíjiā?", en: "Jiayue, class is over. Why aren’t you going home?", th: "เจียเยว่ เลิกเรียนแล้ว ทำไมยังไม่กลับบ้าน?", visual: { zh: "怎么还不回家", th: "ทำไมยังไม่กลับบ้าน", focus: "72% center" } }),
      line(classroomRef, { role: "B", speaker: "白家月", pinyin: "wǒ tóu téng, bú tài shūfu", hanzi: "我头疼，不太舒服。", reading: "Wǒ tóu téng, bú tài shūfu.", en: "I have a headache. I’m not feeling well.", th: "ฉันปวดหัว รู้สึกไม่ค่อยสบาย", visual: { zh: "头疼", th: "ปวดหัว", focus: "26% center" } }),
      line(classroomRef, { role: "A", speaker: "王一飞", pinyin: "nǐ zhè jǐ tiān jīngcháng tóu téng", hanzi: "你这几天经常头疼，去医院看看吧。", reading: "Nǐ zhè jǐ tiān jīngcháng tóu téng, qù yīyuàn kànkan ba.", en: "You’ve been having headaches frequently these days. You should go to the hospital.", th: "ช่วงนี้เธอปวดหัวบ่อย ไปหาหมอที่โรงพยาบาลดูเถอะ", visual: { zh: "去医院看看", th: "ไปโรงพยาบาล", focus: "70% center" } }),
      line(classroomRef, { role: "B", speaker: "白家月", pinyin: "wǒ xiǎng xiūxi yíxià, xiànzài bù néng dòng", hanzi: "我想休息一下，现在不能动。", reading: "Wǒ xiǎng xiūxi yíxià, xiànzài bù néng dòng.", en: "I want to rest for a while. I can’t move right now.", th: "ฉันอยากพักสักหน่อย ตอนนี้ขยับไม่ได้", visual: { zh: "不能动", th: "ขยับไม่ได้", focus: "30% center" } }),
      line(classroomRef, { role: "A", speaker: "王一飞", pinyin: "nǐ zài zhèr zuòzhe, wǒ qù kāichē", hanzi: "那你在这儿坐着，我去开车，一会儿送你去医院。", reading: "Nà nǐ zài zhèr zuòzhe, wǒ qù kāichē, yíhuìr sòng nǐ qù yīyuàn.", en: "Then stay here and sit. I’ll go get the car and take you to the hospital in a bit.", th: "งั้นเธอนั่งอยู่ตรงนี้ก่อน ฉันไปเอารถ เดี๋ยวพาเธอไปโรงพยาบาล", visual: { zh: "在这儿坐着", th: "นั่งอยู่ตรงนี้", focus: "68% center" } }),
      line(classroomRef, { role: "B", speaker: "白家月", pinyin: "xièxie Wáng lǎoshī", hanzi: "谢谢王老师。", reading: "Xièxie Wáng lǎoshī.", en: "Thank you, Ms. Wang.", th: "ขอบคุณคุณครูหวัง", visual: { zh: "谢谢", th: "ขอบคุณ", focus: "28% center" } }),
    ],
    qte: {
      after: 1,
      prompt: { th: "ไป๋เจียเยว่ไม่กลับบ้านเพราะอะไร?", zh: "白家月为什么不回家？", en: "Why isn’t Bai Jiayue going home?" },
      options: [
        { value: "头疼", zh: "头疼", pinyin: "tóu téng", th: "ปวดหัว" },
        { value: "要上课", zh: "要上课", pinyin: "yào shàngkè", th: "ต้องเรียน" },
        { value: "等朋友", zh: "等朋友", pinyin: "děng péngyou", th: "รอเพื่อน" },
      ],
      correct: "头疼",
      evidence: "白家月：我头疼，不太舒服。",
      evidenceTh: "ไป๋เจียเยว่: ฉันปวดหัว รู้สึกไม่ค่อยสบาย",
      sourceRef: classroomRef,
    },
    builder: {
      prompt: { th: "เรียงประโยคแนะนำของอาจารย์", zh: "重组老师建议去医院的句子", en: "Rebuild the teacher’s suggestion" },
      answer: ["去", "医院", "看看", "吧"],
      tiles: ["医院", "去", "吧", "看看"],
      gloss: { 去: "ไป", 医院: "โรงพยาบาล", 看看: "ไปดู", 吧: "เถอะ" },
      translationTh: "ไปโรงพยาบาลดูเถอะ",
      translationEn: "You should go to the hospital.",
      evidence: "Text 1 · หน้าเล่ม 94",
      sourceRef: classroomRef,
    },
  },
  {
    id: "l11-car",
    number: "02",
    glyph: "雪",
    title: "在车里",
    titleTh: "ในรถ",
    titleEn: "In the car",
    place: "王一飞的车里",
    placeTh: "ในรถของอาจารย์หวัง",
    image: group3AssetPath("/assets/group3/lesson-hsk2-l11-car-v1.webp"),
    imageSrcSet: `${group3AssetPath("/assets/group3/lesson-hsk2-l11-car-720w-v1.webp")} 720w, ${group3AssetPath("/assets/group3/lesson-hsk2-l11-car-v1.webp")} 1400w`,
    imageAlt: {
      th: "การขับรถท่ามกลางหิมะ",
      zh: "雪天开车照片",
      en: "Driving in the snow",
    },
    source: "Text 2 · หน้าเล่ม 96 · PDF หน้า 110",
    sourcePage: "96",
    sourceRef: carRef,
    context: "在王一飞车里，王一飞和白家月在聊天儿，李文打来一个电话。",
    contextTh: "ในรถ อาจารย์หวังและไป๋เจียเยว่กำลังคุยกัน แล้วหลี่เหวินโทรเข้ามา",
    contextEn: "In Wang Yifei’s car, Li Wen called while they were chatting.",
    characters: [
      { role: "A", profile: "teacherWang", noteTh: "คนขับที่ให้ลูกศิษย์รับสายแทน", noteZh: "开车并让学生帮忙接电话的老师", noteEn: "The teacher driving, asking her student to answer the call" },
      { role: "B", profile: "bai", noteTh: "นักเรียนที่รับสายแทนอาจารย์", noteZh: "帮老师接电话的学生", noteEn: "The student answering the call" },
      { role: "C", profile: "liWen", noteTh: "เพื่อนร่วมชั้นที่โทรมาสอบถามและจะไปเยี่ยม", noteZh: "打电话问候并说要探望的同学", noteEn: "The classmate calling to check in" },
    ],
    lines: [
      line(carRef, { role: "A", speaker: "王一飞", pinyin: "xiànzài lùshang chē duō, hái xiàzhe xuě", hanzi: "现在路上车多，还下着雪，我开慢一点儿。", reading: "Xiànzài lùshang chē duō, hái xiàzhe xuě, wǒ kāi màn yìdiǎnr.", en: "There are a lot of cars on the road right now, and it’s snowing. I’ll drive a bit slower.", th: "ตอนนี้รถบนถนนเยอะ แถมหิมะกำลังตก ฉันขับช้าลงหน่อย", visual: { zh: "下着雪", th: "หิมะกำลังตก", focus: "70% center" } }),
      line(carRef, { role: "B", speaker: "白家月", pinyin: "xiànzài tóu méi nàme téng le", hanzi: "没问题，现在头没那么疼了。", reading: "Méi wèntí, xiànzài tóu méi nàme téng le.", en: "No problem. My head doesn’t hurt as much now.", th: "ไม่เป็นไร ตอนนี้ปวดหัวน้อยลงแล้ว", visual: { zh: "没那么疼", th: "ปวดน้อยลง", focus: "26% center" } }),
      line(carRef, { role: "A", speaker: "王一飞", pinyin: "lǐ Wén lái diànhuà le, nǐ bāng wǒ jiē yíxià", hanzi: "好。李文来电话了，你帮我接一下。", reading: "Hǎo. Lǐ Wén lái diànhuà le, nǐ bāng wǒ jiē yíxià.", en: "Okay. Li Wen is calling — please answer it for me.", th: "ดี หลี่เหวินโทรมา เธอช่วยรับสายให้หน่อย", visual: { zh: "帮我接一下", th: "ช่วยรับสาย", focus: "68% center" } }),
      line(carRef, { role: "B", speaker: "白家月", pinyin: "wáng lǎoshī kāizhe chē ne", hanzi: "喂，李文，王老师开着车呢，你找她有事吗？", reading: "Wèi, Lǐ Wén, Wáng lǎoshī kāizhe chē ne, nǐ zhǎo tā yǒu shì ma?", en: "Hello, Li Wen. Ms. Wang is driving right now. Do you need to talk to her?", th: "ฮัลโหล หลี่เหวิน คุณครูกำลังขับรถอยู่ มีธุระอะไรไหม?", visual: { zh: "开着车", th: "กำลังขับรถ", focus: "30% center" } }),
      line(carRef, { role: "C", speaker: "李文", pinyin: "jīntiān xuě zhème dà, nǐmen kāichē qù nǎr a", hanzi: "没什么事。今天雪这么大，你们开车去哪儿啊？", reading: "Méi shénme shì. Jīntiān xuě zhème dà, nǐmen kāichē qù nǎr a?", en: "It’s nothing important. The snow is so heavy today — where are you driving to?", th: "ไม่มีอะไรสำคัญ วันนี้หิมะตกหนักมาก พวกเธอขับรถไปไหนกัน?", visual: { zh: "雪这么大", th: "หิมะหนักขนาดนี้", focus: "62% center" } }),
      line(carRef, { role: "B", speaker: "白家月", pinyin: "qù yīyuàn, wǒ tóu yǒudiǎnr téng", hanzi: "去医院，我头有点儿疼。", reading: "Qù yīyuàn, wǒ tóu yǒudiǎnr téng.", en: "To the hospital. I have a bit of a headache.", th: "ไปโรงพยาบาล ฉันปวดหัวนิดหน่อย", visual: { zh: "有点儿疼", th: "ปวดนิดหน่อย", focus: "28% center" } }),
      line(carRef, { role: "C", speaker: "李文", pinyin: "nà wǒ yíhuìr qù kànkan nǐ", hanzi: "那我一会儿去看看你。", reading: "Nà wǒ yíhuìr qù kànkan nǐ.", en: "Then I’ll come visit you later.", th: "งั้นเดี๋ยวฉันไปเยี่ยมเธอ", visual: { zh: "去看看你", th: "ไปเยี่ยมเธอ", focus: "58% center" } }),
    ],
    qte: {
      after: 3,
      prompt: { th: "ตอนที่หลี่เหวินโทรมา อาจารย์หวังกำลังทำอะไร?", zh: "李文打电话时，王一飞在做什么？", en: "What is Wang Yifei doing when Li Wen calls?" },
      options: [
        { value: "开车", zh: "开车", pinyin: "kāichē", th: "ขับรถ" },
        { value: "接电话", zh: "接电话", pinyin: "jiē diànhuà", th: "รับโทรศัพท์" },
        { value: "看病", zh: "看病", pinyin: "kàn bìng", th: "หาหมอ" },
      ],
      correct: "开车",
      evidence: "白家月：王老师开着车呢。",
      evidenceTh: "ไป๋เจียเยว่: คุณครูกำลังขับรถอยู่",
      sourceRef: carRef,
    },
    builder: {
      prompt: { th: "เรียงประโยคขอร้องของอาจารย์", zh: "重组老师请学生帮忙的句子", en: "Rebuild the teacher’s request" },
      answer: ["你", "帮", "我", "接", "一下"],
      tiles: ["一下", "帮", "你", "接", "我"],
      gloss: { 你: "เธอ", 帮: "ช่วย", 我: "ฉัน", 接: "รับสาย", 一下: "หน่อย" },
      translationTh: "เธอช่วยรับสายให้ฉันหน่อย",
      translationEn: "Please answer it for me.",
      evidence: "Text 2 · หน้าเล่ม 96",
      sourceRef: carRef,
    },
  },
  {
    id: "l11-room",
    number: "03",
    glyph: "药",
    title: "在房间",
    titleTh: "ในห้อง",
    titleEn: "In the room",
    place: "白家月的房间",
    placeTh: "ห้องของไป๋เจียเยว่",
    image: group3AssetPath("/assets/group3/lesson-hsk2-l11-room-v1.webp"),
    imageSrcSet: `${group3AssetPath("/assets/group3/lesson-hsk2-l11-room-720w-v1.webp")} 720w, ${group3AssetPath("/assets/group3/lesson-hsk2-l11-room-v1.webp")} 1400w`,
    imageAlt: {
      th: "การเยี่ยมไข้ในห้อง",
      zh: "房间探望照片",
      en: "Room visit scene",
    },
    source: "Text 3 · หน้าเล่ม 98 · PDF หน้า 112",
    sourcePage: "98",
    sourceRef: roomRef,
    context: "在房间，李文来看望白家月。",
    contextTh: "ในห้อง หลี่เหวินมาเยี่ยมไป๋เจียเยว่",
    contextEn: "In the room, Li Wen came to visit Bai Jiayue.",
    characters: [
      { role: "A", profile: "liWen", noteTh: "เพื่อนที่มาเยี่ยมและถามอาการ", noteZh: "来探望并问候病情的同学", noteEn: "The classmate visiting to check on her" },
      { role: "B", profile: "bai", noteTh: "คนไข้ที่อาการดีขึ้นแล้ว", noteZh: "好转的病人", noteEn: "The patient who is feeling better" },
      { role: "C", profile: "teacherWang", noteTh: "อาจารย์ที่อาสาทำอาหารจีนให้", noteZh: "要做中国菜给学生的老师", noteEn: "The teacher offering to cook Chinese food" },
    ],
    lines: [
      line(roomRef, { role: "B", speaker: "白家月", pinyin: "lǐ Wén, kuài qǐng jìn", hanzi: "李文，快请进！", reading: "Lǐ Wén, kuài qǐng jìn!", en: "Li Wen, please come in!", th: "หลี่เหวิน เชิญเข้ามาเร็ว!", visual: { zh: "请进", th: "เชิญเข้ามา", focus: "30% center" } }),
      line(roomRef, { role: "A", speaker: "李文", pinyin: "nǐ zěnmeyàng le? tóu hái téng ma", hanzi: "家月，你怎么样了？头还疼吗？", reading: "Jiāyuè, nǐ zěnmeyàng le? Tóu hái téng ma?", en: "Jiayue, how are you feeling? Does your head still hurt?", th: "เจียเยว่ เป็นอย่างไรบ้าง? ยังปวดหัวอยู่ไหม?", visual: { zh: "怎么样了", th: "เป็นอย่างไรบ้าง", focus: "64% center" } }),
      line(roomRef, { role: "B", speaker: "白家月", pinyin: "yīshēng kāi le yìxiē yào, chī wán jiù hǎo duō le", hanzi: "不那么疼了。医生开了一些药，吃完就好多了。", reading: "Bú nàme téng le. Yīshēng kāi le yìxiē yào, chī wán jiù hǎo duō le.", en: "It doesn’t hurt much. The doctor prescribed some medicine, and I feel much better after taking it.", th: "ปวดน้อยลงแล้ว หมอสั่งยาให้ พอกินแล้วก็ดีขึ้นมาก", visual: { zh: "开了一些药", th: "สั่งยาให้", focus: "32% center" } }),
      line(roomRef, { role: "A", speaker: "李文", pinyin: "nà jiù hǎo", hanzi: "那就好！", reading: "Nà jiù hǎo!", en: "That’s good to hear!", th: "งั้นก็ดีแล้ว!", visual: { zh: "那就好", th: "งั้นก็ดี", focus: "60% center" } }),
      line(roomRef, { role: "C", speaker: "王一飞", pinyin: "nǐ zuì xǐhuan chī Zhōngguó cài, wǒ zuò jǐ ge Zhōngguó cài ba", hanzi: "家月，你想不想吃点儿东西？你最喜欢吃中国菜，我做几个中国菜吧。", reading: "Jiāyuè, nǐ xiǎng bu xiǎng chī diǎnr dōngxi? Nǐ zuì xǐhuan chī Zhōngguó cài, wǒ zuò jǐ ge Zhōngguó cài ba.", en: "Jiayue, would you like something to eat? You love Chinese food the most, so I’ll cook some Chinese dishes.", th: "เจียเยว่ อยากกินอะไรหน่อยไหม? เธอชอบอาหารจีนที่สุด ฉันทำอาหารจีนให้สักสองสามอย่างนะ", visual: { zh: "最喜欢吃中国菜", th: "ชอบอาหารจีนที่สุด", focus: "68% center" } }),
      line(roomRef, { role: "B", speaker: "白家月", pinyin: "hǎo de, xièxie Wáng lǎoshī", hanzi: "好的，谢谢王老师。", reading: "Hǎo de, xièxie Wáng lǎoshī.", en: "Okay, thank you, Ms. Wang.", th: "ค่ะ ขอบคุณคุณครูหวัง", visual: { zh: "谢谢", th: "ขอบคุณ", focus: "28% center" } }),
    ],
    qte: {
      after: 2,
      prompt: { th: "ใครมาเยี่ยมไป๋เจียเยว่?", zh: "谁来看望白家月？", en: "Who comes to visit Bai Jiayue?" },
      options: [
        { value: "李文", zh: "李文", pinyin: "Lǐ Wén", th: "หลี่เหวิน" },
        { value: "医生", zh: "医生", pinyin: "yīshēng", th: "หมอ" },
        { value: "安妮", zh: "安妮", pinyin: "Ānnī", th: "อันนี่" },
      ],
      correct: "李文",
      evidence: "李文：家月，你怎么样了？",
      evidenceTh: "หลี่เหวิน: เจียเยว่ เป็นอย่างไรบ้าง?",
      sourceRef: roomRef,
    },
    builder: {
      prompt: { th: "เรียงประโยคที่อาจารย์พูดถึงความชอบของเจียเยว่", zh: "重组老师说明学生最爱吃的句子", en: "Rebuild the teacher’s favourite-food sentence" },
      answer: ["你", "最", "喜欢", "吃", "中国菜"],
      tiles: ["中国菜", "吃", "你", "喜欢", "最"],
      gloss: { 你: "เธอ", 最: "ที่สุด", 喜欢: "ชอบ", 吃: "กิน", 中国菜: "อาหารจีน" },
      translationTh: "เธอชอบกินอาหารจีนที่สุด",
      translationEn: "You love Chinese food the most.",
      evidence: "Text 3 · หน้าเล่ม 98",
      sourceRef: roomRef,
    },
  },
];

export const LESSON_HSK2_L11 = {
  id: "hsk2-l11",
  slug: "lesson-11",
  level: "hsk2",
  number: 11,
  featured: false,
  source: {
    title: "新HSK教程 2 · New HSK Course 2",
    lesson: "Lesson 11 · 我最喜欢吃中国菜",
    printedPages: "93–101",
    pdfPages: "107–115",
    file: "hsk2.pdf",
    sourceRef,
  },
  sourceRef,
  title: {
    zh: "我最喜欢吃中国菜",
    pinyin: "Wǒ zuì xǐhuan chī Zhōngguó cài",
    en: "I like Chinese food the most",
    thAid: "ฉันชอบกินอาหารจีนที่สุด",
  },
  summary: {
    zh: "从教室头疼到开车送医院，学习动态助词“着”和程度副词“最”。",
    en: "From a headache in the classroom to a drive to the hospital, learn the aspect particle 着 and the adverb 最.",
    thAid: "ตั้งแต่ปวดหัวในห้องเรียนจนถูกพาไปโรงพยาบาล ฝึกคำช่วย 着 และคำวิเศษณ์ 最",
  },
  translationPolicy: { kind: "editorial-aid", labelTh: "คำแปลไทยเพื่อช่วยเรียน เรียบเรียงจากต้นฉบับ" },
  objectives: [
    { zh: "能听懂并描述身体状况和病情。", en: "Be able to understand and describe physical conditions and illnesses.", thAid: "ฟังและอธิบายอาการเจ็บป่วยของร่างกาย", sourceRef: lessonHsk2L11SourceRef("93", "107") },
    { zh: "能听懂并使用动态助词“着”表达动作或状态的持续。", en: "Be able to understand and use the aspect particle “着” to express the continuation of an action or a state.", thAid: "เข้าใจและใช้คำช่วย 着 เพื่อบอกการดำเนินต่อเนื่องของการกระทำหรือสภาพ", sourceRef: lessonHsk2L11SourceRef("93", "107") },
    { zh: "掌握程度副词“最”的用法。", en: "Master the use of the adverb of degree “最”.", thAid: "เข้าใจคำวิเศษณ์แสดงระดับ 最 (ที่สุด)", sourceRef: lessonHsk2L11SourceRef("93", "107") },
  ],
  contents: [
    { number: "00", title: "目标与热身", titleTh: "เป้าหมายและการเตรียมบท", detail: "Objectives · Warm-Up", pages: "93", route: "/home/hsk2/lesson-11/preface/", sourceRef: lessonHsk2L11SourceRef("93", "107") },
    { number: "01", title: "在教室", titleTh: "ในห้องเรียน", detail: "Text 1 · New Words 1–5", pages: "94–95", scene: 1, sourceRef: lessonHsk2L11SourceRef("94-95", "108-109") },
    { number: "02", title: "在车里", titleTh: "ในรถ", detail: "Text 2 · New Words 6–7", pages: "96–97", scene: 2, sourceRef: lessonHsk2L11SourceRef("96-97", "110-111") },
    { number: "03", title: "在房间", titleTh: "ในห้อง", detail: "Text 3 · New Words 8–13", pages: "97–99", scene: 3, sourceRef: lessonHsk2L11SourceRef("97-99", "111-113") },
    { number: "04", title: "综合练习与活动", titleTh: "แบบฝึกรวมและกิจกรรม", detail: "Text 4 · Exercises · Activity (source trail)", pages: "99–101", sourceRef: lessonHsk2L11SourceRef("99-101", "113-115") },
  ],
  vocabulary,
  grammarFocus: [
    { title: "动态助词“着”（1）", titleEn: "Aspect Particle “着” (1)", explanationZh: "动态助词“着”用在动词后面，表示动作或状态的持续，否定形式是在动词前面加“没（有）”。", explanationEn: "The aspect particle “着” is used after a verb to indicate the continuation of an action or a state; its negative is formed with “没（有）” before the verb.", thAid: "คำช่วย 着 หลังคำกริยา บอกว่าการกระทำหรือสภาพกำลังดำเนินอยู่; ปฏิเสธด้วย 没(有) หน้าคำกริยา", examples: ["那你在这儿坐着。", "教室的门开着。", "教室的门没开着。"], sourceRef: lessonHsk2L11SourceRef("95", "109") },
    { title: "动态助词“着”（2）", titleEn: "Aspect Particle “着” (2)", explanationZh: "表示动作或状态持续的句子中，宾语要在动态助词“着”的后面。", explanationEn: "In sentences indicating continuation, the object is placed after the particle “着”.", thAid: "ในประโยคที่บอกการดำเนินอยู่ กรรมต้องอยู่หลัง 着", examples: ["现在路上车多，还下着雪，我开慢一点儿。", "她穿着白色的裤子。", "陈天中没拿着咖啡。"], sourceRef: lessonHsk2L11SourceRef("97", "111") },
    { title: "程度副词“最”", titleEn: "Adverb of Degree “最”", explanationZh: "程度副词“最”用在形容词或心理动词前面，表示某种属性超过所有同类的人或事物。", explanationEn: "The adverb of degree “最” is placed before adjectives or psychological verbs to indicate the highest degree.", thAid: "คำวิเศษณ์ 最 หน้าคำคุณศัพท์หรือคำกริยาแสดงความรู้สึก หมายถึงที่สุดในบรรดาทั้งหมด", examples: ["你最喜欢吃中国菜。", "在我们家，爸爸最高。", "你们班谁说中文说得最好？"], sourceRef: lessonHsk2L11SourceRef("99", "113") },
  ],
  characters,
  scenes,
};
