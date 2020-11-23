import chalk from 'chalk';
import { Change } from 'diff';
import { createAsyncComponent, createAsyncView, createComponent } from '~core/views';
import { paddingRight } from '~core/views/attributes';
import { a, div, span, strong } from '~core/views/elements';

export type DiffViewModel = {
  readonly title: string;
  readonly platform: string;
  readonly publicUrl: string;
  readonly changes: Change[];
}[];

export const diffView = createAsyncView<DiffViewModel>(async model =>
  div(
    ...(await Promise.all(
      model.map(async item =>
        div(
          div(
            strong(item.title).attrs(paddingRight(1)),
            span('@').attrs(paddingRight(1)),
            a(item.platform, item.publicUrl),
          ),
          await diff(item.changes),
        ),
      ),
    )),
  ),
);

const diff = (changes: Change[], options?: { context?: number; expand?: boolean }) => {
  const opts = { context: 1, expand: false, ...options };
  return createAsyncComponent<Change[]>(async model =>
    div(
      ...(await Promise.all(
        splitHunks(model).map(async hunk => {
          if (hunk.added || hunk.removed) return await diffHunk(hunk);
          if (opts.context <= 0) return Promise.resolve('');
          // Hides large block of unmodified lines.
          const hiddenCount = hunk.count - opts.context * 2;
          if (!opts.expand && hunk.count > opts.context && hiddenCount > 1)
            return div(
              await diffHunk({ ...hunk, lines: hunk.lines.slice(0, opts.context) }),
              await diffHunkDivider({ hiddenCount }),
              await diffHunk({ ...hunk, lines: hunk.lines.slice(-opts.context) }),
            );
          else return await diffHunk(hunk);
        }),
      )),
    ),
  )(changes);
};

const diffHunkDivider = createComponent<{ hiddenCount: number }>(model =>
  div(strong('=').attrs(paddingRight(2)), strong(`[${model.hiddenCount} unmodified lines]`)).styles(chalk.gray),
);

const splitHunks = (changes: Change[]): ChangeHunk[] =>
  changes?.map(change => ({
    ...change,
    lines: (change.value.endsWith('\n') ? change.value.slice(0, -1) : change.value).split('\n'),
  }));

type ChangeHunk = Change & { lines: string[] };

const diffHunk = createAsyncComponent<ChangeHunk>(async model =>
  div(...(await Promise.all(model.lines.map(async value => await diffLine({ ...model, value }))))),
);

const diffLine = createComponent<Change>(({ added, removed, value }) => {
  const prefix = added ? '+' : removed ? '-' : ' ';
  const color = added ? chalk.green : removed ? chalk.red : chalk.grey;
  return div(strong(prefix).styles(paddingRight(2)), value).styles(color);
});
