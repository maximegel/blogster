import { ChainedParagraphConverter, createParagraphConverter } from '../paragraph-converter';

export const heading = (): ChainedParagraphConverter =>
  createParagraphConverter(() => ({
    canConvert: ({ paragraph }) => [2, 3, 13].includes(paragraph.type),
    convert: ({ marked, paragraph }) => {
      const prefix = paragraph.type === 2 ? '#' : paragraph.type === 3 ? '##' : '###';
      return [prefix, ' ', marked, '\n\n'];
    },
  }));
