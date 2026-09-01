const words = [ '欢迎', '来', '我家', '做客，', '快', '请进！' ];
function groupWords(words, targetTokens) {
  if (words.length <= targetTokens) return words;
  let grouped = [...words];
  while (grouped.length > targetTokens) {
    let minLen = Infinity;
    let minIdx = 0;
    for (let i = 0; i < grouped.length - 1; i++) {
      let len = grouped[i].length + grouped[i+1].length;
      if (len < minLen) {
        minLen = len;
        minIdx = i;
      }
    }
    grouped[minIdx] += grouped[minIdx + 1];
    grouped.splice(minIdx + 1, 1);
  }
  return grouped;
}
console.log(groupWords(words, 4));
