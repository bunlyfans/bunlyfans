import { Log } from "@bunlyfans/log/scoped";
import { MatchedRoute } from "bun";

export type RequestContext = {
  readonly log: ReturnType<typeof Log>;
  readonly request: Request;
  readonly route: MatchedRoute;
};

export interface PreMiddleware {
  preProcess(context: RequestContext): void | Promise<void>;
}

export interface PostMiddleware {
  postProcess(
    context: RequestContext,
    response: Response
  ): void | Promise<void> | Response | Promise<Response>;
}

export interface ErrorHandler {
  handle(
    context: RequestContext,
    response: Response
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
