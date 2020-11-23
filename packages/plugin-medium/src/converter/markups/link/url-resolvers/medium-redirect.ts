import { ChainedLinkUrlResolver, createLinkUrlResolver } from '../link-url-resolver';

export const mediumRedirect = (): ChainedLinkUrlResolver =>
  createLinkUrlResolver((ctx, next) => {
    const { markup } = ctx;
    const url = markup.href.match(/^https:\/\/medium\.com\/r\/\?url=(?<url>.+)/i)?.groups?.url;
    return url ? decodeURI(url) : next(ctx);
  });
