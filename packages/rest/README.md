# @bunlyfans/rest

![Bun Version](https://img.shields.io/badge/bun-v1.0.0-blue)
![Version](https://img.shields.io/npm/v/@bunlyfans/rest.svg)
![Build Status](https://img.shields.io/badge/build-passed-success)
![Test Coverage](https://img.shields.io/badge/coverage-60-orange)

Use Bun so you can REST. 😴

- 🐰 100% Bun
- ⚡️ 100% TypeScript
- 🪄 100% magic
- 🛫 0 dependencies
- 💩🚫 0 bullshit

## Contribution appreciated! 🙏

If you have any ideas / thougts / feature requests or want to contribute - feel free to create an issue or pull request!

## Usage

See example directory for more details.

```bash
mkdir server
cd server
bun init
bun add @bunlyfans/rest
mkdir -p routes/users
```

Create routes file `[id].routes.ts` in this dir, so you will have folder directory:

```sh
- src/
  - routes/
    - users/
      - [id].routes.ts
  - index.ts
```

Add next content to `index.ts`:

```ts
import { Router, DebugMiddleware } from "@bunlyfans/rest";

const router = new Router({
  dir: "/routes/",
  debug: true, // to preview identified routes on app start/restart
});

router.register(new DebugMiddleware());

Bun.serve({
  fetch: router.handle,
  port: process.env.PORT || 3000,
});
```

Add next content to `routes/users/[id].routes.ts`:

```ts
import { JSON, Param } from "@bunlyfans/rest";

// This function will handle `GET /users/[id]` request
export function GET(id: Param<number>) { 
  // ..
  return Response.json('user ' + id);
}

export async function DELETE(id: Param<number>, user: JSON<unknown>) {
  // ..
  return new Response('User deleted');
}

export async function POST(user: JSON<User>) {
  // ..
  return Response.json(user, { status: 201 });
}
```

And run with `bun run index.ts`, now you can run `curl localhost:3000/users/1` and server will handle GET request

## Router

Main concept about router is that each entity is located in its own folder/file. Each folder can contain multiple files that will be used as endpoints. So File System path represents URL path.

Route handlers can be described **only** as Functions Declarations! So you can't use arrow functions or anonymous functions.

Usage of methods as names may be found as a bit weird, but it's done on purpose, so it will force you to split your routes according to REST principles.

If you want to create custom endpoint - create file `/routes/users/[id]/reset-password.routes.ts` and it will be available as `/users/[id]/reset-password`. Now create a handle with function in this file:

```ts
// Replace POST with GET, PUT, DELETE, etc. to use another method
export async function POST(id: Param<number>) { // Id will be automatically parsed
  // That is it! Just write your logic to reset password
}
```

Sometimes you may need index route, if folder for entity was already created and you do not want any params, then just use `routes.ts` filename.
**Note:** In future such routes may become deprecated or renamed.

### Supported argument sources

As you may noticed - arguments are parsed automatically by generic types. For now only fixed types are supported, but in future it will be possible to use custom types.

| Type | Description |
| --- | --- |
| `arg1 JSON<T>` | Body of request. Will be parsed to JSON. |
| `arg2 Param<T>` | Parameter extracted from request. Will be parsed to specified type, but default - fallback to `string`. **NOTE**: `arg2` is a name of the route param, so your path should look like `/entity/[arg2].routes.ts` or `/entity/[arg2]/custom.routes.ts`. |
| `arg3 Query<T>` | Argument will extract `arg3` from request query. |

If `T` is `number`, example `Param<number>` - it will be parsed as a number automatically.

If `T` is `boolean`, example `Query<boolean>` - it will be parsed as a number automatically.

## Response

Just use `Response.json(body)` to return JSON object, or `new Response('text')`. See Bun documentation for more details.

## Middleware

Create middleware by implementing `PreMiddleware` or `PostMiddleware` interface, or both.

```ts
export class DebugMiddleware implements PreMiddleware, PostMiddleware {
  preProcess(context: RequestContext): void | Promise<void> {
    // Context provides access to request, logger, matched route
  }

  postProcess(context: RequestContext, response: Response): void | Promise<void> | Response | Promise<Response> {
    // ...
    // You can modify or create new response, if nothing is returned - default response will be used
  }
}
```

### Global

It will be applied to all routes in the app/router.

```ts
router.register(new DebugMiddleware());
```

### Module

It will be applied to all methods in the router file from which it is exported.

```ts
export const middlewares = [new MyCustomMiddleware()];
```

### Local

It will be applied to specific method in the router file.

```ts
DELETE.middlewares = [new AllowFor([USER_ROLES.ADMIN])];
export async function DELETE(id: Param<number>, user: JSON<unknown>) {
```
