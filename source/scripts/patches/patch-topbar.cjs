const fs = require('fs');
const path = require('path');
const p = path.resolve('src/surfaces/group-3-8104/shared/components/StoryLayout.jsx');
let content = fs.readFileSync(p, 'utf-8');

const oldBlock = `            <div className="g3-learner-identity" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'var(--g3-color-primary-base, #cfa05d)',
                color: 'white',
                fontWeight: 'bold'
              }}>
                {initial}
              </span>
              <span style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.2' }}>
                <b style={{ color: 'var(--g3-color-text-primary)' }}>{name}</b>
                <small style={{ color: 'var(--g3-color-text-secondary)', fontSize: '11px' }}>{levelText}</small>
              </span>
            </div>`;

const newBlock = `            <div className="g3-learner-identity">
              <span className="g3-learner-avatar">
                {initial}
              </span>
              <span className="g3-learner-details">
                <b>{name}</b>
                <small>{levelText}</small>
              </span>
            </div>`;

content = content.replace(oldBlock, newBlock);

fs.writeFileSync(p, content, 'utf-8');
