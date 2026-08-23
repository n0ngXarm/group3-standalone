import re
import json
import glob

def parse_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    lesson_id_match = re.search(r'id:\s*[\'"](hsk[123]-l\d+)[\'"]', content)
    if not lesson_id_match:
        return []
    lesson_id = lesson_id_match.group(1)
    
    # Simple regex to find objects with hanzi inside scenes
    # Find all scenes
    scene_matches = list(re.finditer(r'id:\s*[\'"]([^"\'l]+-[^"\']+)[\'"]\s*,', content))
    
    results = []
    
    # For each scene, find its lines
    # Just split by scene ID to get content blocks
    parts = re.split(r'id:\s*[\'"](?:[^"\'l]+-[^"\']+)[\'"]\s*,', content)
    if len(parts) > 1:
        for i, scene_match in enumerate(scene_matches):
            scene_id = scene_match.group(1)
            block = parts[i+1]
            
            # extract lines array block
            lines_block_match = re.search(r'lines:\s*\[(.*?)\]\s*,?\s*(?:qte|builder|source|})', block, re.DOTALL)
            if lines_block_match:
                lines_block = lines_block_match.group(1)
                
                # find all hanzi
                line_objects = re.split(r'\}\s*,\s*\{|\{\s*', lines_block)
                line_idx = 0
                for obj in line_objects:
                    if not obj.strip(): continue
                    hanzi_m = re.search(r'hanzi:\s*[\'"](.*?)[\'"]', obj)
                    if hanzi_m:
                        pinyin_m = re.search(r'pinyin:\s*[\'"](.*?)[\'"]', obj)
                        reading_m = re.search(r'reading:\s*[\'"](.*?)[\'"]', obj)
                        th_m = re.search(r'th:\s*[\'"](.*?)[\'"]', obj)
                        
                        pinyin = pinyin_m.group(1) if pinyin_m else (reading_m.group(1) if reading_m else "")
                        th = th_m.group(1) if th_m else ""
                        
                        results.append({
                            'exerciseId': f"repeat-sentence:{lesson_id}:{scene_id}:{line_idx}",
                            'level': lesson_id.split('-')[0],
                            'lessonId': lesson_id,
                            'sceneId': scene_id,
                            'hanzi': hanzi_m.group(1),
                            'pinyin': pinyin,
                            'th': th
                        })
                        line_idx += 1
                        
    return results

all_results = []
for file in glob.glob('source/src/surfaces/group-3-8104/content/lessons/**/*.js', recursive=True):
    all_results.extend(parse_file(file))

final_res = {'hsk1': [], 'hsk2': [], 'hsk3': []}
for level in ['hsk1', 'hsk2', 'hsk3']:
    level_ex = [x for x in all_results if x['level'] == level]
    # sort by lessonId and sceneId
    level_ex.sort(key=lambda x: (x['lessonId'], x['sceneId'], x['exerciseId']))
    final_res[level] = level_ex[:10]

print(json.dumps(final_res, ensure_ascii=False, indent=2))
