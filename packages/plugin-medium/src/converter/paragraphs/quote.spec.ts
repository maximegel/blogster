import { converter } from '../converter';
import { quote } from './quote';

describe('converter', () => {
  describe('quote', () => {
    it('should convert quote', async () => {
      const post = {
        value: {
          id: '',
          content: {
            bodyModel: {
              paragraphs: [
                {
                  name: '00',
                  type: 6,
                  text: 'Lorem ipsum dolor sit amet consectetur adipiscing, elit duis enim suspendisse risus magnis.',
                },
              ],
            },
          },
        },
      };
      const output = await converter({ paragraphs: [quote()] }).convert(post);
      expect(output).toBe(
        '> Lorem ipsum dolor sit amet consectetur adipiscing, elit duis enim suspendisse risus magnis.\n\n',
      );
    });

    it('should convert large quote', async () => {
      const post = {
        value: {
          id: '',
          content: {
            bodyModel: {
              paragraphs: [
                {
                  name: '00',
                  type: 7,
                  text: 'Lorem ipsum dolor sit amet consectetur adipiscing, elit duis enim suspendisse risus magnis.',
                },
              ],
            },
          },
        },
      };
      const output = await converter({ paragraphs: [quote()] }).convert(post);
      expect(output).toBe(
        '> ## Lorem ipsum dolor sit amet consectetur adipiscing, elit duis enim suspendisse risus magnis.\n\n',
      );
    });
  });
});
