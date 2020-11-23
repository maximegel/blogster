import { PostFetcherPlugin } from './fetcher-plugin';

export type FetcherPluginOption = (plugin: PostFetcherPlugin) => PostFetcherPlugin;

export const createFetcherPluginOption = (
  fn: (plugin: PostFetcherPlugin) => Partial<PostFetcherPlugin>,
): FetcherPluginOption => plugin => ({
  metadata: plugin.metadata,
  fetchRemoteRefs: plugin.fetchRemoteRefs,
  fetchRemoteBody: plugin.fetchRemoteBody,
  ...fn(plugin),
});
