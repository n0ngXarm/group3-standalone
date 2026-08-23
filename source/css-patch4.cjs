const fs = require('fs');
const path = require('path');
const p = path.resolve('src/surfaces/group-3-8104/styles/challenges.css');
let content = fs.readFileSync(p, 'utf-8');

// Update g3-word-bank token styling
content = content.replace(
  '.g3-word-bank button:disabled {\n  opacity: 0.24;\n  cursor: default;\n}',
  '.g3-word-bank button:disabled {\n  opacity: 0.6;\n  cursor: default;\n  background: rgba(255, 255, 255, 0.4);\n}'
);

content = content.replace(
  '.g3-word-bank button small {\n  margin-top: 0.1rem;\n  color: #756958;\n  font-family: "Noto Sans Thai", sans-serif;\n  font-size: 0.7rem;\n}',
  `.g3-word-bank button small {
  margin-top: 0.1rem;
  color: var(--color-accent);
  font-family: "Noto Sans Thai", sans-serif;
  font-size: 0.8rem;
  font-weight: 600;
}
.g3-word-bank button em {
  font-style: normal;
  color: var(--color-text-muted);
  font-size: 0.75rem;
  margin-top: 0.1rem;
}`
);

// Update g3-sentence-track token styling
content += `\n
.g3-sentence-track > span b { font-size: 1.15rem; }
.g3-sentence-track > span small.g3-word-pinyin { color: var(--color-accent); font-weight: 600; font-size: 0.8rem; }
.g3-sentence-track > span em { font-style: normal; color: var(--color-text-muted); font-size: 0.75rem; }
`;

fs.writeFileSync(p, content, 'utf-8');
