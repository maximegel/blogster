import _ from 'lodash';
import { PluginFactory } from '..';
import { createPluginProvider, PluginProvider } from '../plugin-provider';

export const modulePaths = (...paths: string[]): PluginProvider =>
  createPluginProvider(async () => {
    const pluginsByPath = _(paths)
      .flatMap(
        async path =>
          await import(path)
            .then(m => m.default as PluginFactory[])
            .catch(err => {
              throw new Error(`Failed to load plugin "${path}" with message: ` + `${(err?.message ?? err).trim()}`);
            }),
      )
      .value();
    return _(await Promise.all(pluginsByPath))
      .flatMap(plugins => plugins)
      .value();
  });
