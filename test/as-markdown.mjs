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

test('code-example-copy', async (t) => {
  const input = `
\`\`\`js code-example-copy other a= copy-as-tab=摆
\`\`\`
`;

  const expected = `
\`\`\`js other a tab=摆
\`\`\`

\`\`\`\`markdown tab=摆
\`\`\`js other a
\`\`\`
\`\`\`\`
`;

  const output = await transform(input);

  getUtils(t).sameText(output, expected);
});

test('code-example-copy-before', async (t) => {
  const input = `
\`\`\`js code-example-copy other <-copy
\`\`\`
`;

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

test('code-example-copy-with-meta', async (t) => {
  const input = `
\`\`\`js code-example-copy other copy-as-tab
\`\`\`
`;

  const expected = `
\`\`\`js other tab
\`\`\`

\`\`\`\`markdown title=example.md tab
\`\`\`js other
\`\`\`
\`\`\`\`
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
