import chalk from 'chalk';
import { createAsyncComponent } from '../../core/views';
import { br, div, span } from '../../core/views/elements';
import { label } from './label-component';

export interface LogEntryViewModel {
  type: 'info' | 'warn' | 'error';
  message: string;
}

export const logEntry = createAsyncComponent<LogEntryViewModel>(async ({ type, message }) => {
  const color = type === 'info' ? chalk.blue : type === 'warn' ? chalk.yellow : chalk.red;
  return div(await label(type), span(message.replace(/\n/g, br.text())).styles(color));
});
