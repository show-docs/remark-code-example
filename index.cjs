'use strict';

/* eslint-disable no-param-reassign */

const astToString = require('mdast-util-to-markdown');
const visit = require('unist-util-visit');

function ast2md(ast) {
  return astToString({ type: 'root', children: [ast] }).trim();
}

function visitCode(tree, key, visitor) {
  visit(
    tree,
    ({ type, meta }) =>
      type === 'code' &&
      meta &&
      meta.split(/\s/).some((item) => item.startsWith(key)),
    (node) => {
      const metas = node.meta.split(/\s/);

      const lang =
        metas.find((item) => item.startsWith(key)).split('=', 2)[1] ||
        'markdown';

      visitor(
        node,
        lang,
        metas.filter((item) => !item.startsWith(key)).join(' '),
      );
    },
  );
}

module.exports = function Plugin({ copyAtBefore = true, metas = {} } = {}) {
  return (tree) => {
    visitCode(tree, 'code-alias-copy', (node, lang, meta) => {
      const index = tree.children.indexOf(node);

      node.meta = meta;

      tree.children.splice(copyAtBefore ? index : index + 1, 0, {
        ...node,
        lang,
      });
    });

    visitCode(tree, 'code-example-copy', (node, lang, meta) => {
      const index = tree.children.indexOf(node);

      node.meta = meta;

      tree.children.splice(copyAtBefore ? index : index + 1, 0, {
        type: 'code',
        lang,
        meta: metas ? metas[lang] || null : null,
        value: ast2md({ ...node }),
      });
    });

    visitCode(tree, 'code-example', (node, lang, meta) => {
      node.value = ast2md({ ...node, meta });
      node.lang = lang;
      node.meta = metas ? metas[lang] || null : null;
    });
  };
};
