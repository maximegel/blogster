import _ from 'lodash';
import { Node } from 'unist';
import visit from 'unist-util-visit';
import { Post } from './post';
import { PostBody } from './post-body';
import { Literals, LiteralType, Nodes, NodeType, Parent } from './post-content';
import { PostMetadata } from './post-metadata';

export interface PostProcessor {
  then(next: PostProcessor): PostProcessor;
  process<P extends Pick<Post, 'body'>>(post: P): Promise<P>;
}

export const createMetadataProcessor = (fn: (metadata: PostMetadata) => PostMetadata): PostProcessor => {
  const p: PostProcessor = {
    then: next => processorChain(p).then(next),
    process: post => {
      _.assign(post.body, { metadata: fn(post.body.metadata) });
      return Promise.resolve(post);
    },
  };
  return p;
};

export const createContentProcessor = (fn: (body: PostBody, utils: PostContentUtils) => void): PostProcessor =>
  createAsyncContentProcessor((body, utils) => {
    fn(body, utils);
    return Promise.resolve();
  });

export const createAsyncContentProcessor = (
  fn: (body: PostBody, utils: PostContentUtils) => Promise<void>,
): PostProcessor => {
  const p: PostProcessor = {
    then: next => processorChain(p).then(next),
    process: async post => {
      await fn(post.body, {
        visit: (tree, type, f) => {
          visit((tree as unknown) as Node, type, node => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            f(node as any);
          });
        },
        map: (tree, type, f) => {
          visit((tree as unknown) as Node, type, node => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const props = f(node as any);
            _.assign(node, props);
          });
        },
      });
      return post;
    },
  };
  return p;
};

export const processorChain = (...processors: PostProcessor[]): PostProcessor => ({
  then: next => processorChain(...processors, next),
  process: post =>
    processors.reduce(
      async (p, next) => next.process(await p),
      // Clones once instead of inside each processor.
      Promise.resolve(_.cloneDeep(post)),
    ),
});

type PostContentVisitor = <T extends NodeType>(tree: Parent, type: T, fn: (node: Nodes[T]) => void) => void;

type PostContentMapper = <T extends LiteralType, U extends LiteralType>(
  tree: Parent,
  type: T,
  fn: (node: Literals[T]) => Literals[U],
) => void;

interface PostContentUtils {
  visit: PostContentVisitor;
  map: PostContentMapper;
}
