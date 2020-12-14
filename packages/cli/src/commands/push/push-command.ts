import {
  isUnpublished,
  isUnpublishedOrDesynced,
  Logger,
  PostPusher,
  PostReader,
  PostStatusFetcher,
} from '@blogster/core';
import { Command, createCommand } from '../../core';
import { globs, GlobsArgument } from '../../shared/arguments';
import { platforms, PlatformsOption } from '../../shared/options';
import { pushView } from './push-view';

export const pushCommand: Command<PushCommandDeps> = createCommand('push')
  .argument(globs)
  .description(
    'Publishes or updates posts.\n' +
      'Posts will be published as draft so you can review them before really publishing them.',
  )
  .option(platforms)
  .handler(
    ({ reader, statusFetcher, pusher }: PushCommandDeps) => async (globs?: GlobsArgument, options?: PlatformsOption) =>
      await reader
        .read(globs)
        .then(locals => statusFetcher.fetchStatuses(locals, options))
        .then(posts =>
          posts.filter(isUnpublishedOrDesynced).map(post => ({
            action: isUnpublished(post) ? 'publish' : 'update',
            title: post.local.body.metadata.title,
            platform: isUnpublished(post) ? post.platform.name : post.remote.platform.name,
            publicUrl: isUnpublished(post) ? null : post.remote.publicUrl,
            promise: (logger: Logger) => pusher.push(post, logger),
          })),
        )
        .then(pushView),
  );

interface PushCommandDeps {
  readonly reader: PostReader;
  readonly statusFetcher: PostStatusFetcher;
  readonly pusher: PostPusher;
}
