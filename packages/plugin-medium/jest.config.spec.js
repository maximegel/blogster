const base = require('../../jest.config.base');
const packageName = require('./package.json').name.split('/')[1];
const name = `${packageName}`;

module.exports = {
  ...base,
  name,
  displayName: name,
  rootDir: '../..',
  testRegex: `(packages/${packageName}/src/.*\\.(test|spec))\\.ts$`,
  globals: {
    'ts-jest': {
      tsconfig: `packages/${packageName}/tsconfig.spec.json`,
    },
  },
};
