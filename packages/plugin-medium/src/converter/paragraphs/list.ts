import _ from 'lodash';
import { ChainedParagraphConverter, createParagraphConverter } from '../paragraph-converter';

export const list = (options?: { bullet?: '-' | '+' | '*' }): ChainedParagraphConverter =>
  createParagraphConverter(() => ({
    canConvert: ({ paragraph }) => [9, 10].includes(paragraph.type),
    convert: ({ marked, paragraph, paragraphs }) => {
      const index = paragraphs.findIndex(p => p.name === paragraph.name);
      const num = () =>
        _(paragraphs)
          .slice(0, index)
          .takeRightWhile(p => p.type === paragraph.type)
          .reduce(n => n + 1, 1);
      const out: string[] = [];
      // Prefixes with a bullet for unordered lists of with a number for ordered lists.
      out.push(paragraph.type === 9 ? `${options.bullet} ` : `${num()}. `);
      out.push(marked);
      out.push('\n');
      // Appends an empty line after the last item.
      if (paragraphs[index + 1].type !== paragraph.type) out.push('\n');
      return out;
    },
  }));
