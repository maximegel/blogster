import { PostDto } from '../dtos/post-dto';
import { PostParagraphDto } from '../dtos/post-paragraph-dto';

export interface ParagraphConverterContext {
  marked: string;
  paragraph: PostParagraphDto;
  paragraphs: PostParagraphDto[];
  post: PostDto;
}
export type ParagraphConverter = (context: ParagraphConverterContext) => Promise<string>;
export type ChainedParagraphConverter = (next: ParagraphConverter) => ParagraphConverter;

export const createParagraphConverter = (
  fn: () => {
    canConvert: (context: ParagraphConverterContext) => boolean;
    convert: (context: ParagraphConverterContext) => string[];
  },
): ChainedParagraphConverter =>
  createAsyncParagraphConverter(() => {
    const { canConvert, convert } = fn();
    return { canConvert, convert: c => Promise.resolve(convert(c)) };
  });

export const createAsyncParagraphConverter = (
  fn: () => {
    canConvert: (context: ParagraphConverterContext) => boolean;
    convert: (context: ParagraphConverterContext) => Promise<string[]>;
  },
): ChainedParagraphConverter => next => async ctx => {
  const { canConvert, convert } = fn();
  return canConvert(ctx) ? (await convert(ctx)).join('') : next(ctx);
};

export const paragraphConverterChain = (...converters: ChainedParagraphConverter[]): ParagraphConverter => ctx =>
  converters.reduce((next, converter) => converter(next), (() => Promise.resolve('')) as ParagraphConverter)(ctx);
