import { format, Options } from 'prettier';
import { createFormatter, PostFormatter } from '../post-formatter';

export const prettier = (options?: Options): PostFormatter =>
  createFormatter(str => format(str, { parser: 'markdown', ...(options ?? {}) }));
