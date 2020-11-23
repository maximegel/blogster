import { MediaDto } from '../../../dtos/media-dto';

export interface EmbedResolverContext {
  readonly media: MediaDto;
}
export type EmbedResolver = (context: EmbedResolverContext) => string;
export type ChainedEmbedResolver = (next: EmbedResolver) => EmbedResolver;

export const createEmbedResolver = (
  fn: (context: EmbedResolverContext, next: EmbedResolver) => string,
): ChainedEmbedResolver => next => ctx => fn(ctx, next);

export const embedResolverChain = (...resolvers: ChainedEmbedResolver[]): EmbedResolver => ctx =>
  resolvers.reduce((next, resolver) => resolver(next), (() => '') as EmbedResolver)(ctx);
