import { isDesynced, PostReader, PostStatusFetcher } from '@blogster/core';
import { Command, createCommand } from '../../core';
import { globs, GlobsArgument } from '../../shared/arguments';
import { platforms, PlatformsOption } from '../../shared/options';
import { diffView } from './diff-view';

export const diffCommand: Command<DiffCommandDeps> = createCommand('diff')
  .argument(globs)
  .description('Outputs changes between post files and published posts in diff format.')
  .option(platforms)
  .handler(({ reader, statusFetcher }: DiffCommandDeps) => async (globs: GlobsArgument, options?: PlatformsOption) =>
    await reader
      .read(globs)
      .then(locals => statusFetcher.fetchStatuses(locals, options))
      .then(posts =>
        posts.filter(isDesynced).map(post => ({
          title: post.local.body.metadata.title,
          platform: post.remote.platform.name,
          publicUrl: post.remote.publicUrl,
          changes: post.changes,
        })),
      )
      .then(diffView),
  );

interface DiffCommandDeps {
  readonly reader: PostReader;
  readonly statusFetcher: PostStatusFetcher;
}
