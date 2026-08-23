const fs = require('fs');
const path = require('path');
const p = path.resolve('src/surfaces/group-3-8104/features/reader/ReadingTheatre.jsx');
let content = fs.readFileSync(p, 'utf-8');
content = content.replace(/\{rolePickerOpen && !completed && \([\s\S]*?<\/Suspense>\s*\)\}/g, '');
fs.writeFileSync(p, content, 'utf-8');
