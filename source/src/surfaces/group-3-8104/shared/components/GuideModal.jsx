import React, { useEffect, useRef, useState } from "react";
import Icon from "../../../../shared/components/ui/Icon.jsx";
import {
  circleInfoIcon,
  languageIcon,
  volumeHighIcon,
  xmarkIcon,
} from "../../../../shared/components/ui/iconPaths.js";
import { playUiCue } from "../../services/audio/index.js";

export const GUIDE_CONTENT = {
  home: {
    th: {
      badge: "🚀 ยินดีต้อนรับสู่ HuaYun",
      title: "วิธีเริ่มต้นเรียนภาษาจีนใน 3 ขั้นตอน",
      desc: "ระบบเรียนภาษาจีน New HSK 1–3 ผ่านสถานการณ์จริง ไม่ต้องท่องจำ ฟังเสียงเจ้าของภาษาและฝึกสนทนาได้ทันที",
      steps: [
        {
          num: "1",
          title: "เลือกระดับความรู้ (HSK 1 / 2 / 3)",
          text: "เลือกระดับบทเรียนที่เหมาะกับคุณ HSK 1 (เริ่มต้น 16 บท), HSK 2 (ปานกลาง 16 บท), หรือ HSK 3 (ก้าวหน้า 16 บท)",
        },
        {
          num: "2",
          title: "เลือกบทเรียนและฉากที่ต้องการเรียน",
          text: "แต่ละบทเรียนแบ่งเป็น 3 ฉากสถานการณ์จำลอง (Text 1, Text 2, Text 3) พร้อมรายการคำศัพท์ใหม่ประจำบท",
        },
        {
          num: "3",
          title: "ฟังเสียง อ่านบทสนทนา และฝึกทำแบบทดสอบ",
          text: "กดฟังเสียงเจ้าของภาษาทีละประโยค ตอบคำถามเช็คความเข้าใจ และแตะคำศัพท์เรียงเป็นประโยคที่ถูกต้อง",
        },
      ],
      tip: "💡 แนะนำ: หากเพิ่งเริ่มเรียน ให้กดปุ่ม 'เริ่มเรียนทันที (HSK 1 บทที่ 1)' เพื่อเริ่มฝึกจากฉากแรกได้เลย!",
      mockupType: "home",
    },
    zh: {
      badge: "🚀 欢迎使用华韵中文",
      title: "3 步快速上手情境学习",
      desc: "无需死记硬背，在生活化对话中跟随母语者发音听读、答题并重组句子。",
      steps: [
        { num: "1", title: "选择 HSK 等级", text: "根据当前水平选择 HSK 1（基础）、HSK 2（提高）或 HSK 3（进阶）。" },
        { num: "2", title: "选择课文与场景", text: "每课包含 3 个情境场景（Text 1–3）及本课生词表。" },
        { num: "3", title: "听读对话并完成练习", text: "聆听真实发音，完成限时理解检测并重组课文句子。" },
      ],
      tip: "💡 提示：点击“立即开始”即可直接进入 HSK 1 第 1 课体验！",
      mockupType: "home",
    },
    en: {
      badge: "🚀 Welcome to HuaYun",
      title: "3 Simple Steps to Start Learning",
      desc: "Learn real-life Chinese without memorization. Practice native pronunciation, quick comprehension, and sentence rebuilding.",
      steps: [
        { num: "1", title: "Select HSK Level (1–3)", text: "Choose HSK 1 (Beginner), HSK 2 (Intermediate), or HSK 3 (Advanced)." },
        { num: "2", title: "Choose Lesson & Scene", text: "Each lesson contains 3 simulated scenes (Text 1–3) and a vocabulary list." },
        { num: "3", title: "Listen, Read & Rebuild", text: "Listen to native audio, answer quick check questions, and rebuild sentences." },
      ],
      tip: "💡 Tip: Click 'Start Now (HSK 1 Lesson 1)' to jump right into the first scene!",
      mockupType: "home",
    },
  },

  catalog: {
    th: {
      badge: "📚 หน้ารายการบทเรียน",
      title: "วิธีเลือกบทเรียนและฉากสถานการณ์",
      desc: "เลือกบทเรียนที่ต้องการ และสามารถเลือกดูเป้าหมาย สารบัญ คำศัพท์ หรือเข้าเรียนฉาก Text 1–3 ได้ทันที",
      steps: [
        {
          num: "1",
          title: "แถบเลือกบทเรียนด้านบน",
          text: "เลื่อนแถบตัวเลขบทเรียนเพื่อสลับไปบทที่ต้องการ (เช่น บทที่ 01, 02, 03...)",
        },
        {
          num: "2",
          title: "เลือกฉากสถานการณ์ (Text 1, 2, 3)",
          text: "แต่ละบทจะมี 3 ฉาก กดที่แท็บฉากเพื่อดูรูปภาพประกอบ ตัวละคร และสถานที่",
        },
        {
          num: "3",
          title: "กดปุ่ม 'เข้าเรียนฉากนี้' หรือ 'เริ่มเรียนตามลำดับ'",
          text: "เพื่อเข้าสู่ห้องเรียนบทสนทนาและเริ่มฝึกฟังเสียงพากย์",
        },
      ],
      tip: "💡 ปุ่มด้านบนมี 'เป้าหมายบทเรียน', 'สารบัญ', และ 'คำศัพท์' ให้เปิดทบทวนได้ตลอดเวลา",
      mockupType: "catalog",
    },
    zh: {
      badge: "📚 课程索引",
      title: "如何选择课文与场景",
      desc: "在目录中切换课文，预览目标、生词或直接进入 3 个对话场景。",
      steps: [
        { num: "1", title: "上方课文导航", text: "左右滑动或点击课文编号即可切换课文。" },
        { num: "2", title: "选择场景 (Text 1–3)", text: "点击场景标签预览插图、地点与出场人物。" },
        { num: "3", title: "进入场景开始学习", text: "点击“进入此场景”开启对话听读。" },
      ],
      tip: "💡 提示：可通过书前页导航查看导读、目录与完整生词表。",
      mockupType: "catalog",
    },
    en: {
      badge: "📚 Lesson Catalog",
      title: "How to Choose Lessons & Scenes",
      desc: "Browse lessons, inspect learning goals and vocabulary, or jump directly into any dialogue scene.",
      steps: [
        { num: "1", title: "Lesson Bar", text: "Scroll or tap lesson numbers to switch between lessons." },
        { num: "2", title: "Select Scene (Text 1–3)", text: "Click scene tabs to see illustrations, location, and characters." },
        { num: "3", title: "Enter Scene", text: "Click 'Enter This Scene' to start practicing." },
      ],
      tip: "💡 You can also review Lesson Goals, Contents, and Vocabulary anytime from the top bar.",
      mockupType: "catalog",
    },
  },

  reader: {
    th: {
      badge: "📖 ห้องเรียนบทสนทนา",
      title: "วิธีเรียนในห้องเรียนบทสนทนา",
      desc: "ฟังเสียงเจ้าของภาษา ดูคำแปลไทย และตอบคำถามระหว่างบทเรียนเพื่อความเข้าใจอย่างถ่องแท้",
      steps: [
        {
          num: "1",
          title: "เลือกโหมดก่อนเริ่ม (เล่นอัตโนมัติ / อ่านเอง)",
          text: "โหมด 'เล่นอัตโนมัติ' ระบบจะเล่นเสียงและเลื่อนบทสนทนาให้ หรือเลือก 'อ่านเอง' เพื่อกดฟังเสียงทีละประโยค",
        },
        {
          num: "2",
          title: "ปุ่มลำโพง 🔊 ฟังเสียงซ้ำได้ตลอดเวลา",
          text: "แตะที่ปุ่มลำโพงข้างประโยคเพื่อฟังเสียงพากย์ซ้ำ พร้อมดูตัวอักษรจีน พินอิน และคำแปลไทยใต้ประโยค",
        },
        {
          num: "3",
          title: "ทำแบบทดสอบเมื่อมีคำถามขึ้นมา",
          text: "ระหว่างบทเรียนจะมีคำถามเช็คความเข้าใจ (QTE) และแบบฝึกเรียงประโยค ตอบให้ถูกต้องเพื่อไปต่อ!",
        },
      ],
      tip: "💡 ทริค: กด Spacebar หรือปุ่ม F บนคีย์บอร์ดเพื่อเล่น/หยุดเสียงได้ทันที และกดปุ่ม 'เปิด/ปิด คำแปลไทย' ได้ที่มุมบนขวา",
      mockupType: "reader",
    },
    zh: {
      badge: "📖 对话剧场",
      title: "对话学习与控制说明",
      desc: "聆听原声发音、查看释义并完成互动挑战。",
      steps: [
        { num: "1", title: "选择进入模式", text: "“自动播放”将自动播音滚动，“手动点击”可自主控制进度。" },
        { num: "2", title: "点击 🔊 重复播放单句", text: "每句均配有专属角色原声、拼音与释义。" },
        { num: "3", title: "完成即时挑战", text: "对话中会触发限时理解题与原句重组练习。" },
      ],
      tip: "💡 提示：按空格键或 F 键可快速播放/暂停，右上角可自由开关翻译。",
      mockupType: "reader",
    },
    en: {
      badge: "📖 Dialogue Theatre",
      title: "How to Learn with Dialogues",
      desc: "Listen to native audio, view translations, and complete comprehension challenges as you read.",
      steps: [
        { num: "1", title: "Choose Playback Mode", text: "Select 'Autoplay' for continuous listening or 'Manual' for self-paced reading." },
        { num: "2", title: "Tap 🔊 to Replay Line", text: "Listen to each character's voice anytime with clear Pinyin and meanings." },
        { num: "3", title: "Answer In-Scene Challenges", text: "Quick comprehension checks and sentence builders will appear as you progress." },
      ],
      tip: "💡 Tip: Press Spacebar or F to Play/Pause instantly. Toggle translation on/off at the top right.",
      mockupType: "reader",
    },
  },

  challenge: {
    th: {
      badge: "⚡ แบบทดสอบในฉาก",
      title: "วิธีทำคำถามวัดความเข้าใจ & ฝึกเรียงประโยค",
      desc: "ทดสอบความเข้าใจจากบทสนทนาที่เพิ่งฟัง และฝึกเรียงคำศัพท์เป็นประโยคที่ถูกต้อง",
      steps: [
        {
          num: "1",
          title: "คำถามวัดความเข้าใจ (QTE)",
          text: "อ่านคำถามและเลือกตัวเลือกที่ถูกต้องก่อนเวลาจะหมด (สามารถกดหยุดเวลาชั่วคราวได้)",
        },
        {
          num: "2",
          title: "แบบฝึกเรียงประโยคภาษาจีน",
          text: "แตะเลือกคำศัพท์ภาษาจีนด้านล่างตามลำดับ เพื่อประกอบเป็นประโยคที่ถูกต้องตามความหมาย",
        },
        {
          num: "3",
          title: "แก้ไขคำตอบได้ง่ายๆ",
          text: "หากแตะผิด สามารถกด '↩️ ลบคำล่าสุด' หรือกด '🔄 ล้างคำตอบ' เพื่อเริ่มเรียงใหม่ได้ตลอดเวลา",
        },
      ],
      tip: "💡 หากตอบผิด ระบบจะมีประโยคเฉลยจากบทเรียนแสดงให้ดูเพื่อทำความเข้าใจและลองใหม่ได้ทันที!",
      mockupType: "challenge",
    },
    zh: {
      badge: "⚡ 场景互动挑战",
      title: "限时理解与原句重组说明",
      desc: "检测对话理解并练习中文组句能力。",
      steps: [
        { num: "1", title: "限时理解（QTE）", text: "在倒计时结束前选出正确答案（可随时暂停计时）。" },
        { num: "2", title: "原句重组", text: "按正确语序点击下方词语拼出完整句子。" },
        { num: "3", title: "修改与重试", text: "点击“撤回”或“重新排列”调整顺序。" },
      ],
      tip: "💡 提示：回答错误会提供课文原句参考，可轻松重试！",
      mockupType: "challenge",
    },
    en: {
      badge: "⚡ Challenges",
      title: "Comprehension Checks & Sentence Builder",
      desc: "Test your understanding of the dialogue and practice assembling Chinese sentences.",
      steps: [
        { num: "1", title: "Comprehension Check (QTE)", text: "Select the correct answer before the countdown ends." },
        { num: "2", title: "Sentence Builder", text: "Tap Chinese words below in the correct order to form the sentence." },
        { num: "3", title: "Undo & Reset", text: "Tap 'Undo' or 'Reset' anytime if you tap the wrong word." },
      ],
      tip: "💡 If you answer incorrectly, original text evidence is shown to help you retry!",
      mockupType: "challenge",
    },
  },

  games: {
    th: {
      badge: "🎮 มินิเกมฝึกทบทวน",
      title: "วิธีเล่นมินิเกมฝึกทักษะภาษาจีนทั้ง 4 เกม",
      desc: "ทบทวนคำศัพท์และพินอินจากบทเรียนนี้ผ่านมินิเกมแสนสนุก สะสมคะแนนและคอมโบต่อเนื่อง!",
      steps: [
        {
          num: "1",
          title: "Vocab Blitz (ทายความหมาย)",
          text: "ดูคำศัพท์ภาษาจีนแล้วเลือกความหมายภาษาไทยให้ถูกต้องและเร็วที่สุด มี 3 หัวใจ",
        },
        {
          num: "2",
          title: "Card Frenzy (จับคู่การ์ด)",
          text: "เปิดการ์ดจับคู่ตัวอักษรจีนกับความหมายภาษาไทยให้ครบ 6 คู่ โดยใช้จำนวนครั้งให้น้อยที่สุด",
        },
        {
          num: "3",
          title: "Sound Sprint (ฟังเสียงทายคำ)",
          text: "กดฟังเสียงอ่านภาษาจีนของเจ้าของภาษา แล้วเลือกความหมายที่ตรงกับเสียงที่ได้ยิน",
        },
        {
          num: "4",
          title: "Pinyin Dash (ทายพินอิน)",
          text: "ดูตัวอักษรจีนแล้วเลือกพินอินและเสียงวรรณยุกต์ที่ถูกต้อง ตอบถูกต่อเนื่องเพื่อรับโหมดเทอร์โบ",
        },
      ],
      tip: "💡 เล่นได้ไม่จำกัดจำนวนครั้ง คะแนนสูงสุดจะถูกบันทึกไว้ในแต่ละบทเรียน!",
      mockupType: "games",
    },
    zh: {
      badge: "🎮 课后小游戏",
      title: "4 款趣味巩固小游戏玩法说明",
      desc: "通过游戏反复复习本课生词与拼音，冲击最高分！",
      steps: [
        { num: "1", title: "Vocab Blitz · 词义快选", text: "根据汉字快速选择正确词义，保持连击。" },
        { num: "2", title: "Card Frenzy · 翻牌配对", text: "翻牌匹配汉字与对应释义，步数越少越好。" },
        { num: "3", title: "Sound Sprint · 听音快选", text: "先点击听发音，再选出对应词义。" },
        { num: "4", title: "Pinyin Dash · 拼音冲刺", text: "为汉字选出正确拼音及声调，连续答对进入加速模式。" },
      ],
      tip: "💡 提示：可无限次挑战，系统自动记录每课最高分！",
      mockupType: "games",
    },
    en: {
      badge: "🎮 Arcade Games",
      title: "How to Play the 4 Mini-Games",
      desc: "Review lesson vocabulary and Pinyin with 4 engaging mini-games. Build combos and set high scores!",
      steps: [
        { num: "1", title: "Vocab Blitz", text: "See Chinese words and pick the correct Thai meaning fast. 3 lives." },
        { num: "2", title: "Card Frenzy", text: "Flip cards to pair Chinese words with their meanings in minimal moves." },
        { num: "3", title: "Sound Sprint", text: "Listen to native audio and choose the matching word meaning." },
        { num: "4", title: "Pinyin Dash", text: "Pick the correct Pinyin and tone for each Chinese character. 5-streak turbo!" },
      ],
      tip: "💡 Replay anytime to beat your personal best score!",
      mockupType: "games",
    },
  },
};

