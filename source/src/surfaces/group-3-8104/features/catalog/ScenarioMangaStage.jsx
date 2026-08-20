import { useEffect, useState } from "react";
import Icon from "../../../../shared/components/ui/Icon.jsx";
import { volumeIcon } from "../../../../shared/components/ui/iconPaths.js";
import { surfaceAssetPath } from "../../../../shared/lib/surface-url.js";
import { playChineseTTS, playUiCue, stopChineseVoice } from "../../services/audio/index.js";

export const SCENARIOS = [
  {
    id: "market",
    title: { th: "1. ตลาดผลไม้ & ร้านน้ำชา", zh: "1. 水果市场与茶馆", en: "1. Fruit Market & Tea Shop" },
    tag: "HSK 1",
    backdrop: surfaceAssetPath(3, "/assets/group3/shared/home/hero-market-stage-sharp.webp"),
    leftActor: {
      name: "王老师 (Seller)",
      idle: surfaceAssetPath(3, "/assets/group3/shared/characters/hero-seller-idle-v1.webp"),
      talk: surfaceAssetPath(3, "/assets/group3/shared/characters/hero-seller-gesture-v2.webp"),
      side: "left",
    },
    rightActor: {
      name: "大卫 (David)",
      idle: surfaceAssetPath(3, "/assets/group3/shared/characters/hero-student-male-idle-v1.webp"),
      talk: surfaceAssetPath(3, "/assets/group3/shared/characters/hero-student-male-talk-v2.webp"),
      side: "right",
    },
    dialogues: [
      {
        speaker: "left",
        zh: "你好！你要买什么？",
        py: "Nǐ hǎo! Nǐ yào mǎi shénme?",
        th: "สวัสดี! คุณต้องการซื้ออะไร?",
        en: "Hello! What would you like to buy?",
      },
      {
        speaker: "right",
        zh: "我要两个苹果，多少钱？",
        py: "Wǒ yào liǎng ge píngguǒ, duōshao qián?",
        th: "ฉันต้องการแอปเปิลสองลูก ราคาเท่าไรครับ?",
        en: "I want two apples. How much are they?",
      },
      {
        speaker: "left",
        zh: "一共十块钱。",
        py: "Yígòng shí kuài qián.",
        th: "ทั้งหมดสิบหยวนค่ะ",
        en: "Ten yuan in total.",
      },
    ],
  },
  {
    id: "campus",
    title: { th: "2. ห้องเรียนมหาวิทยาลัย", zh: "2. 大学课堂与问候", en: "2. Campus & Classroom" },
    tag: "HSK 1",
    backdrop: surfaceAssetPath(3, "/assets/group3/shared/home/hero-campus-stage-sharp.webp"),
    leftActor: {
      name: "李明 (Li Ming)",
      idle: surfaceAssetPath(3, "/assets/group3/shared/characters/hero-liming-idle-v1.webp"),
      talk: surfaceAssetPath(3, "/assets/group3/shared/characters/hero-liming-talk-v1.webp"),
      side: "left",
    },
    rightActor: {
      name: "玛丽 (Mary)",
      idle: surfaceAssetPath(3, "/assets/group3/shared/characters/hero-student-female-idle-v1.webp"),
      talk: surfaceAssetPath(3, "/assets/group3/shared/characters/hero-student-female-talk-v2.webp"),
      side: "right",
    },
    dialogues: [
      {
        speaker: "left",
        zh: "你好！我是李明，你是哪国人？",
        py: "Nǐ hǎo! Wǒ shì Lǐ Míng, nǐ shì nǎ guó rén?",
        th: "สวัสดี! ผมชื่อหลี่หมิง คุณเป็นคนประเทศไหนครับ?",
        en: "Hello! I am Li Ming, which country are you from?",
      },
      {
        speaker: "right",
        zh: "我是泰国人，很高兴认识你！",
        py: "Wǒ shì Tàiguórén, hěn gāoxìng rènshi nǐ!",
        th: "ฉันเป็นคนไทย ยินดีที่ได้รู้จักค่ะ!",
        en: "I am Thai. Nice to meet you!",
      },
      {
        speaker: "left",
        zh: "我也很高兴认识你，欢迎来北京！",
        py: "Wǒ yě hěn gāoxìng rènshi nǐ, huānyíng lái Běijīng!",
        th: "ผมก็ยินดีที่ได้รู้จักเช่นกัน ยินดีต้อนรับสู่ปักกิ่งครับ!",
        en: "Nice to meet you too, welcome to Beijing!",
      },
    ],
  },
  {
    id: "restaurant",
    title: { th: "3. ภัตตาคาร & สั่งอาหาร", zh: "3. 北京餐馆与点餐", en: "3. Beijing Restaurant" },
    tag: "HSK 2",
    backdrop: surfaceAssetPath(3, "/assets/group3/shared/home/hero-restaurant-stage-sharp.webp"),
    leftActor: {
      name: "服务员 (Waiter)",
      idle: surfaceAssetPath(3, "/assets/group3/shared/characters/hero-waiter-idle-v1.webp"),
      talk: surfaceAssetPath(3, "/assets/group3/shared/characters/hero-waiter-talk-v1.webp"),
      side: "left",
    },
    rightActor: {
      name: "刘明 (Liu Ming)",
      idle: surfaceAssetPath(3, "/assets/group3/shared/characters/hero-liuming-idle-v1.webp"),
      talk: surfaceAssetPath(3, "/assets/group3/shared/characters/hero-liuming-talk-v1.webp"),
      side: "right",
    },
    dialogues: [
      {
        speaker: "left",
        zh: "您好，几位？想吃点什么？",
        py: "Nín hǎo, jǐ wèi? Xiǎng chī diǎn shénme?",
        th: "สวัสดีครับ มากี่ท่าน อยากทานอะไรดีครับ?",
        en: "Hello, how many people? What would you like to eat?",
      },
      {
        speaker: "right",
        zh: "我们两个人，要一盘北京烤鸭。",
        py: "Wǒmen liǎng ge rén, yào yì pán Běijīng kǎoyā.",
        th: "เราสองคน ขอเป็ดปักกิ่งหนึ่งจานครับ",
        en: "We are two people, we'd like a plate of Peking duck.",
      },
      {
        speaker: "left",
        zh: "好的，请稍等，马上为您准备！",
        py: "Hǎo de, qǐng shāoděng, mǎshàng wèi nín zhǔnbèi!",
        th: "ได้เลยครับ รอสักครู่ จะรีบเตรียมให้ทันทีครับ!",
        en: "Sure, please wait a moment, will prepare it right away!",
      },
    ],
  },
  {
    id: "train",
    title: { th: "4. รถไฟความเร็วสูง", zh: "4. 高铁车站与出行", en: "4. High-Speed Train" },
    tag: "HSK 3",
    backdrop: surfaceAssetPath(3, "/assets/group3/shared/home/hero-train-stage-sharp.webp"),
    leftActor: {
      name: "工作人员 (Officer)",
      idle: surfaceAssetPath(3, "/assets/group3/shared/characters/hero-officer-idle-v1.webp"),
      talk: surfaceAssetPath(3, "/assets/group3/shared/characters/hero-officer-talk-v1.webp"),
      side: "left",
    },
    rightActor: {
      name: "王一雪 (Yixue)",
      idle: surfaceAssetPath(3, "/assets/group3/shared/characters/hero-yixue-idle-v1.webp"),
      talk: surfaceAssetPath(3, "/assets/group3/shared/characters/hero-yixue-talk-v1.webp"),
      side: "right",
    },
    dialogues: [
      {
        speaker: "right",
        zh: "请问去上海的高铁票在哪里买？",
        py: "Qǐngwèn qù Shànghǎi de gāotiě piào zài nǎlǐ mǎi?",
        th: "ขอถามหน่อยค่ะ ตั๋วรถไฟความเร็วสูงไปเซี่ยงไฮ้ซื้อที่ไหนคะ?",
        en: "Excuse me, where can I buy high-speed train tickets to Shanghai?",
      },
      {
        speaker: "left",
        zh: "在自动售票机或者人工窗口都可以。",
        py: "Zài zìdòng shòupiàojī huòzhě réngōng chuāngkǒu dōu kěyǐ.",
        th: "ที่ตู้จำหน่ายตั๋วอัตโนมัติหรือเคาน์เตอร์เจ้าหน้าที่ก็ได้ครับ",
        en: "Both at the ticket machines or the service counter are fine.",
      },
      {
        speaker: "right",
        zh: "谢谢您！我马上去买。",
        py: "Xièxie nín! Wǒ mǎshàng qù mǎi.",
        th: "ขอบคุณมากค่ะ! ฉันจะรีบไปซื้อเดี๋ยวนี้",
        en: "Thank you! I will go buy it right away.",
      },
    ],
  },
  {
    id: "dumplings",
    title: { th: "5. งานเลี้ยงห่อเกี๊ยวตรุษจีน", zh: "5. 除夕夜包饺子", en: "5. Dumpling New Year" },
    tag: "HSK 3",
    backdrop: surfaceAssetPath(3, "/assets/group3/shared/home/hero-dumplings-stage-sharp.webp"),
    leftActor: {
      name: "张姐 (Zhang Jie)",
      idle: surfaceAssetPath(3, "/assets/group3/shared/characters/hero-zhangjie-idle-v1.webp"),
      talk: surfaceAssetPath(3, "/assets/group3/shared/characters/hero-zhangjie-talk-v1.webp"),
      side: "left",
    },
    rightActor: {
      name: "大卫 (David)",
      idle: surfaceAssetPath(3, "/assets/group3/shared/characters/hero-student-male-idle-v1.webp"),
      talk: surfaceAssetPath(3, "/assets/group3/shared/characters/hero-student-male-talk-v2.webp"),
      side: "right",
    },
    dialogues: [
      {
        speaker: "left",
        zh: "今天过年，我们一起包饺子吧！",
        py: "Jīntiān guònián, wǒmen yìqǐ bāo jiǎozi ba!",
        th: "วันนี้ฉลองตรุษจีน พวกเรามาห่อเกี๊ยวด้วยกันเถอะ!",
        en: "It's New Year today, let's wrap dumplings together!",
      },
      {
        speaker: "right",
        zh: "太好了！我来准备饺子皮和馅儿。",
        py: "Tài hǎo le! Wǒ lái zhǔnbèi jiǎozi pí hé xiànr.",
        th: "เยี่ยมเลย! ผมช่วยเตรียมแผ่นแป้งและไส้เกี๊ยวครับ",
        en: "Great! I'll prepare the dumpling wrappers and filling.",
      },
      {
        speaker: "left",
        zh: "新年快乐！祝大家工作顺利！",
        py: "Xīnnián kuàilè! Zhù dàjiā gōngzuò shùnlì!",
        th: "สุขสันต์วันตรุษจีน! ขอให้ทุกคนการงานราบรื่นนะ!",
        en: "Happy New Year! Wishing everyone smooth work!",
      },
    ],
  },
];

