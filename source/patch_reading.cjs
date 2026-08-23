const fs = require('fs');
const path = require('path');
const p = path.resolve('src/surfaces/group-3-8104/features/reader/ReadingTheatre.jsx');
let content = fs.readFileSync(p, 'utf-8');

// Remove import gamesPath
content = content.replace(
  'import { gamesPath, lessonPath, levelPath } from "../../routing/routes.js";',
  'import { lessonPath, levelPath } from "../../routing/routes.js";'
);

// Replace the end scene buttons
const oldButtons = `<button className="is-game" type="button" onClick={() => navigate(gamesPath(lesson))}>🎮 {text.bonusGames}</button>
                        <button className="is-primary" data-g3-scene-complete-primary type="button" onClick={() => navigate(lessonPath(lesson, "overview"))}>{text.back} →</button>`;
const newButtons = `<button type="button" onClick={() => navigate(lessonPath(lesson, "overview"))}>{text.back}</button>
                        <button type="button" onClick={() => navigate(levelPath(lesson.hsk))}>{text.hskLevel || "เลือกระดับ HSK"}</button>`;
content = content.replace(oldButtons, newButtons);

fs.writeFileSync(p, content, 'utf-8');
