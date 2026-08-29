const fs = require('fs');
const path = require('path');
const p = path.resolve('src/surfaces/group-3-8104/features/lesson/FrontMatter.jsx');
let content = fs.readFileSync(p, 'utf-8');

// Remove g3-page-source
content = content.replace(/<p className="g3-page-source">.*?<\/p>/g, '');
// Remove SourceStamp import
content = content.replace(/, SourceStamp /g, ' ');

fs.writeFileSync(p, content, 'utf-8');
