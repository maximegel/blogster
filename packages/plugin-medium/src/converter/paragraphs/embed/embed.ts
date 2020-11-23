import { MediumClient } from '../../../client';
import { ChainedParagraphConverter, createAsyncParagraphConverter } from '../../paragraph-converter';
import { ChainedEmbedResolver, embedResolverChain } from './embed-resolver';

export const embed = (
  client: MediumClient,
  options?: { resolvers?: ChainedEmbedResolver[] },
): ChainedParagraphConverter =>
  createAsyncParagraphConverter(() => ({
    canConvert: ({ paragraph }) => paragraph.type === 11,
    convert: async ({ paragraph }) => {
      const media = await client.getMedia(paragraph.iframe.mediaResourceId);
      const out = embedResolverChain(...(options?.resolvers ?? []))({ media });
      return [out, '\n\n'];
    },
  }));
