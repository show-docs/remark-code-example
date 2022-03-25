// eslint-disable-next-line import/no-unresolved
import test from 'ava';

import { getUtils, transform } from './helper/lib.mjs';

const input = `
  \`\`\`css other code-alias-copy=less
  \`\`\`
`;

test('code-alias-copy-before', async (t) => {
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
  const expected = `
\`\`\`css other
\`\`\`

\`\`\`less other
\`\`\`
`;

  const output = await transform(input, { copyAtBefore: false });

  getUtils(t).sameText(output, expected);
});
