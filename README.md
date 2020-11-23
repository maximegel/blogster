# Jumpstart with Lerna and Sementic Releases

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=flat-square)](http://commitizen.github.io/cz-cli/)

Getting started using Lerna and semantic releases with:

- [commitlint](https://github.com/conventional-changelog/commitlint)
- [commitizen](https://github.com/commitizen/cz-cli)
- [husky](https://github.com/typicode/husky)
- [lint-staged](https://github.com/okonet/lint-staged)
- [eslint](https://github.com/eslint/eslint)
- [prettier](https://github.com/prettier/prettier)
- [typescript](https://github.com/Microsoft/TypeScript)

Since this is an example repository, packages are published to a local instance of [Verdaccio](https://github.com/verdaccio/verdaccio) (i.e. an on-premise NPM registry) instead of being published to NPM directly.

To run Verdaccio from a Docker container:

```bash
docker run -it --rm --name verdaccio -p 4873:4873 verdaccio/verdaccio
```
