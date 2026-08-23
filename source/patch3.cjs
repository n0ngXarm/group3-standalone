const fs = require('fs');
const path = require('path');
const p = path.resolve('src/surfaces/group-3-8104/features/reader/challenges/Challenges.jsx');
let content = fs.readFileSync(p, 'utf-8');

// For QteChallenge
content = content.replace(
  /\{showHint && status !== "correct" && \([\s\S]*?\}\s*\)\s*\}/,
  `{wrongAttempts > 0 && status === "active" && (
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

// For SentenceChallenge
content = content.replace(
  /\{wrongAttempts >= 3 && status !== "correct" && \([\s\S]*?\}\s*\)\s*\}/,
  `{wrongAttempts > 0 && status === "active" && (
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
        )}`
);

fs.writeFileSync(p, content, 'utf-8');
