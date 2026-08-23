import json
with open('sentences.json') as f:
    data = json.load(f)
for level in ['hsk1', 'hsk2', 'hsk3']:
    print(f"=== {level.upper()} ===")
    for item in data[level]:
        print(f"{item['exerciseId']} | {item['hanzi']} | {item['translations']['en']}")
