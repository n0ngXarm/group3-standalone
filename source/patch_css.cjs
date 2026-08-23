const fs = require('fs');
const path = require('path');
const p = path.resolve('src/surfaces/group-3-8104/styles/challenges.css');
let content = fs.readFileSync(p, 'utf-8');

// Use display: flex, flex-direction: column for .g3-challenge
content = content.replace(
  '.g3-challenge {',
  '.g3-challenge {\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n  padding-bottom: 20px;'
);

// We should remove some explicit paddings that are inconsistent
content = content.replace(
  'padding: 1.5rem 1.8rem 1.8rem;', // .g3-challenge > header
  'padding: 20px 22px 0;'
);
content = content.replace(
  'padding: 0 1.8rem 1.5rem;', // .g3-qte-options
  'padding: 0 22px;'
);
content = content.replace(
  'padding: 1.2rem clamp(1.3rem, 4vw, 2.5rem) 1.5rem;', // .g3-builder-controls
  'padding: 0 22px;'
);
content = content.replace(
  'padding: 0 clamp(1rem, 3vw, 1.8rem);', // .g3-word-bank
  'padding: 0 22px;'
);
content = content.replace(
  'margin: 1.5rem 1.8rem;', // .g3-sentence-track
  'margin: 0 22px;'
);
content = content.replace(
  'padding: 0 22px 14px;', // .g3-qte-support-block
  'padding: 0 22px;'
);
content = content.replace(
  'padding: 10px 22px 14px;', // .g3-qte-feedback-block
  'padding: 0 22px;'
);
content = content.replace(
  'padding: 1.5rem 1.8rem;', // .g3-challenge-result
  'padding: 0 22px;'
);
content = content.replace(
  'padding: 1.2rem 1.8rem;', // .g3-qte-restart
  'padding: 0 22px;'
);

// Fix the mobile padding overrides to just reset horizontal padding
content = content.replace(
  '.g3-challenge > header { padding: 14px 16px 12px; gap: 0.75rem; }',
  '.g3-challenge > header { padding: 16px 16px 0; gap: 0.75rem; }'
);
content = content.replace(
  '.g3-qte-options { padding: 0 16px 12px; }',
  '.g3-qte-options { padding: 0 16px; }'
);
content = content.replace(
  '.g3-challenge-result { padding: 12px 16px 14px; }',
  '.g3-challenge-result { padding: 0 16px; }'
);
content = content.replace(
  '.g3-builder-controls { padding: 12px 16px 14px; flex-wrap: wrap; justify-content: stretch; }',
  '.g3-builder-controls { padding: 0 16px; flex-wrap: wrap; justify-content: stretch; }'
);
content = content.replace(
  '.g3-qte-restart { padding: 0 16px 14px; }',
  '.g3-qte-restart { padding: 0 16px; }'
);
content = content.replace(
  '.g3-qte-support-block { padding: 0 16px 12px; }',
  '.g3-qte-support-block { padding: 0 16px; }'
);
content = content.replace(
  '.g3-qte-feedback-block { padding: 8px 16px 12px; }',
  '.g3-qte-feedback-block { padding: 0 16px; }'
);
content = content.replace(
  '.g3-word-bank { padding: 0 1rem; gap: 0.4rem; }',
  '.g3-word-bank { padding: 0 16px; gap: 0.4rem; }'
);
content = content.replace(
  '.g3-sentence-track { min-height: 5rem; margin: 0.75rem 1rem; padding: 0.6rem 0; gap: 0.4rem; }',
  '.g3-sentence-track { min-height: 5rem; margin: 0 16px; padding: 0.6rem 0; gap: 0.4rem; }'
);

// 380px media query
content = content.replace(
  '.g3-qte-support-block { padding: 0 12px 10px; }',
  '.g3-qte-support-block { padding: 0 12px; }'
);
content = content.replace(
  '.g3-qte-feedback-block { padding: 6px 12px 10px; }',
  '.g3-qte-feedback-block { padding: 0 12px; }'
);
content = content.replace(
  '.g3-challenge > header { flex-direction: column-reverse; align-items: stretch; gap: 0.5rem; padding: 12px; }',
  '.g3-challenge > header { flex-direction: column-reverse; align-items: stretch; gap: 0.5rem; padding: 12px 12px 0; }'
);
content = content.replace(
  '.g3-qte-options { padding: 0 12px 12px; gap: 0.35rem; }',
  '.g3-qte-options { padding: 0 12px; gap: 0.35rem; }'
);
content = content.replace(
  '.g3-sentence-track { margin: 12px; gap: 0.3rem; min-height: 4.5rem; }',
  '.g3-sentence-track { margin: 0 12px; gap: 0.3rem; min-height: 4.5rem; }'
);
content = content.replace(
  '.g3-word-bank { padding: 0 12px; gap: 0.3rem; }',
  '.g3-word-bank { padding: 0 12px; gap: 0.3rem; }'
);
content = content.replace(
  '.g3-builder-controls { padding: 12px; gap: 0.35rem; }',
  '.g3-builder-controls { padding: 0 12px; gap: 0.35rem; }'
);

fs.writeFileSync(p, content, 'utf-8');
