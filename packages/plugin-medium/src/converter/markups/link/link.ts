import { ChainedMarkupConverter, createMarkupConverter } from '../../markup-converter';
import { ChainedLinkUrlResolver, linkUrlResolverChain } from './link-url-resolver';

export const link = (options?: { urlResolvers?: ChainedLinkUrlResolver[] }): ChainedMarkupConverter =>
  createMarkupConverter(() => ({
    canConvert: ({ markup, paragraph }) =>
      markup.type === 3 &&
      // Ignores false positives for `@` tokens in code blocks.
      !(paragraph.type === 8 && markup.href?.includes('twitter.com')),
    convert: ctx => {
      const { markup } = ctx;
      const url = linkUrlResolverChain(...(options?.urlResolvers ?? []))(ctx);
      const alt = markup.title ? `"${!!markup.title}"` : '';
      return { prefix: '[', suffix: `](${url} ${alt}`.trimEnd() + ')' };
    },
  }));
