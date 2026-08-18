import { group3AssetPath } from "../../../../config.js";

const SOURCE_FILE = "docs/references/hsk/sources/hsk2.pdf";
export const lessonHsk2L6SourceRef = (printedPages, pdfPages) => `${SOURCE_FILE}#printed-pages=${printedPages}&pdf-pages=${pdfPages}`;
const sourceRef = lessonHsk2L6SourceRef("46-55", "60-69");

const art = (scene) => ({
  image: group3AssetPath(`/assets/group3/lesson-hsk2-l6-${scene}-v1.webp`),
  imageSrcSet: `${group3AssetPath(`/assets/group3/lesson-hsk2-l6-${scene}-720w-v1.webp`)} 720w, ${group3AssetPath(`/assets/group3/lesson-hsk2-l6-${scene}-v1.webp`)} 1400w`,
});

const characters = {
  wang: { hanzi: "王一雪", pinyin: "Wáng Yīxuě", nameTh: "หวังอี้เสวี่ย", nameEn: "Wang Yixue", ...art("gift-plan"), imageFocus: "28% center" },
  liu: { hanzi: "刘明", pinyin: "Liú Míng", nameTh: "หลิวหมิง", nameEn: "Liu Ming", ...art("gift-plan"), imageFocus: "70% center" },
  liuXiaoxue: { hanzi: "刘小雪", pinyin: "Liú Xiǎoxuě", nameTh: "หลิวเสี่ยวเสวี่ย", nameEn: "Liu Xiaoxue", ...art("birthday-gift"), imageFocus: "35% center" },
  liuXiaoming: { hanzi: "刘小明", pinyin: "Liú Xiǎomíng", nameTh: "หลิวเสี่ยวหมิง", nameEn: "Liu Xiaoming", ...art("birthday-gift"), imageFocus: "70% center" },
};

const vocabularyPages = [
  [1, "生日", "shēngrì", "n.", "birthday", "วันเกิด", 47, 61],
  [2, "忘", "wàng", "v.", "forget", "ลืม", 47, 61],
  [3, "画", "huà", "v.", "draw; paint", "วาด", 47, 61],
  [4, "画笔", "huàbǐ", "n.", "drawing brush; paintbrush", "พู่กัน / อุปกรณ์วาดภาพ", 47, 61],
  [5, "蛋糕", "dàngāo", "n.", "cake", "เค้ก", 47, 61],
  [6, "快乐", "kuàilè", "adj.", "happy; joyful", "มีความสุข", 49, 63],
  [7, "打开", "dǎkāi", "v.", "open; turn on", "เปิด", 49, 63],
  [8, "长", "cháng", "adj.", "long", "ยาว", 51, 65],
  [9, "鱼", "yú", "n.", "fish", "ปลา", 51, 65],
  [10, "肉", "ròu", "n.", "meat", "เนื้อสัตว์", 51, 65],
  [11, "过", "guò", "v.", "spend; celebrate", "ฉลอง / ใช้เวลา", 51, 65],
  [12, "地", "de", "part.", "structural particle before a verb", "คำช่วยเชื่อมส่วนขยายกับกริยา", 51, 65],
  [13, "床", "chuáng", "n.", "bed", "เตียง", 52, 66],
  [14, "舒服", "shūfu", "adj.", "comfortable", "สบาย", 52, 66],
  [15, "礼物", "lǐwù", "n.", "gift; present", "ของขวัญ", 47, 61],
  [16, "弟弟", "dìdi", "n.", "younger brother", "น้องชาย", 49, 63],
  [17, "面条儿", "miàntiáor", "n.", "noodles", "บะหมี่ / เส้น", 51, 65],
  [18, "高兴", "gāoxìng", "adj.", "happy; glad", "ดีใจ / มีความสุข", 51, 65],
  [19, "狗", "gǒu", "n.", "dog", "สุนัข", 49, 63],
  [20, "猫", "māo", "n.", "cat", "แมว", 49, 63],
];

