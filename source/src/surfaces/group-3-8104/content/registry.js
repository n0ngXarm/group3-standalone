import { LESSON_13 } from "./lessons/hsk1/lesson-13/content.js";
import { LESSON_10 } from "./lessons/hsk1/lesson-10/content.js";
import { group3SceneMedia } from "../config.js";


export function withCanonicalLessonMedia(lesson) {
  if (!lesson?.scenes) return lesson;
  lesson.scenes.forEach((scene, sceneIndex) => {
    Object.assign(scene, group3SceneMedia(lesson, sceneIndex));
  });
  return lesson;
}

export const GROUP3_LESSONS = [
  withCanonicalLessonMedia(LESSON_10),
  withCanonicalLessonMedia(LESSON_13),
  {
    id: "h1l1-office",
    slug: "lesson-1",
    level: "hsk1",
    number: 1,
    title: {"zh":"AI小语，你好！","pinyin":"AI Xiǎoyǔ, nǐ hǎo!","en":"Hello, AI Xiaoyu!","thAid":"สวัสดีจ้า AI เสี่ยวหวี่!"},
    load: () => import("./lessons/hsk1/lesson-01/content.js").then(m => withCanonicalLessonMedia(m.LESSON_HSK1_L1))
  },
  {
    id: "h1l2-classroom",
    slug: "lesson-2",
    level: "hsk1",
    number: 2,
    title: {"zh":"我叫李文","pinyin":"Wǒ jiào Lǐ Wén","en":"My name is Li Wen","thAid":"ฉันชื่อหลี่เหวิน"},
    load: () => import("./lessons/hsk1/lesson-02/content.js").then(m => withCanonicalLessonMedia(m.LESSON_HSK1_L2))
  },
  {
    id: "h1l3-campus",
    slug: "lesson-3",
    level: "hsk1",
    number: 3,
    title: {"zh":"我是中国人","pinyin":"Wǒ shì Zhōngguó rén","en":"I'm Chinese","thAid":"ฉันเป็นคนจีน"},
    load: () => import("./lessons/hsk1/lesson-03/content.js").then(m => withCanonicalLessonMedia(m.LESSON_HSK1_L3))
  },
  {
    id: "h1l4-home",
    slug: "lesson-4",
    level: "hsk1",
    number: 4,
    title: {"zh":"我有两个孩子","pinyin":"Wǒ yǒu liǎng gè háizi","en":"I have two children","thAid":"ฉันมีลูกสองคน"},
    load: () => import("./lessons/hsk1/lesson-04/content.js").then(m => withCanonicalLessonMedia(m.LESSON_HSK1_L4))
  },
  {
    id: "h1l5-home",
    slug: "lesson-5",
    level: "hsk1",
    number: 5,
    title: {"zh":"今天我休息","pinyin":"Jīntiān wǒ xiūxi","en":"I'm off today","thAid":"วันนี้ฉันหยุดงาน"},
    load: () => import("./lessons/hsk1/lesson-05/content.js").then(m => withCanonicalLessonMedia(m.LESSON_HSK1_L5))
  },
  {
    id: "h1l6-number",
    slug: "lesson-6",
    level: "hsk1",
    number: 6,
    title: {"zh":"你的手机号是多少","pinyin":"Nǐ de shǒujīhào shì duōshao","en":"What's your cell phone number?","thAid":"เบอร์โทรศัพท์ของคุณคืออะไร"},
    load: () => import("./lessons/hsk1/lesson-06/content.js").then(m => withCanonicalLessonMedia(m.LESSON_HSK1_L6))
  },
  {
    id: "h1l7-time",
    slug: "lesson-7",
    level: "hsk1",
    number: 7,
    title: {"zh":"我晚上六点半下班","pinyin":"Wǒ wǎnshang liù diǎn bàn xiàbān","en":"I'll finish work at 6:30 in the evening","thAid":"ฉันเลิกงานตอนหกโมงครึ่ง"},
    load: () => import("./lessons/hsk1/lesson-07/content.js").then(m => withCanonicalLessonMedia(m.LESSON_HSK1_L7))
  },
  {
    id: "h1l8-cat",
    slug: "lesson-8",
    level: "hsk1",
    number: 8,
    title: {"zh":"我爸爸也在医院工作","pinyin":"Wǒ bàba yě zài yīyuàn gōngzuò","en":"My father also works at a hospital","thAid":"พ่อของฉันก็ทำงานที่โรงพยาบาลเหมือนกัน"},
    load: () => import("./lessons/hsk1/lesson-08/content.js").then(m => withCanonicalLessonMedia(m.LESSON_HSK1_L8))
  },
  {
    id: "h1l9-front",
    slug: "lesson-9",
    level: "hsk1",
    number: 9,
    title: {"zh":"我明天上午在学校学习","pinyin":"Wǒ míngtiān shàngwǔ zài xuéxiào xuéxí","en":"I'll be studying at school tomorrow morning","thAid":"พรุ่งนี้เช้าฉันจะเรียนที่มหาวิทยาลัย"},
    load: () => import("./lessons/hsk1/lesson-09/content.js").then(m => withCanonicalLessonMedia(m.LESSON_HSK1_L9))
  },
  {
    id: "h1l11-taxi",
    slug: "lesson-11",
    level: "hsk1",
    number: 11,
    title: {"zh":"我读大学呢","pinyin":"Wǒ dú dàxué ne","en":"I'm studying at university","thAid":"ฉันกำลังเรียนมหาวิทยาลัยอยู่"},
    load: () => import("./lessons/hsk1/lesson-11/content.js").then(m => withCanonicalLessonMedia(m.LESSON_HSK1_L11))
  },
  {
    id: "h1l12-weather",
    slug: "lesson-12",
    level: "hsk1",
    number: 12,
    title: {"zh":"昨天下雪了","pinyin":"Zuótiān xià xuě le","en":"It snowed yesterday","thAid":"เมื่อวานหิมะตก"},
    load: () => import("./lessons/hsk1/lesson-12/content.js").then(m => withCanonicalLessonMedia(m.LESSON_HSK1_L12))
  },
  {
    id: "h1l14-train",
    slug: "lesson-14",
    level: "hsk1",
    number: 14,
    title: {"zh":"我看了一个电影","pinyin":"Wǒ kànle yí ge diànyǐng","en":"I watched a movie","thAid":"ฉันดูหนังหนึ่งเรื่อง"},
    load: () => import("./lessons/hsk1/lesson-14/content.js").then(m => withCanonicalLessonMedia(m.LESSON_HSK1_L14))
  },
  {
    id: "h1l15-meal",
    slug: "lesson-15",
    level: "hsk1",
    number: 15,
    title: {"zh":"大兴机场见！","pinyin":"Dàxīng Jīchǎng jiàn!","en":"See you at Daxing Airport!","thAid":"พบกันที่สนามบินต้าซิง!"},
    load: () => import("./lessons/hsk1/lesson-15/content.js").then(m => withCanonicalLessonMedia(m.LESSON_HSK1_L15))
  },
  {
    id: "l1-airport",
    slug: "lesson-1",
    level: "hsk2",
    number: 1,
    title: {"zh":"她请我们吃了北京烤鸭","pinyin":"Tā qǐng wǒmen chī le Běijīng Kǎoyā","en":"She treated us to Peking Duck","thAid":"เธอเลี้ยงเป็ดปักกิ่งให้พวกเรา"},
    load: () => import("./lessons/hsk2/lesson-01/content.js").then(m => withCanonicalLessonMedia(m.LESSON_HSK2_L1))
  },
  {
    id: "h2l2-hotel",
    slug: "lesson-2",
    level: "hsk2",
    number: 2,
    title: {"zh":"还是打车去北大吧","pinyin":"Háishi dǎchē qù Běidà ba","en":"Let’s take a taxi to Peking University instead","thAid":"นั่งแท็กซี่ไปมหาวิทยาลัยปักกิ่งดีกว่า"},
    load: () => import("./lessons/hsk2/lesson-02/content.js").then(m => withCanonicalLessonMedia(m.LESSON_HSK2_L2))
  },
  {
    id: "h2l3-homecoming",
    slug: "lesson-3",
    level: "hsk2",
    number: 3,
    title: {"zh":"我想去西安旅游","pinyin":"Wǒ xiǎng qù Xī'ān lǚyóu","en":"I want to visit Xi’an","thAid":"ฉันอยากไปเที่ยวซีอาน"},
    load: () => import("./lessons/hsk2/lesson-03/content.js").then(m => withCanonicalLessonMedia(m.LESSON_HSK2_L3))
  },
  {
    id: "l4-mall",
    slug: "lesson-4",
    level: "hsk2",
    number: 4,
    title: {"zh":"你穿红色的很好看","pinyin":"Nǐ chuān hóngsè de hěn hǎokàn","en":"You look pretty good in red","thAid":"คุณใส่สีแดงแล้วสวยมาก"},
    load: () => import("./lessons/hsk2/lesson-04/content.js").then(m => withCanonicalLessonMedia(m.LESSON_HSK2_L4))
  },
  {
    id: "h2l5-hotel-call",
    slug: "lesson-5",
    level: "hsk2",
    number: 5,
    title: {"zh":"第一次去中国朋友家","pinyin":"Dì-yī cì qù Zhōngguó péngyou jiā","en":"Visiting a Chinese friend’s home for the first time","thAid":"ไปบ้านเพื่อนชาวจีนครั้งแรก"},
    load: () => import("./lessons/hsk2/lesson-05/content.js").then(m => withCanonicalLessonMedia(m.LESSON_HSK2_L5))
  },
  {
    id: "h2l6-gift-plan",
    slug: "lesson-6",
    level: "hsk2",
    number: 6,
    title: {"zh":"小雪，生日快乐！","pinyin":"Xiǎoxuě, shēngrì kuàilè!","en":"Happy birthday, Xiaoxue!","thAid":"เสี่ยวเสวี่ย สุขสันต์วันเกิด!"},
    load: () => import("./lessons/hsk2/lesson-06/content.js").then(m => withCanonicalLessonMedia(m.LESSON_HSK2_L6))
  },
  {
    id: "h2l7-basketball",
    slug: "lesson-7",
    level: "hsk2",
    number: 7,
    title: {"zh":"他篮球打得很好","pinyin":"Tā lánqiú dǎ de hěn hǎo","en":"He plays basketball very well","thAid":"เขาเล่นบาสเกตบอลได้ดีมาก"},
    load: () => import("./lessons/hsk2/lesson-07/content.js").then(m => withCanonicalLessonMedia(m.LESSON_HSK2_L7))
  },
  {
    id: "h2l8-watches",
    slug: "lesson-8",
    level: "hsk2",
    number: 8,
    title: {"zh":"虽然你忘了，但是我记得","pinyin":"Suīrán nǐ wàng le, dànshì wǒ jìde","en":"Even though you forgot, I remembered","thAid":"แม้คุณลืม แต่ผมจำได้"},
    load: () => import("./lessons/hsk2/lesson-08/content.js").then(m => withCanonicalLessonMedia(m.LESSON_HSK2_L8))
  },
  {
    id: "l9-store",
    slug: "lesson-9",
    level: "hsk2",
    number: 9,
    title: {"zh":"我去买杯奶茶","pinyin":"Wǒ qù mǎi bēi nǎichá","en":"I’m going to buy a cup of bubble tea","thAid":"ฉันจะไปซื้อชานมสักแก้ว"},
    load: () => import("./lessons/hsk2/lesson-09/content.js").then(m => withCanonicalLessonMedia(m.LESSON_HSK2_L9))
  },
  {
    id: "h2l10-school-prep",
    slug: "lesson-10",
    level: "hsk2",
    number: 10,
    title: {"zh":"就要考试了","pinyin":"Jiù yào kǎoshì le","en":"The exam is coming","thAid":"ใกล้จะสอบแล้ว"},
    load: () => import("./lessons/hsk2/lesson-10/content.js").then(m => withCanonicalLessonMedia(m.LESSON_HSK2_L10))
  },
  {
    id: "l11-classroom",
    slug: "lesson-11",
    level: "hsk2",
    number: 11,
    title: {"zh":"我最喜欢吃中国菜","pinyin":"Wǒ zuì xǐhuan chī Zhōngguó cài","en":"I like Chinese food the most","thAid":"ฉันชอบกินอาหารจีนที่สุด"},
    load: () => import("./lessons/hsk2/lesson-11/content.js").then(m => withCanonicalLessonMedia(m.LESSON_HSK2_L11))
  },
  {
    id: "h2l12-weather-call",
    slug: "lesson-12",
    level: "hsk2",
    number: 12,
    title: {"zh":"这里比北京冷多了","pinyin":"Zhèlǐ bǐ Běijīng lěng duō le","en":"It’s much colder here than in Beijing","thAid":"ที่นี่หนาวกว่าปักกิ่งมาก"},
    load: () => import("./lessons/hsk2/lesson-12/content.js").then(m => withCanonicalLessonMedia(m.LESSON_HSK2_L12))
  },
  {
    id: "h2l13-new-year-flowers",
    slug: "lesson-13",
    level: "hsk2",
    number: 13,
    title: {"zh":"我们爱上中文课","pinyin":"Wǒmen ài shàng Zhōngwén kè","en":"We love attending Chinese class","thAid":"พวกเราชอบเรียนภาษาจีน"},
    load: () => import("./lessons/hsk2/lesson-13/content.js").then(m => withCanonicalLessonMedia(m.LESSON_HSK2_L13))
  },
  {
    id: "h2l14-downstairs-visitor",
    slug: "lesson-14",
    level: "hsk2",
    number: 14,
    title: {"zh":"一个人过年多没意思啊","pinyin":"Yí ge rén guònián duō méiyìsi a","en":"Spending Spring Festival alone is so boring","thAid":"ฉลองตรุษจีนคนเดียวน่าเบื่อมาก"},
    load: () => import("./lessons/hsk2/lesson-14/content.js").then(m => withCanonicalLessonMedia(m.LESSON_HSK2_L14))
  },
  {
    id: "h2l15-exam-plans",
    slug: "lesson-15",
    level: "hsk2",
    number: 15,
    title: {"zh":"我想再去一次中国","pinyin":"Wǒ xiǎng zài qù yí cì Zhōngguó","en":"I want to visit China again","thAid":"ฉันอยากไปประเทศจีนอีกครั้ง"},
    load: () => import("./lessons/hsk2/lesson-15/content.js").then(m => withCanonicalLessonMedia(m.LESSON_HSK2_L15))
  },
  {
    id: "h3l1-home",
    slug: "lesson-1",
    level: "hsk3",
    number: 1,
    title: {"zh":"我们去机场接你们","pinyin":"Wǒmen qù jīchǎng jiē nǐmen","en":"We will pick you up at the airport","thAid":"พวกเราจะไปรับพวกคุณที่สนามบิน"},
    load: () => import("./lessons/hsk3/lesson-01/content.js").then(m => withCanonicalLessonMedia(m.LESSON_HSK3_L1))
  },
  {
    id: "l2-menu",
    slug: "lesson-2",
    level: "hsk3",
    number: 2,
    title: {"zh":"你们想吃什么就点什么","pinyin":"Nǐmen xiǎng chī shénme jiù diǎn shénme","en":"You can order whatever you feel like","thAid":"พวกเธออยากกินอะไรก็สั่งอันนั้นเลย"},
    load: () => import("./lessons/hsk3/lesson-02/content.js").then(m => withCanonicalLessonMedia(m.LESSON_HSK3_L2))
  },
  {
    id: "h3l3-neighborhood",
    slug: "lesson-3",
    level: "hsk3",
    number: 3,
    title: {"zh":"这个小区挺好的","pinyin":"Zhè ge xiǎoqū tǐng hǎo de","en":"This neighborhood is pretty nice","thAid":"ชุมชนนี้ดีทีเดียว"},
    load: () => import("./lessons/hsk3/lesson-03/content.js").then(m => withCanonicalLessonMedia(m.LESSON_HSK3_L3))
  },
  {
    id: "h3l4-grassland",
    slug: "lesson-4",
    level: "hsk3",
    number: 4,
    title: {"zh":"这家宾馆跟别的都不一样","pinyin":"Zhè jiā bīnguǎn gēn biéde dōu bù yíyàng","en":"This hotel is unlike any other","thAid":"โรงแรมนี้ไม่เหมือนที่อื่นเลย"},
    load: () => import("./lessons/hsk3/lesson-04/content.js").then(m => withCanonicalLessonMedia(m.LESSON_HSK3_L4))
  },
  {
    id: "h3l5-walk",
    slug: "lesson-5",
    level: "hsk3",
    number: 5,
    title: {"zh":"这样的照片才好看","pinyin":"Zhèyàng de zhàopiàn cái hǎokàn","en":"Photos like these are the best","thAid":"รูปแบบนี้แหละถึงสวย"},
    load: () => import("./lessons/hsk3/lesson-05/content.js").then(m => withCanonicalLessonMedia(m.LESSON_HSK3_L5))
  },
  {
    id: "h3l6-tickets",
    slug: "lesson-6",
    level: "hsk3",
    number: 6,
    title: {"zh":"高铁上还可以点外卖","pinyin":"Gāotiě shang hái kěyǐ diǎn wàimài","en":"You can even order takeout on a high-speed train","thAid":"บนรถไฟความเร็วสูงยังสั่งอาหารเดลิเวอรีได้ด้วย"},
    load: () => import("./lessons/hsk3/lesson-06/content.js").then(m => withCanonicalLessonMedia(m.LESSON_HSK3_L6))
  },
  {
    id: "l7-bike",
    slug: "lesson-7",
    level: "hsk3",
    number: 7,
    title: {"zh":"那条裙子比短裤更好看","pinyin":"Nà tiáo qúnzi bǐ duǎnkù gèng hǎokàn","en":"That skirt looks even better than the shorts","thAid":"กระโปรงตัวนั้นสวยกว่ากางเกงขาสั้นด้วยซ้ำ"},
    load: () => import("./lessons/hsk3/lesson-07/content.js").then(m => withCanonicalLessonMedia(m.LESSON_HSK3_L7))
  },
  {
    id: "h3l8-gym",
    slug: "lesson-8",
    level: "hsk3",
    number: 8,
    title: {"zh":"今天我出院了","pinyin":"Jīntiān wǒ chūyuàn le","en":"Today I was discharged from the hospital","thAid":"วันนี้ฉันออกจากโรงพยาบาลแล้ว"},
    load: () => import("./lessons/hsk3/lesson-08/content.js").then(m => withCanonicalLessonMedia(m.LESSON_HSK3_L8))
  },
  {
    id: "h3l9-card",
    slug: "lesson-9",
    level: "hsk3",
    number: 9,
    title: {"zh":"打不好没关系","pinyin":"Dǎ bù hǎo méi guānxi","en":"It doesn’t matter if you can’t play well","thAid":"เล่นไม่ดีก็ไม่เป็นไร"},
    load: () => import("./lessons/hsk3/lesson-09/content.js").then(m => withCanonicalLessonMedia(m.LESSON_HSK3_L9))
  },
  {
    id: "h3l10-notes",
    slug: "lesson-10",
    level: "hsk3",
    number: 10,
    title: {"zh":"你明天再把书还给我","pinyin":"Nǐ míngtiān zài bǎ shū huán gěi wǒ","en":"Return the book to me tomorrow","thAid":"พรุ่งนี้ค่อยคืนหนังสือให้ฉัน"},
    load: () => import("./lessons/hsk3/lesson-10/content.js").then(m => withCanonicalLessonMedia(m.LESSON_HSK3_L10))
  },
  {
    id: "h3l11-meeting",
    slug: "lesson-11",
    level: "hsk3",
    number: 11,
    title: {"zh":"看来我没办法解决这个问题","pinyin":"Kànlái wǒ méi bànfǎ jiějué zhège wèntí","en":"It seems I cannot solve this problem","thAid":"ดูเหมือนฉันจะแก้ปัญหานี้ไม่ได้"},
    load: () => import("./lessons/hsk3/lesson-11/content.js").then(m => withCanonicalLessonMedia(m.LESSON_HSK3_L11))
  },
  {
    id: "h3l12-park",
    slug: "lesson-12",
    level: "hsk3",
    number: 12,
    title: {"zh":"这个季节天气变化很快","pinyin":"Zhège jìjié tiānqì biànhuà hěn kuài","en":"The weather changes rapidly in this season","thAid":"ฤดูนี้อากาศเปลี่ยนแปลงเร็วมาก"},
    load: () => import("./lessons/hsk3/lesson-12/content.js").then(m => withCanonicalLessonMedia(m.LESSON_HSK3_L12))
  },
  {
    id: "h3l13-restaurant",
    slug: "lesson-13",
    level: "hsk3",
    number: 13,
    title: {"zh":"我的新邻居来自英国","pinyin":"Wǒ de xīn línjū láizì Yīngguó","en":"My new neighbors come from the UK","thAid":"เพื่อนบ้านใหม่ของฉันมาจากอังกฤษ"},
    load: () => import("./lessons/hsk3/lesson-13/content.js").then(m => withCanonicalLessonMedia(m.LESSON_HSK3_L13))
  },
  {
    id: "h3l14-library",
    slug: "lesson-14",
    level: "hsk3",
    number: 14,
    title: {"zh":"这本书被别人借走了","pinyin":"Zhè běn shū bèi biérén jiè zǒu le","en":"This book is checked out","thAid":"หนังสือเล่มนี้ถูกคนอื่นยืมไปแล้ว"},
    load: () => import("./lessons/hsk3/lesson-14/content.js").then(m => withCanonicalLessonMedia(m.LESSON_HSK3_L14))
  },
  {
    id: "h3l15-neighborhood",
    slug: "lesson-15",
    level: "hsk3",
    number: 15,
    title: {"zh":"我是半个南京人","pinyin":"Wǒ shì bàn ge Nánjīng rén","en":"I am half a Nanjing local","thAid":"ฉันเป็นคนหนานจิงครึ่งหนึ่ง"},
    load: () => import("./lessons/hsk3/lesson-15/content.js").then(m => withCanonicalLessonMedia(m.LESSON_HSK3_L15))
  },
  {
    id: "h3l16-pet-center",
    slug: "lesson-16",
    level: "hsk3",
    number: 16,
    title: {"zh":"我听说有的熊猫出国了","pinyin":"Wǒ tīngshuō yǒude xióngmāo chūguó le","en":"I heard some pandas went abroad","thAid":"ฉันได้ยินว่าแพนด้าบางตัวไปต่างประเทศแล้ว"},
    load: () => import("./lessons/hsk3/lesson-16/content.js").then(m => withCanonicalLessonMedia(m.LESSON_HSK3_L16))
  },
  {
    id: "h3l17-teaching-building",
    slug: "lesson-17",
    level: "hsk3",
    number: 17,
    title: {"zh":"我要多向认真的人学习","pinyin":"Wǒ yào duō xiàng rènzhēn de rén xuéxí","en":"I should learn more from conscientious people","thAid":"ฉันควรเรียนรู้จากคนที่ตั้งใจให้มากขึ้น"},
    load: () => import("./lessons/hsk3/lesson-17/content.js").then(m => withCanonicalLessonMedia(m.LESSON_HSK3_L17))
  },
  {
    id: "h3l18-spring-festival-flight",
    slug: "lesson-18",
    level: "hsk3",
    number: 18,
    title: {"zh":"我学会了包饺子","pinyin":"Wǒ xuéhuì le bāo jiǎozi","en":"I learned how to make dumplings","thAid":"ฉันห่อเกี๊ยวเป็นแล้ว"},
    load: () => import("./lessons/hsk3/lesson-18/content.js").then(m => withCanonicalLessonMedia(m.LESSON_HSK3_L18))
  },
];

export const FEATURED_LESSON = LESSON_13;
export const GROUP3_CATALOG_PATH = "/home/hsk1/";

export const FEATURED_SCENES = [
  ...LESSON_13.scenes.map(scene => ({ ...scene, lesson: LESSON_13, sceneIndex: LESSON_13.scenes.indexOf(scene) })),
  ...LESSON_10.scenes.map(scene => ({ ...scene, lesson: LESSON_10, sceneIndex: LESSON_10.scenes.indexOf(scene) })),
];

export function findLesson(level, slug) {
  return GROUP3_LESSONS.find((lesson) => lesson.level === level && lesson.slug === slug) || null;
}
