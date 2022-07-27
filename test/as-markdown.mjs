// eslint-disable-next-line import/no-unresolved
import test from 'ava';

import { getUtils, transform } from './helper/lib.mjs';

test('code-example', async (t) => {
  const input = `
\`\`\`css other code-example copy-as-tab
\`\`\`
`;

  const expected = `
\`\`\`\`markdown tab
\`\`\`css other
\`\`\`
\`\`\`\`
`;

  const output = await transform(input);

  getUtils(t).sameText(output, expected);
});

test('code-example-copy-before', async (t) => {
  const input = `
\`\`\`js code-example-copy other a= copy-as-tab=0
\`\`\`
`;

  const expected = `
\`\`\`\`markdown tab=0
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
\`\`\`js code-example-copy other copy-to-after
\`\`\`
`;

  const expected = `
\`\`\`js other
\`\`\`

\`\`\`\`markdown
\`\`\`js other
\`\`\`
\`\`\`\`
`;

  const output = await transform(input);

  getUtils(t).sameText(output, expected);
});

test('code-example-copy-with-meta', async (t) => {
  const input = `
\`\`\`js code-example-copy other copy-as-tab
\`\`\`
`;

  const expected = `
\`\`\`\`markdown title=example.md tab
\`\`\`js other
\`\`\`
\`\`\`\`

\`\`\`js other tab
\`\`\`
`;

  const output = await transform(input, {
    metas: {
      markdown: {
        title: 'example.md',
      },
    },
  });

  getUtils(t).sameText(output, expected);
});
