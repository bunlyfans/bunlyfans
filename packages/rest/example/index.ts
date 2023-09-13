import { DebugMiddleware } from "../src/middleware/debug-middleware";
import { Router } from "../src/router";

const router = new Router({
  dir: "/routes/",
  debug: true,
});

router.register(new DebugMiddleware());

Bun.serve({
  fetch: router.handle,
  port: process.env.PORT || 3000,
});
