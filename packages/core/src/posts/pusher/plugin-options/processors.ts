import { PostProcessor, processorChain } from '../../post-processor';
import { createPusherPluginOption, PusherPluginOption } from '../pusher-plugin-option';

export const processors = (...processors: PostProcessor[]): PusherPluginOption => {
  const chain = processorChain(...processors);
  return createPusherPluginOption(inner => ({
    publish: async (local, logger) => await inner.publish(await chain.process(local), logger),
    update: async (remote, logger) => await inner.update(await chain.process(remote), logger),
  }));
};
