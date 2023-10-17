import test from 'ava';

import { transform } from './helper/lib.mjs';

test('code alias', async (t) => {
  const input = `
\`\`\`css code-alias-copy=less
\`\`\`
`;

  const output = await transform(input);

  t.snapshot(input);
  t.snapshot(output);
});

test('code alias copy', async (t) => {
  const input = `
\`\`\`css tab code-alias-copy=less
\`\`\`
`;

  const output = await transform(input);

  t.snapshot(input);
  t.snapshot(output);
});

test('code alias copy before', async (t) => {
  const input = `
\`\`\`css tab code-alias-copy=less copy-to-before
\`\`\`
`;

  const output = await transform(input);

  t.snapshot(input);
  t.snapshot(output);
});

test('code alias child', async (t) => {
  const input = `
# heading 1
## heading 2

-  \`\`\`css code-alias-copy=less
   \`\`\`
`;

  const output = await transform(input);

  t.snapshot(input);
  t.snapshot(output);
});
