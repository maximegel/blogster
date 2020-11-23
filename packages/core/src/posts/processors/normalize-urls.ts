import { createContentProcessor, PostProcessor } from '../post-processor';

export const normalizeUrls = (): PostProcessor =>
  createContentProcessor(({ content }, { visit }) => {
    visit(content, 'link', link => {
      link.url = decodeURI(link.url.toLowerCase());
    });
  });
