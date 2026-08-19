import { useEffect, useRef, useState } from "react";
import Icon from "../../../../shared/components/ui/Icon.jsx";
import {
  playIcon,
  volumeIcon,
  xmarkIcon,
} from "../../../../shared/components/ui/iconPaths.js";
import { playUiCue } from "../../services/audio/index.js";

const DEMO_DATA = {
  th: {
    cards: [
      { id: "listen", glyph: "听", title: "ฟังและอ่าน", desc: "เสียง ตัวอักษรจีน พินอิน และคำแปลอยู่ในบริบทเดียวกัน ลดการสลับหน้าจอ", exampleZh: "我要两个苹果。", examplePy: "Wǒ yào liǎng ge píngguǒ.", action: "กดเพื่อดูตัวอย่าง" },
      { id: "roleplay", glyph: "说", title: "ลองพูดตอบ", desc: "Roleplay ช่วยให้เข้าใจว่าในสถานการณ์จริงควรตอบอะไรและตอบตอนไหน", exampleZh: "你要什么？", examplePy: "Nǐ yào shénme?", action: "กดเพื่อดูตัวอย่าง" },
      { id: "vocab", glyph: "词", title: "จำคำศัพท์จากเรื่อง", desc: "คำศัพท์มาจากบทที่เพิ่งเรียน ทำให้จำได้จากเหตุการณ์ ไม่ใช่รายการคำแยก ๆ", exampleZh: "苹果", examplePy: "píngguǒ · แอปเปิล", action: "กดเพื่อดูตัวอย่าง" },
      { id: "game", glyph: "游", title: "ทบทวนด้วยเกม", desc: "เกมสั้น ๆ ใช้ตรวจความเข้าใจหลังเรียน โดยไม่ต้องออกไปหาแบบฝึกจากเมนูอื่น", exampleZh: "多少钱", examplePy: "duōshao qián · ราคาเท่าไร", action: "กดเพื่อดูตัวอย่าง" },
    ],
    sectionTitle: "เรียนรู้ครบวงจรในบทเรียนเดียว",
    sectionSubtitle: "ไม่ต้องสลับเมนูไปมา ทดลองแตะฟีเจอร์หลักเพื่อดูตัวอย่างการเรียนจริงได้ทันที",
    playAll: "▶ เล่นเสียงทั้งหมด",
    listenHint: "แตะที่ประโยคเพื่อฟังเสียงสำเนียงมาตรฐาน",
    customerTab: "ฉันเป็นลูกค้า",
    vendorTab: "ฉันเป็นคนขาย",
    selectOneAnswer: "เลือกคำตอบที่ถูกต้อง",
    correctFeedback: "✓ ถูกต้อง! สำเนียงและการเลือกคำตอบตรงตามสถานการณ์",
    wrongFeedback: "✕ ยังไม่ตรงกับสถานการณ์ ลองใหม่อีกครั้ง",
    listenWord: "🔊 ฟังคำนี้",
    useInRoleplay: "ใช้ใน Roleplay →",
    fromSentence: "มาจากประโยค:",
    scoreLabel: "คะแนน",
    resetGame: "เริ่มใหม่",
    gameSelectLeft: "เลือกคำภาษาจีนฝั่งซ้าย แล้วจับคู่กับคำแปลฝั่งขวา",
    gameCompleted: "✓ ยอดเยี่ยม! จับคู่ครบทุกคำแล้ว",
    close: "ปิด",
  },
  zh: {
    cards: [
      { id: "listen", glyph: "听", title: "听说合一", desc: "语音、汉字、拼音与翻译同屏呈现，无需频繁切换画面", exampleZh: "我要两个苹果。", examplePy: "Wǒ yào liǎng ge píngguǒ.", action: "点击查看演示" },
      { id: "roleplay", glyph: "说", title: "角色扮演", desc: "模拟真实情境对话，快速掌握自然得体的应答表达", exampleZh: "你要什么？", examplePy: "Nǐ yào shénme?", action: "点击查看演示" },
      { id: "vocab", glyph: "词", title: "情境词汇", desc: "词汇紧扣故事情节，在具体场景中轻松记忆", exampleZh: "苹果", examplePy: "píngguǒ · 苹果", action: "点击查看演示" },
      { id: "game", glyph: "游", title: "趣味复习", desc: "轻量互动小游戏，课后随堂巩固无负担", exampleZh: "多少钱", examplePy: "duōshao qián · 多少钱", action: "点击查看演示" },
    ],
    sectionTitle: "沉浸式全流程学习体验",
    sectionSubtitle: "无需繁琐切换，点击下方功能卡片即可体验真实教学互动",
    playAll: "▶ 顺序朗读全文",
    listenHint: "点击单句即时聆听标准发音",
    customerTab: "我是顾客",
    vendorTab: "我是店员",
    selectOneAnswer: "请选择合适的回答",
    correctFeedback: "✓ 正确！回答准确符合语境",
    wrongFeedback: "✕ 回答不够准确，请再试一次",
    listenWord: "🔊 朗读此词",
    useInRoleplay: "前往角色扮演 →",
    fromSentence: "出处例句：",
    scoreLabel: "得分",
    resetGame: "重新开始",
    gameSelectLeft: "请先选择左侧汉字，再点击右侧对应含义",
    gameCompleted: "✓ 太棒了！已全部正确匹配",
    close: "关闭",
  },
  en: {
    cards: [
      { id: "listen", glyph: "听", title: "Listen & Read", desc: "Audio, Hanzi, Pinyin, and translation unified in context without switching tabs.", exampleZh: "我要两个苹果。", examplePy: "Wǒ yào liǎng ge píngguǒ.", action: "Try interactive demo" },
      { id: "roleplay", glyph: "说", title: "Interactive Roleplay", desc: "Practice real conversational turns to know what to say and when.", exampleZh: "你要什么？", examplePy: "Nǐ yào shénme?", action: "Try interactive demo" },
      { id: "vocab", glyph: "词", title: "Vocabulary in Context", desc: "Words anchored in real story moments rather than isolated flashcard lists.", exampleZh: "苹果", examplePy: "píngguǒ · Apple", action: "Try interactive demo" },
      { id: "game", glyph: "游", title: "Mini-Game Review", desc: "Quick interactive checkpoints to reinforce retention effortlessly.", exampleZh: "多少钱", examplePy: "duōshao qián · How much", action: "Try interactive demo" },
    ],
    sectionTitle: "All-in-One Learning Experience",
    sectionSubtitle: "No complex menu navigation. Tap any card below to experience live interactive demos.",
    playAll: "▶ Play All Sentences",
    listenHint: "Tap any sentence line to hear natural pronunciation",
    customerTab: "Customer Role",
    vendorTab: "Vendor Role",
    selectOneAnswer: "Select the best matching response",
    correctFeedback: "✓ Correct! Natural answer fitting the scenario",
    wrongFeedback: "✕ Not quite right for this situation. Try again!",
    listenWord: "🔊 Speak Word",
    useInRoleplay: "Use in Roleplay →",
    fromSentence: "Appears in:",
    scoreLabel: "Score",
    resetGame: "Reset",
    gameSelectLeft: "Select a Chinese word on the left, then pick its match on the right",
    gameCompleted: "✓ Excellent! All words matched successfully",
    close: "Close",
  },
};

