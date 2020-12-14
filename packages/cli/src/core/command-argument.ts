export interface CommandArgument {
  readonly name: string;
  readonly description: string;
  readonly syntax: string;
}

export const createArgument = (name: string, description: string): CommandArgument =>
  _createArgument(name, description, name => `[${name}]`);

export const createOptionalArgument = (name: string, description: string): CommandArgument =>
  _createArgument(name, description, name => '<' + name + '>');

export const createVariadicArgument = (name: string, description: string): CommandArgument =>
  _createArgument(name, description, name => `[${name}...]`);

const _createArgument = (name: string, description: string, syntax?: (name: string) => string) => ({
  name,
  description,
  syntax: syntax(name),
});
