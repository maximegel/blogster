import { converter } from '../converter';
import { text } from '../paragraphs/text';
import { inlineCode } from './inline-code';

describe('converter', () => {
  describe('inline code', () => {
    it('should convert inline code', async () => {
      const marked = 'back-ticks around';
      const str = `Inline code has ${marked} it.`;
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
                      type: 10,
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
      const output = await converter({ paragraphs: [text()], markups: [inlineCode()] }).convert(post);
      expect(output).toBe('Inline code has `back-ticks around` it.\n\n');
    });
  });
});
