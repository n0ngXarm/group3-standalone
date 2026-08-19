import { useEffect, useRef, useState } from "react";

import Icon from "../../../../shared/components/ui/Icon.jsx";
import { volumeIcon, xmarkIcon } from "../../../../shared/components/ui/iconPaths.js";
import { playUiCue } from "../../services/audio/index.js";
import { SCENARIOS } from "./ScenarioMangaStage.jsx";

const MARKET = SCENARIOS[0];

const FEATURES = [
  {
    id: "listen",
    glyph: "听",
    title: { th: "ฟังและอ่าน", zh: "边听边读", en: "Listen & Read" },
    desc: {
      th: "เสียง ตัวอักษรจีน พินอิน และคำแปลอยู่ในบริบทเดียวกัน ลดการสลับหน้าจอ",
      zh: "声音、汉字、拼音和翻译都在同一个语境里，不用来回切换页面",
      en: "Audio, hanzi, pinyin and translation live in one context — no screen switching",
    },
    example: { cn: "我要两个苹果。", py: "Wǒ yào liǎng ge píngguǒ." },
  },
  {
    id: "roleplay",
    glyph: "说",
    title: { th: "ลองพูดตอบ", zh: "开口练习", en: "Try Replying" },
    desc: {
      th: "Roleplay ช่วยให้เข้าใจว่าในสถานการณ์จริงควรตอบอะไรและตอบตอนไหน",
      zh: "通过角色扮演，明白真实场景中该怎么答、什么时候答",
      en: "Roleplay shows you what to say and when in real situations",
    },
    example: { cn: "你要什么？", py: "Nǐ yào shénme?" },
  },
  {
    id: "vocab",
    glyph: "词",
    title: { th: "จำคำศัพท์จากเรื่อง", zh: "从故事记生词", en: "Words from the Story" },
    desc: {
      th: "คำศัพท์มาจากบทที่เพิ่งเรียน ทำให้จำได้จากเหตุการณ์ ไม่ใช่รายการคำแยก ๆ",
      zh: "生词都来自刚学的课文，通过情境记住，而不是孤立的词表",
      en: "Vocabulary comes from the lesson you just read, remembered through context",
    },
    example: { cn: "苹果", py: "píngguǒ · แอปเปิล" },
  },
  {
    id: "game",
    glyph: "游",
    title: { th: "ทบทวนด้วยเกม", zh: "游戏复习", en: "Review with a Game" },
    desc: {
      th: "เกมสั้น ๆ ใช้ตรวจความเข้าใจหลังเรียน โดยไม่ต้องออกไปหาแบบฝึกจากเมนูอื่น",
      zh: "学完就能用短游戏自测，不用再到别的菜单找练习",
      en: "A quick game checks your understanding right after the lesson",
    },
    example: { cn: "多少钱", py: "duōshao qián · ราคาเท่าไร" },
  },
];

const WORDS = [
  { cn: "苹果", py: "píngguǒ", th: "แอปเปิล", source: "我要两个苹果。" },
  { cn: "买", py: "mǎi", th: "ซื้อ", source: "你要买什么？" },
  { cn: "多少钱", py: "duōshao qián", th: "ราคาเท่าไร", source: "苹果多少钱？" },
  { cn: "十块钱", py: "shí kuài qián", th: "สิบหยวน", source: "十块钱。" },
];

const ROLEPLAY_QUESTION = { cn: "你要什么？", py: "Nǐ yào shénme?", th: "คุณต้องการอะไร?" };
const ROLEPLAY_ANSWERS = [
  { cn: "我要两个苹果。", py: "Wǒ yào liǎng ge píngguǒ.", th: "ฉันต้องการแอปเปิลสองลูก", correct: true },
  { cn: "十块钱。", py: "Shí kuài qián.", th: "สิบหยวน", correct: false },
  { cn: "你好！", py: "Nǐ hǎo!", th: "สวัสดี!", correct: false },
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

function DemoModal({ open, title, onClose, children, label }) {
  const titleRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    document.body.style.overflow = "hidden";
    titleRef.current?.focus();
    const closeOnEscape = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="g3-feature-modal"
      role="dialog"
      aria-modal="true"
      aria-label={label}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="g3-feature-modal-dialog">
        <div className="g3-feature-modal-head">
          <h3 tabIndex={-1} ref={titleRef}>{title}</h3>
          <button type="button" className="g3-feature-modal-close" onClick={onClose} aria-label="Close">
            <Icon paths={xmarkIcon} />
          </button>
        </div>
        <div className="g3-feature-modal-body">{children}</div>
      </div>
    </div>
  );
}

