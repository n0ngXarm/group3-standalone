const fs = require('fs');
const path = require('path');
const p = path.resolve('src/surfaces/group-3-8104/styles/challenges.css');
let content = fs.readFileSync(p, 'utf-8');

// Replace QTE header typography
content = content.replace(/\.g3-challenge > header span \{[\s\S]*?\}/, `.g3-challenge > header > div > span, .g3-challenge > header > span {
  color: var(--g3-red-deep);
  font-size: clamp(0.9rem, 2vw, 1.1rem);
  font-weight: 800;
  letter-spacing: 0.12em;
}`);

content += `

/* New QTE Prompt Styles */
.g3-challenge-prompt {
  margin-top: 0.6rem;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.g3-challenge-prompt h2 {
  font-family: var(--font-display);
  font-size: clamp(28px, 4vw, 32px);
  font-weight: 700;
  line-height: 1.35;
  color: var(--color-text-primary);
  margin: 0;
}

.g3-prompt-pinyin {
  font-size: clamp(18px, 2.5vw, 20px);
  color: var(--color-accent);
  font-weight: 500;
}

.g3-prompt-th {
  font-size: clamp(16px, 2vw, 18px);
  color: var(--color-text-muted);
  font-style: normal;
}

/* Instructions */
.g3-builder-hint {
  font-size: clamp(15px, 2vw, 16px);
  color: var(--color-text-muted);
  margin-top: 0.2rem;
  padding: 0 22px;
}

/* Tokens */
.g3-qte-options button strong,
.g3-word-bank button strong,
.g3-sentence-track > span b {
  font-size: clamp(22px, 3.5vw, 26px);
  font-family: var(--font-display);
}

.g3-qte-option-copy small,
.g3-word-bank button small,
.g3-sentence-track > span small.g3-word-pinyin {
  font-size: clamp(14px, 2vw, 16px);
}

/* Selected token visibility */
.g3-word-bank button:disabled {
  opacity: 0.45;
  filter: grayscale(0.8);
  background-color: var(--g3-slate);
}
.g3-qte-options button.is-selected {
  background-color: var(--g3-red);
  color: #fff;
  border-color: var(--g3-red);
}
.g3-qte-options button.is-selected small, 
.g3-qte-options button.is-selected em {
  color: rgba(255, 255, 255, 0.9);
}

/* Hint Block */
.g3-qte-target-hint {
  margin-top: 0.8rem;
  padding: 0.8rem;
  background: rgba(255, 193, 7, 0.1);
  border-radius: 0.6rem;
  border-left: 4px solid var(--g3-gold);
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  text-align: left;
}
.g3-qte-hint-label {
  font-weight: 700;
  font-size: 0.85rem;
  color: var(--g3-gold);
  margin-bottom: 0.2rem;
}
.g3-qte-target-hint strong {
  font-size: clamp(20px, 3vw, 24px);
  font-family: var(--font-display);
  color: var(--color-text-primary);
}
.g3-qte-target-hint small {
  font-size: clamp(14px, 2vw, 16px);
  color: var(--color-accent);
}
.g3-qte-target-hint em {
  font-size: clamp(14px, 2vw, 16px);
  color: var(--color-text-muted);
  font-style: normal;
}

/* Mobile Overrides */
@media (max-width: 640px) {
  .g3-challenge-prompt h2 {
    font-size: clamp(22px, 6vw, 28px);
  }
  .g3-prompt-pinyin {
    font-size: clamp(16px, 4vw, 18px);
  }
  .g3-prompt-th {
    font-size: clamp(15px, 4vw, 17px);
  }
  .g3-qte-options button strong,
  .g3-word-bank button strong,
  .g3-sentence-track > span b {
    font-size: clamp(20px, 5vw, 23px);
  }
  .g3-qte-option-copy small,
  .g3-word-bank button small,
  .g3-sentence-track > span small.g3-word-pinyin {
    font-size: clamp(13px, 3.5vw, 15px);
  }
  .g3-builder-hint {
    padding: 0 16px;
  }
}
@media (max-width: 380px) {
  .g3-builder-hint {
    padding: 0 12px;
  }
}
`;

fs.writeFileSync(p, content, 'utf-8');
