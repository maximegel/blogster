import _ from 'lodash';
import { createMetadataProcessor, PostProcessor } from '../post-processor';

export const excludeMetadata = (...keys: string[]): PostProcessor =>
  createMetadataProcessor(metadata => ({ ..._.omit(metadata, keys), title: metadata.title }));
