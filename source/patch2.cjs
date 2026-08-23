const fs = require('fs');
const path = require('path');
const p = path.resolve('src/surfaces/group-3-8104/features/reader/challenges/Challenges.jsx');
let content = fs.readFileSync(p, 'utf-8');

// Remove wrongAttempts rendering anywhere it exists right now
content = content.replace(/\{wrongAttempts > 0 && status === "active" && \([\s\S]*?\}\s*\)\s*\}/g, '');

fs.writeFileSync(p, content, 'utf-8');
