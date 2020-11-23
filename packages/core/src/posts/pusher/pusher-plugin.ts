/* eslint-disable @typescript-eslint/no-unused-vars */
import { Logger } from '../../logger';
import { Plugin } from '../../plugins';
import { LocalPost, RemotePost } from '../post';
import { PostPlatform } from '../post-platform';

export class PostPusherPlugin implements Plugin<{ platform: PostPlatform }> {
  metadata = { platform: { name: '' } };
  publish = (local: LocalPost, logger: Logger): Promise<void> => Promise.resolve();
  update = (remote: RemotePost, logger: Logger): Promise<void> => Promise.resolve();
}
