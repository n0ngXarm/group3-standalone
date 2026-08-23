const fs = require('fs');
const path = require('path');
const p = path.resolve('src/surfaces/group-3-8104/features/reader/challenges/Challenges.jsx');
let content = fs.readFileSync(p, 'utf-8');

// Ensure tokenizer is imported
if (!content.includes('buildQteTokens')) {
  content = content.replace(
    'import PINYIN_MAP from "../../../data/pinyin-map.json";',
    'import PINYIN_MAP from "../../../data/pinyin-map.json";\nimport { buildQteTokens } from "./tokenizer.js";'
  );
}

// 1. Update QteChallenge Hint Logic
// Replace `const showHint = wrongAttempts >= 3;`
content = content.replace(
  'const showHint = wrongAttempts >= 3;',
  'const showStrongHint = wrongAttempts >= 6;'
);

// Replace `const isHintDisabled = showHint && option.value === wrongOptionToDisable;`
content = content.replace(
  'const isHintDisabled = showHint && option.value === wrongOptionToDisable;',
  'const isHintDisabled = showStrongHint && option.value === wrongOptionToDisable;'
);

// Replace feedback block in QteChallenge
const oldQteFeedback = `{wrongAttempts > 0 && status === "active" && (
          <div className="g3-qte-feedback-block">
            <div className="g3-qte-wrong-count">
              {language === "th" ? \`ผิด \${wrongAttempts} / 3\` : language === "zh" ? \`错误 \${wrongAttempts} / 3\` : \`Wrong \${wrongAttempts} / 3\`}
            </div>
            {showHint && (
              <div className="g3-qte-hint-text">
                {language === "th" ? "คำใบ้: ตัดตัวเลือกที่ผิดออก 1 ข้อ" : language === "zh" ? "提示：排除一个错误选项" : "Hint: One wrong option removed"}
              </div>
            )}
          </div>
        )}`;

const newQteFeedback = `{wrongAttempts > 0 && status === "active" && (
          <div className="g3-qte-feedback-block">
            <div className="g3-qte-wrong-count">
              {language === "th" ? \`ตอบผิด \${wrongAttempts} ครั้ง\` : language === "zh" ? \`错误 \${wrongAttempts} 次\` : \`Wrong \${wrongAttempts} times\`}
            </div>
            {wrongAttempts >= 4 && (
              <div className="g3-qte-hint-text">
                {language === "th" && wrongAttempts === 4 ? "💡 คำใบ้: ลองดูความหมายภาษาไทย" : ""}
                {language === "th" && wrongAttempts === 5 ? "💡 คำใบ้: สังเกตพินอินให้ดี" : ""}
                {language === "th" && wrongAttempts >= 6 ? "💡 คำใบ้: ตัดตัวเลือกที่ผิดออก 1 ข้อ" : ""}
                
                {language !== "th" && wrongAttempts >= 6 ? "💡 Hint: One wrong option removed" : ""}
                {language !== "th" && wrongAttempts < 6 ? "💡 Hint: Check the translation and pinyin" : ""}
              </div>
            )}
          </div>
        )}`;

content = content.replace(oldQteFeedback, newQteFeedback);

// 2. Update SentenceChallenge Definition
content = content.replace(
  'export function SentenceChallenge({ challenge, language, onResolve, onRestart, sourceLine }) {',
  'export function SentenceChallenge({ challenge, language, level = "hsk2", onResolve, onRestart, sourceLine }) {'
);

// 3. SentenceChallenge internal logic
// We want to replace the state and check logic.
// Find the block from `const sentence = ...` to `const getPinyin...`
const oldSentenceLogic = `const sentence = selected.map((index) => challenge.tiles[index]);

  useEffect(() => {
    setSelected([]);
    setStatus("active");
    setWrongAttempts(0);
  }, [challenge]);

  useEffect(() => {
    if (status === "correct") {
      const timer = window.setTimeout(onResolve, 1500);
      return () => window.clearTimeout(timer);
    }
  }, [status, onResolve]);

  const add = (index) => {
    if (selected.includes(index) || status === "correct") return;
    setSelected((current) => [...current, index]);
    setStatus("active");
  };

  const check = () => {
    const correct = sentence.length === challenge.answer.length && sentence.every((word, index) => word === challenge.answer[index]);
    if (correct) {
      setStatus("correct");
      setWrongAttempts(0);
    } else {
      setStatus("wrong");
      setWrongAttempts(w => w + 1);
    }
  };

  const getPinyin = (word) => PINYIN_MAP[word] || "";`;

const newSentenceLogic = `const [builtSentence, setBuiltSentence] = useState({ answer: [], tiles: [] });
  
  useEffect(() => {
    setSelected([]);
    setStatus("active");
    setWrongAttempts(0);
    
    const hanzi = sourceLine ? sourceLine.hanzi : challenge.answer.join("");
    const pinyin = sourceLine ? sourceLine.pinyin : "";
    const result = buildQteTokens({ hanzi, pinyin, level });
    
    // If tokenizer fails or returns empty, fallback to static chunks
    let answerTokens = result.tokens;
    if (!answerTokens || answerTokens.length === 0) {
      answerTokens = challenge.answer.map(text => ({ text, pinyin: PINYIN_MAP[text] || "", id: Math.random().toString(36).substring(2) }));
    }
    
    const tiles = [...answerTokens].sort(() => Math.random() - 0.5);
    setBuiltSentence({ answer: answerTokens, tiles });
  }, [challenge, sourceLine, level]);

  const sentence = selected.map((index) => builtSentence.tiles[index]);

  useEffect(() => {
    if (status === "correct") {
      const timer = window.setTimeout(onResolve, 1500);
      return () => window.clearTimeout(timer);
    }
  }, [status, onResolve]);

  const add = (index) => {
    if (selected.includes(index) || status === "correct") return;
    setSelected((current) => [...current, index]);
    setStatus("active");
  };

  const check = () => {
    const correct = sentence.length === builtSentence.answer.length && sentence.every((token, index) => token.id === builtSentence.answer[index].id);
    if (correct) {
      setStatus("correct");
      setWrongAttempts(0);
    } else {
      setStatus("wrong");
      setWrongAttempts(w => w + 1);
    }
  };`;

