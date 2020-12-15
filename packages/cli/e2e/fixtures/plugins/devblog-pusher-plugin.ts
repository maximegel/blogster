import { createMultiPlugin, createPlugin, PostPusherPlugin } from '@blogster/core';

export default createMultiPlugin(
  createPlugin<PostPusherPlugin>(() => ({
    publish: () => Promise.resolve(),
    update: () => Promise.resolve(),
  }))({ platform: 'devblog' }),
);
