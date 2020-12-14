![Blogster Banner](https://raw.githubusercontent.com/maximegel/blogster/master/assets/banner.png)

<h2 align="center">Crosspost to Medium and Dev.to automagically from the CLI</h2>
<p align="center">
  <a href="https://github.com/maximegel/blogster/actions?query=workflow%3Abuild">
    <img alt="build status" src="https://img.shields.io/github/workflow/status/maximegel/blogster/build/master?style=flat-square&logo=github">
  </a>
  <a href="https://www.npmjs.com/package/@blogster/cli">
    <img alt="npm version" src="https://img.shields.io/npm/v/@blogster/cli?style=flat-square">
  </a>
  <a href="https://www.npmjs.com/package/@blogster/cli">
    <img alt="downloads" src="https://img.shields.io/npm/dm/@blogster/cli?style=flat-square">
  </a>
  <a href="https://github.com/semantic-release/semantic-release">
    <img alt="semantic-release" src="https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat-square">
  </a>
  <a href="http://commitizen.github.io/cz-cli">
    <img alt="Commitizen friendly" src="https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=flat-square">
  </a>
  <a href="https://lerna.js.org">
    <img alt="maintained with Lerna" src="https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg?style=flat-square">
  </a>
  <a href="https://github.com/prettier/prettier">
    <img alt="prettier code style" src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square">
  </a>
</p>

## Introduction

Blogster is an extendable CLI tool allowing you to your write blog posts once in Markdown and then publish them on
multiple platforms in a single command.

### Highlights

- Posts written in [Markdown](https://commonmark.org/help/)
- Crosspost to [Medium][medium] and [Dev.to][devto]
- Automatic conversion between inline code blocks and embedded gists
- Changes visualization between local and published posts

## Installation

Install via `npm`:

```bash
npm install @blogster/cli --save-dev
```

Blogster also requires [Prettier][prettier] as a peer dependency to format published posts
and perform proper changes detection:

```bash
npm install prettier --save-dev
```

Then, since Blogster is useless without plugins, you have to install some of them too:

| Plugins                                     |                                                      |
| :------------------------------------------ | ---------------------------------------------------- |
| [@blogster/plugin-devto][devto-plugin-gh]   | [![npm][devto-plugin-npm-badge]][devto-plugin-npm]   |
| [@blogster/plugin-medium][medium-plugin-gh] | [![npm][medium-plugin-npm-badge]][medium-plugin-npm] |

## Getting started

Assuming you’ve successfully [installed the Blogster CLI](#installation) you are now ready to write and publish your
first post.

In this example, we will configure Blogster to publish to both [Medium][medium] and [Dev.to][devto] so make sure
[@blogster/plugin-devto][devto-plugin-gh] and [@blogster/plugin-medium][medium-plugin-gh] are installed too.

### Step 1: Add a post file

First, let's create a new Markdown file for our post. In our case, this new file will be added under
`posts/sample-post/post.md`, but it can be everywhere you want.

Now, open up your favorite IDE and some content to our `post.md` file:

```markdown
---
title: My First Post
description:
coverImage: https://unsplash.com/photos/ualbj7tyJH0
tags:
  - blogster
  - first-post
  - so-excited
---

## Hi there!

This is my first post published with [Blogster](https://github.com/maximegel/blogster)! 🎉
```

Noticed the [YAML front matter](https://jekyllrb.com/docs/front-matter) separated by `---` at the top? Blogster
use this metadata to track and publish your posts. For now, the only options available are those above.

> _Warning:_  
> Blogster uses the `title` metadata to match your local posts with your published posts, so make sure the title used in
> your post file is the same for all of your published posts

### Step 2: Add a configuration file

Add a `.blogsterrc.json` file at the root of your project and add the locations of your post files as well as the
installed plugins:

```json
{
  "plugins": ["@blogster/plugin-devto", "@blogster/plugin-medium"],
  "include": ["posts/**/post.md"]
}
```

For all available options see the [configuration](#configuration).

### Step 3: Set environment variables

Because we are using [@blogster/plugin-devto][devto-plugin-gh] and [@blogster/plugin-medium][medium-plugin-gh]
we need some tokens/keys to be set as environment variables.

To obtain them, please follow these steps:

- [Generate a Medium access token](https://github.com/Medium/medium-api-docs#21-self-issued-access-tokens)
- [Generate a Dev.to API key](https://docs.dev.to/api/#getting-an-api-key)
- [Generate a GitHub personal access token](https://docs.github.com/en/free-pro-team@latest/github/authenticating-to-github/creating-a-personal-access-token)

> _Info_: The GitHub token is used to replace code blocks by embeded Gists while publishing to Medium.

Once you did this, create a `.env` file at the root of your project and add your previously generated tokens/keys:

```text
BLOGSTER_MEDIUM_TOKEN="YOUR SECRET TOKEN"
BLOGSTER_DEVTO_API_KEY="YOUR SECRET KEY"
BLOGSTER_GH_TOKEN="YOUR SECRET TOKEN"
```

> _Danger_: **Do not commit your `.env` file!**

### Step 4: Publish your post

Congrats! The only things left his to publish our post and it is sample as:

```bash
npx bgs push
```

> _Info:_ Posts will be published as draft so you can review them before really publishing them.

## Command line

To run a command, you’ll need to prefix each command in order to properly locate the executable:

```bash
./node_modules/.bin/bgs [options] [command]
```

Or you can use npx (requires [npm@5.2.0](https://www.npmjs.com/package/npm/v/5.2.0) or greater):

```bash
npx bgs [options] [command]
```

### `bgs diff`

Outputs changes between post files and published posts in diff format.

```bash
bgs diff [options] [file/dir/glob...]
```

| Arguments            |                                                         |
| -------------------- | ------------------------------------------------------- |
| `[file/dir/glob...]` | Globs of post files to include e.g. `posts/**/post.md`. |

| Options                   |                                                                                                                                                                                    |
| :------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--p --platforms <names>` | List of platforms to include e.g. `dev.to, medium`. When none, all platforms are included. See the documentation of your configured plugins to know which platforms are available. |

### `bgs push`

Publishes or updates posts. Posts will be published as draft so you can review them before really publishing them.

```bash
bgs push [options] [file/dir/glob...]
```

| Arguments            |                                                         |
| :------------------- | ------------------------------------------------------- |
| `[file/dir/glob...]` | Globs of post files to include e.g. `posts/**/post.md`. |

| Options                   |                                                                                                                                                                                    |
| :------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--p --platforms <names>` | List of platforms to include e.g. `dev.to, medium`. When none, all platforms are included. See the documentation of your configured plugins to know which platforms are available. |

### `bgs status`

Outputs the status of each post i.e. "unpublished", "synced" or "desynced".

```bash
bgs status [options] [file/dir/glob...]
```

| Arguments            |                                                         |
| :------------------- | ------------------------------------------------------- |
| `[file/dir/glob...]` | Globs of post files to include e.g. `posts/**/post.md`. |

| Options                   |                                                                                                                                                                                    |
| :------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--p --platforms <names>` | List of platforms to include e.g. `dev.to, medium`. When none, all platforms are included. See the documentation of your configured plugins to know which platforms are available. |

## Configuration

The default behavior of Blogster can be modified by supplying any of the configuration options:

| Option    | Default | Description                                                                              |
| --------- | ------- | ---------------------------------------------------------------------------------------- |
| `plugins` | `[]`    | A list of plugin names e.g. `@blogster/plugin-medium`                                    |
| `env`     | `[]`    | Any values to be set as environment variables                                            |
| `include` | `[]`    | A list of filenames or patterns to include in tracked blog posts e.g. `posts/**/post.md` |
| `exclude` | `[]`    | A list of filenames or patterns to exclude from tracked blog posts                       |

Thanks to [Cosmiconfig](https://github.com/davidtheclark/cosmiconfig), the configuration can be loaded from
either of the following places:

- a `blogster` property in package.json
- a `.blogsterrc` file in JSON or YAML format
- a `.blogsterrc.json`, `.blogsterrc.yaml`, `.blogsterrc.yml`, `.blogsterrc.js`, or `.blogsterrc.cjs` file
- a `blogster.config.js` or `blogster.config.cjs` CommonJS module exporting an object

## Environment variables

Environment variables are used by plugins to load extra configuration required by them.

See the documentation of your configured plugins to know which environment variables need to be set.

There are different ways to set environment variables. Each has a slightly different use case.

### Option 1: configuration file

Any key/value you set in your configuration file (e.g. `.blogsterrc.json`) under the `env` key will become an
environment variable:

```json
"env": {
  "myBlogUrl": "https://my-blog.com"
}
```

### Option 2: `BLOGSTER_*`

Any OS-level environment variable on your machine that starts with either `BLOGSTER_` or `blogster_` will automatically
be added to environment variables.

Blogster will strip off the `BLOGSTER_` and convert the remaining part to camel-case when adding your environment
variables.

### Option 3: dotenv

Thanks to [dotenv](https://github.com/motdotla/dotenv), Blogster will loads environment variables from a `.env` file as
if they were native environment variables (see: [option 2](#option-2-blogster)).

Create a `.env` file in the root directory of your project. Add environment-specific variables on new lines in the form
of `NAME=VALUE`. For example:

```text
BLOGSTER_MY_BLOG_URL="https://my-blog.com"
```

## Tooling

The best part about writing posts in Markdown is that there are a variety of tools available. Here is some you might
like:

### Prettier

Use [Prettier][prettier] to format your Mardown files. We recommend you to create a `.prettierrc` file under the
directory containing your post files and add those options:

```json
{
  "printWidth": 120,
  "proseWrap": "always"
}
```

### Markdownlint

Use [Markdownlint](https://github.com/DavidAnson/markdownlint) to enforce rules in your Markdown files. We recommend you
to create a `.markdownlintrc` file under the directory containing your post files and add those rule
options:

```json
{
  "line-length": { "line_length": 120 },
  "no-trailing-punctuation": { "punctuation": ".,;:!。，；：！？" },
  "first-line-heading": { "level": 2 }
}
```

### Visual Studio Code

Here is some [Visual Studio Code](https://code.visualstudio.com) handy extensions:

- [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [markdownlint](https://marketplace.visualstudio.com/items?itemName=DavidAnson.vscode-markdownlint)
- [Read Time](https://marketplace.visualstudio.com/items?itemName=johnpapa.read-time) by John Papa to estimate your
  posts read time.
- [:emojisense:](https://marketplace.visualstudio.com/items?itemName=bierner.emojisense) for addind emojis to your posts.

## Example

Take a look a this [repository](https://github.com/maximegel/maximegel.github.io) for a real world example on how to use
Blogster.

## Known issues

- As this time, [Medium API](https://github.com/Medium/medium-api-docs) still do not support updating posts. Until then,
  the easiest way is to use the `diff` command and make changes manually.

<!-- References: -->

[devto]: https://dev.to/
[devto-plugin-gh]: https://github.com/maximegel/blogster/tree/master/packages/plugin-devto
[devto-plugin-npm]: https://www.npmjs.com/package/@blogster/plugin-devto
[devto-plugin-npm-badge]: https://img.shields.io/npm/v/@blogster/plugin-devto?style=flat-square
[medium]: https://medium.com
[medium-plugin-gh]: https://github.com/maximegel/blogster/tree/master/packages/plugin-medium
[medium-plugin-npm]: https://www.npmjs.com/package/@blogster/plugin-medium
[medium-plugin-npm-badge]: https://img.shields.io/npm/v/@blogster/plugin-medium?style=flat-square
[prettier]: https://github.com/prettier/prettier
