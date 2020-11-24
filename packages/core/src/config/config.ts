export interface Config {
  plugins: string[];
  env: Record<string, string>;
  include: string[];
  exclude: string[];
}
