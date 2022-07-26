// eslint-disable-next-line import/no-unresolved
import test from 'ava';

import { getUtils, transform } from './helper/lib.mjs';

test('code-alias-base', async (t) => {
  const input = `
\`\`\`css code-alias-copy=less
\`\`\`
`;

  const expected = `
\`\`\`less
\`\`\`

\`\`\`css
\`\`\`
`;

  const output = await transform(input);

  getUtils(t).sameText(output, expected);
});

test('code-alias-copy-before', async (t) => {
  const input = `
\`\`\`css tab code-alias-copy=less
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

test('code-alias-copy-after', async (t) => {
  const input = `
\`\`\`css tab code-alias-copy=less copyToAfter
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

test('code-alias-copy-transform', async (t) => {
  const input = `
\`\`\`css tab code-alias-copy=less
body {}
\`\`\`
`;

  const expected = `
\`\`\`less tab
html {}
\`\`\`

\`\`\`css tab
body {}
\`\`\`
`;

  const output = await transform(input, {
    transforms: {
      less: (original) => original.replace('body', 'html'),
    },
  });

  getUtils(t).sameText(output, expected);
});
