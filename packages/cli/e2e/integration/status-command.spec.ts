import dedent from 'dedent';
import { cli } from '~support';

describe('status command', () => {
  beforeEach(() => {
    cli.resetMocks();
    cli.mockPlugin('fixtures/plugins/post-fetcher-plugin', {
      metadata: { platform: 'my-blog' },
      fetchRemoteRefs: [
        { id: '00', title: 'The Next Big Thing', publicUrl: 'https://my-blog.com/post/00' },
        { id: '01', title: 'Never Underestimate The Influence Of Tech', publicUrl: 'https://my-blog.com/post/01' },
      ],
      fetchRemoteBody: {
        '00': {
          metadata: { title: 'The Next Big Thing' },
          content: 'Hi everyone, in this article I will talk about the next big thing.',
        },
        '01': {
          metadata: { title: 'Never Underestimate The Influence Of Tech' },
          content: 'Hi everyone, in this article I will talk about the influence of tech.',
        },
      },
    });
    cli.mockPosts({
      'next-big-thing.md': dedent`
        ---
        title: The Next Big Thing
        ---
        Hi everyone, in this article I will talk about the next big thing.
      `,
      'influence-of-tech.md': dedent`
        ---
        title: Never Underestimate The Influence Of Tech
        ---
        Hi everyone, in this article I will talk about the influence of tech in our lifes.
      `,
      'cybersecurity-explained.md': dedent`
        ---
        title: Cybersecurity Explained
        ---
        Hi everyone, in this article I will talk about cybersecurity.
      `,
    });
  });

  it('should output the status of all posts when no globs are passed', async () => {
    await expect(cli.exec('status')).resolves.toIncludeMultiple([
      'The Next Big Thing SYNCED @ my-blog (https://my-blog.com/post/00)',
      'Never Underestimate The Influence Of Tech DESYNCED @ my-blog (https://my-blog.com/post/01)',
      'Cybersecurity Explained UNPUBLISHED @ my-blog',
    ]);
  });

  it('should output the status of matching posts when globs are passed', async () => {
    await expect(cli.exec('status **/next-big-thing.md')).resolves.toIncludeMultiple([
      'The Next Big Thing SYNCED @ my-blog',
    ]);
  });
});
