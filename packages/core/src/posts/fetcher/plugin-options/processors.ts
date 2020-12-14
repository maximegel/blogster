import { markdownBody, stringifyContent } from '../../';
import { PostProcessor, processorChain } from '../../post-processor';
import { createFetcherPluginOption, FetcherPluginOption } from '../fetcher-plugin-option';

export const processors = (...processors: PostProcessor[]): FetcherPluginOption => {
  const chain = processorChain(...processors);
  return createFetcherPluginOption(inner => ({
    fetchRemoteBody: async ref =>
      await inner
        .fetchRemoteBody(ref)
        .then(payload => (!payload ? null : chain.process({ body: markdownBody(payload.content, payload.metadata) })))
        .then(post => ({ content: stringifyContent(post.body.content), metadata: post.body.metadata })),
  }));
};
