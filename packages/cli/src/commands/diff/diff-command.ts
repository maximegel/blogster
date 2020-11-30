import { isDesynced, PostReader, PostStatusFetcher } from '@blogster/core';
import { Command, createCommand } from 'commander';
import { globsArgument, GlobsArgument } from '../../shared/arguments';
import { PlatformsOption, platformsOption } from '../../shared/options';
import { diffView } from './diff-view';

export interface DiffCommandDeps {
  readonly reader: PostReader;
  readonly statusFetcher: PostStatusFetcher;
}

const runner = ({ reader, statusFetcher }: DiffCommandDeps) => async (
  globs: GlobsArgument,
  options?: PlatformsOption,
) =>
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
    .then(diffView);

export const diffCommand = (deps: DiffCommandDeps): Command =>
  createCommand('diff')
    .arguments(globsArgument.name)
    .description('Outputs changes between post files and published posts in diff format.', {
      ...globsArgument.description,
    })
    .customOption(platformsOption)
    .action(runner(deps)) as Command;
