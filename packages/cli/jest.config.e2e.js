const base = require('../../jest.config.base');
const packageName = require('./package.json').name.split('/')[1];
const name = `${packageName}(e2e)`;

module.exports = {
  ...base,
  name,
  displayName: name,
  rootDir: '../..',
  testRegex: `(packages/${packageName}/e2e/.*\\.(test|spec))\\.ts$`,
  setupFiles: [`<rootDir>/packages/${packageName}/e2e/support/index.js`],
  globals: {
    'ts-jest': {
      tsconfig: `packages/${packageName}/tsconfig.e2e.json`,
    },
  },
};
