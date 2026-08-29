const fs = require('fs');
const path = require('path');
const p = path.resolve('src/surfaces/group-3-8104/features/reader/challenges/Challenges.jsx');
let content = fs.readFileSync(p, 'utf-8');

// Update QteChallenge signature
content = content.replace(
  'export function QteChallenge({ challenge, language, timed, onResolve, onRestart }) {',
  'export function QteChallenge({ challenge, language, timed, onResolve, onRestart, sourceLine }) {'
);

// Add MAIN QTE SUPPORT BLOCK
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

// We need to do the same for SentenceChallenge
content = content.replace(
  'export function SentenceChallenge({ challenge, language, onResolve, onRestart }) {',
  'export function SentenceChallenge({ challenge, language, onResolve, onRestart, sourceLine }) {'
);

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

// Also need to move wrongAttempts down directly below answer area.
content = content.replace(
  /\{\s*wrongAttempts > 0 && status === "active" && \([\s\S]*?\}\s*\)\s*\}/,
  ''
); // Removing the first occurrence in QteChallenge. Note regex might not match exactly due to indentation, so let's do exact replace.

fs.writeFileSync(p, content, 'utf-8');
