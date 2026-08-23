const fs = require('fs');
const file = 'source/src/surfaces/group-3-8104/routing/routes.js';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /export function practicePath\(level\) {/,
  `export function practiceSummaryPath(level) {
  return LEVELS.has(level) ? \`/home/\${level}/practice/summary/\` : "/home/levels/";
}

export function practicePath(level) {`
);

content = content.replace(
  /if \(route\.name === "practice-exercise"\) return practiceExercisePath\(route\.level, route\.exerciseType\);/,
  `if (route.name === "practice-exercise") return practiceExercisePath(route.level, route.exerciseType);
  if (route.name === "practice-summary") return practiceSummaryPath(route.level);`
);

content = content.replace(
  /if \(parts\[2\] === "practice"\) {/,
  `if (parts[2] === "practice") {
    if (parts[3] === "summary") {
      return { level, name: "practice-summary" };
    }`
);

fs.writeFileSync(file, content);
