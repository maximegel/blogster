import _ from 'lodash';
import { Plugin, PluginDeps } from './plugin';
import { PluginProvider } from './plugin-provider';

export interface PluginLoader {
  use(loader: PluginProvider): PluginLoader;
  plugins(): Promise<Plugin[]>;
}

export const pluginLoader = (deps: PluginDeps, loaders: PluginProvider[] = []): PluginLoader => ({
  use: (loader: PluginProvider) => pluginLoader(deps, [...loaders, loader]),
  plugins: async (): Promise<Plugin[]> =>
    _(await Promise.all(loaders.map(loader => loader())))
      .flatMap(factories => factories)
      .map(factory => factory(deps))
      .value(),
});
