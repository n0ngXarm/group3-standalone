export function savePracticeResult(level, exerciseType, result) {
  try {
    const key = `huayun_practice_${level}`;
    const raw = window.sessionStorage.getItem(key);
    const data = raw ? JSON.parse(raw) : {};
    
    // For free-speaking, append to array if they do multiple attempts?
    // The requirement says "Summary must know: learnerName, HSK level, Repeat result, Image result, Question result"
    // Since we just need the latest session, we can overwrite per exerciseType.
    data[exerciseType] = result;
    
    window.sessionStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error("Failed to save practice result", e);
  }
}

export function getPracticeResults(level) {
  try {
    const key = `huayun_practice_${level}`;
    const raw = window.sessionStorage.getItem(key);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

export function clearPracticeResults(level) {
  try {
    window.sessionStorage.removeItem(`huayun_practice_${level}`);
  } catch (e) {}
}
