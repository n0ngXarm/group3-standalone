const fs = require('fs');
const path = require('path');
const p = path.resolve('src/surfaces/group-3-8104/shared/components/StoryLayout.jsx');
let content = fs.readFileSync(p, 'utf-8');

content = content.replace(/currentSection = "overview"/g, 'currentSection = "contents"');
content = content.replace(/currentSection === "reader" \? "overview" : currentSection/g, 'currentSection === "reader" ? "contents" : currentSection');

fs.writeFileSync(p, content, 'utf-8');
