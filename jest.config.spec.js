const base = require('./jest.config.base');

module.exports = {
  ...base,
  projects: ['<rootDir>/packages/*/jest.config.spec.js'],
};