export interface PostParagraphMarkupDto {
  readonly type: number;
  readonly start: number;
  readonly end: number;
  readonly href?: string;
  readonly title?: string;
  readonly rel?: string;
  readonly anchorType?: number;
  readonly userId?: string;
}
