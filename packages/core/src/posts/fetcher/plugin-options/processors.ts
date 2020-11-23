import { PostProcessor, processorChain } from '../../post-processor';
import { createFetcherPluginOption, FetcherPluginOption } from '../fetcher-plugin-option';

export const processors = (...processors: PostProcessor[]): FetcherPluginOption => {
  const chain = processorChain(...processors);
  return createFetcherPluginOption(inner => ({
    fetchRemoteBody: async ref => await inner.fetchRemoteBody(ref).then(post => (!post ? null : chain.process(post))),
  }));
};
