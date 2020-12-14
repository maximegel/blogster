import { converter } from '../../converter';
import { text } from '../../paragraphs/text';
import { link } from './link';
import { mediumAccount, twitterAccount } from './url-resolvers';

describe('converter', () => {
  describe('link', () => {
    it('should convert inline-style link', async () => {
      const marked = "I'm an inline-style link";
      const str = `${marked}.`;
      const href = 'https://www.google.com';
      const post = {
        value: {
          id: '',
          content: {
            bodyModel: {
              paragraphs: [
                {
                  name: '00',
                  type: 1,
                  text: str,
                  markups: [
                    {
                      type: 3,
                      start: str.indexOf(marked),
                      end: str.indexOf(marked) + marked.length,
                      href,
                    },
                  ],
                },
              ],
            },
          },
        },
      };
      const output = await converter({ paragraphs: [text()], markups: [link()] }).convert(post);
      expect(output).toBe(`[I'm an inline-style link](${href}).\n\n`);
    });

    it('should convert inline-style link with title', async () => {
      const marked = "I'm an inline-style link with title";
      const str = `${marked}.`;
      const href = 'https://www.google.com';
      const title = "Google's Homepage";
      const post = {
        value: {
          id: '',
          content: {
            bodyModel: {
              paragraphs: [
                {
                  name: '00',
                  type: 1,
                  text: str,
                  markups: [
                    {
                      type: 3,
                      start: str.indexOf(marked),
                      end: str.indexOf(marked) + marked.length,
                      href,
                      title,
                    },
                  ],
                },
              ],
            },
          },
        },
      };
      const output = await converter({ paragraphs: [text()], markups: [link()] }).convert(post);
      expect(output).toBe(`[I'm an inline-style link with title](${href} "${title}").\n\n`);
    });

    it('should convert inline-style medium account link', async () => {
      const marked = '@maximegel';
      const str = `My medium account is: ${marked}`;
      const userId = '000';
      const username = 'maximegel';
      const post = {
        value: {
          id: '',
          content: {
            bodyModel: {
              paragraphs: [
                {
                  name: '00',
                  type: 1,
                  text: str,
                  markups: [
                    {
                      type: 3,
                      start: str.indexOf(marked),
                      end: str.indexOf(marked) + marked.length,
                      userId,
                    },
                  ],
                },
              ],
            },
          },
        },
        mentionedUsers: [{ userId, username }],
      };
      const output = await converter({
        paragraphs: [text()],
        markups: [link({ urlResolvers: [mediumAccount()] })],
      }).convert(post);
      expect(output).toBe(`My medium account is: [@maximegel](https://medium.com/@${username})\n\n`);
    });

    it('should convert inline-style twitter account link', async () => {
      const marked = '@maximegel';
      const str = `My twitter account is: ${marked}`;
      const userId = '000';
      const twitterScreenName = 'maximegel';
      const post = {
        value: {
          id: '',
          content: {
            bodyModel: {
              paragraphs: [
                {
                  name: '00',
                  type: 1,
                  text: str,
                  markups: [
                    {
                      type: 3,
                      start: str.indexOf(marked),
                      end: str.indexOf(marked) + marked.length,
                      userId,
                    },
                  ],
                },
              ],
            },
          },
        },
        mentionedUsers: [{ userId, twitterScreenName }],
      };
      const output = await converter({
        paragraphs: [text()],
        markups: [link({ urlResolvers: [twitterAccount()] })],
      }).convert(post);
      expect(output).toBe(`My twitter account is: [@maximegel](https://twitter.com/${twitterScreenName})\n\n`);
    });
  });
});
