import { LocalPost, RemotePost } from '../post';
import { PostFetcher, PostFetcherOptions } from './fetcher';

export const fetchRemotes = (fetcher: PostFetcher) => async (
  locals: LocalPost[],
  options?: PostFetcherOptions,
): Promise<[LocalPost, RemotePost[]][]> => {
  const pairs = await fetcher.fetchRemoteRefs(locals, options);
  return await Promise.all(
    pairs.map(
      async ([local, remoteRefs]) =>
        [local, await Promise.all(remoteRefs.map(ref => fetcher.fetchRemoteBody(ref, options)))] as [
          LocalPost,
          RemotePost[],
        ],
    ),
  );
};
