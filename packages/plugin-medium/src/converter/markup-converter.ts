import { PostDto } from '../dtos/post-dto';
import { PostParagraphDto } from '../dtos/post-paragraph-dto';
import { PostParagraphMarkupDto } from '../dtos/post-paragraph-markup-dto';

export interface MarkupConverterContext {
  markup: PostParagraphMarkupDto;
  paragraph: PostParagraphDto;
  post: PostDto;
}
export type MarkupConverter = (context: MarkupConverterContext) => { prefix: string; suffix: string };
export type ChainedMarkupConverter = (next: MarkupConverter) => MarkupConverter;

export const createMarkupConverter = (
  fn: () => {
    canConvert: (context: MarkupConverterContext) => boolean;
    convert: (context: MarkupConverterContext) => { prefix: string; suffix: string };
  },
): ChainedMarkupConverter => next => ctx => {
  const { canConvert, convert } = fn();
  return canConvert(ctx) ? convert(ctx) : next(ctx);
};

export const markupConverterChain = (...converters: ChainedMarkupConverter[]): MarkupConverter => ctx =>
  converters.reduce((next, converter) => converter(next), (() => ({ prefix: '', suffix: '' })) as MarkupConverter)(ctx);