const vocabulary = vocabularyPages.map(([index, hanzi, pinyin, type, en, thAid, page, pdfPage]) => ({
  index, hanzi, pinyin, type, en, th: thAid, thAid, page, translationKind: "editorial-aid", sourceRef: lessonHsk2L6SourceRef(String(page), String(pdfPage)),
}));
const line = (source, value) => ({ ...value, sourceRef: source });
const planRef = lessonHsk2L6SourceRef("47", "61");
const giftRef = lessonHsk2L6SourceRef("48-49", "62-63");
const mealRef = lessonHsk2L6SourceRef("50-51", "64-65");

const scenes = [
  {
    id: "h2l6-gift-plan", number: "01", glyph: "礼", title: "准备生日礼物", titleTh: "เตรียมของขวัญวันเกิด", titleEn: "Planning a birthday gift", place: "刘明家", placeTh: "บ้านหลิวหมิง", ...art("gift-plan"),
    imageAlt: { th: "หวังอี้เสวี่ยและหลิวหมิงคุยเรื่องของขวัญวันเกิด", zh: "父母商量生日礼物场景", en: "Parents discussing a birthday gift" }, source: "Text 1 · หน้าเล่ม 47 · PDF หน้า 61", sourcePage: "47", sourceRef: planRef,
    context: "在家里，王一雪和刘明商量给女儿准备什么生日礼物。", contextTh: "ที่บ้าน หวังอี้เสวี่ยกับหลิวหมิงคุยกันว่าจะเตรียมของขวัญอะไรให้ลูกสาว", contextEn: "At home, Wang Yixue and Liu Ming discuss what birthday gift to prepare for their daughter.",
    characters: [
      { role: "A", profile: "wang", noteTh: "คุณแม่ที่เสนอซื้ออุปกรณ์วาดภาพ", noteZh: "提议买画笔的妈妈", noteEn: "The mother suggesting drawing brushes" },
      { role: "B", profile: "liu", noteTh: "คุณพ่อที่เสนอซื้อเค้กก้อนใหญ่", noteZh: "提议买大蛋糕的爸爸", noteEn: "The father suggesting a large cake" },
    ],
    lines: [
      line(planRef, { role: "A", speaker: "王一雪", pinyin: "míngtiān jiù shì nǚ'ér de shēngrì le", hanzi: "明天就是女儿的生日了。", reading: "Míngtiān jiù shì nǚ'ér de shēngrì le.", en: "Tomorrow is our daughter’s birthday.", th: "พรุ่งนี้ก็เป็นวันเกิดของลูกสาวแล้ว", visual: { zh: "女儿的生日", th: "วันเกิดของลูกสาว", focus: "28% center" } }),
      line(planRef, { role: "B", speaker: "刘明", pinyin: "nǐ bù shuō, wǒ hái zhēn wàng le. wǒmen gěi tā zhǔnbèi ge shénme lǐwù ne", hanzi: "你不说，我还真忘了。我们给她准备个什么礼物呢？", reading: "Nǐ bù shuō, wǒ hái zhēn wàng le. Wǒmen gěi tā zhǔnbèi ge shénme lǐwù ne?", en: "If you had not said so, I really would have forgotten. What gift should we prepare for her?", th: "ถ้าคุณไม่พูด ผมคงลืมจริง ๆ เราจะเตรียมของขวัญอะไรให้เธอดี?", visual: { zh: "准备个什么礼物", th: "เตรียมของขวัญอะไร", focus: "70% center" } }),
      line(planRef, { role: "A", speaker: "王一雪", pinyin: "tā xǐhuan huàhuà, nǐ juéde huàbǐ zěnmeyàng", hanzi: "她喜欢画画，你觉得画笔怎么样？", reading: "Tā xǐhuan huàhuà, nǐ juéde huàbǐ zěnmeyàng?", en: "She likes drawing. What do you think of drawing brushes?", th: "เธอชอบวาดรูป คุณคิดว่าอุปกรณ์วาดภาพเป็นอย่างไร?", visual: { zh: "喜欢画画", th: "ชอบวาดรูป", focus: "30% center" } }),
      line(planRef, { role: "B", speaker: "刘明", pinyin: "jiù sòng huàbǐ ba", hanzi: "就送画笔吧！", reading: "Jiù sòng huàbǐ ba!", en: "Let’s give her drawing brushes, then!", th: "งั้นให้อุปกรณ์วาดภาพเถอะ!", visual: { zh: "送画笔", th: "ให้อุปกรณ์วาดภาพ", focus: "68% center" } }),
      line(planRef, { role: "A", speaker: "王一雪", pinyin: "nà wǒ míngtiān shàngwǔ jiù qù mǎi", hanzi: "那我明天上午就去买。", reading: "Nà wǒ míngtiān shàngwǔ jiù qù mǎi.", en: "Then I will go buy them tomorrow morning.", th: "งั้นพรุ่งนี้เช้าฉันจะไปซื้อเลย", visual: { zh: "明天上午就去买", th: "พรุ่งนี้เช้าจะไปซื้อ", focus: "32% center" } }),
      line(planRef, { role: "B", speaker: "刘明", pinyin: "hǎo de! wǒ zài gěi tā mǎi ge dàdà de shēngrì dàngāo", hanzi: "好的！我再给她买个大大的生日蛋糕。", reading: "Hǎo de! Wǒ zài gěi tā mǎi ge dàdà de shēngrì dàngāo.", en: "Okay! I will also buy her a big birthday cake.", th: "ได้! ผมจะซื้อเค้กวันเกิดก้อนใหญ่ให้เธออีกก้อน", visual: { zh: "大大的生日蛋糕", th: "เค้กวันเกิดก้อนใหญ่", focus: "66% center" } }),
    ],
    qte: { after: 4, prompt: { th: "พ่อแม่ตัดสินใจให้ของขวัญอะไรแก่เสี่ยวเสวี่ย?", zh: "爸爸妈妈决定送小雪什么礼物？", en: "What gift do the parents decide to give Xiaoxue?" }, options: [{ value: "画笔", zh: "画笔", pinyin: "huàbǐ", th: "อุปกรณ์วาดภาพ" }, { value: "衣服", zh: "衣服", pinyin: "yīfu", th: "เสื้อผ้า" }, { value: "小猫", zh: "小猫", pinyin: "xiǎomāo", th: "ลูกแมว" }], correct: "画笔", evidence: "刘明：就送画笔吧！", evidenceTh: "หลิวหมิง: งั้นให้อุปกรณ์วาดภาพเถอะ", sourceRef: planRef },
    builder: { prompt: { th: "เรียงประโยคบอกสิ่งที่ลูกสาวชอบ", zh: "重组女儿的爱好", en: "Rebuild the sentence about the daughter’s hobby" }, answer: ["她", "喜欢", "画画"], tiles: ["画画", "她", "喜欢"], gloss: { 她: "เธอ", 喜欢: "ชอบ", 画画: "วาดรูป" }, translationTh: "เธอชอบวาดรูป", translationEn: "She likes drawing.", evidence: "Text 1 · หน้าเล่ม 47", sourceRef: planRef },
  },
  {
    id: "h2l6-birthday-gift", number: "02", glyph: "画", title: "打开生日礼物", titleTh: "เปิดของขวัญวันเกิด", titleEn: "Opening the birthday present", place: "刘明家", placeTh: "บ้านหลิวหมิง", ...art("birthday-gift"),
    imageAlt: { th: "ครอบครัวมอบของขวัญวันเกิดให้หลิวเสี่ยวเสวี่ย", zh: "一家人送生日礼物场景", en: "Family giving Xiaoxue her birthday present" }, source: "Text 2 · หน้าเล่ม 48–49 · PDF หน้า 62–63", sourcePage: "48–49", sourceRef: giftRef,
    context: "在家里，爸爸、妈妈和弟弟祝刘小雪生日快乐。", contextTh: "ที่บ้าน พ่อ แม่ และน้องชายอวยพรวันเกิดให้หลิวเสี่ยวเสวี่ย", contextEn: "At home, Xiaoxue’s parents and younger brother wish her a happy birthday.",
    characters: [
      { role: "A", profile: "liu", noteTh: "คุณพ่อที่อวยพรและชวนเปิดของขวัญ", noteZh: "祝女儿生日快乐并请她打开礼物的爸爸", noteEn: "The father wishing her happy birthday and asking her to open the gift" },
      { role: "B", profile: "liuXiaoming", noteTh: "น้องชายที่ร่วมอวยพรและบอกว่าจะวาดรูป", noteZh: "祝姐姐生日快乐并想画画的弟弟", noteEn: "The younger brother wishing her happy birthday and planning a drawing" },
      { role: "C", profile: "wang", noteTh: "คุณแม่ที่มอบของขวัญและถามว่าจะวาดอะไร", noteZh: "送礼物并问女儿想画什么的妈妈", noteEn: "The mother giving the present and asking what she wants to draw" },
      { role: "D", profile: "liuXiaoxue", noteTh: "เจ้าของวันเกิดที่ชอบของขวัญ", noteZh: "喜欢画笔礼物的寿星", noteEn: "The birthday girl who likes her drawing brushes" },
    ],
    lines: [
      line(giftRef, { role: "A", speaker: "刘明", pinyin: "Xiǎoxuě, shēngrì kuàilè", hanzi: "小雪，生日快乐！", reading: "Xiǎoxuě, shēngrì kuàilè!", en: "Happy birthday, Xiaoxue!", th: "เสี่ยวเสวี่ย สุขสันต์วันเกิด!", visual: { zh: "生日快乐", th: "สุขสันต์วันเกิด", focus: "66% center" } }),
      line(giftRef, { role: "B", speaker: "刘小明", pinyin: "jiějie, shēngrì kuàilè", hanzi: "姐姐，生日快乐！", reading: "Jiějie, shēngrì kuàilè!", en: "Happy birthday, Sis!", th: "พี่สาว สุขสันต์วันเกิด!", visual: { zh: "姐姐，生日快乐", th: "พี่สาว สุขสันต์วันเกิด", focus: "72% center" } }),
      line(giftRef, { role: "C", speaker: "王一雪", pinyin: "Xiǎoxuě, zhè shì bàba, māma sòng nǐ de lǐwù", hanzi: "小雪，这是爸爸、妈妈送你的礼物。", reading: "Xiǎoxuě, zhè shì bàba, māma sòng nǐ de lǐwù.", en: "Xiaoxue, this is the gift Mom and Dad are giving you.", th: "เสี่ยวเสวี่ย นี่คือของขวัญที่พ่อกับแม่มอบให้ลูก", visual: { zh: "送你的礼物", th: "ของขวัญที่มอบให้เธอ", focus: "28% center" } }),
      line(giftRef, { role: "A", speaker: "刘明", pinyin: "nǐ dǎkāi kànkan xǐhuan bu xǐhuan", hanzi: "你打开看看喜欢不喜欢。", reading: "Nǐ dǎkāi kànkan xǐhuan bu xǐhuan.", en: "Open it and see whether you like it.", th: "เปิดดูสิว่าชอบหรือไม่ชอบ", visual: { zh: "打开看看", th: "เปิดดูหน่อย", focus: "64% center" } }),
      line(giftRef, { role: "D", speaker: "刘小雪", pinyin: "huàbǐ! wǒ hěn xǐhuan", hanzi: "画笔！我很喜欢！", reading: "Huàbǐ! Wǒ hěn xǐhuan!", en: "Drawing brushes! I really like them!", th: "อุปกรณ์วาดภาพ! หนูชอบมาก!", visual: { zh: "我很喜欢", th: "หนูชอบมาก", focus: "38% center" } }),
      line(giftRef, { role: "C", speaker: "王一雪", pinyin: "nà nǐ xiǎng huà diǎnr shénme", hanzi: "那你想画点儿什么？", reading: "Nà nǐ xiǎng huà diǎnr shénme?", en: "Then what would you like to draw?", th: "งั้นลูกอยากวาดอะไรบ้าง?", visual: { zh: "想画点儿什么", th: "อยากวาดอะไร", focus: "30% center" } }),
      line(giftRef, { role: "D", speaker: "刘小雪", pinyin: "huà wǒmen de jiā! yǒu bàba, māma, dìdi, hái yǒu hēisè de gǒu, báisè de māo shénme de", hanzi: "画我们的家！有爸爸、妈妈、弟弟，还有黑色的狗、白色的猫什么的。", reading: "Huà wǒmen de jiā! Yǒu bàba, māma, dìdi, hái yǒu hēisè de gǒu, báisè de māo shénme de.", en: "I’ll draw our family—with Dad, Mom, my younger brother, a black dog, a white cat, and so on.", th: "วาดครอบครัวของเรา! มีพ่อ แม่ น้องชาย แล้วยังมีสุนัขสีดำ แมวสีขาว อะไรทำนองนั้น", visual: { zh: "黑色的狗、白色的猫什么的", th: "สุนัขสีดำ แมวสีขาว และอื่น ๆ", focus: "40% center" } }),
      line(giftRef, { role: "B", speaker: "刘小明", pinyin: "nà wǒ yào huà yí ge chuān báisè yīfu de jiějie", hanzi: "那我要画一个穿白色衣服的姐姐。", reading: "Nà wǒ yào huà yí ge chuān báisè yīfu de jiějie.", en: "Then I will draw an older sister wearing white clothes.", th: "งั้นผมจะวาดพี่สาวคนหนึ่งที่ใส่เสื้อผ้าสีขาว", visual: { zh: "穿白色衣服的姐姐", th: "พี่สาวที่ใส่ชุดสีขาว", focus: "70% center" } }),
    ],
    qte: { after: 5, prompt: { th: "เสี่ยวเสวี่ยได้รับของขวัญอะไร?", zh: "小雪收到了什么礼物？", en: "What present did Xiaoxue receive?" }, options: [{ value: "画笔", zh: "画笔", pinyin: "huàbǐ", th: "อุปกรณ์วาดภาพ" }, { value: "蛋糕", zh: "蛋糕", pinyin: "dàngāo", th: "เค้ก" }, { value: "白色衣服", zh: "白色衣服", pinyin: "báisè yīfu", th: "เสื้อผ้าสีขาว" }], correct: "画笔", evidence: "刘小雪：画笔！我很喜欢！", evidenceTh: "หลิวเสี่ยวเสวี่ย: อุปกรณ์วาดภาพ! หนูชอบมาก!", sourceRef: giftRef },
    builder: { prompt: { th: "เรียงประโยคชวนเปิดของขวัญดู", zh: "重组请小雪打开礼物的句子", en: "Rebuild the invitation to open the present" }, answer: ["你", "打开", "看看", "喜欢不喜欢"], tiles: ["喜欢不喜欢", "打开", "你", "看看"], gloss: { 你: "เธอ", 打开: "เปิด", 看看: "ลองดู", 喜欢不喜欢: "ชอบหรือไม่ชอบ" }, translationTh: "เธอเปิดดูสิว่าชอบหรือไม่ชอบ", translationEn: "Open it and see whether you like it.", evidence: "Text 2 · หน้าเล่ม 49", sourceRef: giftRef },
  },
  {
    id: "h2l6-birthday-meal", number: "03", glyph: "面", title: "生日餐", titleTh: "อาหารวันเกิด", titleEn: "The birthday meal", place: "刘明家", placeTh: "บ้านหลิวหมิง", ...art("birthday-meal"),
    imageAlt: { th: "ครอบครัวเตรียมอาหารฉลองวันเกิด", zh: "一家人准备生日餐场景", en: "Family birthday meal scene" }, source: "Text 3 · หน้าเล่ม 50–51 · PDF หน้า 64–65", sourcePage: "50–51", sourceRef: mealRef,
    context: "在家里，一家人准备吃生日餐，吃完饭还要出去玩。", contextTh: "ที่บ้าน ครอบครัวเตรียมกินอาหารวันเกิด และหลังอาหารจะออกไปเที่ยว", contextEn: "At home, the family prepares to eat a birthday meal and go out afterward.",
    characters: [
      { role: "A", profile: "liu", noteTh: "คุณพ่อที่ชวนดูกับข้าววันเกิด", noteZh: "请女儿看看生日餐的爸爸", noteEn: "The father showing his daughter the birthday meal" },
      { role: "B", profile: "liuXiaoxue", noteTh: "เจ้าของวันเกิดที่ดีใจ", noteZh: "为生日餐高兴的寿星", noteEn: "The birthday girl delighted with the meal" },
      { role: "C", profile: "wang", noteTh: "คุณแม่ที่ชวนทุกคนกินข้าวและออกไปเที่ยว", noteZh: "招呼家人吃饭并出去玩的妈妈", noteEn: "The mother inviting everyone to eat and go out" },
    ],
    lines: [
      line(mealRef, { role: "A", speaker: "刘明", pinyin: "Xiǎoxuě, kànkan jīntiān yǒu shénme hǎochī de", hanzi: "小雪，看看今天有什么好吃的。", reading: "Xiǎoxuě, kànkan jīntiān yǒu shénme hǎochī de.", en: "Xiaoxue, see what delicious things we have today.", th: "เสี่ยวเสวี่ย ดูสิว่าวันนี้มีของอร่อยอะไรบ้าง", visual: { zh: "有什么好吃的", th: "มีของอร่อยอะไร", focus: "66% center" } }),
      line(mealRef, { role: "B", speaker: "刘小雪", pinyin: "chángcháng de miàntiáor, dàdà de dàngāo", hanzi: "长长的面条儿，大大的蛋糕。", reading: "Chángcháng de miàntiáor, dàdà de dàngāo.", en: "Long noodles and a big cake.", th: "เส้นบะหมี่ยาว ๆ กับเค้กก้อนใหญ่ ๆ", visual: { zh: "长长的面条儿", th: "เส้นบะหมี่ยาว ๆ", focus: "38% center" } }),
      line(mealRef, { role: "A", speaker: "刘明", pinyin: "nǐ kàn, hái yǒu yú a ròu a shénme de, dōu shì nǐ xǐhuan chī de", hanzi: "你看，还有鱼啊肉啊什么的，都是你喜欢吃的。", reading: "Nǐ kàn, hái yǒu yú a ròu a shénme de, dōu shì nǐ xǐhuan chī de.", en: "Look, there is fish, meat, and so on—all things you like to eat.", th: "ดูสิ ยังมีปลา เนื้อ อะไรต่าง ๆ ล้วนเป็นของที่ลูกชอบกิน", visual: { zh: "鱼啊肉啊什么的", th: "ปลา เนื้อ และอื่น ๆ", focus: "62% center" } }),
      line(mealRef, { role: "B", speaker: "刘小雪", pinyin: "xièxie bàba, māma", hanzi: "谢谢爸爸、妈妈！", reading: "Xièxie bàba, māma!", en: "Thank you, Dad and Mom!", th: "ขอบคุณพ่อกับแม่!", visual: { zh: "谢谢爸爸、妈妈", th: "ขอบคุณพ่อกับแม่", focus: "40% center" } }),
      line(mealRef, { role: "C", speaker: "王一雪", pinyin: "kuài qù jiào dìdi guòlái chīfàn ba, chīwán fàn wǒmen hái yào chūqù wán ne", hanzi: "快去叫弟弟过来吃饭吧，吃完饭我们还要出去玩呢。", reading: "Kuài qù jiào dìdi guòlái chīfàn ba, chīwán fàn wǒmen hái yào chūqù wán ne.", en: "Go call your younger brother over to eat. After dinner, we are going out to have fun.", th: "รีบไปเรียกน้องชายมากินข้าวเถอะ กินเสร็จแล้วเรายังจะออกไปเที่ยวกัน", visual: { zh: "叫弟弟过来吃饭", th: "เรียกน้องชายมากินข้าว", focus: "28% center" } }),
      line(mealRef, { role: "B", speaker: "刘小雪", pinyin: "guò shēngrì zhēn hǎo a", hanzi: "过生日真好啊！", reading: "Guò shēngrì zhēn hǎo a!", en: "Having a birthday is wonderful!", th: "ฉลองวันเกิดดีจริง ๆ!", visual: { zh: "过生日真好", th: "ฉลองวันเกิดดีจริง ๆ", focus: "42% center" } }),
      line(mealRef, { role: "C", speaker: "王一雪", pinyin: "shì de, guò shēngrì jiù yào chī hǎochī de, hái yào gāogāoxìngxìng de wán", hanzi: "是的，过生日就要吃好吃的，还要高高兴兴地玩。", reading: "Shì de, guò shēngrì jiù yào chī hǎochī de, hái yào gāogāoxìngxìng de wán.", en: "Yes. On a birthday, you should eat delicious food and have a wonderful time.", th: "ใช่ วันเกิดก็ต้องกินของอร่อย และเที่ยวเล่นอย่างมีความสุข", visual: { zh: "高高兴兴地玩", th: "เที่ยวเล่นอย่างมีความสุข", focus: "30% center" } }),
    ],
    qte: { after: 4, prompt: { th: "ในอาหารวันเกิดมีอะไรบ้าง?", zh: "生日餐里有什么？", en: "What is included in the birthday meal?" }, options: [{ value: "面条儿、蛋糕、鱼和肉", zh: "面条儿、蛋糕、鱼和肉", pinyin: "miàntiáor, dàngāo, yú hé ròu", th: "บะหมี่ เค้ก ปลา และเนื้อ" }, { value: "饺子和奶茶", zh: "饺子和奶茶", pinyin: "jiǎozi hé nǎichá", th: "เกี๊ยวและชานม" }, { value: "水果和咖啡", zh: "水果和咖啡", pinyin: "shuǐguǒ hé kāfēi", th: "ผลไม้และกาแฟ" }], correct: "面条儿、蛋糕、鱼和肉", evidence: "刘小雪：长长的面条儿，大大的蛋糕。刘明：还有鱼啊肉啊什么的。", evidenceTh: "หลิวเสี่ยวเสวี่ยบอกว่ามีบะหมี่และเค้ก ส่วนหลิวหมิงบอกว่ายังมีปลาและเนื้อ", sourceRef: mealRef },
    builder: { prompt: { th: "เรียงประโยคบอกวิธีเที่ยวเล่นในวันเกิด", zh: "重组带“地”的句子", en: "Rebuild the sentence using 地" }, answer: ["高高兴兴", "地", "玩"], tiles: ["玩", "地", "高高兴兴"], gloss: { 高高兴兴: "อย่างมีความสุข", 地: "คำช่วยเชื่อม", 玩: "เที่ยวเล่น" }, translationTh: "เที่ยวเล่นอย่างมีความสุข", translationEn: "Have fun happily.", evidence: "Text 3 · หน้าเล่ม 51", sourceRef: mealRef },
  },
];

