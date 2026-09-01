import React, { useEffect, useState } from "react";
import { speakCoachingFeedback } from "../evaluation/speechFeedback.js";

export function SpeechFeedbackAlert({
  advice,
  autoSpeak = true,
  language = "th",
  onDismiss = null,
}) {
  const [speaking, setSpeaking] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!advice || dismissed) return;
    setDismissed(false);
    if (autoSpeak && advice.spokenText) {
      setSpeaking(true);
      const timer = window.setTimeout(() => {
        speakCoachingFeedback(advice.spokenText, language);
        window.setTimeout(() => setSpeaking(false), 2800);
      }, 350);
      return () => window.clearTimeout(timer);
    }
  }, [advice, autoSpeak, language, dismissed]);

  if (!advice || dismissed) return null;

  const handleReplay = (e) => {
    e.stopPropagation();
    setSpeaking(true);
    speakCoachingFeedback(advice.spokenText, language);
    window.setTimeout(() => setSpeaking(false), 2800);
  };

  const handleDismiss = (e) => {
    e.stopPropagation();
    setDismissed(true);
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    if (onDismiss) onDismiss();
  };

  const typeClass = `is-${advice.type || "info"}`;

  return (
    <aside
      className={`g3-speech-feedback-alert ${typeClass}`}
      role="alert"
      aria-live="assertive"
      data-tier={advice.tier}
    >
      <div className="g3-alert-icon" aria-hidden="true">
        {advice.icon}
      </div>
      <div className="g3-alert-body">
        <div className="g3-alert-header">
          <span className="g3-alert-badge">{advice.badge}</span>
          <strong className="g3-alert-title">{advice.title}</strong>
        </div>
        <p className="g3-alert-text">{advice.text}</p>
      </div>
      <div className="g3-alert-actions">
        <button
          className={`g3-alert-replay-btn ${speaking ? "is-speaking" : ""}`}
          type="button"
          onClick={handleReplay}
          title={language === "zh" ? "播放语音指导" : language === "en" ? "Listen to spoken advice" : "ฟังเสียงคำแนะนำจากระบบ"}
          aria-label={language === "zh" ? "播放语音指导" : language === "en" ? "Listen to spoken advice" : "ฟังเสียงคำแนะนำจากระบบ"}
        >
          <span className="g3-alert-speaker-icon" aria-hidden="true">🔊</span>
          <span className="g3-alert-btn-label">
            {language === "zh" ? "朗读" : language === "en" ? "Listen" : "ฟังเสียง"}
          </span>
        </button>
        <button
          className="g3-alert-close-btn"
          type="button"
          onClick={handleDismiss}
          title={language === "zh" ? "关闭提示" : language === "en" ? "Close alert" : "ปิดการแจ้งเตือน"}
          aria-label={language === "zh" ? "关闭提示" : language === "en" ? "Close alert" : "ปิดการแจ้งเตือน"}
        >
          ✕
        </button>
      </div>
    </aside>
  );
}