const DEMO_SCENARIO = {
  dialogue: [
    { id: "d1", zh: "你好！你要买什么？", py: "Nǐ hǎo! Nǐ yào mǎi shénme?", th: "สวัสดี! คุณต้องการซื้ออะไร?", en: "Hello! What would you like to buy?", speaker: "王老师", role: "Seller" },
    { id: "d2", zh: "我要两个苹果。", py: "Wǒ yào liǎng ge píngguǒ.", th: "ฉันต้องการแอปเปิลสองลูก", en: "I want two apples.", speaker: "大卫", role: "Student" },
    { id: "d3", zh: "苹果多少钱？", py: "Píngguǒ duōshao qián?", th: "แอปเปิลราคาเท่าไร?", en: "How much are the apples?", speaker: "大卫", role: "Student" },
    { id: "d4", zh: "十块钱。", py: "Shí kuài qián.", th: "สิบหยวน", en: "Ten yuan.", speaker: "王老师", role: "Seller" },
  ],
  words: [
    { id: "apple", zh: "苹果", py: "píngguǒ", th: "แอปเปิล", en: "Apple", sourceZh: "我要两个苹果。" },
    { id: "buy", zh: "买", py: "mǎi", th: "ซื้อ", en: "To buy", sourceZh: "你要买什么？" },
    { id: "price", zh: "多少钱", py: "duōshao qián", th: "ราคาเท่าไร", en: "How much", sourceZh: "苹果多少钱？" },
    { id: "ten", zh: "十块钱", py: "shí kuài qián", th: "สิบหยวน", en: "Ten yuan", sourceZh: "十块钱。" },
  ],
  roles: {
    customer: {
      questionZh: "你要什么？",
      questionPy: "Nǐ yào shénme?",
      questionTh: "คุณต้องการอะไร?",
      questionEn: "What do you want?",
      options: [
        { zh: "我要两个苹果。", py: "Wǒ yào liǎng ge píngguǒ.", th: "ฉันต้องการแอปเปิลสองลูก", en: "I want two apples.", isCorrect: true },
        { zh: "十块钱。", py: "Shí kuài qián.", th: "สิบหยวน", en: "Ten yuan.", isCorrect: false },
      ],
    },
    vendor: {
      questionZh: "苹果多少钱？",
      questionPy: "Píngguǒ duōshao qián?",
      questionTh: "แอปเปิลราคาเท่าไร?",
      questionEn: "How much are the apples?",
      options: [
        { zh: "十块钱。", py: "Shí kuài qián.", th: "สิบหยวน", en: "Ten yuan.", isCorrect: true },
        { zh: "我要两个苹果。", py: "Wǒ yào liǎng ge píngguǒ.", th: "ฉันต้องการแอปเปิลสองลูก", en: "I want two apples.", isCorrect: false },
      ],
    },
  },
};

