// eslint-disable-next-line import/no-unresolved
import test from 'ava';

import { getUtils, transform } from './helper/lib.mjs';

test('code-example', async (t) => {
  const input = `
\`\`\`css other code-example
\`\`\`
`;

  const expected = `
\`\`\`\`markdown
\`\`\`css other
\`\`\`
\`\`\`\`
`;

  const output = await transform(input);

  getUtils(t).sameText(output, expected);
});

const input = `
\`\`\`js code-example-copy other
\`\`\`
`;

test('code-example-copy-before', async (t) => {
  const expected = `
\`\`\`\`markdown
\`\`\`js other
\`\`\`
\`\`\`\`

\`\`\`js other
\`\`\`
`;

  const output = await transform(input);

  getUtils(t).sameText(output, expected);
});

test('code-example-copy-after', async (t) => {
  const expected = `
\`\`\`js other
\`\`\`

\`\`\`\`markdown
\`\`\`js other
\`\`\`
\`\`\`\`
`;

  const output = await transform(input, { copyAtBefore: false });

  getUtils(t).sameText(output, expected);
});

test('code-example-copy-with-meta', async (t) => {
  const expected = `
\`\`\`\`markdown title=example.md
\`\`\`js other
\`\`\`
\`\`\`\`

\`\`\`js other
\`\`\`
`;

  const output = await transform(input, {
    metas: { markdown: 'title=example.md' },
  });

  getUtils(t).sameText(output, expected);
});
