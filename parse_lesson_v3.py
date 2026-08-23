import glob
import re
import json

exercises = {'hsk1': [], 'hsk2': [], 'hsk3': []}

for file in glob.glob('source/src/surfaces/group-3-8104/content/lessons/**/*.js', recursive=True):
    if not file.endswith('content.js'): continue
    
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    lesson_id_m = re.search(r'id:\s*[\'"](hsk\d-l\d+)[\'"]', content)
    if not lesson_id_m: continue
    lesson_id = lesson_id_m.group(1)
    level = lesson_id.split('-')[0]
    
    # find all scenes
    for scene_match in re.finditer(r'id:\s*[\'"](hsk\d-l\d+-s\d+)[\'"]', content):
        scene_id = scene_match.group(1)
        # find the block between this scene and the next
        start_idx = scene_match.start()
        next_scene = re.search(r'id:\s*[\'"]hsk\d-l\d+-s\d+[\'"]', content[start_idx+1:])
        end_idx = start_idx + 1 + next_scene.start() if next_scene else len(content)
        scene_content = content[start_idx:end_idx]
        
        # inside scene, find lines
        lines_block_m = re.search(r'lines:\s*\[(.*?)\]\s*,?\s*(?:qte|builder|source|})', scene_content, re.DOTALL)
        if not lines_block_m:
            lines_block_m = re.search(r'lines:\s*\[(.*)', scene_content, re.DOTALL) # fallback
            if not lines_block_m: continue
            
        lines_block = lines_block_m.group(1)
        
        line_idx = 0
        for line_m in re.finditer(r'hanzi:\s*[\'"](.*?)[\'"]', lines_block):
            hanzi = line_m.group(1)
            # context around this hanzi
            start_context = max(0, line_m.start() - 100)
            end_context = min(len(lines_block), line_m.end() + 100)
            ctx = lines_block[start_context:end_context]
            
            pinyin_m = re.search(r'pinyin:\s*[\'"](.*?)[\'"]', ctx)
            reading_m = re.search(r'reading:\s*[\'"](.*?)[\'"]', ctx)
            pinyin = pinyin_m.group(1) if pinyin_m else (reading_m.group(1) if reading_m else "")
            
            th_m = re.search(r'th:\s*[\'"](.*?)[\'"]', ctx)
            th = th_m.group(1) if th_m else ""
            
            exercises[level].append({
                'exerciseId': f"repeat-sentence:{lesson_id}:{scene_id}:{line_idx}",
                'level': level,
                'lessonId': lesson_id,
                'sceneId': scene_id,
                'hanzi': hanzi,
                'pinyin': pinyin,
                'th': th
            })
            line_idx += 1

# Limit to 10
for lvl in exercises:
    exercises[lvl] = exercises[lvl][:10]

print(json.dumps(exercises, ensure_ascii=False, indent=2))
