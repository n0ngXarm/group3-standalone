import { useEffect, useState } from "react";
import Icon from "../../../../shared/components/ui/Icon.jsx";
import { volumeIcon } from "../../../../shared/components/ui/iconPaths.js";
import { surfaceAssetPath } from "../../../../shared/lib/surface-url.js";

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

export const SCENARIOS = [
  {
    id: "market",
    title: { th: "1. ตลาดผลไม้ & ร้านน้ำชา", zh: "1. 水果市场与茶馆", en: "1. Fruit Market & Tea Shop" },
    tag: "HSK 1",
    backdrop: surfaceAssetPath(3, "/assets/group3/shared/characters/visual-novel-backgrounds/scene-01-market-tea.png"),
    leftActor: {
      name: "王老师 (Seller)",
      idle: surfaceAssetPath(3, "/assets/group3/shared/characters/visual-novel-characters-idle/01-wang-laoshi-idle.png"),
      talk: surfaceAssetPath(3, "/assets/group3/shared/characters/visual-novel-character-poses-talk/01-wang-laoshi-talk.png"),
      side: "left",
      scale: 1.3,
      x: "-1%",
      y: "4%",
    },
    rightActor: {
      name: "大卫 (David)",
      idle: surfaceAssetPath(3, "/assets/group3/shared/characters/visual-novel-characters-idle/02-david-idle.png"),
      talk: surfaceAssetPath(3, "/assets/group3/shared/characters/visual-novel-character-poses-talk/02-david-talk.png"),
      side: "right",
      scale: 1.34,
      x: "1%",
      y: "4%",
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
    backdrop: surfaceAssetPath(3, "/assets/group3/shared/characters/visual-novel-backgrounds/scene-02-university-classroom.png"),
    leftActor: {
      name: "李明 (Li Ming)",
      idle: surfaceAssetPath(3, "/assets/group3/shared/characters/visual-novel-characters-idle/03-li-ming-idle.png"),
      talk: surfaceAssetPath(3, "/assets/group3/shared/characters/visual-novel-character-poses-talk/03-li-ming-talk.png"),
      side: "left",
      scale: 1.32,
      x: "-1%",
      y: "4%",
    },
    rightActor: {
      name: "玛丽 (Mary)",
      idle: surfaceAssetPath(3, "/assets/group3/shared/characters/visual-novel-characters-idle/04-mary-idle.png"),
      talk: surfaceAssetPath(3, "/assets/group3/shared/characters/visual-novel-character-poses-talk/04-mary-talk.png"),
      side: "right",
      scale: 1.3,
      x: "1%",
      y: "4%",
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
    backdrop: surfaceAssetPath(3, "/assets/group3/shared/characters/visual-novel-backgrounds/scene-03-chinese-restaurant.png"),
    leftActor: {
      name: "服务员 (Waiter)",
      idle: surfaceAssetPath(3, "/assets/group3/shared/characters/visual-novel-characters-idle/05-waiter-idle.png"),
      talk: surfaceAssetPath(3, "/assets/group3/shared/characters/visual-novel-character-poses-talk/05-waiter-talk.png"),
      side: "left",
      scale: 1.3,
      x: "-1%",
      y: "4%",
    },
    rightActor: {
      name: "刘明 (Liu Ming)",
      idle: surfaceAssetPath(3, "/assets/group3/shared/characters/visual-novel-characters-idle/06-liu-ming-idle.png"),
      talk: surfaceAssetPath(3, "/assets/group3/shared/characters/visual-novel-character-poses-talk/06-liu-ming-talk.png"),
      side: "right",
      scale: 1.32,
      x: "1%",
      y: "4%",
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
    backdrop: surfaceAssetPath(3, "/assets/group3/shared/characters/visual-novel-backgrounds/scene-04-high-speed-rail-station.png"),
    leftActor: {
      name: "工作人员 (Officer)",
      idle: surfaceAssetPath(3, "/assets/group3/shared/characters/visual-novel-characters-idle/07-rail-officer-idle.png"),
      talk: surfaceAssetPath(3, "/assets/group3/shared/characters/visual-novel-character-poses-talk/07-rail-officer-talk.png"),
      side: "left",
      scale: 1.32,
      x: "-1%",
      y: "4%",
    },
    rightActor: {
      name: "王一雪 (Yixue)",
      idle: surfaceAssetPath(3, "/assets/group3/shared/characters/visual-novel-characters-idle/08-wang-yixue-idle.png"),
      talk: surfaceAssetPath(3, "/assets/group3/shared/characters/visual-novel-character-poses-talk/08-wang-yixue-talk.png"),
      side: "right",
      scale: 1.32,
      x: "1%",
      y: "4%",
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
    backdrop: surfaceAssetPath(3, "/assets/group3/shared/characters/visual-novel-backgrounds/scene-05-cny-dumpling-party.png"),
    leftActor: {
      name: "张姐 (Zhang Jie)",
      idle: surfaceAssetPath(3, "/assets/group3/shared/characters/visual-novel-characters-idle/09-zhang-jie-idle.png"),
      talk: surfaceAssetPath(3, "/assets/group3/shared/characters/visual-novel-character-poses-talk/09-zhang-jie-talk.png"),
      side: "left",
      scale: 1.32,
      x: "-1%",
      y: "4%",
    },
    rightActor: {
      name: "大卫 (David)",
      idle: surfaceAssetPath(3, "/assets/group3/shared/characters/visual-novel-characters-idle/02-david-idle.png"),
      talk: surfaceAssetPath(3, "/assets/group3/shared/characters/visual-novel-character-poses-talk/02-david-talk.png"),
      side: "right",
      scale: 1.34,
      x: "1%",
      y: "4%",
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

function ActorNameLabel({ name, active }) {
  return (
    <span
      className={`g3-manga-actor-label${active ? " is-active-speaker" : ""}`}
      aria-current={active ? "true" : undefined}
    >
      {active && (
        <span className="g3-manga-actor-label-indicator" aria-hidden="true">
          <Icon paths={volumeIcon} />
        </span>
      )}
      <span>{name}</span>
    </span>
  );
}

export function ScenarioMangaStage({
  activeScenarioIndex = 0,
  onSelectScenario,
  language = "th",
  lowData = false,
  openVocabulary,
}) {
  const scenario = SCENARIOS[activeScenarioIndex] || SCENARIOS[0];
  const [lineIndex, setLineIndex] = useState(0);
  const [isSpeakingAnim, setIsSpeakingAnim] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [panelKey, setPanelKey] = useState(0);

  const currentDialogue = scenario.dialogues[lineIndex] || scenario.dialogues[0];
  const isLeftSpeaker = currentDialogue.speaker === "left";

  useEffect(() => {
    setLineIndex(0);
    setPanelKey((key) => key + 1);
  }, [activeScenarioIndex]);

  useEffect(() => {
    if (!isPlaying) {
      return;
    }
    const dialogue = scenario.dialogues[lineIndex];
    if (!dialogue) return;

    setIsSpeakingAnim(true);

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
    };
  }, [isPlaying, lineIndex, scenario, activeScenarioIndex, onSelectScenario]);

  const handleSpeakLine = (text) => {
    setIsSpeakingAnim(true);
    speak(text);
    setTimeout(() => setIsSpeakingAnim(false), 2200);
  };

  const handlePrevScenario = () => {
    const total = SCENARIOS.length;
    const prev = (activeScenarioIndex - 1 + total) % total;
    onSelectScenario?.(prev);
  };

  const handleNextScenario = () => {
    const total = SCENARIOS.length;
    const next = (activeScenarioIndex + 1) % total;
    onSelectScenario?.(next);
  };

  return (
    <div className="g3-manga-stage-card" aria-label="2D Visual Novel Stage">
      {/* 2D Stage Frame */}
      <div className="g3-manga-viewport" key={panelKey}>
        
        {/* z0 Scene Background */}
        {!lowData && (
          <div className="g3-manga-backdrop">
            <img
              src={scenario.backdrop}
              alt=""
              decoding="async"
              loading="eager"
              className="g3-manga-bg-img"
            />
          </div>
        )}

        {/* z1 Scene atmospheric treatment (Vignette & Dust) */}
        {!lowData && (
          <div className="g3-manga-atmosphere">
            <div className="g3-manga-bg-vignette"></div>
            <div className="g3-manga-dust" aria-hidden="true">
              <i style={{"--g3-dust-index": 1}}></i>
              <i style={{"--g3-dust-index": 2}}></i>
              <i style={{"--g3-dust-index": 3}}></i>
              <i style={{"--g3-dust-index": 4}}></i>
            </div>
          </div>
        )}

        {/* z2 Left Blend */}
        <div className="g3-manga-left-blend"></div>

        {/* z3 Actors Layer */}
        <div className="g3-manga-actors-layer">
          {/* Left Character */}
          <div
            className={`g3-manga-actor is-left${isLeftSpeaker ? " is-talking" : " is-idle"}`}
            style={{
              "--g3-actor-scale": scenario.leftActor.scale || 1,
              "--g3-actor-x": scenario.leftActor.x || "0px",
              "--g3-actor-y": scenario.leftActor.y || "0px"
            }}
          >
            <ActorNameLabel name={scenario.leftActor.name} active={isLeftSpeaker} />
            <ActorSprite
              actor={scenario.leftActor}
              talking={isLeftSpeaker}
              speaking={isSpeakingAnim}
            />
          </div>

          {/* Right Character */}
          <div
            className={`g3-manga-actor is-right${!isLeftSpeaker ? " is-talking" : " is-idle"}`}
            style={{
              "--g3-actor-scale": scenario.rightActor.scale || 1,
              "--g3-actor-x": scenario.rightActor.x || "0px",
              "--g3-actor-y": scenario.rightActor.y || "0px"
            }}
          >
            <ActorNameLabel name={scenario.rightActor.name} active={!isLeftSpeaker} />
            <ActorSprite
              actor={scenario.rightActor}
              talking={!isLeftSpeaker}
              speaking={isSpeakingAnim}
            />
          </div>
        </div>

        {/* z4 Navigation Layer */}
        <button
          type="button"
          className="g3-manga-arrow is-prev"
          onClick={handlePrevScenario}
          aria-label="Previous Scenario"
        >
          ‹
        </button>
        <button
          type="button"
          className="g3-manga-arrow is-next"
          onClick={handleNextScenario}
          aria-label="Next Scenario"
        >
          ›
        </button>

        {/* z5 Dialogue + Audio Layer */}
        <div className="g3-manga-dialogue-layer">
          <div className="g3-manga-subtitle-box" role="region" aria-label="Dialogue Subtitle">
            <div className="g3-manga-subtitle-content">
              <div className="g3-manga-subtitle-header">
                <span className="g3-manga-speaker-tag">
                  <span className="g3-manga-actor-label-indicator" aria-hidden="true" style={{ color: '#ffda75', marginRight: '0.38rem' }}>
                    <Icon paths={volumeIcon} />
                  </span>
                  <span>{isLeftSpeaker ? scenario.leftActor.name : scenario.rightActor.name}</span>
                </span>
                <div className="g3-manga-subtitle-actions">
                  <button
                    type="button"
                    className="g3-manga-audio-btn"
                    onClick={() => handleSpeakLine(currentDialogue.zh)}
                    aria-label="Play Dialogue Audio"
                  >
                    <Icon paths={volumeIcon} />
                  </button>
                </div>
              </div>
              <p className="g3-manga-hanzi">{currentDialogue.zh}</p>
              <p className="g3-manga-pinyin">{currentDialogue.py}</p>
              <p className="g3-manga-thai">{language === "en" ? currentDialogue.en : currentDialogue.th}</p>
            </div>
          </div>
        </div>

        {/* z6 Pagination Layer */}
        <div className="g3-home-carousel-dots" role="tablist">
          {SCENARIOS.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              role="tab"
              aria-selected={activeScenarioIndex === index}
              aria-label={slide.title[language] || slide.title.th}
              className={`g3-home-carousel-dot ${activeScenarioIndex === index ? "is-active" : ""}`}
              onClick={() => {
                onSelectScenario?.(index);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
