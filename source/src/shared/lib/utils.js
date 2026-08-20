/**
 * Helper utility function to speak Chinese text using Web Speech API
 */
export function speakChinese(text, rate = 0.85) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "zh-CN";
  utterance.rate = rate;
  window.speechSynthesis.speak(utterance);
}

/**
 * Array shuffle helper (Fisher-Yates)
 */
export function shuffleArray(array) {
  const next = [...array];
  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
  }
  return next;
}

/**
 * Class name joining utility
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}
