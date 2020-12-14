import _ from 'lodash';
import { PostDto } from '../dtos/post-dto';
import { PostParagraphDto } from '../dtos/post-paragraph-dto';
import { ChainedMarkupConverter, markupConverterChain } from './markup-converter';
import { ChainedParagraphConverter, paragraphConverterChain } from './paragraph-converter';

function isFeaturedImgPara(para: PostParagraphDto, post: PostDto) {
  const featuredImgId = post.value.virtuals?.previewImage?.imageId;
  return para.type === 4 && para.metadata.id === featuredImgId;
}

function isTitlePara(para: PostParagraphDto, post: PostDto) {
  const title = post.value.title;
  return para.type === 3 && para.text === title;
}

export interface MediumConverter {
  convert(post: PostDto): Promise<string>;
}

export const converter = ({
  paragraphs: paragraphConverters,
  markups: markupConverters,
}: {
  paragraphs: ChainedParagraphConverter[];
  markups?: ChainedMarkupConverter[];
}): MediumConverter => ({
  convert: async (post: PostDto): Promise<string> => {
    const { paragraphs, sections } = post.value.content.bodyModel;
    const markupChain = markupConverterChain(...(markupConverters ?? []));
    const paragraphChain = paragraphConverterChain(...paragraphConverters);
    return (
      _(
        // Since, Medium editor split code blocks unintentionally they must be joined back together.
        paragraphs?.reduce((arr, cur) => {
          const prev = arr[arr.length - 1];
          // If the previous paragraph is also a code block, joins current with previous.
          if (prev?.type === cur.type && cur.type === 8)
            arr.splice(-1, 1, { ...prev, text: prev.text + '\n\n' + cur.text });
          // Otherwise, does nothing.
          else arr.push(cur);
          return arr;
        }, [] as PostParagraphDto[]),
      )
        // Ignores the featured image paragraph and the title paragraph.
        .takeRightWhile(para => !(isTitlePara(para, post) || isFeaturedImgPara(para, post)))
        .value()
        ?.reduce(async (out, paragraph) => {
          // If a section starts here, appends a section divider.
          if (
            sections
              ?.map(s => s.startIndex)
              ?.filter(startIndex => startIndex > 0)
              ?.includes(paragraphs.findIndex(p => p.name === paragraph.name))
          )
            (await out).push('---\n\n');

          // Creates an array of tokens indexed by the position at which they appear in the paragraph text.
          const markupTokens =
            paragraph.markups?.reduce((arr, markup) => {
              const { prefix, suffix } = markupChain({ markup, paragraph, post });
              arr[markup.start] = prefix + (arr[markup.start] ?? '');
              arr[markup.end] = (arr[markup.end] ?? '') + suffix;
              return arr;
            }, [] as string[]) ?? [];
          const marked =
            paragraph.text
              // Converts the text to an array of characters.
              ?.split('')
              // Inserts markup tokens at the calculated indexes.
              ?.reduce((out, char, i) => {
                // If there is a token at the current index, inserts it.
                if (markupTokens[i]) out.push(markupTokens[i]);
                out.push(char);
                return out;
              }, [] as string[])
              // Adds markup token at the end if any.
              ?.concat(markupTokens[paragraph.text?.length ?? ''])
              ?.join('') ?? '';

          // Appends the converted paragraph.
          (await out).push(await paragraphChain({ marked, paragraph, paragraphs, post }));
          return out;
        }, Promise.resolve([] as string[]))
        ?.then(chars => chars.join('')) ?? Promise.resolve('')
    );
  },
});
