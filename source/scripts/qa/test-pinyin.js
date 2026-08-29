const pinyinStr = "Jīntiān wǒ qǐng nǐmen chī Běijīng kǎoyā.";
const hanziStr = "今天我请你们吃北京烤鸭。";

// Regex to match a pinyin syllable (very permissive)
// A syllable has vowels, optional consonants, tones.
// Actually, since we only need to align, maybe we can just use a regex that matches vowels.
function splitPinyin(pinyin) {
  // Strip punctuation from pinyin
  const cleanPinyin = pinyin.replace(/[^a-zA-ZāáǎàōóǒòēéěèīíǐìūúǔùǖǘǚǜüĀÁǍÀŌÓǑÒĒÉĚÈĪÍǏÌŪÚǓÙǕǗǙǛÜ]/g, ' ').trim();
  // Split by spaces? But Jīntiān has no spaces.
  // We can't easily split Jīntiān into Jīn and tiān without a dictionary.
  // Wait! If the token is "今天", we don't NEED to split Jīntiān into syllables! We just need to assign the whole "Jīntiān" to "今天"!
}
