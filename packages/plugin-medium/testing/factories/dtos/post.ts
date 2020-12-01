import { PostMetadata } from '@blogster/core';
import faker from 'faker';
import _ from 'lodash';
import { PostDto } from 'src/dtos/post-dto';
import { PostParagraphDto } from 'src/dtos/post-paragraph-dto';
import { PostSectionDto } from 'src/dtos/post-section-dto';

export const createPost = (): PostWithNothing => new PostBuilder();

class PostBuilder
  implements PostWithNothing, PostWithMetadata, PostContentWithSections, PostSectionWithParagraphs, PostWithContent {
  private meta: PostMetadata;
  private sections: PostParagraphDto[][] = [];

  withMetadata(metadata: PostMetadata): PostWithMetadata {
    this.meta = metadata;
    return this;
  }

  withContent(fn: (builder: PostContentWithSections) => PostContentWithSections): PostWithContent {
    fn(this);
    return this;
  }

  withSection(fn: (builder: PostSectionWithParagraphs) => PostSectionWithParagraphs): PostContentWithSections {
    this.sections.push([]);
    fn(this);
    return this;
  }

  withUnorderedList(...items: string[]): PostSectionWithParagraphs {
    _.last(this.sections).push(
      ...items.map(item => ({
        name: faker.random.alphaNumeric(4).toLowerCase(),
        type: 9,
        text: item,
        markups: [],
      })),
    );
    return this;
  }

  build(): PostDto {
    const title = this.meta?.title ?? faker.lorem.sentence(3, 5);
    const paragraphs = this.sections.flatMap(paragraphs => paragraphs);
    return {
      value: {
        id: faker.random.alphaNumeric(12).toLowerCase(),
        slug: _.kebabCase(title),
        title,
        content: {
          subtitle: this.meta?.description ?? faker.lorem.sentences(2),
          bodyModel: {
            paragraphs,
            sections: this.sections.reduce((arr, section) => {
              const offset = _.last(arr)?.startIndex ?? 0;
              arr.push({
                name: faker.random.alphaNumeric(4).toLowerCase(),
                startIndex: paragraphs.length - offset - section.length,
              });
              return arr;
            }, [] as PostSectionDto[]),
          },
        },
      },
    };
  }
}

interface PostWithNothing extends PostWithMetadata {
  withMetadata(metadata: PostMetadata): PostWithMetadata;
}

interface PostWithMetadata {
  withContent(fn: (builder: PostContentWithSections) => PostContentWithSections): PostWithContent;
}

interface PostContentWithSections {
  withSection(fn: (builder: PostSectionWithParagraphs) => PostSectionWithParagraphs): PostContentWithSections;
}

interface PostSectionWithParagraphs {
  withUnorderedList(...items: string[]): PostSectionWithParagraphs;
}

interface PostWithContent {
  build(): PostDto;
}
