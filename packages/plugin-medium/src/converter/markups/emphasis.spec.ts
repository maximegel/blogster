import { converter } from '../converter';
import { text } from '../paragraphs/text';
import { emphasis } from './emphasis';

describe('converter', () => {
  describe('emphasis', () => {
    it('should convert emphased text with asterisks', async () => {
      const marked = 'asterisks';
      const str = `Emphasis, aka italics, with ${marked}`;
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
                      type: 2,
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
      const output = await converter({ paragraphs: [text()], markups: [emphasis()] }).convert(post);
      expect(output).toBe('Emphasis, aka italics, with *asterisks*\n\n');
    });

    it('should convert emphased text with underscores', async () => {
      const marked = 'underscores';
      const str = `Emphasis, aka italics, with ${marked}`;
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
                      type: 2,
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
      const output = await converter({ paragraphs: [text()], markups: [emphasis({ marker: '_' })] }).convert(post);
      expect(output).toBe('Emphasis, aka italics, with _underscores_\n\n');
    });
  });
});
