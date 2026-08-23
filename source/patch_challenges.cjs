const fs = require('fs');
const path = require('path');
const p = path.resolve('src/surfaces/group-3-8104/features/reader/challenges/Challenges.jsx');
let content = fs.readFileSync(p, 'utf-8');

const oldControls = `<div className="g3-builder-controls">
          <button type="button" onClick={() => { setSelected((current) => current.slice(0, -1)); setStatus("active"); }} disabled={!selected.length || status === "correct"}>{text.undo}</button>
          <button type="button" onClick={() => { setSelected([]); setStatus("active"); }} disabled={!selected.length || status === "correct"}>{text.reset}</button>
          <button className="is-primary" type="button" onClick={check} disabled={sentence.length !== challenge.answer.length || status === "correct"}>{text.check}</button>
        </div>`;

const newControls = `<div className="g3-builder-controls">
          {selected.length > 0 && status !== "correct" && (
            <>
              <button type="button" onClick={() => { setSelected((current) => current.slice(0, -1)); setStatus("active"); }}>{text.undo}</button>
              <button type="button" onClick={() => { setSelected([]); setStatus("active"); }}>{text.reset}</button>
            </>
          )}
          <button className="is-primary" type="button" onClick={check} disabled={sentence.length !== challenge.answer.length || status === "correct"}>{text.check}</button>
        </div>`;

content = content.replace(oldControls, newControls);

fs.writeFileSync(p, content, 'utf-8');
