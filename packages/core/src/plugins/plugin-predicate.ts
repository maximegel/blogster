import { Plugin } from './plugin';

export type PluginPredicate<P extends Plugin> = (plugin: Plugin<P['metadata']>) => boolean;

export const platforms = <P extends Plugin<{ platform: string }>>(...names: string[]): PluginPredicate<P> => plugin =>
  names.includes(plugin.metadata.platform);
