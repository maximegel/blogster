import commander from 'commander';
import { Command as BlogsterCommand, CommandOption, createOption } from '../core';

declare module 'commander' {
  export interface Command {
    addCommand<D>(command: BlogsterCommand<D>, injector: (configFile: string) => Promise<D>): this;
    addOptions<T>(options: CommandOption<T>[]): this;
    globalOption<T>(flags: string, description: string, defaultValue?: T): this;
  }
}

commander.Command.prototype.addCommand = function <D>(
  this: commander.Command,
  cmd: BlogsterCommand<D>,
  injector: (configFile: string) => Promise<D>,
) {
  const internal = (this as unknown) as {
    _globalOptions: CommandOption<unknown>[];
    _helpCommandDescription: string;
  };
  this.command(cmd.name)
    .arguments(cmd.arguments.map(arg => arg.syntax).join(' '))
    .description(
      cmd.description,
      cmd.arguments.reduce((obj, arg) => ({ ...obj, [arg.name]: arg.description }), {}),
    )
    .helpOption('-h, --help', internal._helpCommandDescription)
    .addOptions([...(internal._globalOptions ?? []), ...cmd.options])
    .action(async (args: commander.Command['args'], options: Record<string, unknown>) =>
      injector(options.config as string).then(deps => cmd.handler(deps)(...[args, options])),
    );
  return this;
};

commander.Command.prototype.addOptions = function <T>(this: commander.Command, options: CommandOption<T>[]) {
  options.forEach(opt => this.option(opt.flags, opt.description, opt.parser, opt.defaultValue));
  return this;
};

commander.Command.prototype.globalOption = function <T>(
  this: commander.Command,
  flags: string,
  description: string,
  defaultValue?: T,
) {
  this._globalOptions = [...(this._globalOptions ?? []), createOption(flags, description, defaultValue)];
  return this;
};
