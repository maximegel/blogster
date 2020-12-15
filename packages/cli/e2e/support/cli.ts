import { Config } from '@blogster/core';
import child from 'child_process';
import findRoot from 'find-root';
import fs from 'fs-extra';
import { dirname, join, relative } from 'path';
import stripAnsi from 'strip-ansi';
import { promisify } from 'util';

class Cli {
  private defaults = {
    config: { path: 'tmp/blogsterrc.json', options: {} },
    plugins: [],
    posts: [],
  };
  private mockedFiles: string[] = [];
  private mocks: {
    config: { path: string; options: Partial<Config> };
    plugins: Record<string, Record<string, unknown>>[];
    posts: Record<string, string>[];
  } = this.defaults;
  private root = join(findRoot(__dirname), 'e2e');

  private get configPath() {
    return this.mocks?.config?.path;
  }

  private get config(): Partial<Config> {
    const configDir = join(this.root, dirname(this.configPath));
    const relRoot = relative(configDir, this.root);
    return {
      plugins: Object.entries(this.mocks?.plugins ?? []).map(([path]) => join(relRoot, path)),
      include: Object.entries(this.mocks?.posts ?? []).map(([path]) => relative(configDir, join(this.root, path))),
    };
  }

  async exec(command: string): Promise<string> {
    if (this.configPath) command += ` --config ${this.configPath}`;
    this.mockFile(this.configPath, JSON.stringify(this.config));
    return await this.execChild(command)
      .then(stripAnsi)
      .then(stdout => stdout.trim())
      // Removes whitespaces of more than two characters.
      .then(stdout => stdout.replace(/[ ]{2,}/g, ' '));
  }

  mockConfig(config: Partial<Config>, options?: { path?: string }): Cli {
    const path = options?.path ?? this.configPath;
    this.mocks.config = { path, options: config };
    return this;
  }

  mockPlugin(modulePath: string, returns?: Record<string, unknown>): void {
    if (returns) this.mockFile(modulePath + '.json', JSON.stringify(returns));
    this.mocks.plugins[modulePath + '.ts'] = returns ?? {};
  }

  mockPlugins(moduleReturns: Record<string, Record<string, unknown>>): void {
    Object.entries(moduleReturns).forEach(([modulePath, returns]) => this.mockPlugin(modulePath, returns));
  }

  mockPost(filename: string, content: string, options?: { dir?: string }): void {
    const path = join(options?.dir ?? 'tmp/posts', filename);
    this.mockFile(path, content);
    this.mocks.posts[path] = content;
  }

  mockPosts(fileContents: Record<string, string>, options?: { dir?: string }): void {
    Object.entries(fileContents).forEach(([filename, content]) => this.mockPost(filename, content, options));
  }

  resetMocks(): void {
    // for (const path of this.mockedFiles) fs.unlinkSync(path);
    this.mocks = this.defaults;
  }

  private async execChild(args: string): Promise<string> {
    return await promisify(child.exec)(
      `ts-node --project ../tsconfig.lib.json -r tsconfig-paths/register ../src/cli.ts ${args}`,
      {
        cwd: 'packages/cli/e2e',
      },
    ).then(({ stdout, stderr }) => {
      if (!stdout) throw new Error(stderr);
      else return stdout;
    });
  }

  private mockFile(path: string, content: string): void {
    const absPath = join(this.root, path);
    fs.outputFileSync(absPath, content);
    this.mockedFiles.push(absPath);
  }
}

export const cli = new Cli();
