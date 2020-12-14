import { createVariadicArgument } from '../../core';

export type GlobsArgument = string[];

export const globs = createVariadicArgument('file/dir/glob', 'Globs of post files to include e.g. `posts/**/post.md`.');
