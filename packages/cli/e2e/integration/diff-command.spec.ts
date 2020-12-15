import dedent from 'dedent';
import { cli } from '~support';

describe('diff command', () => {
  const plugins = {
    devblog: {
      'fixtures/plugins/devblog-fetcher-plugin': {
        fetchRemoteRefs: [{ id: '00', title: 'Top Programming Languages', publicUrl: 'https://devblog.com/post/00' }],
        fetchRemoteBody: {
          '00': {
            metadata: { title: 'Top Programming Languages' },
            content: 'Top programming languages are:\n 1. Python\n 2. Kotlin\n 3. Java',
          },
        },
      },
    },
  };

  it('should output diff when post has changed', async () => {
    cli.mockPlugins({ ...plugins.devblog });
    cli.mockPost(
      'top-programming-langs.md',
      dedent`
        ---
        title: Top Programming Languages
        ---
        Top programming languages are:\n 1. Python\n 2. Kotlin\n 3. JavaScript
      `,
    );
    await expect(cli.exec('diff')).resolves.toIncludeMultiple([
      'Top Programming Languages @ devblog (https://devblog.com/post/00)',
      '= [6 unmodified lines]',
      '2. Kotlin',
      '- 3. Java',
      '+ 3. JavaScript',
    ]);
  });
});
