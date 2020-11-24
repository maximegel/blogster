import { Logger } from '@blogster/core';
import { createAsyncView } from '../../core/views';
import { paddingX } from '../../core/views/attributes';
import { a, span, strong } from '../../core/views/elements';
import { taskList } from '../../shared/views';

export type PushViewModel = {
  readonly action: 'publish' | 'update';
  readonly title: string;
  readonly platform: string;
  readonly publicUrl: null | string;
  readonly promise: (logger: Logger) => Promise<void>;
}[];

export const pushView = createAsyncView<PushViewModel>(
  async model =>
    await taskList(
      model.map(({ action, title, platform, publicUrl, promise }) => ({
        action,
        title: span(strong(title), span('@').attrs(paddingX(1)), publicUrl ? a(platform, publicUrl) : span(platform)),
        promise,
      })),
    ),
);
