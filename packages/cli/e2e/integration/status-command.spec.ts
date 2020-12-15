import dedent from 'dedent';
import { cli } from '~support';

describe('status command', () => {
  const plugins = {
    devblog: {
      'fixtures/plugins/devblog-fetcher-plugin': {
        fetchRemoteRefs: [{ id: '00', title: 'Top Programming Languages', publicUrl: 'https://devblog.com/post/00' }],
        fetchRemoteBody: {
          '00': {
            metadata: { title: 'Top Programming Languages' },
            content: 'Learning the most popular programming languages will help you...',
          },
        },
      },
    },
    techblog: {
      'fixtures/plugins/techblog-fetcher-plugin': {
        fetchRemoteRefs: [
          { id: '01', title: 'The Next Big Thing', publicUrl: 'https://techblog.com/post/01' },
          { id: '02', title: 'Never Underestimate The Influence Of Tech', publicUrl: 'https://techblog.com/post/02' },
        ],
        fetchRemoteBody: {
          '01': {
            metadata: { title: 'The Next Big Thing' },
            content: 'Artificial Intelligence is already everywhere...',
          },
          '02': {
            metadata: { title: 'Never Underestimate The Influence Of Tech' },
            content: 'In the last century, nothing has made more of an impact on our lives than technology...',
          },
        },
      },
    },
  };
  const posts = {
    topProgrammingLangs: {
      'top-programming-langs.md': dedent`
        ---
        title: Top Programming Languages
        ---
        Learning the most popular programming languages will help you...
      `,
    },
    nextBigThing: {
      'next-big-thing.md': dedent`
        ---
        title: The Next Big Thing
        ---
        Artificial Intelligence is already everywhere...
      `,
    },
    influenceOfTech: {
      'influence-of-tech.md': dedent`
        ---
        title: Never Underestimate The Influence Of Tech
        ---
        In the 21s century, nothing has made more of an impact on our daily lives than technology...
      `,
    },
    cybersecurityExplained: {
      'cybersecurity-explained.md': dedent`
        ---
        title: Cybersecurity Explained
        ---
        Cybersecurity involves protecting all information existing on the internet...
      `,
    },
  };

  beforeEach(() => {
    cli.resetMocks();
  });

  it('should output the status of all posts when no globs are passed', async () => {
    cli.mockPlugins({ ...plugins.techblog });
    cli.mockPosts({ ...posts.nextBigThing, ...posts.influenceOfTech, ...posts.cybersecurityExplained });
    await expect(cli.exec('status')).resolves.toIncludeMultiple([
      'The Next Big Thing SYNCED @ techblog (https://techblog.com/post/01)',
      'Never Underestimate The Influence Of Tech DESYNCED @ techblog (https://techblog.com/post/02)',
      'Cybersecurity Explained UNPUBLISHED @ techblog',
    ]);
  });

  it('should output the status of matching posts when globs are passed', async () => {
    cli.mockPlugins({ ...plugins.techblog });
    cli.mockPosts({ ...posts.nextBigThing, ...posts.influenceOfTech, ...posts.cybersecurityExplained });
    await expect(cli.exec('status **/next-big-thing.md')).resolves.toIncludeMultiple([
      'The Next Big Thing SYNCED @ techblog (https://techblog.com/post/01)',
    ]);
  });

  it('should filter statuses by platform', async () => {
    cli.mockPlugins({ ...plugins.devblog, ...plugins.techblog });
    cli.mockPosts({ ...posts.topProgrammingLangs, ...posts.nextBigThing });
    await expect(cli.exec('status --platforms devblog')).resolves.toIncludeMultiple([
      'Top Programming Languages SYNCED @ devblog (https://devblog.com/post/00)',
      'The Next Big Thing UNPUBLISHED @ devblog',
    ]);
  });
});
