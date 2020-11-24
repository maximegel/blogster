import { createPlugin, markdownBody, newPostRef, PostFetcherPlugin } from '@blogster/core';
import { httpClient } from './client';
import { converter, markups, paragraphs } from './converter';
import { linkUrlResolvers } from './converter/markups/link';
import { embedResolvers } from './converter/paragraphs/embed';

export const fetcherPlugin = createPlugin<PostFetcherPlugin>(({ config }) => {
  const client = httpClient({ auth: config.env['mediumToken'] });
  return {
    fetchRemoteRefs: async () =>
      await client.getUserPosts().then(posts =>
        posts.map(post => ({
          ...newPostRef({ title: post.title }),
          remoteId: post.id,
          publicUrl: `https://medium.com/p/${post.id}`,
        })),
      ),

    fetchRemoteBody: async ref =>
      await client.getPost(ref.remoteId).then(async dto => {
        const markdown = await converter({
          paragraphs: [
            paragraphs.text(),
            paragraphs.heading(),
            paragraphs.list(),
            paragraphs.codeBlock(),
            paragraphs.quote(),
            paragraphs.embed(client, { resolvers: [embedResolvers.gist()] }),
          ],
          markups: [
            markups.strong(),
            markups.emphasis(),
            markups.inlineCode(),
            markups.link({
              urlResolvers: [
                linkUrlResolvers.twitterProfile(),
                linkUrlResolvers.mediumProfile(),
                linkUrlResolvers.mediumRedirect(),
              ],
            }),
          ],
        }).convert(dto);
        return {
          ...ref,
          body: markdownBody(markdown, {
            title: dto.value.title,
            description: dto.value.content.subtitle,
            // TODO: Use a processor for tags filtering.
            tags: dto.value.virtuals.tags.map(tag => tag.slug).filter(tag => tag !== 'programming'),
          }),
        };
      }),
  };
});
