import { PostMiddleware, PreMiddleware, ProcessContext } from "./middleware";

/**
 * A middleware that logs the request url before and response status when the request is processed.
 */
export class DebugMiddleware implements PreMiddleware, PostMiddleware {
  preProcess(
    request: Request,
    context: ProcessContext
  ): void | Request | Promise<void> | Promise<Request> {
    const path = this.getRelativeUrl(request);
    context.log.d(path);
  }

  postProcess(
    request: Request,
    response: Response,
    context: ProcessContext
  ): void | Promise<void> | Response | Promise<Response> {
    const path = this.getRelativeUrl(request);
    context.log.o(`${response.status} ${path}`);
  }

  private getRelativeUrl(request: Request): string {
    const url = new URL(request.url);
    const relativeUrl = url.pathname + (url.search || "");

    return relativeUrl;
  }
}
