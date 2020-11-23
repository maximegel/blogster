import { cosmiconfig } from 'cosmiconfig';
import { ConfigProvider, createConfigProvider } from '../config-provider';

export const cosmic = (moduleName: string): ConfigProvider =>
  createConfigProvider(async () => {
    const { config } = await cosmiconfig(moduleName).search();
    return config;
  });
