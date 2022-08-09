import { getValue, parse, stringify } from 'markdown-code-block-meta';
import { toMarkdown } from 'mdast-util-to-markdown';
import { visit } from 'unist-util-visit';

function ast2md(ast) {
  return toMarkdown({ type: 'root', children: [ast] }).trim();
}

function visitCode(tree, key, visitor) {
  visit(
    tree,
    ({ type, meta }) => type === 'code' && meta && parse(meta).has(key),
    (node, index) => {
      const meta = parse(node.meta);

      const lang = getValue(meta.get(key)) || 'markdown';

      meta.delete(key);

      const copyToBefore = meta.has('copy-to-before');

      if (copyToBefore) {
        meta.delete('copy-to-before');
      }

      const hasTab = meta.has('copy-as-tab');
      const copyAsTab = meta.get('copy-as-tab');

      if (hasTab && key !== 'code-alias-copy') {
        meta.delete('copy-as-tab');
      }

      const newMeta = new Map();

      if (hasTab) {
        newMeta.set('tab', copyAsTab);
      }

      visitor({
        node,
        index,
        lang,
        copyToBefore,
        meta,
        newMeta,
      });
    },
  );
}

/* eslint-disable no-param-reassign */

export function remarkCodeExample({ metas = {} } = {}) {
  return (tree) => {
    visitCode(
      tree,
      'code-alias-copy',
      ({ node, index, lang, copyToBefore = false, meta }) => {
        node.meta = stringify(meta);

        const newIndex = copyToBefore ? index : index + 1;

        tree.children.splice(newIndex, 0, {
          ...node,
          lang,
          value: node.value,
        });
      },
    );

    visitCode(
      tree,
      'code-example-copy',
      ({ node, index, lang, copyToBefore = false, meta, newMeta }) => {
        const newIndex = copyToBefore ? index : index + 1;

        const extra = Object.entries(metas?.[lang] ?? {});

        tree.children.splice(newIndex, 0, {
          type: 'code',
          lang,
          value: ast2md({ ...node, meta: stringify(meta) }),
          meta: stringify(new Map([...extra, ...newMeta])),
        });

        node.meta = stringify(new Map([...meta, ...newMeta]));
      },
    );

    visitCode(tree, 'code-example', ({ node, lang, meta, newMeta }) => {
      node.value = ast2md({ ...node, meta: stringify(meta) });

      node.lang = lang;

      const extra = Object.entries(metas?.[lang] ?? {});

      node.meta = stringify(new Map([...extra, ...newMeta]));
    });
  };
}
