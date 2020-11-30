import {
  isUnpublished,
  isUnpublishedOrDesynced,
  Logger,
  PostPusher,
  PostReader,
  PostStatusFetcher,
} from '@blogster/core';
import { Command, createCommand } from 'commander';
import { globsArgument, GlobsArgument } from '../../shared/arguments';
import { PlatformsOption, platformsOption } from '../../shared/options';
import { pushView } from './push-view';

export interface PushCommandDeps {
  readonly reader: PostReader;
  readonly statusFetcher: PostStatusFetcher;
  readonly pusher: PostPusher;
}

const runner = ({ reader, statusFetcher, pusher }: PushCommandDeps) => async (
  globs?: GlobsArgument,
  options?: PlatformsOption,
) =>
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
    .then(pushView);

export const pushCommand = (deps: PushCommandDeps): Command =>
  createCommand('push')
    .arguments(globsArgument.name)
    .description(
      'Publishes or updates posts.\nPosts will be published as draft so you can review them before really publishing them.',
      { ...globsArgument.description },
    )
    .customOption(platformsOption)
    .action(runner(deps)) as Command;
