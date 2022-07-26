// eslint-disable-next-line import/no-unresolved
import test from 'ava';

import { getUtils, transform } from './helper/lib.mjs';

test('code-example', async (t) => {
  const input = `
\`\`\`css other code-example=custom
\`\`\`
`;

  const expected = `
\`\`\`\`custom
\`\`\`css other
\`\`\`
\`\`\`\`
`;

  const output = await transform(input);

  getUtils(t).sameText(output, expected);
});

test('code-example-copy-before', async (t) => {
  const input = `
\`\`\`js code-example-copy=custom other a=
\`\`\`
`;

  const expected = `
\`\`\`\`custom
\`\`\`js other a
\`\`\`
\`\`\`\`

\`\`\`js other a
\`\`\`
`;

  const output = await transform(input);

  getUtils(t).sameText(output, expected);
});

test('code-example-copy-after', async (t) => {
  const input = `
\`\`\`js code-example-copy=custom other copyToAfter
\`\`\`
`;

  const expected = `
\`\`\`js other
\`\`\`

\`\`\`\`custom
\`\`\`js other
\`\`\`
\`\`\`\`
`;

  const output = await transform(input);

  getUtils(t).sameText(output, expected);
});

test('code-example-copy-with-meta', async (t) => {
  const input = `
\`\`\`js code-example-copy=custom other
\`\`\`
`;

  const expected = `
\`\`\`\`custom title=example.md
\`\`\`js other
\`\`\`
\`\`\`\`

\`\`\`js other
\`\`\`
`;

  const output = await transform(input, {
    metas: {
      custom: {
        title: 'example.md',
      },
    },
  });

  getUtils(t).sameText(output, expected);
});
