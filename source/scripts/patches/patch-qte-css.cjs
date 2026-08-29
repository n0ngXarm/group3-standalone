const fs = require('fs');
const path = require('path');
const p = path.resolve('src/surfaces/group-3-8104/styles/challenges.css');
let content = fs.readFileSync(p, 'utf-8');

const oldCss = `.g3-qte-option-copy strong,
.g3-qte-option-copy small,
.g3-qte-option-copy b { display: block; }
.g3-qte-option-copy { color: var(--color-text-primary); }
.g3-qte-option-copy small { margin-top: 0.15rem; color: var(--color-text-muted); font-size: 0.84rem; font-weight: 600; }
.g3-qte-option-copy small b { display: inline; margin-right: 0.4rem; color: var(--color-text-primary); font-family: "Noto Serif SC", serif; font-size: 0.96rem; font-weight: 800; }`;

const newCss = `.g3-qte-option-copy { color: var(--color-text-primary); text-align: left; }
.g3-qte-option-copy strong { display: block; font-family: "Noto Serif SC", serif; font-size: 1.15rem; }
.g3-qte-option-copy small.g3-word-pinyin { display: block; margin-top: 0.1rem; color: var(--color-accent); font-size: 0.84rem; font-weight: 600; font-family: "Noto Sans Thai", sans-serif; }
.g3-qte-option-copy em { display: block; margin-top: 0.15rem; color: var(--color-text-muted); font-size: 0.75rem; font-style: normal; font-family: "Noto Sans Thai", sans-serif; }`;

content = content.replace(oldCss, newCss);

fs.writeFileSync(p, content, 'utf-8');
