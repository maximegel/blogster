import { createContentProcessor, PostProcessor } from '../post-processor';

export const stripCodeAttrs = (): PostProcessor =>
  createContentProcessor(({ content }, { visit }) => {
    visit(content, 'code', code => {
      code.lang = undefined;
      code.meta = undefined;
    });
  });
