/* eslint-disable @typescript-eslint/no-unused-vars */
import { Logger } from '../../logger';
import { Plugin } from '../../plugins';
import { LocalPost, RemotePost } from '../post';

export class PostPusherPlugin implements Plugin<{ platform: string }> {
  metadata = { platform: '' };
  publish = (local: LocalPost, logger: Logger): Promise<void> => Promise.resolve();
  update = (remote: RemotePost, logger: Logger): Promise<void> => Promise.resolve();
}
