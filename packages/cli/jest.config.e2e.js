const { pathsToModuleNameMapper } = require('ts-jest/utils');
const { compilerOptions } = require('./tsconfig.e2e.json');
const base = require('../../jest.config.base');
const packageName = require('./package.json').name.split('/')[1];
const name = `${packageName}(e2e)`;

module.exports = {
  ...base,
  name,
  displayName: name,
  rootDir: '../..',
  testRegex: `(packages/${packageName}/e2e/.*\\.(test|spec))\\.ts$`,
  setupFilesAfterEnv: ['jest-extended', `<rootDir>/packages/${packageName}/jest-setup.e2e.ts`],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: `<rootDir>/packages/${packageName}/` }),
  globals: {
    'ts-jest': {
      tsconfig: `packages/${packageName}/tsconfig.e2e.json`,
    },
  },
};
