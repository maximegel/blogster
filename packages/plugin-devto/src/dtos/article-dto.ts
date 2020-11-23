export interface ArticleDto {
  readonly id: number;
  readonly title: string;
  readonly description: string;
  readonly cover_image?: string;
  readonly tags: string[];
  readonly url: string;
  readonly body_markdown: string;
}
