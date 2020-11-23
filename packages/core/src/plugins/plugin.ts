import { Config } from '../config';

export interface Plugin<M extends Record<string, unknown> = Record<string, unknown>> {
  readonly metadata: M;
}
export interface PluginDeps {
  readonly config: Config;
}
export type PluginFactory = (deps: PluginDeps) => Plugin;

export function createPlugin<P extends Plugin>(
  fn: (deps: PluginDeps) => Omit<P, 'metadata'>,
): (metadata: P['metadata']) => PluginFactory;

export function createPlugin<P extends Plugin>(
  fn: (deps: PluginDeps) => Omit<P, 'metadata'>,
  metadata: P['metadata'],
): PluginFactory;

export function createPlugin<P extends Plugin>(
  fn: (deps: PluginDeps) => Omit<P, 'metadata'>,
  metadata?: P['metadata'],
): ((metadata: P['metadata']) => PluginFactory) | PluginFactory {
  const curried = (metadata: P['metadata']) => (deps: PluginDeps) => ({ ...fn(deps), metadata: metadata ?? {} });
  return metadata ? curried(metadata) : curried;
}

export const createMultiPlugin = (...plugins: PluginFactory[]): PluginFactory[] => plugins;

export const pluginOfType = <P extends Plugin>(type: { new (): P }) => (plugin: unknown): plugin is P => {
  const functions = (obj: unknown) => Object.getOwnPropertyNames(obj).filter(prop => typeof obj[prop] === 'function');
  const typeFunctions = functions(new type());
  const pluginFunctions = functions(plugin ?? {});
  return typeFunctions.every(fn => pluginFunctions.includes(fn));
};
