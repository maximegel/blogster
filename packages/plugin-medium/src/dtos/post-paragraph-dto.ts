import { PostParagraphMarkupDto } from './post-paragraph-markup-dto';

export interface PostParagraphDto {
  readonly name: string;
  readonly type: number;
  readonly text?: string;
  readonly markups?: PostParagraphMarkupDto[];
  readonly layout?: number;
  readonly metadata?: Record<string, unknown>;
  readonly iframe?: {
    readonly mediaResourceId: string;
  };
}
