const pinyinStr = "Tài hǎo le, wǒ zuì xǐhuan chī kǎoyā le!";
const hanziStr = "太好了，我最喜欢吃烤鸭了！";

const segmenter = new Intl.Segmenter("zh-CN", { granularity: "word" });
const hanziWords = Array.from(segmenter.segment(hanziStr))
  .filter(s => s.isWordLike)
  .map(s => s.segment);

const pinyinWords = pinyinStr
  .replace(/[,.!?，。！？]/g, '')
  .trim()
  .split(/\s+/);

console.log({ hanziWords, pinyinWords });
