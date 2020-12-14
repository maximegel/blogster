import { ChainedParagraphConverter, createParagraphConverter } from '../paragraph-converter';

export const code = (): ChainedParagraphConverter =>
  createParagraphConverter(() => ({
    canConvert: ({ paragraph }) => paragraph.type === 8,
    convert: ({ marked }) => ['```\n', marked, '\n```\n\n'],
  }));
