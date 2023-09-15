import { Log } from "@bunlyfans/log/scoped";
import { MatchedRoute } from "bun";
import { Argument, parseArgumentsFromFunction } from "./ast/code-parser";
import { resolveArgumentFromContext } from "./ast/resolver";
import { errorHandler } from "./error-handler";
import { res } from "./invalid-response";
import {
  Middleware,
  RequestContext,
  isPostMiddleware,
  isPreMiddleware,
} from "./middleware/middleware";

export class RequestProcessor {
  constructor(private middlewares: Middleware[]) {}

  async process(
    request: Request,
    route?: MatchedRoute | null
  ): Promise<Response> {
    const log = Log({
      scope: request.method === "DELETE" ? "DEL" : request.method,
    });

    try {
      if (!route) {
        throw res.notFound();
      }

      let context: RequestContext = {
        log,
        route,
        request,
      };

      const resolved = await import(route.filePath);
      const method = request.method.toUpperCase();
      const handler = resolved[method];
      const args: Argument[] =
        handler.args ||
        (await parseArgumentsFromFunction(route.filePath, handler, method));

      if (!handler.args) {
        handler.args = args;
      }

      const specificMiddlewares = handler?.middlewares || [];

      if (!handler) {
        throw res.methodNotAllowed();
      }

      const middlewares = [
        ...this.middlewares,
        ...(resolved.middlewares || []),
        ...specificMiddlewares,
      ];

      await this.processPreMiddlewares(middlewares, context);

      let resolvedArguments = await Promise.all(
        args.map((arg) => resolveArgumentFromContext(arg, context))
      );

      let response = await handler(...resolvedArguments);

      response = await this.processPostMiddlewares(
        middlewares,
        context,
        response
      );

      return response;
    } catch (error) {
      return await errorHandler(log, error);
    }
  }

  private async processPreMiddlewares(
    middlewares: Middleware[],
    context: RequestContext
  ): Promise<void> {
    for (const middleware of middlewares) {
      if (isPreMiddleware(middleware)) {
        await middleware.preProcess(context);
      }
    }
  }

  private async processPostMiddlewares(
    middlewares: Middleware[],
    context: RequestContext,
    response: Response
  ): Promise<Response> {
    for (const middleware of middlewares) {
      if (isPostMiddleware(middleware)) {
        const result = await middleware.postProcess(context, response);
        response = result || response;
      }
    }
    return response;
  }
}
