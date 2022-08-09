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

  getUtils(t).sameText(expected, output);
});

test('code-example-copy', async (t) => {
  const input = `
\`\`\`js code-example-copy=custom other a= copy-as-tab=0
\`\`\`
`;

  const expected = `
\`\`\`js other a= tab=0
\`\`\`

\`\`\`\`custom tab=0
\`\`\`js other a=
\`\`\`
\`\`\`\`
`;

  const output = await transform(input);

  getUtils(t).sameText(expected, output);
});

test('code-example-copy-before', async (t) => {
  const input = `
\`\`\`js code-example-copy=custom other copy-to-before
\`\`\`
`;

  const expected = `
\`\`\`\`custom
\`\`\`js other
\`\`\`
\`\`\`\`

\`\`\`js other
\`\`\`
`;

  const output = await transform(input);

  getUtils(t).sameText(expected, output);
});

test('code-example-copy-with-meta', async (t) => {
  const input = `
\`\`\`js code-example-copy=custom other copy-as-tab
\`\`\`
`;

  const expected = `
\`\`\`js other tab
\`\`\`

\`\`\`\`custom title=example.md tab
\`\`\`js other
\`\`\`
\`\`\`\`
`;

  const output = await transform(input, {
    metas: {
      custom: {
        title: 'example.md',
      },
    },
  });

  getUtils(t).sameText(expected, output);
});
