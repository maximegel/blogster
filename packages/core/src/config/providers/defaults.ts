import { createConfigProvider } from '..';

export const defaults = createConfigProvider(() => Promise.resolve({ plugins: [], env: {}, include: [], exclude: [] }));
