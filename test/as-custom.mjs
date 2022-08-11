// eslint-disable-next-line import/no-unresolved
import test from 'ava';

import { getUtils, transform } from './helper/lib.mjs';

test('code example', async (t) => {
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

test('code example child', async (t) => {
  const input = `
# heading 1

## heading 2

- \`\`\`css code-example=custom
  \`\`\`
`;

  const expected = `
# heading 1

## heading 2

*   \`\`\`\`custom
    \`\`\`css
    \`\`\`
    \`\`\`\`
`;

  const output = await transform(input);

  getUtils(t).sameText(expected, output);
});

test('code example copy', async (t) => {
  const input = `
\`\`\`js code-example-copy=custom other a= copy-as-tab=摆
\`\`\`
`;

  const expected = `
\`\`\`js other a= tab=摆
\`\`\`

\`\`\`\`custom tab=摆
\`\`\`js other a=
\`\`\`
\`\`\`\`
`;

  const output = await transform(input);

  getUtils(t).sameText(expected, output);
});

test('code example copy child', async (t) => {
  const input = `
# heading 1

## heading 2

- \`\`\`js code-example-copy=custom other a= copy-as-tab=0
  \`\`\`
`;

  const expected = `
# heading 1

## heading 2

*   \`\`\`js other a= tab=0
    \`\`\`
    \`\`\`\`custom tab=0
    \`\`\`js other a=
    \`\`\`
    \`\`\`\`
`;

  const output = await transform(input);

  getUtils(t).sameText(expected, output);
});

test('code example copy before', async (t) => {
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

test('code example copy with meta', async (t) => {
  const input = `
\`\`\`js code-example-copy=custom other copy-as-tab=" -0"
\`\`\`
`;

  const expected = `
\`\`\`js other tab=" -0"
\`\`\`

\`\`\`\`custom title=example.md tab=" -0"
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