content = content.replace(oldSentenceLogic, newSentenceLogic);

// 4. Update SentenceChallenge UI mapping
// Track: replace `{word}` with `{word.text}` and `{getPinyin(word)}` with `{word.pinyin}`
content = content.replace(
  '{sentence.length ? sentence.map((word, index) => (',
  '{sentence.length ? sentence.map((token, index) => ('
);
content = content.replace(
  '<span key={`${word}-${index}`}><b>{word}</b><small className="g3-word-pinyin">{getPinyin(word)}</small><em>{challenge.gloss[word]}</em><small className="g3-word-index">{index + 1}</small></span>',
  '<span key={token.id}><b>{token.text}</b>{token.pinyin && <small className="g3-word-pinyin">{token.pinyin}</small>}<em>{challenge.gloss && challenge.gloss[token.text]}</em><small className="g3-word-index">{index + 1}</small></span>'
);

// Bank: replace `challenge.tiles.map` with `builtSentence.tiles.map`
content = content.replace(
  '{challenge.tiles.map((word, index) => (',
  '{builtSentence.tiles.map((token, index) => ('
);
content = content.replace(
  '<button type="button" key={`${word}-${index}`} onClick={() => add(index)} disabled={selected.includes(index) || status === "correct"}>',
  '<button type="button" key={token.id} onClick={() => add(index)} disabled={selected.includes(index) || status === "correct" || (wrongAttempts >= 6 && builtSentence.answer[sentence.length] && token.id === builtSentence.answer[sentence.length].id && status === "active" && false)}>' 
  // Wait, strong hint: lock/reveal first 1-2 correct tokens!
  // I will just add an effect for strong hint in SentenceChallenge!
);
content = content.replace(
  '<strong>{word}</strong><small className="g3-word-pinyin">{getPinyin(word)}</small><em>{challenge.gloss[word]}</em>',
  '<strong>{token.text}</strong>{token.pinyin && <small className="g3-word-pinyin">{token.pinyin}</small>}<em>{challenge.gloss && challenge.gloss[token.text]}</em>'
);

// 5. Update SentenceChallenge Feedback block
const oldBuilderFeedback = `{wrongAttempts > 0 && status === "active" && (
          <div className="g3-qte-feedback-block">
            <div className="g3-qte-wrong-count">
              {language === "th" ? \`ผิด \${wrongAttempts} / 3\` : language === "zh" ? \`错误 \${wrongAttempts} / 3\` : \`Wrong \${wrongAttempts} / 3\`}
            </div>
            {wrongAttempts >= 3 && (
              <div className="g3-qte-hint-text">
                {language === "th" ? \`คำใบ้: คำแรกคือ "\${challenge.answer[0]}"\` : language === "zh" ? \`提示：第一个词是 "\${challenge.answer[0]}"\` : \`Hint: The first word is "\${challenge.answer[0]}"\`}
              </div>
            )}
          </div>
        )}`;

const newBuilderFeedback = `{wrongAttempts > 0 && status === "active" && (
          <div className="g3-qte-feedback-block">
            <div className="g3-qte-wrong-count">
              {language === "th" ? \`ตอบผิด \${wrongAttempts} ครั้ง\` : language === "zh" ? \`错误 \${wrongAttempts} 次\` : \`Wrong \${wrongAttempts} times\`}
            </div>
            {wrongAttempts >= 4 && (
              <div className="g3-qte-hint-text">
                {language === "th" && wrongAttempts === 4 ? "💡 คำใบ้: ลองดูความหมายภาษาไทยและจัดเรียงใหม่" : ""}
                {language === "th" && wrongAttempts === 5 && builtSentence.answer[0] ? \`💡 คำใบ้: คำแรกคือ "\${builtSentence.answer[0].text}"\` : ""}
                {language === "th" && wrongAttempts >= 6 && builtSentence.answer[0] && builtSentence.answer[1] ? \`💡 คำใบ้: เริ่มต้นด้วย "\${builtSentence.answer[0].text}" ตามด้วย "\${builtSentence.answer[1].text}"\` : ""}
                
                {language !== "th" && wrongAttempts === 4 ? "💡 Hint: Look at the meaning and try again" : ""}
                {language !== "th" && wrongAttempts === 5 && builtSentence.answer[0] ? \`💡 Hint: The first word is "\${builtSentence.answer[0].text}"\` : ""}
                {language !== "th" && wrongAttempts >= 6 && builtSentence.answer[0] && builtSentence.answer[1] ? \`💡 Hint: Starts with "\${builtSentence.answer[0].text}" then "\${builtSentence.answer[1].text}"\` : ""}
              </div>
            )}
          </div>
        )}`;

content = content.replace(oldBuilderFeedback, newBuilderFeedback);

// Check disabled logic
content = content.replace(
  'disabled={sentence.length !== challenge.answer.length || status === "correct"}',
  'disabled={sentence.length !== builtSentence.answer.length || status === "correct"}'
);

fs.writeFileSync(p, content, 'utf-8');
