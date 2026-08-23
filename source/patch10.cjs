const fs = require('fs');
const path = require('path');
const p = path.resolve('src/surfaces/group-3-8104/features/reader/challenges/Challenges.jsx');
let content = fs.readFileSync(p, 'utf-8');

content = content.replace(
  /\{\s*\}\s*<\/div>\s*\{\s*wrongAttempts > 0 && status === "active"/g,
  '{wrongAttempts > 0 && status === "active"'
);

// Actually, I can just replace `\n        </div>\n\n        \n\n        \n        {wrongAttempts > 0 && status === "active"`
content = content.replace(
  '          </div>\n        )}\n        \n        \n        </div>\n\n        \n\n        \n        {wrongAttempts > 0 && status === "active" && (',
  '          </div>\n        )}\n        {wrongAttempts > 0 && status === "active" && ('
);
fs.writeFileSync(p, content, 'utf-8');
