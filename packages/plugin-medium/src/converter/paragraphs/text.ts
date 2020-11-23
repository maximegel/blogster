import { ChainedParagraphConverter, createParagraphConverter } from '../paragraph-converter';

export const text = (): ChainedParagraphConverter =>
  createParagraphConverter(() => ({
    canConvert: ({ paragraph }) => paragraph.type === 1,
    convert: ({ marked }) => [marked, '\n\n'],
  }));
