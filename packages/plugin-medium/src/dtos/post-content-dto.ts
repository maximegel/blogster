import { PostParagraphDto } from './post-paragraph-dto';
import { PostSectionDto } from './post-section-dto';

export interface PostContentDto {
  readonly subtitle: string;
  readonly bodyModel: {
    readonly paragraphs: PostParagraphDto[];
    readonly sections: PostSectionDto[];
  };
}
