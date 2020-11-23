import { MarkupConverterContext } from '../../markup-converter';

export type LinkUrlResolverContext = MarkupConverterContext;
export type LinkUrlResolver = (context: LinkUrlResolverContext) => string;
export type ChainedLinkUrlResolver = (next: LinkUrlResolver) => LinkUrlResolver;

export const createLinkUrlResolver = (
  fn: (context: LinkUrlResolverContext, next: LinkUrlResolver) => string,
): ChainedLinkUrlResolver => next => ctx => fn(ctx, next);

export const linkUrlResolverChain = (...resolvers: ChainedLinkUrlResolver[]): LinkUrlResolver => ctx =>
  resolvers.reduce((next, resolver) => resolver(next), (() => ctx.markup.href) as LinkUrlResolver)(ctx);
