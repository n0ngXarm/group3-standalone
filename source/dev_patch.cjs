const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src/surfaces/group-3-8104/Group3App.jsx');
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('LearningSummary')) {
  content = content.replace('import { COPY }', `import { LearningSummary, DEMO_SUMMARY_DATA } from "./features/learning-summary/index.js";\nimport { COPY }`);
}

if (!content.includes('summary-dev')) {
  content = content.replace(
    '<div id="g3-main" tabIndex="-1" aria-busy={routeNeedsLesson && lessonStatus === "loading" ? "true" : undefined}>\n        {mainSuspense}\n      </div>',
    `<div id="g3-main" tabIndex="-1">
        {new URLSearchParams(window.location.search).get("summary-dev") ? (
          <LearningSummary 
            language={language} 
            data={{ ...DEMO_SUMMARY_DATA, hskLevel: new URLSearchParams(window.location.search).get("summary-dev") }}
            onHome={goHome}
            onRetry={() => {}}
          />
        ) : mainSuspense}
      </div>`
  );
}

fs.writeFileSync(file, content);
