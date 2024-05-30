import { remark } from 'remark';
import remarkDirective from 'remark-directive';

import { remarkCodeExample } from '../../index.mjs';

export function transform(input, option = {}) {
  return remark()
    .use(remarkDirective)
    .use(remarkCodeExample, option)
    .process(input)
    .then((file) => file.toString());
}