function GuideVisualMockup({ type }) {
  if (type === "home") {
    return (
      <div className="g3-guide-mockup is-home" aria-hidden="true">
        <div className="g3-mockup-bar">
          <span className="g3-mockup-dot is-red" />
          <span className="g3-mockup-dot is-gold" />
          <span className="g3-mockup-dot is-jade" />
          <span className="g3-mockup-title">หน้าหลัก / เลือกระดับ HSK</span>
        </div>
        <div className="g3-mockup-content">
          <div className="g3-mockup-btn-demo is-hero-action">
            <span>🚀 เริ่มเรียนทันที (HSK 1 บทที่ 1)</span>
          </div>
          <div className="g3-mockup-level-cards">
            <div className="g3-mockup-level is-hsk1">
              <span className="g3-mockup-badge">ง่าย</span>
              <strong>HSK 1</strong>
              <small>บทสนทนาพื้นฐาน 16 บท</small>
            </div>
            <div className="g3-mockup-level is-hsk2">
              <span className="g3-mockup-badge">ปานกลาง</span>
              <strong>HSK 2</strong>
              <small>สื่อสารคล่องขึ้น 16 บท</small>
            </div>
            <div className="g3-mockup-level is-hsk3">
              <span className="g3-mockup-badge">ท้าทาย</span>
              <strong>HSK 3</strong>
              <small>สนทนาต่อเนื่อง 16 บท</small>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === "reader") {
    return (
      <div className="g3-guide-mockup is-reader" aria-hidden="true">
        <div className="g3-mockup-bar">
          <span className="g3-mockup-dot is-red" />
          <span className="g3-mockup-dot is-gold" />
          <span className="g3-mockup-dot is-jade" />
          <span className="g3-mockup-title">ห้องเรียนบทสนทนา (Reading Theatre)</span>
        </div>
        <div className="g3-mockup-content">
          <div className="g3-mockup-dialogue-bubble">
            <div className="g3-mockup-speaker-tag">
              <span className="g3-mockup-role">A</span>
              <strong>พนักงานขาย (王一雪)</strong>
            </div>
            <div className="g3-mockup-bubble-body">
              <span className="g3-mockup-audio-btn">🔊 ฟังเสียง</span>
              <div className="g3-mockup-hanzi">您想买什么？</div>
              <div className="g3-mockup-pinyin">Nín xiǎng mǎi shénme?</div>
              <div className="g3-mockup-trans">คุณต้องการซื้ออะไรครับ/ค่ะ?</div>
            </div>
          </div>
          <div className="g3-mockup-controls-row">
            <span className="g3-mockup-pill is-active">▶ กำลังเล่นเสียง</span>
            <span className="g3-mockup-pill">🌐 เปิดคำแปลไทย: เปิด</span>
            <span className="g3-mockup-pill">🎭 สลับมุมมอง 3D/2D</span>
          </div>
        </div>
      </div>
    );
  }

  if (type === "challenge") {
    return (
      <div className="g3-guide-mockup is-challenge" aria-hidden="true">
        <div className="g3-mockup-bar">
          <span className="g3-mockup-dot is-red" />
          <span className="g3-mockup-dot is-gold" />
          <span className="g3-mockup-dot is-jade" />
          <span className="g3-mockup-title">แบบทดสอบ & ฝึกเรียงประโยค</span>
        </div>
        <div className="g3-mockup-content">
          <div className="g3-mockup-qte-demo">
            <div className="g3-mockup-qte-header">
              <span>❓ คำถาม: ลูกค้าต้องการซื้ออะไร?</span>
              <span className="g3-mockup-timer">⏱️ 14s</span>
            </div>
            <div className="g3-mockup-qte-choice is-selected">✅ 1. แอปเปิ้ล (苹果)</div>
            <div className="g3-mockup-qte-choice">2. แตงโม (西瓜)</div>
          </div>
          <div className="g3-mockup-builder-demo">
            <div className="g3-mockup-builder-target">
              <span>ประโยคที่เรียง:</span>
              <div className="g3-mockup-word-chips">
                <span className="g3-mockup-chip is-placed">我想</span>
                <span className="g3-mockup-chip is-placed">买</span>
                <span className="g3-mockup-chip is-placed">苹果</span>
              </div>
            </div>
            <div className="g3-mockup-word-pool">
              <span className="g3-mockup-chip">🍎 苹果</span>
              <span className="g3-mockup-chip">🛒 买</span>
              <span className="g3-mockup-chip">🙋 我想</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === "games") {
    return (
      <div className="g3-guide-mockup is-games" aria-hidden="true">
        <div className="g3-mockup-bar">
          <span className="g3-mockup-dot is-red" />
          <span className="g3-mockup-dot is-gold" />
          <span className="g3-mockup-dot is-jade" />
          <span className="g3-mockup-title">มินิเกมฝึกทบทวน (4 เกม)</span>
        </div>
        <div className="g3-mockup-content">
          <div className="g3-mockup-games-grid">
            <div className="g3-mockup-game-item">
              <span className="g3-mockup-icon">⚡</span>
              <strong>Vocab Blitz</strong>
              <small>ทายความหมายคำศัพท์</small>
            </div>
            <div className="g3-mockup-game-item">
              <span className="g3-mockup-icon">🃏</span>
              <strong>Card Frenzy</strong>
              <small>จับคู่การ์ดจีน-ไทย</small>
            </div>
            <div className="g3-mockup-game-item">
              <span className="g3-mockup-icon">🔊</span>
              <strong>Sound Sprint</strong>
              <small>ฟังเสียงทายคำ</small>
            </div>
            <div className="g3-mockup-game-item">
              <span className="g3-mockup-icon">📝</span>
              <strong>Pinyin Dash</strong>
              <small>ทายเสียงพินอิน</small>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="g3-guide-mockup is-catalog" aria-hidden="true">
      <div className="g3-mockup-bar">
        <span className="g3-mockup-dot is-red" />
        <span className="g3-mockup-dot is-gold" />
        <span className="g3-mockup-dot is-jade" />
        <span className="g3-mockup-title">หน้ารายการบทเรียน & เลือกฉาก</span>
      </div>
      <div className="g3-mockup-content">
        <div className="g3-mockup-tabs-demo">
          <span className="g3-mockup-tab is-active">ฉากที่ 1 (Text 1)</span>
          <span className="g3-mockup-tab">ฉากที่ 2 (Text 2)</span>
          <span className="g3-mockup-tab">ฉากที่ 3 (Text 3)</span>
        </div>
        <div className="g3-mockup-scene-card-demo">
          <strong>🛒 ฉากที่ 1 · ร้านขายผลไม้</strong>
          <small>ตัวละคร: พนักงานขาย (A) กับ ลูกค้า (B)</small>
          <div className="g3-mockup-btn-demo">
            <span>📖 เข้าเรียนฉากนี้ →</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function GuideModal({
  guideKey = "home",
  language = "th",
  isOpen = false,
  onClose,
}) {
  const [dontShow, setDontShow] = useState(false);
  const closeButtonRef = useRef(null);
  const dialogRef = useRef(null);

  const guide = GUIDE_CONTENT[guideKey]?.[language] || GUIDE_CONTENT.home.th;

  useEffect(() => {
    if (!isOpen) return undefined;
    playUiCue("dialogOpen");
    const frame = window.requestAnimationFrame(() => closeButtonRef.current?.focus());

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        handleDismiss();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleDismiss = () => {
    if (dontShow) {
      try {
        localStorage.setItem(`g3_guide_seen_${guideKey}`, "true");
      } catch {
        // storage fallback
      }
    }
    playUiCue("dialogClose");
    onClose?.();
  };

  if (!isOpen) return null;

  return (
    <div
      className="g3-guide-modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleDismiss();
      }}
      role="presentation"
    >
      <div
        className="g3-guide-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="g3-guide-title"
        ref={dialogRef}
      >
        <header className="g3-guide-modal-header">
          <div className="g3-guide-header-text">
            <span className="g3-guide-badge">{guide.badge}</span>
            <h2 id="g3-guide-title">{guide.title}</h2>
          </div>
          <button
            className="g3-guide-close-btn"
            type="button"
            ref={closeButtonRef}
            onClick={handleDismiss}
            aria-label="ปิดหน้าต่างคำแนะนำ"
          >
            <Icon paths={xmarkIcon} />
          </button>
        </header>

        <div className="g3-guide-modal-body">
          <p className="g3-guide-desc">{guide.desc}</p>

          <GuideVisualMockup type={guide.mockupType} />

          <div className="g3-guide-steps-list">
            {guide.steps.map((step) => (
              <div className="g3-guide-step-card" key={step.num}>
                <span className="g3-guide-step-number">{step.num}</span>
                <div className="g3-guide-step-content">
                  <strong>{step.title}</strong>
                  <p>{step.text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="g3-guide-tip-banner">
            <Icon paths={circleInfoIcon} />
            <span>{guide.tip}</span>
          </div>
        </div>

        <footer className="g3-guide-modal-footer">
          <label className="g3-guide-checkbox-label">
            <input
              type="checkbox"
              checked={dontShow}
              onChange={(e) => setDontShow(e.target.checked)}
            />
            <span>ไม่ต้องแสดงคำแนะนำนี้อีก</span>
          </label>
          <button
            className="g3-guide-confirm-btn"
            type="button"
            onClick={handleDismiss}
          >
            เข้าใจแล้ว เริ่มเลย! 🚀
          </button>
        </footer>
      </div>
    </div>
  );
}

export function GuideButton({ onClick, label = "💡 วิธีใช้งาน", className = "" }) {
  return (
    <button
      className={`g3-guide-trigger-btn ${className}`.trim()}
      type="button"
      onClick={() => {
        playUiCue("tap");
        onClick?.();
      }}
      title={label}
      aria-label={label}
    >
      <span className="g3-guide-btn-icon" aria-hidden="true">💡</span>
      <span className="g3-guide-btn-text">{label}</span>
    </button>
  );
}
