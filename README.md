## clone tool

<!-- _One liner + link to confluence page_
_Screenshot of UI - optional_ -->

Inspired by [Davinci Resolve](https://www.blackmagicdesign.com/products/davinciresolve/media)'s [clone tool](https://www.rocketstock.com/blog/davinci-resolves-new-clone-tool-indispensable-dits/) and other similar once.

![clone tool](./docs/screenshots/clone-tool.png)

## Setup

<!-- _stack - optional_
_How to build and run the code/app_ -->

```
git clone git@github.com:pietrop/clone-tool.git
```

```
cd clone-tool
```

```
npm install
```

## Usage

For development

```
npm start
```

For ready made version, checkout [release section](https://github.com/pietrop/clone-tool/releases)
For now Mac only, but it's technically possible to add Linux and Windows electron packaging, PRs welcome.

## System Architecture

<!-- _High level overview of system architecture_ -->

- [electron](https://www.electronjs.org) app,
- [materialize css](https://materializecss.com/) for styling, and vanilla Js.
- [`copy-dir`](https://www.npmjs.com/package/copy-dir) for copying the folder recursivly
- A local modified version of [`dirsum`](https://github.com/mcavage/node-dirsum#readme) to get a checksum of the source and dest folder, as well as the individual file, to double check integrity of the copy using `md5`

## Documentation

There's a [docs](./docs) folder in this repository.

[docs/notes](./docs/notes) contains dev draft notes on various aspects of the project. This would generally be converted either into ADRs or guides when ready.

[docs/adr](./docs/adr) contains [Architecture Decision Record](https://github.com/joelparkerhenderson/architecture_decision_record).

> An architectural decision record (ADR) is a document that captures an important architectural decision made along with its context and consequences.

We are using [this template for ADR](https://gist.github.com/iaincollins/92923cc2c309c2751aea6f1b34b31d95)

## Development env

 <!-- _How to run the development environment_ -->

- npm > `6.1.0`
- [Node > 10 - dubnium](https://scotch.io/tutorials/whats-new-in-node-10-dubnium)

Node version is set in node version manager [`.nvmrc`](https://github.com/creationix/nvm#nvmrc)

<!-- _Coding style convention ref optional, eg which linter to use_ -->

<!-- _Linting, github pre-push hook - optional_ -->

## Build

<!-- _How to run build_ -->

```
npm run build
```

## Tests

<!-- _How to carry out tests_ -->

_NA_

## Deployment

_NA_

TODO:

- [ ] add travis or github actions integration to deploy on commit to master when version number is increased.

<!-- _How to deploy the code/app into test/staging/production_ -->

## other

Other possible areas of improvement

- [x] add source [ folder only]
- [x] add destination [ folder only]
- [x] clone -> copies source to destination
- [x] checksum source
- [x] checksum destination
- [x] compare checksum source and destination
- [x] return checksum result ✅ or ❌
- [ ] support copy to multiple destinations
- [ ] travis or github action to rrun build
