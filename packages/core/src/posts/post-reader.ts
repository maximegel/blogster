import { promises as fs } from 'fs';
import glob from 'glob';
import _ from 'lodash';
import { promisify } from 'util';
import { Config } from '../config';
import { LocalPost, newPost } from './post';
import { markdownBody } from './post-body';

export interface PostReader {
  read(globs?: string[]): Promise<LocalPost[]>;
}
export interface PostReaderDeps {
  readonly config: Config;
}

export const reader = ({ config }: PostReaderDeps): PostReader => ({
  async read(globs?: string[]): Promise<LocalPost[]> {
    const { patterns, ignore } =
      globs?.length > 0
        ? // If patterns are received as argument, they are used directly.
          { patterns: globs ?? [], ignore: [] }
        : // Otherwise, they are loaded from configuration.
          { patterns: config?.include ?? [], ignore: config?.exclude ?? [] };
    return await Promise.all(patterns.map(pattern => promisify(glob)(pattern, { ignore })))
      .then(paths => _(paths).flatMap().uniq().value())
      .then(paths => paths.map(async path => ({ path, content: await fs.readFile(path, { encoding: 'utf8' }) })))
      .then(promises => Promise.all(promises))
      .then(files => files.map(({ path, content }) => ({ ...newPost({ body: markdownBody(content) }), path })));
  },
});
