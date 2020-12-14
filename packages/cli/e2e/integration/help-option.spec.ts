import { cli } from '~support';

describe('help option', () => {
  it('should output help for all commands at root level', async () => {
    await expect(cli.exec('--help')).resolves.toIncludeMultiple([
      'Usage: bgs',
      'Options:',
      '--version',
      '--help',
      'Commands:',
      'help',
    ]);
  });
});
