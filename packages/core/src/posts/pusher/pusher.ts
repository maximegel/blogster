import { Logger, noopLogger } from '../../logger';
import { platformEquals } from '../post-platform';
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
      ? plugins.find(plugin => platformEquals(plugin.metadata.platform, post.platform))?.publish(post.local, logger)
      : plugins
          .find(plugin => platformEquals(plugin.metadata.platform, post.remote.platform))
          ?.update({ ...post.remote, body: post.local.body }, logger),
});
