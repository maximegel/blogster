import { createMetadataProcessor, PostProcessor } from '../post-processor';

export const includeTags = (...tags: string[]): PostProcessor =>
  createMetadataProcessor(metadata => ({
    ...metadata,
    tags: [...metadata.tags, ...tags],
  }));
