import chalk from 'chalk';
import { createComponent } from '../../core/views';
import { paddingRight } from '../../core/views/attributes';
import { span } from '../../core/views/elements';

export const label = createComponent<'info' | 'warn' | 'error' | 'success' | string>(model => {
  const color =
    model === 'info'
      ? chalk.blue
      : model === 'warn'
      ? chalk.yellow
      : model === 'error'
      ? chalk.red
      : model === 'success'
      ? chalk.green
      : chalk.white;
  const text = model === 'error' ? 'err!' : model === 'success' ? 'succ' : model;
  return span(`${text}:`).attrs(paddingRight(1)).styles(color.bold);
});
