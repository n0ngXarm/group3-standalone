const fs = require('fs');
const path = require('path');
const p = path.resolve('src/surfaces/group-3-8104/features/reader/challenges/Challenges.jsx');
let content = fs.readFileSync(p, 'utf-8');

// In QteChallenge and SentenceChallenge
content = content.replace(
  /\{\s*onRestart && \(\s*<footer className="g3-qte-restart">[\s\S]*?<\/footer>\s*\)\s*\}/g,
  '{onRestart && status !== "active" && (\n          <footer className="g3-qte-restart">\n            <button type="button" onClick={onRestart}>\n              <Icon paths={rotateLeftIcon} />\n              {text.qteRestart || "เริ่มเล่นใหม่"}\n            </button>\n          </footer>\n        )}'
);

fs.writeFileSync(p, content, 'utf-8');
