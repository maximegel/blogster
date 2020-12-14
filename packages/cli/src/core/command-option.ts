export interface CommandOption<T> {
  readonly flags: string;
  readonly description: string;
  readonly defaultValue?: T;
  readonly required?: boolean;
  parser?: (value: string, previous: T) => T;
}

export const createOption = <T>(
  flags: string,
  description: string,
  defaultValue: T,
  parser?: (value: string, previous: T) => T,
): CommandOption<T> => ({
  flags,
  description,
  defaultValue,
  parser,
});

export const createRequiredOption = <T>(
  flags: string,
  description: string,
  defaultValue: T,
  parser?: (value: string, previous: T) => T,
): CommandOption<T> => ({
  ...createOption(flags, description, defaultValue, parser),
  required: true,
});
