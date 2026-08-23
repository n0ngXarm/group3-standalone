const fs = require('fs');
const path = require('path');
const p = path.resolve('src/surfaces/group-3-8104/shared/components/StoryLayout.jsx');
let content = fs.readFileSync(p, 'utf-8');

// Remove SourceStamp function completely
content = content.replace(/export function SourceStamp\([\s\S]*?\n\}\n\n/g, '');

// Update StoryFooter
content = content.replace(
  /<small>新HSK教程 1–3 · New HSK Course 1–3 · 48 Lessons<\/small>/g,
  ''
);

content = content.replace(
  /<small>\{source\.title\} · \{source\.lesson\} · pp\. \{source\.printedPages\} · PDF \{source\.pdfPages\}<\/small>/g,
  ''
);

fs.writeFileSync(p, content, 'utf-8');