export const LESSON_HSK2_L6 = {
  id: "hsk2-l6", slug: "lesson-6", level: "hsk2", number: 6, featured: false, sourceRef,
  source: { title: "新HSK教程 2 · New HSK Course 2", lesson: "Lesson 6 · 小雪，生日快乐！", printedPages: "46–55", pdfPages: "60–69", file: "hsk2.pdf", sourceRef },
  title: { zh: "小雪，生日快乐！", pinyin: "Xiǎoxuě, shēngrì kuàilè!", en: "Happy birthday, Xiaoxue!", thAid: "เสี่ยวเสวี่ย สุขสันต์วันเกิด!" },
  summary: { zh: "刘小雪过生日，一家人准备礼物和生日餐，练习形容词重叠、“什么的”和“地”。", en: "Xiaoxue celebrates her birthday with presents and a family meal while practising adjective reduplication, 什么的, and 地.", thAid: "หลิวเสี่ยวเสวี่ยฉลองวันเกิดกับครอบครัว ฝึกคำคุณศัพท์ซ้ำ 什么的 และ 地" },
  translationPolicy: { kind: "editorial-aid", labelTh: "คำแปลไทยเพื่อช่วยเรียน เรียบเรียงจากต้นฉบับ" },
  objectives: [
    { zh: "能听懂并使用形容词重叠形式描述性质或状态。", en: "Be able to understand and use reduplicated adjectives to describe qualities or states.", thAid: "เข้าใจและใช้รูปซ้ำของคำคุณศัพท์เพื่อบอกคุณลักษณะหรือสภาพ", sourceRef: lessonHsk2L6SourceRef("46", "60") },
    { zh: "掌握固定短语“什么的”的用法，能表达列举未尽的意思。", en: "Master the fixed phrase 什么的 to express an incomplete list.", thAid: "ใช้วลี 什么的 เพื่อบอกว่ารายการที่ยกมายังมีอย่างอื่นอีก", sourceRef: lessonHsk2L6SourceRef("46", "60") },
    { zh: "掌握结构助词“地”的用法，能描述动作进行的方式或状态。", en: "Master the structural particle 地 to describe the manner or state in which an action is carried out.", thAid: "ใช้คำช่วยโครงสร้าง 地 เพื่อบอกวิธีหรือลักษณะของการกระทำ", sourceRef: lessonHsk2L6SourceRef("46", "60") },
    { zh: "了解中国人庆祝生日的习俗。", en: "Understand how Chinese people celebrate birthdays and the related customs.", thAid: "เรียนรู้ธรรมเนียมการฉลองวันเกิดของชาวจีน", sourceRef: lessonHsk2L6SourceRef("46", "60") },
  ],
  contents: [
    { number: "00", title: "目标与热身", titleTh: "เป้าหมายและการเตรียมบท", detail: "Objectives · Warm-Up", pages: "46", route: "/home/hsk2/lesson-6/preface/", sourceRef: lessonHsk2L6SourceRef("46", "60") },
    { number: "01", title: "准备生日礼物", titleTh: "เตรียมของขวัญวันเกิด", detail: "Text 1 · New Words 1–5", pages: "47–48", scene: 1, sourceRef: lessonHsk2L6SourceRef("47-48", "61-62") },
    { number: "02", title: "打开生日礼物", titleTh: "เปิดของขวัญวันเกิด", detail: "Text 2 · New Words 6–7", pages: "48–50", scene: 2, sourceRef: lessonHsk2L6SourceRef("48-50", "62-64") },
    { number: "03", title: "生日餐", titleTh: "อาหารวันเกิด", detail: "Text 3 · New Words 8–12", pages: "50–51", scene: 3, sourceRef: lessonHsk2L6SourceRef("50-51", "64-65") },
    { number: "04", title: "综合练习与活动", titleTh: "แบบฝึกรวมและกิจกรรม", detail: "Text 4 · Exercises · Activity", pages: "52–55", sourceRef: lessonHsk2L6SourceRef("52-55", "66-69") },
  ],
  vocabulary,
  grammarFocus: [
    { title: "形容词重叠", titleEn: "Reduplication of Adjectives", explanationZh: "单音节形容词一般重叠为AA，双音节形容词常重叠为AABB；重叠后表示程度加深或带有喜爱的感情色彩，后面通常不再加“很”。", explanationEn: "Monosyllabic adjectives commonly reduplicate as AA and disyllabic adjectives as AABB, adding intensity or an affectionate tone; 很 is normally not added afterward.", thAid: "คำคุณศัพท์พยางค์เดียวมักซ้ำแบบ AA และสองพยางค์แบบ AABB เพื่อเน้นระดับหรืออารมณ์ชื่นชอบ", examples: ["我再给她买个大大的生日蛋糕。", "长长的面条儿，大大的蛋糕。", "她有一双大大的眼睛。"], sourceRef: lessonHsk2L6SourceRef("48", "62") },
    { title: "固定短语“什么的”", titleEn: "The Fixed Phrase 什么的", explanationZh: "“什么的”用在列举的最后，表示还有同类的人或事物没有全部说出来。", explanationEn: "什么的 appears after the last item in a list to indicate other similar people or things that are not all named.", thAid: "วาง 什么的 หลังรายการสุดท้ายเพื่อสื่อว่ายังมีสิ่งประเภทเดียวกันอื่น ๆ อีก", examples: ["还有黑色的狗、白色的猫什么的。", "还有鱼啊肉啊什么的。", "我喜欢看电影、听音乐什么的。"], sourceRef: lessonHsk2L6SourceRef("50", "64") },
    { title: "结构助词“地”", titleEn: "Structural Particle 地", explanationZh: "结构助词“地”放在状语和动词之间，结构是“形容词/短语+地+动词”，说明动作进行的状态或方式。", explanationEn: "The structural particle 地 connects an adverbial modifier to a verb in the pattern adjective/phrase + 地 + verb, describing how an action is performed.", thAid: "地 เชื่อมส่วนขยายกับกริยาในรูป คำคุณศัพท์/วลี + 地 + กริยา เพื่อบอกลักษณะการกระทำ", examples: ["还要高高兴兴地玩。", "他认真地学习汉语。", "孩子们安静地坐在教室里。"], sourceRef: lessonHsk2L6SourceRef("51", "65") },
  ],
  characters,
  scenes,
};
