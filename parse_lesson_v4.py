import glob
import re
import json

exercises = {'hsk1': [], 'hsk2': [], 'hsk3': []}

for file in glob.glob('source/src/surfaces/group-3-8104/content/lessons/**/*.js', recursive=True):
    if not file.endswith('content.js'): continue
    
    with open(file, 'r', encoding='utf-8') as f:
        lines = f.readlines()
        
    lesson_id = None
    scene_id = None
    level = None
    line_idx = 0
    
    current_hanzi = None
    current_pinyin = None
    current_th = None
    
    for line in lines:
        lid_m = re.search(r'id:\s*[\'"](hsk\d-l\d+)[\'"]', line)
        if lid_m:
            lesson_id = lid_m.group(1)
            level = lesson_id.split('-')[0]
            continue
            
        sid_m = re.search(r'id:\s*[\'"](hsk\d-l\d+-s\d+)[\'"]', line)
        if sid_m:
            scene_id = sid_m.group(1)
            line_idx = 0
            continue
            
        if not lesson_id or not scene_id:
            continue
            
        hanzi_m = re.search(r'hanzi:\s*[\'"](.*?)[\'"]', line)
        if hanzi_m:
            current_hanzi = hanzi_m.group(1)
            
        pinyin_m = re.search(r'pinyin:\s*[\'"](.*?)[\'"]', line)
        if pinyin_m:
            current_pinyin = pinyin_m.group(1)
            
        reading_m = re.search(r'reading:\s*[\'"](.*?)[\'"]', line)
        if reading_m and not current_pinyin:
            current_pinyin = reading_m.group(1)
            
        th_m = re.search(r'th:\s*[\'"](.*?)[\'"]', line)
        if th_m:
            current_th = th_m.group(1)
            
        # check if object ended
        if current_hanzi and re.search(r'\},', line) or (current_hanzi and current_pinyin and current_th and "visual:" in line):
            # actually just wait until we see "visual" or "role"
            pass
            
        if "sourceRef:" in line and current_hanzi:
            exercises[level].append({
                'exerciseId': f"repeat-sentence:{lesson_id}:{scene_id}:{line_idx}",
                'level': level,
                'lessonId': lesson_id,
                'sceneId': scene_id,
                'hanzi': current_hanzi,
                'pinyin': current_pinyin,
                'th': current_th
            })
            line_idx += 1
            current_hanzi = None
            current_pinyin = None
            current_th = None

# Limit to 10
for lvl in exercises:
    exercises[lvl] = exercises[lvl][:10]

print(json.dumps(exercises, ensure_ascii=False, indent=2))
