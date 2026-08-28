/**
 * Evaluates speech score / accuracy and provides structured coaching feedback
 * and voice guidance based on performance tiers.
 */

export function getSpeechCoachingAdvice({
  accuracy = null,
  analysis = null,
  language = "th",
  score = null,
  status = "retry",
  transcript = "",
} = {}) {
  let numericScore = 0;
  if (Number.isFinite(Number(score))) {
    numericScore = Number(score);
  } else if (Number.isFinite(Number(accuracy))) {
    numericScore = Math.round(Number(accuracy) * 100);
  } else if (analysis?.accuracy !== undefined) {
    numericScore = analysis.accuracy;
  }

  const cleanTranscript = String(transcript || "").trim();
  const hasSpoken = cleanTranscript.length > 0;
  const problemTip = analysis?.specificTips?.[0]?.text;

  // Tier 1: 0 - 29% or No Speech / Missing audio
  if (numericScore < 30 || !hasSpoken) {
    if (language === "zh") {
      return {
        analysis,
        badge: "音量或发音偏弱 (<30%)",
        icon: "🔊",
        score: numericScore,
        spokenText: "声音有点小，请提高音量或靠近麦克风再试一次。",
        text: "声音有点小或未清晰识别，请提高音量、靠近麦克风后再试一次。",
        tier: "volume",
        title: "请提高音量",
        type: "warning",
      };
    }
    if (language === "en") {
      return {
        analysis,
        badge: "Volume/Input Low (<30%)",
        icon: "🔊",
        score: numericScore,
        spokenText: "Voice volume is a bit low. Please speak louder or move closer to the mic.",
        text: "Voice volume is low or unclear. Please speak louder or move closer to the microphone and try again.",
        tier: "volume",
        title: "Please Speak Louder",
        type: "warning",
      };
    }
    return {
      analysis,
      badge: "คะแนนต่ำกว่า 30%",
      icon: "🔊",
      score: numericScore,
      spokenText: "ช่วยเพิ่มเสียงอีกนิด หรือขยับใกล้ไมค์แล้วลองพูดใหม่อีกครั้งนะคะ",
      text: "ช่วยเพิ่มเสียงอีกนิด หรือขยับเข้าใกล้ไมโครโฟน แล้วลองฝึกพูดใหม่อีกครั้งนะคะ",
      tier: "volume",
      title: "เสียงเบาไปนิด",
      type: "warning",
    };
  }

  // Tier 2: 30% - 59%
  if (numericScore < 60) {
    if (language === "zh") {
      return {
        analysis,
        badge: "发音与声调需调整 (30–59%)",
        icon: "🎯",
        score: numericScore,
        spokenText: problemTip ? `发音还差一点点。${problemTip}，听示范后再试一次吧。` : "发音和声调还差一点点，建议听示范后再跟读。",
        text: problemTip ? `发音和声调还差一点点：${problemTip}。建议点击示范音频多听一遍。` : "发音和声调还差一点点，建议点击示范音频多听一遍，再注意声调跟读。",
        tier: "accent",
        title: "调整发音与声调",
        type: "info",
      };
    }
    if (language === "en") {
      return {
        analysis,
        badge: "Needs Tone Adjustment (30–59%)",
        icon: "🎯",
        score: numericScore,
        spokenText: problemTip ? `Pronunciation needs adjustment. ${problemTip}. Listen to the example and repeat.` : "Please adjust your accent and tones. Listen to the example and repeat.",
        text: problemTip ? `Pronunciation needs adjustment: ${problemTip}. Listen to the example audio and try again.` : "Pronunciation and tones need a bit of adjustment. Listen to the example audio and try again.",
        tier: "accent",
        title: "Adjust Accent & Tones",
        type: "info",
      };
    }
    return {
      analysis,
      badge: "คะแนน 30–59%",
      icon: "🎯",
      score: numericScore,
      spokenText: problemTip ? `ปรับสำเนียงอีกนิดนะ ${problemTip} ลองฟังตัวอย่างแล้วพูดตามดูนะ` : "ปรับสำเนียงและวรรณยุกต์อีกนิด ลองฟังตัวอย่างแล้วพูดตามดูนะ",
      text: problemTip ? `ปรับสำเนียงและวรรณยุกต์อีกหน่อย: ${problemTip} ลองกดฟังเสียงตัวอย่างแล้วฝึกพูดตามดูนะ` : "ปรับสำเนียงและวรรณยุกต์อีกหน่อย ลองกดฟังเสียงตัวอย่างแล้วฝึกพูดตามดูนะ",
      tier: "accent",
      title: "ปรับสำเนียงอีกนิด",
      type: "info",
    };
  }

  // Tier 3: 60% - 79%
  if (numericScore < 80) {
    if (language === "zh") {
      return {
        analysis,
        badge: "表现良好 (60–79%)",
        icon: "✨",
        score: numericScore,
        spokenText: problemTip ? `很接近了！注意${problemTip}，再试一次就完美了。` : "很接近了，发音很棒，再注意一下个别声调就完美了。",
        text: problemTip ? `非常接近了！发音很不错，注意${problemTip}，再练习一次就完美了。` : "非常接近了！发音很不错，再注意一下个别字词的声调与停顿就完美了。",
        tier: "close",
        title: "接近完美",
        type: "close",
      };
    }
    if (language === "en") {
      return {
        analysis,
        badge: "Very Close (60–79%)",
        icon: "✨",
        score: numericScore,
        spokenText: problemTip ? `Very close! Note that ${problemTip}.` : "Very close! Great pronunciation, refine the tones slightly.",
        text: problemTip ? `Almost perfect! Great pronunciation. Note: ${problemTip}.` : "Almost perfect! Great pronunciation, just refine the tones and rhythm slightly.",
        tier: "close",
        title: "Almost Perfect!",
        type: "close",
      };
    }
    return {
      analysis,
      badge: "คะแนน 60–79%",
      icon: "✨",
      score: numericScore,
      spokenText: problemTip ? `ออกเสียงได้ดีมากแล้ว ปรับอีกนิดนะ ${problemTip}` : "ออกเสียงได้ดีมากแล้ว ปรับวรรณยุกต์อีกนิดเดียวนะ",
      text: problemTip ? `ใกล้เคียงมากแล้ว! ออกเสียงได้ดีมาก ปรับอีกนิดเดียว: ${problemTip}` : "ใกล้เคียงมากแล้ว! ออกเสียงได้ดีมาก ปรับวรรณยุกต์และจังหวะอีกนิดเดียวจะสมบูรณ์แบบ",
      tier: "close",
      title: "ใกล้เคียงมากแล้ว!",
      type: "close",
    };
  }

  // Tier 4: 80% - 100%
  if (language === "zh") {
    return {
      analysis,
      badge: "优秀达标 (80–100%)",
      icon: "🏆",
      score: numericScore,
      spokenText: "太棒了！发音与声调非常标准清晰。",
      text: "太棒了！发音、声调与流畅度都非常标准，继续保持！",
      tier: "excellent",
      title: "发音非常标准",
      type: "success",
    };
  }
  if (language === "en") {
    return {
      analysis,
      badge: "Outstanding (80–100%)",
      icon: "🏆",
      score: numericScore,
      spokenText: "Outstanding! Pronunciation and accent are very accurate.",
      text: "Outstanding! Your pronunciation, tones, and clarity are accurate and clear.",
      tier: "excellent",
      title: "Excellent Pronunciation!",
      type: "success",
    };
  }
  return {
    analysis,
    badge: "คะแนน 80–100%",
    icon: "🏆",
    score: numericScore,
    spokenText: "ยอดเยี่ยมมาก สำเนียงและการออกเสียงถูกต้องชัดเจน",
    text: "ยอดเยี่ยมมาก! สำเนียงและการออกเสียงถูกต้องชัดเจน น่าประทับใจมาก",
    tier: "excellent",
    title: "ยอดเยี่ยมมาก!",
    type: "success",
  };
}

/**
 * Speaks feedback text aloud in the appropriate language using Web Speech API.
 */
export function speakCoachingFeedback(text, language = "th") {
  if (typeof window === "undefined" || !window.speechSynthesis || typeof SpeechSynthesisUtterance === "undefined") {
    return null;
  }
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const langCode = language === "zh" ? "zh-CN" : language === "en" ? "en-US" : "th-TH";
    utterance.lang = langCode;
    utterance.rate = 0.95;
    const voices = window.speechSynthesis.getVoices?.() || [];
    const matchedVoice = voices.find((v) => v.lang === langCode || v.lang.startsWith(langCode.slice(0, 2)));
    if (matchedVoice) utterance.voice = matchedVoice;
    window.speechSynthesis.speak(utterance);
    return utterance;
  } catch {
    return null;
  }
}
