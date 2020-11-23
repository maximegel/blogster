import { PluginFactory } from './plugin';

export type PluginProvider = () => Promise<PluginFactory[]>;

export const createPluginProvider = (provider: PluginProvider): PluginProvider => provider;
