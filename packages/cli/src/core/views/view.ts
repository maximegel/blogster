import { ViewElement } from './view-element';

export type View<M> = (model: M) => Promise<void>;

export const createView = <M>(fn: (model: M) => ViewElement): View<M> =>
  createAsyncView(model => Promise.resolve(fn(model)));

export const createAsyncView = <M>(fn: (model: M) => Promise<ViewElement>): View<M> => async model => {
  const out = (await fn(model)).print().replace(/<br>/g, '\n');
  // Logs to console if `out` contains more than just whitespaces.
  if (out.trim()) console.log('\n' + out.trimEnd() + '\n');
};
