const fs = require('fs');
const path = require('path');
const p = path.resolve('src/surfaces/group-3-8104/styles/challenges.css');
let content = fs.readFileSync(p, 'utf-8');

content = content.replace(
  '.g3-sentence-track > span small {',
  '.g3-sentence-track > span small.g3-word-index {'
);

// We should also ensure g3-word-pinyin has position static, not absolute, just in case
content = content.replace(
  '.g3-sentence-track > span small.g3-word-pinyin { color: var(--color-accent); font-weight: 600; font-size: 0.8rem; }',
  '.g3-sentence-track > span small.g3-word-pinyin { position: static; color: var(--color-accent); font-weight: 600; font-size: 0.8rem; margin-top: 0.1rem; }'
);

// Fix em color contrast
content = content.replace(
  'color: rgba(255, 248, 232, 0.85);',
  'color: var(--color-text-muted);'
);

fs.writeFileSync(p, content, 'utf-8');
