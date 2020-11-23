import { Plugin, pluginOfType, PluginPredicate } from '../../plugins';
import { PostPusher, pusher } from './pusher';
import { PostPusherPlugin } from './pusher-plugin';
import { PusherPluginOption } from './pusher-plugin-option';

export const pusherBuilder = (): PusherWithNone => new PusherBuilder();

class PusherBuilder implements PusherWithNone, PusherWithPlugins {
  private pluginArr: PostPusherPlugin[];
  private options: { predicate: (plugin: PostPusherPlugin) => boolean; option: PusherPluginOption }[] = [];

  plugins(plugins: Plugin<Record<string, unknown>>[]): PusherWithPlugins {
    this.pluginArr = plugins.filter(pluginOfType(PostPusherPlugin));
    return this;
  }

  use(options: PusherPluginOption[]): PusherWithPlugins {
    this.options.push(...options.map(option => ({ predicate: () => true, option })));
    return this;
  }

  when(predicate: PluginPredicate<PostPusherPlugin>, options: PusherPluginOption[]): PusherWithPlugins {
    this.options.push(...options.map(option => ({ predicate, option })));
    return this;
  }

  build(): PostPusher {
    return pusher({
      plugins: this.pluginArr.map(plugin =>
        this.options.reduce((p, { predicate, option }) => (predicate(p) ? option(p) : p), plugin),
      ),
    });
  }
}

interface PusherWithNone {
  plugins(plugins: Plugin[]): PusherWithPlugins;
}

interface PusherWithPlugins {
  use(options: PusherPluginOption[]): PusherWithPlugins;
  when(predicate: PluginPredicate<PostPusherPlugin>, options: PusherPluginOption[]): PusherWithPlugins;
  build(): PostPusher;
}
