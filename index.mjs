import querystring from 'querystring';

import { toMarkdown } from 'mdast-util-to-markdown';
import { visit } from 'unist-util-visit';

function ast2md(ast) {
  return toMarkdown({ type: 'root', children: [ast] }).trim();
}

function parseMeta(meta) {
  return querystring.parse(meta.trim().split(/\s/).join('&'));
}

function stringifyMeta(metas) {
  return Object.entries(metas)
    .map((pair) => pair.filter(Boolean).join('='))
    .join(' ');
}

function visitCode(tree, key, visitor) {
  visit(
    tree,
    ({ type, meta }) =>
      type === 'code' &&
      meta &&
      meta.split(/\s/).some((item) => item.startsWith(key)),
    (node) => {
      const { [key]: io, copyToAfter, ...metas } = parseMeta(node.meta);

      const lang = io || 'markdown';

      visitor({
        node,
        lang,
        copyToAfter: (copyToAfter === '' ? true : copyToAfter) || false,
        meta: stringifyMeta(metas),
      });
    },
  );
}

/* eslint-disable no-param-reassign */

export function remarkCodeExample({ metas = {}, transforms = {} } = {}) {
  return (tree) => {
    visitCode(tree, 'code-alias-copy', ({ node, lang, copyToAfter, meta }) => {
      const index = tree.children.indexOf(node);

      node.meta = meta;

      tree.children.splice(copyToAfter ? index + 1 : index, 0, {
        ...node,
        lang,
        value:
          typeof transforms[lang] === 'function'
            ? transforms[lang](node.value)
            : node.value,
      });
    });

    visitCode(
      tree,
      'code-example-copy',
      ({ node, lang, copyToAfter = false, meta }) => {
        const index = tree.children.indexOf(node);

        node.meta = meta;

        tree.children.splice(copyToAfter ? index + 1 : index, 0, {
          type: 'code',
          lang,
          meta: metas ? metas[lang] || null : null,
          value: ast2md({ ...node }),
        });
      },
    );

    visitCode(tree, 'code-example', ({ node, lang, meta }) => {
      node.value = ast2md({ ...node, meta });
      node.lang = lang;
      node.meta = metas ? metas[lang] || null : null;
    });
  };
}
