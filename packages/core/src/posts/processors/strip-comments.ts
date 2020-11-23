import { createContentProcessor, PostProcessor } from '../post-processor';

export const stripComments = (): PostProcessor =>
  createContentProcessor(({ content }, { visit }) => {
    visit(content, 'html', html => {
      html.value = html.value.replace(/<!--\s*.*\s*-->/g, '');
    });
  });
