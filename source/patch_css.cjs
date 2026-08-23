const fs = require('fs');
const path = require('path');
const p = path.resolve('src/surfaces/group-3-8104/styles/challenges.css');
let content = fs.readFileSync(p, 'utf-8');

content = content.replace(
  '.g3-qte-options button:hover:not(:disabled) {',
  `.g3-qte-options button:disabled {
  opacity: 0.9;
  cursor: default;
}
.g3-qte-options button:disabled.is-wrong-hint {
  opacity: 0.35;
}
.g3-qte-options button:hover:not(:disabled) {`
);

fs.writeFileSync(p, content, 'utf-8');
