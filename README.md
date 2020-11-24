![Blogster Banner](https://raw.githubusercontent.com/maximegel/blogster/master/assets/banner.png)

<h2 align="center">Crosspost to Medium and Dev.to automagically from the CLI</h2>
<p align="center">
  <a href="https://github.com/maximegel/blogster/actions?query=workflow%3Abuild">
    <img alt="GitHub Actions build status" src="https://img.shields.io/github/workflow/status/maximegel/blogster/build/master?style=flat-square&logo=github">
  </a>
  <a href="https://github.com/semantic-release/semantic-release">
    <img alt="semantic-release" src="https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat-square">
  </a>
  <a href="http://commitizen.github.io/cz-cli">
    <img alt="Commitizen friendly" src="https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=flat-square">
  </a>
  <a href="https://lerna.js.org">
    <img alt="Maintained with Lerna" src="https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg?style=flat-square">
  </a>
  <a href="https://github.com/prettier/prettier">
    <img alt="Prettier code style" src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square">
  </a>
</p>

## Introduction

Blogster is an extendable CLI tool allowing you to your write blog posts once in Markdown and then publish them on
multiple platforms in a single command.

### Highlights

- Posts written in Markdown
- Crosspost to [Medium][medium] and [Dev.to][devto]
- Automatic conversion between inline code blocks and embedded gists
- Changes visualization between local and published posts

## Getting started

### Installation

Install Blogster via `npm`:

```bash
cd /your/project/path
```

```bash
cd npm install @blogster/cli --save-dev
```

This will install Blogster locally as a dev dependency for your project.

### Usage

Use the help option to see the available commands:

```bash
npx bgs --help
```

<!-- References: -->

[devto]: https://dev.to/
[medium]: https://medium.com
