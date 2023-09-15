import { PreMiddleware, RequestContext, res } from "../../..";
import { findById, organizations } from "../../repository";

/**
 * A middleware that checks if the organization exists.
 */
export class OrgExistsMiddleware implements PreMiddleware {
  preProcess(context: RequestContext): void {
    const id = Number(context.route.params.id);
    const org = findById(organizations, id);
    if (!org) {
      throw res.notFound("Organization not found");
    }
  }
}
