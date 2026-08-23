const fs = require('fs');
const file = 'source/src/surfaces/group-3-8104/features/practice/exercises/FreeSpeakingExercise.jsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('const [sessionResults, setSessionResults] = useState([])')) {
  content = content.replace(
    /const \[result, setResult\] = useState\(null\);/,
    `const [result, setResult] = useState(null);\n  const [sessionResults, setSessionResults] = useState([]);`
  );

  content = content.replace(
    /setPhase\("result"\);/g,
    `setSessionResults(prev => [...prev, evalResult]);\n    setPhase("result");`
  );

  // We need to capture the evalResult. Let's see how setResult is called.
  // It's called like:
  // if (!capabilities...) { setResult({status: "self-review"}) }
  // else { setResult(evaluate...) }
  content = content.replace(
    /if \(!capabilities\.speechRecognition\) \{\s*setResult\(\{ status: "self-review" \}\);\s*\} else \{\s*setResult\(evaluateFreeSpeakingResponse\(\{\s*durationMs,\s*expectedConcepts: current\.expectedConcepts,\s*transcript: recognized,\s*\}\)\);\s*\}/,
    `let evalResult = null;
    if (!capabilities.speechRecognition) {
      evalResult = { status: "self-review" };
    } else {
      evalResult = evaluateFreeSpeakingResponse({
        durationMs,
        expectedConcepts: current.expectedConcepts,
        transcript: recognized,
      });
    }
    setResult(evalResult);`
  );

  content = content.replace(
    /setCompletedCount\(0\);/,
    `setCompletedCount(0);\n    setSessionResults([]);`
  );
  
  // Add import for sessionStore
  content = content.replace(
    /import \{ PracticeExerciseShell \} from ".\/PracticeExerciseShell.jsx";/,
    `import { PracticeExerciseShell } from "./PracticeExerciseShell.jsx";\nimport { savePracticeResult } from "../sessionStore.js";`
  );
  
  // Save when phase === completed
  content = content.replace(
    /if \(phase === "completed"\) \{/,
    `if (phase === "completed") {
    savePracticeResult(level, exerciseType, sessionResults);`
  );

  // Add the summary action button
  content = content.replace(
    /<button className="is-secondary" type="button" onClick=\{.*?\}>\{text\.backToPractice\}<\/button>/,
    `<button className="is-secondary" type="button" onClick={() => navigate(practicePath(level))}>{text.backToPractice}</button>
<button className="g3-practice-primary" type="button" onClick={() => navigate(\`/home/\${level}/practice/summary/\`)}>{text.practiceSummary || "สรุปผลการฝึก"}</button>`
  );

  fs.writeFileSync(file, content);
}
