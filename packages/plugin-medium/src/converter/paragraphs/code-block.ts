import { ChainedParagraphConverter, createParagraphConverter } from '../paragraph-converter';

export const codeBlock = (): ChainedParagraphConverter =>
  createParagraphConverter(() => ({
    canConvert: ({ paragraph }) => paragraph.type === 8,
    convert: ({ marked }) => ['\n```\n', marked, '\n```\n'],
  }));
