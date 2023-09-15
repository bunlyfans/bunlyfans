import { PostMiddleware, PreMiddleware, RequestContext } from "./middleware";

/**
 * A middleware that logs the request url before and response status when the request is processed.
 */
export class DebugMiddleware implements PreMiddleware, PostMiddleware {
  preProcess(context: RequestContext): void {
    const path = this.getRelativeUrl(context.request);
    context.log.d(path);
  }

  postProcess(context: RequestContext, response: Response): void {
    const path = this.getRelativeUrl(context.request);
    if (response.ok) {
      context.log.o(`${response.status} ${path}`);
    } else {
      context.log.e(`${response.status} ${path}`);
    }
  }

  private getRelativeUrl(request: Request): string {
    const url = new URL(request.url);
    const relativeUrl = url.pathname + (url.search || "");

    return relativeUrl;
  }
}
