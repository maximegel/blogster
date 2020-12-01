import { run } from '~support';

describe('help option', () => {
  it('should output help for all commands at root level', async () => {
    const output = await run('--help');
    expect(output).toIncludeMultiple([
      'Usage: bgs',
      'Options:',
      '--version',
      '--help',
      'Commands:',
      'diff',
      'push',
      'status',
      'help',
    ]);
  });
});
