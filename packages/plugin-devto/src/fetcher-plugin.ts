import { createPlugin, markdownBody, newPostRef, PostFetcherPlugin } from '@blogster/core';
import { httpClient } from './client';
import { ArticleDto } from './dtos/article-dto';
import { ArticlesDto } from './dtos/articles-dto';

export const fetcherPlugin = createPlugin<PostFetcherPlugin>(({ config }) => {
  const client = httpClient({ auth: config.env['devtoApiKey'] });
  return {
    fetchRemoteRefs: async () =>
      await client.getUserArticles().then((articles: ArticlesDto) =>
        articles.map(article => ({
          ...newPostRef({ title: article.title }),
          remoteId: article.id,
          publicUrl: article.url,
        })),
      ),

    fetchRemoteBody: async ref =>
      await client.getArticle(ref.remoteId).then((article: ArticleDto) => ({
        ...ref,
        body: markdownBody(article.body_markdown, {
          title: article.title,
          description: article.description,
          tags: article.tags,
        }),
      })),
  };
});
