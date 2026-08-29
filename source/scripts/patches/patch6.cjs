const fs = require('fs');
const path = require('path');
const p = path.resolve('src/surfaces/group-3-8104/features/reader/challenges/Challenges.jsx');
let content = fs.readFileSync(p, 'utf-8');

// For QteChallenge, remove old hint
content = content.replace(
  /\{showHint && status !== "correct" && \(\s*<div className="g3-qte-hint"[\s\S]*?<\/div>\s*\)\s*\}/,
  ''
);

// For SentenceChallenge, remove old wrongAttempts and old hint
content = content.replace(
  /\{wrongAttempts > 0 && status === "active" && \(\s*<div style=\{\{ textAlign: "center"[\s\S]*?<\/div>\s*\)\s*\}/,
  ''
);

content = content.replace(
  /\{wrongAttempts >= 3 && status !== "correct" && \(\s*<div className="g3-qte-hint"[\s\S]*?<\/div>\s*\)\s*\}/,
  ''
);

// Insert feedback blocks BELOW answer areas
// For QteChallenge (after <div className="g3-qte-options">...</div>)
content = content.replace(
  /(<div className="g3-qte-options">[\s\S]*?<\/div>)/,
  `$1

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
        )}`
);

// For SentenceChallenge (after g3-word-bank)
// Notice it is right before g3-builder-controls
content = content.replace(
  /(<div className="g3-word-bank">[\s\S]*?<\/div>)\s*<div className="g3-builder-controls">/,
  `$1

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

        <div className="g3-builder-controls">`
);

fs.writeFileSync(p, content, 'utf-8');
