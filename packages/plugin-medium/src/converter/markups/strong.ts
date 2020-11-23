import { ChainedMarkupConverter, createMarkupConverter } from '../markup-converter';

export const strong = (options?: { marker?: '**' | '__' }): ChainedMarkupConverter =>
  createMarkupConverter(() => ({
    canConvert: ({ markup }) => markup.type === 1,
    convert: () => {
      const marker = options?.marker ?? '**';
      return { prefix: marker, suffix: marker };
    },
  }));
