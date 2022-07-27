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

      const copyToAfter = 'copy-to-after' in meta;

      if (copyToAfter) {
        delete meta['copy-to-after'];
      }

      const hasTab = 'copy-as-tab' in meta;
      const { 'copy-as-tab': copyAsTab } = meta;

      if (hasTab && key !== 'code-alias-copy') {
        delete meta['copy-as-tab'];
      }

      visitor({
        node,
        lang: lang || 'markdown',
        copyToAfter,
        meta,
        extraMeta: hasTab ? { tab: copyAsTab } : undefined,
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
      ({ node, lang, copyToAfter = false, meta, extraMeta }) => {
        const index = tree.children.indexOf(node);

        const newIndex = copyToAfter ? index + 1 : index;

        tree.children.splice(newIndex, 0, {
          type: 'code',
          lang,
          value: ast2md({ ...node, meta: stringifyMeta(meta) }),
          meta: stringifyMeta({ ...metas?.[lang], ...extraMeta }),
        });

        node.meta = stringifyMeta({ ...meta, ...extraMeta });
      },
    );

    visitCode(tree, 'code-example', ({ node, lang, meta, extraMeta }) => {
      node.value = ast2md({ ...node, meta: stringifyMeta(meta) });

      node.lang = lang;

      node.meta = stringifyMeta({ ...metas?.[lang], ...extraMeta });
    });
  };
}
