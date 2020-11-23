export interface CreatePostDto {
  readonly title: string;
  readonly contentFormat: 'html' | 'markdown';
  readonly content: string;
  readonly tags?: string[];
  readonly canonicalUrl?: string;
  readonly publishStatus?: 'public' | 'draft' | 'unlisted';
  readonly license?:
    | 'all-rights-reserved'
    | 'cc-40-by'
    | 'cc-40-by-sa'
    | 'cc-40-by-nd'
    | 'cc-40-by-nc'
    | 'cc-40-by-nc-nd'
    | 'cc-40-by-nc-sa'
    | 'cc-40-zero'
    | 'public-domain';
  readonly notifyFollowers?: boolean;
}
