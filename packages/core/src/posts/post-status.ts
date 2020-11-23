import { Change } from 'diff';
import { LocalPost, RemotePost } from './post';
import { PostPlatform } from './post-platform';

export type PostStatusType = 'unpublished' | 'synced' | 'desynced' | 'extraneous';

export interface PostStatus<T extends PostStatusType = PostStatusType> {
  readonly type: T;
  readonly local: LocalPost;
}

export interface UnpublishedPost extends PostStatus<'unpublished'> {
  readonly platform: PostPlatform;
}

export interface SyncedPost extends PostStatus<'synced'> {
  readonly remote: RemotePost;
}

export interface DesyncedPost extends PostStatus<'desynced'> {
  readonly remote: RemotePost;
  readonly changes: Change[];
}

export const newUnpublishedPost = (props: Omit<UnpublishedPost, 'type'>): UnpublishedPost => ({
  type: 'unpublished',
  ...props,
});

export const newSyncedPost = (props: Omit<SyncedPost, 'type'>): SyncedPost => ({
  type: 'synced',
  ...props,
});

export const newDesyncedPost = (props: Omit<DesyncedPost, 'type'>): DesyncedPost => ({
  type: 'desynced',
  ...props,
});

export const isUnpublished = (status: PostStatus): status is UnpublishedPost => status.type === 'unpublished';
export const isSynced = (status: PostStatus): status is SyncedPost => status.type === 'synced';
export const isDesynced = (status: PostStatus): status is DesyncedPost => status.type === 'desynced';

export const isUnpublishedOrDesynced = (status: PostStatus): status is UnpublishedPost | DesyncedPost =>
  isUnpublished(status) || isDesynced(status);

export const isPublished = (status: PostStatus): status is SyncedPost | DesyncedPost =>
  isSynced(status) || isDesynced(status);
