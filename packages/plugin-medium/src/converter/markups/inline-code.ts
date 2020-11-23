import { ChainedMarkupConverter, createMarkupConverter } from '../markup-converter';

export const inlineCode = (): ChainedMarkupConverter =>
  createMarkupConverter(() => ({
    canConvert: ({ markup }) => markup.type === 10,
    convert: () => ({ prefix: '`', suffix: '`' }),
  }));
