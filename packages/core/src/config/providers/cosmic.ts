import { cosmiconfig } from 'cosmiconfig';
import { ConfigProvider, createConfigProvider } from '../config-provider';

export const cosmic = (moduleName: string): ConfigProvider =>
  createConfigProvider(async () => (await (await cosmiconfig(moduleName).search())?.config) ?? {});
