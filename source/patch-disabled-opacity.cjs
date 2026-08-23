const fs = require('fs');
const path = require('path');
const p = path.resolve('src/surfaces/group-3-8104/styles/challenges.css');
let content = fs.readFileSync(p, 'utf-8');

content = content.replace(
  '.g3-word-bank button:disabled {\n  opacity: 0.6;',
  '.g3-word-bank button:disabled {\n  opacity: 0.85;\n  filter: grayscale(0.5);'
);

fs.writeFileSync(p, content, 'utf-8');
