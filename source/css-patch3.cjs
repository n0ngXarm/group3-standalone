const fs = require('fs');
const path = require('path');
const p = path.resolve('src/surfaces/group-3-8104/styles/challenges.css');
let content = fs.readFileSync(p, 'utf-8');

// Inside @media (max-width: 640px)
content = content.replace(
  '.g3-challenge > header { padding: 1rem; gap: 0.75rem; }',
  '.g3-challenge > header { padding: 14px 16px 12px; gap: 0.75rem; }'
);
content = content.replace(
  '.g3-qte-options { padding: 0.75rem 1rem 1.25rem; }',
  '.g3-qte-options { padding: 0 16px 12px; }'
);
content = content.replace(
  '.g3-challenge-result { padding: 1rem; }',
  '.g3-challenge-result { padding: 12px 16px 14px; }'
);
content = content.replace(
  '.g3-builder-controls { padding: 1rem; flex-wrap: wrap; justify-content: stretch; }',
  '.g3-builder-controls { padding: 12px 16px 14px; flex-wrap: wrap; justify-content: stretch; }'
);
content = content.replace(
  '.g3-qte-restart { padding: 0.75rem 1rem; }',
  '.g3-qte-restart { padding: 0 16px 14px; }'
);

// We need to do it for max-width: 380px too
content = content.replace(
  '.g3-challenge > header { flex-direction: column-reverse; align-items: stretch; gap: 0.5rem; padding: 0.75rem; }',
  '.g3-challenge > header { flex-direction: column-reverse; align-items: stretch; gap: 0.5rem; padding: 12px; }'
);
content = content.replace(
  '.g3-qte-options { padding: 0.5rem 0.75rem 0.85rem; gap: 0.35rem; }',
  '.g3-qte-options { padding: 0 12px 12px; gap: 0.35rem; }'
);
content = content.replace(
  '.g3-builder-controls { padding: 0.75rem; gap: 0.35rem; }',
  '.g3-builder-controls { padding: 12px; gap: 0.35rem; }'
);
content = content.replace(
  '.g3-sentence-track { margin: 0.5rem 0.75rem; gap: 0.3rem; min-height: 4.5rem; }',
  '.g3-sentence-track { margin: 12px; gap: 0.3rem; min-height: 4.5rem; }'
);
content = content.replace(
  '.g3-word-bank { padding: 0 0.75rem; gap: 0.3rem; }',
  '.g3-word-bank { padding: 0 12px; gap: 0.3rem; }'
);

// Add support block mobile styles inside max-width: 640px
content = content.replace(
  '@media (max-width: 640px) {',
  `@media (max-width: 640px) {
  .g3-qte-support-block { padding: 0 16px 12px; }
  .g3-qte-feedback-block { padding: 8px 16px 12px; }`
);

// Support block mobile inside 380px
content = content.replace(
  '@media (max-width: 380px) {',
  `@media (max-width: 380px) {
  .g3-qte-support-block { padding: 0 12px 10px; }
  .g3-qte-feedback-block { padding: 6px 12px 10px; }`
);

fs.writeFileSync(p, content, 'utf-8');
