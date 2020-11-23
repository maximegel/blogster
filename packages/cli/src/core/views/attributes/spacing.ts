import _ from 'lodash';
import { br } from '../elements';

export const paddingLeft = (value: number) => (text: string): string =>
  text
    .split(br.text())
    .map(line => _.repeat(' ', value) + line)
    .join(br.text());

export const paddingRight = (value: number) => (text: string): string =>
  text
    .split(br.text())
    .map(line => line + _.repeat(' ', value))
    .join(br.text());

export const paddingX = (right: number, left: number = right) => (text: string): string =>
  paddingLeft(left)(paddingRight(right)(text));
