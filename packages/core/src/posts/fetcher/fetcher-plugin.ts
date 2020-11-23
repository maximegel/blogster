/* eslint-disable @typescript-eslint/no-unused-vars */
import { Plugin } from '../../plugins';
import { RemotePost, RemotePostRef } from '../post';
import { PostPlatform } from '../post-platform';

export class PostFetcherPlugin implements Plugin<{ platform: PostPlatform }> {
  metadata = { platform: { name: '' } };
  fetchRemoteRefs = (): Promise<Omit<RemotePostRef, 'platform'>[]> => Promise.resolve([]);
  fetchRemoteBody = (ref: RemotePostRef): Promise<null | RemotePost> => null;
}
