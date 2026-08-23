const fs = require('fs');
const file = 'source/src/surfaces/group-3-8104/Group3App.jsx';
let content = fs.readFileSync(file, 'utf8');

// The first patch failed to insert the component because the regex didn't match.
if (!content.includes('function PracticeSummaryPage')) {
  const insertIndex = content.indexOf('export function Group3App');
  
  const componentAndImports = `import { LearningSummary } from "./features/learning-summary/LearningSummary.jsx";
import { createLearningSummary } from "./features/learning-summary/summaryModel.js";
import { getPracticeResults } from "./features/practice/sessionStore.js";
import { levelPath, practicePath } from "./routing/routes.js";

function PracticeSummaryPage({ language, level, navigate }) {
  const results = getPracticeResults(level);
  const data = createLearningSummary({
    hskLevel: level,
    repeatResult: results["repeat-sentence"] || [],
    imageResult: results["image-description"] || [],
    questionResult: results["question-response"] || [],
  });
  return <LearningSummary language={language} data={data} onRetry={() => navigate(practicePath(level))} onHome={() => navigate(levelPath(level))} />;
}

`;

  content = content.slice(0, insertIndex) + componentAndImports + content.slice(insertIndex);
  fs.writeFileSync(file, content);
}
