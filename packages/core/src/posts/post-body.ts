import matter from 'gray-matter';
import remark from 'remark';
import { PostContent } from './post-content';
import { PostMetadata } from './post-metadata';

export interface PostBody {
  readonly metadata: PostMetadata;
  readonly content: PostContent;
}

export function markdownBody(markdown: string, metadata?: PostMetadata): PostBody {
  const { data, content } = matter(markdown);
  // TODO: Check if `data` is a valid `PostMetadata`.
  return { metadata: metadata ?? (data as PostMetadata), content: (remark().parse(content) as unknown) as PostContent };
}
