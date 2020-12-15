import {
  createMultiPlugin,
  createPlugin,
  PostFetcherPlugin,
  RemotePostBodyPayload,
  RemotePostRefPayload,
} from '@blogster/core';
import fs from 'fs-extra';
import path from 'path';

const fixture: {
  metadata: PostFetcherPlugin['metadata'];
  fetchRemoteRefs: RemotePostRefPayload[];
  fetchRemoteBody: Record<string, RemotePostBodyPayload>;
} = fs.readJSONSync(path.join(__dirname, path.basename(__filename, '.ts') + '.json'));

export default createMultiPlugin(
  createPlugin<PostFetcherPlugin>(() => ({
    fetchRemoteRefs: () => Promise.resolve(fixture.fetchRemoteRefs),
    fetchRemoteBody: ref => Promise.resolve(fixture.fetchRemoteBody[ref.remoteId]),
  }))({ platform: 'techblog' }),
);
