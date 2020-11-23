import { createConfigProvider } from '..';

export const defaults = createConfigProvider(() => Promise.resolve({ env: {}, include: [], exclude: [] }));
