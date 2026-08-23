import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const sourceDir = path.resolve(__dirname, '../../../../');

test('Role selection bypass and auto-start', () => {
  const content = fs.readFileSync(path.resolve(__dirname, './ReadingTheatre.jsx'), 'utf-8');
  assert.match(content, /startRoleplay\(/, 'Should automatically start roleplay');
  assert.doesNotMatch(content, /<RolePicker/, 'Should not render RolePicker');
});

test('Audio-ended dependency and QTE delay', () => {
  const content = fs.readFileSync(path.resolve(__dirname, './ReadingTheatre.jsx'), 'utf-8');
  assert.match(content, /QTE_POST_SPEECH_DELAY_MS\s*=\s*4000/, 'Should define 4000ms delay');
  assert.match(content, /const stayedQte = await wait\(QTE_POST_SPEECH_DELAY_MS\);/, 'Should wait before QTE');
  assert.match(content, /if \(cancelled\) return;/, 'Should guard against duplicate QTE and cancel early');
});

test('QTE language display requirements', () => {
  const content = fs.readFileSync(path.resolve(__dirname, './challenges/Challenges.jsx'), 'utf-8');
  assert.match(content, /\{option\.th\}/, 'Should display Thai translation in QTE options');
  assert.match(content, /\{option\.zh\}/, 'Should display Hanzi in QTE options');
  assert.match(content, /\{option\.pinyin\}/, 'Should display Pinyin in QTE options');
});

test('Wrong attempts increment and hints (QTE)', () => {
  const content = fs.readFileSync(path.resolve(__dirname, './challenges/Challenges.jsx'), 'utf-8');
  assert.match(content, /const \[wrongAttempts, setWrongAttempts\] = useState\(0\);/, 'Should track wrong attempts');
  assert.match(content, /setWrongAttempts\(w => w \+ 1\)/, 'Should increment wrong attempts on failure');
  assert.match(content, /wrongAttempts >= 3/, 'Hint should appear at 3 wrong attempts');
  assert.match(content, /setWrongAttempts\(0\)/, 'Should reset wrong attempts on success or next QTE');
});

test('Auto continuation after success', () => {
  const content = fs.readFileSync(path.resolve(__dirname, './challenges/Challenges.jsx'), 'utf-8');
  assert.match(content, /window\.setTimeout\(onResolve, 1500\)/, 'Should automatically resolve and continue dialogue');
});
