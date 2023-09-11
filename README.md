# **Bun**ly Fans

All packages are built only for [Bun](https://bun.sh). It will not work in NodeJS or Deno.

## Motivation

### #1. Keep dependencies minimal

All typical/known tools are based on NodeJS and there are tons of dependencies and dependencies of dependencies.

![node_modules](assets/heaviest_objects.png)

With **Bun** you just do not need it! We just need more Bun-focused tools!

### #2. 100% Bun

**Bun** has a great potential and extra-performant API. All packages within this project are built with **Bun** and for **Bun** and you can use them in your projects, with 100% performance guarantee and 0% risk that some NodeJS dependency will be broken.

### #3. No NPM/NodeJS environment

With tools build for Bun and with Bun, you don't need NodeJS or NPM installed on your machine or CI or prod-server. Which means minimal build time, minimal deployment time, minimal server resources!

## Open for proposals & contribution

If you have an idea for a new package/tool/library, or you want to contribute to existing one, feel free to open an issue or a pull request!

**There are only 3 main rules:**

1. 🛠️ It must be built for Bun
2. 🧪 It must be tested with Bun
3. 🛫 It should have zero or minimal non-Bun dependencies

## Development

Install dependencies for all packages:

```bash
bun install
```

### Monorepo

Project has a monorepo structure. So to run/build a package:

```bash
cd packages/rest
bun dev # not all packages have dev script
bun test
bun test:watch
```

## Packages

- [`@bunlyfans/version`](./packages/version/README.md) - Version management, with monorepo support! **[WIP]**
- [`@bunlyfans/log`](./packages/log/README.md) - Simple and colorful logger for your Bun project!
- [`@bunlyfans/rest`](./packages/rest/README.md) - HTTP framework to build REST APIs with Bun! **[WIP]**
