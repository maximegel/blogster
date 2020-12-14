import { PostStatusType } from '@blogster/core';
import chalk from 'chalk';
import { createAsyncView, createComponent } from '../../core/views';
import { maxWidth, minWidth, paddingRight, paddingX } from '../../core/views/attributes';
import { a, div, span, strong } from '../../core/views/elements';

export type StatusViewModel = {
  readonly title: string;
  readonly status: PostStatusType;
  readonly platform: string;
  readonly publicUrl: null | string;
}[];

export const statusView = createAsyncView<StatusViewModel>(async model => {
  const titleMaxWidth = 50;
  const titleMinWidth = Math.max(...model.map(item => item.title.length));
  return div(
    ...(await Promise.all(
      model.map(async ({ title, status, platform, publicUrl }) =>
        div(
          strong(title).attrs(minWidth(titleMinWidth), maxWidth(titleMaxWidth), paddingRight(1)),
          await statusLabel(status),
          span('@').attrs(paddingX(1)),
          publicUrl ? a(platform, publicUrl) : span(platform),
        ),
      ),
    )),
  );
});

const statusLabel = createComponent<PostStatusType>(model => {
  const width = Math.max(...['unpublished', 'synced', 'desynced'].map(str => str.length));
  const bgColor =
    model === 'unpublished'
      ? chalk.bgBlue
      : model === 'synced'
      ? chalk.bgGreen
      : model === 'desynced'
      ? chalk.bgRed
      : chalk;
  return span(model.toUpperCase()).attrs(minWidth(width), paddingX(1)).styles(bgColor.black);
});
