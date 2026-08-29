const fs = require('fs');
const path = require('path');
const p = path.resolve('src/surfaces/group-3-8104/styles/challenges.css');
let content = fs.readFileSync(p, 'utf-8');

// Challenge container
content = content.replace(
  'width: min(100%, 48rem);',
  'width: min(100%, 760px);' // max-width 760px, padding handles 100vw - 32px roughly
);

// Header padding
content = content.replace(
  'padding: clamp(1rem, 3vw, 1.8rem);',
  'padding: 18px 22px 14px;' // outer padding 18-22px, bottom 14px
);

// QTE options padding
content = content.replace(
  'padding: 0.8rem clamp(1rem, 3vw, 1.8rem) 1.5rem;',
  'padding: 0 22px 14px;'
);

// Challenge result (actions area) padding
content = content.replace(
  'padding: 1.2rem clamp(1.3rem, 4vw, 2.5rem) 1.6rem;',
  'padding: 14px 22px 18px;'
);

// Add new classes for QTE Support block and Hint text
content += `\n
.g3-qte-support-block {
  padding: 0 22px 14px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  text-align: center;
}
.g3-qte-support-block strong {
  font-size: 1.4rem;
  color: var(--color-text-primary);
  font-family: var(--font-display);
}
.g3-qte-support-block small {
  font-size: 0.95rem;
  color: var(--color-accent);
  font-weight: 700;
}
.g3-qte-support-block em {
  font-size: 0.85rem;
  color: var(--color-text-muted);
  font-style: normal;
}

.g3-qte-feedback-block {
  padding: 10px 22px 14px;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.g3-qte-wrong-count {
  color: var(--color-error);
  font-weight: 600;
  font-size: 0.9rem;
}
.g3-qte-hint-text {
  color: var(--color-warning, #e6a23c);
  font-size: 0.9rem;
  font-weight: 600;
}
`;

fs.writeFileSync(p, content, 'utf-8');
