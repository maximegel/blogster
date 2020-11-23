import { createContentProcessor, PostProcessor } from '../post-processor';

export const normalizeApostrophes = (): PostProcessor =>
  createContentProcessor(({ content }, { visit }) => {
    visit(content, 'text', text => {
      text.value = text.value.replace(/['’]/g, `'`).replace(/["“”]/g, `"`);
    });
  });
