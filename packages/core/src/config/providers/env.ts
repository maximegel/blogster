import dotenv from 'dotenv';
import _ from 'lodash';
import { Config } from '../config';
import { createConfigProvider } from '../config-provider';

export const env = createConfigProvider(() => {
  dotenv.config();
  const env = _(process.env)
    .toPairs()
    .filter(([key]) => key.startsWith('BLOGSTER_'))
    .map(([key, val]) => [_.chain(key).replace('BLOGSTER_', '').camelCase(), val])
    .fromPairs()
    .value();
  return Promise.resolve({ env } as Config);
});
