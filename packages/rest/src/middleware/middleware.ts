import { Log } from "@bunlyfans/log/scoped";

export type ProcessContext = {
  log: ReturnType<typeof Log>;
};

export interface PreMiddleware {
  preProcess(
    request: Request,
    context: ProcessContext
  ): void | Promise<void> | Request | Promise<Request>;
}

export interface PostMiddleware {
  postProcess(
    request: Request,
    response: Response,
    context: ProcessContext
  ): void | Promise<void> | Response | Promise<Response>;
}

export interface ErrorHandler {
  handle(
    request: Request,
    response: Response,
    context: ProcessContext
  ): void | Promise<void> | Response | Promise<Response>;
}

export type Middleware = PreMiddleware | PostMiddleware;

export function isPreMiddleware(
  instance: Middleware
): instance is PreMiddleware {
  return "preProcess" in instance;
}

export function isPostMiddleware(
  instance: Middleware
): instance is PostMiddleware {
  return "postProcess" in instance;
}
