import _ from 'lodash';
import { LocalPost, newPostRef, RemotePost, RemotePostRef } from '../post';
import { markdownBody } from '../post-body';
import { PostPlatform } from '../post-platform';
import { PostFetcherPlugin } from './fetcher-plugin';

export interface PostFetcher {
  fetchRemoteRefs(locals: LocalPost[], options?: PostFetcherOptions): Promise<[LocalPost, RemotePostRef[]][]>;
  fetchRemoteBody(ref: RemotePostRef, options?: PostFetcherOptions): Promise<RemotePost>;
  platforms(options?: PostFetcherOptions): PostPlatform[];
}

export interface PostFetcherDeps {
  readonly plugins: PostFetcherPlugin[];
}

export interface PostFetcherOptions {
  readonly platforms?: string[];
}

export const fetcher = ({ plugins }: PostFetcherDeps): PostFetcher => {
  const getPlugins = (options?: PostFetcherOptions) =>
    !options?.platforms?.length
      ? plugins
      : plugins.filter(({ metadata }) => options.platforms.includes(metadata.platform));
  return {
    async fetchRemoteRefs(locals, options?: PostFetcherOptions): Promise<[LocalPost, RemotePostRef[]][]> {
      const remoteRefByPlugin = await Promise.all(
        getPlugins(options).map(async plugin => {
          const { platform } = plugin.metadata;
          return await plugin
            .fetchRemoteRefs()
            .then(refs =>
              refs.map(ref => ({ ...ref, ...newPostRef(ref), remoteId: ref.id, platform: { name: platform } })),
            )
            .catch(err => {
              throw new Error(
                `Failed to fetch post references from "${platform}" with message: ` + `${(err?.message ?? err).trim()}`,
              );
            });
        }),
      );
      const remoteRefsByTitle = _(remoteRefByPlugin)
        .flatMap(refs => refs)
        .groupBy('normalizedTitle')
        .value();
      const pairs = locals.map(
        localRef => [localRef, remoteRefsByTitle[localRef.normalizedTitle] ?? []] as [LocalPost, RemotePostRef[]],
      );
      return pairs;
    },

    async fetchRemoteBody(ref, options?: PostFetcherOptions) {
      const plugin = getPlugins(options).find(({ metadata }) => metadata.platform === ref.platform.name);
      return plugin
        .fetchRemoteBody(ref)
        .then(({ content, metadata }) => ({ ...ref, body: markdownBody(content, metadata) }))
        .catch(err => {
          throw new Error(
            `Failed to fetch post "${ref.normalizedTitle}" from "${ref.platform.name}" with message: ` +
              `${(err?.message ?? err).trim()}`,
          );
        });
    },

    platforms: (options?: PostFetcherOptions) =>
      getPlugins(options).map(({ metadata }) => ({ name: metadata.platform })),
  };
};
