const fs = require('fs');
const path = require('path');
const p = path.resolve('src/surfaces/group-3-8104/styles/challenges.css');
let content = fs.readFileSync(p, 'utf-8');

content = content.replace(
  'padding: 1.5rem clamp(1.5rem, 4vw, 2.5rem) 1.8rem;',
  'padding: 14px 22px 18px;'
);

fs.writeFileSync(p, content, 'utf-8');
