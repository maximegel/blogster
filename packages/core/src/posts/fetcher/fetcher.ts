import _ from 'lodash';
import { LocalPost, RemotePost, RemotePostRef } from '../post';
import { platformEquals, PostPlatform } from '../post-platform';
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
      : plugins.filter(({ metadata }) => options.platforms.includes(metadata.platform.name));
  return {
    async fetchRemoteRefs(locals, options?: PostFetcherOptions): Promise<[LocalPost, RemotePostRef[]][]> {
      const remoteRefByPlugin = await Promise.all(
        getPlugins(options).map(async plugin => {
          const { platform } = plugin.metadata;
          return await plugin
            .fetchRemoteRefs()
            .then(refs => refs.map(ref => ({ ...ref, platform })))
            .catch(err => {
              throw new Error(
                `Failed to fetch post references from "${platform.name}" with message: ` +
                  `${(err?.message ?? err).trim()}`,
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
      const plugin = getPlugins(options).find(({ metadata }) => platformEquals(metadata.platform, ref.platform));
      return plugin.fetchRemoteBody(ref).catch(err => {
        throw new Error(
          `Failed to fetch post "${ref.normalizedTitle}" from "${ref.platform.name}" with message: ` +
            `${(err?.message ?? err).trim()}`,
        );
      });
    },

    platforms: (options?: PostFetcherOptions) => getPlugins(options).map(({ metadata }) => metadata.platform),
  };
};
