export type ArticlesDto = {
  readonly id: number;
  readonly title: string;
  readonly description: string;
  readonly cover_image?: string;
  readonly tag_list: string[];
  readonly url: string;
  readonly body_markdown: string;
}[];
