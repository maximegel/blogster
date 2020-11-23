import _ from 'lodash';
import { PostBody } from './post-body';
import { PostPlatform } from './post-platform';

export interface PostRef {
  readonly normalizedTitle: string;
}

export const newPostRef = (props: { title: string }): PostRef => {
  const normalizedTitle = _.chain(props.title).deburr().capitalize().value();
  return { normalizedTitle };
};

export interface Post extends PostRef {
  readonly body: PostBody;
}

export const newPost = (props: { body: PostBody }): Post => ({
  ...newPostRef({ title: props.body.metadata.title }),
  body: props.body,
});

export interface LocalPostRef extends PostRef {
  readonly path: string;
}

export type LocalPost = LocalPostRef & Post;

export interface RemotePostRef extends PostRef {
  readonly remoteId: string | number;
  readonly platform: PostPlatform;
  readonly publicUrl: string;
}

export type RemotePost = RemotePostRef & Post;
