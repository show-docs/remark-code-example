// eslint-disable-next-line import/no-unresolved
import test from 'ava';

import { getUtils, transform } from './helper/lib.mjs';

test('code-alias', async (t) => {
  const input = `
\`\`\`css code-alias-copy=less
\`\`\`
`;

  const expected = `
\`\`\`css
\`\`\`

\`\`\`less
\`\`\`
`;

  const output = await transform(input);

  getUtils(t).sameText(output, expected);
});

test('code-alias-copy', async (t) => {
  const input = `
\`\`\`css tab code-alias-copy=less
\`\`\`
`;

  const expected = `
\`\`\`css tab
\`\`\`

\`\`\`less tab
\`\`\`
`;

  const output = await transform(input);

  getUtils(t).sameText(output, expected);
});

test('code-alias-copy-before', async (t) => {
  const input = `
\`\`\`css tab code-alias-copy=less <-copy
\`\`\`
`;

  const expected = `
\`\`\`less tab
\`\`\`

\`\`\`css tab
\`\`\`
`;

  const output = await transform(input);

  getUtils(t).sameText(output, expected);
});
