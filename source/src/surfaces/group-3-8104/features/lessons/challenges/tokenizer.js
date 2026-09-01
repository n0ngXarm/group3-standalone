const pinyinRegex = /([bcdfghjklmnpqrstwxyzBCDFGHJKLMNPQRSTWXYZ]*(?:[aāáǎàeēéěèiīíǐìoōóǒòuūúǔùvǖǘǚǜüAĀÁǍÀEĒÉĚÈIĪÍǏÌOŌÓǑÒUŪÚǓÙVǕǗǙǛÜ]+)(?:ng|n|r|NG|N|R)?)/g;

/**
 * Align Hanzi with canonical Pinyin and split into sensible QTE chunks based on HSK level.
 */
export function buildQteTokens({ hanzi, pinyin, level }) {
  if (!hanzi) return [];
  
  // 1. Get all pinyin syllables
  const syllables = (pinyin || "").match(pinyinRegex) || [];
  
  // 2. Map hanzi characters to pinyin syllables
  const charData = [];
  let pIdx = 0;
  for (let i = 0; i < hanzi.length; i++) {
    const char = hanzi[i];
    if (/[\u4e00-\u9fa5a-zA-Z0-9]/.test(char)) {
      charData.push({
        char,
        pinyin: syllables[pIdx] || '',
        isWord: true
      });
      pIdx++;
    } else {
      charData.push({
        char,
        pinyin: '',
        isWord: false
      });
    }
  }

  // 3. Segment into lexical words
  const segmenter = new Intl.Segmenter("zh-CN", { granularity: "word" });
  const segments = Array.from(segmenter.segment(hanzi));
  
  let words = [];
  segments.forEach(s => {
    if (!s.isWordLike && words.length > 0) {
      words[words.length - 1].text += s.segment;
    } else {
      words.push({ text: s.segment });
    }
  });

  // Group words slightly if there are too many, based on HSK level
  let targetTokens = words.length;
  if (level === 'hsk1') targetTokens = Math.max(4, Math.min(8, words.length));
  if (level === 'hsk2') targetTokens = Math.max(5, Math.min(9, Math.ceil(words.length * 0.8)));
  if (level === 'hsk3') targetTokens = Math.max(4, Math.min(8, Math.ceil(words.length * 0.6)));

  while (words.length > targetTokens) {
    let minLen = Infinity;
    let minIdx = 0;
    for (let i = 0; i < words.length - 1; i++) {
      // Penalty for grouping across punctuation
      let penalty = /[,.!?，。！？]/.test(words[i].text) ? 100 : 0;
      let len = words[i].text.length + words[i+1].text.length + penalty;
      if (len < minLen) {
        minLen = len;
        minIdx = i;
      }
    }
    if (minLen >= 100) break; // Don't merge across punctuation if forced
    words[minIdx].text += words[minIdx + 1].text;
    words.splice(minIdx + 1, 1);
  }

  // 4. Attach Pinyin to the final chunks
  let charOffset = 0;
  const tokens = words.map(w => {
    let chunkPinyin = [];
    for (let i = 0; i < w.text.length; i++) {
      const charInfo = charData[charOffset + i];
      if (charInfo && charInfo.pinyin) {
        chunkPinyin.push(charInfo.pinyin);
      }
    }
    charOffset += w.text.length;
    return {
      text: w.text,
      pinyin: chunkPinyin.join(" "),
      id: Math.random().toString(36).substring(2)
    };
  });

  return {
    tokens,
    isAligned: pIdx === syllables.length
  };
}

export function buildSentenceChallengeModel(challenge, shuffle = (tokens) => [...tokens].sort(() => Math.random() - 0.5)) {
  const answerParts = challenge?.answer || [];
  const pinyinParts = challenge?.pinyin || [];
  const tileParts = challenge?.tiles || [];
  if (!answerParts.length || answerParts.length !== pinyinParts.length || answerParts.length !== tileParts.length) {
    throw new TypeError("Sentence Builder requires parallel answer, pinyin, and tile arrays");
  }

  const idsByText = new Map();
  const answer = answerParts.map((text, index) => {
    const token = { id: `builder-part-${index + 1}`, pinyin: pinyinParts[index], text };
    const ids = idsByText.get(text) || [];
    ids.push(token);
    idsByText.set(text, ids);
    return token;
  });
  const tiles = tileParts.map((text) => {
    const matches = idsByText.get(text);
    if (!matches?.length) throw new TypeError(`Sentence Builder tile does not match target: ${text}`);
    return matches.shift();
  });
  if ([...idsByText.values()].some((matches) => matches.length)) {
    throw new TypeError("Sentence Builder target has no matching tile");
  }
  return { answer, tiles: shuffle(tiles) };
}
