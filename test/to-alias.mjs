// eslint-disable-next-line import/no-unresolved
import test from 'ava';

import { getUtils, transform } from './helper/lib.mjs';

test('code-alias-copy-before', async (t) => {
  const input = `
\`\`\`css other code-alias-copy=less
\`\`\`
`;

  const expected = `
\`\`\`less other
\`\`\`

\`\`\`css other
\`\`\`
`;

  const output = await transform(input);

  getUtils(t).sameText(output, expected);
});

test('code-alias-copy-after', async (t) => {
  const input = `
\`\`\`css other code-alias-copy=less copyToAfter
\`\`\`
`;

  const expected = `
\`\`\`css other
\`\`\`

\`\`\`less other
\`\`\`
`;

  const output = await transform(input);

  getUtils(t).sameText(output, expected);
});

test('code-alias-copy-transform', async (t) => {
  const input = `
\`\`\`css other code-alias-copy=less
body {}
\`\`\`
`;

  const expected = `
\`\`\`less other
html {}
\`\`\`

\`\`\`css other
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
