import test from 'ava';
import { Text } from 'fs-chain';

import { transform } from './helper/lib.mjs';

function Read(path) {
  return new Text(import.meta.url).source(path).then((io) => io.split('---'));
}

const [input1, input2] = await Read('../fixture/math.md');

test('@plain', async (t) => {
  const output = await transform(input1);

  t.snapshot(input1);
  t.snapshot(output);
});

test('@plain @copy', async (t) => {
  const output = await transform(input2);

  t.snapshot(input2);
  t.snapshot(output);
});
