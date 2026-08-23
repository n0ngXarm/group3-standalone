const fs = require('fs');
const file = 'source/src/surfaces/group-3-8104/features/practice/exercises/RepeatSentenceExercise.jsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('savePracticeResult')) {
  content = content.replace(
    /import \{ localizedValue, percent, practiceErrorCopyKey \} from ".\/practiceUi.js";/,
    `import { localizedValue, percent, practiceErrorCopyKey } from "./practiceUi.js";\nimport { savePracticeResult } from "../sessionStore.js";\nimport { practicePath } from "../../../routing/routes.js";`
  );

  content = content.replace(
    /if \(liveSession\.phase === "completed"\) \{/,
    `if (liveSession.phase === "completed") {
    savePracticeResult(level, "repeat-sentence", liveSession);`
  );

  content = content.replace(
    /<div className="g3-practice-actions"><button className="is-secondary" type="button" onClick=\{.*?navigate.*?\}>\{text\.backToPractice\}<\/button><button type="button" onClick=\{restart\}>\{text\.practiceAgain\}<\/button><\/div>/,
    `<div className="g3-practice-actions">
  <button className="is-secondary" type="button" onClick={() => navigate(practicePath(level))}>{text.backToPractice}</button>
  <button type="button" onClick={restart}>{text.practiceAgain}</button>
  <button className="g3-practice-primary" type="button" onClick={() => navigate(\`/home/\${level}/practice/summary/\`)}>{text.practiceSummary || "สรุปผลการฝึก"}</button>
</div>`
  );

  fs.writeFileSync(file, content);
}