function speak(text) {
  try {
    playChineseTTS(text);
  } catch {
    // fallback
  }
}

const FRAME_MS = 2400;

function ActorSprite({ actor, talking, speaking }) {
  // Optional multi-frame animation: frames = { idle: [url,...], talk: [url,...] }
  // Cycles through the frame list like a manga panel cut-in.
  const hasFrames = Boolean(actor.frames);
  const [frameIndex, setFrameIndex] = useState(0);
  const pose = talking ? "talk" : "idle";
  const frames = hasFrames ? actor.frames[pose] : null;
  const count = frames ? frames.length : 0;

  useEffect(() => {
    setFrameIndex(0);
  }, [pose]);

  useEffect(() => {
    if (count < 2) return undefined;
    const timer = setInterval(() => {
      setFrameIndex((index) => (index + 1) % count);
    }, FRAME_MS);
    return () => clearInterval(timer);
  }, [count, pose]);

  const isActivelyTalking = Boolean(talking && (speaking !== undefined ? speaking : true));
  const src = frames ? frames[frameIndex] : (isActivelyTalking ? actor.talk : actor.idle);

  return (
    <>
      {count > 1 ? (
        <div className="g3-manga-actor-frames" aria-hidden="true">
          {frames.map((frame, index) => (
            <img
              key={frame}
              src={frame}
              alt=""
              width="360"
              height="540"
              className={`g3-manga-actor-frame is-${index === frameIndex ? "active" : "fade"}`}
            />
          ))}
        </div>
      ) : (
        <img
          key={`${actor.name}-${src}`}
          src={src}
          alt={talking ? "" : actor.name}
          width="360"
          height="540"
          className="g3-manga-actor-sprite"
        />
      )}
    </>
  );
}

