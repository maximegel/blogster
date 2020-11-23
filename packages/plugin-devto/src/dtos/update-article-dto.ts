export interface UpdateArticleDto {
  readonly title: string;
  readonly body_markdown: string;
  readonly published?: boolean;
  readonly series?: string;
  readonly main_image?: string;
  readonly canonical_url?: string;
  readonly description?: string;
  readonly tags?: string[];
  readonly organization_id?: string;
}
