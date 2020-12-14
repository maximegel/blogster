import { PostContentDto } from './post-content-dto';

export interface PostDto {
  readonly value: {
    readonly id: string;
    readonly slug?: string;
    readonly title?: string;
    readonly canonicalUrl?: string;
    readonly content: PostContentDto;
    readonly virtuals?: {
      readonly previewImage: {
        readonly imageId: string;
      };
      readonly tags: {
        readonly slug: string;
      }[];
    };
  };
  readonly mentionedUsers?: {
    readonly userId: string;
    readonly username?: string;
    readonly twitterScreenName?: string;
  }[];
}
