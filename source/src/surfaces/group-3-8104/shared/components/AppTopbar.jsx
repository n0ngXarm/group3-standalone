import React from 'react';
import { getLearnerSession } from "../../shared/session.js";
import { surfaceAssetPath } from "../../../../shared/lib/surface-url.js";
import { homeLogoMedia, mapHomeMedia } from "../../features/home/homeMedia.js";
import { COPY } from "../../content/copy.js";
import Icon from "../../../../shared/components/ui/Icon.jsx";
import { moonIcon, sunIcon, circleInfoIcon } from "../../../../shared/components/ui/iconPaths.js";
import "./AppTopbar.css";

const CONTEXT_LABELS = {
  th: {
    home: "หน้าหลัก",
    levels: "เลือกระดับ",
    catalog: "เลือกบทเรียน",
    contents: "เนื้อหาบทเรียน",
    vocabulary: "คำศัพท์",
    reader: "ฝึกอ่าน",
    practice: "แบบฝึกฝน",
    "repeat-sentence": "แบบฝึกพูด",
    "image-description": "บรรยายภาพ",
    "question-response": "ตอบคำถาม",
    "practice-summary": "สรุปผล",
  },
  zh: {
    home: "首页",
    levels: "选择等级",
    catalog: "选择课文",
    contents: "课文内容",
    vocabulary: "词汇",
    reader: "阅读练习",
    practice: "练习中心",
    "repeat-sentence": "口语练习",
    "image-description": "看图说话",
    "question-response": "回答问题",
    "practice-summary": "总结",
  },
  en: {
    home: "Home",
    levels: "Select Level",
    catalog: "Select Lesson",
    contents: "Lesson Contents",
    vocabulary: "Vocabulary",
    reader: "Reading Practice",
    practice: "Practice Hub",
    "repeat-sentence": "Speaking Practice",
    "image-description": "Image Description",
    "question-response": "Question Response",
    "practice-summary": "Summary",
  }
};

export function AppTopbar({ route, lesson, theme, language, onTheme, onLanguage, onHome, onAbout }) {
  const text = COPY[language] || COPY.th;
  const brandMedia = mapHomeMedia(homeLogoMedia(), (path) => surfaceAssetPath(3, path));
  
  const getContextLabel = () => {
    if (!route) return null;
    const map = CONTEXT_LABELS[language] || CONTEXT_LABELS.th;
    
    if (route.name === "practice-exercise") {
      return map[route.exerciseType] || map["repeat-sentence"];
    }
    return map[route.name] || null;
  };

  const contextLabel = getContextLabel();
  const learnerName = getLearnerSession();
  
  return (
    <header className="g3-app-topbar">
      <div className="g3-topbar-left">
        <button className="g3-topbar-brand" onClick={onHome} type="button" aria-label={text.routeLabels?.home || "Home"}>
          <img {...brandMedia} className="g3-topbar-logo" alt="" aria-hidden="true" />
          <div className="g3-topbar-brand-text">
            <strong>中文练习</strong>
            <small>Zhōngwén Liànxí</small>
          </div>
        </button>
      </div>

      <div className="g3-topbar-center">
        {contextLabel && (
          <div className="g3-topbar-context-label">
            {contextLabel}
          </div>
        )}
      </div>

      <div className="g3-topbar-right">
        {learnerName && (
          <div className="g3-topbar-learner-info">
            <div className="g3-topbar-learner-avatar">{learnerName.charAt(0).toUpperCase()}</div>
            <div className="g3-topbar-learner-text">
              <span className="g3-topbar-learner-name">{learnerName}</span>
              {route?.level && <span className="g3-topbar-learner-level">{route.level.toUpperCase()}</span>}
            </div>
          </div>
        )}

        <div className="g3-topbar-actions">
          <button type="button" className="g3-topbar-icon-btn" onClick={onTheme} aria-label="Toggle Theme">
            <Icon paths={theme === "dark" ? sunIcon : moonIcon} />
          </button>
          
          <div className="g3-topbar-lang-switcher">
            <button className={language === "th" ? "active" : ""} onClick={() => onLanguage("th")}>TH</button>
            <button className={language === "zh" ? "active" : ""} onClick={() => onLanguage("zh")}>中</button>
            <button className={language === "en" ? "active" : ""} onClick={() => onLanguage("en")}>EN</button>
          </div>

          {onAbout && (
            <button type="button" className="g3-topbar-icon-btn" onClick={onAbout} aria-label="About">
              <Icon paths={circleInfoIcon} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
