import { buildRepeatSessionDefinitions } from './source/src/surfaces/group-3-8104/content/practice/repeatAdapter.js';
import fs from 'fs';

async function run() {
  const hsk1 = await buildRepeatSessionDefinitions('hsk1');
  const hsk2 = await buildRepeatSessionDefinitions('hsk2');
  const hsk3 = await buildRepeatSessionDefinitions('hsk3');
  
  console.log(JSON.stringify({ hsk1, hsk2, hsk3 }, null, 2));
}
run();
