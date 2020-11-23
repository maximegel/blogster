import { Plugin, pluginOfType, PluginPredicate } from '../../plugins';
import { FetcherPluginOption } from '../fetcher/fetcher-plugin-option';
import { fetcher, PostFetcher } from './fetcher';
import { PostFetcherPlugin } from './fetcher-plugin';

export const fetcherBuilder = (): FetcherWithNone => new FetcherBuilder();

class FetcherBuilder implements FetcherWithNone, FetcherWithPlugins {
  private pluginArr: PostFetcherPlugin[];
  private options: { predicate: (plugin: PostFetcherPlugin) => boolean; option: FetcherPluginOption }[] = [];

  plugins(plugins: Plugin<Record<string, unknown>>[]): FetcherWithPlugins {
    this.pluginArr = plugins.filter(pluginOfType(PostFetcherPlugin));
    return this;
  }

  use(options: FetcherPluginOption[]): FetcherWithPlugins {
    this.options.push(...options.map(option => ({ predicate: () => true, option })));
    return this;
  }

  when(predicate: PluginPredicate<PostFetcherPlugin>, options: FetcherPluginOption[]): FetcherWithPlugins {
    this.options.push(...options.map(option => ({ predicate, option })));
    return this;
  }

  build(): PostFetcher {
    return fetcher({
      plugins: this.pluginArr.map(plugin =>
        this.options.reduce((p, { predicate, option }) => (predicate(p) ? option(p) : p), plugin),
      ),
    });
  }
}

interface FetcherWithNone {
  plugins(plugins: Plugin[]): FetcherWithPlugins;
}

interface FetcherWithPlugins {
  use(options: FetcherPluginOption[]): FetcherWithPlugins;
  when(predicate: PluginPredicate<PostFetcherPlugin>, options: FetcherPluginOption[]): FetcherWithPlugins;
  build(): PostFetcher;
}
