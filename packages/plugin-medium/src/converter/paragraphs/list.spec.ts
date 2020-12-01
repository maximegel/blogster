import { factories } from '~testing';
import { converter } from '../converter';
import { list } from './list';

describe('converter', () => {
  describe('list', () => {
    it('should convert unordered list', async () => {
      const post = factories.dtos
        .createPost()
        .withContent(content =>
          content.withSection(section => section.withUnorderedList('First item', 'Second item', 'Third item')),
        )
        .build();
      const output = await converter({ paragraphs: [list()] }).convert(post);
      expect(output).toBe('- First item\n- Second item\n- Third item\n\n');
    });
  });
});
