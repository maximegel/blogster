import { isPublished, isUnpublished, PostReader, PostStatusFetcher } from '@blogster/core';
import { Command, createCommand } from 'commander';
import { globsArgument, GlobsArgument } from '../../shared/arguments';
import { platformsOption, PlatformsOption } from '../../shared/options';
import { statusView } from './status-view';

export interface StatusCommandDeps {
  readonly reader: PostReader;
  readonly statusFetcher: PostStatusFetcher;
}

const runner = ({ reader, statusFetcher }: StatusCommandDeps) => async (
  globs?: GlobsArgument,
  options?: PlatformsOption,
) =>
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
    .then(statusView);

export const statusCommand = (deps: StatusCommandDeps): Command =>
  createCommand('status')
    .arguments(globsArgument.name)
    .description('Outputs the status of each post i.e. "unpublished", "synced" or "desynced".', {
      ...globsArgument.description,
    })
    .customOption(platformsOption)
    .action(runner(deps)) as Command;
