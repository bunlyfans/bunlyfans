import { Router, DebugMiddleware } from "../";

const router = new Router({
  dir: "/routes/",
  debug: true,
});

/**
 * This is a global middleware that will be applied to the whole project/router.
 */
router.register(new DebugMiddleware());

Bun.serve({
  fetch: router.handle,
  port: process.env.PORT || 3000,
});
