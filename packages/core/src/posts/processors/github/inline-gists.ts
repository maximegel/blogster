import { Octokit } from '@octokit/core';
import { createAsyncContentProcessor, PostProcessor } from '../../post-processor';

export const inlineGists = (config: { token: string }): PostProcessor => {
  const client = new Octokit({ auth: config.token });
  const scriptPattern = /^\s*<script[^>]*src=['"](.*?)['"].*?>(?:<\/script>)?\s*$/i;
  const gistUrlPattern = /^https?:\/\/gist\.github\.com\/[^/]+\/(\w+)\.js(?:[?&]\w+=(?:.+))?[?&]file=(.+)$/i;
  return createAsyncContentProcessor(async ({ content }, { visit, map }) => {
    const gistIds: string[] = [];

    visit(content, 'html', html => {
      const [script, src] = html.value.match(scriptPattern) ?? [];
      const [url, id, filename] = src?.match(gistUrlPattern) ?? [];
      if (!script || !url) return;
      html.data = { ...(html.data ?? {}), gist: { id, filename } };
      gistIds.push(id);
    });

    const gists = await Promise.all(
      gistIds.map(id => client.request('GET /gists/:gist_id', { gist_id: id }).then(res => res.data)),
    );

    map(content, 'html', html => {
      const { id, filename } = (html.data?.gist ?? {}) as { id: string; filename: string };
      if (!id) return;
      const file = gists.find(g => g.id === id)?.files[filename];
      if (!file) return;
      // TODO: Resolve Markdown code highlight language from `file.language`.
      return { type: 'code', value: file.content };
    });
  });
};
