import { converter } from '../converter';
import { heading } from './heading';

describe('converter', () => {
  describe('heading', () => {
    it('should convert 1st level heading', async () => {
      const post = {
        value: {
          id: '',
          content: {
            bodyModel: {
              paragraphs: [
                {
                  name: '00',
                  type: 2,
                  text: 'H1',
                },
              ],
            },
          },
        },
      };
      const output = await converter({ paragraphs: [heading()] }).convert(post);
      expect(output).toBe('# H1\n\n');
    });

    it('should convert 2nd level heading', async () => {
      const post = {
        value: {
          id: '',
          content: {
            bodyModel: {
              paragraphs: [
                {
                  name: '00',
                  type: 3,
                  text: 'H2',
                },
              ],
            },
          },
        },
      };
      const output = await converter({ paragraphs: [heading()] }).convert(post);
      expect(output).toBe('## H2\n\n');
    });

    it('should convert 3th level heading', async () => {
      const post = {
        value: {
          id: '',
          content: {
            bodyModel: {
              paragraphs: [
                {
                  name: '00',
                  type: 13,
                  text: 'H3',
                },
              ],
            },
          },
        },
      };
      const output = await converter({ paragraphs: [heading()] }).convert(post);
      expect(output).toBe('### H3\n\n');
    });
  });
});
