import { ChainedLinkUrlResolver, createLinkUrlResolver } from '../link-url-resolver';

export const twitterAccount = (): ChainedLinkUrlResolver =>
  createLinkUrlResolver((ctx, next) => {
    const { markup, post } = ctx;
    const user = !!markup.userId && post.mentionedUsers.find(usr => usr.userId === markup.userId);
    return user?.twitterScreenName ? `https://twitter.com/${user.twitterScreenName}` : next(ctx);
  });
