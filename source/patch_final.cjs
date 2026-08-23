const fs = require('fs');
const path = require('path');
const p = path.resolve('src/surfaces/group-3-8104/features/reader/challenges/Challenges.jsx');
let content = fs.readFileSync(p, 'utf-8');

// Signatures
content = content.replace(
  'export function QteChallenge({ challenge, language, timed, onResolve, onRestart }) {',
  'export function QteChallenge({ challenge, language, timed, onResolve, onRestart, sourceLine }) {'
);
content = content.replace(
  'export function SentenceChallenge({ challenge, language, onResolve, onRestart }) {',
  'export function SentenceChallenge({ challenge, language, onResolve, onRestart, sourceLine }) {'
);

// QTE Support Block
const supportBlock = `
        {sourceLine && (
          <div className="g3-qte-support-block">
            <strong>{sourceLine.hanzi}</strong>
            <small>{sourceLine.pinyin}</small>
            <em>{sourceLine.th}</em>
          </div>
        )}`;

content = content.replace(
  '{timed && status === "active" && <button className="g3-pause-time" type="button" onClick={togglePause}><Icon paths={paused ? playIcon : pauseIcon} />{paused ? text.resume : text.pause}</button>}',
  `{timed && status === "active" && <button className="g3-pause-time" type="button" onClick={togglePause}><Icon paths={paused ? playIcon : pauseIcon} />{paused ? text.resume : text.pause}</button>}\n${supportBlock}`
);

content = content.replace(
  '<p className="g3-builder-hint">{text.builderHint}</p>',
  `<p className="g3-builder-hint">{text.builderHint}</p>\n${supportBlock}`
);

// Remove old wrongAttempts in QteChallenge
content = content.replace(
  /\{\s*wrongAttempts > 0 && status === "active" && \(\s*<div style=\{\{\s*textAlign: "center"[\s\S]*?<\/div>\s*\)\s*\}/,
  ''
);

// Remove old wrongAttempts in SentenceChallenge
content = content.replace(
  /\{\s*wrongAttempts > 0 && status === "active" && \(\s*<div style=\{\{\s*textAlign: "center"[\s\S]*?<\/div>\s*\)\s*\}/,
  ''
);

// Remove old hints
content = content.replace(
  /\{showHint && status !== "correct" && \(\s*<div className="g3-qte-hint"[\s\S]*?<\/div>\s*\)\s*\}/,
  ''
);

content = content.replace(
  /\{wrongAttempts >= 3 && status !== "correct" && \(\s*<div className="g3-qte-hint"[\s\S]*?<\/div>\s*\)\s*\}/,
  ''
);

// Add new feedback blocks
const feedbackBlockQte = `
        {wrongAttempts > 0 && status === "active" && (
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
        )}
`;

const feedbackBlockBuilder = `
        {wrongAttempts > 0 && status === "active" && (
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
        )}
`;

content = content.replace(
  '{status !== "active" && (\n          <div className="g3-challenge-result" aria-live="polite">',
  feedbackBlockQte + '\n        {status !== "active" && (\n          <div className="g3-challenge-result" aria-live="polite">'
);

content = content.replace(
  '<div className="g3-builder-controls">',
  feedbackBlockBuilder + '\n        <div className="g3-builder-controls">'
);

fs.writeFileSync(p, content, 'utf-8');
