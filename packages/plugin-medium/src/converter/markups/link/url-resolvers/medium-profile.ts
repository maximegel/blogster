import { ChainedLinkUrlResolver, createLinkUrlResolver } from '../link-url-resolver';

export const mediumProfile = (): ChainedLinkUrlResolver =>
  createLinkUrlResolver((ctx, next) => {
    const { markup, post } = ctx;
    const user = !!markup.userId && post.mentionedUsers.find(usr => usr.userId === markup.userId);
    return user?.username ? `https://medium.com/@${user.username}` : next(ctx);
  });
