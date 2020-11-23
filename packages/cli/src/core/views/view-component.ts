import { createElement, ViewElement } from './view-element';

export type ViewComponent<M> = (model: M) => Promise<ViewElement>;

export const createComponent = <M>(fn: (model: M) => ViewElement): ViewComponent<M> =>
  createAsyncComponent(model => Promise.resolve(fn(model)));

export const createAsyncComponent = <M>(fn: (model: M) => Promise<ViewElement>): ViewComponent<M> => async model =>
  createElement((await fn(model))?.print);
