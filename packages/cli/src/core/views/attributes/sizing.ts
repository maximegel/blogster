import _ from 'lodash';

export const maxWidth = (length: number) => (text: string): string => _.truncate(text, { length });

export const minWidth = (length: number) => (text: string): string => _.padEnd(text, length);

export const width = (length: number) => (text: string): string => minWidth(length)(maxWidth(length)(text));
