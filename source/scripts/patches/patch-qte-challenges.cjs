const fs = require('fs');
const path = require('path');
const p = path.resolve('src/surfaces/group-3-8104/features/reader/challenges/Challenges.jsx');
let content = fs.readFileSync(p, 'utf-8');

// We will replace the entire QteChallenge and SentenceChallenge functions.
