const pinyinStr = "Jīntiān wǒ qǐng nǐmen chī Běijīng kǎoyā.";
const hanziStr = "今天我请你们吃北京烤鸭。";

const segmenter = new Intl.Segmenter("zh-CN", { granularity: "word" });
const hanziWords = Array.from(segmenter.segment(hanziStr))
  .filter(s => s.isWordLike)
  .map(s => s.segment);

const pinyinWords = pinyinStr
  .replace(/[.,!?。，！？]/g, '')
  .trim()
  .split(/\s+/);

console.log({ hanziWords, pinyinWords });
