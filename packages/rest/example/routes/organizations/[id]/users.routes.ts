import { Route } from "../../../../src/types";
import { users } from "../../../repository";

// GET /organizations/:id/users
export const GET: Route = (req, route) => {
  const id = Number(route.params.id);
  const orgUsers = users.filter((u) => u.organizationId == id);
  return Response.json(orgUsers);
};
