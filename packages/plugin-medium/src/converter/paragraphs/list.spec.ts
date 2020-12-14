import { converter } from '../converter';
import { list } from './list';

describe('converter', () => {
  describe('list', () => {
    it('should convert ordered list', async () => {
      const post = {
        value: {
          id: '',
          content: {
            bodyModel: {
              paragraphs: [
                {
                  name: '00',
                  type: 10,
                  text: 'First item',
                },
                {
                  name: '01',
                  type: 10,
                  text: 'Second item',
                },
                {
                  name: '02',
                  type: 10,
                  text: 'Third item',
                },
              ],
            },
          },
        },
      };
      const output = await converter({ paragraphs: [list()] }).convert(post);
      expect(output).toBe('1. First item\n2. Second item\n3. Third item\n\n');
    });

    it('should convert unordered list with specified bullet char', async () => {
      const post = {
        value: {
          id: '',
          content: {
            bodyModel: {
              paragraphs: [
                {
                  name: '00',
                  type: 9,
                  text: 'First item',
                },
                {
                  name: '01',
                  type: 9,
                  text: 'Second item',
                },
                {
                  name: '02',
                  type: 9,
                  text: 'Third item',
                },
              ],
            },
          },
        },
      };
      const output = await converter({ paragraphs: [list({ bullet: '*' })] }).convert(post);
      expect(output).toBe('* First item\n* Second item\n* Third item\n\n');
    });

    it('should convert unordered list with specified bullet char', async () => {
      const post = {
        value: {
          id: '',
          content: {
            bodyModel: {
              paragraphs: [
                {
                  name: '00',
                  type: 9,
                  text: 'First item',
                },
                {
                  name: '01',
                  type: 9,
                  text: 'Second item',
                },
                {
                  name: '02',
                  type: 9,
                  text: 'Third item',
                },
              ],
            },
          },
        },
      };
      const output = await converter({ paragraphs: [list()] }).convert(post);
      expect(output).toBe('- First item\n- Second item\n- Third item\n\n');
    });
  });
});
