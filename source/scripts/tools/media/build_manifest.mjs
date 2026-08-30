import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { GROUP3_LESSONS } from '../../../src/surfaces/group-3-8104/content/registry.js';

async function main() {
  const manifest = [];
  let count = 0;
  
  for (const meta of GROUP3_LESSONS) {
    let lesson;
    if (typeof meta.load === 'function') {
      const mod = await meta.load();
      lesson = Object.values(mod).find(x => x && x.id === meta.id);
    } else {
      lesson = meta;
    }
    
    if (!lesson || !lesson.scenes) {
       console.log('Skipping', meta.id);
       continue;
    }
    
    for (const scene of lesson.scenes) {
      if (!scene.dialogue) continue;
      
      let lineIndex = 0;
      for (const line of scene.dialogue) {
        lineIndex++;
        const paddedIndex = String(lineIndex).padStart(2, '0');
        const fileName = `line-${paddedIndex}.mp3`;
        
        const folderId = meta.id.replace(/hsk[123]-l/, 'lesson-0');
        const canonicalAudioPath = `public/assets/group3/lessons/${meta.level}/${folderId}/audio/${scene.id}/${fileName}`;
        
        const fullPath = path.resolve(canonicalAudioPath);
        let oldSha256 = null;
        if (fs.existsSync(fullPath)) {
          const buffer = fs.readFileSync(fullPath);
          oldSha256 = crypto.createHash('sha256').update(buffer).digest('hex');
        }
        
        manifest.push({
          level: meta.level,
          lessonId: meta.id,
          sceneId: scene.id,
          lineIndex: paddedIndex,
          speakerId: line.speakerId,
          speakerName: line.speakerName,
          expectedVoiceProfile: line.speakerId,
          hanzi: line.zh,
          pinyin: line.pinyin,
          thai: line.th,
          english: line.en,
          canonicalAudioPath,
          oldSha256
        });
        count++;
      }
    }
  }
  
  fs.writeFileSync('scripts/tools/media/regeneration_manifest.json', JSON.stringify(manifest, null, 2));
  console.log(`Wrote ${count} lines to regeneration_manifest.json`);
}
main();
