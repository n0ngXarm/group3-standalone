const fs = require('fs');
const path = require('path');
const p = path.resolve('src/surfaces/group-3-8104/features/catalog/StoryExperience.jsx');
let content = fs.readFileSync(p, 'utf-8');

// Remove SourceStamp import
content = content.replace(/import \{ SourceStamp \} from "\.\.\/\.\.\/shared\/components\/index\.js";\n/g, '');

// Remove <SourceStamp lesson={lesson} />
content = content.replace(/<SourceStamp lesson=\{lesson\} \/>/g, '');

fs.writeFileSync(p, content, 'utf-8');
