import querystring from 'querystring';

import { toMarkdown } from 'mdast-util-to-markdown';
import { visit } from 'unist-util-visit';

function ast2md(ast) {
  return toMarkdown({ type: 'root', children: [ast] }).trim();
}

function parseMeta(meta) {
  return querystring.parse(meta, ' ');
}

function stringifyMeta(metas) {
  return metas
    ? querystring
        .stringify(metas, ' ', '=', {
          encodeURIComponent: (io) => io,
        })
        .replaceAll('= ', ' ')
        .replace(/=$/g, '') || null
    : null;
}

function visitCode(tree, key, visitor) {
  visit(
    tree,
    ({ type, meta }) => type === 'code' && meta && key in parseMeta(meta),
    (node, index) => {
      const { [key]: lang, ...meta } = parseMeta(node.meta);

      const copyToBefore = '<-copy' in meta;

      if (copyToBefore) {
        delete meta['<-copy'];
      }

      const hasTab = 'copy-as-tab' in meta;
      const { 'copy-as-tab': copyAsTab } = meta;

      if (hasTab && key !== 'code-alias-copy') {
        delete meta['copy-as-tab'];
      }

      visitor({
        node,
        index,
        lang: lang || 'markdown',
        copyToBefore,
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
      ({ node, index, lang, copyToBefore = false, meta }) => {
        node.meta = stringifyMeta(meta);

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
      ({ node, index, lang, copyToBefore = false, meta, extraMeta }) => {
        const newIndex = copyToBefore ? index : index + 1;

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
