import _ from 'lodash';
import { Config } from './config';
import { ConfigProvider } from './config-provider';

export interface ConfigBuilder {
  use(provider: ConfigProvider): ConfigBuilder;
  config(): Promise<Config>;
}

export const configBuilder = (providers: ConfigProvider[] = []): ConfigBuilder => ({
  use: (provider: ConfigProvider) => configBuilder([...providers, provider]),
  config: (): Promise<Config> =>
    Promise.all(providers.map(provider => provider())).then(configs => _.merge({}, ...configs)),
});
