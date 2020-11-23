import { Logger } from '@blogster/core';
import chalk from 'chalk';
import _ from 'lodash';
import { createAsyncComponent, ViewElement } from '~core/views';
import { paddingLeft, paddingRight } from '~core/views/attributes';
import { br, div, strong } from '~core/views/elements';
import { label } from './label-component';
import { logEntry, LogEntryViewModel } from './log-entry-component';

export type TaskListViewModel = {
  action: string;
  title: ViewElement;
  promise: (logger: Logger) => Promise<void>;
}[];

export const taskList = createAsyncComponent<TaskListViewModel>(async model => {
  const actionWidth = Math.max(...model.map(item => item.action.length));
  return div(
    ...(await Promise.all(
      model
        .map(async item => {
          const logEntries: LogEntryViewModel[] = [];
          const logger: Logger = {
            info: message => logEntries.push({ type: 'info', message }),
            warn: message => logEntries.push({ type: 'warn', message }),
            error: message => logEntries.push({ type: 'error', message }),
          };
          await item.promise(logger).catch(err => logger.error((err?.message ?? err).trim()));
          const result = logEntries.some(entry => entry.type === 'error')
            ? 'error'
            : logEntries.some(entry => entry.type === 'warn')
            ? 'warn'
            : 'success';
          if (result === 'error') process.exitCode = 1;
          return { ...item, result, logEntries };
        })
        .map(async (item, i, arr) => {
          const { title, action, result, logEntries } = await item;
          const prev = arr[i - 1] ? await arr[i - 1] : undefined;
          const lbl = await label(result);
          const lblWidth = lbl.text().length;
          return div(
            ...(!!logEntries?.length && !!prev && !prev?.logEntries?.length ? [br] : []),
            div(
              lbl,
              strong(`[${_.padEnd(action, actionWidth)}]`)
                .attrs(paddingRight(1))
                .styles(chalk.gray),
              title,
            ),
            ...(logEntries?.length
              ? [
                  div(
                    ...(await Promise.all(
                      logEntries.map(async msg => (await logEntry(msg)).attrs(paddingLeft(lblWidth + 1))),
                    )),
                  ),
                  br,
                ]
              : []),
          );
        }),
    )),
  );
});
