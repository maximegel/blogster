import {
  configBuilder,
  configProviders,
  fetcherBuilder,
  fetcherOptions,
  formatters,
  platforms,
  pluginLoader,
  pluginProviders,
  processorChain,
  processors,
  pusherBuilder,
  pusherOptions,
  reader,
  statusFetcher,
  stringifier,
} from '@blogster/core';
import chalk from 'chalk';
import { program } from 'commander';
import { diffCommand } from './commands/diff';
import { pushCommand } from './commands/push';
import { statusCommand } from './commands/status';
import './shared/commander';

(async () => {
  const pkg = require('../package.json');
  const injector = async (configFile: string) => {
    const config = await configBuilder()
      .use(configProviders.defaults)
      .use(configProviders.cosmic('blogster', configFile))
      .use(configProviders.env)
      .config();
    const plugins = await pluginLoader({ config })
      .use(pluginProviders.modulePaths(...config.plugins))
      .plugins();
    return {
      reader: reader({ config }),
      pusher: pusherBuilder()
        .plugins(plugins)
        .use([pusherOptions.processors(processors.unsplash.parametrizeCoverImage({ width: 880, height: 265 }))])
        .when(platforms('medium'), [
          pusherOptions.processors(
            processors.includeTags('programming'),
            processors.github.embedGists({ token: config.env['ghToken'] }),
          ),
        ])
        .build(),
      statusFetcher: statusFetcher({
        fetcher: fetcherBuilder()
          .plugins(plugins)
          .when(platforms('medium'), [
            fetcherOptions.processors(
              processors.excludeTags('programming'),
              processors.github.inlineGists({ token: config.env['ghToken'] }),
            ),
          ])
          .build(),
        processor: processorChain(
          // Somehow Medium headings contains different whitespace characters.
          processors.normalizeWhitespaces(),
          processors.normalizeApostrophes(),
          processors.normalizeUrls(),
          processors.stripComments(),
          processors.stripCodeAttrs(),
          processors.excludeMetadata('coverImage'),
        ),
        formatter: formatters.prettier({ printWidth: 120, proseWrap: 'always' }),
        stringifier: stringifier(),
      }),
    };
  };
  await program
    .name(Object.keys(pkg.bin)[0])
    .version(pkg.version, '-v, --version', 'Outputs Blogster CLI version.')
    .helpOption('-h, --help', 'Lists available commands and their short descriptions.')
    .globalOption(
      '--config <path>',
      'Path to a Blogster configuration file e.g. `.blogsterrc`, `package.json`, `blogster.config.js`).',
    )
    .addHelpCommand('help [command]', 'Shows a help message for this command in the console.')
    .addCommand(diffCommand, injector)
    .addCommand(pushCommand, injector)
    .addCommand(statusCommand, injector)
    .parseAsync(process.argv)
    .catch((err: Error) => console.error(chalk.red(`\n${err.stack}\n`)));
})();
