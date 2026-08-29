import test from 'node:test';
import assert from 'node:assert';
import { buildQteTokens, buildSentenceChallengeModel } from '../../src/surfaces/group-3-8104/features/lessons/challenges/tokenizer.js';

test('HSK1 token granularity is fine-grained', () => {
  const { tokens } = buildQteTokens({
    hanzi: '今天我请你们吃北京烤鸭。',
    pinyin: 'Jīntiān wǒ qǐng nǐmen chī Běijīng kǎoyā.',
    level: 'hsk1'
  });
  assert.ok(tokens.length >= 6); // Extremely granular
  assert.ok(tokens.every(t => t.pinyin.trim().length > 0 || !/[\\u4e00-\\u9fa5]/.test(t.text)));
});

test('HSK2 token granularity merges slightly', () => {
  const { tokens } = buildQteTokens({
    hanzi: '今天我请你们吃北京烤鸭。',
    pinyin: 'Jīntiān wǒ qǐng nǐmen chī Běijīng kǎoyā.',
    level: 'hsk2'
  });
  assert.ok(tokens.length >= 5 && tokens.length <= 7);
});

test('HSK3 token granularity merges more', () => {
  const { tokens } = buildQteTokens({
    hanzi: '今天我请你们吃北京烤鸭。',
    pinyin: 'Jīntiān wǒ qǐng nǐmen chī Běijīng kǎoyā.',
    level: 'hsk3'
  });
  assert.ok(tokens.length <= 6);
});

test('Pinyin aligns correctly ignoring punctuation', () => {
  const { tokens } = buildQteTokens({
    hanzi: '太好了，我最喜欢吃烤鸭了！',
    pinyin: 'Tài hǎo le, wǒ zuì xǐhuan chī kǎoyā le!',
    level: 'hsk2'
  });
  const hao = tokens.find(t => t.text.includes('好'));
  assert.ok(hao.pinyin.includes('hǎo'));
  const xihuan = tokens.find(t => t.text.includes('喜欢'));
  assert.ok(xihuan.pinyin.includes('xǐ huan'));
});

test('Empty pinyin is not silent', () => {
  const { tokens } = buildQteTokens({
    hanzi: '测试',
    pinyin: 'cè shì',
    level: 'hsk2'
  });
  assert.strictEqual(tokens[0].pinyin, 'cè shì');
});

test('Sentence Builder uses its declared chunks instead of a dialogue fallback', () => {
  const challenge = {
    answer: ['我家有', '四口人。'],
    pinyin: ['Wǒ jiā yǒu', 'sì kǒu rén.'],
    tiles: ['四口人。', '我家有'],
  };
  const model = buildSentenceChallengeModel(challenge, (tokens) => [...tokens]);

  assert.deepStrictEqual(model.answer.map((token) => token.text), challenge.answer);
  assert.deepStrictEqual(model.answer.map((token) => token.pinyin), challenge.pinyin);
  assert.deepStrictEqual(model.tiles.map((token) => token.text), challenge.tiles);
  assert.strictEqual(model.tiles[0].id, model.answer[1].id);
  assert.strictEqual(model.tiles[1].id, model.answer[0].id);
});
