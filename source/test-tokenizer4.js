import { buildQteTokens } from './src/surfaces/group-3-8104/features/reader/challenges/tokenizer.js';
console.log(buildQteTokens({ 
  hanzi: "今天我请你们吃北京烤鸭。", 
  pinyin: "Jīntiān wǒ qǐng nǐmen chī Běijīng kǎoyā.", 
  level: "hsk2" 
}));
