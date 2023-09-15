import { Param } from "../../../";
import { deleteItem, organizations, users } from "../../repository";
import { OrgExistsMiddleware } from "./org-exists.middleware";

/**
 * This is a module middleware that will be applied to all routes in this file.
 */
export const middlewares = [new OrgExistsMiddleware()];

// DELETE /organizations/[id]
export function DELETE(id: Param<number>) {
  deleteItem(organizations, id);
  users
    .filter((u) => u.organizationId == id)
    .forEach((u) => deleteItem(users, u.id));
  return new Response("Organization deleted");
}
