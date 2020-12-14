import { isPublished, isUnpublished, PostReader, PostStatusFetcher } from '@blogster/core';
import { Command, createCommand } from '../../core';
import { globs, GlobsArgument } from '../../shared/arguments';
import { platforms, PlatformsOption } from '../../shared/options';
import { statusView } from './status-view';

export const statusCommand: Command<StatusCommandDeps> = createCommand('status')
  .argument(globs)
  .description('Outputs the status of each post i.e. "unpublished", "synced" or "desynced".')
  .option(platforms)
  .handler(({ reader, statusFetcher }: StatusCommandDeps) => async (globs?: GlobsArgument, options?: PlatformsOption) =>
    await reader
      .read(globs)
      .then(locals => statusFetcher.fetchStatuses(locals, options))
      .then(posts =>
        posts.map(post => ({
          title: post.local.body.metadata.title,
          status: post.type,
          platform: isUnpublished(post) ? post.platform.name : isPublished(post) ? post.remote.platform.name : '',
          publicUrl: isUnpublished(post) ? null : isPublished(post) ? post.remote.publicUrl : null,
        })),
      )
      .then(statusView),
  );

interface StatusCommandDeps {
  readonly reader: PostReader;
  readonly statusFetcher: PostStatusFetcher;
}
