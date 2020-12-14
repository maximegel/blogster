import _ from 'lodash';
import { Post } from '../post';
import { createMetadataProcessor, PostProcessor } from '../post-processor';

const normalize = (str: string) => _.kebabCase(str).replace(/-/g, '');

export const matchTagsWith = (other: Post): PostProcessor =>
  createMetadataProcessor(metadata => {
    const otherTags = other.body.metadata.tags ?? [];
    const tags = metadata.tags?.map(tag => otherTags.find(otherTag => normalize(tag) === normalize(otherTag)) ?? tag);
    if (!tags?.length) return metadata;
    return { ...metadata, tags };
  });
