const fs = require('fs');
const path = require('path');

// Update index.js
const idxPath = path.resolve('src/surfaces/group-3-8104/features/lesson/index.js');
let idxContent = fs.readFileSync(idxPath, 'utf-8');
idxContent = idxContent.replace(/PrefacePage, /g, '');
fs.writeFileSync(idxPath, idxContent, 'utf-8');

// Update FrontMatter.jsx
const p = path.resolve('src/surfaces/group-3-8104/features/lesson/FrontMatter.jsx');
let content = fs.readFileSync(p, 'utf-8');

// Use regex to remove the PrefacePage function completely
// Find `export function PrefacePage` and end at the next `export function ContentsPage`
content = content.replace(/export function PrefacePage[\s\S]*?(?=export function ContentsPage)/, '');

// Update BookPageControls in ContentsPage
content = content.replace(
  /backPath=\{lessonPath\(lesson, "preface"\)\} backLabel=\{text.prefaceTitle\}/,
  'backPath="/home/" backLabel={text.home}'
);

// Update targetPath in ContentsPage to not use "overview"
content = content.replace(
  /item.route \? lessonPath\(lesson, "overview"\) : null/,
  'null' // Or we can route to contents, but it's already contents! Just make it null so it's not clickable if it's the current page
);

fs.writeFileSync(p, content, 'utf-8');
