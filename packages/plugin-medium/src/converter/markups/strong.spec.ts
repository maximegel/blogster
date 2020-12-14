import { converter } from '../converter';
import { text } from '../paragraphs/text';
import { strong } from './strong';

describe('converter', () => {
  describe('strong', () => {
    it('should convert strong text with asterisks', async () => {
      const marked = 'asterisks';
      const str = `Strong emphasis, aka bold, with ${marked}`;
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
                      type: 1,
                      start: str.indexOf(marked),
                      end: str.indexOf(marked) + marked.length,
                    },
                  ],
                },
              ],
            },
          },
        },
      };
      const output = await converter({ paragraphs: [text()], markups: [strong()] }).convert(post);
      expect(output).toBe('Strong emphasis, aka bold, with **asterisks**\n\n');
    });

    it('should convert strong text with underscores', async () => {
      const marked = 'underscores';
      const str = `Strong emphasis, aka bold, with ${marked}`;
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
                      type: 1,
                      start: str.indexOf(marked),
                      end: str.indexOf(marked) + marked.length,
                    },
                  ],
                },
              ],
            },
          },
        },
      };
      const output = await converter({ paragraphs: [text()], markups: [strong({ marker: '__' })] }).convert(post);
      expect(output).toBe('Strong emphasis, aka bold, with __underscores__\n\n');
    });
  });
});
