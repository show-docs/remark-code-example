import { remark } from 'remark';

import { remarkCodeExample } from '../../index.mjs';

export function transform(input, option = {}) {
  return remark()
    .use(remarkCodeExample, option)
    .process(input)
    .then((file) => file.toString());
}
