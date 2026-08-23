const fs = require('fs');
const path = require('path');
const p = path.resolve('src/surfaces/group-3-8104/features/reader/challenges/Challenges.jsx');
let content = fs.readFileSync(p, 'utf-8');
content = content.replace(
  /<p>\s*<span>\{text\.evidence\}<\/span>\s*\{status === "correct" \? challenge\.answer\.join\(""\) : challenge\.evidence\}\s*<\/p>\s*<p>\s*<span>\{text\.evidence\}<\/span>\s*<small>\{challenge\.translationTh\}<\/small>\s*<\/p>/m,
  '<p><span>{text.evidence}</span>{status === "correct" ? challenge.answer.join("") : challenge.evidence}{status === "correct" && <small>{challenge.translationTh}</small>}</p>'
);
fs.writeFileSync(p, content, 'utf-8');
