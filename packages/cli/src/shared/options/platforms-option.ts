import chalk from 'chalk';
import { createCustomOption } from '../../core/options';

export interface PlatformsOption {
  readonly platforms: string[];
}

export const platformsOption = createCustomOption(
  '-p --platforms <names>',
  `comma separated list of platforms e.g. ${chalk.bold('--platforms "dev.to, medium"')}`,
  (value: string) => value.split(',').map(item => item.trim()),
  [],
);
