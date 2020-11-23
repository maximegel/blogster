import chalk from 'chalk';
import terminalLink from 'terminal-link';
import { createElement, ViewElement } from '../view-element';

export const br = createElement('<br>');

export const span = (...children: (ViewElement | string)[]): ViewElement =>
  createElement(() =>
    children
      .map(el => (typeof el === 'string' ? el : el.print()))
      .join('')
      .replace(/(<br>)+$/g, ''),
  );

export const a = (text: string, href: string): ViewElement =>
  createElement(() => terminalLink(text, href, { fallback: (text, url) => `${text} (${url})` }));

export const strong = (text: string): ViewElement => span(text).styles(chalk.bold);

export const div = (...children: (ViewElement | string)[]): ViewElement =>
  createElement(() => {
    const inner = span(...children);
    if (inner.text().endsWith(br.text())) return inner.print();
    return inner.print() + br.print();
  });
