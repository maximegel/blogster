import { createContentProcessor, PostProcessor } from '../post-processor';

export const normalizeWhitespaces = (): PostProcessor =>
  createContentProcessor(({ content }, { visit }) => {
    visit(content, 'heading', heading => {
      visit(heading, 'text', text => {
        text.value = text.value.replace(/\s/g, ' ');
      });
    });
  });
