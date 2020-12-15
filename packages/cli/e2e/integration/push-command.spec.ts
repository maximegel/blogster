import dedent from 'dedent';
import { cli } from '~support';

describe('push command', () => {
  it('should publish when unpublished', async () => {
    cli.mockPlugin('fixtures/plugins/devblog-fetcher-plugin', {
      fetchRemoteRefs: [],
      fetchRemoteBody: {},
    });
    cli.mockPlugin('fixtures/plugins/devblog-pusher-plugin');
    cli.mockPost(
      'top-programming-langs.md',
      dedent`
        ---
        title: Top Programming Languages
        ---
        Learning the most popular programming languages will help you...
      `,
    );
    await expect(cli.exec('push')).resolves.toIncludeMultiple(['succ: [publish] Top Programming Languages @ devblog']);
  });

  it('should publish when unpublished', async () => {
    cli.mockPlugin('fixtures/plugins/devblog-fetcher-plugin', {
      fetchRemoteRefs: [{ id: '00', title: 'Top Programming Languages', publicUrl: 'https://devblog.com/post/00' }],
      fetchRemoteBody: {
        '00': {
          metadata: { title: 'Top Programming Languages' },
          content: 'Top programming languages are:\n 1. Python\n 2. Kotlin\n 3. Java',
        },
      },
    });
    cli.mockPlugin('fixtures/plugins/devblog-pusher-plugin');
    cli.mockPost(
      'top-programming-langs.md',
      dedent`
        ---
        title: Top Programming Languages
        ---
        Top programming languages are:\n 1. Python\n 2. Kotlin\n 3. JavaScript
      `,
    );
    await expect(cli.exec('push')).resolves.toIncludeMultiple([
      'succ: [update] Top Programming Languages @ devblog (https://devblog.com/post/00)',
    ]);
  });
});
