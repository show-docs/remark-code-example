import test from 'ava';

import { transform } from './helper/lib.mjs';

test('code-eval-copy | match', async (t) => {
  const input = `
\`\`\`md code-eval-copy
> [!NOTE]
> Useful information that users should know, even when skimming content.

:::tip[label]

Some **content** with _markdown_ .

:::
\`\`\`
`;

  const output = await transform(input);

  t.snapshot(input);
  t.snapshot(output);
});

test('code-eval-copy | none', async (t) => {
  const input = `
\`\`\`js code-eval-copy
\`\`\`
`;

  const output = await transform(input);

  t.snapshot(input);
  t.snapshot(output);
});
