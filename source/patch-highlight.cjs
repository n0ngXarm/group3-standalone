const fs = require('fs');
const path = require('path');
const p = path.resolve('src/surfaces/group-3-8104/features/reader/challenges/Challenges.jsx');
let content = fs.readFileSync(p, 'utf-8');

// Replace the button inside .g3-word-bank in SentenceChallenge
const oldBtn = '<button type="button" key={token.id} onClick={() => add(index)} disabled={selected.includes(index) || status === "correct" || (wrongAttempts >= 6 && builtSentence.answer[sentence.length] && token.id === builtSentence.answer[sentence.length].id && status === "active" && false)}>';

const newBtn = '<button type="button" key={token.id} onClick={() => add(index)} disabled={selected.includes(index) || status === "correct"} className={wrongAttempts >= 6 && builtSentence.answer[sentence.length] && token.id === builtSentence.answer[sentence.length].id && status === "active" ? "is-hint-highlight" : ""}>';

content = content.replace(oldBtn, newBtn);
fs.writeFileSync(p, content, 'utf-8');
