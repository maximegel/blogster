import { createPlugin, PostPusherPlugin, stringifyContent } from '@blogster/core';
import { httpClient } from './client';

export const pusherPlugin = createPlugin<PostPusherPlugin>(({ config }) => {
  const client = httpClient({ auth: config.env['devtoApiKey'] });
  return {
    publish: async local => {
      const { metadata, content } = local.body;
      const { title, coverImage: featuredImage, description, tags } = metadata;
      await client.createUserArticle({
        title,
        body_markdown: stringifyContent(content),
        published: false,
        main_image: featuredImage,
        description: description,
        tags,
      });
    },

    update: async remote => {
      const { metadata, content } = remote.body;
      const { title, coverImage, description, tags } = metadata;
      await client.updateArticle(remote.remoteId, {
        title,
        body_markdown: stringifyContent(content),
        main_image: coverImage,
        description: description,
        tags,
      });
    },
  };
});
