import { CommandArgument, createArgument, createOptionalArgument, createVariadicArgument } from './command-argument';
import { CommandOption, createOption, createRequiredOption } from './command-option';

export interface Command<D> {
  readonly name: string;
  readonly arguments: CommandArgument[];
  readonly description: string;
  readonly options: CommandOption<unknown>[];
  readonly handler: CommandHandler<D>;
}

export type CommandHandler<D> = (deps: D) => (...args: unknown[]) => Promise<void>;

export const createCommand = (name: string): CommandWithArgs => new CommandBuilder(name);

class CommandBuilder implements CommandWithArgs, CommandWithDescription {
  private cmd = {
    name: '',
    arguments: [],
    description: '',
    options: [],
    handler: (() => () => Promise.resolve()) as CommandHandler<unknown>,
  };

  constructor(name: string) {
    this.cmd.name = name;
  }

  argument(argument: CommandArgument): CommandWithArgs;
  argument(name: string, description: string): CommandWithArgs;
  argument(...args: [CommandArgument] | [name: string, description: string]): CommandWithArgs {
    this.cmd.arguments.push(args.length == 1 ? args[0] : createArgument(args[0], args[1]));
    return this;
  }

  optionalArgument(name: string, description: string): CommandWithArgs {
    return this.argument(createOptionalArgument(name, description));
  }

  variadicArgument(name: string, description: string): CommandWithArgs {
    return this.argument(createVariadicArgument(name, description));
  }

  description(str: string): CommandWithDescription {
    this.cmd.description = str;
    return this;
  }

  option<T>(option: CommandOption<T>): CommandWithDescription;
  option<T>(flags: string, description: string, defaultValue: T): CommandWithDescription;
  option<T>(
    ...args: [CommandOption<T>] | [flags: string, description: string, defaultValue: T]
  ): CommandWithDescription {
    this.cmd.options.push(args.length === 1 ? args[0] : createOption(args[0], args[1], args[2]));
    return this;
  }

  requiredOption<T>(flags: string, description: string, defaultValue: T): CommandWithDescription {
    return this.option(createRequiredOption(flags, description, defaultValue));
  }

  handler<D>(fn: CommandHandler<D>): Command<D> {
    this.cmd.handler = fn;
    return this.cmd;
  }
}

interface CommandWithArgs {
  argument(argument: CommandArgument): CommandWithArgs;
  argument(name: string, description: string): CommandWithArgs;
  optionalArgument(name: string, description: string): CommandWithArgs;
  variadicArgument(name: string, description: string): CommandWithArgs;
  description(str: string): CommandWithDescription;
}

interface CommandWithDescription {
  option<T>(option: CommandOption<T>): CommandWithDescription;
  option<T>(flags: string, description: string, defaultValue: T): CommandWithDescription;
  requiredOption<T>(flags: string, description: string, defaultValue: T): CommandWithDescription;
  handler<D>(fn: CommandHandler<D>): Command<D>;
}
