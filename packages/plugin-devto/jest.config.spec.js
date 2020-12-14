const { pathsToModuleNameMapper } = require('ts-jest/utils');
const { compilerOptions } = require('./tsconfig.spec.json');
const base = require('../../jest.config.base');
const packageName = require('./package.json').name.split('/')[1];
const name = `${packageName}`;

module.exports = {
  ...base,
  name,
  displayName: name,
  rootDir: '../..',
  testRegex: `(packages/${packageName}/src/.*\\.(test|spec))\\.ts$`,
  setupFilesAfterEnv: [`<rootDir>/packages/${packageName}/jest-setup.ts`],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: `<rootDir>/packages/${packageName}/` }),
  globals: {
    'ts-jest': {
      tsconfig: `packages/${packageName}/tsconfig.spec.json`,
    },
  },
};
