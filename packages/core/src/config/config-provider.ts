import { Config } from './config';

export type ConfigProvider = () => Promise<Config>;

export const createConfigProvider = (provider: ConfigProvider): ConfigProvider => provider;
