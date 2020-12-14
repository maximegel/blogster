import { httpClient } from '../../../client';
import { converter } from '../../converter';
import { embed } from './embed';
import { gist } from './resolvers';

describe('converter', () => {
  describe('embed', () => {
    it('should convert embeded gist script', async () => {
      const mediaResourceId = '000';
      const post = {
        value: {
          id: '',
          content: {
            bodyModel: {
              paragraphs: [
                {
                  name: '00',
                  type: 11,
                  iframe: { mediaResourceId },
                },
              ],
            },
          },
        },
      };
      const domain = 'gist.github.com';
      const file = 'foo.js';
      const gistId = '0000';
      const githubUsername = 'maximegel';
      const gistScriptUrl = `https://${domain}/${githubUsername}/${gistId}.js?file=${file}`;
      const client = {
        ...httpClient(),
        getMedia: jest.fn().mockResolvedValue({
          value: {
            mediaResourceId,
            href: `https://${domain}/${gistId}?file=${file}`,
            domain,
            gist: { gistId, githubUsername, gistScriptUrl },
          },
        }),
      };
      const output = await converter({ paragraphs: [embed(client, { resolvers: [gist()] })] }).convert(post);
      expect(output).toBe(`<script src="${gistScriptUrl}"></script>\n\n`);
    });
  });
});
