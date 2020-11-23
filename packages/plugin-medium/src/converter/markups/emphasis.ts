import { ChainedMarkupConverter, createMarkupConverter } from '../markup-converter';

export const emphasis = (options?: { marker?: '*' | '_' }): ChainedMarkupConverter =>
  createMarkupConverter(() => ({
    canConvert: ({ markup }) => markup.type === 2,
    convert: () => {
      const marker = options?.marker ?? '*';
      return { prefix: marker, suffix: marker };
    },
  }));