function speakChineseText(text, onEnd) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    onEnd?.();
    return;
  }
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "zh-CN";
    utterance.rate = 0.88;
    utterance.onend = () => onEnd?.();
    utterance.onerror = () => onEnd?.();
    window.speechSynthesis.speak(utterance);
  } catch {
    onEnd?.();
  }
}

export function FeatureShowcase({ language = "th", onSelectFeature }) {
  const content = DEMO_DATA[language] || DEMO_DATA.th;
  return (
    <section className="g3-feature-showcase" aria-labelledby="g3-features-heading">
      <header className="g3-features-header">
        <h2 id="g3-features-heading">{content.sectionTitle}</h2>
        <p>{content.sectionSubtitle}</p>
      </header>
      <div className="g3-feature-cards-grid">
        {content.cards.map((card) => (
          <button
            key={card.id}
            type="button"
            className={`g3-feature-card is-${card.id}`}
            onClick={() => {
              playUiCue("tap");
              onSelectFeature(card.id);
            }}
            aria-haspopup="dialog"
          >
            <div className="g3-feature-card-glyph" aria-hidden="true">
              <span>{card.glyph}</span>
            </div>
            <div className="g3-feature-card-content">
              <h3>{card.title}</h3>
              <p className="g3-feature-card-desc">{card.desc}</p>
              <div className="g3-feature-card-sample">
                <strong>{card.exampleZh}</strong>
                <small>{card.examplePy}</small>
              </div>
              <span className="g3-feature-card-cta">
                <span>{card.action}</span>
                <i aria-hidden="true">→</i>
              </span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

export function FeatureDemoModal({ activeFeature, language = "th", onClose, onSwitchFeature }) {
  const content = DEMO_DATA[language] || DEMO_DATA.th;
  const modalRef = useRef(null);

  // Listen Demo State
  const [activeDialogueIndex, setActiveDialogueIndex] = useState(null);
  const [isPlayingAll, setIsPlayingAll] = useState(false);

  // Roleplay Demo State
  const [roleplaySide, setRoleplaySide] = useState("customer");
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null);
  const [roleplayFeedback, setRoleplayFeedback] = useState(null);

  // Vocab Demo State
  const [activeWordIndex, setActiveWordIndex] = useState(0);

  // Game Demo State
  const [selectedWordLeft, setSelectedWordLeft] = useState(null);
  const [matchedIds, setMatchedIds] = useState(new Set());
  const [shuffledRights, setShuffledRights] = useState(() => [...DEMO_SCENARIO.words].sort(() => 0.5 - Math.random()));
  const [gameMessage, setGameMessage] = useState(content.gameSelectLeft);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [onClose]);

  if (!activeFeature) return null;

  const currentRoleplay = DEMO_SCENARIO.roles[roleplaySide];
  const activeWord = DEMO_SCENARIO.words[activeWordIndex] || DEMO_SCENARIO.words[0];

  const handlePlayDialogue = (index) => {
    const item = DEMO_SCENARIO.dialogue[index];
    if (!item) return;
    playUiCue("tap");
    setActiveDialogueIndex(index);
    speakChineseText(item.zh, () => setActiveDialogueIndex(null));
  };

  const handlePlayAllDialogue = () => {
    if (isPlayingAll) return;
    setIsPlayingAll(true);
    let curr = 0;
    const playNext = () => {
      if (curr >= DEMO_SCENARIO.dialogue.length) {
        setActiveDialogueIndex(null);
        setIsPlayingAll(false);
        return;
      }
      setActiveDialogueIndex(curr);
      speakChineseText(DEMO_SCENARIO.dialogue[curr].zh, () => {
        curr += 1;
        window.setTimeout(playNext, 350);
      });
    };
    playNext();
  };

  const handleSelectAnswer = (index, option) => {
    setSelectedAnswerIndex(index);
    if (option.isCorrect) {
      playUiCue("confirm");
      setRoleplayFeedback(content.correctFeedback);
    } else {
      playUiCue("tap");
      setRoleplayFeedback(content.wrongFeedback);
    }
    speakChineseText(option.zh);
  };

  const handleSelectLeftWord = (word) => {
    if (matchedIds.has(word.id)) return;
    playUiCue("tap");
    setSelectedWordLeft(word.id);
    speakChineseText(word.zh);
  };

  const handleSelectRightMatch = (word) => {
    if (matchedIds.has(word.id) || !selectedWordLeft) return;
    if (selectedWordLeft === word.id) {
      playUiCue("confirm");
      const nextMatched = new Set(matchedIds);
      nextMatched.add(word.id);
      setMatchedIds(nextMatched);
      setSelectedWordLeft(null);
      if (nextMatched.size === DEMO_SCENARIO.words.length) {
        setGameMessage(content.gameCompleted);
      } else {
        setGameMessage(content.correctFeedback);
      }
    } else {
      playUiCue("tap");
      setGameMessage(content.wrongFeedback);
    }
  };

  const handleResetGame = () => {
    playUiCue("tap");
    setSelectedWordLeft(null);
    setMatchedIds(new Set());
    setShuffledRights([...DEMO_SCENARIO.words].sort(() => 0.5 - Math.random()));
    setGameMessage(content.gameSelectLeft);
  };

  const featureTitles = {
    listen: content.cards[0].title,
    roleplay: content.cards[1].title,
    vocab: content.cards[2].title,
    game: content.cards[3].title,
  };

  return (
    <div className="g3-demo-modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()} role="presentation">
      <div
        ref={modalRef}
        className="g3-demo-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="g3-modal-title"
      >
        <header className="g3-demo-modal-header">
          <div className="g3-demo-modal-title-group">
            <span className="g3-demo-badge">LIVE DEMO</span>
            <h3 id="g3-modal-title">{featureTitles[activeFeature]}</h3>
          </div>
          <button
            type="button"
            className="g3-demo-modal-close"
            onClick={() => {
              playUiCue("tap");
              onClose();
            }}
            aria-label={content.close}
          >
            <Icon paths={xmarkIcon} />
          </button>
        </header>

        <div className="g3-demo-modal-body">
          {/* 1. LISTEN & READ DEMO */}
          {activeFeature === "listen" && (
            <div className="g3-demo-listen">
              <div className="g3-demo-toolbar">
                <button
                  type="button"
                  className="g3-demo-primary-btn"
                  onClick={handlePlayAllDialogue}
                  disabled={isPlayingAll}
                >
                  <Icon paths={playIcon} />
                  <span>{content.playAll}</span>
                </button>
                <small className="g3-demo-hint">{content.listenHint}</small>
              </div>

              <div className="g3-demo-dialogue-list">
                {DEMO_SCENARIO.dialogue.map((item, index) => {
                  const isActive = activeDialogueIndex === index;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      className={`g3-demo-dialogue-row${isActive ? " is-active" : ""}`}
                      onClick={() => handlePlayDialogue(index)}
                    >
                      <span className="g3-demo-speaker-icon" aria-hidden="true">
                        <Icon paths={volumeIcon} />
                      </span>
                      <div className="g3-demo-dialogue-text">
                        <div className="g3-demo-dialogue-head">
                          <span className="g3-demo-role-tag">{item.role} ({item.speaker})</span>
                        </div>
                        <strong className="g3-demo-hanzi">{item.zh}</strong>
                        <small className="g3-demo-pinyin">{item.py}</small>
                        <span className="g3-demo-thai">{language === "en" ? item.en : language === "zh" ? item.zh : item.th}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 2. ROLEPLAY DEMO */}
          {activeFeature === "roleplay" && (
            <div className="g3-demo-roleplay">
              <div className="g3-demo-role-tabs">
                <button
                  type="button"
                  className={`g3-demo-tab-btn${roleplaySide === "customer" ? " is-active" : ""}`}
                  onClick={() => {
                    playUiCue("tap");
                    setRoleplaySide("customer");
                    setSelectedAnswerIndex(null);
                    setRoleplayFeedback(null);
                  }}
                >
                  {content.customerTab}
                </button>
                <button
                  type="button"
                  className={`g3-demo-tab-btn${roleplaySide === "vendor" ? " is-active" : ""}`}
                  onClick={() => {
                    playUiCue("tap");
                    setRoleplaySide("vendor");
                    setSelectedAnswerIndex(null);
                    setRoleplayFeedback(null);
                  }}
                >
                  {content.vendorTab}
                </button>
              </div>

              <div className="g3-demo-prompt-box">
                <small className="g3-demo-prompt-label">คู่สนทนาถามว่า:</small>
                <strong className="g3-demo-hanzi">{currentRoleplay.questionZh}</strong>
                <small className="g3-demo-pinyin">{currentRoleplay.questionPy}</small>
                <span className="g3-demo-thai">{language === "en" ? currentRoleplay.questionEn : currentRoleplay.questionTh}</span>
              </div>

              <div className="g3-demo-options-list">
                {currentRoleplay.options.map((option, idx) => {
                  const isSelected = selectedAnswerIndex === idx;
                  const statusClass = isSelected ? (option.isCorrect ? " is-correct" : " is-wrong") : "";
                  return (
                    <button
                      key={option.zh}
                      type="button"
                      className={`g3-demo-option-btn${statusClass}`}
                      onClick={() => handleSelectAnswer(idx, option)}
                    >
                      <strong className="g3-demo-hanzi">{option.zh}</strong>
                      <small className="g3-demo-pinyin">{option.py}</small>
                      <span className="g3-demo-thai">{language === "en" ? option.en : option.th}</span>
                    </button>
                  );
                })}
              </div>

              {roleplayFeedback && (
                <div className="g3-demo-feedback-banner" aria-live="polite">
                  {roleplayFeedback}
                </div>
              )}
            </div>
          )}

          {/* 3. VOCABULARY IN CONTEXT DEMO */}
          {activeFeature === "vocab" && (
            <div className="g3-demo-vocab">
              <div className="g3-demo-vocab-layout">
                <nav className="g3-demo-vocab-nav" aria-label="Vocabulary list">
                  {DEMO_SCENARIO.words.map((w, idx) => (
                    <button
                      key={w.id}
                      type="button"
                      className={`g3-demo-vocab-item${activeWordIndex === idx ? " is-active" : ""}`}
                      onClick={() => {
                        playUiCue("tap");
                        setActiveWordIndex(idx);
                        speakChineseText(w.zh);
                      }}
                    >
                      <strong>{w.zh}</strong>
                      <small>{w.py}</small>
                    </button>
                  ))}
                </nav>

                <div className="g3-demo-vocab-stage">
                  <div className="g3-demo-big-hanzi">{activeWord.zh}</div>
                  <div className="g3-demo-big-pinyin">{activeWord.py}</div>
                  <div className="g3-demo-big-meaning">{language === "en" ? activeWord.en : activeWord.th}</div>

                  <div className="g3-demo-vocab-actions">
                    <button
                      type="button"
                      className="g3-demo-primary-btn"
                      onClick={() => speakChineseText(activeWord.zh)}
                    >
                      <Icon paths={volumeIcon} />
                      <span>{content.listenWord}</span>
                    </button>
                    <button
                      type="button"
                      className="g3-demo-secondary-btn"
                      onClick={() => onSwitchFeature?.("roleplay")}
                    >
                      <span>{content.useInRoleplay}</span>
                    </button>
                  </div>

                  <div className="g3-demo-vocab-source">
                    <span>{content.fromSentence}</span>
                    <strong>{activeWord.sourceZh}</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 4. GAME REVIEW DEMO */}
          {activeFeature === "game" && (
            <div className="g3-demo-game">
              <div className="g3-demo-game-hud">
                <div className="g3-demo-score-chip">
                  <span>{content.scoreLabel}:</span>
                  <strong>{matchedIds.size} / {DEMO_SCENARIO.words.length}</strong>
                </div>
                <button
                  type="button"
                  className="g3-demo-reset-btn"
                  onClick={handleResetGame}
                >
                  {content.resetGame}
                </button>
              </div>

              <div className="g3-demo-match-grid">
                <div className="g3-demo-match-column" aria-label="Chinese words">
                  {DEMO_SCENARIO.words.map((w) => {
                    const isMatched = matchedIds.has(w.id);
                    const isSelected = selectedWordLeft === w.id;
                    const stateClass = isMatched ? " is-matched" : isSelected ? " is-selected" : "";
                    return (
                      <button
                        key={w.id}
                        type="button"
                        className={`g3-demo-match-btn${stateClass}`}
                        onClick={() => handleSelectLeftWord(w)}
                        disabled={isMatched}
                      >
                        <strong>{w.zh}</strong>
                        <small>{w.py}</small>
                      </button>
                    );
                  })}
                </div>

                <div className="g3-demo-match-column" aria-label="Meanings">
                  {shuffledRights.map((w) => {
                    const isMatched = matchedIds.has(w.id);
                    return (
                      <button
                        key={`r-${w.id}`}
                        type="button"
                        className={`g3-demo-match-btn${isMatched ? " is-matched" : ""}`}
                        onClick={() => handleSelectRightMatch(w)}
                        disabled={isMatched}
                      >
                        <span>{language === "en" ? w.en : w.th}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="g3-demo-game-status" aria-live="polite">
                {gameMessage}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
