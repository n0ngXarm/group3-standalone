const fs = require('fs');
const path = require('path');
const p = path.resolve('src/surfaces/group-3-8104/features/reader/challenges/Challenges.jsx');
let content = fs.readFileSync(p, 'utf-8');

// Update signatures
content = content.replace(
  'export function QteChallenge({ challenge, language, timed, onResolve, onRestart }) {',
  'export function QteChallenge({ challenge, language, timed, onResolve, onRestart, sourceLine }) {'
);
content = content.replace(
  'export function SentenceChallenge({ challenge, language, onResolve, onRestart }) {',
  'export function SentenceChallenge({ challenge, language, onResolve, onRestart, sourceLine }) {'
);

// Add support block to QteChallenge
content = content.replace(
  '{timed && status === "active" && <button className="g3-pause-time" type="button" onClick={togglePause}><Icon paths={paused ? playIcon : pauseIcon} />{paused ? text.resume : text.pause}</button>}',
  `{timed && status === "active" && <button className="g3-pause-time" type="button" onClick={togglePause}><Icon paths={paused ? playIcon : pauseIcon} />{paused ? text.resume : text.pause}</button>}
        
        {sourceLine && (
          <div className="g3-qte-support-block">
            <strong>{sourceLine.hanzi}</strong>
            <small>{sourceLine.pinyin}</small>
            <em>{sourceLine.th}</em>
          </div>
        )}`
);

// Add support block to SentenceChallenge
content = content.replace(
  '<p className="g3-builder-hint">{text.builderHint}</p>',
  `<p className="g3-builder-hint">{text.builderHint}</p>
        
        {sourceLine && (
          <div className="g3-qte-support-block">
            <strong>{sourceLine.hanzi}</strong>
            <small>{sourceLine.pinyin}</small>
            <em>{sourceLine.th}</em>
          </div>
        )}`
);

// Remove old wrongAttempts and old hint in QteChallenge
content = content.replace(
  /\{\s*wrongAttempts > 0 && status === "active" && \([\s\S]*?\}\s*\)\s*\}/,
  ''
);
content = content.replace(
  /\{showHint && status !== "correct" && \(\s*<div className="g3-qte-hint"[\s\S]*?<\/div>\s*\)\s*\}/,
  ''
);

// Remove old wrongAttempts and old hint in SentenceChallenge
content = content.replace(
  /\{\s*wrongAttempts > 0 && status === "active" && \([\s\S]*?\}\s*\)\s*\}/,
  ''
);
content = content.replace(
  /\{wrongAttempts >= 3 && status !== "correct" && \(\s*<div className="g3-qte-hint"[\s\S]*?<\/div>\s*\)\s*\}/,
  ''
);

fs.writeFileSync(p, content, 'utf-8');
