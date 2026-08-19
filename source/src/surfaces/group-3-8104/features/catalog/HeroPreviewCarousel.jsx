import { useEffect, useState } from "react";
import Icon from "../../../../shared/components/ui/Icon.jsx";
import {
  volumeIcon,
} from "../../../../shared/components/ui/iconPaths.js";
import { surfaceAssetPath } from "../../../../shared/lib/surface-url.js";
import { playUiCue } from "../../services/audio/index.js";

const SLIDES = [
  {
    id: "vocab",
    label: { th: "คำศัพท์", zh: "情境词汇", en: "Vocabulary" },
    badge: { th: "VOCABULARY PREVIEW", zh: "词汇预览", en: "VOCABULARY PREVIEW" },
    image: surfaceAssetPath(3, "/assets/group3/shared/home/hero-vocab-stage-sharp.webp"),
    chips: [
      { zh: "苹果", py: "píngguǒ", th: "แอปเปิล", en: "Apple", pos: "a" },
      { zh: "多少钱", py: "duōshao qián", th: "ราคาเท่าไร", en: "How much", pos: "b" },
      { zh: "买", py: "mǎi", th: "ซื้อ", en: "To buy", pos: "c" },
    ],
  },
  {
    id: "dialogue",
    label: { th: "บทสนทนา", zh: "情境对话", en: "Dialogue" },
    badge: { th: "MANGA SCENE", zh: "对话场景", en: "MANGA SCENE" },
    image: surfaceAssetPath(3, "/assets/group3/shared/home/hero-market-stage-sharp.webp"),
    bubbles: [
      {
        side: "left",
        speaker: "王老师",
        role: "Seller",
        zh: "你好！你要买什么？",
        py: "Nǐ hǎo! Nǐ yào mǎi shénme?",
        th: "สวัสดี! คุณต้องการซื้ออะไร?",
        en: "Hello! What would you like to buy?",
      },
      {
        side: "right",
        speaker: "大卫",
        role: "Student",
        zh: "我要两个苹果。",
        py: "Wǒ yào liǎng ge píngguǒ.",
        th: "ฉันต้องการแอปเปิลสองลูก",
        en: "I want two apples.",
      },
    ],
  },
  {
    id: "roleplay",
    label: { th: "Roleplay", zh: "角色扮演", en: "Roleplay" },
    badge: { th: "ROLEPLAY INTERACTION", zh: "角色互动", en: "ROLEPLAY INTERACTION" },
    image: surfaceAssetPath(3, "/assets/group3/shared/home/hero-roleplay-stage-sharp.webp"),
    question: {
      zh: "你要什么？",
      py: "Nǐ yào shénme?",
      th: "คุณต้องการอะไร?",
      en: "What do you want?",
    },
    answers: [
      { zh: "我要两个苹果。", py: "Wǒ yào liǎng ge píngguǒ.", isCorrect: true },
      { zh: "十块钱。", py: "Shí kuài qián.", isCorrect: false },
    ],
  },
  {
    id: "game",
    label: { th: "เกมทบทวน", zh: "趣味复习", en: "Mini-Game" },
    badge: { th: "MATCHING CHALLENGE", zh: "匹配挑战", en: "MATCHING CHALLENGE" },
    image: surfaceAssetPath(3, "/assets/group3/shared/home/hero-game-stage-sharp.webp"),
    score: "2 / 4",
    pairs: [
      { left: "苹果", leftPy: "píngguǒ", right: "แอปเปิล", done: false },
      { left: "多少钱", leftPy: "duōshao qián", right: "ราคาเท่าไร", done: true },
    ],
  },
];

function speak(text) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "zh-CN";
    u.rate = 0.88;
    window.speechSynthesis.speak(u);
  } catch {
    // ignore
  }
}

