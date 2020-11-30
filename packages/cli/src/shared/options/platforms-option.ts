import { createCustomOption } from '../../core/options';

export interface PlatformsOption {
  readonly platforms: string[];
}

export const platformsOption = createCustomOption(
  '-p --platforms <names>',
  'List of platforms to include e.g. `dev.to, medium`. When none, all platforms are included. See the ' +
    'documentation of your configured plugins to know which platforms are available.',
  (value: string) => value.split(',').map(item => item.trim()),
  [],
);
