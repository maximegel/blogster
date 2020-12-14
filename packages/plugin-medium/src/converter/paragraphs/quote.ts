import { ChainedParagraphConverter, createParagraphConverter } from '../paragraph-converter';

export const quote = (): ChainedParagraphConverter =>
  createParagraphConverter(() => ({
    canConvert: ({ paragraph }) => [6, 7].includes(paragraph.type),
    convert: ({ marked, paragraph }) =>
      paragraph.type === 7
        ? // If it's a large quote, prefixes all lines with `> ##`.
          ['> ## ', marked.replace(/\n/g, '\n> ##'), '\n\n']
        : // Otherwise, adds `>` as the first character.
          ['> ', marked, '\n\n'],
  }));
