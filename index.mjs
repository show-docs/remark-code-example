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
  return metas
    ? Object.entries(metas)
        .map((pair) => pair.filter((item) => item !== '').join('='))
        .join(' ')
        .trim() || null
    : null;
}

function visitCode(tree, key, visitor) {
  visit(
    tree,
    ({ type, meta }) =>
      type === 'code' &&
      meta &&
      meta.split(/\s/).some((item) => item.startsWith(key)),
    (node) => {
      const { [key]: lang, ...meta } = parseMeta(node.meta);

      const copyToAfter = 'copyToAfter' in meta;

      if (copyToAfter) {
        delete meta.copyToAfter;
      }

      visitor({
        node,
        lang: lang || 'markdown',
        copyToAfter,
        meta,
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
      ({ node, lang, copyToAfter = false, meta }) => {
        const index = tree.children.indexOf(node);

        node.meta = stringifyMeta(meta);

        tree.children.splice(copyToAfter ? index + 1 : index, 0, {
          ...node,
          lang,
          value: node.value,
        });
      },
    );

    visitCode(
      tree,
      'code-example-copy',
      ({ node, lang, copyToAfter = false, meta }) => {
        const index = tree.children.indexOf(node);

        node.meta = stringifyMeta(meta);

        const newIndex = copyToAfter ? index + 1 : index;

        tree.children.splice(newIndex, 0, {
          type: 'code',
          lang,
          value: ast2md({ ...node }),
          meta: stringifyMeta(metas?.[lang]),
        });
      },
    );

    visitCode(tree, 'code-example', ({ node, lang, meta }) => {
      node.value = ast2md({ ...node, meta: stringifyMeta(meta) });
      node.lang = lang;
      node.meta = stringifyMeta(metas?.[lang]);
    });
  };
}
