import { PostParagraphDto } from './post-paragraph-dto';

export interface PostDto {
  readonly value: {
    readonly id: string;
    readonly slug: string;
    readonly title: string;
    readonly canonicalUrl: string;
    readonly content: {
      readonly subtitle: string;
      readonly bodyModel: {
        readonly paragraphs: PostParagraphDto[];
        readonly sections: {
          readonly name: string;
          readonly startIndex: number;
        }[];
      };
    };
    readonly virtuals: {
      readonly previewImage: {
        readonly imageId: string;
      };
      readonly tags: {
        readonly slug: string;
      }[];
    };
  };
  readonly mentionedUsers: {
    readonly userId: string;
    readonly username: string;
    readonly twitterScreenName: string;
  }[];
}