export function ScenarioMangaStage({
  activeScenarioIndex = 0,
  onSelectScenario,
  language = "th",
  lowData = false,
}) {
  const scenario = SCENARIOS[activeScenarioIndex] || SCENARIOS[0];
  const [lineIndex, setLineIndex] = useState(0);
  const [isSpeakingAnim, setIsSpeakingAnim] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [panelKey, setPanelKey] = useState(0);

  const currentDialogue = scenario.dialogues[lineIndex] || scenario.dialogues[0];
  const isLeftSpeaker = currentDialogue.speaker === "left";

  // Reset lineIndex and stop previous audio when scenario changes
  useEffect(() => {
    stopChineseVoice();
    setLineIndex(0);
    setPanelKey((key) => key + 1);
    return () => stopChineseVoice();
  }, [activeScenarioIndex]);

  // Live Auto-Play Sequence
  useEffect(() => {
    if (!isPlaying) {
      stopChineseVoice();
      return;
    }
    const dialogue = scenario.dialogues[lineIndex];
    if (!dialogue) return;

    setIsSpeakingAnim(true);
    speak(dialogue.zh);

    const animTimer = setTimeout(() => {
      setIsSpeakingAnim(false);
    }, 2200);

    const nextTimer = setTimeout(() => {
      const nextLine = lineIndex + 1;
      if (nextLine >= scenario.dialogues.length) {
        setLineIndex(0);
        setTimeout(() => onSelectScenario?.((activeScenarioIndex + 1) % SCENARIOS.length), 0);
        return;
      }
      setLineIndex(nextLine);
    }, 4200);

    return () => {
      clearTimeout(animTimer);
      clearTimeout(nextTimer);
      stopChineseVoice();
    };
  }, [isPlaying, lineIndex, scenario, activeScenarioIndex, onSelectScenario]);

  const handleSpeakLine = (text) => {
    playUiCue("tap");
    setIsSpeakingAnim(true);
    speak(text);
    setTimeout(() => setIsSpeakingAnim(false), 2200);
  };

  const handlePrevScenario = () => {
    playUiCue("tap");
    const total = SCENARIOS.length;
    const prev = (activeScenarioIndex - 1 + total) % total;
    onSelectScenario?.(prev);
  };

  const handleNextScenario = () => {
    playUiCue("tap");
    const total = SCENARIOS.length;
    const next = (activeScenarioIndex + 1) % total;
    onSelectScenario?.(next);
  };

  return (
    <div className="g3-manga-stage-card" aria-label="2D Visual Novel Stage">
      {/* 2D Stage Frame */}
      <div className="g3-manga-viewport" key={panelKey}>
        {/* Stage Backdrop with slow manga-panel pan */}
        {!lowData && (
          <div className="g3-manga-backdrop">
            <img
              src={scenario.backdrop}
              alt=""
              width="1024"
              height="572"
              decoding="async"
              loading="eager"
              className="g3-manga-bg-img"
            />
            <div className="g3-manga-bg-vignette" />
          </div>
        )}

        {/* Ambient manga motion: drifting dust */}
        {!lowData && (
          <div className="g3-manga-dust" aria-hidden="true">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <i key={i} style={{ "--g3-dust-index": i }} />
            ))}
          </div>
        )}

        {/* Top Scenario Title Tag + Live Preview + Pause Toggle */}
        <div className="g3-manga-top-bar">
          <span className="g3-manga-live-badge">
            <i className="g3-pulse-dot" aria-hidden="true" /> LIVE PREVIEW
          </span>
          <span className="g3-manga-tag">{scenario.tag}</span>
          <strong className="g3-manga-scenario-title">
            {scenario.title[language] || scenario.title.th}
          </strong>
          <button
            type="button"
            className="g3-manga-pause-btn"
            onClick={() => setIsPlaying((p) => !p)}
            aria-label={isPlaying ? "พักการเล่นอัตโนมัติ" : "เล่นอัตโนมัติ"}
            title={isPlaying ? "พักการเล่นอัตโนมัติ" : "เล่นอัตโนมัติ"}
          >
            {isPlaying ? "⏸" : "▶"}
          </button>
        </div>

        {/* 2D Actors with Animated Frame Pose Swapping */}
        <div className="g3-manga-actors-layer">
          {/* Left Character */}
          <div
            className={`g3-manga-actor is-left${isLeftSpeaker ? " is-talking" : " is-idle"}`}
          >
            <ActorSprite
              actor={scenario.leftActor}
              talking={isLeftSpeaker}
              speaking={isSpeakingAnim}
            />
            <span className="g3-manga-actor-name">{scenario.leftActor.name}</span>
          </div>

          {/* Right Character */}
          <div
            className={`g3-manga-actor is-right${!isLeftSpeaker ? " is-talking" : " is-idle"}`}
          >
            <ActorSprite
              actor={scenario.rightActor}
              talking={!isLeftSpeaker}
              speaking={isSpeakingAnim}
            />
            <span className="g3-manga-actor-name">{scenario.rightActor.name}</span>
          </div>
        </div>

        {/* Visual Novel Bottom Subtitle Bar (Hanzi + Pinyin + Thai) */}
        <div className="g3-manga-subtitle-box" role="region" aria-label="Dialogue Subtitle">
          <div className="g3-manga-subtitle-header">
            <span className="g3-manga-speaker-tag">
              {isLeftSpeaker ? scenario.leftActor.name : scenario.rightActor.name}
            </span>
            <div className="g3-manga-subtitle-actions">
              <span className="g3-manga-line-counter">
                {lineIndex + 1}/{scenario.dialogues.length}
              </span>
              <button
                type="button"
                className="g3-manga-audio-btn"
                onClick={() => handleSpeakLine(currentDialogue.zh)}
                aria-label="Play Dialogue Audio"
                title="ฟังเสียงอ่านซ้ำ"
              >
                <Icon paths={volumeIcon} />
              </button>
            </div>
          </div>
          <p className="g3-manga-hanzi">{currentDialogue.zh}</p>
          <p className="g3-manga-pinyin">{currentDialogue.py}</p>
          <p className="g3-manga-thai">{language === "en" ? currentDialogue.en : currentDialogue.th}</p>
        </div>

        {/* Scenario Carousel Navigation Arrows */}
        <button
          type="button"
          className="g3-manga-arrow is-prev"
          onClick={handlePrevScenario}
          aria-label="Previous Scenario"
          title="สถานการณ์ก่อนหน้า"
        >
          ‹
        </button>
        <button
          type="button"
          className="g3-manga-arrow is-next"
          onClick={handleNextScenario}
          aria-label="Next Scenario"
          title="สถานการณ์ถัดไป"
        >
          ›
        </button>
      </div>
    </div>
  );
}


