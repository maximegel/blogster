import { createOption } from '../../core';

export interface PlatformsOption {
  readonly platforms: string[];
}

// TODO: Use a variadic option instead of a comma separated list.
export const platforms = createOption(
  '-p --platforms <names>',
  'List of platforms to include e.g. `dev.to, medium`. When none, all platforms are included. See the ' +
    'documentation of your configured plugins to know which platforms are available.',
  [],
  (value: string) => value.split(',').map(item => item.trim()),
);
