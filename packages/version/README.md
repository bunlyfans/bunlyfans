# @bunlyfans/version

![Bun Version](https://img.shields.io/badge/bun-v1.0.0-blue)
![Version](https://img.shields.io/npm/v/@bunlyfans/version.svg)
![Build Status](https://img.shields.io/badge/build-passed-success)
![Test Coverage](https://img.shields.io/badge/coverage-75-orange)

Version management CLI for monorepo.

## Usage

```bash
bun x @bunlyfans/version major
```

Do not forget to add a shorthand to your package.json:

```json
"scripts": {
  "up": "bun x @bunlyfans/version"
}
```

Then you can use it like this:

```bash
bun up major
bun up minor
bun up patch
```

For monorepo (automatically detected if root package.json has workspaces):

```bash
bun up major --simultaneous # to update all packages
bun up minor --independent # to update each package version separately
bun up patch my-package # to update single package
```
