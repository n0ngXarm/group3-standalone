import React, { useState } from "react";
import { speakChinese } from "../../../services/audio/index.js";

export function PronunciationDetailCard({
  analysis,
  language = "th",
  referenceAudio = "",
  targetHanzi = "",
  targetPinyin = "",
  userAudioUrl = "",
}) {
  const [playingUserAudio, setPlayingUserAudio] = useState(false);
  const [playingNativeAudio, setPlayingNativeAudio] = useState(false);

  if (!analysis || !analysis.characterBreakdown?.length) return null;

  const handlePlayUserAudio = () => {
    if (!userAudioUrl || playingUserAudio) return;
    setPlayingUserAudio(true);
    const audio = new Audio(userAudioUrl);
    audio.onended = () => setPlayingUserAudio(false);
    audio.onerror = () => setPlayingUserAudio(false);
    audio.play().catch(() => setPlayingUserAudio(false));
  };

  const handlePlayNativeAudio = () => {
    if (playingNativeAudio) return;
    setPlayingNativeAudio(true);
    const playback = speakChinese(targetHanzi, { audioSrc: referenceAudio, rate: 0.9 });
    playback.completion.finally(() => setPlayingNativeAudio(false));
  };

  const labels = {
    en: {
      compareTitle: "Pronunciation & Tone Breakdown",
      listenNative: "🔊 Native Model",
      listenUser: "🎧 Your Recording",
      matched: "Correct",
      missing: "Missing",
      mispronounced: "Adjust",
      pace: "Speech Pace",
      tipsTitle: "Tone & Pronunciation Guidance",
    },
    th: {
      compareTitle: "วิเคราะห์การออกเสียงและวรรณยุกต์คำต่อคำ",
      listenNative: "🔊 เสียงเจ้าของภาษา",
      listenUser: "🎧 เสียงที่คุณพูด",
      matched: "ออกเสียงถูก",
      missing: "ตกหล่น",
      mispronounced: "ควรปรับ",
      pace: "จังหวะความเร็ว",
      tipsTitle: "คำแนะนำการปรับวรรณยุกต์เฉพาะจุด",
    },
    zh: {
      compareTitle: "逐字发音与声调分析",
      listenNative: "🔊 标准示范发音",
      listenUser: "🎧 您的录音",
      matched: "发音正确",
      missing: "漏读",
      mispronounced: "需调整",
      pace: "语速分析",
      tipsTitle: "声调与发音指导",
    },
  }[language] || {
    compareTitle: "วิเคราะห์การออกเสียงและวรรณยุกต์คำต่อคำ",
    listenNative: "🔊 เสียงเจ้าของภาษา",
    listenUser: "🎧 เสียงที่คุณพูด",
    matched: "ออกเสียงถูก",
    missing: "ตกหล่น",
    mispronounced: "ควรปรับ",
    pace: "จังหวะความเร็ว",
    tipsTitle: "คำแนะนำการปรับวรรณยุกต์เฉพาะจุด",
  };

  return (
    <section className="g3-pronunciation-detail-card" aria-label={labels.compareTitle}>
      <header className="g3-detail-card-header">
        <h4>{labels.compareTitle}</h4>
        <span className="g3-detail-accuracy-pill">
          ความแม่นยำ {analysis.accuracy}%
        </span>
      </header>

      {/* Character by character breakdown */}
      <div className="g3-character-breakdown-grid">
        {analysis.characterBreakdown.map((item, idx) => (
          <div key={`${item.character}-${idx}`} className={`g3-char-pill is-${item.status}`}>
            <span className="g3-char-pinyin">{item.pinyin || "—"}</span>
            <strong className="g3-char-hanzi" lang="zh-CN">{item.character}</strong>
            <span className="g3-char-status-tag">
              {item.status === "matched" ? "✓" : item.status === "mispronounced" ? `✎ ${item.spokenAs || ""}` : "✕"}
            </span>
          </div>
        ))}
      </div>

      {/* A/B Audio Comparison Controls */}
      <div className="g3-audio-compare-bar">
        {userAudioUrl && (
          <button
            className={`g3-compare-btn is-user ${playingUserAudio ? "is-playing" : ""}`}
            type="button"
            onClick={handlePlayUserAudio}
            disabled={playingUserAudio}
          >
            {labels.listenUser}
          </button>
        )}
        <button
          className={`g3-compare-btn is-native ${playingNativeAudio ? "is-playing" : ""}`}
          type="button"
          onClick={handlePlayNativeAudio}
          disabled={playingNativeAudio}
        >
          {labels.listenNative}
        </button>
      </div>

      {/* Targeted Tone / Pronunciation Tips */}
      {analysis.specificTips?.length > 0 && (
        <div className="g3-targeted-tips-box">
          <strong>💡 {labels.tipsTitle}:</strong>
          <ul>
            {analysis.specificTips.map((tip, idx) => (
              <li key={idx}>
                <span>{tip.text}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Pace / CPM label */}
      <div className="g3-pace-indicator">
        <small>⏱️ {labels.pace}: {analysis.paceLabel} ({analysis.cpm} อักษร/นาที)</small>
      </div>
    </section>
  );
}
