import os
import re
import json
import glob
import ast

def process_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()
    
    # We want to extract lines from scenes
    # Find all objects that have hanzi, pinyin, and en/th
    # It's easier to find hanzi: "...", pinyin: "...", en: "...", th: "..."
    # But wait, we need scene id and lesson id.
    
    # Let's extract the lesson id
    lesson_id_match = re.search(r'id:\s*[\'"]([^\'"]+)[\'"]', content)
    if not lesson_id_match:
        return []
    lesson_id = lesson_id_match.group(1)
    level = lesson_id.split('-')[0]
    
    # split into scenes
    scenes = re.split(r'id:\s*[\'"]([^\'"]+)[\'"]', content)
    # scenes[0] is everything before the first scene id
    # scenes[1] is the first scene id, scenes[2] is its content
    
    exercises = []
    
    for i in range(1, len(scenes), 2):
        scene_id = scenes[i]
        # Ignore lesson id if it matched
        if scene_id == lesson_id:
            continue
        scene_content = scenes[i+1]
        
        # Now find lines
        lines_match = re.search(r'lines:\s*\[(.*?)\]\s*,', scene_content, re.DOTALL)
        if not lines_match:
            lines_match = re.search(r'lines:\s*\[(.*?)\]', scene_content, re.DOTALL)
            
        if lines_match:
            lines_content = lines_match.group(1)
            # Find all objects in lines
            line_objects = re.findall(r'\{(.*?)\}', lines_content, re.DOTALL)
            for line_idx, line_obj in enumerate(line_objects):
                hanzi = re.search(r'hanzi:\s*[\'"](.*?)[\'"]', line_obj)
                pinyin = re.search(r'pinyin:\s*[\'"](.*?)[\'"]', line_obj)
                if not pinyin:
                    pinyin = re.search(r'reading:\s*[\'"](.*?)[\'"]', line_obj)
                th = re.search(r'th:\s*[\'"](.*?)[\'"]', line_obj)
                en = re.search(r'en:\s*[\'"](.*?)[\'"]', line_obj)
                
                if hanzi:
                    exercises.append({
                        'exerciseId': f'repeat-sentence:{lesson_id}:{scene_id}:{line_idx}',
                        'level': level,
                        'lessonId': lesson_id,
                        'sceneId': scene_id,
                        'hanzi': hanzi.group(1),
                        'pinyin': pinyin.group(1) if pinyin else "",
                        'th': th.group(1) if th else "",
                    })
    return exercises

results = []
for file in glob.glob('source/src/surfaces/group-3-8104/content/lessons/**/*.js', recursive=True):
    if file.endswith('content.js'):
        results.extend(process_file(file))

# Take up to 10 per level
final_res = {'hsk1': [], 'hsk2': [], 'hsk3': []}
for level in ['hsk1', 'hsk2', 'hsk3']:
    level_ex = [x for x in results if x['level'] == level]
    final_res[level] = level_ex[:10]

print(json.dumps(final_res, ensure_ascii=False, indent=2))
