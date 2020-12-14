import { converter } from '../converter';
import { code } from './code';

describe('converter', () => {
  describe('code', () => {
    it('should convert code', async () => {
      const post = {
        value: {
          id: '',
          content: {
            bodyModel: {
              paragraphs: [
                {
                  name: '00',
                  type: 8,
                  text: 'var s = "JavaScript syntax highlighting";\nalert(s);',
                },
              ],
            },
          },
        },
      };
      const output = await converter({ paragraphs: [code()] }).convert(post);
      expect(output).toBe('```\nvar s = "JavaScript syntax highlighting";\nalert(s);\n```\n\n');
    });
  });
});
