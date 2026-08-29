const fs = require('fs');
const path = require('path');

function replaceFile(p, oldText, newText) {
  const file = path.resolve('src/surfaces/group-3-8104', p);
  let content = fs.readFileSync(file, 'utf-8');
  content = content.replace(new RegExp(oldText, 'g'), newText);
  fs.writeFileSync(file, content, 'utf-8');
}

replaceFile('routing/routes.js', 'return lessonPath\\(lesson, "overview"\\);', 'return lessonPath(lesson, "contents");');

replaceFile('features/reader/ReadingTheatre.jsx', 'lessonPath\\(lesson, "overview"\\)', 'lessonPath(lesson, "contents")');
replaceFile('features/catalog/StoryExperience.jsx', 'lessonPath\\(lesson, "overview"\\)', 'lessonPath(lesson, "contents")');

// Replace routes in content.js files
const lessons = [
  'hsk1/lesson-01/content.js', 'hsk1/lesson-02/content.js', 'hsk1/lesson-03/content.js',
  'hsk2/lesson-01/content.js', 'hsk2/lesson-02/content.js',
  'hsk3/lesson-01/content.js', 'hsk3/lesson-02/content.js'
];
lessons.forEach(l => {
  replaceFile('content/lessons/' + l, '/overview/"', '/contents/"');
});

