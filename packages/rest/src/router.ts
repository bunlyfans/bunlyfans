import { Log } from "@bunlyfans/log/scoped";
import type { FileSystemRouter, Server } from "bun";
import path from "path";
import { Middleware } from "./middleware/middleware";
import { RequestProcessor } from "./request-processor";

interface Config {
  dir: string;

  /**
   * @default false
   */
  debug?: boolean;

  /**
   * Very usefull for local-dev environment. So hot-reload / watch will do its job when router is applied.
   * Also will validate that imported routes are not broken (from TS perspective).
   *
   * @default true
   */
  preload?: boolean;
}

const DOT_SUFFIX = ".routes";
const INDEX = "/routes";

export class Router {
  private log = Log({ scope: "Route" });

  private middlewares: Middleware[] = [];

  private fsRouter: FileSystemRouter;

  private get launchDir(): string {
    return path.dirname(Bun.main);
  }

  constructor(private config: Config) {
    this.config.preload = this.config.preload ?? true;
    this.fsRouter = new Bun.FileSystemRouter({
      dir: path.join(this.launchDir, this.config.dir),
      style: "nextjs",
      fileExtensions: [".ts"],
    });

    if (config.debug) {
      this.printRoutes();
    }

    if (this.config.preload) {
      this.preload();
    }
  }

  /**
   * Middlewares will be executed in the same order as they are registered.
   */
  register(middleware: Middleware) {
    this.middlewares.push(middleware);
  }

  handle = (request: Request, server: Server): Response | Promise<Response> => {
    return this.resolve(request);
  };

  private async resolve(request: Request): Promise<Response> {
    const url = new URL(request.url);

    let route = this.fsRouter.match(url.pathname + INDEX);
    if (!route) {
      route = this.fsRouter.match(url.pathname + DOT_SUFFIX);
    }

    const processor = new RequestProcessor(this.middlewares);
    const response = await processor.process(request, route);

    return response;
  }

  private printRoutes(): void {
    const routes = this.fsRouter.routes;
    const result = Object.fromEntries(
      Object.entries(routes)
        .filter(([key]) => key.endsWith(DOT_SUFFIX) || key.endsWith(INDEX))
        .map(([route, filePath]) => {
          return [
            route.replace(DOT_SUFFIX, "").replace(INDEX, ""),
            path.relative(this.launchDir, filePath),
          ];
        })
    );
    this.log.d(result);
  }

  private preload(): void {
    const routes = this.fsRouter.routes;
    for (const [key, route] of Object.entries(routes)) {
      if (key.endsWith(DOT_SUFFIX) || key.endsWith(INDEX)) {
        import(route);
      }
    }
  }
}
