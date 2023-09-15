import { PreMiddleware, RequestContext, res } from "../../..";
import { findById, users } from "../../repository";

/**
 * A middleware that checks if the user exists.
 */
export class UserExistsMiddleware implements PreMiddleware {
  preProcess(context: RequestContext): void {
    const id = Number(context.route.params.id);
    const user = findById(users, id);
    if (!user) {
      throw res.notFound("User not found");
    }
  }
}
