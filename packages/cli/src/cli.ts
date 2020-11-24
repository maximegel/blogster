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

(async () => {
  const config = await configBuilder()
    .use(configProviders.defaults)
    .use(configProviders.cosmic('blogster'))
    .use(configProviders.env)
    .config();
  const plugins = await pluginLoader({ config })
    .use(pluginProviders.modulePaths('tools/blogster/plugins/devto', 'tools/blogster/plugins/medium'))
    .plugins();
  const deps = (() => ({
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
        processors.stripCodeBlockAttrs(),
        processors.excludeMetadata('coverImage'),
      ),
      formatter: formatters.prettier({ printWidth: 120, proseWrap: 'always' }),
      stringifier: stringifier(),
    }),
  }))();

  program.addCommand(diffCommand(deps));
  program.addCommand(pushCommand(deps));
  program.addCommand(statusCommand(deps));

  await program.parseAsync(process.argv).catch((err: Error) => console.error(chalk.red(`\n${err.stack}\n`)));
})();
