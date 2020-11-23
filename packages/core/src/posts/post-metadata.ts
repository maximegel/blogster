export interface PostMetadata {
  readonly title: string;
  readonly description?: string;
  readonly coverImage?: string;
  readonly tags?: string[];
  readonly [key: string]: unknown;
}
