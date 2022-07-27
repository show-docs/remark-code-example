// eslint-disable-next-line import/no-unresolved
import test from 'ava';

import { getUtils, transform } from './helper/lib.mjs';

test('code-example', async (t) => {
  const input = `
\`\`\`css other code-example=custom copy-as-tab
\`\`\`
`;

  const expected = `
\`\`\`\`custom tab
\`\`\`css other
\`\`\`
\`\`\`\`
`;

  const output = await transform(input);

  getUtils(t).sameText(output, expected);
});

test('code-example-copy-before', async (t) => {
  const input = `
\`\`\`js code-example-copy=custom other a= copy-as-tab=0
\`\`\`
`;

  const expected = `
\`\`\`\`custom tab=0
\`\`\`js other a
\`\`\`
\`\`\`\`

\`\`\`js other a tab=0
\`\`\`
`;

  const output = await transform(input);

  getUtils(t).sameText(output, expected);
});

test('code-example-copy-after', async (t) => {
  const input = `
\`\`\`js code-example-copy=custom other copy-to-after
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
\`\`\`js code-example-copy=custom other copy-as-tab
\`\`\`
`;

  const expected = `
\`\`\`\`custom title=example.md tab
\`\`\`js other
\`\`\`
\`\`\`\`

\`\`\`js other tab
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
