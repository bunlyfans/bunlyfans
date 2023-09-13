import { Log } from "@bunlyfans/log/scoped";
import { MatchedRoute } from "bun";
import {
  Middleware,
  PostMiddleware,
  PreMiddleware,
  ProcessContext,
  isPostMiddleware,
  isPreMiddleware,
} from "./middleware/middleware";
import { ErrorResponse, STATUS_CODE } from "./types";

export class RequestProcessor {
  private preMiddlewares: PreMiddleware[];
  private postMiddlewares: PostMiddleware[];

  constructor(middlewares: Middleware[]) {
    this.postMiddlewares = middlewares.filter(isPostMiddleware);
    this.preMiddlewares = middlewares.filter(isPreMiddleware);
  }

  async process(
    request: Request,
    route?: MatchedRoute | null
  ): Promise<Response> {
    const log = Log({
      scope: request.method === "DELETE" ? "DEL" : request.method,
    });

    const context = {
      log,
    };

    try {
      if (!route) {
        throw new ErrorResponse(STATUS_CODE.NOT_FOUND);
      }

      request = await this.processPreMiddlewares(request, context);

      const resolved = await import(route.filePath);
      const method = request.method.toUpperCase();
      const callback = resolved[method];

      if (!callback) {
        throw new ErrorResponse(STATUS_CODE.METHOD_NOT_ALLOWED);
      }

      let response = await callback(request, route);

      response = await this.processPostMiddlewares(request, response, context);

      return response;
    } catch (error) {
      // TODO: handle error based on its type
      // ...
      if (error instanceof ErrorResponse) {
        log.e(`${error.status}\t${await error.text()}`);
        return error;
      }

      log.e("Error processing:", error);

      return new ErrorResponse(500);
    }
  }

  private async processPreMiddlewares(
    request: Request,
    context: ProcessContext
  ): Promise<Request> {
    for (const middleware of this.preMiddlewares) {
      const result = await middleware.preProcess(request, context);
      request = result || request;
    }
    return request;
  }

  private async processPostMiddlewares(
    request: Request,
    response: Response,
    context: ProcessContext
  ): Promise<Response> {
    for (const middleware of this.postMiddlewares) {
      const result = await middleware.postProcess(request, response, context);
      response = result || response;
    }
    return response;
  }
}
