const fs = require('fs');
const path = require('path');
const p = path.resolve('src/surfaces/group-3-8104/features/reader/challenges/Challenges.jsx');
let content = fs.readFileSync(p, 'utf-8');

content = content.replace(/const promptPinyin = \(\!challenge\.prompt\?\.zh \|\| isInstruction\) \? genericPromptPinyin : "";/, 'const promptPinyin = (!challenge.prompt?.zh || isInstruction) ? genericPromptPinyin : (challenge.prompt.pinyin || "");');

fs.writeFileSync(p, content, 'utf-8');
