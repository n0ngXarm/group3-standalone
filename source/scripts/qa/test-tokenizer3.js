const pinyinStr = "Tài hǎo le, wǒ zuì xǐhuan chī kǎoyā le!";
const hanziStr = "太好了，我最喜欢吃烤鸭了！";

function alignPinyin(hanzi, pinyin) {
  // Strip punctuation and split into pinyin chunks
  const pWords = pinyin.replace(/[,.!?，。！？]/g, '').trim().split(/\s+/);
  const hChars = hanzi.replace(/[,.!?，。！？]/g, '').split('');
  
  // We want to map each hanzi character to its pinyin.
  // Pinyin words might contain multiple syllables (e.g. xǐhuan = 2 syllables, kǎoyā = 2 syllables).
  // Can we just roughly divide the pinyin word by the number of characters it represents?
  // Wait, if we use Intl.Segmenter on hanzi:
  const segmenter = new Intl.Segmenter("zh-CN", { granularity: "word" });
  const hWords = Array.from(segmenter.segment(hanzi.replace(/[,.!?，。！？]/g, ''))).filter(s => s.isWordLike).map(s => s.segment);
  
  console.log({ hWords, pWords });
}

alignPinyin(hanziStr, pinyinStr);
