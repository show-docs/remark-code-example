import test from 'ava';

import { transform } from './helper/lib.mjs';

test('code example', async (t) => {
  const input = `
\`\`\`css other code-example=custom any
\`\`\`
`;

  const output = await transform(input);

  t.snapshot(input);
  t.snapshot(output);
});

test('code example child', async (t) => {
  const input = `
# heading 1

## heading 2

- \`\`\`css code-example=custom
  \`\`\`
`;

  const output = await transform(input);

  t.snapshot(input);
  t.snapshot(output);
});

test('code example copy', async (t) => {
  const input = `
\`\`\`js code-example-copy=custom other a= copy-as-tab=摆
\`\`\`
`;

  const output = await transform(input);

  t.snapshot(input);
  t.snapshot(output);
});

test('code example copy child', async (t) => {
  const input = `
# heading 1

## heading 2

- \`\`\`js code-example-copy=custom other a= copy-as-tab=0
  \`\`\`
`;

  const output = await transform(input);

  t.snapshot(input);
  t.snapshot(output);
});

test('code example copy before', async (t) => {
  const input = `
\`\`\`js code-example-copy=custom other copy-to-before
\`\`\`
`;

  const output = await transform(input);

  t.snapshot(input);
  t.snapshot(output);
});

test('code example copy with meta', async (t) => {
  const input = `
\`\`\`js code-example-copy=custom other copy-as-tab=" -0"
\`\`\`
`;

  const output = await transform(input, {
    metas: {
      custom: {
        title: 'example.md',
      },
    },
  });

  t.snapshot(input);
  t.snapshot(output);
});