export function HeroPreviewCarousel({ language = "th", lowData = false, onOpenFeatureDemo }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedRoleplayAns, setSelectedRoleplayAns] = useState(null);

  const slideCount = SLIDES.length;
  const slide = SLIDES[currentSlide];

  const handlePrev = () => {
    playUiCue("tap");
    setCurrentSlide((prev) => (prev - 1 + slideCount) % slideCount);
  };

  const handleNext = () => {
    playUiCue("tap");
    setCurrentSlide((prev) => (prev + 1) % slideCount);
  };

  const handleDotClick = (index) => {
    playUiCue("tap");
    setCurrentSlide(index);
  };

  return (
    <div className="g3-preview-wrap" aria-label="Interactive Story Preview">
      <div className="g3-preview-frame">
        <span className="g3-preview-badge">
          {slide.badge[language] || slide.badge.th}
        </span>

        {/* Background Image Layer (Sharp Linework Asset) */}
        {!lowData && (
          <div className="g3-preview-image-backdrop">
            <img
              src={slide.image}
              alt=""
              width="1024"
              height="572"
              decoding="async"
              loading="eager"
              className="g3-preview-backdrop-img"
            />
            <div className="g3-preview-backdrop-shade" />
          </div>
        )}

        {/* Interactive Overlays by Slide Type */}
        <div className="g3-preview-content-stage">
          {/* SLIDE 1: VOCABULARY */}
          {slide.id === "vocab" && (
            <div className="g3-preview-vocab-overlay">
              <div className="g3-preview-mini-note">
                {language === "th" ? "แตะเพื่อฟังเสียงคำศัพท์" : language === "zh" ? "点击朗读生词" : "Tap to hear pronunciation"}
              </div>
              <div className="g3-preview-chips-container">
                {slide.chips.map((chip) => (
                  <button
                    key={chip.zh}
                    type="button"
                    className={`g3-preview-word-chip is-${chip.pos}`}
                    onClick={() => {
                      playUiCue("tap");
                      speak(chip.zh);
                    }}
                  >
                    <strong>{chip.zh}</strong>
                    <small>{chip.py}</small>
                    <span>{language === "en" ? chip.en : chip.th}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* SLIDE 2: 2D MANGA DIALOGUE */}
          {slide.id === "dialogue" && (
            <div className="g3-preview-dialogue-overlay">
              {slide.bubbles.map((b) => (
                <div key={b.zh} className={`g3-preview-speech-bubble is-${b.side}`}>
                  <div className="g3-preview-bubble-head">
                    <span className="g3-preview-bubble-role">{b.role} ({b.speaker})</span>
                    <button
                      type="button"
                      className="g3-preview-bubble-audio-btn"
                      onClick={() => {
                        playUiCue("tap");
                        speak(b.zh);
                      }}
                      aria-label="Play audio"
                    >
                      <Icon paths={volumeIcon} />
                    </button>
                  </div>
                  <strong className="g3-preview-bubble-hanzi">{b.zh}</strong>
                  <small className="g3-preview-bubble-pinyin">{b.py}</small>
                  <span className="g3-preview-bubble-thai">{language === "en" ? b.en : b.th}</span>
                </div>
              ))}
            </div>
          )}

          {/* SLIDE 3: ROLEPLAY */}
          {slide.id === "roleplay" && (
            <div className="g3-preview-roleplay-overlay">
              <div className="g3-preview-roleplay-card">
                <div className="g3-preview-question-box">
                  <small className="g3-preview-q-label">{language === "th" ? "คู่สนทนาถามว่า:" : language === "zh" ? "对方提问：" : "Partner asks:"}</small>
                  <strong>{slide.question.zh}</strong>
                  <small className="g3-preview-q-py">{slide.question.py}</small>
                  <span>{language === "en" ? slide.question.en : slide.question.th}</span>
                </div>
                <div className="g3-preview-answers-list">
                  {slide.answers.map((ans, idx) => {
                    const isSelected = selectedRoleplayAns === idx;
                    const statusClass = isSelected ? (ans.isCorrect ? " is-ok" : " is-wrong") : "";
                    return (
                      <button
                        key={ans.zh}
                        type="button"
                        className={`g3-preview-answer-btn${statusClass}`}
                        onClick={() => {
                          setSelectedRoleplayAns(idx);
                          playUiCue(ans.isCorrect ? "confirm" : "tap");
                          speak(ans.zh);
                        }}
                      >
                        <strong>{ans.zh}</strong>
                        <small>{ans.py}</small>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 4: REVIEW GAME */}
          {slide.id === "game" && (
            <div className="g3-preview-game-overlay">
              <div className="g3-preview-score-badge">
                <span>{language === "th" ? "คะแนน" : language === "zh" ? "得分" : "Score"}</span>
                <strong>{slide.score}</strong>
              </div>
              <div className="g3-preview-match-board">
                <div className="g3-preview-match-col">
                  {slide.pairs.map((p) => (
                    <div key={p.left} className={`g3-preview-match-cell${p.done ? " is-done" : ""}`}>
                      <strong>{p.left}</strong>
                      <small>{p.leftPy}</small>
                    </div>
                  ))}
                </div>
                <div className="g3-preview-match-col">
                  {slide.pairs.map((p) => (
                    <div key={p.right} className={`g3-preview-match-cell${p.done ? " is-done" : ""}`}>
                      <span>{p.right}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Label Bar */}
        <div
          className="g3-preview-label-bar"
          onClick={() => onOpenFeatureDemo?.(slide.id)}
          role="button"
          tabIndex={0}
        >
          <span>{slide.label[language] || slide.label.th}</span>
          <i aria-hidden="true">↗</i>
        </div>

        {/* Navigation Arrows */}
        <button
          type="button"
          className="g3-preview-arrow is-prev"
          onClick={handlePrev}
          aria-label="Previous Slide"
        >
          ‹
        </button>
        <button
          type="button"
          className="g3-preview-arrow is-next"
          onClick={handleNext}
          aria-label="Next Slide"
        >
          ›
        </button>
      </div>

      {/* Pagination Dots */}
      <div className="g3-preview-dots" role="tablist" aria-label="Preview slides">
        {SLIDES.map((s, index) => (
          <button
            key={s.id}
            type="button"
            role="tab"
            aria-selected={currentSlide === index}
            aria-label={`${s.label[language] || s.label.th}`}
            className={`g3-preview-dot${currentSlide === index ? " is-active" : ""}`}
            onClick={() => handleDotClick(index)}
          />
        ))}
      </div>
    </div>
  );
}
