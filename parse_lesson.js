const fs = require('fs');
const glob = require('glob');

function extractObject(fileContent) {
    let js = fileContent.replace(/import .*?from .*?;/g, '');
    js = js.replace(/export const [A-Z0-9_]+ = /g, 'return ');
    js = `(function() { ${js} })()`;
    try {
        return eval(js);
    } catch (e) {
        console.error(e.message);
        return null;
    }
}

const files = glob.sync('source/src/surfaces/group-3-8104/content/lessons/**/*.js');
const all = { hsk1: [], hsk2: [], hsk3: [] };

for (const file of files) {
    if (!file.endsWith('content.js')) continue;
    const content = fs.readFileSync(file, 'utf8');
    const lesson = extractObject(content);
    if (!lesson) continue;
    const level = lesson.id.split('-')[0];
    
    for (const scene of lesson.scenes || []) {
        if (!scene.lines) continue;
        for (let i = 0; i < scene.lines.length; i++) {
            const line = scene.lines[i];
            if (line.hanzi) {
                all[level].push({
                    exerciseId: `repeat-sentence:${lesson.id}:${scene.id}:${i}`,
                    level,
                    lessonId: lesson.id,
                    sceneId: scene.id,
                    hanzi: line.hanzi,
                    pinyin: line.pinyin || line.reading || "",
                    th: line.th || ""
                });
            }
        }
    }
}

for (const level of ['hsk1', 'hsk2', 'hsk3']) {
    all[level] = all[level].slice(0, 10);
}

fs.writeFileSync('sentences.json', JSON.stringify(all, null, 2));
