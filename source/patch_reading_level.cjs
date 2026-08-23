const fs = require('fs');
const path = require('path');
const p = path.resolve('src/surfaces/group-3-8104/features/reader/ReadingTheatre.jsx');
let content = fs.readFileSync(p, 'utf-8');

content = content.replace(
  '<SentenceChallenge challenge={challenge.data} language={language} onResolve={resolveChallenge} onRestart={restartScene} sourceLine={currentLine} />',
  '<SentenceChallenge challenge={challenge.data} language={language} level={lesson.level} onResolve={resolveChallenge} onRestart={restartScene} sourceLine={currentLine} />'
);

fs.writeFileSync(p, content, 'utf-8');
