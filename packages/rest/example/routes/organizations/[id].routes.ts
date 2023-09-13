import { ErrorResponse, Route } from "../../../src/types";
import { deleteItem, organizations, users } from "../../repository";

// DELETE /organizations/[id]
export const DELETE: Route = (req, route) => {
  const id = Number(route.params.id);
  const deleted = deleteItem(organizations, id);
  users
    .filter((u) => u.organizationId == id)
    .forEach((u) => deleteItem(users, u.id));
  if (!deleted) {
    // If you want to return 404 or other error code with message and/or body, just throw ErrorResponse
    throw new ErrorResponse(404, "Organization not found");
  }
  return new Response("Organization deleted");
};
