import { createMetadataProcessor, PostProcessor } from '../../post-processor';

export const parametrizeCoverImage = (options: { width: number; height: number }): PostProcessor =>
  createMetadataProcessor(metadata => {
    const [, unsplashId] = metadata.coverImage?.match(/^https?:\/\/unsplash\.com\/photos\/(\w+)$/i);
    if (!unsplashId) return metadata;
    return { ...metadata, coverImage: `https://source.unsplash.com/${unsplashId}/${options.width}x${options.height}` };
  });
