import remark from 'remark';
import stringify from 'remark-stringify';
import { Node } from 'unist';
import yaml from 'yaml';
import { Config } from '../config';
import { Post } from './post';
import { noopFormatter, PostFormatter } from './post-formatter';

export interface PostStringifier {
  stringify(post: Post, formatter?: PostFormatter): string;
}
export interface PostStringifierDeps {
  readonly config: Config;
}

export const stringifier = (): PostStringifier => ({
  stringify: (post: Post, formatter: PostFormatter = noopFormatter): string => {
    const str = [
      '---\n',
      yaml.stringify(post.body.metadata),
      '\n',
      '---\n',
      remark()
        // TODO: Load options from config.
        .use(stringify, { fences: true, rule: '-', ruleSpaces: false })
        .stringify((post.body.content as unknown) as Node)
        .trim(),
      '\n',
    ].join('');
    return formatter.format(str);
  },
});
