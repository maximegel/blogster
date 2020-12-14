/* eslint-disable @typescript-eslint/no-unused-vars */
import { Plugin } from '../../plugins';
import { RemotePostRef } from '../post';
import { PostMetadata } from '../post-metadata';

export interface RemotePostRefPayload {
  readonly id: string | number;
  readonly title: string;
  readonly publicUrl: string;
}

export interface RemotePostBodyPayload {
  readonly content: string;
  readonly metadata: PostMetadata;
}

export class PostFetcherPlugin implements Plugin<{ platform: string }> {
  metadata = { platform: '' };
  fetchRemoteRefs = (): Promise<RemotePostRefPayload[]> => Promise.resolve([]);
  fetchRemoteBody = (ref: RemotePostRef): Promise<null | RemotePostBodyPayload> => null;
}
