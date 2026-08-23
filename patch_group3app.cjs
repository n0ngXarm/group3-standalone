const fs = require('fs');
const file = 'source/src/surfaces/group-3-8104/Group3App.jsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('PracticeSummaryPage')) {
  // Add the wrapper component component
  content = content.replace(
    /import \{ PracticeHub \} from ".\/features\/practice\/PracticeHub.jsx";/,
    `import { PracticeHub } from "./features/practice/PracticeHub.jsx";\nimport { LearningSummary } from "./features/learning-summary/LearningSummary.jsx";\nimport { createLearningSummary } from "./features/learning-summary/summaryModel.js";\nimport { getPracticeResults } from "./features/practice/sessionStore.js";\nimport { levelPath } from "./routing/routes.js";\n\nfunction PracticeSummaryPage({ language, level, navigate }) {\n  const results = getPracticeResults(level);\n  const data = createLearningSummary({\n    hskLevel: level,\n    repeatResult: results["repeat-sentence"] || [],\n    imageResult: results["image-description"] || [],\n    questionResult: results["question-response"] || [],\n  });\n  return <LearningSummary language={language} data={data} onRetry={() => navigate(\`/home/\${level}/practice/\`)} onHome={() => navigate(levelPath(level))} />;\n}`
  );

  // Add to content router
  content = content.replace(
    /if \(route\.name === "practice"\) return <PracticeHub language=\{language\} level=\{route\.level\} navigate=\{navigate\} \/>;/,
    `if (route.name === "practice") return <PracticeHub language={language} level={route.level} navigate={navigate} />;\n    if (route.name === "practice-summary") return <PracticeSummaryPage language={language} level={route.level} navigate={navigate} />;`
  );

  // Exclude from footer
  content = content.replace(
    /route\.name !== "practice" && route\.name !== "practice-exercise"/,
    `route.name !== "practice" && route.name !== "practice-exercise" && route.name !== "practice-summary"`
  );

  // Set document title
  content = content.replace(
    /route\.name === "practice" \|\| route\.name === "practice-exercise"/,
    `route.name === "practice" || route.name === "practice-exercise" || route.name === "practice-summary"`
  );

  fs.writeFileSync(file, content);
}
