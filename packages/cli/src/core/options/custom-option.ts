import commander from 'commander';

export interface CustomOption<T> {
  readonly flags: string;
  readonly description: string;
  readonly defaultValue: null | T;
  parser(value: string, previous: T): T;
}

export const createCustomOption = <T>(
  flags: string,
  description: string,
  parser: (value: string, previous: T) => T,
  defaultValue?: T,
): CustomOption<T> => ({
  flags,
  description,
  parser,
  defaultValue: defaultValue ?? null,
});

declare module 'commander' {
  export interface Command {
    customOption<T>(option: CustomOption<T>): this;
  }
}
commander.Command.prototype.customOption = function <T>(this: commander.Command, option: CustomOption<T>) {
  return this.option(option.flags, option.description, option.parser, option.defaultValue);
};
