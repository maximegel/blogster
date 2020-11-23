import { diffLines } from 'diff';
import _ from 'lodash';
import { fetchRemotes, PostFetcher, PostFetcherOptions } from './fetcher';
import { LocalPost, LocalPostRef, RemotePost } from './post';
import { PostFormatter } from './post-formatter';
import { PostPlatform } from './post-platform';
import { PostProcessor, processorChain } from './post-processor';
import { newDesyncedPost, newSyncedPost, newUnpublishedPost, PostStatus } from './post-status';
import { PostStringifier } from './post-stringifier';
import { arrangeMetadataLike, matchTagsWith } from './processors';

export interface PostStatusFetcher {
  fetchStatuses(locals: LocalPostRef[], options?: PostFetcherOptions): Promise<PostStatus[]>;
}
export interface PostStatusFetcherDeps {
  fetcher: PostFetcher;
  processor: PostProcessor;
  stringifier: PostStringifier;
  formatter: PostFormatter;
}

export const statusFetcher = (deps: PostStatusFetcherDeps): PostStatusFetcher => ({
  fetchStatuses: async (locals: LocalPost[], options?: PostFetcherOptions): Promise<PostStatus[]> => {
    const { fetcher } = deps;
    const pairs = await fetchRemotes(fetcher)(locals, options);
    const deep = await Promise.all(
      pairs.map(async pair =>
        (await getPublishedStatuses(deps)(pair)).concat(getUnpublishedStatuses(fetcher.platforms(options))(pair)),
      ),
    );
    return _.flatMap(deep, statuses => statuses);
  },
});

const getPublishedStatuses = ({ processor, stringifier, formatter }: PostStatusFetcherDeps) => async ([
  local,
  remotes,
]: [local: LocalPost, remotes: RemotePost[]]): Promise<PostStatus[]> =>
  await Promise.all(
    remotes.map(async remote => {
      const localStr = stringifier.stringify(await processor.process(local), formatter);
      const remoteStr = stringifier.stringify(
        await processorChain(matchTagsWith(local), arrangeMetadataLike(local), processor).process(remote),
        formatter,
      );

      const changes = diffLines(remoteStr, localStr);
      const hasChanged = changes?.some(({ added, removed }) => added || removed);
      return hasChanged ? newDesyncedPost({ local, remote, changes }) : newSyncedPost({ local, remote });
    }),
  );

const getUnpublishedStatuses = (platforms: PostPlatform[]) => ([local, remotes]: [
  local: LocalPost,
  remotes: RemotePost[],
]): PostStatus[] =>
  _(platforms)
    .differenceBy(
      remotes.map(remote => remote.platform),
      platform => platform.name,
    )
    .map(platform => newUnpublishedPost({ local, platform }))
    .value();
