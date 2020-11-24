import { Octokit } from '@octokit/core';
import _ from 'lodash';
import fetch from 'node-fetch';
import yaml from 'yaml';
import { createAsyncContentProcessor, PostProcessor } from '../../post-processor';

export const embedGists = (config: { token: string }): PostProcessor => {
  const client = new Octokit({ auth: config.token });
  return createAsyncContentProcessor(async ({ content, metadata }, { visit, map }) => {
    const langMap = await fetchLangMap();
    const files: Record<string, { content: string; filename: string }> = {};
    let increment = 0;

    visit(content, 'code', code => {
      const ext = langMap[code.lang?.toLowerCase()]?.extensions[0] ?? '';
      const filename = `sample-${_.padStart(`${++increment}`, 2, '0')}${ext}`;
      code.data = { ...(code.data ?? {}), gist: { filename } };
      files[filename] = { content: code.value, filename };
    });

    // TODO: Make prefix configurable.
    const prefix = 'blog-post:';
    const title = `#${prefix}${_.kebabCase(metadata.title)}`;
    const heading = { [title]: { content: metadata.description ?? 'No description available.', filename: title } };
    const found = await client
      .request('GET /gists', { per_page: 100 })
      .then(res => res.data.find(gist => !!gist.files[title]));
    const res = found
      ? await client.request(`PATCH /gists/:gist_id`, { gist_id: found.id, files: { ...heading, ...files } })
      : await client.request('POST /gists', {
          public: true,
          // TODO: Use canonical URL if some instead of title.
          description: `Code samples from blog post: ${metadata.title}`,
          files: { ...heading, ...files },
        });

    map(content, 'code', code => {
      const filename = (code.data?.gist as { filename: string })?.filename;
      if (!filename) return code;
      return { type: 'html', value: `<script src="${res.data.html_url}?file=${filename}"></script>` };
    });
  });
};

type LangMap = Record<string, { extensions: string[] }>;
let fetchLangMap = async (): Promise<LangMap> => {
  const result = await fetch('https://raw.githubusercontent.com/github/linguist/master/lib/linguist/languages.yml')
    .then(res => res.text())
    .then(yaml.parse)
    .then(Object.entries)
    .then(entries =>
      _(entries)
        .flatMap(([key, val]) => [[key, val], ...(val.aliases ?? []).map((alias: string) => [alias, val])])
        .reduce((map, [key, val]) => ({ ...map, [(key as string).toLowerCase()]: val }), {}),
    );
  // Caches future calls.
  fetchLangMap = () => Promise.resolve(result);
  return result;
};
