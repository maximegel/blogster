const base = require('./jest.config.base');

module.exports = {
  ...base,
  projects: ['<rootDir>/packages/*/jest.config.e2e.js'],
  testTimeout: 30000,
};
