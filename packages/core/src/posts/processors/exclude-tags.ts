import { createMetadataProcessor, PostProcessor } from '../post-processor';

export const excludeTags = (...patterns: (string | RegExp)[]): PostProcessor =>
  createMetadataProcessor(metadata => ({
    ...metadata,
    tags:
      metadata.tags?.filter(tag =>
        patterns.every(pattern => !(typeof pattern === 'string' ? pattern === tag : pattern.test(tag))),
      ) ?? [],
  }));