function ListenDemo({ language }) {
  const [activeLine, setActiveLine] = useState(null);

  const playLine = (index) => {
    playUiCue("tap");
    setActiveLine(index);
    speak(MARKET.dialogues[index].zh);
  };

  const playAll = () => {
    playUiCue("tap");
    MARKET.dialogues.forEach((line, index) => {
      setTimeout(() => {
        setActiveLine(index);
        speak(line.zh);
      }, index * 2400);
    });
  };

  return (
    <div className="g3-demo-listen">
      <button type="button" className="g3-demo-playall" onClick={playAll}>▶ เล่นทั้งหมด</button>
      <div className="g3-demo-list">
        {MARKET.dialogues.map((line, index) => (
          <button
            type="button"
            key={line.zh}
            className={`g3-demo-item${activeLine === index ? " is-active" : ""}`}
            onClick={() => playLine(index)}
          >
            <span className="g3-demo-speaker-btn" aria-hidden="true"><Icon paths={volumeIcon} /></span>
            <span>
              <strong>{line.zh}</strong>
              <small>{line.py}</small>
              <span>{language === "en" ? line.en : line.th}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function RoleplayDemo({ language }) {
  const [picked, setPicked] = useState(null);

  const pick = (index, correct) => {
    playUiCue("tap");
    setPicked(index);
    if (correct) speak(ROLEPLAY_ANSWERS[index].cn);
  };

  return (
    <div className="g3-demo-roleplay">
      <div className="g3-demo-question">
        <strong>{ROLEPLAY_QUESTION.cn}</strong>
        <small>{ROLEPLAY_QUESTION.py}</small>
        <span>{ROLEPLAY_QUESTION.th}</span>
      </div>
      <div className="g3-demo-answers">
        {ROLEPLAY_ANSWERS.map((answer, index) => (
          <button
            type="button"
            key={answer.cn}
            className={`g3-demo-answer${picked === index ? (answer.correct ? " is-correct" : " is-wrong") : ""}`}
            onClick={() => pick(index, answer.correct)}
          >
            <strong>{answer.cn}</strong>
            <small>{answer.py}</small>
            <span>{answer.th}</span>
          </button>
        ))}
      </div>
      <p className={`g3-demo-feedback${picked === null ? "" : picked >= 0 && ROLEPLAY_ANSWERS[picked]?.correct ? " is-good" : " is-bad"}`}>
        {picked === null
          ? "เลือกคำตอบหนึ่งข้อ"
          : ROLEPLAY_ANSWERS[picked].correct
            ? "ถูกต้อง! ตอบได้ตรงสถานการณ์"
            : "ยังไม่ถูก ลองดูประโยคจากบทสนทนาอีกครั้ง"}
      </p>
    </div>
  );
}

function VocabDemo({ language }) {
  const [activeWord, setActiveWord] = useState(0);
  const word = WORDS[activeWord];

  const pick = (index) => {
    playUiCue("tap");
    setActiveWord(index);
  };

  return (
    <div className="g3-demo-vocab">
      <div className="g3-demo-word-list">
        {WORDS.map((item, index) => (
          <button
            type="button"
            key={item.cn}
            className={`g3-demo-word${activeWord === index ? " is-active" : ""}`}
            onClick={() => pick(index)}
          >
            <strong>{item.cn}</strong>
            <small>{item.py}</small>
          </button>
        ))}
      </div>
      <div className="g3-demo-word-stage">
        <button
          type="button"
          className="g3-demo-big-word"
          onClick={() => {
            playUiCue("tap");
            speak(word.cn);
          }}
        >
          <b>{word.cn}</b>
          <small>{word.py}</small>
          <span>{word.th}</span>
        </button>
        <button type="button" className="g3-demo-word-audio" onClick={() => { playUiCue("tap"); speak(word.cn); }} aria-label="ฟังคำนี้"><Icon paths={volumeIcon} />ฟังคำนี้</button>
        <p className="g3-demo-word-source">มาจากประโยค: <b>{word.source}</b></p>
      </div>
    </div>
  );
}

function GameDemo({ language }) {
  const pairs = WORDS.map((word) => ({ left: word.cn, right: word.th }));
  const [matched, setMatched] = useState([]);
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [message, setMessage] = useState("เลือกคำจากฝั่งซ้ายก่อน");
  const [shaking, setShaking] = useState(null);

  const pickLeft = (index) => {
    playUiCue("tap");
    if (matched.includes(index)) return;
    setSelectedLeft(index);
    setMessage("ตอนนี้เลือกคำแปลจากฝั่งขวา");
  };

  const pickRight = (index) => {
    playUiCue("tap");
    if (selectedLeft === null || matched.includes(index)) return;
    if (selectedLeft === index) {
      setMatched((list) => [...list, index]);
      setSelectedLeft(null);
      setMessage(`ถูกต้อง (${matched.length + 1} / 4)`);
      if (matched.length + 1 === pairs.length) setMessage("ครบทั้ง 4 คู่! เก่งมาก");
    } else {
      setShaking(index);
      setSelectedLeft(null);
      setMessage("ยังไม่ตรงกัน ลองใหม่");
      setTimeout(() => setShaking(null), 500);
    }
  };

  const reset = () => {
    playUiCue("tap");
    setMatched([]);
    setSelectedLeft(null);
    setMessage("เลือกคำจากฝั่งซ้ายก่อน");
  };

  return (
    <div className="g3-demo-game">
      <div className="g3-demo-game-top">
        <span className="g3-demo-score">คะแนน <b>{matched.length} / {pairs.length}</b></span>
        <button type="button" className="g3-demo-reset" onClick={reset}>เริ่มใหม่</button>
      </div>
      <div className="g3-demo-match-board">
        <div className="g3-demo-match-stack">
          {pairs.map((pair, index) => (
            <button
              type="button"
              key={pair.left}
              className={`g3-demo-match${matched.includes(index) ? " is-done" : ""}${selectedLeft === index ? " is-selected" : ""}`}
              onClick={() => pickLeft(index)}
            >
              <strong>{pair.left}</strong>
              <small>{WORDS[index].py}</small>
            </button>
          ))}
        </div>
        <div className="g3-demo-match-stack">
          {pairs.map((pair, index) => (
            <button
              type="button"
              key={pair.right}
              className={`g3-demo-match${matched.includes(index) ? " is-done" : ""}${shaking === index ? " is-shake" : ""}`}
              onClick={() => pickRight(index)}
            >
              <strong>{pair.right}</strong>
            </button>
          ))}
        </div>
      </div>
      <p className="g3-demo-game-msg">{message}</p>
    </div>
  );
}

export function HomeFeatureDemos({ language }) {
  const [openDemo, setOpenDemo] = useState(null);

  const open = (id) => {
    playUiCue("tap");
    setOpenDemo(id);
  };
  const close = () => {
    playUiCue("tap");
    setOpenDemo(null);
  };

  return (
    <section className="g3-home-features" aria-labelledby="g3-features-title">
      <div className="g3-features-head">
        <p className="g3-kicker">HOW IT WORKS</p>
        <h2 id="g3-features-title" tabIndex="-1">ผู้ใช้ไม่ต้องจำว่าแต่ละเมนูทำอะไร</h2>
        <p>แค่ลองแตะการ์ดที่สนใจ ระบบจะเปิดตัวอย่างใช้งานขึ้นมาดูในหน้าต่างลอย โดยยังอยู่หน้า Home เหมือนเดิม</p>
      </div>
      <div className="g3-feature-grid">
        {FEATURES.map((feature) => (
          <button type="button" className="g3-feature-card" key={feature.id} onClick={() => open(feature.id)}>
            <span className="g3-feature-icon" aria-hidden="true">{feature.glyph}</span>
            <h3>{feature.title[language] || feature.title.th}</h3>
            <p className="g3-feature-desc">{feature.desc[language] || feature.desc.th}</p>
            <span className="g3-feature-example">
              <strong>{feature.example.cn}</strong>
              <small>{feature.example.py}</small>
            </span>
            <span className="g3-feature-hint">กดเพื่อดูตัวอย่าง</span>
          </button>
        ))}
      </div>

      <DemoModal open={openDemo === "listen"} title="ฟังและอ่าน" onClose={close} label="ฟังและอ่าน ตัวอย่าง">
        <ListenDemo language={language} />
      </DemoModal>
      <DemoModal open={openDemo === "roleplay"} title="ลองพูดตอบ" onClose={close} label="ลองพูดตอบ ตัวอย่าง">
        <RoleplayDemo language={language} />
      </DemoModal>
      <DemoModal open={openDemo === "vocab"} title="คำศัพท์จากเรื่อง" onClose={close} label="คำศัพท์จากเรื่อง ตัวอย่าง">
        <VocabDemo language={language} />
      </DemoModal>
      <DemoModal open={openDemo === "game"} title="เกมทบทวน" onClose={close} label="เกมทบทวน ตัวอย่าง">
        <GameDemo language={language} />
      </DemoModal>
    </section>
  );
}