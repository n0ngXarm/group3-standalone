const fs = require('fs');
const path = require('path');
const p = path.resolve('src/surfaces/group-3-8104/features/reader/challenges/Challenges.jsx');
let content = fs.readFileSync(p, 'utf-8');

const oldQteOption = `<span className="g3-qte-option-copy">
                  <strong>{option.th}</strong>
                  <small><b>{option.zh}</b>{option.pinyin}</small>
                </span>`;

const newQteOption = `<span className="g3-qte-option-copy">
                  <strong>{option.zh}</strong>
                  <small className="g3-word-pinyin">{option.pinyin}</small>
                  {option.th && <em>{option.th}</em>}
                </span>`;

content = content.replace(oldQteOption, newQteOption);

fs.writeFileSync(p, content, 'utf-8');
