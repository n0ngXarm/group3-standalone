const answer = ["今天我请你们", "吃北京烤鸭。"];

const segmenter = new Intl.Segmenter("zh-CN", { granularity: "word" });

function resegment(chunks, level) {
  let words = [];
  chunks.forEach(chunk => {
    const segments = Array.from(segmenter.segment(chunk));
    segments.forEach(s => {
      // If it's punctuation, attach it to the previous word if possible
      if (!s.isWordLike && words.length > 0) {
        words[words.length - 1] += s.segment;
      } else {
        words.push(s.segment);
      }
    });
  });
  
  // Then group based on level
  let targetTokens = 0;
  if (level === 'hsk1') targetTokens = Math.max(4, Math.min(8, words.length));
  if (level === 'hsk2') targetTokens = Math.max(5, Math.min(9, Math.ceil(words.length * 0.8)));
  if (level === 'hsk3') targetTokens = Math.max(4, Math.min(8, Math.ceil(words.length * 0.6)));

  console.log({ words, targetTokens });
}

resegment(answer, 'hsk2');
