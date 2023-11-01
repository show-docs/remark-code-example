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
    (node, index, parent) => {
      const meta = parse(node.meta);

      const lang = getValue(meta.get(key)) || 'markdown';

      meta.delete(key);

      const copyToBefore = meta.has('copy-to-before');

      if (copyToBefore) {
        meta.delete('copy-to-before');
      }

      const newMeta = new Map(meta);

      if (key.includes('copy')) {
        const tabKey = 'copy-as-tab';

        const hasTab = meta.has(tabKey);
        const copyAsTab = meta.get(tabKey);

        if (hasTab && key !== 'code-alias-copy') {
          meta.delete(tabKey);
        }

        if (hasTab) {
          newMeta.set('tab', copyAsTab);
        }
      }

      visitor({
        node,
        index,
        parent,
        lang,
        copyToBefore,
        meta,
        newMeta,
      });
    },
  );
}

/* eslint-disable no-param-reassign */

function apply(node, { meta, newMeta, parent, index }, result) {
  if (meta.has('copy@')) {
    parent.children.splice(index, 0, result);

    const io = new Map(newMeta).delete('copy@');

    node.meta = stringify(io);
  } else if (meta.has('@copy')) {
    parent.children.splice(index + 1, 0, result);

    const io = new Map(newMeta).delete('@copy');

    node.meta = stringify(io);
  } else {
    delete node.type;
    delete node.lang;
    delete node.meta;
    delete node.value;
    delete node.position;

    Object.assign(node, result);
  }
}

export function remarkCodeExample({ metas = {} } = {}) {
  return (tree) => {
    visitCode(
      tree,
      'code-alias-copy',
      ({ node, index, parent, lang, copyToBefore = false, meta }) => {
        node.meta = stringify(meta);

        const newIndex = copyToBefore ? index : index + 1;

        parent.children.splice(newIndex, 0, {
          ...node,
          lang,
          value: node.value,
        });
      },
    );

    visitCode(
      tree,
      'code-example-copy',
      ({ node, index, parent, lang, copyToBefore = false, meta, newMeta }) => {
        const newIndex = copyToBefore ? index : index + 1;

        const extra = Object.entries(metas?.[lang] ?? {});

        parent.children.splice(newIndex, 0, {
          type: 'code',
          lang,
          value: ast2md({ ...node, meta: stringify(meta) }),
          meta: stringify(new Map([...extra, ...newMeta])),
        });

        node.meta = stringify(new Map([...meta, ...newMeta]));
      },
    );

    visitCode(tree, 'code-example', ({ node, lang, meta }) => {
      node.value = ast2md({ ...node, meta: stringify(meta) });

      node.lang = lang;

      const extra = Object.entries(metas?.[lang] ?? {});

      node.meta = stringify(new Map(extra));
    });

    visitCode(
      tree,
      '@plain',
      ({ node, lang, meta, index, parent, newMeta }) => {
        if (lang === 'markdown') {
          apply(
            node,
            { meta, newMeta, parent, index },
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  value: node.value,
                },
              ],
            },
          );
        }
      },
    );
  };
}
