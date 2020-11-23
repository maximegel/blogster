import { ChainedEmbedResolver, createEmbedResolver } from '../embed-resolver';

export const gist = (): ChainedEmbedResolver =>
  createEmbedResolver((ctx, next) => {
    const gist = ctx.media.value.gist;
    return gist ? `<script src="${gist.gistScriptUrl}"></script>` : next(ctx);
  });
