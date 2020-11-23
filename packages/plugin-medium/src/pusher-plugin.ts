import { createPlugin, PostPusherPlugin, stringifyContent } from '@blogster/core';
import { httpClient } from './client';

export const pusherPlugin = createPlugin<PostPusherPlugin>(({ config }) => {
  const client = httpClient({ auth: config.env['mediumToken'] });
  return {
    publish: async local => {
      const { metadata, content } = local.body;
      const { title, coverImage, tags } = metadata;
      await client.createUserPost({
        title,
        contentFormat: 'markdown',
        content: `![${title}](${coverImage})\n\n# ${title}\n\n${stringifyContent(content)}`,
        tags,
        publishStatus: 'draft',
      });
    },

    update: async (remote, logger) => {
      logger.warn(
        'Not supported: The Medium API does not yet support updating posts.\n' +
          'Until then, the easiest way is to use the `diff` command and make changes manually.',
      );
    },
  };
});
