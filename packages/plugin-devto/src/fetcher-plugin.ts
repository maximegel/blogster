import { createPlugin, PostFetcherPlugin } from '@blogster/core';
import { httpClient } from './client';
import { ArticleDto } from './dtos/article-dto';
import { ArticlesDto } from './dtos/articles-dto';

export const fetcherPlugin = createPlugin<PostFetcherPlugin>(({ config }) => {
  const client = httpClient({ auth: config.env['devtoApiKey'] });
  return {
    fetchRemoteRefs: async () =>
      await client.getUserArticles().then((articles: ArticlesDto) =>
        articles.map(article => ({
          id: article.id,
          title: article.title,
          publicUrl: article.url,
        })),
      ),

    fetchRemoteBody: async ref =>
      await client.getArticle(ref.remoteId).then((article: ArticleDto) => ({
        content: article.body_markdown,
        metadata: {
          title: article.title,
          description: article.description,
          tags: article.tags,
        },
      })),
  };
});
