import { cosmiconfig } from 'cosmiconfig';
import findRoot from 'find-root';
import path from 'path';
import { ConfigProvider, createConfigProvider } from '../config-provider';

export const cosmic = (moduleName: string, file?: string): ConfigProvider =>
  createConfigProvider(async () => {
    const cosmic = cosmiconfig(moduleName);
    const { config, filepath } = file ? await cosmic.load(file) : await cosmic.search();
    if (!config) return {};
    const root = findRoot(process.cwd());
    const configDir = path.dirname(filepath);
    return {
      ...config,
      // Makes plugin paths relative to project root.
      plugins: config?.plugins?.map((plugin: string) =>
        plugin.startsWith('.') ? path.join(path.relative(root, configDir), plugin) : plugin,
      ),
      // Makes post globs absolute.
      include: config?.include?.map((glob: string) => path.join(configDir, glob)),
      exclude: config?.exclude?.map((glob: string) => path.join(configDir, glob)),
    };
  });
