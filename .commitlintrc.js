const { getPackages } = require('@commitlint/config-lerna-scopes').utils;

module.exports = {
  extends: ['@commitlint/config-conventional', '@commitlint/config-lerna-scopes'],
  rules: {
    'scope-enum': async ctx => [2, 'always', [...(await getPackages(ctx)), '*', 'readme', 'release', 'vscode']],
  },
};
