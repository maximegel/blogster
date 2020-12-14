import { Logger, noopLogger } from '../../logger';
import { DesyncedPost, isUnpublished, PostStatus, UnpublishedPost } from '../post-status';
import { PostPusherPlugin } from './pusher-plugin';

export interface PostPusher {
  push(status: PostStatus, logger?: Logger): Promise<void>;
}

export interface PostPusherDeps {
  readonly plugins: PostPusherPlugin[];
}

export const pusher = ({ plugins }: PostPusherDeps): PostPusher => ({
  push: (post: UnpublishedPost | DesyncedPost, logger: Logger = noopLogger): Promise<void> =>
    isUnpublished(post)
      ? plugins.find(plugin => plugin.metadata.platform, post.platform.name)?.publish(post.local, logger)
      : plugins
          .find(plugin => plugin.metadata.platform, post.remote.platform.name)
          ?.update({ ...post.remote, body: post.local.body }, logger),
});
