import { PostPusherPlugin } from './pusher-plugin';

export type PusherPluginOption = (plugin: PostPusherPlugin) => PostPusherPlugin;

export const createPusherPluginOption = (
  fn: (plugin: PostPusherPlugin) => Partial<PostPusherPlugin>,
): PusherPluginOption => plugin => ({
  metadata: plugin.metadata,
  publish: plugin.publish,
  update: plugin.update,
  ...fn(plugin),
});
