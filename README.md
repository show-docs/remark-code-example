# remark-code-example

Remark plugin to copy live code block as code example.

[![npm][npm-badge]][npm-url]
[![github][github-badge]][github-url]
![node][node-badge]

[npm-url]: https://www.npmjs.com/package/remark-code-example
[npm-badge]: https://img.shields.io/npm/v/remark-code-example.svg?style=flat-square&logo=npm
[github-url]: https://github.com/nice-move/remark-code-example
[github-badge]: https://img.shields.io/npm/l/remark-code-example.svg?style=flat-square&colorB=blue&logo=github
[node-badge]: https://img.shields.io/node/v/remark-code-example.svg?style=flat-square&colorB=green&logo=node.js

## Installation

```sh
npm install remark remark-code-example --save-dev
```

## Usage

```mjs
import readFileSync from 'node:fs';

import { remark } from 'remark';
import { remarkCodeExample } from 'remark-code-example';

const markdownText = readFileSync('example.md', 'utf8');

remark()
  .use(remarkCodeSample, {})
  .process(markdownText)
  .then((file) => console.info(file))
  .catch((error) => console.warn(error));
```

### Options.metas

- type: object of string
- default: {}
- required: false
- description: Metas of example code block

## Syntax

### code-example

`````markdown
Turn

```mermaid code-example
flowchart
  Start --> Stop
```

Into

````markdown
```mermaid
flowchart
  Start --> Stop
```
````
`````

### code-example-copy

`````markdown
Turn

```mermaid code-example-copy
flowchart
  Start --> Stop
```

Into

```mermaid
flowchart
  Start --> Stop
```

````markdown
```mermaid
flowchart
  Start --> Stop
```
````
`````

### code-alias-copy

````markdown
Turn

```mermaid code-alias-copy=diagram
flowchart
  Start --> Stop
```

Into

```mermaid
flowchart
  Start --> Stop
```

```diagram
flowchart
  Start --> Stop
```
````

## Related

- [markdown-code-block-meta](https://github.com/nice-move/markdown-code-block-meta)
- [remark-docusaurus](https://github.com/nice-move/remark-docusaurus)
- [remark-kroki](https://github.com/nice-move/remark-kroki)
