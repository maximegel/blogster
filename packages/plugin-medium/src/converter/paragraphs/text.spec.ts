import { converter } from '../converter';
import { text } from './text';

describe('converter', () => {
  describe('text', () => {
    it('should convert text', async () => {
      const post = {
        value: {
          id: '',
          content: {
            bodyModel: {
              paragraphs: [
                {
                  name: '00',
                  type: 1,
                  text: 'Lorem ipsum dolor sit amet consectetur adipiscing, elit duis enim suspendisse risus magnis.',
                },
              ],
            },
          },
        },
      };
      const output = await converter({ paragraphs: [text()] }).convert(post);
      expect(output).toBe(
        'Lorem ipsum dolor sit amet consectetur adipiscing, elit duis enim suspendisse risus magnis.\n\n',
      );
    });
  });
});
