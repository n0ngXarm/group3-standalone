const fs = require('fs');
const path = require('path');
const p = path.resolve('src/surfaces/group-3-8104/features/reader/ReadingTheatre.jsx');
let content = fs.readFileSync(p, 'utf-8');

// Remove SourceStamp import
content = content.replace(/import \{ SourceStamp \} from "\.\.\/\.\.\/shared\/components\/index\.js";\n/g, '');
// Wait, ReadingTheatre.jsx might import other things from index.js
// Let's just remove `SourceStamp` from the import list if it's there.
content = content.replace(/, SourceStamp /g, ' ');
content = content.replace(/SourceStamp, /g, '');
content = content.replace(/SourceStamp /g, '');

// Remove <SourceStamp compact lesson={lesson} />
content = content.replace(/<SourceStamp compact lesson=\{lesson\} \/>/g, '');

fs.writeFileSync(p, content, 'utf-8');
