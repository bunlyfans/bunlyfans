# Bun-ly Fans

## Warning

All packages are built only for [Bun](https://bun.sh) environment. It will not work in NodeJS or Deno.

## Motivation

### #1. Keep dependencies minimal

All typical/known tools are based on NodeJS and there are tons of dependencies and dependencies of dependencies. **Bun** allows you to get rid of all node_modules hell, and use tool in a pure way.

![node_modules](assets/heaviest_objects.png)

### #2. 100% Bun

**Bun** has a great potential and extra-performant API. All packages within this project are built on top of **Bun** and you can use them in your projects, with 100% performance guarantee and 0% risk that some NodeJS dependency will be broken.

### #3. No NPM/NodeJS environment

With tools build for Bun and with Bun, you don't need to have NodeJS or NPM installed on your machine or CI or prod-server. Which means minimal build time, minimal deployment time, minimal server resources!

## Open for proposals & contribution

If you have an idea for a new package/tool/library, or you want to contribute to existing one, feel free to open an issue or a pull request!

**There are only 3 major rules:**

1. 🛠️ It must be built for Bun
2. 🧪 It must be tested with Bun
3. 🛫 It should have zero or minimal non-Bun dependencies

## Development

Install dependencies for all packages:

```bash
bun install
```

### Monorepo

Project has a monorepo structure. To run a package:

```bash
cd packages/rest
bun start
```

## Packages

- [`@bunlyfans/version`](./packages/version/README.md) - Version management, with monorepo support!
- [`@bunlyfans/rest`](./packages/rest/README.md) - HTTP framework to build REST APIs with Bun!
