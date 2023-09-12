import { Router } from "../src/router";

const router = new Router({
  dir: "/routes/",
  debug: true,
});

Bun.serve({
  fetch: router.handle,
  port: process.env.PORT || 3000,
});
